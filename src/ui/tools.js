import { menus } from "../data/menu.js";
import { money, esc } from "../lib/format.js";
import { foodArt, icon } from "./icons.js";
import { media, openItem } from "./order.js";
import * as sheet from "./sheet.js";

const QUICK_BUDGETS = [50, 100, 150, 200, 300];
let lastBudget = 100;

// Every orderable option (item × size) in a menu, as flat rows
function options(menuId) {
  return menus[menuId].categories.flatMap((cat) =>
    cat.items.flatMap((item) =>
      (item.variants ?? [{ id: null, label: "", price: item.price }]).map((v) => ({
        item,
        cat,
        label: v.label,
        price: v.price,
      }))
    )
  );
}

/* ---------- "معاك كام؟" ---------- */

export function openBudget(menuId) {
  sheet.open({
    title: "معاك كام؟",
    variant: "budget-sheet",
    body(panel) {
      panel.innerHTML = `
        <p class="sheet-lede">اكتب المبلغ اللي معاك ونوريك تقدر تاخد إيه من منيو ال${menus[menuId].label}.</p>
        <div class="budget-input">
          <label for="budget">المبلغ</label>
          <input id="budget" type="number" inputmode="numeric" min="0" step="5" value="${lastBudget}">
          <span>ج</span>
        </div>
        <div class="quick">${QUICK_BUDGETS.map((b) => `<button type="button" data-b="${b}">${b}</button>`).join("")}</div>
        <div class="budget-results" aria-live="polite"></div>`;

      const input = panel.querySelector("#budget");
      const results = panel.querySelector(".budget-results");
      const all = options(menuId).sort((a, b) => b.price - a.price);

      const render = () => {
        const budget = Math.max(0, Number(input.value) || 0);
        lastBudget = budget;
        panel.querySelectorAll("[data-b]").forEach((b) => b.setAttribute("aria-pressed", Number(b.dataset.b) === budget));
        const fits = all.filter((o) => o.price <= budget);
        if (!fits.length) {
          const cheapest = all[all.length - 1];
          results.innerHTML = `<p class="muted center">أرخص حاجة في المنيو ${esc(cheapest.item.ar)} بـ <b class="num">${money(cheapest.price)}</b></p>`;
          return;
        }
        results.innerHTML = `
          <p class="budget-count"><b class="num">${fits.length}</b> اختيار في حدود <span class="num">${money(budget)}</span></p>
          <ul class="mini-list">${fits
            .map(
              (o) => `<li><button type="button" data-item="${o.item.id}">
                ${media(o.item, o.cat.icon, "mini-thumb")}
                <span class="mini-text"><b>${esc(o.item.ar)}</b>${o.label ? `<small>${o.label}</small>` : ""}</span>
                <span class="mini-price"><b class="num">${money(o.price)}</b><small>${
                  budget - o.price ? `يفضل ${money(budget - o.price)}` : "بالظبط"
                }</small></span>
              </button></li>`
            )
            .join("")}</ul>`;
      };

      input.addEventListener("input", render);
      panel.addEventListener("click", (e) => {
        const quick = e.target.closest("[data-b]");
        const pick = e.target.closest("[data-item]");
        if (quick) {
          input.value = quick.dataset.b;
          render();
        } else if (pick) openItem(pick.dataset.item);
      });
      render();
    },
  });
}

/* ---------- "اختارلي" ---------- */

const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export function openRandom(menuId) {
  const pool = menus[menuId].categories.flatMap((cat) => cat.items.map((item) => ({ item, cat })));
  let timer;

  sheet.open({
    title: "مش عارف تاكل إيه؟",
    variant: "random-sheet",
    onClose: () => clearTimeout(timer),
    body(panel) {
      const spin = () => {
        clearTimeout(timer);
        const pick = pool[Math.floor(Math.random() * pool.length)];
        panel.innerHTML = `
          <div class="slot" aria-live="polite">
            <div class="slot-art">${foodArt(pick.cat.icon)}</div>
            <p class="slot-name">…</p>
          </div>
          <div class="sheet-actions" hidden>
            <button type="button" class="btn btn-ghost" data-again>${icon("dice")}اختار تاني</button>
            <button type="button" class="btn btn-primary grow" data-take>اطلبه!</button>
          </div>`;
        const name = panel.querySelector(".slot-name");
        const actions = panel.querySelector(".sheet-actions");
        const land = () => {
          name.innerHTML = `${esc(pick.item.ar)}<small class="latin">${esc(pick.item.en)}</small>`;
          name.classList.add("landed");
          panel.querySelector(".slot-art").innerHTML = media(pick.item, pick.cat.icon, "slot-img");
          actions.hidden = false;
          actions.querySelector("[data-take]").onclick = () => openItem(pick.item.id);
          actions.querySelector("[data-again]").onclick = spin;
        };
        if (reduceMotion()) return land();
        // Shuffle through names, slowing down, then land on the pick
        let delay = 45;
        const tick = () => {
          name.textContent = pool[Math.floor(Math.random() * pool.length)].item.ar;
          delay *= 1.17;
          timer = delay < 340 ? setTimeout(tick, delay) : setTimeout(land, delay);
        };
        tick();
      };
      spin();
    },
  });
}
