# AIIR Staging Website — Full Exploration & Analysis

**Site:** https://staging.devcustomprojects.com/aiir/
**Date of analysis:** 26 Nov 2026
**Scope:** every publicly reachable page, plus the WordPress/WooCommerce REST API, AJAX endpoints and route behaviour.

---

## 0. How this was done, and its limits

- **Method:** I crawled the full WordPress sitemap, every product, category, store, blog and utility page, and all known WooCommerce/WCFM routes (≈125 URLs). The REST API (`/wp-json/`, 842 routes) gave a complete inventory of pages, products, categories, users and media. I parsed every page's forms, buttons, tabs and links, and ran a link check on all 280 unique URLs.
- **Interactive testing** used real HTTP sessions: an anonymous cart session, AJAX endpoints, and form posts. Every test was **non-destructive**. No orders, accounts, reviews, inquiries, vendor applications or contact messages were created, and no emails were triggered. Form submissions used empty or invalid data to exercise validation only.
- **Not covered:**
  - **No credentials.** The logged-in customer dashboard, the vendor Store Manager dashboard and wp-admin were tested only at their access boundary.
  - **No JavaScript rendering.** No real browser or screenshots were available in this session, so visual layout, responsive behaviour, animations and JS-only modals (quick view, mini-cart drawer, enquiry popup) are described from the markup, not observed.
  - See §9 for what still needs a logged-in or browser pass.

---

## 1. Platform summary

The site is **not a custom application**. It is a **WordPress multi-vendor marketplace** built on a purchased demo theme.

| Layer | What's in use |
|---|---|
| CMS | WordPress **7.0.9** (nginx, Bluehost shared hosting) |
| Commerce | WooCommerce **10.3.7** (classic shortcode cart/checkout, not block checkout) |
| Marketplace | **WCFM** suite: WC Frontend Manager 6.7.22, WCFM Marketplace 3.6.15, WCFM Membership 2.11.9 |
| Theme | **Marketo** (Xpeedstudio) + `marketo-child`, with `marketo-features` |
| Page building | Elementor 3.33.4, ElementsKit Lite 3.7.9 (header/footer/mega-menus), Slider Revolution 6.7.17 |
| Forms | Contact Form 7 6.1.1, MetForm 4.0.4 (installed, not used on public pages) |
| Shop add-ons | YITH Wishlist 4.10.1, YITH Compare 3.3.0, Variation Swatches, Stripe Gateway 7.6.2 (installed but **not enabled**) |
| Other | WP Social (share/login/counter), GetGenie (AI writing), Kirki, Jetpack (not connected), All-in-One WP Migration, EmailKit |
| Media | Uploads offloaded to S3 (`aiir-wp-website.s3.eu-west-1.amazonaws.com`), 504 media items |
| Store config | Currency **USD**, prices shown without decimals, shipping **required** on all products, payment **Cash on Delivery only** |

**Leftovers from earlier attempts:** pages still contain shortcodes for **Dokan** (`[dokan-my-orders]`) and **WC Marketplace** (`[wcmp_vendor]`). Neither plugin is installed, so three different marketplace plugins have been tried on this site.

---

## 2. Site map & routing

All routes sit under `/aiir/` and use WordPress pretty permalinks.

### 2.1 Primary navigation (ElementsKit header)
- **Top bar:** Returns Policy · Follow Us (Facebook, X, Instagram, plus an Irish Tech News article link) · **Dashboard** (`/store-manager/`) · **Logout** · **Login** (`/my-account/`)
- **Main menu:** Home · About Us ▸ (Contact, FAQ, Terms and Conditions) · Shop · Blog · Cart icon with count
- **"All Categories" mega-menu:** Machine Learning, Digital, AI Functions, Robotics, AI Capabilities, AI Applications, AI
- **Header search:** keyword ("Find your projects") + category dropdown, searching products (`/?s=…&product_cat=…&post_type=product`)
- **Off-canvas mini-cart:** "Shopping cart", a WooCommerce cart widget refreshed via AJAX fragments

### 2.2 Footer (ElementsKit)
Logo (links to the **Xpeedstudio demo site**) · address "17 Princess Road, London" · **Categories** (5 links, all pointing to `/shop/`, not to the categories) · **Quick Links** (About, Terms, Contact, FAQ, Products) · Back to top · "© 2025 The Artificial Intelligence Institute of Ireland".

### 2.3 Route inventory

| Area | Routes |
|---|---|
| Home | `/` (= page "Home 02") plus 8 unused demo homepages `/home-01/` … `/home-09/` |
| Catalogue | `/shop/` (+ `?orderby=`, `/page/N/`, `?min_price=&max_price=`), `/product-category/<slug>/`, `/product-category/<parent>/<child>/`, `/product-tag/<slug>/`, `/product/<slug>/`, search `/?s=` |
| Showcase pages | `/product-category/` and `/product-category-v2/` (Elementor pages, **not** the category archive) |
| Cart/checkout | `/cart/`, `/checkout/` (redirects to cart when the cart is empty), `?add-to-cart=<id>`, `/?wc-ajax=…` |
| Account | `/my-account/` (+ `/orders/`, `/edit-account/`, `/lost-password/`, …), `/wp-login.php` (WP registration **disabled**) |
| Wishlist/compare | `/wishlist/`, `?add_to_wishlist=<id>&_wpnonce=`, `?action=yith-woocompare-add-product&id=`, `/yith-compare/` |
| Marketplace | `/vendor-register/`, `/vendor-registration/` (duplicate), `/vendor-membership/`, `/store-manager/<module>/`, `/store/<vendor>/` (+ `/about/`, `/policies/`, `/reviews/`, `/category/<slug>/`) |
| Content | `/blog/`, `/<post-slug>/`, `/category/<slug>/`, `/author/<user>/` |
| Info | `/about-us/`, `/contact/`, `/faq/`, `/terms-and-conditions/`, `/refund_returns/` |
| Orphan/legacy | `/dashboard/` (`[wcmp_vendor]`), `/my-orders/` (`[dokan-my-orders]`), `/sample-page/`, `/mega_menu/*`, `/elementskit-content/*`, `/?elementskit_template=header\|footer` (all publicly reachable) |
| API | `/wp-json/` (wp/v2, wc/store/v1, wc/v3, contact-form-7/v1, yith/wishlist/v1, ai1wm/v1, getgenie/v1, elementor, jetpack …), `/wp-admin/admin-ajax.php`, `/xmlrpc.php` (enabled) |

---

## 3. Module-by-module analysis

### 3.1 Global header, search & mini-cart
- **Purpose:** site-wide navigation, product search, cart access.
- **Elements:**
  - Top-bar links.
  - Social icons.
  - Login, Dashboard and Logout. All three show **at the same time for logged-out visitors**, and the Logout link has a **hard-coded nonce** (`_wpnonce=8ed86e88d7`, identical on every page and session).
  - Main menu with an About Us dropdown.
  - Category mega-menu.
  - Search form (text + category select + submit).
  - Cart icon with count, which opens the off-canvas mini-cart.
- **Search behaviour:**
  - Searching products by keyword works (`neural` returns the Neural products).
  - The category dropdown narrows results.
  - No results gives "No products were found matching your selection."
  - Searches without `post_type=product` (e.g. `/?s=ai`) return a mixed list of products and blog posts.
- **Issues:**
  - The mega-menu grouping doesn't match the real category tree. For example, Digital is a child of AI Applications but appears under Machine Learning, and Robotics belongs to AI Tech but appears under AI Functions.
  - "Machine Learning" and "AI" are menu categories that the catalogue API doesn't list (likely empty).

### 3.2 Homepage (`/`)
- **Sections:**
  1. Hero slider: 3 identical slides, "Get 50% Off / what's new", with buttons **VIEW COLLECTION** → `/shop/` and **CATEGORIES** → `/product-category/`.
  2. "What's Special?"
  3. "Are You a Developer?" with 3 identical "AI, Robotics — Get Holiday Deals — View Project" banners, all linking to `/product-category/`.
  4. **Top Categories This Week**: tabbed product carousel (Development/APIs, AI Tech, AI Functions, AI Capabilities, AI Applications).
  5. Promo banners "Basic Gift Idea" and "Get 50% Off", both referencing a "Mini Two Wheel Self Balancing Scooter" (demo copy).
  6. **Hot Sale**: tabs 16% / 25% / 33% Off, plus a deal widget ("Already Sold: 12 · Available: 1").
  7. "Ai projects" and "Gadget Makes Your Life Easy".
  8. **Featured Product**: tabs Featured Projects / Trending Projects / Hot Sale.
  9. Category list and "View Collections".
- **Product cards:** image, wishlist heart, title, price (regular and sale), star rating, **Add to cart** (AJAX `?add-to-cart=<id>`).
- **Issues:**
  - No `<h1>`.
  - Meta description is literally "Home 02".
  - 6.5 s server response and 540 KB of HTML.
  - Promo copy is Marketo demo text.

### 3.3 Shop / catalogue (`/shop/`, categories, tags, search)
- **Controls:**
  - **Sort dropdown**: Sorting (default, alphabetical), Popularity, Average rating, Newness, Price low→high, Price high→low.
  - **Grid/List view toggle.**
  - Pagination: 12 per page, 2 pages, with ← →.
- **Card actions:** Add to cart, Compare, Wishlist, and **Read more** / **View products** for non-purchasable and grouped items. List view also shows an expanded panel per product (excerpt, categories, rating, stock, quantity stepper, Add to cart, **Ask a Question**, Compare).
- **Filters:**
  - The price filter works by URL (`?min_price=0&max_price=100` returned 10 correct items), but **no filter widgets are shown**. The shop sidebar contains only the cart widget.
  - There's no attribute, vendor or rating filter UI.
- **Verified:** all sort orders return correctly ordered results; page 2 returns the remaining 7 products; category and sub-category archives list the right products.
- **Category tree:**

  | Category | Parent | Products |
  |---|---|---|
  | AI Applications | — | 9 |
  | ↳ Digital | AI Applications | 1 |
  | Development/APIs | — | 9 |
  | AI Tech | — | 7 |
  | ↳ Robotics | AI Tech | 1 |
  | AI Capabilities | — | 6 |
  | AI Functions | — | 4 |
  | Uncategorized | — | 4 |
  | Computer Accessories | — | 1 |

  There is 1 tag ("Sed perspiciatis vo", lorem ipsum) and 1 attribute (`color`).

### 3.4 Product detail (`/product/<slug>/`)
- **Layout:**
  - Breadcrumb.
  - Image gallery with lightbox.
  - Title.
  - **Store: <vendor>** link.
  - Rating and categories.
  - Price (regular/sale).
  - Stock ("13 in stock", "1 in stock").
  - Quantity stepper (−/+; hidden when stock is 1).
  - **Add to cart**, **Ask a Question**, **Compare**, **Wishlist**.
- **Tabs:**
  - Description.
  - **Reviews (n):** star breakdown and a review form with Name\*, Email\*, Rating\* (Perfect…Very poor), Review\*, and "save my details".
  - **More Offers:** WCFM "same product from other vendors"; always "No more offers".
  - **Store Policies:** empty.
  - **Inquiries:** WCFM public Q&A; "There are no inquiries yet".
- Related products appear below the tabs.
- **Issues:**
  - Placeholder text "If you finish the payment today, your order will arrive within the estimated delivery time."
  - Store Policies tab is empty.
  - Many products are test data (§8.3).

### 3.5 Cart (`/cart/`)
- **Empty state:** "Your cart is currently empty." with a **Return to shop** button.
- **With items:**
  - Quantity stepper.
  - Remove item.
  - **Coupon** field with **Apply coupon**.
  - **Update cart.**
  - **Shipping calculator** (country, state, city, postcode).
  - Totals.
  - Proceed to checkout.
- **Tested:**
  - Add to cart shows "“AI Smart Tools” has been added to your cart. View cart".
  - An invalid coupon returns "Coupon "fakecode123" cannot be applied because it does not exist."
  - The cart persists via the `wp_woocommerce_session_*` cookie, and the Store API cart matches it.
- **Shipping options:** **Free shipping** and **Flat rate** are both offered with no threshold, so flat rate has no purpose.
- **Edge cases:**
  - Adding quantity 5 of a product with stock 1 via URL **silently did nothing**. The item wasn't added and no notice appeared on the landing page.
  - Adding the grouped product "Mouse" (no child products) also did nothing.

### 3.6 Checkout (`/checkout/`)
- **Forms on the page:**
  - Returning-customer login toggle (username/email, password, remember me).
  - Coupon toggle.
  - Main checkout form:
    - **Billing:** Email\*, First name\*, Last name\*, Company, Country\*, Street address\*, Apt/suite, Town/City\*, State\*, ZIP\*, Phone\*.
    - **Create account?** (adds a password field).
    - **Ship to a different address?** (full shipping block).
    - **Order notes.**
    - **Shipping method** (Free / Flat rate).
    - **Payment:** Cash on delivery only.
    - **Place order.**
- **Validation (tested):** submitting with an invalid email and empty fields returned all required-field errors plus "Invalid payment method".
- **Bug:** the email error reads `Billing Email address <button class="stripe-gateway-stripelink-modal-trigger"></button> is not a valid email address`. Stripe Link button markup is injected into the field label and shows up as escaped HTML.
- **Config issues:**
  - Only COD is enabled. Stripe is installed (v7.6.2, outdated) but switched off.
  - The default country and labels are US ("ZIP Code", "State").
  - Currency is USD for an Irish organisation.
  - Shipping address is required for digital/AI products.

### 3.7 Customer account & authentication (`/my-account/`)
- **Logged out:**
  - **Login** form: username/email\*, password\*, Remember me, Log in, "Lost your password?".
  - **Register** form: email\*, password\*.
  - **Become a Vendor** link → `/vendor-register/`.
- **Tested responses:**

  | Test | Response |
  |---|---|
  | Empty login | "Username is required." |
  | Unknown user | "The username … is not registered on this site." |
  | Known user `admin` + wrong password | "The password you entered for the username **admin** is incorrect." This confirms account names exist (enumeration). |
  | Invalid registration email | "Please provide a valid email address." |
  | Lost password, unknown user | "Invalid username or email." |
  | `/wp-login.php?action=register` | Redirects to `registration=disabled` (WP core sign-up is off; WooCommerce registration is the only path) |

- **Protected routes:** `/my-account/orders/` and `/edit-account/` show the login form when logged out. `/store-manager/*` redirects to `/my-account/`. `/wp-admin/` redirects to `wp-login.php`.
- **Logged-in dashboard:** not testable without credentials. Standard WooCommerce sections are expected: Dashboard, Orders, Downloads, Addresses, Account details, Logout, plus WCFM additions.

### 3.8 Wishlist (YITH) — `/wishlist/`
- The page title reads **"My wishlist on MarketPress"** (demo text).
- **Empty state:** table headers (Product name, Unit price, Stock status) with "No products added to the wishlist".
- The heart icon on cards adds the item via AJAX with a nonce. A plain request without JS didn't add anything, so the add flow needs browser verification.

### 3.9 Compare (YITH)
- **Compare** on cards and product pages calls `?action=yith-woocompare-add-product&id=<id>`. The comparison table opens in a popup/iframe (`yith-woocompare-view-table`), which responds correctly.
- The `/yith-compare/` page shows a raw, unrendered **`[yith_woocompare_table]`** shortcode plus a legacy footer block.

### 3.10 Multi-vendor marketplace (WCFM)

**a) Vendor registration — `/vendor-register/` and duplicate `/vendor-registration/`**
- **Fields:**
  - Username\*, Email\* (with a **verification-code** field and **Re-send Code** button).
  - First/Last name.
  - **Store Name\*** (live preview of `…/store/[your_store]`).
  - Address 1\*, Address 2, Country\* (select), City, State (dependent select), Postcode\*.
  - Store Phone\*.
  - **"AIIR \*"**: a custom required field with no explanation of what to enter.
  - Password\* (strength must be at least "Good"), Confirm Password\*.
  - Terms "Agree"\*.
  - **Register.**
- **Submission:** AJAX to `admin-ajax.php?action=wcfm_ajax_controller&controller=wcfm-memberships-registration`. An empty submission returned `{"status":false,"message":"Please provide a valid email address."}`.
- **Issues:**
  - Two duplicate pages.
  - Required-ness is enforced only by JS (`data-required`), with no HTML `required` attributes.
  - The phone field accepts any length (a vendor has a 22-digit phone stored).
  - Email verification is required before submit, which adds a dependency on mail delivery.

**b) Vendor membership — `/vendor-membership/`**
- It renders an **empty membership wrapper** (no plans configured), and its page shows the **old Marketo header/footer** ("Our Stores: New York, London SF…", "Copyrights By Xpeedstudio – 2021").

**c) Vendor Store Manager — `/store-manager/`** (frontend vendor dashboard)
- When logged out, it redirects to `/my-account/`.
- These modules exist (they redirect to login rather than 404):

  | Status | Modules |
  |---|---|
  | Exist (redirect to login) | products, products-manage, reports-sales-by-date, settings, profile, payments, withdrawal, coupons, customers, reviews, enquiry, notices, messages, knowledgebase, refund-requests, memberships |
  | Return **404** | **orders** (unexpected; needs checking when logged in), analytics, ledger, followers, support, bookings (premium add-ons, not installed) |

- There is a floating **"Add New Product"** popup button.
- Messages show WCFM confirmation dialogs for approve/reject/archive/delete of products, orders, articles, enquiries and messages.
- Functionality inside the dashboard needs a vendor login to test.

**d) Public vendor storefront — `/store/<vendor-slug>/`**
- **Banner:** store name, rating, **address, phone and email shown publicly**, **Inquiry** button.
- **Tabs:** Products · About · Policies · Reviews (0).
- **Content:** sort dropdown, product grid, store-scoped product search, store category list (`/store/<slug>/category/<cat>/`).
- **Vendors (6 user accounts):** admin, `aiir` (displayed as "vendor"), `rana-sami` ("rana"), `alexa-2_0`, `vielka-norman`, `vendor_123`. All have placeholder/test details.
- `/store/vendor/` (no such vendor) falls back to the Shop template instead of a 404.

**e) Product ↔ vendor**
- Every product card shows "Store: <vendor>".
- The product page has the More Offers, Store Policies and Inquiries tabs.
- **Ask a Question** opens the WCFM enquiry popup (JS). Its messages are "Name is required", "Email is required", "Please insert your Inquiry before submit", "Your inquiry successfully sent".
- Vendors answer enquiries in Store Manager → Enquiry.

### 3.11 Blog (`/blog/`, posts, categories, author)
- 4 posts, all by `admin`, back-dated to **2018**.
- They're filed under the demo categories **Electronics, Speaker, Computer**.
- **Sidebar widgets:** Search, Recent Posts, Recent Comments, Archives, Categories, Meta (exposes Log in / feed links), Products By Rating, Product categories.
- Each post has a comment form (Name, Email, Website, Comment). There are 3 comments, all from admin.
- `/blog/page/2/` returns 404, which is correct with only 4 posts.

### 3.12 Information pages
All of these still contain **Marketo demo content**, not AIIR content.

| Page | Content |
|---|---|
| About Us | "Creative and renovate fashion trends", "We are marketpress", fake stats (12 yrs / 20K customers), stock team (Tony Williamson, William Hanah…), newsletter |
| FAQ | 8 questions about "marketpress.com" and "anyone from anywhere in **Bangladesh**", all with the same answer |
| Terms and Conditions | Privacy-style text about "marketpress.com", contact `info@example.com` |
| Contact | "Fundpress site … for donors, fundraisers" intro; CF7 form: Name\*, Email\*, Subject\*, Description\*, **Get A Query** button. No map, address or phone. |
| Refund and Returns Policy | WooCommerce sample ("This is a sample page.") |
| Sample Page | WordPress default |

- **Contact form validation (tested):** an empty submit returned "One or more fields have an error" with "The field is required." on all 4 fields. The email field is a **plain text** input, so the email format isn't validated, and the labels are `<h3>` headings rather than `<label>` elements.
- **Newsletter:** pages show **two** newsletter forms. The theme's form has `action="#"` and goes nowhere. The CF7 email form (id 3344) only validates "Please fill out this field." and has no mailing-list integration.

---

## 4. Functional test results

| # | Feature | Test | Result |
|---|---|---|---|
| 1 | Navigation | All 280 unique linked URLs checked | **51 broken** (§8.2) |
| 2 | Header search | Keyword + category; no-result query | ✅ Works; empty state shown |
| 3 | Sorting | All 6 sort options | ✅ Correct order |
| 4 | Pagination | Shop page 1 → 2 | ✅ 12 + 7 products |
| 5 | Price filter | `min_price/max_price` URL | ✅ Works; ❌ no UI widget |
| 6 | Category/tag archives | All 9 categories + subcategories + tag | ✅ Load correctly |
| 7 | Add to cart | Simple product | ✅ Success notice |
| 8 | Add to cart | Qty > stock (5 of 1) | ⚠️ Silently ignored, no notice on the landing page |
| 9 | Add to cart | Grouped product with no children ("Mouse") | ⚠️ Nothing happens |
| 10 | Coupon | Non-existent code | ✅ Clear error |
| 11 | Checkout | Empty cart | ✅ Redirects to cart |
| 12 | Checkout | Empty/invalid submit | ✅ All errors; ❌ HTML leaks into the email error |
| 13 | Payment | Available gateways | ⚠️ COD only |
| 14 | Login | Empty / unknown user / wrong password | ✅ Errors; ⚠️ reveals valid usernames |
| 15 | Register | Invalid email | ✅ Error |
| 16 | Lost password | Unknown user | ✅ Error |
| 17 | WP registration | `wp-login.php?action=register` | Disabled (by design) |
| 18 | Contact form | Empty submit | ✅ Per-field errors; ⚠️ no email format check |
| 19 | Newsletter | Theme form | ❌ `action="#"`, non-functional |
| 20 | Vendor registration | Empty AJAX submit | ✅ Server-side error |
| 21 | Store Manager | Anonymous access | ✅ Redirects to login; ⚠️ `/orders/` 404 |
| 22 | Compare | Add + view table | ✅ Works; ❌ `/yith-compare/` shows a raw shortcode |
| 23 | Wishlist | Empty state | ✅; add flow needs a browser |
| 24 | Vendor store | Tabs, search, categories | ✅ Load |
| 25 | 404 handling | Bad URL | ✅ "Oops... Page Not Found!" + Go to Home |
| 26 | REST permissions | wc/v3, users edit, settings, plugins | ✅ 401 for anonymous |
| 27 | File uploads / downloads | No public upload forms; 1 downloadable product ("How to Code") | Download needs a purchase to test |

---

## 5. End-to-end user workflows

### 5.1 Guest purchase
1. **Start:** Home, a category link or header search.
2. **Browse:** Shop or category archive (sort, grid/list, paginate) → product page (gallery, tabs, reviews).
3. **Add to cart:** from a card (AJAX; mini-cart updates) or the product page (choose quantity).
4. **Cart:** change quantity, apply a coupon, estimate shipping → Proceed to checkout.
5. **Checkout:** enter billing details (and optionally shipping), optionally create an account, choose Free/Flat shipping, choose COD → **Place order**.
6. **Result (expected):** an order-received page and order emails to the customer, admin and the vendor (WCFM splits orders by vendor and calculates commission).
7. **Next:** My Account → Orders.

Steps 1–5 were verified up to validation; step 6 wasn't run, to avoid creating orders.

### 5.2 Customer account
My Account → Register (email + password) or Log in → dashboard (orders, downloads, addresses, account details). Lost password sends a reset link by email and leads to the reset form. A returning customer can also log in inline at checkout.

### 5.3 Vendor onboarding
1. My Account → **Become a Vendor**, or go straight to `/vendor-register/`.
2. Fill in the form → **Re-send Code** emails a verification code → enter it.
3. Set a password ("Good" strength), agree to the terms → Register.
4. Approval may be required; that's an admin-side setting I couldn't see.
5. Vendor logs in → header **Dashboard** → `/store-manager/`: add/manage products, coupons, customers, reviews, enquiries, payments/withdrawals, settings/profile, refund requests.
6. **Output:** a public storefront at `/store/<store-slug>/`, and "Store: <name>" on every product.

There are no membership plans configured, so `/vendor-membership/` is empty.

### 5.4 Shopper ↔ vendor interaction
- **Questions:** product page → Ask a Question / Inquiries tab → enquiry popup (name, email, question) → vendor replies in Store Manager → Enquiry → the reply appears publicly in the Inquiries tab.
- **Store contact:** storefront → Inquiry button.
- **Reviews:** product Reviews tab → review form → moderation → rating shown on the product and in the vendor's store.

### 5.5 Wishlist / compare
Heart icon → `/wishlist/` (works for guests, kept in the session). Compare → popup table showing products side by side.

### 5.6 Content & contact
Blog list → post → comment. Contact page → CF7 form → email to the site admin. Newsletter → CF7 email (the theme form is dead).

### 5.7 How the modules connect
- **Catalogue** feeds Cart (Woo session cookie), which feeds Checkout, which feeds Orders (customer account and vendor Store Manager).
- **WCFM** links each product to a vendor user and drives the storefront, product tabs (offers, policies, inquiries), dashboard and commissions.
- **Wishlist/Compare** read from the catalogue.
- **The header** depends on login state for the Dashboard/Login/Logout links, but those are currently hard-coded.

---

## 6. UI/UX analysis

**Layout & navigation**
- Classic e-commerce layout: top bar, logo, menu, category mega-menu, search, cart.
- Navigation depth is shallow, but the menus are inconsistent: the mega-menu doesn't match the category tree, and the footer category links all go to `/shop/`.
- Login, Dashboard and Logout all appear for every visitor, which is confusing and also broken for logged-out users.

**Branding & content**
- The site is still mostly the **Marketo / "MarketPress" demo**: About, FAQ, Terms, Contact, Wishlist title, membership page header, promo banners, footer logo link and blog categories.
- Branding conflicts: "Artificial Intelligence Institute of Ireland", a **London** address, **USD** prices, US address labels, and FAQ text about Bangladesh.
- Social links point to "AI Awards Ireland" accounts, which may or may not be intended.

**Pages & data presentation**
- Product cards are consistent (image, title, price, rating, actions).
- **List view repeats each product title three times** in the markup (h4/h4/h1), and showcase pages contain up to **44 `<h1>` elements**.
- Test products are public: "test", "uq" ($20,000 → $10,000), "Sample Robo", "Oscar Herring" ($0, in 5 categories), an empty grouped "Mouse", duplicate "Neural"/"Smart" items, lorem ipsum descriptions and tag.
- Slugs don't match names (`bluetooth-speaker-2` = Chat bot Tools, `test2` = Machine Learning, `hello` = Robot, `heo` = Handsfree).

**Forms**
- WooCommerce forms are standard and labelled.
- CF7 contact labels are headings, not `<label>` elements.
- The vendor form has an unexplained required **"AIIR"** field.
- There are duplicate newsletter forms on one page, and one of them is dead.

**States**

| State | What the site shows |
|---|---|
| Empty cart, empty wishlist, no search results, 404 | Clear messages ✅ |
| Success | "Added to cart" notice ✅; inquiry/registration messages defined in JS |
| Errors | WooCommerce error list ✅; checkout email error has leaked HTML ❌; out-of-stock add fails silently ❌ |
| Loading | Relies on JS (AJAX add-to-cart, cart fragments, WCFM). Not observable without a browser. Server responses are slow (§7.9), so loading feedback matters. |

**Responsive**
- The markup includes an ElementsKit hamburger menu, an off-canvas panel and Elementor hidden-on-tablet/desktop variants.
- Every page outputs **two conflicting viewport meta tags** (`initial-scale=1.0` and `initial-scale=1, maximum-scale=5`).
- Not visually verified; needs a device/browser pass.

**Accessibility**
- Many images lack alt text (12 on the homepage, 67 on `/product-category/`).
- Icon-only links (social, cart, search submit) have no accessible names.
- Heading hierarchy is broken: 15 pages have no `<h1>` and 30 have several.
- There's no favicon.

---

## 7. Technical observations

### 7.1 Routing
- WordPress rewrite rules throughout.
- WooCommerce endpoints sit under `/my-account/`.
- WCFM endpoints sit under `/store-manager/<module>/` and `/store/<slug>/<tab>/`.
- Unknown vendor slugs fall back to the Shop template instead of a 404.
- Builder internals (`/mega_menu/*`, `/elementskit-content/*`, `?elementskit_template=`) are public and listed in the sitemap.

### 7.2 APIs and integration points
- **Public:**
  - `wc/store/v1`: products, categories, cart; checkout requires a nonce.
  - `wp/v2`: pages, posts, media, **users**.
  - `contact-form-7/v1/.../feedback`.
  - `yith/wishlist/v1`.
  - AJAX `/?wc-ajax=` (add_to_cart, apply_coupon, checkout, get_refreshed_fragments).
  - `admin-ajax.php` (WCFM controllers, using a public `wcfm_ajax_nonce`).
- **Protected (401 when anonymous):** `wc/v3`, `wp/v2/settings`, `wp/v2/plugins`, `users?context=edit`.
- **External:** S3 media, Google Fonts, Stripe (disabled), Jetpack (not connected), WP Social, GetGenie AI.

### 7.3 Data model (as observed)
- 30 pages, 4 posts, 19 products (simple + 2 grouped; no variable products, though a `color` attribute exists), 9 product categories, 1 tag, 4 post categories, 6 users/vendors, 504 media items, 1 review, 3 comments.
- Products belong to a vendor (WCFM `post_author`).
- The cart lives in the WooCommerce session table and is tied to a cookie.

### 7.4 Rendering defect: duplicated HTML document
On **93 of 120 pages** the response contains **two full `<!DOCTYPE html><html><head>…<body>` documents**. The ElementsKit header template is printed first, then the child theme's `header.php` prints a second `<!DOCTYPE>/<html>/<head>/<body>`. That produces invalid HTML, two `<body>` tags and the duplicate viewport meta. Browsers recover, but it can break CSS/JS that targets `body` classes, hurt SEO and accessibility, and cause layout glitches. Check `marketo-child/header.php` and the ElementsKit header-footer override.

### 7.5 Validation
- WooCommerce and CF7 validate on the server (verified).
- WCFM registration relies on JS `data-required` plus server checks.
- Missing format checks: the CF7 email field isn't an email type, and phone fields accept any length/format.

### 7.6 Error handling
- Friendly messages everywhere except the leaked Stripe markup in the checkout email error and the silent out-of-stock add.
- No PHP warnings were seen in the HTML.

### 7.7 Authentication & sessions
- WooCommerce login/registration; WP core registration disabled; WCFM vendor registration with email-code verification.
- Session cookie `wp_woocommerce_session_*` is Secure and HttpOnly ✅.
- A **`PHPSESSID`** cookie is set on every request **without Secure/HttpOnly**. Some plugin starts PHP sessions, which also forces `Cache-Control: no-store`, so pages can't be cached.
- The logout nonce in the header is hard-coded and stale.

### 7.8 Security observations (staging, but worth fixing before launch)
1. **The staging site is indexable:** no `noindex` on public pages, `robots.txt` returns 404, and the sitemap is public (including the users sitemap).
2. **User enumeration:**
   - `/wp-json/wp/v2/users` lists all 6 accounts, including **`admin`**.
   - `/author/<user>/` pages are public.
   - The login error confirms valid usernames.
3. **XML-RPC is enabled**, including `system.multicall` (brute-force amplification).
4. **No security headers:** no HSTS, X-Frame-Options/CSP frame-ancestors, X-Content-Type-Options or Referrer-Policy.
5. **Version disclosure:** a generator meta tag (WP/Woo/Elementor versions), a public `readme.html`, and a `host-header` response header that base64-decodes to `shared.bluehost.com`.
6. **Vendor PII is public:** email, phone and full address on every storefront (WCFM "store contact visibility" setting).
7. **Public media includes `siir-test.zip` and a `.txt` file** on S3, listed through the REST media endpoint. I didn't download them; confirm they aren't sensitive.
8. **The migration plugin (All-in-One WP Migration) is active.** Its backup folder is protected, but remove the plugin when it isn't needed.
9. **Outdated components:** Stripe gateway 7.6.2; YITH Wishlist assets reference old versions.

### 7.9 Performance
- **Median server response ≈ 2.5 s per HTML page**:
  - Homepage 6.5 s.
  - `/product-category/` 5.5 s.
  - One response took 18 s (`/refund_returns/`).
  - Responses aren't cached (`X-Proxy-Cache: MISS`, `no-store`).
- **Page weight:** median 180 KB of HTML; homepage 540 KB; `/product-category/` **1 MB** with 173 images.
- **≈55 JavaScript files and ≈44 stylesheets per page.** Slider Revolution, Elementor, ElementsKit, MetForm, CF7, WCFM, YITH and Font Awesome (multiple copies) load on every page.

### 7.10 SEO
- Homepage meta description is "Home 02".
- No Open Graph tags and no favicon.
- Duplicate/near-duplicate pages: 9 homepages, 2 vendor registration pages, 2 category showcase pages.
- Product slugs don't match product names.

---

## 8. Issue list (prioritised)

### 8.1 Critical / high
| # | Issue | Where |
|---|---|---|
| H1 | Two full HTML documents per page (duplicate doctype/head/body/viewport) | Site-wide (93/120 pages) |
| H2 | Only Cash on Delivery enabled; Stripe installed but off | Checkout |
| H3 | Leaked Stripe button HTML in the checkout email validation error | Checkout |
| H4 | Dashboard + Logout + Login shown to all visitors; hard-coded logout nonce | Header |
| H5 | Demo content on About, FAQ, Terms, Contact, Refund, Wishlist title, promos, footer | Site-wide |
| H6 | Test/dummy products and vendors live (test, uq, Sample Robo, Oscar Herring $0, empty "Mouse") | Catalogue |
| H7 | Staging indexable by search engines; users and author sitemaps public | SEO/security |
| H8 | User enumeration (REST users, login errors) + an `admin` username + XML-RPC multicall | Security |
| H9 | Unrendered shortcodes: `[dokan-my-orders]`, `[wcmp_vendor]`, `[yith_woocompare_table]` | `/my-orders/`, `/dashboard/`, `/yith-compare/` |
| H10 | `/store-manager/orders/` returns 404 (vendors may not be able to see orders) | Vendor dashboard |

### 8.2 Medium
| # | Issue |
|---|---|
| M1 | **51 broken links.** The footer logo points to the Xpeedstudio demo (HTTP 500) and `/marketo/home10/` (404) on every page. Mega-menu items point to `/home2/`–`/home9/`, `/marketo/*`, `/marketov2/*` and non-existent categories (laptop, camera, gamepad, headphone, mobile, accessories). |
| M2 | Footer category links all go to `/shop/`, and the mega-menu grouping doesn't match the category tree |
| M3 | USD currency, US address defaults, London address for an Irish institute |
| M4 | Shipping required on digital/AI products; Free + Flat rate both offered with no rule |
| M5 | Out-of-stock and empty grouped add-to-cart fail silently |
| M6 | Theme newsletter form is non-functional (`action="#"`); two newsletter forms per page |
| M7 | Vendor membership page is empty and uses the old demo header/footer |
| M8 | Duplicate pages: `/vendor-register/` vs `/vendor-registration/`; 8 unused homepages |
| M9 | Unexplained required "AIIR" field on vendor registration; no phone format validation |
| M10 | Vendor email, phone and address publicly visible on storefronts |
| M11 | Slow uncached responses (2.5–6.5 s); PHP session cookie prevents caching; ~100 assets per page |
| M12 | No security headers; version disclosure; `readme.html` public |
| M13 | No price, attribute or vendor filter UI on the shop |

### 8.3 Low
- Product slugs don't match names, and there are duplicate products ("Neural" ×2, "Smart"/"Smart AI", `-copy` slugs).
- Lorem ipsum appears in the tag and in some descriptions.
- Blog posts are dated 2018 and filed under Electronics/Speaker/Computer.
- Placeholder delivery text on product pages; the Store Policies tab is empty.
- Headings: no `<h1>` on 15 pages, many `<h1>` on 30; missing image alt text; no favicon; homepage meta description is "Home 02".
- CF7 contact labels are headings; the email field isn't `type="email"`.
- An unknown `/store/<slug>/` falls back to the Shop page instead of a 404.
- Builder internals (`/mega_menu/*`, `/elementskit-content/*`) are publicly indexable.

---

## 9. Still to test (needs credentials or a browser)

1. **Customer login:** account dashboard, order history, downloads (the "How to Code" downloadable), address book, account edit, password change.
2. **Vendor login:** every Store Manager module (product create/edit/delete, coupons, orders, reports, payments/withdrawals, settings, enquiry replies, reviews, refund requests).
3. **Admin:** WCFM commission rules, vendor approval, membership plans, payment/shipping settings, email templates.
4. **A real test order** with COD (or Stripe test mode once enabled): order emails, per-vendor order split, stock reduction, refund flow.
5. **Browser pass:** mini-cart drawer, quick view, AJAX wishlist, compare popup, enquiry popup, sliders and tabs, mobile/tablet layouts, JS console errors and Core Web Vitals.
6. **Mail delivery:** vendor verification code, password reset, contact form.
