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

## Map

The device map is MapLibre Native (`@maplibre/maplibre-react-native`) with the same keyless style as the website, `https://tiles.openfreemap.org/styles/positron`. `expo-maps` is not used: its readme requires iOS 18, and Android tiles need a Google Maps key this repo does not have. No tile credential and no device-location permission are added. The Android location engine in the config plugin is the library default, not Google Play Services.

Pins, flight arcs, names, blurbs and flight labels are copied from the website map. Unknown destination keys are not plotted. Choosing a destination, or the ‹ › card, moves the camera to that published route and updates the card (flight label, tour count, starting price from the loaded catalogue).

The web export draws the same style with `maplibre-gl` so the browser can show the map. That is not an iOS or Android screenshot. `public/maplibre-gl-worker.mjs` and `public/maplibre-gl.css` are copies of the installed `maplibre-gl` 6.17.0 files. If the style does not load, the screen keeps the destination card and shows the coordinate list.

## What talks to the server

- Catalogue: public HTML of `/tours` and `/tours/:id` (there is no public JSON catalogue route).
- Account: `/api/account/code` creates the traveller if the email is new (`shouldCreateUser: true`). Нэвтрэх and Бүртгүүлэх are the same code. Бүртгүүлэх also sends the name. `/api/account/verify` starts the session only when a Supabase `sb-` cookie comes back. Logout, deletion, expiry (`user: null` or 401) and offline restore are covered by mocked tests. `/api/account/device` and `/api/account/device/login` are the Face ID routes.
- Booking request: `POST /api/bookings` only after the traveller confirms. Tests never call it.
- Trip: `/api/trip` with `x-trip-token`, `/api/trips` for status, `/api/payments/qpay/create` and `/api/payments/qpay/status`. `mock-pay` is not called.
- Session cookies are stored in the platform secure store, split into chunks. Face ID secrets use biometric access control.

See `PARITY.md` for what is finished and what is not.
