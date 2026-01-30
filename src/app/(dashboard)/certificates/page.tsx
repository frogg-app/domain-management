import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Shield, RefreshCw, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { formatDate, daysUntil, getExpiryStatus } from '@/lib/utils';
import Link from 'next/link';

async function getCertificates(userId: string) {
  return prisma.certificate.findMany({
    where: { userId },
    include: { domain: true },
    orderBy: { expiresAt: 'asc' },
  });
}

export default async function CertificatesPage() {
  const session = await auth();
  const certificates = await getCertificates(session!.user.id);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'issued': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'expired': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <>
      <Header title="Certificates" description="SSL/TLS certificates for your domains" />
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {certificates.length} certificate{certificates.length !== 1 ? 's' : ''} managed
            </p>
          </div>
          <Link href="/certificates/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request Certificate
            </Button>
          </Link>
        </div>

        {certificates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Shield className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No certificates yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center max-w-sm">
                Request SSL certificates from Let&apos;s Encrypt for your domains.
              </p>
              <Link href="/certificates/new">
                <Button>Request your first certificate</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {certificates.map((cert) => {
              const expiryDays = daysUntil(cert.expiresAt);
              const expiryStatus = getExpiryStatus(expiryDays);
              
              return (
                <Card key={cert.id} className="hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                          <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {cert.domain.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {cert.provider} • {cert.domains}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(cert.status)}
                          <span className="text-sm capitalize">{cert.status}</span>
                        </div>
                        
                        {cert.autoRenew && (
                          <Badge variant="info">Auto-renew</Badge>
                        )}
                        
                        {cert.expiresAt && (
                          <Badge variant={expiryStatus === 'ok' ? 'success' : expiryStatus === 'warning' ? 'warning' : 'error'}>
                            {expiryStatus === 'expired' ? 'Expired' : `${expiryDays}d left`}
                          </Badge>
                        )}

                        <div className="text-right text-sm text-gray-500 dark:text-gray-400 w-28">
                          {formatDate(cert.expiresAt)}
                        </div>

                        <Button variant="ghost" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
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
