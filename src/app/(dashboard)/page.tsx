import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Key, Shield, Network, AlertTriangle, CheckCircle } from 'lucide-react';
import { daysUntil, getExpiryStatus } from '@/lib/utils';

async function getStats(userId: string) {
  const [domains, providers, certificates, proxyHosts] = await Promise.all([
    prisma.domain.findMany({ where: { userId } }),
    prisma.provider.count({ where: { userId } }),
    prisma.certificate.findMany({ where: { userId } }),
    prisma.proxyHost.count({ where: { domain: { userId } } }),
  ]);

  const expiringDomains = domains.filter(d => {
    const days = daysUntil(d.expiresAt);
    return days !== null && days <= 30 && days > 0;
  });

  const expiringCerts = certificates.filter(c => {
    const days = daysUntil(c.expiresAt);
    return days !== null && days <= 14 && days > 0;
  });

  return {
    domainCount: domains.length,
    providerCount: providers,
    certificateCount: certificates.length,
    proxyHostCount: proxyHosts,
    expiringDomains,
    expiringCerts,
    recentDomains: domains.slice(0, 5),
  };
}

export default async function DashboardPage() {
  const session = await auth();
  const stats = await getStats(session!.user.id);

  const statCards = [
    { title: 'Domains', value: stats.domainCount, icon: Globe, color: 'text-blue-600' },
    { title: 'Providers', value: stats.providerCount, icon: Key, color: 'text-purple-600' },
    { title: 'Certificates', value: stats.certificateCount, icon: Shield, color: 'text-green-600' },
    { title: 'Proxy Hosts', value: stats.proxyHostCount, icon: Network, color: 'text-orange-600' },
  ];

  return (
    <>
      <Header title="Dashboard" description="Overview of your domain infrastructure" />
      
      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-semibold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-800 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Alerts */}
        {(stats.expiringDomains.length > 0 || stats.expiringCerts.length > 0) && (
          <Card className="border-yellow-200 dark:border-yellow-900/50 bg-yellow-50 dark:bg-yellow-900/10">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                <AlertTriangle className="h-5 w-5" />
                Expiring Soon
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {stats.expiringDomains.map((domain) => (
                <div key={domain.id} className="flex items-center justify-between py-2">
                  <span className="text-sm">{domain.name}</span>
                  <Badge variant="warning">
                    Domain expires in {daysUntil(domain.expiresAt)} days
                  </Badge>
                </div>
              ))}
              {stats.expiringCerts.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between py-2">
                  <span className="text-sm">{cert.domains}</span>
                  <Badge variant="warning">
                    Certificate expires in {daysUntil(cert.expiresAt)} days
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Quick Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Domains</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.recentDomains.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
                  No domains added yet. Add a provider to get started.
                </p>
              ) : (
                <div className="space-y-3">
                  {stats.recentDomains.map((domain) => (
                    <div key={domain.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <div className="flex items-center gap-3">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{domain.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {domain.expiresAt && (
                          <Badge variant={getExpiryStatus(daysUntil(domain.expiresAt)) === 'ok' ? 'success' : 'warning'}>
                            {daysUntil(domain.expiresAt)}d
                          </Badge>
                        )}
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Database</span>
                  <Badge variant="success">Connected</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Certificate Auto-Renewal</span>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">DynDNS Service</span>
                  <Badge variant="info">Standby</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
