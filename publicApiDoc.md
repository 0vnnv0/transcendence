# Public API Documentation

## Overview

The Transcendence project provides a public REST API for interacting with selected data in the database.

The public API is available over **HTTPS** and is protected by an API client ID and API key.

### Base URL

```text
https://localhost:8443/api/public
```

For local development, the `-k` option may be required with `curl` because the project uses a local/self-signed TLS certificate.

---

## Authentication

Every request to the public API must include the following HTTP headers:

```http
X-API-Client: <your-client-id>
X-API-Key: <your-api-key>
```

Example:

```bash
curl -k https://localhost:8443/api/public/friendships/pbohme \
  -H "X-API-Client: <your-client-id>" \
  -H "X-API-Key: <your-api-key>"
```

Requests with missing or invalid credentials are rejected with:

```http
401 Unauthorized
```

```json
{
  "error": "Invalid API credentials"
}
```

---

# Endpoints

## Users

### GET `/api/public/users`

Returns the available users.

Example:

```bash
curl -k https://localhost:8443/api/public/users \
  -H "X-API-Client: <your-client-id>" \
  -H "X-API-Key: <your-api-key>"
```

---

### GET `/api/public/users/:login`

Returns information about a specific user.

#### Path parameter

| Parameter | Description         |
| --------- | ------------------- |
| `login`   | The user's 42 login |

Example:

```bash
curl -k https://localhost:8443/api/public/users/pbohme \
  -H "X-API-Client: <your-client-id>" \
  -H "X-API-Key: <your-api-key>"
```

---

### GET `/api/public/users/:login/:slug/matches`

Returns matches for a specific user and project slug.

#### Path parameters

| Parameter | Description         |
| --------- | ------------------- |
| `login`   | The user's 42 login |
| `slug`    | Project slug        |

Example:

```bash
curl -k https://localhost:8443/api/public/users/pbohme/project-slug/matches \
  -H "X-API-Client: <your-client-id>" \
  -H "X-API-Key: <your-api-key>"
```

---

## Projects

### GET `/api/public/users/:login/projects?view=available`

Returns the projects available to the specified user.

Example:

```bash
curl -k "https://localhost:8443/api/public/users/pbohme/projects?view=available" \
  -H "X-API-Client: <your-client-id>" \
  -H "X-API-Key: <your-api-key>"
```

---

### GET `/api/public/users/:login/projects?view=current`

Returns the projects the specified user is currently working on.

Example:

```bash
curl -k "https://localhost:8443/api/public/users/pbohme/projects?view=current" \
  -H "X-API-Client: <your-client-id>" \
  -H "X-API-Key: <your-api-key>"
```

---

### GET `/api/public/users/:login/projects?view=recommended`

Returns recommended projects for the specified user.

Example:

```bash
curl -k "https://localhost:8443/api/public/users/pbohme/projects?view=recommended" \
  -H "X-API-Client: <your-client-id>" \
  -H "X-API-Key: <your-api-key>"
```

---

# Friendships

The public friendship API allows external clients to create, inspect, update and delete friendships.

## GET `/api/public/friendships/:login`

Returns the friendships of a user.

### Path parameter

| Parameter | Description         |
| --------- | ------------------- |
| `login`   | The user's 42 login |

Example:

```bash
curl -k https://localhost:8443/api/public/friendships/pbohme \
  -H "X-API-Client: <your-client-id>" \
  -H "X-API-Key: <your-api-key>"
```

---

## POST `/api/public/friendships`

Creates a new friendship request.

### Request body

```json
{
  "senderLogin": "pbohme",
  "receiverLogin": "nrauh"
}
```

Both users are identified by their 42 login. The API converts the logins to database user IDs before creating the friendship.

Example:

```bash
curl -k -X POST https://localhost:8443/api/public/friendships \
  -H "X-API-Client: <your-client-id>" \
  -H "X-API-Key: <your-api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "senderLogin": "pbohme",
    "receiverLogin": "nrauh"
  }'
```

Possible errors include:

```http
400 Bad Request
```

if required fields are missing or the friendship cannot be created.

```http
404 Not Found
```

if one of the specified users does not exist.

---

## PUT `/api/public/friendships`

Updates the status of an existing friendship request.

### Request body

```json
{
  "senderLogin": "pbohme",
  "receiverLogin": "nrauh",
  "status": "ACCEPTED"
}
```

Supported statuses:

* `PENDING`
* `ACCEPTED`

The specified friendship must already exist.

Example:

```bash
curl -k -X PUT https://localhost:8443/api/public/friendships \
  -H "X-API-Client: <your-client-id>" \
  -H "X-API-Key: <your-api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "senderLogin": "pbohme",
    "receiverLogin": "nrauh",
    "status": "ACCEPTED"
  }'
```

If the friendship already has the requested status, the API returns an error instead of performing an unnecessary update.

---

## DELETE `/api/public/friendships`

Deletes an existing friendship or friendship request.

### Request body

```json
{
  "senderLogin": "pbohme",
  "receiverLogin": "nrauh"
}
```

The friendship is identified using the sender and receiver logins.

Example:

```bash
curl -k -X DELETE https://localhost:8443/api/public/friendships \
  -H "X-API-Client: <your-client-id>" \
  -H "X-API-Key: <your-api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "senderLogin": "pbohme",
    "receiverLogin": "nrauh"
  }'
```

The endpoint can remove friendships with different statuses, including pending, accepted and blocked relationships.

If no matching friendship exists:

```http
400 Bad Request
```

```json
{
  "error": "Friend request not found"
}
```

---

# Rate Limiting

The public API is protected by rate limiting to prevent excessive requests from a single client.

Requests exceeding the configured rate limit are rejected with:

```http
429 Too Many Requests
```

Clients should avoid sending unnecessary repeated requests and should retry after the configured rate-limit period.

---

# HTTPS

The public API must be accessed through HTTPS.

Correct:

```text
https://localhost:8443/api/public/...
```

Incorrect:

```text
http://localhost:8443/api/public/...
```

The nginx reverse proxy terminates the HTTPS connection and forwards the request internally to the backend over the Docker network.

```text
Client
  |
  | HTTPS
  v
nginx :443
  |
  | HTTP (internal Docker network)
  v
backend :3000
```

The backend port is not exposed directly to the host.

---

# Error Responses

The API uses standard HTTP status codes.

| Status                      | Meaning                                   |
| --------------------------- | ----------------------------------------- |
| `200 OK`                    | Request completed successfully            |
| `201 Created`               | A new resource was created                |
| `400 Bad Request`           | Invalid input or operation                |
| `401 Unauthorized`          | Missing or invalid API credentials        |
| `404 Not Found`             | Requested user or resource does not exist |
| `429 Too Many Requests`     | Rate limit exceeded                       |
| `500 Internal Server Error` | Unexpected server error                   |

---

# Public API Summary

| Method | Endpoint                                             | Description               |
| ------ | ---------------------------------------------------- | ------------------------- |
| GET    | `/api/public/users`                                  | Get users                 |
| GET    | `/api/public/users/:login`                           | Get user                  |
| GET    | `/api/public/users/:login/:slug/matches`             | Get project matches       |
| GET    | `/api/public/users/:login/projects?view=available`   | Get available projects    |
| GET    | `/api/public/users/:login/projects?view=current`     | Get current projects      |
| GET    | `/api/public/users/:login/projects?view=recommended` | Get recommended projects  |
| GET    | `/api/public/friendships/:login`                     | Get user's friendships    |
| POST   | `/api/public/friendships`                            | Create friendship request |
| PUT    | `/api/public/friendships`                            | Update friendship status  |
| DELETE | `/api/public/friendships`                            | Delete friendship/request |

All public API endpoints require:

```http
X-API-Client: <your-client-id>
X-API-Key: <your-api-key>
```

and must be accessed via HTTPS.
