# Database Design

## Overview
The application uses **SQLite** with the `better-sqlite3` driver. The database file is located at `data/app.db`.
The schema is defined and managed in `src/app/lib/db.ts`. The application runs migration checks on startup to ensuring the database structure is up-to-date.

## Schema

### Core Tables

#### `users`
Stores user account information.
-   `id`: Primary Key (TEXT, likely UUID).
-   `email`: Unique email address.
-   `password_hash`: Hashed password (bcrypt).
-   `role`: 'USER', 'ADMIN', or 'MUSICIAN'.
-   `isVerified`: Boolean for email verification.

#### `sessions`
Manages user sessions for authentication.
-   `id`: Session Token.
-   `user_id`: Foreign Key to `users`.
-   `expires_at`: Expiration timestamp.

#### `tracks`
Stores beat/track metadata and file paths.
-   `id`: Primary Key (INTEGER AUTOINCREMENT).
-   `title`: Track title.
-   `audio_url`: Path or URL to the audio file.
-   `coverArtUrl`: Path to cover image.
-   `price`: Base price (often overridden by licenses).
-   `status`: 'ACTIVE', 'PRIVATE', etc.

#### `licenses`
Defines the types of licenses available (Standard, Unlimited, Exclusive).
-   `name`: Display name.
-   `price`: Cost of the license.
-   `features`: JSON array of contract terms.
-   `type`: Internal identifier.

#### `track_licenses`
(Optional/Advanced) Overrides license pricing/availability per track.
-   `trackId`: FK to `tracks`.
-   `licenseType`: Matches `licenses.type`.
-   `price`: Custom price for this track/license combo.

### Commerce Tables

#### `orders`
Represents a user's purchase.
-   `id`: Primary Key.
-   `user_id`: FK to `users`.
-   `total`: Total amount paid.
-   `status`: 'PENDING', 'COMPLETED', 'FAILED'.

#### `order_items`
Links orders to specific tracks and licenses.
-   `order_id`: FK to `orders`.
-   `track_id`: FK to `tracks`.
-   `license_id`: FK to `licenses`.

#### `payments`
Stores Razorpay payment details.
-   `razorpayOrderId`: ID from Razorpay.
-   `razorpayPaymentId`: Transaction ID.
-   `status`: Payment status.

#### `purchases`
Denormalized record of what a user owns (for easy access to downloads).
-   `userId`: FK to `users`.
-   `trackId`: ID of the bought track.
-   `licenseType`: Type of license purchased.
-   `fileUrl`: Direct download link.

## Indexes
-   `idx_tracks_featured`: Optimized featured track queries.
-   `idx_orders_user`: Optimized order history lookup.
-   `idx_payments_user`: Optimized payment history lookup.

## Migrations
Migrations are handled **programmatically** in `db.ts`. On server start, the code checks `PRAGMA table_info` to see if columns exist. If not, it executes `ALTER TABLE` statements to add them. This allows for seamless updates without manual migration scripts.
