# Car Tuning Shop - Frontend Documentation

Bu hujjat NextJS frontend bo'yicha qilingan o'zgarishlarni qisqa va bir joyda jamlaydi.

## Umumiy Qoida

- Backend o'zgartirilmadi.
- Mavjud API, auth store, cart store va typed service integratsiyasi saqlandi.
- Frontend clean structure saqlandi: `app`, `components`, `features`, `i18n`, `messages`.

## Phase 7.7 - UI/UX Redesign

Qilingan o'zgarishlar:

- Dark premium automotive dizayn qo'shildi.
- Home page professional marketplace ko'rinishiga keltirildi:
  - hero section
  - featured categories
  - popular products
  - brand section
  - why choose us
  - CTA
- Products page yaxshilandi:
  - modern filter sidebar
  - search bar
  - sorting dropdown
  - product card hover
  - stock badge
  - discount badge
- Product detail page yaxshilandi:
  - premium gallery
  - sticky product info
  - specs section
  - compatibility section
  - delivery info section
  - related products
- Cart page:
  - cleaner cart item cards
  - order summary card
  - empty cart design
- Checkout page:
  - professional form UI
  - order summary
  - validation message UI
- Auth pages:
  - modern split layout
  - better form UI
  - social-looking buttons, real social login yo'q
- Admin UI:
  - better sidebar
  - dashboard cards
  - improved tables
  - cleaner forms

Asosiy fayllar:

- `apps/frontend/app/[locale]/page.tsx`
- `apps/frontend/features/products/components/*`
- `apps/frontend/features/cart/components/*`
- `apps/frontend/features/checkout/components/*`
- `apps/frontend/features/auth/components/*`
- `apps/frontend/features/admin/components/*`
- `apps/frontend/app/globals.css`

## Phase 7.8 - Internationalization

Qilingan o'zgarishlar:

- `next-intl` o'rnatildi.
- Localized routing qo'shildi:
  - `/en`
  - `/uz`
  - `/ru`
  - `/kr`
- Eski route'lar `app/[locale]` ichiga ko'chirildi.
- Locale middleware `proxy.ts` bilan ishlaydi.
- Auth redirect locale-aware qilindi.
- Language switcher qo'shildi.
- Tanlangan til cookie va localStorage orqali saqlanadi.
- SEO-friendly localized routes va hreflang linklar ishlaydi.

Translation files:

- `apps/frontend/messages/en.json`
- `apps/frontend/messages/uz.json`
- `apps/frontend/messages/ru.json`
- `apps/frontend/messages/kr.json`

i18n config:

- `apps/frontend/i18n/routing.ts`
- `apps/frontend/i18n/navigation.ts`
- `apps/frontend/i18n/request.ts`

Tarjima ulangan joylar:

- navbar
- footer
- home
- products
- product detail
- cart
- checkout
- login/register
- admin sidebar/dashboard basics

## Phase 7.9 - Navbar UX + User Dropdown

Qilingan o'zgarishlar:

- Navbar sticky va responsive holati yaxshilandi.
- Desktop navbar spacing yaxshilandi.
- Cart icon badge qo'shildi.
- Language switcher navbar bilan integratsiya qilindi.
- Mobile hamburger menu alohida componentga ajratildi.
- User dropdown alohida component sifatida yaratildi.

Yangi componentlar:

- `apps/frontend/components/layout/user-dropdown.tsx`
- `apps/frontend/components/layout/mobile-menu.tsx`

User Dropdown:

- avatar
- username/email
- Profile
- My Orders
- Settings
- Logout

UX:

- smooth dropdown animation
- outside click bilan yopiladi
- `Escape` bilan yopiladi
- keyboard accessible
- mobile responsive

Auth visibility:

- Guest user: Login/Register
- Authenticated user: avatar + dropdown
- Logout auth state va tokenni tozalaydi.

## Phase 7.10 - Loading Skeletons, Empty States, Error UX

Qilingan o'zgarishlar:

- Reusable skeleton component qo'shildi.
- Shimmer animation qo'shildi.
- Reusable empty state component qo'shildi.
- Reusable error state component qo'shildi.
- Retry buttonli network error UI qo'shildi.
- Unauthorized error state qo'shildi.

Yangi reusable UI componentlar:

- `apps/frontend/components/ui/skeleton.tsx`
- `apps/frontend/components/ui/empty-state.tsx`
- `apps/frontend/components/ui/error-state.tsx`

Yangi feature skeletonlar:

- `apps/frontend/features/products/components/product-skeletons.tsx`
- `apps/frontend/features/cart/components/cart-skeleton.tsx`

Products Page:

- product card skeletons
- filter skeleton
- pagination skeleton
- no products found empty state
- network error + retry button

Product Detail:

- image gallery skeleton
- title skeleton
- price skeleton
- related products skeleton
- error state + retry button

Cart:

- cart skeleton
- improved empty cart state
- error state + retry button

Orders:

- admin orders table skeleton
- empty orders state
- error state + retry button

Admin Unauthorized:

- reusable unauthorized error state ishlatildi.

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
- `/uz/cart` auth bo'lmasa `/uz/login?redirect=%2Fuz%2Fcart`

## Manual Test Checklist

Loading state:

- DevTools Network orqali `Slow 3G` yoqing.
- `/en/products`, product detail va `/en/cart` sahifalarini oching.
- Skeleton shimmer chiqishini tekshiring.

Empty state:

- Products search orqali mavjud bo'lmagan query kiriting.
- Bo'sh cart holatini tekshiring.
- Orders bo'sh holatini tekshiring.

Error state:

- Backendni vaqtincha o'chiring.
- Products/Cart/Admin Orders sahifalarida error card va retry buttonni tekshiring.

Navbar:

- Guest holatda Login/Register ko'rinadi.
- Login holatda avatar dropdown ko'rinadi.
- Dropdown tashqariga bosilganda va `Escape` bosilganda yopiladi.
- Mobile hamburger menu ishlaydi.

Responsive:

- 390px mobile
- 768px tablet
- 1024px laptop
- 1440px desktop

Tekshiriladigan joylar:

- Navbar
- Mobile menu
- User dropdown
- Language switcher
- Products grid
- Product detail
- Cart/Checkout forms
- Admin layout
- Skeleton/empty/error states
