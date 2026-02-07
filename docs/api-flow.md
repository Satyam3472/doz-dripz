# API Flow & Routes

## Overview
The backend is powered by **Next.js Route Handlers** located in `src/app/api`.
Requests follow a standard RESTful pattern using JSON for data exchange.

## Key Endpoints

### Authentication (`/api/auth`)
-   `POST /api/auth/register`: Creates a new user. Hash password -> Insert into DB.
-   `POST /api/auth/login`: Validates credentials -> Creates Session -> Sets HttpOnly Cookie.
-   `POST /api/auth/logout`: Deletes session -> Clears Cookie.
-   `GET /api/auth/me` (or similar): Validates session cookie to return current user context.

### Tracks (`/api/tracks` & `/api/admin/tracks`)
-   `GET /api/tracks`: Public endpoint to fetch all active tracks with pagination/filtering.
-   `POST /api/admin/tracks`: **(Admin Only)** Uploads a new track. Handles file uploads (multipart/form-data) to `public/uploads` and DB insertion.
-   `PUT /api/admin/tracks/[id]`: **(Admin Only)** Updates track metadata.
-   `DELETE /api/admin/tracks/[id]`: **(Admin Only)** Soft or hard deletes a track.

### Commerce (`/api/payment` & `/api/orders`)
-   `POST /api/payment/create-order`: Initiates a Razorpay order. Calculates total -> Calls Razorpay API -> Returns Order ID.
-   `POST /api/payment/verify`: Webhook or client callback to verify payment signature.
    -   If valid: Updates `orders` status -> Creates `purchases` records -> Sends confirmation email (Resend).

## Request Lifecycle
1.  **Client Request**: React Component (via `fetch` or Axios) sends request.
2.  **Next.js Router**: Matches route in `src/app/api`.
3.  **Middleware/Logic**:
    -   (Admin Routes) Checks `session` cookie and queries DB for `role = 'ADMIN'`.
    -   (Public Routes) No auth check.
4.  **Database Operation**: `db.prepare(...).run()` or `.all()`.
5.  **Response**: Returns `NextResponse.json({ ... })` with status code.

## Error Handling
API routes use try/catch blocks.
-   **500 Internal Server Error**: Generic catch-all for DB errors.
-   **401 Unauthorized**: Missing or invalid session.
-   **403 Forbidden**: Valid session but insufficient permissions (e.g., User trying to access Admin).
-   **400 Bad Request**: Validation failure (missing fields).
