# Domain Manager - Features & Screenshots

A beautiful, self-hosted domain management application inspired by Ubiquiti's clean, minimalist design.

## Current State

**Last Updated:** January 31, 2026

---

## Public Pages

### Landing Page
A modern, dark-themed landing page with feature highlights and call-to-action buttons.

![Landing Page](https://github.com/user-attachments/assets/6e9354e7-1677-48e2-801a-97f87d9bae62)

**Features:**
- ✅ Hero section with gradient background
- ✅ Feature cards highlighting key capabilities
- ✅ Benefits section with checkmarks
- ✅ Call-to-action section
- ✅ Responsive navigation
- ✅ Automatic redirect for authenticated users

---

### Login Page
Clean, centered login form with the application branding.

![Login Page](https://github.com/user-attachments/assets/8bab0784-d950-490d-bf3e-d6e7d5a0f55c)

**Features:**
- ✅ Email/password authentication
- ✅ Form validation
- ✅ Error messaging
- ✅ Link to registration

---

### Register Page
User registration form for new accounts.

**Features:**
- ✅ Name, email, password fields
- ✅ Password minimum length validation
- ✅ First user automatically becomes admin
- ✅ Link to login page

---

## Authenticated Pages

### Domains Management
Central hub for managing all your domains.

![Domains Page](https://github.com/user-attachments/assets/e6bba141-89c1-47b2-afd6-da3ea0807ce4)

**Features:**
- ✅ Domain list with provider info
- ✅ Expiry tracking with status badges
- ✅ SSL certificate indicators
- ✅ DynDNS status
- ✅ Empty state with helpful guidance
- ✅ Add Domain button

**Planned:**
- [ ] Domain detail view
- [ ] DNS record management
- [ ] Domain expiry notifications
- [ ] Bulk domain import

---

### Providers Configuration
Connect and manage DNS provider credentials.

![Providers Page](https://github.com/user-attachments/assets/faccc09a-9d2b-45bd-abed-6df908895440)

**Features:**
- ✅ Provider list with status
- ✅ Domain count per provider
- ✅ Supported providers reference
- ✅ Active/inactive status badges

**Planned:**
- [ ] Provider connection testing
- [ ] Automatic domain sync
- [ ] More provider integrations (Namecheap, Route53, etc.)

---

### Add Provider
Step-by-step provider configuration flow.

![Add Provider](https://github.com/user-attachments/assets/f78a67bb-cae5-422c-8584-ce8b17db7032)

**Features:**
- ✅ Provider selection cards
- ✅ Dynamic form based on provider
- ✅ Secure credential input
- ✅ Back navigation

**Supported Providers:**
- ✅ Cloudflare (Full Support)
- ✅ GoDaddy (DNS Only)
- 🔜 Namecheap (Coming Soon)
- 🔜 Crazy Domains (Coming Soon)

---

### SSL Certificates
Manage SSL/TLS certificates for your domains.

![Certificates Page](https://github.com/user-attachments/assets/c9e648da-fcba-46a1-bcc0-70d4efa0360c)

**Features:**
- ✅ Certificate list with expiry status
- ✅ Auto-renewal indicators
- ✅ Certificate provider info
- ✅ Status indicators (issued, pending, expired)

**Planned:**
- [ ] Let's Encrypt integration
- [ ] Automatic certificate renewal
- [ ] Certificate download
- [ ] Wildcard certificate support

---

### Proxy Hosts
Configure reverse proxy for your services.

![Proxy Hosts](https://github.com/user-attachments/assets/7fc30b0b-c540-4084-ad51-c39f7acb0cb1)

**Features:**
- ✅ Proxy host list with targets
- ✅ SSL/HTTP2/WebSocket indicators
- ✅ Active/disabled status
- ✅ Visual source → target mapping

**Planned:**
- [ ] Nginx Proxy Manager integration
- [ ] Custom configuration options
- [ ] Access lists
- [ ] Advanced SSL settings

---

### Settings
Account and application configuration.

![Settings Page](https://github.com/user-attachments/assets/74603e04-b647-4d63-b7fc-052bdd36b883)

**Features:**
- ✅ Profile management
- ✅ Password change form
- ✅ Notification preferences
- ✅ Database status
- ✅ Provider sync action
- ✅ Data export option

**Planned:**
- [ ] Email notification configuration
- [ ] Two-factor authentication
- [ ] API key management
- [ ] Backup/restore functionality

---

## Design System

### Ubiquiti-Inspired Design
- **Dark sidebar** with clean navigation
- **Light content area** for optimal readability
- **Consistent spacing** and typography
- **Status badges** with semantic colors
- **Card-based layouts** for content organization
- **Responsive design** with mobile support

### Color Palette
- **Primary:** Blue (#2563eb)
- **Success:** Green (#16a34a)
- **Warning:** Yellow (#ca8a04)
- **Error:** Red (#dc2626)
- **Sidebar:** Dark gray (#0a0a0a)
- **Content:** Light gray (#f9fafb)

---

## Technical Stack

| Component | Technology |
|-----------|------------|
| Framework | Next.js 16 (App Router) |
| Database | SQLite + Prisma |
| Auth | NextAuth.js v5 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Validation | Zod |

---

## Roadmap

### Phase 1: Core Infrastructure ✅
- [x] Authentication system
- [x] Database schema
- [x] UI component library
- [x] Responsive layout
- [x] Landing page

### Phase 2: Provider Integration 🚧
- [x] Provider CRUD operations
- [ ] Cloudflare API integration
- [ ] GoDaddy API integration
- [ ] Domain synchronization

### Phase 3: DNS Management
- [ ] DNS record CRUD
- [ ] Record types (A, AAAA, CNAME, MX, TXT)
- [ ] Proxied record support (Cloudflare)
- [ ] DynDNS updates

### Phase 4: SSL Certificates
- [ ] Let's Encrypt ACME integration
- [ ] Automatic renewal scheduler
- [ ] Certificate storage
- [ ] Multi-domain certificates

### Phase 5: Reverse Proxy
- [ ] Proxy host configuration
- [ ] Nginx config generation
- [ ] SSL termination
- [ ] WebSocket support

---

## Contributing

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see README.md)
4. Run migrations: `npx prisma db push`
5. Start development: `npm run dev`

---

*Last updated: January 31, 2026*
