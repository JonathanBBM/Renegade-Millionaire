# Phase 8 Shipping Checklist

## Web

- Production URL: https://renegade-millionaire-app.vercel.app
- Confirm latest GitHub-triggered Vercel deployment is `READY`.
- Smoke test sign in, course progress, goals, Battle Report, dashboard, and profile on desktop and mobile widths.

## Native Internal Builds

- Confirm Expo owner/account before running cloud builds.
- Confirm final bundle IDs:
  - iOS: `co.brassballs.renegademillionaire`
  - Android: `co.brassballs.renegademillionaire`
- Run internal build:
  - `npx eas build --profile preview --platform ios`
  - `npx eas build --profile preview --platform android`

## Store Listing Prep

- Final app name: Renegade Millionaire
- Short description: Build goals, daily discipline, Battle Reports, routines, and course progress in one execution system.
- Privacy policy: review and publish `docs/PRIVACY_POLICY_DRAFT.md`.
- Support URL/email: confirm final public support destination.
- Screenshots needed:
  - Sign in
  - Dashboard
  - Course module list
  - Goals
  - Battle Report
  - Profile routines/affirmations

## Before Public Release

- Confirm Warrior Score formula.
- Confirm account deletion flow.
- Add final app icons/splash assets from the WARRIOR brand folder.
- Run RLS verification with at least two separate users.
- Decide whether notifications ship in v1 or remain a follow-up feature.
