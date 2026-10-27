import { config } from "../config.js";

export const money = (n) => `${n} ${config.currency}`;

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Loose Arabic matching: ignore hamza forms, taa marbuta, alef maqsura, diacritics and tatweel
export const normalize = (s = "") =>
  s
    .toLowerCase()
    .replace(/[ً-ٟـ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .trim();
