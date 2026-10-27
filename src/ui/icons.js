// UI icons: 24px stroke icons that follow currentColor
const ui = {
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  wallet: '<path d="M19 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3"/><path d="M21 9h-5a3 3 0 0 0 0 6h5z"/>',
  dice: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r=".6" fill="currentColor"/><circle cx="15.5" cy="15.5" r=".6" fill="currentColor"/><circle cx="12" cy="12" r=".6" fill="currentColor"/><circle cx="15.5" cy="8.5" r=".6" fill="currentColor"/><circle cx="8.5" cy="15.5" r=".6" fill="currentColor"/>',
  bag: '<path d="M6 7h12l1 14H5z"/><path d="M9 10V6a3 3 0 0 1 6 0v4"/>',
  phone: '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2"/>',
  pin: '<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  receipt: '<path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
  whatsapp:
    '<path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.2z"/>',
};

export const icon = (name, cls = "") =>
  `<svg class="ico ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ui[name]}</svg>`;

// Line-art food tiles for items without a photo, drawn in the diner palette.
// .fl = red fill, .fi = ink fill, .fs = surface fill; strokes are ink (see .art in styles.css)
const art = {
  burger:
    '<path class="fl" d="M12 30c0-11 9-18 20-18s20 7 20 18z"/><path class="sesame" d="M24 19l2 1M32 17v2M40 19l-2 1M28 24h2M36 24h2"/><path d="M10 35c4-3 7 3 11 0s7 3 11 0 7 3 11 0 7 3 11 0"/><rect class="fi" x="11" y="39" width="42" height="7" rx="3.5"/><path class="fl" d="M12 49h40v1a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6z"/>',
  chicken:
    '<path class="fl" d="M42 8a14 14 0 0 1 10 24c-4 4-9 5-13 4l-9 9-6-6 9-9c-2-8 1-22 9-22z"/><path class="fs" d="M24 39l-7 7a4 4 0 1 1-5 1 4 4 0 1 1 1-5l7-7z"/><path d="M40 16c3 0 6 2 7 5"/>',
  fries:
    '<rect class="fs" x="19" y="9" width="5" height="20" rx="1.5" transform="rotate(-8 21 19)"/><rect class="fs" x="26" y="6" width="5" height="22" rx="1.5"/><rect class="fs" x="33" y="8" width="5" height="21" rx="1.5" transform="rotate(6 35 18)"/><rect class="fs" x="40" y="11" width="5" height="18" rx="1.5" transform="rotate(12 42 20)"/><path class="fl" d="M15 25h34l-4 31H19z"/><path class="stripe" d="M27 26l1 29M37 26l-1 29"/>',
  box:
    '<path class="fl" d="M10 26h44v25a5 5 0 0 1-5 5H15a5 5 0 0 1-5-5z"/><rect class="fs" x="7" y="19" width="50" height="9" rx="2.5"/><path d="M24 19c0-7 16-7 16 0"/><path class="stripe" d="M22 34v14M32 34v14M42 34v14"/>',
  star:
    '<path class="fl" d="M32 6l7 13 14-4-4 14 13 7-13 7 4 14-14-4-7 13-7-13-14 4 4-14L2 36l13-7-4-14 14 4z"/><path class="fs" d="M32 22l3 7h7l-6 4 3 7-7-4-7 4 3-7-6-4h7z"/>',
  sandwich:
    '<path class="fl" d="M6 34c0-9 12-14 26-14s26 5 26 14z"/><path class="sesame" d="M18 26l2 1M30 24v2M42 26l-2 1"/><path d="M5 38c4-3 7 3 11 0s7 3 11 0 7 3 11 0 7 3 11 0 7 3 10 0"/><path class="fl" d="M6 42h52a8 8 0 0 1-8 8H14a8 8 0 0 1-8-8z"/>',
};

export const foodArt = (name) =>
  `<svg class="art" viewBox="0 0 64 64" aria-hidden="true">${art[name] ?? art.burger}</svg>`;
