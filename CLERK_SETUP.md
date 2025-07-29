# Clerk Authentication Setup Guide

Complete guide for setting up Clerk authentication with webhook integration using ngrok for local development.

## Overview

This guide covers:
- Clerk account setup and API key configuration
- Environment variable configuration 
- Local development with ngrok webhooks
- Complete development workflow
- Troubleshooting common issues

## Prerequisites

- Node.js 18+ installed
- MongoDB running (local or Atlas)
- Git repository cloned and dependencies installed

## Quick Setup Checklist

- [ ] Create Clerk account and get API keys
- [ ] Setup MongoDB connection
- [ ] Install and configure ngrok
- [ ] Create environment files
- [ ] Configure webhooks with ngrok tunnel
- [ ] Test authentication flow

---

## Step 1: Clerk Account Setup

### 1.1 Create Clerk Account
1. Go to [clerk.com](https://clerk.com) and sign up
2. Create a new application
3. Choose your authentication methods (email, social providers, etc.)

### 1.2 Get API Keys
1. Navigate to **Dashboard → API Keys**
2. Copy the following keys:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_`)

---

## Step 2: Environment Configuration

### 2.1 Frontend Environment (.env.local)
Create `packages/frontend/.env.local`:

```bash
# Clerk Authentication Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3001

# Optional: Custom auth redirects
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 2.2 Backend Environment (.env)
Create `packages/backend/.env`:

```bash
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/saas-boilerplate

# Clerk Webhook Secret (will be added after webhook setup)
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## Step 3: MongoDB Setup

### Option A: Local MongoDB with Docker
```bash
# Start MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Verify connection
docker logs mongodb
```

### Option B: MongoDB Atlas (Cloud)
1. Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Replace `MONGODB_URI` in backend `.env`

---

## Step 4: ngrok Setup for Webhooks

### 4.1 Install ngrok

Choose one installation method:

```bash
# Option A: Download from https://ngrok.com/download

# Option B: Using Homebrew (macOS)
brew install ngrok

# Option C: Using npm
npm install -g ngrok
```

### 4.2 Configure ngrok
```bash
# Sign up at https://ngrok.com and get your auth token
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

### 4.3 Start Development Servers

**Terminal 1: Backend Server**
```bash
cd packages/backend
npm run dev
# Backend runs on http://localhost:3001
```

**Terminal 2: ngrok Tunnel**
```bash
ngrok http 3001

# Output will show:
# Forwarding  https://abc123.ngrok.io -> http://localhost:3001
# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

**Terminal 3: Frontend Server**
```bash
cd packages/frontend
npm run dev
# Frontend runs on http://localhost:3000
```

---

## Step 5: Webhook Configuration

### 5.1 Create Webhook Endpoint in Clerk
1. Go to **Clerk Dashboard → Webhooks**
2. Click **Create Endpoint**
3. Enter webhook URL: `https://YOUR_NGROK_URL.ngrok.io/api/webhooks/clerk`
   - Replace `YOUR_NGROK_URL` with your actual ngrok URL
   - Example: `https://abc123.ngrok.io/api/webhooks/clerk`

### 5.2 Subscribe to Events
Select the following events:
- `user.created`
- `user.updated`
- `user.deleted`
- `organization.created`
- `organization.updated`
- `organization.deleted`
- `organizationMembership.created`
- `organizationMembership.updated`
- `organizationMembership.deleted`
- `organizationInvitation.created`
- `organizationInvitation.accepted`
- `organizationInvitation.revoked`

### 5.3 Get Webhook Secret
1. After creating the webhook, copy the **Signing Secret**
2. Add it to `packages/backend/.env`:
   ```bash
   CLERK_WEBHOOK_SECRET=whsec_your_actual_webhook_secret_here
   ```
3. Restart your backend server to load the new environment variable

---

## Step 6: Test the Integration

### 6.1 Test Webhook Connection
```bash
# Test the webhook endpoint
curl -X POST https://YOUR_NGROK_URL.ngrok.io/api/webhooks/clerk \
  -H "Content-Type: application/json" \
  -d '{"test": "connection"}'

# Check backend logs for the request
```

### 6.2 Test Authentication Flow
1. Visit http://localhost:3000
2. Click sign up/sign in
3. Complete authentication with Clerk
4. Check backend logs to see webhook events being received
5. Visit http://localhost:3000/dashboard to test protected routes

### 6.3 Verify Data Synchronization
- Check your MongoDB database for user/organization records
- Webhook events should create/update records in your database
- All user operations should sync automatically

---

## Production Deployment

### Production Webhook Configuration
For production, replace the ngrok URL with your actual domain:

```bash
# Production webhook URL format
https://yourdomain.com/api/webhooks/clerk
```

### Environment Variables for Production
- Use production Clerk keys (different from test keys)
- Use secure MongoDB connection string
- Set `NODE_ENV=production`
- Ensure all secrets are properly secured

---

## Troubleshooting

### Common Issues and Solutions

#### Webhook Not Receiving Events
- **Check**: ngrok is running and tunnel is active
- **Check**: Webhook URL in Clerk matches ngrok URL exactly
- **Check**: Backend server is running on correct port (3001)
- **Solution**: Restart ngrok and update webhook URL in Clerk

#### 401 Unauthorized Errors
- **Check**: `CLERK_WEBHOOK_SECRET` matches Clerk dashboard
- **Check**: Environment variables are loaded (restart backend)
- **Solution**: Copy webhook secret again from Clerk dashboard

#### Connection Timeout Errors
- **Check**: Backend server is running and accessible
- **Check**: ngrok tunnel is active and forwarding correctly
- **Check**: Firewall/network restrictions
- **Solution**: Test webhook endpoint manually with curl

#### SSL/HTTPS Errors
- **Check**: Using HTTPS ngrok URL (not HTTP)
- **Check**: ngrok account is authenticated
- **Solution**: Always use HTTPS URLs for webhooks

#### MongoDB Connection Issues
- **Check**: MongoDB is running (Docker container or Atlas)
- **Check**: Connection string is correct in `.env`
- **Check**: Network access (Atlas IP whitelist)
- **Solution**: Test MongoDB connection independently

#### Frontend Authentication Issues
- **Check**: Clerk publishable key is correct and starts with `pk_`
- **Check**: Environment file is named `.env.local` (not `.env`)
- **Check**: Frontend server restarted after adding env vars
- **Solution**: Clear browser cache and cookies

### Debug Mode

Enable debug logging for more detailed error information:

```bash
# Backend debug mode
DEBUG=clerk:* npm run dev

# Frontend debug mode (in browser console)
localStorage.setItem('clerk:debug', 'true')
```

---

## Security Best Practices

### Development
- ⚠️ **Never commit `.env` files to git** (already in `.gitignore`)
- 🔒 Use test keys for development, production keys for production
- 🔄 Rotate webhook secrets regularly
- 🌐 Always use HTTPS URLs for webhooks (ngrok provides this)

### Production
- 🔐 Use environment variable management service
- 🔒 Restrict webhook endpoint access
- 📊 Monitor webhook delivery and failures
- 🔄 Implement webhook retry logic for failures

---

## Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [ngrok Documentation](https://ngrok.com/docs)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [NestJS Webhooks](https://docs.nestjs.com/techniques/security#webhooks)

---

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review backend and frontend logs
3. Test each component independently
4. Verify all environment variables are set correctly