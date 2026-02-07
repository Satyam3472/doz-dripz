# Business Logic & Workflows

## 1. Licensing Model
The core product is audio "Beats" sold under different license tiers.
-   **Standard**: MP3, Limited Streams.
-   **Unlimited**: WAV + MP3, Unlimited Streams.
-   **Exclusive**: Full stems, ownership transfer, removes track from store.

Logic:
-   Licenses are defined in the `licenses` table.
-   When a user adds a track to the cart, they select a specific license.
-   **Price Calculation**: Base License Price (from DB) - Coupon Discount.

## 2. Shopping Cart & Coupons
-   **Cart Storage**: Persisted in LocalStorage via Zustand (`cart.store.ts`).
-   **Validation**: When checkout is initiated, the server *re-calculates* the total based on current DB prices to prevent client-side tampering.
-   **Coupons**:
    -   Stored in `coupons` table (Code, Discount %, Expiry).
    -   Applied at checkout. Server verifies validity before creating Razorpay order.

## 3. Order Processing
1.  **Initiation**: User clicks Checkout -> Server creates Razorpay Order.
2.  **Completion**: Razorpay Webhook/Callback -> Server validates signature.
3.  **Fulfillment**:
    -   `orders` status updated to `COMPLETED`.
    -   `purchases` records created for each item (denormalized for fast access).
    -   **Email**: Resend sends a receipt with download links.

## 4. Track Management (Admin)
-   **Upload**: Admin uploads Audio + Cover. Files saved to disk.
-   **Metadata**: BPM, Key, Genre, Tags extracted or manually entered.
-   **Updates**: Admin can edit details. 'Standard' price updates sync to track price.
