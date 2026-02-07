# DOZ DRIPZ - Technical Documentation

Welcome to the technical documentation for **DOZ DRIPZ**, a premium audio library and beat selling platform.

This folder contains detailed information about the project's architecture, data flow, and implementation details. It is designed to help developers understand the system quickly and effectively.

## Documentation Index

- **[System Architecture](architecture.md)**: High-level overview of the tech stack and design decisions.
- **[Folder Structure](folder-structure.md)**: Breakdown of the codebase organization.
- **[Data Flow](data-flow.md)**: How data moves from client to server and database.
- **[API Flow](api-flow.md)**: Guide to API routes and server-side logic.
- **[Database Design](database-design.md)**: Schema, tables, and relationships.
- **[Authentication](authentication.md)**: User auth, sessions, and role-based access.
- **[State Management](state-management.md)**: Global state handling using Zustand.
- **[Business Logic](business-logic.md)**: Core features like Licensing, Cart, and Order processing.
- **[Error Handling](error-handling.md)**: Strategies for error management and UI feedback.
- **[Deployment](deployment.md)**: Build and deployment guidelines.
- **[Future Improvements](future-improvements.md)**: Roadmap and optimization ideas.

## Quick Start

1.  **Install Dependencies**: `npm install`
2.  **Run Development Server**: `npm run dev`
3.  **Database**: The SQLite database is located at `data/app.db`. It initializes automatically if missing.

## Key Technologies

-   **Framework**: Next.js 16 (App Router)
-   **Database**: SQLite (`better-sqlite3`)
-   **Styling**: Tailwind CSS v4
-   **State**: Zustand
-   **Payments**: Razorpay
