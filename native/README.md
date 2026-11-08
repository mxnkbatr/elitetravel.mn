# Elite Travel native

Isolated Expo app. It does not change the website, the Capacitor app in `mobile/`, or the root lockfile.

Bundle id: `mn.elitetravel.native` (the existing Capacitor app keeps `mn.elitetravel.app`).

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
- Account: `/api/account`, `/api/account/code`, `/api/account/verify`, `/api/account/logout`, `/api/account/device`, `/api/account/device/login`.
- Booking request: `POST /api/bookings` only after the traveller confirms. Tests never call it.
- Trip: `/api/trip` with `x-trip-token`, `/api/trips` for status, `/api/payments/qpay/create` and `/api/payments/qpay/status`. `mock-pay` is not called.
- Session cookies are stored in the platform secure store, split into chunks. Face ID secrets use biometric access control.

See `PARITY.md` for what is finished and what is not.
