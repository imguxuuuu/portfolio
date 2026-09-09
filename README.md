# Gururaghuraman Sethuraman Portfolio

Professional portfolio website for Gururaghuraman Sethuraman, an Electrical
and Electronics Engineer focused on semiconductor devices, nanoelectronics,
and manufacturing.

The published site is hosted with GitHub Pages at
<https://imguxuuuu.github.io/portfolio/>.

## Project overview

This is a dependency-free static website. It is designed to be deployed from
the repository root without a build step.

| Path | Purpose |
| --- | --- |
| `index.html` | Page structure, portfolio content, metadata, and external CDN references |
| `style.css` | Responsive presentation and accessibility-focused visual states |
| `script.js` | Navigation, animation, canvas, and interaction behavior |
| `assets/` | Profile image, favicon, and downloadable resume |
| `robots.txt` and `sitemap.xml` | Search-engine discovery configuration |
| `DEPLOY_TO_GITHUB_PAGES.md` | GitHub Pages deployment instructions |

## Run locally

The site can be opened directly from `index.html`. For behavior closer to the
published site, serve the repository root with any static HTTP server, for
example:

```powershell
npx serve .
```

Then open the address printed by the server. No installation or build command
is required by this repository itself.

## Deployment

GitHub Pages should publish from the `main` branch and repository root. The
canonical deployment instructions are in
[`DEPLOY_TO_GITHUB_PAGES.md`](DEPLOY_TO_GITHUB_PAGES.md).

Before publishing content changes, verify the live URL, resume link, contact
links, mobile layout, social-preview metadata, `robots.txt`, and `sitemap.xml`.

## Content and privacy

This repository contains personal portfolio information, including a resume,
profile image, career history, and contact details. Do not add credentials,
private records, API keys, or other sensitive information to the repository.

The code and personal portfolio content have different reuse terms. See
[`LICENSE`](LICENSE) for the scope of the MIT License and excluded content.

## Security

To report a vulnerability, follow the private reporting guidance in
[`SECURITY.md`](SECURITY.md). Do not open a public issue for an unpatched
security concern.

## Repository access

This is a personal portfolio repository. External contributions, pull
requests, and content changes are not accepted. Please use the contact details
published on the website for professional enquiries. Security concerns should
be reported privately as described in [`SECURITY.md`](SECURITY.md).
