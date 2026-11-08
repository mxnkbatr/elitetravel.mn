# Elite Travel native

Isolated Expo app. It does not change the website, the Capacitor app in `mobile/`, or the root lockfile.

The intended iOS bundle id and Android package are `mn.elitetravel.app`, the same identity as the existing Capacitor app. This build is not signed, uploaded, or submitted.

## Setup

```bash
cd native
npm install
npm test
npm run typecheck
npx expo start
```

iOS and Android projects are generated locally with `npx expo prebuild`. This repository does not upload a build or submit to App Review.

`EXPO_PUBLIC_API_ORIGIN` overrides the API origin. The default is the public Next.js deployment `https://elitetravel-mn-wg6y.vercel.app`. The hostname `elitetravel.mn` currently serves a different site and does not expose these APIs.

`EXPO_PUBLIC_PREVIEW=1` loads a labelled fixture and refuses sign-in, booking and payment calls. Leave it unset for the real app.

## What talks to the server

- Catalogue: public HTML of `/tours` and `/tours/:id` (there is no public JSON catalogue route).
- Account: `/api/account/code` creates the traveller if the email is new (`shouldCreateUser: true`). Нэвтрэх and Бүртгүүлэх are the same code. Бүртгүүлэх also sends the name. `/api/account/verify` starts the session only when a Supabase `sb-` cookie comes back. Logout, deletion, expiry (`user: null` or 401) and offline restore are covered by mocked tests. `/api/account/device` and `/api/account/device/login` are the Face ID routes.
- Booking request: `POST /api/bookings` only after the traveller confirms. Tests never call it.
- Trip: `/api/trip` with `x-trip-token`, `/api/trips` for status, `/api/payments/qpay/create` and `/api/payments/qpay/status`. `mock-pay` is not called.
- Session cookies are stored in the platform secure store, split into chunks. Face ID secrets use biometric access control.

See `PARITY.md` for what is finished and what is not.
