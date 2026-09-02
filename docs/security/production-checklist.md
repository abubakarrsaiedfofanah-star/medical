# SAIED production security checklist

- Configure Supabase Auth and MFA where appropriate. (Foundation: optional Supabase client; UI/session enforcement remains.)
- Never place service-role secrets in Vite/browser variables.
- Complete RLS policies for every table. (Foundation: tenant and communications policies added; existing legacy tables still require policy review.)
- Add organization membership and provider assignment tables. (Implemented in `supabase/migrations/001_platform_foundation.sql`.)
- Implement consent and minimum-necessary access. (Time-bound access grants and patient-provider relationships added.)
- Encrypt sensitive data in transit and use managed database encryption.
- Add audit logging for reads/writes of sensitive records. (Write helper exists; read auditing remains.)
- Add rate limiting, bot protection and session controls.
- Verify healthcare workers and organizations through the relevant regulator. (Review/evidence structure added; regulator integration remains.)
- Use signed webhooks for payments and messaging.
- Keep location collection consent-based and purpose-limited.
- Perform penetration testing and privacy/security review.

See [platform-foundation.md](../architecture/platform-foundation.md) for the implementation comparison and deployment-dependent work.
