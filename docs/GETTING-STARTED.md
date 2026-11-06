# ZUNE Marketplace — Getting Started

## Folder structure
- `assets/` images, icons and brand assets
- `components/` reusable UI
- `config/` public app and Supabase config
- `css/` design system, responsive styles and animations
- `docs/` documentation
- `js/` application routing and bootstrap
- `pages/` page modules
- `services/` Supabase data services
- `supabase/` integration notes and optional Edge Function scaffold
- `tests/` manual smoke tests

## Run locally
1. Extract ZIP.
2. Open folder in VS Code.
3. Run with a local static server (VS Code Live Server or `python -m http.server 5500`).
4. Open `http://localhost:5500`.

Do not open `index.html` directly as a `file://` URL; ES modules and service workers need an HTTP origin.

## Supabase
The current ZUNE project URL and publishable key are configured in `config/supabase-config.js`.
Only a publishable key is included. Never add secret/service-role keys to the frontend.

## Authentication
The app uses Supabase Auth when available. Registration uses email/password and profile metadata; existing database triggers are expected to create/sync `profiles`. Email confirmation behavior depends on Supabase Auth settings.

## Seller access
Users submit an application from Account → Become a Seller. Admin review is performed in the separate ZUNE PREMIUM ADMIN project. The marketplace only reveals Seller Center when the trusted `profiles.role` value is `vendor`.

## Payments
Payments are intentionally disabled and deferred. Checkout currently creates an order request with `payment_status = pending`; it does not charge a user or mark a payment as paid.

## WhatsApp
- Channel: official ZUNE WhatsApp Channel.
- Contact: opens a WhatsApp contact link; the phone number is not printed in the UI.

## Known integration requirements before production
- Confirm RLS policies allow the intended public product reads and owner-only product writes.
- Confirm policies for `profiles`, `seller_applications`, `cart_items`, `wishlists`, `orders`, `chat_conversations` and `chat_messages`.
- Confirm profile trigger creates buyer profile after signup.
- Configure Auth redirect URLs for deployed domain.
- Configure Storage bucket and policies if product image upload is enabled.
- Connect a production AI provider to the optional Edge Function if live generative AI is desired.
- Add a transactional email provider if order emails are required.
