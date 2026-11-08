# Native parity

Checked against the repository on 8 Nov 2026. No backend routes were added.

## Finished in this app

- Native tab navigation: Нүүр, Аялал, Захиалга, Бүртгэл, plus tour, booking, trip, news and sign-in screens. Components are React Native, not a WebView.
- Home, search and tour detail read the live public pages. Ended departures stay out of the list, matching the website.
- Booking request form uses the same party, phone and date checks as `POST /api/bookings`. The confirmation screen shows only the id, total, deposit and status the server returns. A failed request is not stored as a booking.
- Account email-code sign-in, profile update, logout and account deletion use the existing account routes. Cookies stay in secure storage.
- Face ID / Touch ID uses the existing `/api/account/device` and `/api/account/device/login` routes when the device has biometrics and secure storage. A key enrolled in the Capacitor app does not transfer.
- Trip screen: messages, QPay invoice hand-off in the system browser, status refresh, passenger text, document image upload, emergency contact, contract text.
- Saved tours sync with `PATCH /api/account` while signed in.
- Loading, empty, error and offline states. The last successful catalogue is kept on device.
- Mongolian UI. Brand colours and the public Cloudinary photos.

## Explicitly not done

- No iOS simulator or device run in this environment. Typecheck and unit tests ran on Linux.
- Push is not registered. The server accepts an FCM token at `/api/push` and sends with Firebase. This Expo app has no Firebase client config, and the Capacitor `GoogleService-Info.plist` was not copied.
- Contract signature drawing is not implemented. The text is shown. A fake signature is not submitted.
- PDF document pick is not implemented. JPG and PNG are.
- The assistant chat route exists and is not called, so the app does not spend model calls on its own.
- Seat counts appear only when the public page includes them. The sampled page had `"seats": {}`.
- `elitetravel.mn` is not the API host today. “Вэб дээр нээх” opens the Next.js deployment.
- QPay `mock-pay` is never called. A mock invoice is labelled as a test and is not shown as a completed real payment.
- Production booking, payment and account calls are not part of the automated tests.

## Tests

`npm test` in `native/` covers the catalogue parser, price quote, cookie jar, chunked storage, API error handling, booking validation, payment wording and booking merge.

`ELITE_CATALOG_LIVE=1 npm test -- src/lib/catalog.live.test.ts` performs one read of the public tours page.
