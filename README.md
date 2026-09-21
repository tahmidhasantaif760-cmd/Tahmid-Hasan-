# Tahmid Hasan — Premium Digital Marketing Portfolio

A lightweight, responsive HTML/CSS/JavaScript portfolio focused only on digital marketing.

## Quick start

Open `index.html` directly in a browser, or serve the folder with any static web server.

## Central configuration

Edit **`js/config.js`**. It contains:

- NAME
- EMAIL
- LOCATION
- PROFILE_IMAGE
- WHATSAPP_NUMBER
- FACEBOOK_URL
- INSTAGRAM_URL
- LINKEDIN_URL
- GITHUB_URL
- CONTACT_FORM_ENDPOINT
- PROJECT_URL_1 to PROJECT_URL_4
- CANONICAL_URL

No private keys or credentials are included.

## Real profile/project images

Place your real image at:

`assets/images/profile.jpg`

Project images can be added later using:

- `assets/images/seo-project.jpg`
- `assets/images/google-ads-project.jpg`
- `assets/images/meta-ads-project.jpg`
- `assets/images/social-media-project.jpg`

Generic visual SVGs are included for inspiration/layout only. They contain no client claims or fabricated results.

## Contact form

The form validates input in the browser.

It **does not claim to send** until `CONTACT_FORM_ENDPOINT` is set to your backend/API endpoint in `js/config.js`.

The frontend sends JSON:

```json
{
  "name": "Visitor",
  "email": "visitor@example.com",
  "subject": "Project inquiry",
  "message": "Hello..."
}
```

Your backend should validate, sanitize, authenticate/rate-limit as appropriate, and handle CORS/CSRF according to its deployment environment.

## Included features

- Sticky glass navigation
- Responsive mobile menu
- Dark/light mode with localStorage + system preference
- Smooth anchor navigation
- Active section indicator
- Scroll progress indicator
- IntersectionObserver reveal animations
- Reduced-motion support
- Animated factual counters
- Copy-email interaction
- FAQ accordion
- Testimonial slider with placeholders
- Configurable social links
- Configurable project links
- Configurable WhatsApp link
- Accessible labels/focus styles
- Semantic HTML
- JSON-LD Person schema
- Open Graph + Twitter metadata
- Canonical URL placeholder
- No fabricated client names, companies, awards, certifications, testimonials, revenue, ROI, traffic or ranking claims

## Profile image behavior

The hero uses `assets/images/profile.jpg`. Until you add the real photo, the page falls back to the initials `TH` rather than generating a fake person.


### Updated profile image
The supplied profile photo is stored as `assets/images/profile.png` with the background removed.
