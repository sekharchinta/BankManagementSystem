# Deployment Guide (PaaS)

Deploy the backend to **Render** or **Railway**, and the frontend to **Vercel** or **Netlify**. Everything is hosted, no VPS/Nginx required.

## Architecture

```
Browser
   │  SPA calls VITE_API_URL (absolute URL of your backend, e.g. https://bank-api.onrender.com/api/)
   │  JWT in localStorage; axios interceptor auto-refreshes on 401
   ▼
Vercel / Netlify (static frontend: frontend/dist)
   │
   ▼  CORS (CORS_ALLOWED_ORIGINS) allows your frontend domain
Render / Railway (gunicorn config.wsgi:application) + WhiteNoise (serves /admin/ static)
   │
   ▼
MySQL (Railway MySQL, Aiven, DigitalOcean Managed MySQL, etc.)
```

Because the frontend and backend live on **different domains**, this setup uses
CORS instead of a reverse proxy. Set `VITE_API_URL` at build time to the backend URL.

---

## 1. Backend on Render (or Railway)

### Render

1. Push the repo to GitHub (done). Go to [render.com](https://render.com) → **New → Blueprint**,
   and select the repo. `render.yaml` at the root auto-creates the web service.
   Or use **New → Web Service** and pick the `backend` directory manually.

   Web Service settings:
   - Root Directory: `backend`
   - Environment: Python 3 (uses `runtime.txt` → Python 3.12.7)
   - Build Command: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
   - Start Command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 3`

2. Environment variables (Service → Environment):

   | Key                     | Value                                                        |
   | ----------------------- | ------------------------------------------------------------ |
   | `DEBUG`                 | `False`                                                      |
   | `SECRET_KEY`            | long random string (Render can generate it)                  |
   | `ALLOWED_HOSTS`         | `*` (or your `.onrender.com` domain)                         |
   | `CORS_ALLOWED_ORIGINS`  | `https://your-frontend.vercel.app,https://your-frontend.netlify.app` |
   | `DB_NAME`               | `bank_management_system`                                     |
   | `DB_USER`               | your MySQL user                                              |
   | `DB_PASSWORD`           | your MySQL password                                          |
   | `DB_HOST`               | your MySQL host                                              |
   | `DB_PORT`               | `3306`                                                       |
   | `DB_SSL`                | `True` (Aiven and some others require TLS)                   |
   | `DB_SSL_CA`             | *(optional)* path to the CA cert file                        |

   > Render has **no managed MySQL**. Use one of: Railway MySQL add-on, Aiven for MySQL,
   > DigitalOcean Managed MySQL, or Clever Cloud. `mysqlclient` installs fine on Render
   > (manylinux wheels for Python 3.12).

3. Render runs migrations for you? **No** — run them once after first deploy:
   ```bash
   # local, after wiring DB_HOST/DB_PASSWORD to the remote DB
   python manage.py migrate
   python manage.py seed_demo   # optional demo data
   ```
   Or add `python manage.py migrate` to the Build Command (runs on every deploy).

4. Your API is now at `https://<service-name>.onrender.com/api/`. Note the URL for step 3.

### Railway (alternative backend)

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**.
   Set the root to `backend` (or use the `railway.toml`-free flow and set these):

   - Start Command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 3`
   - Env vars: same table as Render above (`DEBUG`, `SECRET_KEY`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `DB_*`).

2. **MySQL**: Railway → New → **Database** → **MySQL**. Copy the generated
   `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`
   values into the backend service's `DB_*` vars.

3. Note the backend URL: `https://<service-name>.up.railway.app/api/`.

---

## 2. MySQL (if not using Railway MySQL)

Aiven (free tier) or DigitalOcean Managed MySQL. From the provider get: host, port,
user, password, database name. Put them in the backend `DB_*` env vars.

> **Aiven enforces TLS.** Set `DB_SSL=True` on the backend (uses `ssl_mode=REQUIRED`,
> no certificate file needed). For full certificate verification instead, download
> Aiven's **CA Certificate**, place it in `backend/`, and set `DB_SSL_CA` to its path.
> Your local `.env` can enable SSL the same way.

---

## 3. Frontend on Vercel or Netlify

### Vercel

1. [vercel.com](https://vercel.com) → **Add New Project** → import the repo.
2. Root Directory: `frontend`
3. Framework Preset: **Vite** (Vercel detects it). Build `npm run build`, output `dist`.
4. Environment Variable (Project Settings → Environment Variables):

   | Key             | Value                                                     |
   | --------------- | --------------------------------------------------------- |
   | `VITE_API_URL`  | `https://<your-backend>/api/` (from step 1 or 2)          |

5. Deploy. `frontend/vercel.json` already enables SPA fallback
   (client-side routes like `/dashboard` reload correctly).

### Netlify

1. [netlify.com](https://netlify.com) → **Add new site → Import an existing project** → pick the repo.
2. Build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
3. Environment Variable (Site Settings → Environment Variables):
   `VITE_API_URL = https://<your-backend>/api/`
4. Deploy. `frontend/netlify.toml` already sets the build/publish and the SPA
   redirect (`/* → /index.html`). Update the placeholder `VITE_API_URL` in
   `netlify.toml` (or override it with the env var above).

---

## 4. Wire up CORS

Backend env var must list the exact frontend origin(s):

```
CORS_ALLOWED_ORIGINS=https://mybank.vercel.app,https://mybank.netlify.app,http://localhost:5173
```

No trailing slash. Add `https://<your-backend>/api/` to `VITE_API_URL` on the frontend.

---

## 5. Go-live checklist

- [ ] `DEBUG=False`, a **new random** `SECRET_KEY`, `ALLOWED_HOSTS` set
- [ ] `CORS_ALLOWED_ORIGINS` includes your real frontend domain
- [ ] `VITE_API_URL` points at the HTTPS backend URL (built into the deployed bundle)
- [ ] `python manage.py migrate` ran against the production DB
- [ ] `collectstatic` ran (WhiteNoise serves Django admin at `/admin/`)
- [ ] Run `python manage.py createsuperuser` — do **not** use the seeded demo passwords
      (`Admin@123` etc.) on production; `seed_demo` is only for testing
- [ ] JWT defaults are sane (access 60 min, refresh 7 days, rotation on)
- [ ] Test end-to-end: open the frontend URL, register a customer, log in as admin
      (`/admin` for Django admin, or via the app UI)

## Rebuilding after backend changes

Push to `main` → Render/Railway auto-deploys (from `render.yaml`, or the service's
deploy hook). Push to the frontend root → Vercel/Netlify rebuilds. New frontend
env vars require a manual **redeploy** (env vars are baked in at build time).
