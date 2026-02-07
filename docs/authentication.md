# Authentication

## Overview
Authentication is handled via a **custom session-based system** backed by the `users` and `sessions` tables in SQLite.
It does **not** use NextAuth.js or Clerk.

## Core Components
1.  **Users Table**: Stores credentials. Passwords are hashed using `bcryptjs`.
2.  **Sessions Table**: Stores active session tokens with expiration.
3.  **Cookies**: A `session` HTTP-only cookie is set upon login.

## Flows

### Login
1.  User posts credentials to `/api/auth/login`.
2.  Server fetches user by email.
3.  `bcrypt.compare(input, hash)` verifies password.
4.  If valid, a new Session UUID is generated and inserted into `sessions` table.
5.  Response includes `Set-Cookie` header with the UUID.

### Protection (Admin Routes)
Protected routes (like `/admin`) wrap their logic or layout with a session check:
```typescript
import { cookies } from "next/headers";
const sessionToken = cookies().get("session")?.value;
// Query DB to verify token and check user.role === 'ADMIN'
// Redirect if invalid
```
*Note: This check is currently implemented per-layout (e.g., in `src/app/admin/layout.tsx`), not globally via middleware.*

### Logout
1.  User hits `/api/auth/logout`.
2.  Server deletes the session row from DB.
3.  Server clears the `session` cookie.

## Roles
-   **USER**: Can buy beats, view profile.
-   **ADMIN**: Full access to upload tracks, view sales, manage users.
-   **MUSICIAN**: (Future/Legacy) specialized role.
