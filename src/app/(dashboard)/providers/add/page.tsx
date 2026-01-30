'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Cloud, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const providers = [
  {
    id: 'cloudflare',
    name: 'Cloudflare',
    description: 'Full DNS management, DDoS protection, and more',
    fields: [
      { name: 'apiKey', label: 'API Token', type: 'password', placeholder: 'Your Cloudflare API token' },
    ],
  },
  {
    id: 'godaddy',
    name: 'GoDaddy',
    description: 'Domain registration and DNS management',
    fields: [
      { name: 'apiKey', label: 'API Key', type: 'password', placeholder: 'Your GoDaddy API key' },
      { name: 'apiSecret', label: 'API Secret', type: 'password', placeholder: 'Your GoDaddy API secret' },
    ],
  },
];

export default function AddProviderPage() {
  const router = useRouter();
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const provider = providers.find(p => p.id === selectedProvider);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: selectedProvider,
      displayName: formData.get('displayName'),
      apiKey: formData.get('apiKey'),
      apiSecret: formData.get('apiSecret'),
    };

    try {
      const res = await fetch('/api/providers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Failed to add provider');
      }

      router.push('/providers');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  }

  return (
    <>
      <Header title="Add Provider" description="Connect a new domain registrar or DNS provider" />
      
      <div className="p-6 max-w-2xl">
        <Link href="/providers" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Providers
        </Link>

        {!selectedProvider ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Select a Provider</h2>
            <div className="grid gap-4">
              {providers.map((p) => (
                <Card 
                  key={p.id}
                  className="cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => setSelectedProvider(p.id)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800">
                      <Cloud className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{p.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{p.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Configure {provider?.name}</CardTitle>
              <CardDescription>Enter your API credentials to connect this provider</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-600 dark:text-red-400">
                    {error}
                  </div>
                )}
                
                <Input
                  name="displayName"
                  label="Display Name"
                  placeholder={`My ${provider?.name} Account`}
                  required
                />
                
                {provider?.fields.map((field) => (
                  <Input
                    key={field.name}
                    name={field.name}
                    type={field.type}
                    label={field.label}
                    placeholder={field.placeholder}
                    required
                  />
                ))}
                
                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setSelectedProvider(null)}>
                    Back
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Connecting...' : 'Connect Provider'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
