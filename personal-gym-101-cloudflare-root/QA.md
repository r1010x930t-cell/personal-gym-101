# komorebi QA

## Design review

The desktop browser preview loads the Japanese typography, warm ivory/olive palette, generated studio photographs, and all sections successfully. The first navigation captured initial loading; the subsequent view confirmed the complete rendered page. Hero badge slightly overlaps the English image caption, so caption spacing will be adjusted before final verification.

## Validation

TypeScript check and production build passed. The form is a frontend-only demonstration and explicitly discloses that no reservation is submitted or stored. Business name, pricing and imagery are prototype content. Address and hours are not fabricated; their pending status is shown.

## Functional browser tests

All 12 grouped checks in `scripts/qa.mjs` passed: desktop rendering, no horizontal overflow at seven widths (375–1440 px), monthly/ticket pricing toggle, selected plan propagation, required fields, past-date validation, form review and editing, explicit demo completion, input clearing, FAQ, news/privacy dialogs, mobile menu, loaded images, and no browser JavaScript errors. Both the local server and public preview returned HTTP 200.

The 1440 px desktop screenshot confirms the hero label no longer overlaps its circular badge. The mobile screenshot was captured during a modal exit transition and will be recaptured after waiting for the dialog to fully unmount; this is a test timing issue rather than persistent UI content. Generated images were converted to 1600 px WebP for fast loading without cropping their source composition.

## Final visual pass

The 390 px mobile hero renders correctly after the test waits for modal exit: full header, readable headline, CTA and warm studio photograph. All functional tests, TypeScript and production build pass again. A pricing screenshot taken immediately after switching viewport sizes has a clipped paint area; a fresh desktop load is being checked to distinguish a capture/repaint artifact from a layout issue.

Fresh desktop loading confirms all three pricing cards render completely and evenly; the earlier missing area was a transitional capture artifact. All intended frontend interactions are operational. Final delivery is a preview, not a publicly launched business website. Publishing should follow replacement of fictional business details and connection of a real booking destination. The prototype intentionally uses `noindex, nofollow`.

## Brand update — 2026-09-21

Renamed all user-facing occurrences to パーソナルジムON, including header/footer logos, mobile menu, news dialog, concept copy, studio information, page title and description. The original palette, photography, layout and interactions remain unchanged. The logo uses a compact Japanese descriptor next to serif ON, with the existing sprout mark retained. Removed the statement that the now user-specified name is fictional; pricing and unconnected booking disclosures remain. No old name remains in client source or HTML. TypeScript, production build and all 12 browser test groups passed. The 390 px mobile screenshot confirms that the updated logo, booking button and menu fit together without overlap.
