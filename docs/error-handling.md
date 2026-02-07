# Error Handling

## Client-Side
-   **UI Feedback**: Toast notifications (via `sonner` or similar) and Alerts are used to inform users of success/failure.
-   **Graceful Degradation**: Components like `MediaPlayer` handle missing files by skipping or showing an error state.
-   **Validation**: Form inputs (Login, Upload) have client-side validation before submission.

## Server-Side (API)
API Routes follow a consistent error response structure:

```json
{
  "error": "Descriptive error message"
}
```

### Common Status Codes
-   `200 OK`: Success.
-   `400 Bad Request`: Missing inputs or invalid data format.
-   `401 Unauthorized`: No active session.
-   `403 Forbidden`: Active session but insufficient permissions (e.g., User accessing Admin).
-   `404 Not Found`: Resource (Track/User) does not exist.
-   `500 Internal Server Error`: Unhandled exception or Database failure.

## Database
-   `better-sqlite3` throws synchronous errors. These are caught in `try/catch` blocks within Route Handlers.
-   Transactions are used for critical flows (like Order Creation) to ensure atomicity.
