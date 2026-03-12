# Implementation Plan - Product Search Functionality (IGNORED)

This plan covers the implementation of a real-time product search feature, including the backend API and the frontend UI integration in the Navbar and a new Search Overlay.

## Context
The current Navbar has placeholder search triggers that don't perform any actions. We need to allow users to search for "cosmic artifacts" (products) by title, tags, or emotional intention, leveraging the MySQL full-text index defined in the Prisma schema.

## Proposed Changes

### 1. Global State Management
- Update `D:/Vayu-Vibe-Code/vastrayug/store/uiStore.ts` to manage the visibility of a search overlay.

### 2. Backend API
- Create `D:/Vayu-Vibe-Code/vastrayug/app/api/storefront/search/route.ts`.
- Use Prisma's `fullTextSearch` (enabled in schema) to query the `products` table.
- Filter by `status: 'PUBLISHED'`.
- Return a list of matching products with their primary images.

### 3. UI Components
- Create `D:/Vayu-Vibe-Code/vastrayug/components/store/layout/SearchOverlay.tsx`.
  - Full-screen or modal overlay.
  - Real-time fetching as the user types (with debouncing).
  - Display search results in a grid or list.
  - Quick links to popular categories/collections if no query is present.
- Update `D:/Vayu-Vibe-Code/vastrayug/components/store/layout/Navbar.tsx`.
  - Connect desktop search button to `openSearch()`.
  - Connect mobile search input to `openSearch()` or handle directly.

### 4. Search Results Page (Optional but recommended)
- Create `D:/Vayu-Vibe-Code/vastrayug/app/(store)/search/page.tsx` for a dedicated search results view.

## Detailed Steps

### Phase 1: State & API
1.  **Modify `uiStore.ts`**:
    -   Add `isSearchOpen: boolean`.
    -   Add `openSearch`, `closeSearch`, `toggleSearch`.
2.  **Create `api/storefront/search/route.ts`**:
    -   Accept `q` query parameter.
    -   If `q` is missing or < 2 chars, return empty or featured products.
    -   Perform `prisma.product.findMany` with `where: { OR: [ { title: { search: q } }, ... ] }`.
    -   Include `images: { where: { isPrimary: true }, take: 1 }`.

### Phase 2: Search UI
1.  **Create `SearchOverlay.tsx`**:
    -   Use `framer-motion` for entrance/exit animations.
    -   Input field with auto-focus.
    -   Debounced fetch to `/api/storefront/search`.
    -   Result cards showing product name, price, and image.
2.  **Integrate `SearchOverlay` into `Navbar.tsx`** or `app/layout.tsx`.
3.  **Update `Navbar.tsx` triggers**:
    -   Desktop: `onClick={openSearch}` on the Search icon.
    -   Mobile: When user focuses the search input, open the overlay.

## Verification Plan

### Automated Tests
- N/A (Manual verification for now as per project current state).

### Manual Verification
1.  Click search icon on desktop Navbar -> Verify overlay opens.
2.  Type "Apparel" or a known product title -> Verify results appear in real-time.
3.  Click a result -> Verify navigation to the product detail page.
4.  Press ESC or click close -> Verify overlay closes.
5.  Test on mobile -> Verify search input opens the overlay.
