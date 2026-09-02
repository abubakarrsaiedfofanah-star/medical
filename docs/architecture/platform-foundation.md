# SAIED platform foundation

## Implemented baseline

- Supabase Auth client is optional in the frontend and never exposes a service-role key.
- `supabase/migrations/001_platform_foundation.sql` adds tenant membership, departments, patient-provider relationships, consent grants, provider review records, prescription items, medicine batches, stock movements, pharmacy orders, lab samples/results, home-visit events, notification preferences, notifications, subscriptions, and invoices.
- Organization membership and patient/provider relationships are the authorization boundary for clinical workflows.
- `supabase/migrations/002_communications_rls.sql` limits conversations, messages, calls, and signaling to conversation members.
- AI `/triage` and `/chat` both apply the emergency red-flag gate and always return professional handoff language.
- Pharmacy routes are available at `/pharmacy`, `/pharmacy/inventory`, `/pharmacy/medicines`, `/pharmacy/orders`, and `/pharmacy/sales`.

## Authorization model

The browser uses the Supabase anon key only. RLS is enabled on all tables. A user can read their own profile/patient record, active members can access organization-scoped operational records, and providers require an active patient-provider relationship for patient-specific care. Consent grants are time-bound and may be revoked. Sensitive reads should be audited by the API/RPC layer before production launch.

## Remaining production integrations

Authentication screens, MFA policy, regulator-backed provider verification, signed payment webhooks, M-Pesa integration, QR token verification, map/geocoding credentials, notification delivery workers, TURN servers, private voice-message storage, subscription entitlements, backups, rate limiting, and penetration testing require deployment credentials and operational decisions. They should be delivered behind feature flags and tested against a staging Supabase project containing synthetic data only.
