# Pearson Pharmaceutical Website - AI Coding Agent Instructions

## Project Overview
This is a B2B pharmaceutical e-commerce website for Pearson Pharmaceutical. It's a static HTML/CSS/JavaScript application (no backend framework) that showcases pharmaceutical products, enables product filtering, inquiry management, and contact functionality. Deployed as a GitHub Pages site.

**Key Facts:**
- Stack: Vanilla HTML5, CSS3 (custom design system), vanilla JavaScript (modularized)
- Product Data: JSON arrays in `data/products.js` and `data/appsettings.js`
- Architecture: Modular JavaScript with dynamic module loading; single-page-like experience with smooth scrolling navigation
- Content: 9+ pharmaceutical products across categories (Pain Relief, Antibiotic, Allergy Care, etc.)
- **Module Entry Point:** `js/app.js` — dynamically loads all modules and initializes the application

## Architecture & Data Patterns

### Modular JavaScript Architecture
The application uses a **modular architecture** with centralized dynamic module loading:

**Entry Point: `js/app.js`**
- Declares shared globals (`currentSlide`, `inquiryList`, `currentProduct`, etc.)
- **Dynamically loads all modules** in sequence via `loadModules()` on `DOMContentLoaded`
- Initializes app features via `initializeAppAfterModules()` after all modules load
- Single script tag in `index.html`: `<script src="js/app.js"></script>`

**Module Load Order (automatic):**
1. `data/products.js` — product data array
2. `data/appsettings.js` — company metadata
3. `data/homeSlide.js` — home slider image data
4. `js/header.js` — navigation and header utilities
5. `js/footer.js` — notifications, loading overlay, appsettings population
6. `js/productCard.js` — product card creation, image resolution
7. `js/productModal.js` — product modal and image slider
8. `js/product.js` — product list display and filtering
9. `js/inquiry.js` — inquiry management (add, remove, modal, clear)
10. `js/contact.js` — form validators and contact form handler
11. `js/home.js` — home slider logic and `initializeApp()` definitions

**Index.html**
Only one script reference:
```html
<script src="js/app.js"></script>
```

All modules are loaded dynamically by `app.js` with error handling and sequential load order (async: false).

### Configuration System (`data/appsettings.js`)
All company metadata is centralized in a single `appsettings` object. This is intentional for easy multi-tenant rebranding.

**Key pattern:** Populate UI from `window.appsettings` in initialization:
- Company name, tagline, description
- Contact: address, phone, email
- Regulatory: GST number, drug licenses, establishment year
- Logo path (single image used for favicon, header, and page title)

**Important:** The `populateAppSettings()` function runs on DOMContentLoaded and updates:
- Page `<title>` and meta description
- Footer copyright (auto-calculates year)
- All contact links and regulatory info elements

When modifying company details, update `appsettings.js`, not HTML templates.

### Product Data (`data/products.js`)
Product array with this structure (see `Pearflam-SP` as example):
```javascript
{
  id: "001",
  name: "Product Name",
  category: "Pain Relief" | "Antibiotic" | "Allergy Care" | etc.,
  composition: "Detailed pharmaceutical composition",
  indications: "Medical conditions it treats",
  dosage: "How to use",
  packaging: "Format and quantity",
  image_folder: "bitson" // correlates to images/bitson/ directory
}
```

**Image resolution pattern:**
- Products use folder-based organization: `images/{image_folder}/main.png` + numbered variants
- `resolveProductImages()` auto-discovers images via file probing (tries: main.png, 1.png, 2.png, etc.)
- Main images sorted first; others follow as carousel images
- Graceful fallback: if no images exist, shows emoji pill icon (💊)

### Design System (`css/style.css`)
Uses CSS custom properties (variables) extensively:
- **Colors:** `--color-teal-500`, `--color-red-500`, `--color-cream-50`, etc. (both RGBA and RGB variants)
- **Spacing:** Utility classes like `.py-16` (padding-y)
- **Shadows & Radius:** `--shadow-lg`, `--radius-lg`
- **Typography:** `--font-family-base` (Inter 300-700 weights from Google Fonts)

Pattern: Always reference CSS vars instead of hardcoding colors in JS. Example:
```javascript
notification.style.borderColor = 'var(--color-success)';
```

### Modular CSS Structure

This project uses a modular CSS approach with a single entrypoint: `css/style.css`.
- `css/style.css` is the only stylesheet referenced from `index.html` — it must `@import` the component files in a fixed order.
- `css/tokens.css` contains design tokens (colors, spacing, typography) and must be imported first so other modules can reference variables.
- Recommended import order in `css/style.css`:
   1. `tokens.css` (variables & theme blocks)
   2. `base.css` (normalize, root typographic rules)
   3. `utilities.css` (helpers, spacing, containers)
   4. Component files (e.g. `header.css`, `cards.css`, `modal.css`, `slider.css`)
   5. `responsive.css` (media queries & overrides)

How to add a new component stylesheet:
- Create `css/<component>.css` and scope rules to that component (keep selectors specific and avoid global overrides).
- Add a top-level `@import "<component>.css";` line in `css/style.css` following the recommended order.
- Do not place `@import` statements inside any selector or ruleset — they must be at the top-level of the stylesheet.

Theme handling and tokens:
- Keep color and spacing tokens in `css/tokens.css`. Use `prefers-color-scheme` and `[data-color-scheme="..."]` blocks inside `tokens.css` for light/dark overrides.
- Components should use semantic variables like `--color-text`, `--color-surface`, and `--color-primary` (do not hardcode raw colors).

Troubleshooting tips:
- If imported files don't load, confirm `@import` lines are at the top of `css/style.css` (not nested inside `:root` or other rules).
- Use the browser Network tab to verify each `css/*.css` file is requested and check Console for parse errors.
- Clear browser cache after font or stylesheet swaps to avoid stale resources.

Performance & build notes:
- For production, consider concatenating and minifying the CSS into a single file to reduce requests.
- If you prefer local hosting for third-party fonts/icons, ensure the font files are fresh (re-download Font Awesome or host SVGs) to avoid glyph/woff warnings.


## Module Reference Guide

### Core Modules

**`js/app.js`** (Main entry point)
- Globals: `currentSlide`, `currentProductSlide`, `inquiryList`, `currentProduct`, `homeAutoAdvance`
- Functions: `loadModules()` (dynamic loader), `initializeAppAfterModules()` (initialization orchestrator)
- Loads all data and module files in sequence on DOMContentLoaded

**`js/header.js`** (Navigation & header)
- `initializeNavigation()` — wire up nav link click handlers
- `navigateToSection(sectionName)` — smooth scroll to section
- `navigateToHome()`, `navigateToProducts()`, `navigateToContact()` — shorthand nav functions
- `debounce(fn, wait)` — debounce utility for resize events
- `updateContactLinkState()` — disable/enable phone/email links based on screen size
- Contact link click prevention on desktop (aria-disabled)

**`js/footer.js`** (Utilities & app settings)
- `showNotification(message, type)` — show toast notification (success/error/warning/info)
- `showLoading()`, `hideLoading()` — loading overlay control
- `populateAppSettings()` — populate footer, company name, logo, contact info from `window.appsettings`
- Contact link behavior (prevent desktop clicks)

**`js/productCard.js`** (Product card creation)
- `slugifyName(name)` — convert name to slug
- `getImageFolder(product)` — resolve image folder path
- `resolveProductImages(product, callback)` — async image resolution with fallback
- `createProductCard(product)` — create product card DOM element with image and click handlers

**`js/productModal.js`** (Product detail modal)
- `openProductModal(productId)` — open product detail modal
- `closeProductModal()` — close modal with animation
- `updateModalContent(product)` — update modal text fields
- `setupProductImageSlider(images)` — render image carousel in modal
- `goToProductSlide(index)` — navigate carousel
- `nextProductImage()`, `previousProductImage()` — carousel navigation
- `addToInquiry()` — add current product from modal to inquiry list
- Keyboard support: Escape (close), Arrow keys (navigate slider)

**`js/product.js`** (Product list & filtering)
- `displayProducts(productsArr)` — render all products to grid
- `initializeProductFilters()` — wire up filter button click handlers
- `filterProducts(category)` — show/hide cards by category

**`js/inquiry.js`** (Inquiry management)
- `addProductToInquiry(productId)` — add product to inquiry list
- `removeFromInquiry(productId)` — remove from inquiry list
- `updateInquiryCount()` — update count badge in header
- `updateInquiryList()` — render inquiry modal list
- `toggleInquiryCart()` — open inquiry modal
- `closeInquiryModal()` — close inquiry modal
- `clearInquiries()` — empty inquiry list
- `sendInquiry()` — submit inquiry (currently "Under Construction" placeholder)

**`js/contact.js`** (Contact form)
- `isValidEmail(email)` — email regex validator
- `isValidPhone(phone)` — phone validator (7+ digits)
- `initializeForms()` — wire up contact and inquiry forms
- `handleContactForm(e)` — validate and submit contact form (placeholder)

**`js/home.js`** (Home slider & app init)
- `initializeHomeSlider()` — load home slides from `data/homeSlide.js`
- `renderHomeSlidesFromImages(images, slider, dotsContainer)` — render slider DOM
- `goToSlide(index)`, `nextSlide()`, `previousSlide()` — slider navigation
- `initializeApp()` — legacy stub (calls individual init functions)
- `loadProductData()` — load and display products

### Critical Initialization Flow

When page loads:
1. `index.html` loads `js/app.js`
2. App.js declares globals and listens for DOMContentLoaded
3. On DOMContentLoaded, `loadModules()` runs
4. `loadModules()` dynamically injects script tags for all modules in order
5. After all modules load, `initializeAppAfterModules()` runs:
   - Calls `populateAppSettings()` (populate footer, company info)
   - Calls `initializeNavigation()` (wire up nav)
   - Calls `initializeHomeSlider()` (setup home carousel)
   - Calls `loadProductData()` (display products)
   - Calls `initializeProductFilters()` (wire up filter buttons)
   - Calls `initializeForms()` (wire up forms)
   - Calls `updateContactLinkState()` (adjust link behavior for mobile)
   - Calls `updateInquiryCount()` (initialize count badge)

## Critical Workflows
**No traditional routing.** Uses smooth scroll navigation:
- `navigateToSection(sectionName)` - smooth scrolls to section by ID
- Updates active nav link highlight based on target section
- Three main sections: `#home`, `#products`, `#contact`
- Keyboard support: Arrow keys navigate sliders, Escape closes modals

### Dynamic Module Loading
All JavaScript modules are loaded dynamically from `js/app.js`:
1. On DOMContentLoaded, `loadModules()` creates script elements for each module
2. Scripts load in sequential order (async: false) to maintain dependency chain
3. Each module is self-contained with no global state pollution
4. After last module loads, `initializeAppAfterModules()` triggers app init
5. All modules share access to globals declared in `app.js` (currentSlide, inquiryList, etc.)

### Product Discovery Flow
1. `displayProducts(products)` - renders all product cards into `#productsGrid`
2. `filterProducts(category)` - shows/hides cards by data-category attribute (no DOM manipulation)
3. `openProductModal(productId)` - shows detailed modal with:
   - Dynamic product data (composition, indications, etc.)
   - Auto-resolved image carousel
   - Modal can be closed via Escape key or clicking backdrop

### Inquiry Management (Shopping Cart-like)
Products can be added to inquiries (not a real cart):
- `addToInquiry(productId)` - adds to `inquiryList` array, shows notification
- `removeFromInquiry(productId)` - removes from array
- `inquiryList` stored in memory only (no persistence)
- `toggleInquiryCart()` opens modal showing all inquiry items
- `sendInquiry()` currently shows "Under Construction" (email disabled)

### Form Handling Pattern
Two forms with identical validation pattern:
- Contact form (`#contactForm`) → `handleContactForm()`
- Inquiry form (`#InquiryForm`) → `sendInquiry()`

**Validators:**
- `isValidEmail()` - basic regex
- `isValidPhone()` - requires 7+ digits with standard separators

Both forms currently disabled (show placeholder "Under Construction" notification).

## Project-Specific Conventions

### Naming Conventions
- HTML IDs: camelCase (`productModal`, `inquiryCart`, `modalProductName`)
- CSS classes: kebab-case (`.nav-link`, `.product-card`, `.inquiry-modal`)
- JavaScript functions: camelCase, descriptive action verbs (`resolveProductImages`, `setupProductImageSlider`)
- Data attributes: lowercase (`data-category`, `data-section`)

### Error Handling
- Global error listener logs to console and shows user-friendly notification
- Invalid product IDs in `openProductModal()` log error and return early
- Image load failures don't break page; fallback to emoji pill icon
- Missing form elements wrapped in optional chaining checks

### Accessibility Features
- Phone/email links disabled on desktop (aria-disabled), enabled on mobile (`updateContactLinkState()`)
- Keyboard navigation: Escape for modals, Arrow keys for sliders
- Image alt text generated dynamically
- Modal backdrop click-to-close pattern (event delegation on `.modal` class)

### Performance Considerations
- Home slider auto-advances every 5 seconds; timer resets on manual navigation (prevents UI jank)
- Touch swipe threshold: 40px minimum (prevents accidental swipes)
- Notifications auto-remove after 5 seconds
- Image preloading via `new Image()` to detect file existence before rendering

## Adding/Modifying Products

**To add a product:**
1. Add new object to `products` array in `data/products.js`
2. Ensure `image_folder` value matches a directory in `images/`
3. Place product images in `images/{image_folder}/` named `main.png`, `1.png`, `2.png`, etc.
4. Ensure `category` matches a filter button value in HTML
5. Reload page; product appears automatically

**To modify company branding:**
- Edit `appsettings.js`: name, description, contact, regulatory, logoPath
- Do NOT edit HTML footer/header templates; they populate from settings
- Update `images/logo.svg` if changing company logo

## Common Patterns to Extend

### Adding a New Modal Dialog
1. Create HTML: `<div id="myModal" class="modal hidden"> ... </div>`
2. Add toggle function: `toggleMyModal()` - remove hidden class, set display: flex, opacity: 1
3. Add close function: close by setting opacity: 0, then hidden class after 300ms
4. Wire global click listener: `e.target.classList.contains('modal')` pattern
5. Add Escape key support in existing keydown listener

### Adding a New Filter or Category
1. Add button to `.products-filter` with `data-category="NewCategory"` (exact match to product.category)
2. Products filter automatically; no JS changes needed (CSS classes handle display)

### Extending Image Resolution
- Modify `resolveProductImages()` to support additional filename patterns
- Current logic: tests 0-10 indexed filenames (main.png, 1.png...10.png)
- Custom patterns can be added to `candidateUrls` array before image probing loop

## Testing Notes
- No automated tests in repository
- Manual testing required for:
  - Image loading (ensure image folders exist and are named correctly)
  - Mobile responsiveness (test on 768px breakpoint)
  - Touch swipe on actual mobile devices (40px threshold)
  - Contact link behavior (desktop vs mobile)
