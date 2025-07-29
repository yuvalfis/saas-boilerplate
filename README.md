# SaaS Boilerplate

A modern, full-stack SaaS boilerplate built with **Clerk authentication**, **MongoDB**, **NestJS**, and **Next.js** in a **Turborepo** monorepo structure.

## 🚀 Features

- **Authentication**: Clerk integration with user and organization management
- **Database**: MongoDB with Mongoose ODM
- **Backend**: NestJS with TypeScript, following repository pattern
- **Frontend**: Next.js 13+ with App Router and Tailwind CSS
- **Monorepo**: Turborepo for efficient development and builds
- **Type Safety**: Shared TypeScript types between frontend and backend
- **Real-time Sync**: Webhook integration to sync Clerk data with MongoDB

## 📁 Project Structure

```
saas-boilerplate/
├── packages/
│   ├── frontend/          # Next.js frontend application
│   ├── backend/           # NestJS backend services
│   └── shared-lib/        # Shared TypeScript types and utilities
├── package.json           # Root package.json with workspace configuration
├── turbo.json            # Turborepo configuration
└── README.md
```

## 🛠 Tech Stack

- **Frontend**: Next.js 13+, React 18, Tailwind CSS, TypeScript
- **Backend**: NestJS, MongoDB, Mongoose, TypeScript
- **Authentication**: Clerk
- **Monorepo**: Turborepo
- **UI Components**: Headless UI, Heroicons
- **Validation**: Class Validator, Class Transformer

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or cloud)
- Clerk account

### 1. Clone and Install

```bash
git clone <repository-url>
cd saas-boilerplate
npm install
```

### 2. Environment Setup

#### Backend Configuration

```bash
cd packages/backend
cp .env.example .env
```

Update `packages/backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/saas-boilerplate
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
PORT=3001
FRONTEND_URL=http://localhost:3000
```

#### Frontend Configuration

```bash
cd packages/frontend
cp .env.local.example .env.local
```

Update `packages/frontend/.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Clerk Setup

1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Enable organizations in your Clerk dashboard
3. Set up webhooks pointing to `http://localhost:3001/webhooks/clerk`
4. Copy your publishable key, secret key, and webhook secret

### 4. Start Development

```bash
# Install dependencies
npm install

# Start all services
npm run dev
```

This will start:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Shared lib: TypeScript compilation in watch mode

## 📋 Available Scripts

```bash
# Development
npm run dev          # Start all packages in development mode
npm run build        # Build all packages
npm run lint         # Lint all packages
npm run clean        # Clean all build artifacts

# Individual packages
cd packages/frontend && npm run dev    # Frontend only
cd packages/backend && npm run dev     # Backend only
```

## 🏗 Architecture

### Backend Architecture

The backend is simplified to only handle data synchronization via webhooks:

```
packages/backend/src/
├── modules/
│   ├── user/
│   │   ├── user.schema.ts      # MongoDB schema
│   │   ├── user.repository.ts  # Data access layer
│   │   └── user.module.ts      # Module definition
│   ├── organization/           # Organization module (schema + repository)
│   └── webhook/               # Clerk webhook handling
├── app.module.ts              # Root module
└── main.ts                    # Application entry point
```

### Simplified Architecture

The application uses a simplified architecture focused on data sync:

- **Schemas**: MongoDB models with Mongoose for data persistence
- **Repositories**: Data access layer for webhook-based synchronization
- **Webhook Service**: Handles Clerk events and syncs data to MongoDB
- **No API Controllers**: All user/organization operations handled by Clerk directly

### Frontend Architecture

```
packages/frontend/src/
├── app/
│   ├── dashboard/            # Protected dashboard routes
│   ├── sign-in/             # Authentication pages
│   ├── sign-up/
│   ├── layout.tsx           # Root layout with Clerk provider
│   └── page.tsx             # Landing page
└── components/              # Reusable React components
```

## 🔐 Authentication & Authorization

### User Management

- Automatic user creation via Clerk webhooks
- Profile management and settings
- Email verification and password reset

### Organization Management

- Multi-tenant organization support
- Organization switching
- Member management with roles (admin/member)
- Automatic sync with Clerk organizations

### Webhook Integration

The application automatically syncs with Clerk via webhooks for:

- User creation, updates, and deletion
- Organization creation, updates, and deletion
- Organization membership changes

## 🗄 Database Schema

### User Schema

```typescript
{
  clerkId: string;           // Clerk user ID
  email: string;             // User email
  firstName: string;         // First name
  lastName: string;          // Last name
  profileImageUrl?: string;  // Profile image
  organizationIds: ObjectId[]; // Associated organizations
  currentOrganizationId?: ObjectId; // Active organization
  createdAt: Date;
  updatedAt: Date;
}
```

### Organization Schema

```typescript
{
  clerkId: string;           // Clerk organization ID
  name: string;              // Organization name
  slug: string;              // URL-friendly identifier
  logoUrl?: string;          // Organization logo
  memberIds: ObjectId[];     // Member user IDs
  adminIds: ObjectId[];      // Admin user IDs
  createdAt: Date;
  updatedAt: Date;
}
```

## 🌐 API Endpoints

The backend only exposes webhook endpoints since all user and organization management is handled directly by Clerk:

### Webhook Endpoints

- `POST /webhooks/clerk` - Clerk webhook handler

## 🎨 UI Components

The frontend uses Clerk's built-in components for all authentication and organization management:

- **DashboardNav**: Navigation with Clerk's OrganizationSwitcher and UserButton
- **OrganizationProfile**: Full organization management interface
- **UserProfile**: Complete user profile management
- **CreateOrganization**: Organization creation form
- **SignIn/SignUp**: Authentication pages

## 🔧 Development

### Adding New Features

1. **Backend Module**: Follow the established pattern

   ```bash
   mkdir packages/backend/src/modules/your-feature
   # Create schema, repository, service, controller, module
   ```

2. **Frontend Components**: Add to `packages/frontend/src/components/`

3. **Shared Types**: Add to `packages/shared-lib/src/types/`

### Database Operations

Always use the repository pattern:

```typescript
// ✅ Correct
await this.userRepository.findById(id);

// ❌ Incorrect - never access schema directly
await this.userModel.findById(id);
```

## 🚀 Deployment

### Backend Deployment

1. Build the application: `npm run build`
2. Set environment variables
3. Deploy to your preferred platform (Vercel, Railway, etc.)

### Frontend Deployment

1. Build the application: `npm run build`
2. Set environment variables
3. Deploy to Vercel, Netlify, or similar

### Environment Variables for Production

Update your environment variables for production URLs and credentials.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the established patterns
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For questions and support:

- Check the [documentation](docs/)
- Open an issue on GitHub
- Review the Clerk documentation for authentication setup

---

Built with ❤️ using modern web technologies.
