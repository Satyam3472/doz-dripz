# Folder Structure

This document outlines the organization of the DOZ DRIPZ codebase.

## Root Directory

-   `.next/`: Build output (gitignored).
-   `data/`: Contains the SQLite database file (`app.db`).
-   `docs/`: Project documentation.
-   `public/`: Static assets (images, uploads, fonts).
-   `src/`: Source code.
-   `next.config.ts`: Next.js configuration.
-   `tailwind.config.js`: Tailwind styling configuration.

## `src/` Directory

### `src/app/`
The core of the Next.js App Router.
-   `api/`: Backend API routes (e.g., `src/app/api/auth`, `src/app/api/tracks`).
-   `admin/`: Admin dashboard routes and specific components.
    -   `components/`: Admin-specific UI components (Sidebar, MobileNav).
    -   `tracks/`, `users/`, `orders/`: Admin page sub-routes.
-   `components/`: **Shared Application Components**.
    -   `NavBar.tsx`, `Footer.tsx`: Global layout components.
    -   `MediaPlayer.tsx`: The persistent audio player.
    -   `Cart.tsx`: Shopping cart drawer.
    -   `LicensingModal.tsx`, `LicensingPlans.tsx`: Core business UI.
-   `lib/`: Utilities and libraries.
    -   `db.ts`: **Crucial**. Database instance, schema definition, and migration logic.
    -   `utils.ts`: Helper functions (formatting, class names).
-   `fonts/`: Local font files.
-   `layout.tsx`: Root layout with global providers.
-   `page.tsx`: Homepage.
-   `globals.css`: Global styles and Tailwind directives.

### `src/stores/`
Zustand state management stores.
-   `auth.store.ts`: User session state (client-side extension of server auth).
-   `cart.store.ts`: Shopping cart state (items, total, add/remove logic).
-   `player.store.ts`: Global audio player state (current track, playing status, playlist).

## Key Files

-   **`src/app/lib/db.ts`**: The single source of truth for the Database. Logic within this file ensures tables exist before the app runs.
-   **`src/app/components/ClientLayout.tsx`**: Wraps the implementation of the main UI that requires client-side hooks (like the Audio Player persistence).
