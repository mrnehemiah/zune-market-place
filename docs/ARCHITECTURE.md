# Architecture notes

The app is a lightweight modular JavaScript SPA using hash routes. It is intentionally arranged in the agreed 11 folders.

Data access is isolated in `services/`. The browser only receives a Supabase publishable key; row access must be controlled by Postgres RLS. Role and verification values are read from `profiles`, never accepted from editable user metadata.

The app uses existing table names where confirmed in the connected ZUNE project:
`profiles`, `products`, `seller_applications`, `cart_items`, `wishlists`, `orders`, `chat_conversations`, `chat_messages`, and `announcements`.

The current connected schema was inspected read-only. This package does not apply migrations, alter policies, change roles, deploy Edge Functions or modify payment settings.
