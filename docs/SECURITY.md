# Security notes

- Never ship Supabase `service_role`, secret keys, provider API keys or admin credentials in browser files.
- `config/supabase-config.js` contains only the public publishable key.
- RLS is the real security boundary. UI hiding is not authorization.
- Seller Center checks the trusted `profiles.role` returned from Supabase.
- Never let users update their own `role`, `is_verified`, `account_status` or vendor code from profile forms.
- Admin approval and account enforcement remain in the separate ZUNE PREMIUM ADMIN system.
- Confirm RLS `USING` and `WITH CHECK` rules, grants, storage policies and Auth redirect URLs before production.
- Do not rely on screenshots or client-side values to verify payments. Payment system is deferred.
