# ArcheLoot Gear Calculator — V14 / IPS deployment

## Recommended architecture

Run the Next.js calculator as a small standalone app on HTTPS and embed only `/embed` inside Invision Community Pages.

The forum does **not** need the calculator source code. This keeps the IPS page lightweight and lets the calculator be updated independently.

## 1. Build on the server

Requirements: Node 24+.

```bash
npm ci
npm run build
npm run start
```

The app listens on port 3000 by default.

For production, put it behind an HTTPS reverse proxy (Nginx, Apache, Caddy, or the hosting provider's Node proxy).

## 2. Forum origin

The default V14 frame policy allows:

- `https://mmonexus.com.br`
- `https://www.mmonexus.com.br`

If the forum is hosted on another origin, set this environment variable before building/running:

```bash
IPS_FRAME_ANCESTORS="'self' https://forum.example.com"
```

Multiple origins can be separated by spaces.

## 3. Verify the standalone app

Open:

```text
https://CALCULATOR-DOMAIN/
https://CALCULATOR-DOMAIN/embed
```

The second URL is the one intended for the forum.

## 4. Create the IPS page

In AdminCP go to **Pages → Pages** and create a page with Page Builder or Manual HTML.

Use a Custom HTML block/page and insert:

```html
<div style="width:100%;max-width:1800px;margin:0 auto;">
  <iframe
    src="https://CALCULATOR-DOMAIN/embed"
    title="ArcheLoot Gear Calculator"
    loading="eager"
    allow="clipboard-write"
    referrerpolicy="strict-origin-when-cross-origin"
    style="display:block;width:100%;min-height:1200px;height:calc(100vh - 80px);border:0;border-radius:12px;background:#080c0f;"
  ></iframe>
</div>
```

Replace `CALCULATOR-DOMAIN` with the real HTTPS hostname of the calculator.

## 5. Add to the forum menu

Pages can be added to the IPS navigation menu from the page configuration. Give it a name such as **Gear Calculator** or **ArcheLoot Gear**.

## 6. IPS 5 editor embed alternative

If your IPS installation uses the Custom Embeds feature, the calculator origin must be allowed by the site's embed whitelist and the member group must have the required embed permission. The official IPS documentation describes this under AdminCP → System → Posting & Editor → Embeds.

## 7. Final test

Test these before announcing the calculator:

- desktop and mobile
- item search and slot filtering
- equip/remove item
- temper 100–115%
- lunagems
- set detection
- Save
- New Build
- Import
- Share
- opening a shared `#build=` URL
- refreshing the embedded page
- opening the calculator while logged out

## Important

A browser `localStorage` save belongs to the member's browser/device. It is not a server-side account save. Share links are the portable way to send a build to another member.
