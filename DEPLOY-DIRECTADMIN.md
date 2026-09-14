# ArcheLoot Gear Calculator V15 — DirectAdmin

This package is prepared for a DirectAdmin server running Node.js 24+.
DirectAdmin supports Node.js applications through Nginx Unit when enabled. The official documentation describes creating the application and route from **User Level → Advanced Features → Nginx Unit**.

## Recommended hostname

Use a dedicated hostname, for example:

`gear.mmonexus.com.br`

Keep the IPS forum at its existing hostname. The forum only embeds:

`https://gear.mmonexus.com.br/embed`

## 1. Check Node.js

The project requires Node.js 24 or newer.

On a server where CustomBuild is available, the administrator can use the NodeSource 24 provider. Do not change the server-wide Node.js version unless you have administrator access and know other hosted applications will remain compatible.

## 2. Create the application directory

Example (replace USER and DOMAIN):

```bash
mkdir -p /home/USER/domains/DOMAIN/gear-app
chown -R USER:USER /home/USER/domains/DOMAIN/gear-app
```

Upload the contents of this ZIP into that directory. `package.json` must be directly inside `gear-app`.

## 3. Install dependencies

```bash
cd /home/USER/domains/DOMAIN/gear-app
npm ci
```

## 4. Configure production environment

Copy `.env.production.example` to `.env.production` and adjust the allowed forum origins if necessary.

```bash
cp .env.production.example .env.production
```

Do not put secrets in this file. The calculator currently does not require an API key at runtime.

## 5. Build

```bash
npm run build
```

A successful build should create `.next/`.

## 6. DirectAdmin / Nginx Unit

If **Advanced Features → Nginx Unit** is available:

1. Create the NodeJS application.
2. Set the application root to the directory containing `package.json`.
3. Use the Node.js entry/start command supported by your Unit template. For this Next.js production app the process must execute `npm start` (or an equivalent Node process that runs the Next.js production server).
4. Set the application environment to `NODE_ENV=production` and the desired `PORT` if the Unit template requires it.
5. Create a route for `gear.mmonexus.com.br` pointing to the application.
6. Enable HTTPS for the hostname in DirectAdmin.

DirectAdmin's official Nginx Unit documentation says the application must be uploaded first, then the NodeJS application and route are created in the Unit interface.

## 7. If your DirectAdmin does NOT show Nginx Unit

Do not change Apache/Nginx configuration blindly. Ask the server administrator whether Node.js applications are enabled for the account.

If you have VPS/root access, a reverse proxy can be used instead. The Node application should listen only on localhost, for example:

```bash
PORT=3000 npm start
```

Then proxy `gear.mmonexus.com.br` to `127.0.0.1:3000` using the server's supported reverse-proxy configuration.

## 8. Health check

After deployment open:

`https://gear.mmonexus.com.br/api/health`

Expected JSON contains:

```json
{"ok":true,"service":"archeloot-gear-calculator","version":"v15"}
```

## 9. Calculator URLs

Main application:

`https://gear.mmonexus.com.br/`

IPS embed:

`https://gear.mmonexus.com.br/embed`

Health:

`https://gear.mmonexus.com.br/api/health`

## 10. Put it inside IPS

Use the IPS Pages HTML/custom block and paste:

```html
<div style="width:100%;max-width:1800px;margin:0 auto;">
  <iframe
    src="https://gear.mmonexus.com.br/embed"
    title="ArcheLoot Gear Calculator"
    loading="eager"
    allow="clipboard-write"
    referrerpolicy="strict-origin-when-cross-origin"
    style="display:block;width:100%;min-height:1200px;height:calc(100vh - 80px);border:0;border-radius:12px;background:#080c0f;"
  ></iframe>
</div>
```

If IPS blocks the embed, check its Custom Embeds/domain allowlist and member-group permissions. Also confirm `IPS_FRAME_ANCESTORS` includes the exact HTTPS origin used by the forum.

## 11. Do not expose Node's port publicly

If using a reverse proxy or Nginx Unit, the public endpoint should be HTTPS on the normal web port. Do not open a separate Node port in the firewall unless you have a specific reason.

## 12. Deployment update

For a later calculator update:

```bash
cd /home/USER/domains/DOMAIN/gear-app
# upload the new release
npm ci
npm run build
```

Then restart/reload the Node application using DirectAdmin/Unit. The IPS page itself does not need to change as long as the hostname and `/embed` path stay the same.
