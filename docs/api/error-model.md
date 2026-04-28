# API Error Model

## Purpose
Standardize API error payloads, status code usage, and provider failure mapping for the Vercel + Supabase MVP.

## Audience
- Backend engineers
- Frontend engineers
- QA engineers
- SRE/operations contributors

## Owner
Role Placeholder: API Reliability Owner

## Backup Owner
Role Placeholder: Backend Engineering Lead

## Review Cadence
Monthly, and immediately when adding new endpoints or provider adapters.

## Source of Truth References
- `docs/api/endpoints-spec.md`
- `docs/api/rate-limit-policy.md`
- `docs/security/auth-and-authorization.md`
- `docs/superpowers/specs/2026-04-28-gdc-aggregator-mvp-design.md`

## Key Decisions / Invariants
- Error responses always include:
  - `success: false`
  - `data: null`
  - `error: { code, message, details?, retryable?, requestId }`
  - `meta: { timestamp }`
- User-facing `message` is sanitized and non-sensitive.
- `code` values are stable identifiers for client handling.
- Internal stack traces and raw provider payloads are never returned to clients.

## Error Envelope
```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "PROVIDER_TIMEOUT",
    "message": "Provider request timed out. Please try again.",
    "details": null,
    "retryable": true,
    "requestId": "req_12345"
  },
  "meta": {
    "timestamp": "2026-04-29T00:00:00Z"
  }
}
```

## HTTP Status Mapping
- `400 Bad Request`: Validation or malformed input.
- `401 Unauthorized`: Missing or invalid session.
- `403 Forbidden`: Authenticated but lacks required role/scope.
- `404 Not Found`: Resource does not exist or not visible to caller.
- `409 Conflict`: State transition conflict (e.g., already moderated).
- `422 Unprocessable Entity`: Semantically invalid payload.
- `429 Too Many Requests`: Rate limit exceeded (see `docs/api/rate-limit-policy.md`).
- `500 Internal Server Error`: Unexpected server failure.
- `502 Bad Gateway`: Upstream provider response failure.
- `503 Service Unavailable`: Supabase or provider service unavailable.

## Canonical Error Codes
- `VALIDATION_FAILED`
- `UNAUTHENTICATED`
- `FORBIDDEN`
- `RESOURCE_NOT_FOUND`
- `STATE_CONFLICT`
- `RATE_LIMITED`
- `PROVIDER_TIMEOUT`
- `PROVIDER_UNAVAILABLE`
- `PROVIDER_SCHEMA_MISMATCH`
- `DB_OPERATION_FAILED`
- `INTERNAL_ERROR`

## Provider Error Mapping (itch.io + Medium)
- Provider timeout -> `502` + `PROVIDER_TIMEOUT` + `retryable: true`
- Provider 429 -> `429` + `RATE_LIMITED` + `retryable: true`
- Provider unavailable/5xx -> `503` + `PROVIDER_UNAVAILABLE` + `retryable: true`
- Unexpected response shape -> `502` + `PROVIDER_SCHEMA_MISMATCH` + `retryable: false`

## Failure Modes
- Overly generic error mapping can hide actionable operational signals.
- Unstable error codes can break frontend flows relying on deterministic handling.
- Leaking provider payloads can expose sensitive internals and violate security policy.

## Change Log
- 2026-04-29: Initial MVP error model created.
