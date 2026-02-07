# State Management

## Overview
The application uses **Zustand** for global client-side state management. This is preferred over Context API for performance (atomic updates) and simplicity.
Store files are located in `src/stores`.

## Stores

### 1. `cart.store.ts`
Manages the shopping cart.
-   **State**: `items` (Array of tracks/licenses), `isOpen` (UI drawer state).
-   **Actions**:
    -   `addItem(track, licenseType)`: Adds item, handles duplicates.
    -   `removeItem(id)`: Removes item.
    -   `clearCart()`: Empties cart after purchase.
    -   `total()`: Computed property for checkout price.
-   **Persistence**: Uses `persist` middleware to save cart to LocalStorage.

### 2. `player.store.ts`
Manages the global audio player (floating footer).
-   **State**: `currentTrack`, `isPlaying`, `volume`, `queue`.
-   **Actions**:
    -   `play(track)`: Sets track and starts playback.
    -   `pause()`: Pauses audio.
    -   `next() / prev()`: Navigation.
-   **Persistence**: Persists volume and last played track to LocalStorage to resume session user experience.

### 3. `auth.store.ts` (Client Side)
Mirrors key user info for UI (e.g., showing "Login" vs "Profile" in Navbar).
-   **State**: `user` object (email, name, role), `isAuthenticated` boolean.
-   **Sync**: Updated purely by client-side checks or after successful login API calls. *Note: source of truth is always the Server Session.*
