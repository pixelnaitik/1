# 📜 API Contract — SecureVoyage

<div align="center">

![API Standard](https://img.shields.io/badge/REST_API-v1-blue?style=for-the-badge&logo=openapi-initiative)
![Format](https://img.shields.io/badge/Format-JSON_UTF--8-green?style=for-the-badge)
![Coordinates](https://img.shields.io/badge/Coordinates-WGS84_Decimal-orange?style=for-the-badge)

**Base URL:** `/api/v1` · **Format:** JSON UTF-8 · **Time:** ISO-8601 UTC · **Coordinates:** WGS84 decimal degrees (`latitude`, `longitude`)

</div>

---

## 🔒 Cross-Cutting Rules

> [!IMPORTANT]
> - **Authorization Header:** Protected endpoints require `Authorization: Bearer <access-token>`.
> - **Request Validation:** The API validates request bodies using schemas; unknown fields are rejected on security-sensitive endpoints.
> - **Idempotency:** Mutating emergency endpoints require an `Idempotency-Key` UUID header. Replaying a key returns the original result.
> - **Zero Data Leaks:** Never send secrets, provider responses, stack traces, password hashes, or other users’ precise locations.
> - **Pagination:** Uses opaque `cursor` and `limit` (default 20, max 100).

---

### 🚨 Standard Error Response Structure

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "One or more fields are invalid.",
    "requestId": "req_01J...",
    "fields": { "latitude": "Must be between -90 and 90." }
  }
}
```

> [!NOTE]
> **Common Error Codes:** `UNAUTHENTICATED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409), `RATE_LIMITED` (429), `PROVIDER_UNAVAILABLE` (502), `SERVICE_UNAVAILABLE` (503), `INTERNAL_ERROR` (500).

---

## 🔑 Authentication and Profile

| Endpoint | Auth | Request Body | Successful Response |
|---|---|---|---|
| `POST /auth/register` | Public | `{email,password,displayName}` | `201 {user,accessToken}` |
| `POST /auth/login` | Public | `{email,password}` | `200 {user,accessToken}` |
| `POST /auth/logout` | Optional | Refresh cookie | `204` |
| `GET /me` | Tourist+ | — | `200 {id,email,displayName,role,preferences}` |
| `PATCH /me/preferences` | Tourist+ | `{language?,locationConsent?,alertOptIn?,accessibilityMode?}` | `200 {preferences}` |

> [!TIP]
> **Validation Details:** Emails normalized/lowercased; passwords are 8–128 characters; display name 2–60 characters; `language` is an enabled BCP-47 short code. Login is rate-limited. Registration returns `409 EMAIL_EXISTS` without disclosing extra account detail.

---

## 📊 Safety Intelligence

### 📍 `GET /hotspots`
Query parameters: `latitude`, `longitude`, `radiusM=100..5000`, optional `from`, `to`, `categories[]`.

```json
{
  "hotspots": [{"cellId":"883...","severity":0.74,"incidentCount":18,"center":{"latitude":28.61,"longitude":77.21}}],
  "dataFreshness": {"crime":"2026-07-01T00:00:00Z"}
}
```

---

### 🛡️ `POST /risk/assess`

**Request Payload:**
```json
{"latitude":28.6139,"longitude":77.2090,"occurredAt":"2026-08-05T14:30:00Z"}
```

**Response Payload:**
```json
{
  "score": 57,
  "band": "caution",
  "confidence": {"value":0.82,"level":"high"},
  "factors": [
    {"name":"local_hotspots","contribution":0.41,"label":"Higher recent incident density"},
    {"name":"time_of_day","contribution":0.10,"label":"Evening context"}
  ],
  "modelVersion":"risk-v1.0",
  "generatedAt":"2026-08-05T14:30:03Z",
  "advisory":"Use extra caution; this is not a prediction or emergency instruction."
}
```

> [!NOTE]
> Coordinates must be valid and within the configured pilot area. Partial context may return `200` with `confidence.level=limited`; the server uses `503` only when no useful assessment can be calculated.

---

## 🛣️ Routes and Nearby Services

| Endpoint | Method | Request / Query | Response Payload |
|---|---|---|---|
| `/routes/safe` | `POST` | `{origin:{latitude,longitude},destination:{latitude,longitude},mode:"walk"|"drive"}` | `{routes:[{id,polyline,etaMin,distanceM,safetyScore,factors}]}` |
| `/nearby-services` | `GET` | Location + `type=police|hospital|ambulance`, `radiusM=100..10000` | `{services:[{id,type,name,phone,address,distanceM,verifiedAt,location}]}` |

> [!TIP]
> Route response must contain a fastest route and may contain up to two safety-weighted alternatives. `safetyScore` is comparative, not a guarantee. A provider failure returns `502 PROVIDER_UNAVAILABLE` with a safe fallback only when available.

---

## 🚨 Contacts, SOS and Location Sharing

| Endpoint | Method | Request Body | Response / Access Control |
|---|---|---|---|
| `/contacts` | `GET`/`POST` | `POST` `{name,contactType,contactValue}` | Owner only |
| `/contacts/{id}` | `PATCH`/`DELETE` | Allowed contact fields | Owner only |
| `/sos` | `POST` | `{location:{latitude,longitude,accuracyM},contactIds,shareMinutes}` | `201 {incidentId,status,sharingSessionId}`; Idempotency required |
| `/sos/{id}/cancel` | `POST` | `{reason?}` | Owner only; `409` once terminal |
| `/location-sessions/{id}/events` | `POST` | `{latitude,longitude,accuracyM,recordedAt}` | `202`; Active session owner only |
| `/responders/sos` | `GET` | Optional `status` | Responder/Admin only; All access audited |

> [!CAUTION]
> `shareMinutes` range is 5–120. The client shows a cancel period before calling `/sos`; the server nevertheless accepts cancellation only for `created/notifying` state. Service always displays the local official emergency number as a fallback.

---

## 🤖 Assistant and Notifications

| Endpoint | Method | Request Body | Response Payload |
|---|---|---|---|
| `/assistant/messages` | `POST` | `{sessionId?,message,language,context?}` | `{sessionId,message,intent,confidence,sources,actions}` |
| `/assistant/feedback` | `POST` | `{messageId,helpful}` | `204` |
| `/notifications` | `GET` | `cursor?`, `read?` | `{items,nextCursor}` |
| `/notifications/{id}/read` | `POST` | — | `200 {notification}` |
| `/me/notification-preferences` | `PUT` | `{pushEnabled,riskEnabled,weatherEnabled,quietHours?}` | `200 {preferences}` |

> [!SECURITY]
> Assistant message maximum is 1,500 characters. It may return only whitelisted actions: `OPEN_NEARBY_SERVICES`, `OPEN_SAFE_ROUTE`, `OPEN_SOS_CONFIRMATION`, `OPEN_EMERGENCY_NUMBER`. Render returned text as plain text or sanitized markdown—never raw HTML.

---

## ⚙️ Versioning, Observability and Testing

- Add fields compatibly; do not remove or change field meaning inside `v1`.
- Send `X-Request-Id`; preserve or generate it at the gateway.
- Document request/response fixtures in `apps/api/test/fixtures/`.
- Publish a machine-readable `openapi.yaml` derived from this contract before frontend integration begins.
