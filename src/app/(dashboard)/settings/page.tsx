import { auth } from '@/lib/auth';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, Shield, Bell, Database, RefreshCw } from 'lucide-react';

export default async function SettingsPage() {
  const session = await auth();

  return (
    <>
      <Header title="Settings" description="Manage your account and application settings" />
      
      <div className="p-6 max-w-4xl space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
            <CardDescription>Your personal account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Name"
                defaultValue={session?.user?.name || ''}
                placeholder="Your name"
              />
              <Input
                label="Email"
                type="email"
                defaultValue={session?.user?.email || ''}
                disabled
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="info">{session?.user?.role}</Badge>
              <span className="text-sm text-gray-500">Account role</span>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Password and authentication settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
              />
              <div></div>
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
              />
              <Input
                label="Confirm Password"
                type="password"
                placeholder="••••••••"
              />
            </div>
            <Button>Update Password</Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure alerts and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <p className="font-medium">Domain Expiry Alerts</p>
                  <p className="text-sm text-gray-500">Get notified 30, 14, and 7 days before expiry</p>
                </div>
                <Button variant="secondary" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <p className="font-medium">Certificate Renewal Alerts</p>
                  <p className="text-sm text-gray-500">Get notified when certificates are renewed</p>
                </div>
                <Button variant="secondary" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">DynDNS IP Changes</p>
                  <p className="text-sm text-gray-500">Get notified when your IP address changes</p>
                </div>
                <Button variant="secondary" size="sm">Configure</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              System
            </CardTitle>
            <CardDescription>Application maintenance and data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <p className="font-medium">Database</p>
                  <p className="text-sm text-gray-500">SQLite • prisma/data/domain-management.db</p>
                </div>
                <Badge variant="success">Connected</Badge>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
                <div>
                  <p className="font-medium">Sync All Providers</p>
                  <p className="text-sm text-gray-500">Refresh domains and DNS records from all providers</p>
                </div>
                <Button variant="secondary" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Sync Now
                </Button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Export Data</p>
                  <p className="text-sm text-gray-500">Download all your data as JSON</p>
                </div>
                <Button variant="secondary" size="sm">Export</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
