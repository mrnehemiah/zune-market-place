# ZUNE smoke-test checklist

- [ ] Home page loads on mobile and desktop.
- [ ] Bottom navigation opens Home, Categories, ZUNE AI, Cart and Account.
- [ ] Product cards open product details.
- [ ] Search filters products.
- [ ] Guest cart and wishlist work locally.
- [ ] Signup/login work against Supabase Auth.
- [ ] Profile updates only full_name and phone_number.
- [ ] Seller application requires authentication and writes to seller_applications.
- [ ] Seller Center is hidden unless profiles.role is vendor.
- [ ] Seller can create and delete own products under RLS.
- [ ] Buyer can create an order request; no payment is collected.
- [ ] WhatsApp Channel opens the official channel.
- [ ] No Admin route, page or sidebar exists.
- [ ] No service_role key is present in public files.
- [ ] Verify RLS policies and Storage access in Supabase before production.
