import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Key, Cloud, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

const providerLogos: Record<string, { icon: typeof Cloud; color: string }> = {
  cloudflare: { icon: Cloud, color: 'text-orange-500' },
  godaddy: { icon: Cloud, color: 'text-green-600' },
  namecheap: { icon: Cloud, color: 'text-red-500' },
  crazydomains: { icon: Cloud, color: 'text-purple-600' },
  route53: { icon: Cloud, color: 'text-yellow-600' },
};

async function getProviders(userId: string) {
  return prisma.provider.findMany({
    where: { userId },
    include: {
      _count: {
        select: { domains: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function ProvidersPage() {
  const session = await auth();
  const providers = await getProviders(session!.user.id);

  return (
    <>
      <Header title="Providers" description="Manage your domain registrar and DNS provider credentials" />
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {providers.length} provider{providers.length !== 1 ? 's' : ''} configured
            </p>
          </div>
          <Link href="/providers/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Provider
            </Button>
          </Link>
        </div>

        {providers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Key className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No providers configured
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center max-w-sm">
                Connect your domain registrar or DNS provider to start managing domains.
              </p>
              <Link href="/providers/add">
                <Button>Add your first provider</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider) => {
              const logo = providerLogos[provider.name] || { icon: Cloud, color: 'text-gray-500' };
              const Icon = logo.icon;
              
              return (
                <Card key={provider.id} className="hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-800 ${logo.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      {provider.isActive ? (
                        <Badge variant="success" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="error" className="flex items-center gap-1">
                          <XCircle className="h-3 w-3" />
                          Inactive
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      {provider.displayName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize mb-4">
                      {provider.name}
                    </p>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {provider._count.domains} domain{provider._count.domains !== 1 ? 's' : ''}
                      </span>
                      <Link href={`/providers/${provider.id}`}>
                        <Button variant="ghost" size="sm">Configure</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Supported Providers Info */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Supported Providers
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Cloudflare', status: 'Full Support' },
                { name: 'GoDaddy', status: 'DNS Only' },
                { name: 'Namecheap', status: 'Coming Soon' },
                { name: 'Crazy Domains', status: 'Coming Soon' },
              ].map((p) => (
                <div key={p.name} className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{p.name}</span>
                  <Badge variant={p.status === 'Full Support' ? 'success' : p.status === 'DNS Only' ? 'info' : 'default'} className="text-xs">
                    {p.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
