# Environment Variables Setup Guide

This guide provides detailed instructions for setting up all environment variables required for the SaaS Boilerplate project.

## Overview

The project requires environment variables for two main services:
- **Frontend** (Next.js): Authentication, API communication, and routing
- **Backend** (NestJS): Database connection, webhook handling, and server configuration

## Quick Setup Checklist

- [ ] Create Clerk account and application
- [ ] Set up MongoDB (local or cloud)
- [ ] Create frontend `.env.local` file
- [ ] Create backend `.env` file
- [ ] Configure Clerk webhooks
- [ ] Test environment setup

---

## Frontend Environment Variables

### File Location
Create: `packages/frontend/.env.local`

### Required Variables

#### `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
**Purpose**: Client-side authentication with Clerk  
**Format**: `pk_test_xxxxxxxxxx` (development) or `pk_live_xxxxxxxxxx` (production)  
**Required**: ✅ Yes

**How to get it:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **API Keys** section
4. Copy the **Publishable Key**

**Example:**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y2xlcmsuZXhhbXBsZS5jb20k
```

**Security Note**: This key is safe to expose in client-side code (hence the `NEXT_PUBLIC_` prefix).

---

#### `CLERK_SECRET_KEY`
**Purpose**: Server-side authentication and API access  
**Format**: `sk_test_xxxxxxxxxx` (development) or `sk_live_xxxxxxxxxx` (production)  
**Required**: ✅ Yes

**How to get it:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **API Keys** section
4. Copy the **Secret Key**

**Example:**
```bash
CLERK_SECRET_KEY=sk_test_Y2xlcmsuZXhhbXBsZS5jb20k
```

**Security Note**: ⚠️ Keep this secret! Never expose in client-side code or commit to version control.

---

#### `NEXT_PUBLIC_API_URL`
**Purpose**: Backend API endpoint for frontend to communicate with server  
**Format**: Full URL with protocol  
**Required**: ✅ Yes (for API communication)  
**Default**: `http://localhost:3001`

**Development:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Production:**
```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

**Notes**: 
- Must match the backend server URL
- Include protocol (`http://` or `https://`)
- No trailing slash

---

#### `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
**Purpose**: Redirect URL after successful sign-in  
**Format**: Relative path  
**Required**: ❌ Optional  
**Default**: `/dashboard`

**Example:**
```bash
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
```

**Common Options:**
- `/dashboard` - Main dashboard
- `/onboarding` - New user setup
- `/profile` - User profile page

---

#### `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`
**Purpose**: Redirect URL after successful sign-up  
**Format**: Relative path  
**Required**: ❌ Optional  
**Default**: `/dashboard`

**Example:**
```bash
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

---

### Complete Frontend .env.local Example

```bash
# Clerk Authentication - Get from https://clerk.com/dashboard
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y2xlcmsuZXhhbXBsZS5jb20k
CLERK_SECRET_KEY=sk_test_Y2xlcmsuZXhhbXBsZS5jb20k

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Optional: Custom auth redirects
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

---

## Backend Environment Variables

### File Location
Create: `packages/backend/.env`

### Required Variables

#### `MONGODB_URI`
**Purpose**: Database connection string for MongoDB  
**Format**: MongoDB connection URI  
**Required**: ✅ Yes

**Local Development (Docker):**
```bash
MONGODB_URI=mongodb://localhost:27017/saas-boilerplate
```

**Local Development (MongoDB Compass/Local Install):**
```bash
MONGODB_URI=mongodb://127.0.0.1:27017/saas-boilerplate
```

**MongoDB Atlas (Cloud):**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/saas-boilerplate?retryWrites=true&w=majority
```

**How to set up:**

**Option 1: Local with Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option 2: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account and cluster
3. Create database user
4. Whitelist your IP address
5. Get connection string from "Connect" button

**Database Name**: `saas-boilerplate` (or change to your preference)

---

#### `CLERK_WEBHOOK_SECRET`
**Purpose**: Verify webhook requests from Clerk  
**Format**: `whsec_xxxxxxxxxx`  
**Required**: ✅ Yes (for data synchronization)

**How to get it:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **Webhooks** section
3. Click **Add Endpoint**
4. Enter endpoint URL: `http://localhost:3001/api/webhooks/clerk`
5. Select events to subscribe to:
   - `user.created`
   - `user.updated`
   - `user.deleted`
   - `organization.created`
   - `organization.updated`
   - `organization.deleted`
   - `organizationMembership.created`
   - `organizationMembership.updated`
   - `organizationMembership.deleted`
6. Copy the **Signing Secret**

**Example:**
```bash
CLERK_WEBHOOK_SECRET=whsec_Y2xlcmsuZXhhbXBsZS5jb20k
```

**Production Note**: For production, use your actual domain instead of localhost.

---

#### `CLERK_JWT_ISSUER`
**Purpose**: JWT token issuer for Clerk authentication verification  
**Format**: URL string  
**Required**: ✅ Yes (for JWT token verification)

**How to get it:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **JWT Templates** section
4. The issuer URL is typically: `https://clerk.{your-domain}.com`
5. Or use the format: `https://your-clerk-app-id.clerk.accounts.dev`

**Development Example:**
```bash
CLERK_JWT_ISSUER=https://your-app-12345.clerk.accounts.dev
```

**Production Example:**
```bash
CLERK_JWT_ISSUER=https://clerk.yourdomain.com
```

**Notes**: 
- Used by ClerkAuthGuard for JWT token verification
- Must match your Clerk application's issuer
- Critical for secure API authentication

---

#### `PORT`
**Purpose**: Port number for the backend server  
**Format**: Number  
**Required**: ❌ Optional  
**Default**: `3001`

**Example:**
```bash
PORT=3001
```

**Notes**: 
- Must not conflict with frontend port (3000)
- Update `NEXT_PUBLIC_API_URL` if you change this

---

#### `NODE_ENV`
**Purpose**: Application environment mode  
**Format**: String (`development`, `production`, `test`)  
**Required**: ❌ Optional  
**Default**: `development`

**Development:**
```bash
NODE_ENV=development
```

**Production:**
```bash
NODE_ENV=production
```

**Impact**: 
- Enables/disables development features
- Controls logging levels
- Affects error handling and security settings

---

#### `FRONTEND_URL`
**Purpose**: Frontend application URL for CORS and redirects  
**Format**: Full URL with protocol  
**Required**: ❌ Optional  
**Default**: `http://localhost:3000`

**Development:**
```bash
FRONTEND_URL=http://localhost:3000
```

**Production:**
```bash
FRONTEND_URL=https://your-frontend-domain.com
```

**Uses**: 
- CORS configuration
- Webhook response handling
- Email link generation

---

### Complete Backend .env Example

```bash
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/saas-boilerplate

# Clerk Configuration
CLERK_WEBHOOK_SECRET=whsec_Y2xlcmsuZXhhbXBsZS5jb20k
CLERK_JWT_ISSUER=https://your-app-12345.clerk.accounts.dev

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## Setup Instructions

### Step 1: Create Clerk Application

1. **Sign up** at [Clerk](https://clerk.com)
2. **Create new application**
3. **Choose authentication methods** (email, social, etc.)
4. **Copy API keys** from Dashboard → API Keys

### Step 2: Set Up Database

**Option A: Local MongoDB with Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option B: MongoDB Atlas (Recommended for production)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free M0 cluster
3. Create database user
4. Add your IP to whitelist
5. Get connection string

### Step 3: Create Environment Files

**Frontend:**
```bash
# Navigate to frontend directory
cd packages/frontend

# Create environment file
touch .env.local

# Add your variables (see examples above)
```

**Backend:**
```bash
# Navigate to backend directory  
cd packages/backend

# Create environment file
touch .env

# Add your variables (see examples above)
```

### Step 4: Configure Webhooks

1. **Go to Clerk Dashboard** → Webhooks
2. **Add endpoint**: `http://localhost:3001/api/webhooks/clerk`
3. **Subscribe to events**:
   - All `user.*` events
   - All `organization.*` events  
   - All `organizationMembership.*` events
4. **Copy signing secret** to `CLERK_WEBHOOK_SECRET`

### Step 5: Test Setup

```bash
# Start backend
cd packages/backend
npm run dev

# Start frontend (in new terminal)
cd packages/frontend  
npm run dev

# Visit http://localhost:3000
# Try signing up/in to test integration
```

---

## Security Best Practices

### 🔒 Secret Management

- **Never commit** `.env` files to version control
- **Use different keys** for development/staging/production
- **Rotate secrets** regularly in production
- **Use environment-specific** Clerk applications

### 📁 File Security

- Files are already in `.gitignore`
- Verify with: `git status` (should not show `.env*` files)
- Use `git add .` carefully

### 🌐 Production Considerations

- **Use HTTPS** for all production URLs
- **Whitelist IPs/domains** in MongoDB Atlas
- **Enable rate limiting** for webhooks
- **Monitor webhook deliveries** in Clerk Dashboard

### 🔄 Backup & Recovery

- **Document** all environment variables
- **Store secrets** in secure password manager
- **Keep backups** of configurations
- **Test restoration** procedures

---

## Troubleshooting

### Common Issues

#### ❌ "Invalid Publishable Key"
**Symptoms**: Authentication fails in frontend  
**Solutions**:
- Verify key starts with `pk_test_` or `pk_live_`
- Check key is copied completely (no spaces/newlines)
- Ensure development/production key matches environment

#### ❌ "Webhook Signature Verification Failed"
**Symptoms**: Webhook events not processing  
**Solutions**:
- Verify `CLERK_WEBHOOK_SECRET` starts with `whsec_`
- Check webhook endpoint URL is correct
- Ensure all required events are subscribed
- Restart backend server after changing secret

#### ❌ "MongoDB Connection Failed"
**Symptoms**: Backend fails to start  
**Solutions**:
- Check MongoDB is running: `docker ps` (if using Docker)
- Verify connection string format
- Test connection with MongoDB Compass
- Check network/firewall restrictions

#### ❌ "API Connection Failed"
**Symptoms**: Frontend can't reach backend  
**Solutions**:
- Verify `NEXT_PUBLIC_API_URL` matches backend port
- Check backend server is running on correct port
- Test API endpoint directly: `curl http://localhost:3001/api/health`
- Verify CORS configuration

#### ❌ "JWT Token Verification Failed"
**Symptoms**: Authentication requests fail with 401 errors  
**Solutions**:
- Verify `CLERK_JWT_ISSUER` matches your Clerk application
- Check issuer URL format (must be complete URL with https://)
- Ensure JWT issuer is correctly configured in Clerk Dashboard
- Restart backend server after changing JWT issuer

### Environment Variable Validation

**Check Frontend Variables:**
```bash
cd packages/frontend
echo $NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
echo $NEXT_PUBLIC_API_URL
```

**Check Backend Variables:**
```bash
cd packages/backend  
echo $MONGODB_URI
echo $CLERK_WEBHOOK_SECRET
echo $PORT
```

### Testing Webhooks Locally

1. **Use ngrok** for local webhook testing:
```bash
# Install ngrok
npm install -g ngrok

# Expose local backend
ngrok http 3001

# Use ngrok URL in Clerk webhook configuration
# Example: https://abc123.ngrok.io/api/webhooks/clerk
```

2. **Test webhook delivery** in Clerk Dashboard
3. **Check server logs** for webhook processing

### Logs and Debugging

**Frontend Logs:**
```bash
# Development console (browser)
# Check Network tab for API calls
# Check Console for authentication errors
```

**Backend Logs:**
```bash
# Terminal where backend is running
# Look for MongoDB connection status
# Check webhook event processing
# Monitor API request/response logs
```

---

## Environment-Specific Configurations

### Development
- Use `pk_test_` and `sk_test_` keys
- Local MongoDB or development Atlas cluster
- HTTP URLs (localhost)
- Detailed logging enabled

### Staging
- Use separate Clerk application
- Dedicated MongoDB database
- HTTPS URLs
- Production-like configuration

### Production  
- Use `pk_live_` and `sk_live_` keys
- Production MongoDB cluster with backups
- HTTPS URLs only
- Error logging and monitoring
- Regular secret rotation

---

## Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [MongoDB Atlas Setup Guide](https://docs.mongodb.com/atlas/getting-started/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [NestJS Configuration](https://docs.nestjs.com/techniques/configuration)

---

## Support

If you encounter issues:
1. Check this troubleshooting guide
2. Verify all environment variables are set correctly
3. Test each service independently
4. Check service logs for specific error messages
5. Consult official documentation for each service