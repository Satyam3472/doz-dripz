# Future Improvements

## Architecture & Infrastructure
-   **Database Migration**: Move from local SQLite to **Turso (LibSQL)** or **PostgreSQL** to enable serverless deployment (Vercel/Netlify) and better scalability.
-   **Object Storage**: Move file uploads (`public/uploads`) to **AWS S3** or **Cloudflare R2**. Currently, uploads are stored on the local filesystem, which doesn't scale across multiple servers.
-   **Middleware Auth**: Migrate session checking from per-layout Logic to standard `middleware.ts` for better security coverage and performance.

## Features
-   **Musician Portal**: Expand features for the 'MUSICIAN' role (upload their own beats, view their own sales).
-   **Social Logins**: Add Google/Spotify login.
-   **Audio Waveforms**: Generate visual waveforms for tracks using `peaks.js` or server-side analysis.

## Developer Experience
-   **Testing**: Add Unit Tests (Jest) for utility functions and E2E Tests (Playwright) for critical flows like Checkout.
-   **CI/CD**: Set up GitHub Actions for automated linting and building.
-   **Type Safety**: Improve strictness of TypeScript types, particularly for API responses and Database entities.
