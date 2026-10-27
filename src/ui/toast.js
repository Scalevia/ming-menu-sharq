const el = document.getElementById("toast");
let timer;

export function toast(text) {
  el.textContent = text;
  el.classList.add("show");
  clearTimeout(timer);
  timer = setTimeout(() => el.classList.remove("show"), 1800);
}
