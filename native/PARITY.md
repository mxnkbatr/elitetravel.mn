# Native parity

Checked against the repository on 8 Nov 2026. No backend routes were added.

## Finished in this app

- Native screens for the four tabs, plus tour, booking, trip, news and sign-in. Components are React Native, not a WebView of the website. The map is MapLibre Native on device and MapLibre GL in the web export.
- Home, search and tour detail read the live public pages. Ended departures stay out of the list, matching the website.
- Booking request form uses the same party, phone and date checks as `POST /api/bookings`. The confirmation screen shows only the id, total, deposit and status the server returns. A failed request is not stored as a booking.
- Account sign-in and registration use the existing routes. `POST /api/account/code` creates the traveller when the email is new; there is no separate registration call. Нэвтрэх sends only the email and code. Бүртгүүлэх also requires a name. The app stays signed out if the code is wrong or expired, the network fails, or the response has no `sb-` session cookie. A cached profile remains visible while offline. 401 clears the session. Logout clears this device even if the server is unreachable, and says so. Deletion is refused while offline. Face ID uses `/api/account/device` and `/api/account/device/login`. The key is removed only when the server says it expired. A Capacitor key does not transfer. Session cookies stay in secure storage.
- Bottom dock is exactly Аялал, Газрын зураг, Захиалга, Профайл. Аялал is the first screen and includes search.
- Map pins, arcs, names and flight labels are the ones published in the website map. The backend does not send coordinates. Unknown keys are not plotted. iOS and Android use MapLibre Native and the website's keyless OpenFreeMap style. `expo-maps` was removed because it requires iOS 18 and does not draw those arcs; Android would also need a Google Maps key, which is not committed. The app does not request the phone's location. The web export uses `maplibre-gl` with the same style and coordinates. If that style fails to load, the destination card stays and a coordinate list is shown. A browser screenshot of the web export is not a device recording of the native MapLibre view.
- Миний аялал lists device booking requests, plus the signed-in account's bookings. A network or signed-out failure is not shown as a successful empty list. Saved tours are stored on this device and copied to the account with `PATCH /api/account` after sign-in. The saved count is only tours found in the loaded catalogue.
- Trip screen: messages, QPay invoice hand-off in the system browser, status refresh, passenger text, document image upload, emergency contact, contract text.
- Saved tours sync with `PATCH /api/account` while signed in.
- Loading, empty, error and offline states. The last successful catalogue is kept on device.
- Mongolian UI. Brand colours and the public Cloudinary photos.
- Motion, in code: the native splash and the first JS frame are the same centered 180pt logo on `#0b241d`. The intro then reveals the home hero and finishes within 2 seconds. It is skippable, plays on the first launch only, and later launches crossfade the splash straight into home. Tabs and foregrounding do not replay it. Reduced motion is a short fade with no zoom. Tour detail fades in and out through the native stack (`fade`, iOS and Android) and the hero scales from 1.06 to 1 with the native animation driver. That is not a shared-element transition. Cards use a press scale. Home sections rise in sequence unless reduced motion is on.

## Explicitly not done

- A Linux typecheck is not an iPhone test. The intro and detail zoom use React Native's native-driver `Animated` API and were not watched on a device. Browser map screenshots use `maplibre-gl`, not the iOS MapLibre view. Mocked auth tests do not send email. The live catalogue check is read-only.
- Unsigned iOS verification finished on GitHub Actions run [42467977443](https://github.com/mxnkbatr/elitetravel.mn/actions/runs/42467977443). Xcode 26.6 on `macos-26` prebuilt `native/`, installed CocoaPods including MapLibreReactNative 11.5.1, and built the Release `EliteTravel` scheme for the simulator with signing off. The app target is iOS 16.4 and the bundle id is `mn.elitetravel.app`. `main.jsbundle` was embedded. The app launched on an iPhone 17 Pro simulator as process 54744, wrote no crash report, and the screenshot shows the Аялал home with the live catalogue. An earlier Debug build compiled and launched but showed “No script URL” because Debug skips the bundle. A later Release compile succeeded and then the check looked for the bundle as a directory. One run failed before compile when the MapLibre xcframework download returned HTTP 504; the successful run downloaded it. The map screen, Face ID, and a live `Set-Cookie` verify were not exercised on the simulator. The workflow does not use the Capacitor signing secrets and does not upload a build.
- Expo's default iOS fetch uses `credentials: include`, which turns on `httpShouldHandleCookies` and can hide `Set-Cookie` from JavaScript. Account requests send `credentials: "omit"` and read Expo's `_rawHeaders` lines. That matches the iOS source of Expo SDK 58. It has not been observed against a live verify response on a simulator, and these tests do not call the account API.
- Push is not registered. The server accepts an FCM token at `/api/push` and sends with Firebase. This Expo app has no Firebase client config, and the Capacitor `GoogleService-Info.plist` was not copied.
- Contract signature drawing is not implemented. The text is shown. A fake signature is not submitted.
- PDF document pick is not implemented. JPG and PNG are.
- The assistant chat route exists and is not called, so the app does not spend model calls on its own.
- Seat counts appear only when the public page includes them. The sampled page had `"seats": {}`.
- `elitetravel.mn` is not the API host today. “Вэб дээр нээх” opens the Next.js deployment.
- QPay `mock-pay` is never called. A mock invoice is labelled as a test and is not shown as a completed real payment.
- Production booking, payment and account calls are not part of the automated tests.
- Release blockers before a store build: Apple signing with the existing `mn.elitetravel.app` identity, a device run of email-code login (Set-Cookie must be readable on that OS), Firebase if push is required, and a decision that this binary replaces the Capacitor app rather than shipping beside it.

## Tests

`npm test` in `native/` covers the catalogue parser, price quote, cookie jar, chunked storage, API errors, booking payload, payment handoff, and mocked account flows (new user, existing user, expired code, network failure, missing session cookie, expired session, offline cache, 401, offline deletion, Face ID expiry versus network failure, preview mode). `AuthScreen` is rendered in those tests and does not call the network.

`ELITE_CATALOG_LIVE=1 npm test -- src/lib/catalog.live.test.ts` performs one read of the public tours page.
