import { icon } from "./icons.js";

// One <dialog> reused as a bottom sheet. showModal() gives us focus trapping and Esc for free.
const dialog = document.getElementById("sheet");
let onCloseFn = null;

dialog.addEventListener("click", (e) => {
  if (e.target === dialog || e.target.closest("[data-close]")) close();
});
dialog.addEventListener("close", () => {
  document.documentElement.classList.remove("locked");
  const fn = onCloseFn;
  onCloseFn = null;
  fn?.();
});

/**
 * open({ title, body, onClose, variant })
 * body: an HTML string or a function(panelEl) that fills the panel and wires events.
 */
export function open({ title = "", body, onClose = null, variant = "" }) {
  // If a sheet is already open we swap its content in place (closing would fire "close" later, async)
  dialog.className = `sheet ${variant}`;
  dialog.innerHTML = `
    <div class="sheet-panel">
      <div class="sheet-grip" aria-hidden="true"></div>
      <div class="sheet-head">
        <h2 class="sheet-title">${title}</h2>
        <button type="button" class="icon-btn" data-close aria-label="قفل">${icon("x")}</button>
      </div>
      <div class="sheet-body"></div>
    </div>`;
  const panel = dialog.querySelector(".sheet-body");
  if (typeof body === "function") body(panel);
  else panel.innerHTML = body;
  onCloseFn = onClose;
  document.documentElement.classList.add("locked");
  if (!dialog.open) dialog.showModal();
  return panel;
}

export const close = () => dialog.open && dialog.close();
export const isOpen = () => dialog.open;
