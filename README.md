# Ming Burger · QR Menu (El Qantara East)

A static mobile menu (Vite + vanilla JS, no framework). About 16KB gzipped before images.

```bash
npm install
npm run dev       # local dev server (also on your LAN, so you can open it on a phone)
npm run build     # output in dist/, upload to any static host
npm run preview   # serve the build locally
```

## Where to change things

| What | File |
| --- | --- |
| Items, prices, descriptions, photos, tags | `src/data/menu.js` |
| Breakfast hours, phone, address, WhatsApp, combo price | `src/config.js` |
| Colors and fonts | tokens at the top of `src/styles.css` |
| Food photos | `public/img/` (WebP, about 460px wide is enough) |

## Behaviour

- **Which menu opens:** `?menu=breakfast` / `?menu=lunch` in the URL wins. Otherwise the visitor's last choice in the
  same session, otherwise Cairo time: breakfast 7:00 AM to 2:00 PM, lunch the rest of the day.
- **`strictBreakfastHours`** (config): `false` means everything can be ordered any time. `true` greys out breakfast
  items outside breakfast hours.
- **Cart** is saved on the visitor's phone for 6 hours. It can be sent on WhatsApp (`config.whatsapp`, set to
  `null` to hide the button) or shown full screen to the cashier.

## QR codes

Point the main QR at the site root. For a QR that always opens one menu (on breakfast tables, for example), use
`https://<domain>/?menu=breakfast`.
