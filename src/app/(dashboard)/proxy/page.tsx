import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Network, ArrowRight, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

async function getProxyHosts(userId: string) {
  return prisma.proxyHost.findMany({
    where: { domain: { userId } },
    include: { domain: true },
    orderBy: { createdAt: 'desc' },
  });
}

export default async function ProxyPage() {
  const session = await auth();
  const proxyHosts = await getProxyHosts(session!.user.id);

  return (
    <>
      <Header title="Proxy Hosts" description="Configure reverse proxy for your services" />
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {proxyHosts.length} proxy host{proxyHosts.length !== 1 ? 's' : ''} configured
            </p>
          </div>
          <Link href="/proxy/add">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Proxy Host
            </Button>
          </Link>
        </div>

        {proxyHosts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Network className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No proxy hosts configured
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center max-w-sm">
                Create reverse proxy entries to route traffic to your services.
              </p>
              <Link href="/proxy/add">
                <Button>Add your first proxy host</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {proxyHosts.map((host) => {
              const fullDomain = host.subdomain === '@' 
                ? host.domain.name 
                : `${host.subdomain}.${host.domain.name}`;
              
              return (
                <Card key={host.id} className="hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                          <Network className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="flex items-center gap-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                              {fullDomain}
                            </h3>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-400" />
                          <div className="font-mono text-sm bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {host.targetHost}:{host.targetPort}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {host.ssl && (
                          <Badge variant="success" className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            SSL
                          </Badge>
                        )}
                        {host.http2 && (
                          <Badge variant="info" className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            HTTP/2
                          </Badge>
                        )}
                        {host.websockets && (
                          <Badge variant="default">WS</Badge>
                        )}
                        <Badge variant={host.isActive ? 'success' : 'error'}>
                          {host.isActive ? 'Active' : 'Disabled'}
                        </Badge>

                        <Link href={`/proxy/${host.id}`}>
                          <Button variant="ghost" size="sm">Edit</Button>
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
