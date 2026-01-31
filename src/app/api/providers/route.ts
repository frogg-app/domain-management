import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { encrypt } from '@/lib/crypto';
import { z } from 'zod';
import { CloudflareProvider } from '@/lib/providers/cloudflare';

const providerSchema = z.object({
  name: z.enum(['cloudflare', 'godaddy', 'namecheap', 'crazydomains']),
  displayName: z.string().transform(s => s.trim()).pipe(z.string().min(1)),
  apiKey: z.string().transform(s => s.trim()).pipe(z.string().min(1)),
  apiSecret: z.string().transform(s => s.trim()).pipe(z.string().min(1)).optional(),
  accountId: z.string().transform(s => s.trim()).pipe(z.string().min(1)).optional(),
});

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const providers = await prisma.provider.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      name: true,
      displayName: true,
      isActive: true,
      createdAt: true,
      _count: { select: { domains: true } },
    },
  });

  return NextResponse.json(providers);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = providerSchema.parse(body);

    // Verify credentials work
    if (data.name === 'cloudflare') {
      const encryptedKey = encrypt(data.apiKey);
      const cf = new CloudflareProvider(encryptedKey);
      const valid = await cf.verifyToken();
      if (!valid) {
        return NextResponse.json(
          { error: 'Invalid Cloudflare API token' },
          { status: 400 }
        );
      }
    }

    // Check for existing provider
    const existing = await prisma.provider.findUnique({
      where: {
        userId_name: {
          userId: session.user.id,
          name: data.name,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Provider already configured' },
        { status: 400 }
      );
    }

    // Create provider with encrypted credentials
    const provider = await prisma.provider.create({
      data: {
        userId: session.user.id,
        name: data.name,
        displayName: data.displayName,
        apiKey: encrypt(data.apiKey),
        apiSecret: data.apiSecret ? encrypt(data.apiSecret) : null,
        accountId: data.accountId,
      },
    });

    return NextResponse.json({
      id: provider.id,
      name: provider.name,
      displayName: provider.displayName,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }
    console.error('Provider creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create provider' },
      { status: 500 }
    );
  }
}
