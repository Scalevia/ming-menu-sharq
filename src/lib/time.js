import { config } from "../config.js";

const cairoFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Africa/Cairo",
  hour: "numeric",
  minute: "numeric",
  hourCycle: "h23",
});

// Minutes since midnight in Cairo, whatever the visitor's phone clock or timezone says
export function cairoMinutes(date = new Date()) {
  const parts = Object.fromEntries(cairoFmt.formatToParts(date).map((p) => [p.type, p.value]));
  return Number(parts.hour) * 60 + Number(parts.minute);
}

export const isBreakfastTime = (m = cairoMinutes()) =>
  m >= config.breakfast.from && m < config.breakfast.to;

export const defaultMenuId = () => (isBreakfastTime() ? "breakfast" : "lunch");

// 420 -> "7 ص", 840 -> "2 م", 810 -> "1:30 م"
export function clock(min) {
  const h = Math.floor(min / 60) % 24;
  const mm = min % 60;
  const h12 = h % 12 || 12;
  return `${h12}${mm ? ":" + String(mm).padStart(2, "0") : ""} ${h < 12 ? "ص" : "م"}`;
}

// Egyptian counting: ساعة، دقيقة، دقيقتين، 5 دقايق، 20 دقيقة
function minutesAr(n) {
  if (n === 60) return "ساعة";
  if (n === 1) return "دقيقة";
  if (n === 2) return "دقيقتين";
  return n <= 10 ? `${n} دقايق` : `${n} دقيقة`;
}

/**
 * Status line under the menu toggle.
 * tone: "live" (open now), "soon" (closing within the hour), "off" (closed), "info"
 * orderable: false only when strict hours are on and breakfast is closed.
 */
export function menuStatus(menuId, m = cairoMinutes()) {
  const { from, to } = config.breakfast;
  if (menuId === "lunch") return { tone: "live", text: "منيو الغدا متاح دلوقتي", orderable: true };

  if (isBreakfastTime(m)) {
    const left = to - m;
    if (left <= 60)
      return { tone: "soon", text: `فاضل ${minutesAr(left)} على آخر الفطار`, orderable: true };
    return { tone: "live", text: `الفطار متاح لحد ${clock(to)}`, orderable: true };
  }
  if (config.strictBreakfastHours)
    return { tone: "off", text: `الفطار بيبدأ الساعة ${clock(from)}`, orderable: false };
  return { tone: "info", text: `مواعيد الفطار من ${clock(from)} لـ ${clock(to)}`, orderable: true };
}
