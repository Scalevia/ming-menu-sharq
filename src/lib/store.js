import { config } from "../config.js";
import { findItem, itemPrice } from "../data/menu.js";

// localStorage can be missing or throw (private mode, blocked storage); the menu must work without it
export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}
export function save(key, value) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

const CART_KEY = "ming-sharq-cart";
const CART_TTL = 6 * 60 * 60 * 1000; // an order from this morning shouldn't greet you tonight

let lines = [];
let orderNote = "";
const listeners = new Set();

{
  const saved = load(CART_KEY, null);
  if (saved && Date.now() - saved.at < CART_TTL) {
    lines = saved.lines.filter((l) => findItem(l.id)); // drop items removed from the menu
    orderNote = saved.note ?? "";
  }
}

const persist = () => save(CART_KEY, lines.length ? { at: Date.now(), lines, note: orderNote } : null);

function commit() {
  persist();
  listeners.forEach((fn) => fn());
}

// The same item with a different note ("من غير بصل") is its own line
const keyOf = (id, variant, combo, note) => `${id}|${variant ?? ""}|${combo ? 1 : 0}|${note}`;

export const cart = {
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  lines: () => lines,
  add({ id, variant = null, combo = false, qty = 1, note = "" }) {
    note = note.trim();
    const key = keyOf(id, variant, combo, note);
    const line = lines.find((l) => l.key === key);
    if (line) line.qty += qty;
    else lines.push({ key, id, variant, combo, qty, note });
    commit();
  },
  note: () => orderNote,
  // Saved without notifying listeners, so the cart doesn't re-render (and drop focus) on every keystroke
  setNote(note) {
    orderNote = note;
    persist();
  },
  setQty(key, qty) {
    lines = qty > 0 ? lines.map((l) => (l.key === key ? { ...l, qty } : l)) : lines.filter((l) => l.key !== key);
    commit();
  },
  clear() {
    lines = [];
    orderNote = "";
    commit();
  },
  count: () => lines.reduce((n, l) => n + l.qty, 0),
  countOf: (id) => lines.reduce((n, l) => n + (l.id === id ? l.qty : 0), 0),
  total: () => lines.reduce((sum, l) => sum + lineTotal(l), 0),
};

export function unitPrice(line) {
  const { item } = findItem(line.id);
  return itemPrice(item, line.variant) + (line.combo ? config.comboPrice : 0);
}
export const lineTotal = (line) => unitPrice(line) * line.qty;

// "دبل · كومبو"
export function lineDetails(line) {
  const { item } = findItem(line.id);
  const parts = [];
  if (item.variants) parts.push((item.variants.find((v) => v.id === line.variant) ?? item.variants[0]).label);
  if (line.combo) parts.push("كومبو");
  return parts.join(" · ");
}
