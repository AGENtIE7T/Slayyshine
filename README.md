# Cleaning Cartel website

A static website for Cleaning Cartel: a homepage plus 8 service pages and a shared cart.
It is plain HTML, CSS and a little vanilla JS. There is no build step and nothing to install.

## Pages
- `index.html`: the homepage
- `residential-cleaning.html`, `commercial-cleaning.html`, `deep-cleaning.html`, `window-cleaning.html`,
  `carpet-upholstery.html`, `handyman-repairs.html`, `move-in-move-out.html`, `sanitization.html`
- `assets/`: images, font, `cart.js` (the cart is saved in the browser's localStorage and books via WhatsApp or a phone call)

## Deploy
- **GitHub Pages:** push this folder to a repo, then go to Settings → Pages → Deploy from branch → `main` / root.
- **Netlify / Vercel / Cloudflare Pages:** import the repo. Leave the build command empty and set the output directory to `/`.

## Before going live
- Replace the placeholder phone number (+91 98765 43210) and email (hello@cleaningcartel.in) in all HTML files and in `assets/cart.js`.
- The CS Keyna font file is a demo version, so buy a web licence before launch.
- Once you have a domain, add `sitemap.xml` and use absolute URLs in the og:image tags.
