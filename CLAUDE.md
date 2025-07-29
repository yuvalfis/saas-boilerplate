# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Install dependencies for all packages
npm install

# Start all services in development mode (frontend + backend + shared-lib)
npm run dev

# Build all packages
npm run build

# Run linting across all packages
npm run lint

# Run tests across all packages
npm run test

# Clean build artifacts
npm run clean
```

### Package-specific commands
```bash
# Frontend (Next.js)
cd packages/frontend
npm run dev        # Start development server on port 3000
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint

# Backend (NestJS)
cd packages/backend
npm run dev        # Start with hot reload on port 3001
npm run build      # Build for production
npm run start:prod # Start production server
npm run test       # Run unit tests
npm run test:e2e   # Run e2e tests
```

## Architecture

This is a Turborepo monorepo SaaS boilerplate with three main packages:

### Frontend (packages/frontend)
- **Framework**: Next.js 15 with App Router
- **Authentication**: Clerk (pre-built components)
- **Styling**: Tailwind CSS
- **Protected Routes**: Middleware protects `/dashboard/*` routes
- **Key Components**:
  - `DashboardNav`: Navigation with Clerk's OrganizationSwitcher and UserButton
  - All user/organization management handled by Clerk's built-in components

### Backend (packages/backend)
- **Framework**: NestJS with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Purpose**: Data synchronization via Clerk webhooks only
- **No API Controllers**: All user operations handled directly by Clerk
- **Modules**:
  - `UserModule`: User schema and repository for webhook sync
  - `OrganizationModule`: Organization schema and repository
  - `ClerkModule`: Webhook handler that processes all Clerk events

### Shared Library (packages/shared-lib)
- TypeScript types shared between frontend and backend
- User and Organization interfaces

## Data Flow

1. **Authentication**: All auth operations go directly through Clerk (no backend involvement)
2. **Data Sync**: Clerk webhooks → Backend webhook handler → MongoDB
3. **Frontend**: Uses Clerk SDK directly for all user/organization data and operations

## Webhook Events Handled

The backend synchronizes the following Clerk events to MongoDB:
- User: created, updated, deleted
- Organization: created, updated, deleted  
- OrganizationMembership: created, updated, deleted
- OrganizationInvitation: created, accepted, revoked

## Authentication Setup

This project uses **Clerk** for authentication with webhook-based data synchronization to MongoDB.

📖 **Complete Setup Guide**: See [CLERK_SETUP.md](./CLERK_SETUP.md) for detailed instructions including:
- Clerk account creation and API keys
- Environment variable configuration  
- ngrok setup for local webhook development
- MongoDB connection setup
- Step-by-step development workflow
- Troubleshooting guide

### Quick Start

1. **Setup Guide**: Follow [CLERK_SETUP.md](./CLERK_SETUP.md) for complete instructions
2. **Environment Files**: Create `.env.local` (frontend) and `.env` (backend) with your keys
3. **Start Development**: Run `npm run dev` and configure webhooks with ngrok

### Required Environment Variables

**Frontend (`.env.local`)**:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Backend (`.env`)**:
```bash
MONGODB_URI=mongodb://localhost:27017/saas-boilerplate
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## Repository Pattern

Backend uses repository pattern for data access:
- Never access Mongoose models directly in services
- Always use repository methods (e.g., `userRepository.findByClerkId()`)
- Repositories handle all database operations and error handling

---

# File Structure & Organization Guide

## Project Structure Overview

```
saas-boilerplate/
├── packages/
│   ├── frontend/           # Next.js 15 App Router application
│   ├── backend/           # NestJS API server
│   └── shared-lib/        # Shared TypeScript types
├── turbo.json            # Turborepo configuration
├── package.json          # Root workspace configuration
└── CLAUDE.md            # This documentation file
```

## Package Structure Patterns

### Frontend (Next.js App Router)
```
packages/frontend/
├── src/
│   ├── app/                      # App Router pages & layouts
│   │   ├── (auth)/              # Route groups for auth pages
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx
│   │   │   └── sign-up/[[...sign-up]]/page.tsx
│   │   ├── dashboard/           # Protected dashboard routes
│   │   │   ├── layout.tsx       # Dashboard layout with nav
│   │   │   ├── page.tsx         # Dashboard home
│   │   │   ├── organizations/   # Org management
│   │   │   │   └── [[...rest]]/page.tsx  # Catch-all for Clerk
│   │   │   └── settings/        # User settings
│   │   │       └── [[...rest]]/page.tsx  # Catch-all for Clerk
│   │   ├── layout.tsx           # Root layout with providers
│   │   ├── page.tsx             # Landing page
│   │   └── globals.css          # Global styles
│   ├── components/              # Reusable UI components
│   │   ├── DashboardNav.tsx     # Navigation component
│   │   └── examples/            # Example components
│   ├── hooks/                   # Custom React hooks
│   │   └── use-current-user.ts  # User data fetching hook
│   ├── lib/                     # Utility libraries
│   │   └── api/                 # API client setup
│   │       ├── client.ts        # Axios configuration
│   │       └── endpoints/       # API endpoint functions
│   ├── providers/               # React context providers
│   │   └── api-provider.tsx     # API client provider
│   └── middleware.ts            # Next.js middleware for auth
├── next.config.js               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
└── tsconfig.json                # TypeScript configuration
```

### Backend (NestJS)
```
packages/backend/
├── src/
│   ├── modules/                 # Feature modules
│   │   ├── auth/               # Authentication module
│   │   │   ├── auth.module.ts  # Module definition
│   │   │   ├── auth.service.ts # Auth business logic
│   │   │   ├── decorators/     # Custom decorators
│   │   │   │   └── current-user.decorator.ts
│   │   │   └── guards/         # Auth guards
│   │   │       └── clerk-auth.guard.ts
│   │   ├── clerk/              # Clerk webhook handling
│   │   │   ├── clerk.controller.ts  # Webhook endpoints
│   │   │   ├── clerk.service.ts     # Webhook processing
│   │   │   └── clerk.module.ts      # Module definition
│   │   ├── logger/             # Logging infrastructure
│   │   │   ├── logger.module.ts
│   │   │   ├── logger.factory.ts
│   │   │   ├── enhanced-logger.service.ts
│   │   │   └── index.ts        # Barrel export
│   │   ├── user/               # User management
│   │   │   ├── db/             # Database layer
│   │   │   │   ├── user.schema.ts    # Mongoose schema
│   │   │   │   └── user.repository.ts # Data access layer
│   │   │   ├── user.controller.ts    # REST endpoints
│   │   │   └── user.module.ts        # Module definition
│   │   └── organization/       # Organization management
│   │       ├── db/
│   │       │   ├── organization.schema.ts
│   │       │   └── organization.repository.ts
│   │       └── organization.module.ts
│   ├── app.module.ts           # Root application module
│   └── main.ts                 # Application bootstrap
├── nest-cli.json               # Nest CLI configuration
├── eslint.config.js            # ESLint configuration
└── tsconfig.json               # TypeScript configuration
```

### Shared Library
```
packages/shared-lib/
├── src/
│   ├── types/                  # Shared TypeScript types
│   │   ├── api/               # API-specific types
│   │   │   ├── index.ts       # Barrel export
│   │   │   └── user-api.types.ts  # User API types
│   │   ├── api.types.ts       # General API types
│   │   ├── user.types.ts      # User entity types
│   │   └── organization.types.ts  # Organization types
│   └── index.ts               # Main barrel export
└── tsconfig.json              # TypeScript configuration
```

## Naming Conventions

### Files & Directories
- **Components**: PascalCase (e.g., `DashboardNav.tsx`, `UserProfile.tsx`)
- **Pages**: kebab-case for directories, `page.tsx` for files (App Router convention)
- **Hooks**: camelCase with `use` prefix (e.g., `use-current-user.ts`)
- **Services**: camelCase with `.service.ts` suffix (e.g., `auth.service.ts`)
- **Modules**: camelCase with `.module.ts` suffix (e.g., `user.module.ts`)
- **Schemas**: camelCase with `.schema.ts` suffix (e.g., `user.schema.ts`)
- **Repositories**: camelCase with `.repository.ts` suffix (e.g., `user.repository.ts`)
- **Types**: camelCase with `.types.ts` suffix (e.g., `user.types.ts`)
- **Guards**: camelCase with `.guard.ts` suffix (e.g., `clerk-auth.guard.ts`)
- **Decorators**: camelCase with `.decorator.ts` suffix (e.g., `current-user.decorator.ts`)

### Code Conventions
- **Interfaces**: PascalCase with `I` prefix for shared types (e.g., `IUser`, `IOrganization`)
- **Classes**: PascalCase (e.g., `UserService`, `AuthGuard`)
- **Functions**: camelCase (e.g., `getCurrentUser`, `validateToken`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `API_ENDPOINTS`, `DEFAULT_TIMEOUT`)
- **Environment Variables**: SCREAMING_SNAKE_CASE (e.g., `CLERK_SECRET_KEY`)

## Directory Organization Patterns

### 1. Feature-Based Modules (Backend)
Each feature has its own module directory containing:
- Module definition file (`.module.ts`)
- Service files (`.service.ts`)
- Controller files (`.controller.ts`) - if needed
- Database layer (`db/` subdirectory)
- Supporting files (guards, decorators, etc.)

### 2. Layered Architecture (Backend)
```
module/
├── module.module.ts     # Dependency injection & exports
├── module.service.ts    # Business logic
├── module.controller.ts # HTTP endpoints (if needed)
└── db/                  # Data access layer
    ├── module.schema.ts     # Database schema
    └── module.repository.ts # Data operations
```

### 3. App Router Structure (Frontend)
- Route groups: `(auth)`, `(dashboard)` for logical grouping
- Catch-all routes: `[[...rest]]` for Clerk's dynamic routing
- Layouts: `layout.tsx` files for shared UI structure
- Pages: `page.tsx` files for route components

### 4. Component Organization (Frontend)
- **Components**: Reusable UI components in `/components`
- **Hooks**: Custom hooks in `/hooks`
- **Lib**: Utilities and configurations in `/lib`
- **Providers**: React context providers in `/providers`

## Import/Export Patterns

### Barrel Exports
Use `index.ts` files for clean imports:
```typescript
// shared-lib/src/index.ts
export * from "./types/user.types";
export * from "./types/organization.types";
export * from "./types/api.types";
```

### Relative Imports
Use path aliases configured in `tsconfig.json`:
```typescript
// Frontend
import { DashboardNav } from "@/components/DashboardNav";
import { useCurrentUser } from "@/hooks/use-current-user";

// Backend - use relative imports within modules
import { UserRepository } from './db/user.repository';
```

### Module Dependencies
- Frontend can import from `shared-lib`
- Backend can import from `shared-lib`
- `shared-lib` should not import from other packages
- Inter-package imports should go through `shared-lib`

## Configuration File Patterns

### Package-Level Configuration
Each package has its own:
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- Framework-specific configs (`next.config.js`, `nest-cli.json`)

### Root-Level Configuration
- `turbo.json` - Turborepo build orchestration
- `package.json` - Workspace configuration and root scripts

## Database & Repository Patterns

### Schema Definition
```typescript
// user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  clerkId: string;
  
  @Prop({ required: true })
  email: string;
  
  // ... other properties
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
```

### Repository Pattern
```typescript
// user.repository.ts
@Injectable()
export class UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByClerkId(clerkId: string): Promise<User | null> {
    return this.userModel.findOne({ clerkId }).exec();
  }
  
  // ... other repository methods
}
```

## API Client Patterns

### Client Configuration
```typescript
// lib/api/client.ts
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  timeout: 10000,
});
```

### Endpoint Organization
```typescript
// lib/api/endpoints/user.ts
export const userApi = {
  getCurrentUser: () => apiClient.get('/api/user/profile'),
  // ... other endpoints
};
```

## Authentication Integration

### Clerk Integration
- Frontend uses `@clerk/nextjs` components directly
- Backend receives webhook events for data synchronization
- No custom authentication logic required
- Middleware protects routes using Clerk's built-in functionality

### Protected Routes
```typescript
// middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/"],
  ignoredRoutes: ["/api/webhooks/clerk"],
});
```

## Development Workflow

### New Feature Development
1. **Add types** to `shared-lib` if needed
2. **Backend**: Create module with schema, repository, service
3. **Frontend**: Create components, hooks, and API endpoints
4. **Integration**: Connect frontend to backend via API calls

### File Creation Guidelines
- **Always** check for existing similar files before creating new ones
- **Prefer** editing existing files over creating new ones
- **Follow** the established naming and directory conventions
- **Use** TypeScript for all new files
- **Include** proper imports and exports
- **Add** appropriate error handling and validation