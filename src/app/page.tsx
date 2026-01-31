import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ServerCog, Globe, Shield, Network, Key, ArrowRight, Check } from "lucide-react";

export default async function Home() {
  const session = await auth();

  // If user is already logged in, redirect to dashboard
  if (session) {
    redirect("/domains");
  }

  const features = [
    {
      icon: Globe,
      title: "Domain Management",
      description: "Manage all your domains from one centralized dashboard with expiry tracking."
    },
    {
      icon: Key,
      title: "Multi-Provider Support",
      description: "Connect Cloudflare, GoDaddy, and more. Securely store API credentials."
    },
    {
      icon: Shield,
      title: "SSL Certificates",
      description: "Automatic Let's Encrypt certificate issuance and renewal."
    },
    {
      icon: Network,
      title: "Reverse Proxy",
      description: "Configure proxy hosts for your services with SSL support."
    },
  ];

  const benefits = [
    "Self-hosted & privacy-focused",
    "Clean, modern interface",
    "Real-time DNS management",
    "Automatic certificate renewal",
    "Dynamic DNS support",
    "Secure credential storage"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50 bg-gray-900/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                <ServerCog className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">Domain Manager</span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        </div>
        
        <div className="relative mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Self-Hosted
            <span className="block text-blue-500">Domain Management</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A beautiful, minimalist application for managing your domains, DNS records, SSL certificates, and reverse proxy configurations.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="group flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 transition-all"
            >
              Get Started
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-800/50 px-6 py-3 text-base font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">Everything You Need</h2>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto">
              Powerful features for complete domain infrastructure management.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-2xl border border-gray-800 bg-gray-900/50 p-8 hover:border-gray-700 hover:bg-gray-800/50 transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 text-blue-500 mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 border-t border-gray-800/50">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Why Choose Domain Manager?</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-3 text-gray-300">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
                {benefit}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-800/50 to-gray-900/50 p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-400 mb-8">
              Create your account and start managing your domains in minutes.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Create Free Account
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-8 px-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <ServerCog className="h-5 w-5" />
            <span className="text-sm">Domain Manager</span>
          </div>
          <p className="text-sm text-gray-500">
            Self-hosted domain management
          </p>
        </div>
      </footer>
    </div>
  );
}
