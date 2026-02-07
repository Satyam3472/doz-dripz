# System Architecture

## Overview

DOZ DRIPZ is built as a monolithic web application using the **Next.js 16 App Router**. It leverages Server Components for performance and SEO, with Client Components used for interactive UI elements. The architecture focuses on simplicity, performance, and ease of deployment.

## Tech Stack

### Frontend
-   **Next.js 16**: Utilizes the App Router for routing, layouts, and data fetching.
-   **React 19**: Core UI library.
-   **Tailwind CSS v4**: Utility-first CSS framework for styling.
-   **Lucide React**: Icon library.
-   **Zustand**: Lightweight global state management for Client Components.

### Backend
-   **Next.js Route Handlers**: API endpoints located in `src/app/api`.
-   **Server Actions**: Used for direct form submissions and server-side mutations (where applicable).
-   **Node.js Runtime**: The server environment.

### Database
-   **SQLite**: The application uses a local SQLite database (`data/app.db`) for data persistence.
-   **better-sqlite3**: High-performance Node.js wrapper for SQLite.
-   **Schema**: managed locally via `src/app/lib/db.ts` with auto-running migrations on startup.

### Infrastructure
-   **Hosting**: Capable of being hosted on any Node.js compatible environment (e.g., VPS, Docker) or Vercel (with caveats regarding SQLite persistence). *Note: Since it uses local SQLite, persistent storage is required.*

## Architectural Patterns

### 1. Colocation
The project follows a localized structure where shared components live in `src/app/components`, but specific page logic is kept within page files.

### 2. Client vs. Server
-   **Server Components (`page.tsx`, `layout.tsx`)**: Handle initial data fetching directly from the DB or API to ensure fast First Contentful Paint (FCP) and SEO.
-   **Client Components (`"use client"`)**: Handle interactivity (Audio Player, Cart, Modals) and global state (Zustand).

### 3. API Layer
The application exposes a REST-like API via `src/app/api`.
-   **Admin Routes**: Protected routes for managing tracks, users, and stats.
-   **Public Routes**: For fetching tracks, processing payments, and auth.

### 4. Database Access
Database logic is centralized in `src/app/lib/db.ts`. This file handles:
-   Database connection.
-   Schema creation and migrations (auto-run).
-   Direct SQL queries using `prepare().run()` or `prepare().all()`.
