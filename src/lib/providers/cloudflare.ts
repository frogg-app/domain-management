import { decrypt } from '@/lib/crypto';

interface CloudflareZone {
  id: string;
  name: string;
  status: string;
  name_servers: string[];
}

interface CloudflareDnsRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  ttl: number;
  priority?: number;
  proxied: boolean;
}

interface CloudflareResponse<T> {
  success: boolean;
  errors: { message: string }[];
  result: T;
}

export class CloudflareProvider {
  private apiToken: string;
  private baseUrl = 'https://api.cloudflare.com/client/v4';

  constructor(encryptedToken: string) {
    this.apiToken = decrypt(encryptedToken);
  }

  /**
   * Create a CloudflareProvider with a raw (unencrypted) token.
   * Use this for token verification before storing.
   */
  static withRawToken(token: string): CloudflareProvider {
    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      throw new Error('API token is required');
    }
    const provider = Object.create(CloudflareProvider.prototype);
    provider.apiToken = token;
    provider.baseUrl = 'https://api.cloudflare.com/client/v4';
    return provider;
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    let data: CloudflareResponse<T>;
    try {
      data = await response.json();
    } catch (parseError) {
      const parseMessage = parseError instanceof Error ? parseError.message : 'Unknown parse error';
      throw new Error(`Cloudflare API returned invalid JSON (status: ${response.status}): ${parseMessage}`);
    }

    if (!data.success) {
      throw new Error(data.errors?.[0]?.message || 'Cloudflare API error');
    }

    return data.result;
  }

  async verifyToken(): Promise<{ valid: boolean; error?: string }> {
    try {
      await this.fetch('/user/tokens/verify');
      return { valid: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { valid: false, error: errorMessage };
    }
  }

  async listZones(): Promise<CloudflareZone[]> {
    return this.fetch<CloudflareZone[]>('/zones?per_page=50');
  }

  async getZone(zoneId: string): Promise<CloudflareZone> {
    return this.fetch<CloudflareZone>(`/zones/${zoneId}`);
  }

  async listDnsRecords(zoneId: string): Promise<CloudflareDnsRecord[]> {
    return this.fetch<CloudflareDnsRecord[]>(`/zones/${zoneId}/dns_records?per_page=100`);
  }

  async createDnsRecord(
    zoneId: string,
    record: {
      type: string;
      name: string;
      content: string;
      ttl?: number;
      priority?: number;
      proxied?: boolean;
    }
  ): Promise<CloudflareDnsRecord> {
    return this.fetch<CloudflareDnsRecord>(`/zones/${zoneId}/dns_records`, {
      method: 'POST',
      body: JSON.stringify({
        type: record.type,
        name: record.name,
        content: record.content,
        ttl: record.ttl || 1, // 1 = auto
        priority: record.priority,
        proxied: record.proxied ?? false,
      }),
    });
  }

  async updateDnsRecord(
    zoneId: string,
    recordId: string,
    record: {
      type: string;
      name: string;
      content: string;
      ttl?: number;
      priority?: number;
      proxied?: boolean;
    }
  ): Promise<CloudflareDnsRecord> {
    return this.fetch<CloudflareDnsRecord>(`/zones/${zoneId}/dns_records/${recordId}`, {
      method: 'PUT',
      body: JSON.stringify({
        type: record.type,
        name: record.name,
        content: record.content,
        ttl: record.ttl || 1,
        priority: record.priority,
        proxied: record.proxied ?? false,
      }),
    });
  }

  async deleteDnsRecord(zoneId: string, recordId: string): Promise<void> {
    await this.fetch(`/zones/${zoneId}/dns_records/${recordId}`, {
      method: 'DELETE',
    });
  }

  // DynDNS helper - update A record with current IP
  async updateDynDns(zoneId: string, recordId: string, subdomain: string, ip: string): Promise<void> {
    await this.updateDnsRecord(zoneId, recordId, {
      type: 'A',
      name: subdomain,
      content: ip,
      proxied: false,
    });
  }
}

// Domain availability check (uses different API)
export async function checkDomainAvailability(_domain: string): Promise<{
  available: boolean;
  premium: boolean;
  price?: number;
}> {
  // Cloudflare doesn't have a public domain availability API
  // This would need to use registrar-specific APIs
  // For now, return a placeholder
  return {
    available: false,
    premium: false,
  };
}
