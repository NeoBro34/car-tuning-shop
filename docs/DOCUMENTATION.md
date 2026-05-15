# Car Tuning Shop - Frontend Documentation

## Qilingan Ishlar

### Phase 7.7 - UI/UX Redesign
- Dark premium automotive dizayn qo'shildi.
- Home, Products, Product Detail, Cart, Checkout, Login/Register va Admin UI yangilandi.
- Product card hover, stock badge, discount badge, sticky product info, cleaner forms va responsive layout yaxshilandi.
- Backend API logic o'zgartirilmadi.

### Phase 7.8 - Internationalization
- `next-intl` o'rnatildi.
- Localized routing qo'shildi:
  - `/en`
  - `/uz`
  - `/ru`
  - `/kr`
- Translation files:
  - `apps/frontend/messages/en.json`
  - `apps/frontend/messages/uz.json`
  - `apps/frontend/messages/ru.json`
  - `apps/frontend/messages/kr.json`
- i18n config:
  - `apps/frontend/i18n/routing.ts`
  - `apps/frontend/i18n/navigation.ts`
  - `apps/frontend/i18n/request.ts`
- Language switcher qo'shildi va tanlangan til cookie/localStorage orqali saqlanadi.
- SEO-friendly localized routes va hreflang linklar ishlaydi.

### Phase 7.9 - Navbar UX + User Dropdown
- Navbar sticky, responsive va spacing yaxshilandi.
- Desktop cart icon badge qo'shildi.
- Mobile hamburger menu alohida componentga ajratildi:
  - `apps/frontend/components/layout/mobile-menu.tsx`
- User dropdown qo'shildi:
  - `apps/frontend/components/layout/user-dropdown.tsx`
- Dropdown itemlari:
  - Profile
  - My Orders
  - Settings
  - Logout
- Dropdown outside click va `Escape` bilan yopiladi.
- Auth logic saqlandi:
  - Guest: Login/Register
  - Authenticated user: Avatar + dropdown
  - Logout auth state va tokenni tozalaydi.

## Dev Server

Turbopack panic sabab dev script Webpack bilan ishlaydi:

```bash
cd apps/frontend
npm run dev
```

## Build Test

```bash
cd apps/frontend
npm run build
```

Build muvaffaqiyatli o'tdi.

## Route Test

Tekshirilgan route'lar:

- `/products` -> `/en/products`
- `/en/products` -> `200 OK`
- `/uz/products`
- `/ru/products`
- `/kr/products`

## Responsive Test

DevTools orqali quyidagilar tekshirilsin:

- 390px mobile
- 768px tablet
- 1024px laptop
- 1440px desktop

Tekshiriladigan joylar:

- Navbar
- Mobile menu
- Language switcher
- User dropdown
- Products grid
- Cart/Checkout forms
- Admin layout
