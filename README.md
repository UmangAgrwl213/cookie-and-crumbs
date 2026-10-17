# Cookie & Crumbs

> Web based app for my sister's business — an artisanal bakery e-commerce platform crafted with modern web technologies.

Cookie & Crumbs is a full-featured, luxury e-commerce web application designed for an artisan bakery. It provides a seamless shopping experience for handcrafted cakes, morning pastries, cookies, and seasonal treats with robust order handling and secure checkout.

---

## ✨ Features

- **Artisanal Storefront**: Warm, luxury aesthetic tailored for handcrafted baked goods with responsive layouts and micro-interactions.
- **Product Catalog & Discovery**: Category browsing, dynamic product detail pages with variant selectors (sizes, flavors), customer reviews, and nutrition information.
- **Guest & Authenticated Cart**: Frictionless shopping with session-isolated guest carts via `httpOnly` cookies, automatically merged into authenticated accounts upon sign-in.
- **Secure Multi-Step Checkout**: Stripe Elements integration featuring server-side price verification and strict `Idempotency-Key` protections on order placement.
- **Account & Order History**: User profile dashboard powered by Clerk authentication to view past orders and order status.
- **Database Architecture**: PostgreSQL schema managed by Prisma ORM with relational models for Users, Products, Variants, Carts, Orders, and Reviews.
- **Idempotent Seeder**: Rich database seed script providing ready-to-test categories, products, and photography.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI Primitives, Lucide Icons, Framer Motion
- **Database & ORM**: PostgreSQL, [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [Clerk](https://clerk.com/)
- **Payments**: [Stripe](https://stripe.com/) (Stripe Elements & Payment Intents)
- **Media & Assets**: [Cloudinary](https://cloudinary.com/)
- **Search**: [Algolia](https://www.algolia.com/)
- **Email**: [Resend](https://resend.com/)
- **Validation & State**: Zod, React Hook Form, Zustand, TanStack Query

---

## 🚀 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v20+ recommended)
- [PostgreSQL](https://www.postgresql.org/) database (local instance or hosted e.g., Neon, Supabase)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/UmangAgrwl213/cookie-and-crumbs.git
cd cookie-and-crumbs
npm install
```

### 3. Environment Variables

Copy the example environment file and configure your credentials:

```bash
cp .env.example .env.local
```

Refer to `.env.example` and [`docs/LAUNCH.md`](docs/LAUNCH.md) for full configuration details of third-party keys (Clerk, Stripe, Cloudinary, Algolia, Resend).

### 4. Database Setup & Seeding

Deploy the initial migrations and run the idempotent database seed:

```bash
# Apply Prisma migrations
npm run db:deploy

# Seed sample categories, products, and variants
npm run db:seed
```

### 5. Running the Application

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the bakery storefront.

---

## 📁 Project Structure

```text
├── app/                  # Next.js App Router (pages, layouts, routes, API endpoints)
│   ├── (storefront)/     # About, blog, category, product, cart, checkout, account
│   └── api/v1/           # REST API endpoints (products, cart, orders, users)
├── components/           # Reusable UI component library (atomic structure)
│   ├── atoms/            # Primitives: buttons, badges, inputs, dialogs
│   ├── molecules/        # ProductCard, CartItemRow, CheckoutStepper
│   ├── organisms/        # MegaNav, CartDrawer, CheckoutForm, ProductGallery
│   └── layout/           # Header, Footer, MainLayout
├── docs/                 # Project documentation and launch checklist
│   └── LAUNCH.md         # Deployment readiness, external services, and blockers
├── lib/                  # Business logic, API clients, utilities, and stores
│   ├── schemas/          # Zod request validation schemas
│   ├── stores/           # Zustand state management
│   ├── prisma.ts         # Prisma client singleton
│   ├── stripe.ts         # Stripe payment helpers
│   ├── clerk.ts          # Authentication utilities
│   └── session.ts        # Guest cookie session manager
└── prisma/               # Prisma database schema, migrations, and seed script
    ├── schema.prisma     # Relational data models
    ├── migrations/       # SQL migrations
    └── seed.mjs          # Bakery catalog seeder
```

---

## 📋 Launch Checklist

For third-party configuration guides (Stripe webhooks, Clerk webhooks, Cloudinary upload folders, and Algolia indexing) and pre-launch blockers, consult [`docs/LAUNCH.md`](docs/LAUNCH.md).

---

## 📄 License

Private repository — All rights reserved.
