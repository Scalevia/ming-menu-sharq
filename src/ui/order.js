import { config } from "../config.js";
import { findItem, itemPrice } from "../data/menu.js";
import { cart, lineDetails, lineTotal } from "../lib/store.js";
import { money, esc } from "../lib/format.js";
import { menuStatus } from "../lib/time.js";
import { icon, foodArt } from "./icons.js";
import * as sheet from "./sheet.js";
import { toast } from "./toast.js";

export const media = (item, catIcon, cls = "") =>
  item.image
    ? `<img class="${cls}" src="${item.image}" alt="${esc(item.ar)}" loading="lazy" decoding="async">`
    : `<div class="${cls} art-tile">${foodArt(catIcon)}</div>`;

const stepper = (value, label) => `
  <div class="stepper" role="group" aria-label="${label}">
    <button type="button" data-step="1" aria-label="زوّد">${icon("plus")}</button>
    <output>${value}</output>
    <button type="button" data-step="-1" aria-label="قلّل">${icon("minus")}</button>
  </div>`;

/* ---------- item details ---------- */

export function openItem(id) {
  const { item, menu, category } = findItem(id);
  const status = menuStatus(menu.id);
  const orderable = category.shared || status.orderable; // drinks/desserts sit in both menus
  const closedText = status.text;
  const state = { variant: item.variants?.[0].id ?? null, combo: false, qty: 1, note: "" };
  const unit = () => itemPrice(item, state.variant) + (state.combo ? config.comboPrice : 0);

  sheet.open({
    title: "",
    variant: "item-sheet",
    body(panel) {
      const render = () => {
        panel.innerHTML = `
          ${media(item, category.icon, "item-hero")}
          <div class="item-sheet-text">
            <p class="eyebrow">${esc(category.ar)}</p>
            <h3 class="item-sheet-name">${esc(item.ar)}</h3>
            <p class="latin">${esc(item.en)}</p>
            ${item.desc ? `<p class="item-sheet-desc">${esc(item.desc)}</p>` : ""}
          </div>
          ${
            item.variants
              ? `<fieldset class="choice">
                  <legend>اختار الحجم</legend>
                  <div class="seg">${item.variants
                    .map(
                      (v) => `<button type="button" data-variant="${v.id}" aria-pressed="${v.id === state.variant}">
                        <span>${v.label}</span><b class="num">${money(v.price)}</b></button>`
                    )
                    .join("")}</div>
                </fieldset>`
              : ""
          }
          ${
            item.combo
              ? `<label class="switch-row">
                  <span><b>اعمله كومبو</b><small>+${money(config.comboPrice)}</small></span>
                  <input type="checkbox" id="combo-toggle" ${state.combo ? "checked" : ""}>
                  <span class="switch" aria-hidden="true"></span>
                </label>`
              : ""
          }
          ${
            orderable
              ? `<div class="note-field">
                  <label for="item-note">ملاحظات على الصنف <small>(اختياري)</small></label>
                  <textarea id="item-note" rows="2" maxlength="140" placeholder="مثلاً: من غير بصل، صوص زيادة">${esc(state.note)}</textarea>
                </div>`
              : ""
          }
          <div class="sheet-actions">
            ${stepper(state.qty, "الكمية")}
            ${
              orderable
                ? `<button type="button" class="btn btn-primary grow" data-add>أضف للطلب · <span class="num">${money(unit() * state.qty)}</span></button>`
                : `<button type="button" class="btn grow" disabled>${esc(closedText)}</button>`
            }
          </div>`;
      };
      render();
      panel.addEventListener("click", (e) => {
        const v = e.target.closest("[data-variant]");
        const s = e.target.closest("[data-step]");
        if (v) state.variant = v.dataset.variant;
        else if (s) state.qty = Math.max(1, Math.min(20, state.qty + Number(s.dataset.step)));
        else if (e.target.closest("[data-add]")) {
          cart.add({ id: item.id, variant: state.variant, combo: state.combo, qty: state.qty, note: state.note });
          sheet.close();
          toast(`اتضاف ${item.ar} للطلب`);
          return;
        } else return;
        render();
      });
      // Kept in state (not re-rendered) so typing never loses focus
      panel.addEventListener("input", (e) => {
        if (e.target.id === "item-note") state.note = e.target.value;
      });
      panel.addEventListener("change", (e) => {
        if (e.target.id === "combo-toggle") {
          state.combo = e.target.checked;
          render();
        }
      });
    },
  });
}

/* ---------- cart ---------- */

function orderText() {
  const rows = cart
    .lines()
    .map((l) => {
      const { item } = findItem(l.id);
      const d = lineDetails(l);
      return `• ${l.qty}× ${item.ar}${d ? ` (${d})` : ""}: ${money(lineTotal(l))}${l.note ? `\n   ملاحظة: ${l.note}` : ""}`;
    })
    .join("\n");
  const note = cart.note().trim();
  return `طلب جديد من منيو مينج، ${config.branch.name}\n\n${rows}\n\nالإجمالي: ${money(cart.total())}${
    note ? `\n\nملاحظات على الطلب: ${note}` : ""
  }`;
}

const waLink = () => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(orderText())}`;

function cartBody(panel) {
  const lines = cart.lines();
  if (!lines.length) {
    panel.innerHTML = `
      <div class="empty">
        ${foodArt("burger")}
        <p><b>طلبك لسه فاضي</b><br>دوس على + جنب أي صنف عشان تضيفه.</p>
        <button type="button" class="btn btn-primary" data-close>يلا نختار</button>
      </div>`;
    return;
  }
  panel.innerHTML = `
    <ul class="cart-lines">${lines
      .map((l) => {
        const { item } = findItem(l.id);
        const d = lineDetails(l);
        return `<li data-key="${esc(l.key)}">
          <div class="cart-line-text">
            <b>${esc(item.ar)}</b>
            ${d ? `<small>${esc(d)}</small>` : ""}
            ${l.note ? `<small class="line-note">ملاحظة: ${esc(l.note)}</small>` : ""}
            <span class="num price-sm">${money(lineTotal(l))}</span>
          </div>
          ${stepper(l.qty, `كمية ${esc(item.ar)}`)}
        </li>`;
      })
      .join("")}</ul>

    <div class="total-row"><span>الإجمالي</span><b class="num">${money(cart.total())}</b></div>

    <div class="note-field">
      <label for="order-note">ملاحظات على الطلب <small>(اختياري)</small></label>
      <textarea id="order-note" rows="2" maxlength="300" placeholder="مثلاً: تيك أواي، هاجي الساعة 3">${esc(cart.note())}</textarea>
    </div>

    <div class="cart-actions">
      ${
        config.whatsapp
          ? `<a class="btn btn-whatsapp" href="${waLink()}" target="_blank" rel="noopener" data-wa>${icon("whatsapp")}ابعت الطلب واتساب</a>`
          : ""
      }
      <button type="button" class="btn btn-ghost" data-cashier>${icon("receipt")}اعرضه للكاشير</button>
      <button type="button" class="btn-link" data-clear>امسح الطلب</button>
    </div>`;
}

export function openCart() {
  let panel;
  const rerender = () => panel && cartBody(panel);
  const unsubscribe = cart.subscribe(rerender);
  sheet.open({
    title: "طلبك",
    variant: "cart-sheet",
    onClose: unsubscribe,
    body(p) {
      panel = p;
      cartBody(p);
      p.addEventListener("input", (e) => {
        if (e.target.id !== "order-note") return;
        cart.setNote(e.target.value);
        // the WhatsApp message carries the note, so refresh its link in place
        const wa = p.querySelector("[data-wa]");
        if (wa) wa.href = waLink();
      });
      p.addEventListener("click", (e) => {
        const step = e.target.closest("[data-step]");
        const clear = e.target.closest("[data-clear]");
        if (step) {
          const key = step.closest("li").dataset.key;
          const line = cart.lines().find((l) => l.key === key);
          cart.setQty(key, line.qty + Number(step.dataset.step));
        } else if (clear) {
          // Two taps to clear, since the viewer can't undo it
          if (clear.dataset.armed) cart.clear();
          else {
            clear.dataset.armed = "1";
            clear.textContent = "متأكد؟ دوس تاني للمسح";
          }
        } else if (e.target.closest("[data-cashier]")) {
          unsubscribe();
          openCashier();
        }
      });
    },
  });
}

// Big, high-contrast summary to turn the phone around at the counter
function openCashier() {
  sheet.open({
    title: "الطلب",
    variant: "cashier-sheet",
    body: `
      <ul class="cashier-lines">${cart
        .lines()
        .map((l) => {
          const { item } = findItem(l.id);
          const d = lineDetails(l);
          return `<li><span class="num qty">${l.qty}×</span><span>${esc(item.ar)}${d ? `<small>${esc(d)}</small>` : ""}${
            l.note ? `<small class="line-note">ملاحظة: ${esc(l.note)}</small>` : ""
          }</span><b class="num">${money(lineTotal(l))}</b></li>`;
        })
        .join("")}</ul>
      ${cart.note().trim() ? `<div class="cashier-note"><b>ملاحظات على الطلب</b>${esc(cart.note())}</div>` : ""}
      <div class="cashier-total"><span>الإجمالي</span><b class="num">${money(cart.total())}</b></div>
      <button type="button" class="btn btn-ghost" data-back>رجوع للطلب</button>`,
  });
  document.querySelector("#sheet [data-back]").addEventListener("click", openCart);
}
