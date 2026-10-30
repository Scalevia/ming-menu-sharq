import "./styles.css";
import { config } from "./config.js";
import { menus, minPrice } from "./data/menu.js";
import { cart } from "./lib/store.js";
import { defaultMenuId, menuStatus, clock } from "./lib/time.js";
import { money, esc, normalize } from "./lib/format.js";
import { icon } from "./ui/icons.js";
import { media, openItem, openCart } from "./ui/order.js";
import { openBudget, openRandom } from "./ui/tools.js";

const $ = (s, root = document) => root.querySelector(s);

/* ---------- which menu opens ---------- */
// ?menu=breakfast|lunch (the labelled QR codes) wins; otherwise Cairo time decides, and keeps deciding
// while the page is open, until the visitor picks a tab themselves.
const urlMenu = new URLSearchParams(location.search).get("menu");
const pinned = Boolean(menus[urlMenu]);
let current = pinned ? urlMenu : defaultMenuId();
let userPicked = false;
let query = "";

const root = document.documentElement;

/* ---------- static bits ---------- */
$("#branch-name").textContent = config.branch.name;
$("#branch-landmark").textContent = config.branch.landmark;
$("#search-btn").innerHTML = icon("search");
$("#search-close").innerHTML = icon("x");
$("#tool-budget .tool-ico").innerHTML = icon("wallet");
$("#tool-random .tool-ico").innerHTML = icon("dice");
$("#footer").innerHTML = `
  <img src="logo.png" alt="Ming Burger" class="footer-logo" width="120" height="50">
  <ul class="footer-list">
    <li>${icon("pin")}<span>${esc(config.branch.address)}</span></li>
    <li>${icon("clock")}<span>الفطار من ${clock(config.breakfast.from)} لـ ${clock(config.breakfast.to)}</span></li>
    <li>${icon("phone")}<a href="tel:${config.branch.phone}" class="num">${config.branch.phone}</a></li>
  </ul>
  <div class="footer-actions">
    <a class="btn btn-ghost" href="tel:${config.branch.phone}">${icon("phone")}اتصل بينا</a>
    <a class="btn btn-ghost" href="${config.branch.mapsUrl}" target="_blank" rel="noopener">${icon("pin")}الموقع على الخريطة</a>
  </div>`;

/* ---------- menu toggle + status ---------- */
const toggle = $("#menu-toggle");
toggle.innerHTML = Object.values(menus)
  .map((m) => `<button type="button" data-menu="${m.id}">${m.label}</button>`)
  .join("");
toggle.addEventListener("click", (e) => {
  const b = e.target.closest("[data-menu]");
  if (!b || b.dataset.menu === current) return;
  current = b.dataset.menu;
  userPicked = true;
  renderAll();
  window.scrollTo({ top: 0, behavior: "instant" });
});

function renderStatus() {
  const s = menuStatus(current);
  const el = $("#status");
  el.dataset.tone = s.tone;
  el.textContent = s.text;
  toggle.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.menu === current));
}

/* ---------- menu list ---------- */
const priceHtml = (item) => {
  if (!item.variants) return `<span class="price num">${item.price}<small>ج</small></span>`;
  const [a, b] = item.variants;
  return `<span class="price num">${a.price}<small>ج</small></span><span class="price-alt">${b.label} <b class="num">${b.price}</b></span>`;
};

const TAGS = { special: ["سبيشال", "tag-red"], best: ["الأكثر مبيعًا", "tag-blue"], new: ["جديد", "tag-red"] };
const tagsHtml = (item) =>
  (item.tags ?? []).map((t) => `<span class="tag ${TAGS[t][1]}">${TAGS[t][0]}</span>`).join("");

function itemCard(item, cat, orderable) {
  const inCart = cart.countOf(item.id);
  return `
    <li>
      <button type="button" class="item${orderable ? "" : " is-off"}" data-item="${item.id}">
        <span class="item-text">
          ${tagsHtml(item) ? `<span class="tags">${tagsHtml(item)}</span>` : ""}
          <span class="item-name">${esc(item.ar)}</span>
          <span class="latin">${esc(item.en)}</span>
          ${item.desc ? `<span class="item-desc">${esc(item.desc)}</span>` : ""}
          <span class="item-price">${priceHtml(item)}</span>
        </span>
        <span class="item-media">
          ${media(item, cat.icon, "thumb")}
          <span class="add-badge${inCart ? " has" : ""}" aria-hidden="true">${inCart ? inCart : icon("plus")}</span>
        </span>
      </button>
    </li>`;
}

function featuredCard(item, i) {
  return `
    <button type="button" class="feature ${i % 2 ? "feature-blue" : "feature-red"}" data-item="${item.id}">
      ${tagsHtml(item)}
      <span class="feature-name">${esc(item.ar)}</span>
      <span class="feature-en">${esc(item.en)}</span>
      <span class="feature-desc">${esc(item.desc ?? "")}</span>
      <span class="feature-price num">${money(minPrice(item))}</span>
    </button>`;
}

function renderMenu() {
  const menu = menus[current];
  const { orderable } = menuStatus(current);
  $("#menu").innerHTML = menu.categories
    .map((cat) =>
      cat.id === "specials"
        ? `<section class="cat" id="cat-${cat.id}" data-cat="${cat.id}">
            <h2 class="cat-title">${esc(cat.ar)}<span class="latin">${esc(cat.en)}</span></h2>
            <div class="features">${cat.items.map(featuredCard).join("")}</div>
          </section>`
        : `<section class="cat" id="cat-${cat.id}" data-cat="${cat.id}">
            <h2 class="cat-title">${esc(cat.ar)}<span class="latin">${esc(cat.en)}</span></h2>
            <ul class="items">${cat.items.map((it) => itemCard(it, cat, cat.shared || orderable)).join("")}</ul>
          </section>`
    )
    .join("");

  const chips = $("#chips");
  chips.hidden = menu.categories.length < 2;
  chips.innerHTML = menu.categories.map((c) => `<a href="#cat-${c.id}" data-chip="${c.id}">${esc(c.ar)}</a>`).join("");
  watchSections();
}

/* ---------- search ---------- */
function renderSearch() {
  const q = normalize(query);
  // Current menu first, so the other menu's results come after one "من منيو ..." label
  const ordered = [menus[current], ...Object.values(menus).filter((m) => m.id !== current)];
  const hits = ordered.flatMap((menu) =>
    // shared sections (drinks, desserts) are in both menus; list them once, under the current menu
    menu.categories.filter((cat) => !cat.shared || menu.id === current).flatMap((cat) =>
      cat.items
        .filter((it) => normalize(`${it.ar} ${it.en} ${it.desc ?? ""}`).includes(q))
        .map((it) => ({ it, cat, menu }))
    )
  );
  $("#chips").hidden = true;
  $("#menu").innerHTML = hits.length
    ? `<section class="cat"><h2 class="cat-title">نتايج البحث<span class="latin">${hits.length}</span></h2>
        <ul class="items">${hits
          .map(
            ({ it, cat, menu }, i) =>
              (menu.id !== current && hits[i - 1]?.menu !== menu
                ? `<li class="from-other">من منيو ال${menu.label}</li>`
                : "") + itemCard(it, cat, cat.shared || menuStatus(menu.id).orderable)
          )
          .join("")}</ul></section>`
    : `<p class="no-results">مفيش حاجة باسم "<b>${esc(query)}</b>". جرّب اسم تاني أو دوّر بالإنجليزي.</p>`;
}

const bar = $("#bar");
$("#search-btn").addEventListener("click", () => {
  bar.classList.add("searching");
  $("#search").focus();
});
$("#search-close").addEventListener("click", () => {
  bar.classList.remove("searching");
  $("#search").value = query = "";
  renderMenu();
});
$("#search").addEventListener("input", (e) => {
  query = e.target.value;
  if (query.trim()) renderSearch();
  else renderMenu();
});

/* ---------- category chips follow the scroll ---------- */
let observer;
function watchSections() {
  observer?.disconnect();
  const chips = $("#chips");
  const visible = new Map();
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => visible.set(e.target.dataset.cat, e.isIntersecting));
      const first = [...document.querySelectorAll(".cat[data-cat]")].find((s) => visible.get(s.dataset.cat));
      if (!first) return;
      chips.querySelectorAll("a").forEach((a) => {
        const on = a.dataset.chip === first.dataset.cat;
        a.toggleAttribute("aria-current", on);
        if (on) {
          const target = a.offsetLeft - (chips.clientWidth - a.offsetWidth) / 2;
          chips.scrollTo({ left: target, behavior: "smooth" });
        }
      });
    },
    // the "active" band sits just under the sticky bar
    { rootMargin: `-${bar.offsetHeight + 8}px 0px -55% 0px` }
  );
  document.querySelectorAll(".cat[data-cat]").forEach((s) => observer.observe(s));
}

// Sections land below the sticky bar when jumped to
new ResizeObserver(() => root.style.setProperty("--bar-h", `${bar.offsetHeight}px`)).observe(bar);

/* ---------- item taps (one listener for every card) ---------- */
$("#menu").addEventListener("click", (e) => {
  const card = e.target.closest("[data-item]");
  if (card) openItem(card.dataset.item);
});
$("#tool-budget").addEventListener("click", () => openBudget(current));
$("#tool-random").addEventListener("click", () => openRandom(current));

/* ---------- cart bar ---------- */
const cartBar = $("#cart-bar");
cartBar.addEventListener("click", openCart);
function renderCartBar() {
  const n = cart.count();
  cartBar.hidden = n === 0;
  cartBar.innerHTML = `
    <span class="cart-count num">${n}</span>
    <span class="cart-label">${icon("bag")}شوف طلبك</span>
    <b class="num">${money(cart.total())}</b>`;
  cartBar.classList.remove("bump");
  void cartBar.offsetWidth; // restart the animation
  cartBar.classList.add("bump");
}
cart.subscribe(() => {
  renderCartBar();
  // refresh the +/count badges on the cards
  document.querySelectorAll("#menu [data-item]").forEach((card) => {
    const badge = card.querySelector(".add-badge");
    if (!badge) return;
    const n = cart.countOf(card.dataset.item);
    badge.classList.toggle("has", n > 0);
    badge.innerHTML = n ? n : icon("plus");
  });
});

/* ---------- go ---------- */
function renderAll() {
  renderStatus();
  if (query.trim()) renderSearch();
  else renderMenu();
}
renderAll();
renderCartBar();
cartBar.classList.remove("bump");
// Follow the clock while the page stays open: at 7 AM / 2 PM the right tab opens by itself
function followClock() {
  const due = defaultMenuId();
  if (!pinned && !userPicked && due !== current) {
    current = due;
    renderAll();
  } else renderStatus();
}
setInterval(followClock, 30_000);

// Phones freeze timers in background tabs. Coming back after a while counts as a fresh visit.
let hiddenAt = 0;
document.addEventListener("visibilitychange", () => {
  if (document.hidden) return void (hiddenAt = Date.now());
  if (Date.now() - hiddenAt > 30 * 60_000) userPicked = false;
  followClock();
});
