# Deployment Guide

## Prerequisites
-   Node.js 18+
-   NPM or PNPM

## Environment Variables
Create a `.env.local` (local) or configure environment variables in your host:

```bash
# App
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Database (Local path)
# Note: In production, ensure this path is persistent!
DATABASE_URL=file:./data/app.db

# Authentication
SESSION_SECRET=complex_random_string

# Payments (Razorpay)
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...

# Email (Resend)
RESEND_API_KEY=re_...
```

## Build & Run

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Build the application**:
    ```bash
    npm run build
    ```
    This compiles the Next.js app to `.next/`.

3.  **Start the server**:
    ```bash
    npm start
    ```
    The app will listen on port 3000 by default.

## Deployment Targets

### Vercel
*Warning*: Vercel Serverless Functions have **ephemeral filesystems**. SQLite (file-based) will **NOT** persist between requests.
**DO NOT** deploy this project to Vercel unless you migrate to a remote database like **Turso (LibSQL)** or **PostgreSQL**.

### Docker / VPS (Recommended for SQLite)
Since `app.db` is a file, the simplest deployment is a VPS (DigitalOcean, Hetzner, EC2) or a Docker container with a mounted volume for `/data`.

**Dockerfile Example**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```
*Ensure you mount a volume to `/app/data` to persist the database.*
