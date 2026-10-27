// Branch settings. Everything the owner might ask to change lives here or in data/menu.js.
export const config = {
  branch: {
    name: "فرع القنطرة شرق",
    landmark: "أمام جامعة سيناء",
    address: "شارع مسجد سيد المرسلين، أمام جامعة سيناء، القنطرة شرق",
    phone: "01035350012",
    mapsUrl:
      "https://www.google.com/maps/search/?api=1&query=" +
      encodeURIComponent("Ming Burger القنطرة شرق جامعة سيناء"),
  },

  // Cairo local time, minutes from midnight. Outside this window the lunch menu opens by default.
  breakfast: { from: 7 * 60, to: 14 * 60 },

  // false: both menus can be ordered any time (switching only changes the default).
  // true: breakfast items are greyed out outside the breakfast window.
  strictBreakfastHours: false,

  // Show the "send order on WhatsApp" button. Set to null if the branch has no WhatsApp ordering.
  // International format without "+", e.g. "201035350012".
  whatsapp: "201035350012",

  // Extra charge to turn a sandwich into a combo (from the printed lunch menu).
  comboPrice: 35,

  currency: "ج",
};
