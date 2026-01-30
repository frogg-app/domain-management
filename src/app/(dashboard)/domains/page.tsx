import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Globe, ExternalLink, MoreVertical } from 'lucide-react';
import { formatDate, daysUntil, getExpiryStatus } from '@/lib/utils';
import Link from 'next/link';

async function getDomains(userId: string) {
  return prisma.domain.findMany({
    where: { userId },
    include: {
      provider: true,
      _count: {
        select: { dnsRecords: true, certificates: true, proxyHosts: true },
      },
    },
    orderBy: { name: 'asc' },
  });
}

export default async function DomainsPage() {
  const session = await auth();
  const domains = await getDomains(session!.user.id);

  return (
    <>
      <Header title="Domains" description="Manage your domains and DNS records" />
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {domains.length} domain{domains.length !== 1 ? 's' : ''} registered
            </p>
          </div>
          <Link href="/domains/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Domain
            </Button>
          </Link>
        </div>

        {domains.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Globe className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No domains yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center max-w-sm">
                Add a provider first, then import your domains or add them manually.
              </p>
              <Link href="/providers">
                <Button variant="secondary">Set up a provider</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {domains.map((domain) => {
              const expiryDays = daysUntil(domain.expiresAt);
              const expiryStatus = getExpiryStatus(expiryDays);
              
              return (
                <Card key={domain.id} className="hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                          <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                              {domain.name}
                            </h3>
                            <a
                              href={`https://${domain.name}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </a>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {domain.provider?.displayName || 'Manual'} • {domain._count.dnsRecords} records
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                          {domain._count.certificates > 0 && (
                            <Badge variant="success">SSL</Badge>
                          )}
                          {domain.dynDnsEnabled && (
                            <Badge variant="info">DynDNS</Badge>
                          )}
                          {domain.expiresAt && (
                            <Badge variant={expiryStatus === 'ok' ? 'default' : expiryStatus === 'warning' ? 'warning' : 'error'}>
                              {expiryStatus === 'expired' ? 'Expired' : `${expiryDays}d`}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                          Expires {formatDate(domain.expiresAt)}
                        </div>

                        <Link href={`/domains/${domain.id}`}>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
