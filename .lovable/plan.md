

# Headless Backend API for Mobile App

## Overview
Refactor the project to expose a complete, documented REST API through backend functions that a native mobile app can consume. All existing database tables, AI features, and business logic remain intact. New endpoints will be added for authentication and data access, with an OpenAPI specification documenting everything.

## What Already Works as API
The following backend functions already serve as REST endpoints and need no changes (only CORS is already configured):
- `weather` - Weather data by lat/lon
- `chat` - AI streaming chat
- `crop-scan` - Disease detection from image
- `translate` - Text translation to Telugu
- `market-prices` - Mandi price data
- `govt-schemes` - Government scheme listings
- `agri-news` - Agriculture news feed
- `youtube-fetch` - Video content ingestion
- `azure-tts` - Text-to-speech audio

## New Endpoints to Create

### 1. `auth` Edge Function
A single endpoint handling mobile authentication via request body `action` field:
- `signup` - Email/password registration, returns session token
- `login` - Email/password login, returns access + refresh tokens
- `logout` - Invalidates session
- `refresh` - Exchanges refresh token for new access token
- `reset-password` - Sends password reset email
- No browser redirects -- all responses are pure JSON with tokens

### 2. `data` Edge Function
A single endpoint to query all public database tables, replacing the need for direct Supabase client access from the mobile app:
- `GET alerts` - Active alerts
- `GET schemes` - Published government schemes
- `GET videos` - Published learning videos
- `GET mandis` - Mandi locations
- `GET farming_methods` - Published farming methods
- `GET news` - Published news articles
- `POST feedback` - Submit farmer feedback

The `table` and optional filters are passed in the request body. This function uses the service role key server-side so the mobile app only needs the anon key for authorization.

### 3. OpenAPI Specification (`openapi.yml`)
A comprehensive spec file in the project root documenting:
- All endpoint URLs, methods, request/response schemas
- Authentication flow (Bearer token via anon key + user JWT)
- Error response formats (429, 402, 500)
- Each existing and new edge function

## Security Configuration

### CORS
All edge functions already use `Access-Control-Allow-Origin: *` which permits mobile app requests. No changes needed.

### RLS
Existing RLS policies remain intact:
- Public tables (alerts, schemes, videos, etc.) use `SELECT` policies allowing reads
- Feedback allows anonymous `INSERT`
- Admin operations require authentication
- The `data` function will respect these policies by using the anon key for public reads

### Authentication
- The `auth` function will use Supabase Admin Auth API server-side
- Mobile app stores tokens locally and sends them as `Authorization: Bearer <token>` headers
- No redirect-based auth flows -- everything returns JSON

## Config Changes
- Add `auth` and `data` functions to `supabase/config.toml` with `verify_jwt = false` (JWT validation happens inside the function logic)

## Technical Details

### File Changes
| File | Action |
|------|--------|
| `supabase/functions/auth/index.ts` | Create - auth endpoint |
| `supabase/functions/data/index.ts` | Create - data query endpoint |
| `openapi.yml` | Create - full API specification |
| `supabase/config.toml` | Update - add new function entries |

### Auth Endpoint Request/Response Examples

```text
POST /functions/v1/auth
Body: { "action": "login", "email": "...", "password": "..." }
Response: { "access_token": "...", "refresh_token": "...", "user": {...} }

POST /functions/v1/auth
Body: { "action": "signup", "email": "...", "password": "..." }
Response: { "access_token": "...", "refresh_token": "...", "user": {...} }
```

### Data Endpoint Request/Response Examples

```text
POST /functions/v1/data
Body: { "table": "alerts", "filters": { "active": true }, "limit": 10 }
Response: { "data": [...], "count": 10 }

POST /functions/v1/data
Body: { "table": "feedback", "action": "insert", "record": { "message": "...", "name": "..." } }
Response: { "success": true, "id": "..." }
```

### No Changes to Existing Frontend
The web app continues to work as-is. These new endpoints are additive and designed for the external mobile app to consume.

