# ZUNE Marketplace — Premium Modern

A mobile-first marketplace for Tanzania, built with modular HTML/CSS/JavaScript and the existing ZUNE Supabase project.

## Run
Serve this directory over HTTP, e.g. `python -m http.server 5500`, then open `http://localhost:5500`.

## Main decisions preserved
- Premium Modern: ZUNE emerald `#087A50`, white and light gray.
- Buyer and Seller experiences only inside Marketplace.
- ZUNE PREMIUM ADMIN stays a separate existing system.
- Seller Center appears only after Admin approval updates trusted `profiles.role` to `vendor`.
- Verified store/product badge is blue; verified buyer badge is gold.
- Official WhatsApp Channel link is included.
- WhatsApp contact number is never printed visibly in the UI.
- Payments are disabled and intentionally postponed until the final phase.
- Mobile bottom navigation: Home, Categories, ZUNE AI, Cart, Account.

See `docs/GETTING-STARTED.md` and `docs/SECURITY.md`.
