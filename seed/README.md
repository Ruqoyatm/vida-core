# Deploying Vida Core

## Environment variables the API needs

DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME
JWT_SECRET          a fresh one, never the laptop's
JWT_EXPIRES_IN      15m
PORT
CORS_ORIGIN         the frontend's real address
COOKIE_SAMESITE     lax if same domain, none if different
COOKIE_SECURE       true
NODE_ENV            production
DB_SYNC             true for the first boot only

## The frontend needs

VITE_API_URL        the API's real address, set at build time

## Order

1. create the database
2. DB_SYNC=true, start the API once, confirm the tables exist
3. DB_SYNC=false, restart
4. run seed/reference-data.sql
5. run seed/first-admin.sql
6. sign in, change the admin password, create the real staff accounts