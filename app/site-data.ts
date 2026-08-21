export type RoomId =
  | "three"
  | "four-balcony"
  | "four"
  | "clarify";

export type SeasonPeriod = {
  label: string;
  from: string;
  to: string;
  prices: Record<Exclude<RoomId, "clarify">, number>;
};

export const siteConfig = {
  name: "Постоялый двор",
  location: "Небуг",
  address: "ул. Приморская, 13А",
  distanceToSea: "около 200 м до моря",
  whatsappNumber: "79184505226",
  whatsappDisplay: "+7 918 450-52-26",
  season: "2026",
  limits: { minGuests: 1, maxGuests: 4, minAdults: 1 },
  amenities: [
    { title: "Кухня с посудой", detail: "Для самостоятельного приготовления" },
    { title: "Парковка", detail: "На территории" },
    { title: "Wi‑Fi", detail: "Для связи и отдыха" },
    { title: "Мангал", detail: "Для спокойных вечеров" },
    { title: "Беседка", detail: "Общее место на территории" },
    { title: "Стиральная машина", detail: "Доступна на территории" },
    { title: "Рядом кафе и магазины", detail: "Всё необходимое недалеко" },
  ],
  seasonPeriods: [
    { label: "1–10 июня", from: "2026-06-01", to: "2026-06-10", prices: { three: 3000, "four-balcony": 1800, four: 3500 } },
    { label: "11–20 июня", from: "2026-06-11", to: "2026-06-20", prices: { three: 3500, "four-balcony": 2100, four: 4000 } },
    { label: "21–30 июня", from: "2026-06-21", to: "2026-06-30", prices: { three: 3800, "four-balcony": 2400, four: 4500 } },
    { label: "1–10 июля", from: "2026-07-01", to: "2026-07-10", prices: { three: 4200, "four-balcony": 2700, four: 5000 } },
    { label: "11–20 июля", from: "2026-07-11", to: "2026-07-20", prices: { three: 4500, "four-balcony": 3000, four: 5500 } },
    { label: "21–31 июля", from: "2026-07-21", to: "2026-07-31", prices: { three: 5000, "four-balcony": 3300, four: 6000 } },
    { label: "1–10 августа", from: "2026-08-01", to: "2026-08-10", prices: { three: 5000, "four-balcony": 3300, four: 6000 } },
    { label: "11–24 августа", from: "2026-08-11", to: "2026-08-24", prices: { three: 5000, "four-balcony": 3300, four: 6000 } },
    { label: "25–31 августа", from: "2026-08-25", to: "2026-08-31", prices: { three: 4200, "four-balcony": 2700, four: 5000 } },
    { label: "1–10 сентября", from: "2026-09-01", to: "2026-09-10", prices: { three: 4000, "four-balcony": 2500, four: 4500 } },
    { label: "11–20 сентября", from: "2026-09-11", to: "2026-09-20", prices: { three: 4000, "four-balcony": 2500, four: 4500 } },
    { label: "21–30 сентября", from: "2026-09-21", to: "2026-09-30", prices: { three: 3500, "four-balcony": 2100, four: 4000 } },
    { label: "1–15 октября", from: "2026-10-01", to: "2026-10-15", prices: { three: 1800, "four-balcony": 1800, four: 2000 } },
    { label: "16–31 октября", from: "2026-10-16", to: "2026-10-31", prices: { three: 1500, "four-balcony": 1500, four: 2000 } },
  ] satisfies SeasonPeriod[],
} as const;

export const roomOptions = [
  { id: "three", title: "3-местный номер", capacity: 3, eyebrow: "Для пары или небольшой семьи", features: ["Wi‑Fi", "Холодильник", "Посуда", "Санузел и душ"], note: "Отдельный номер на 3 гостей" },
  { id: "four-balcony", title: "3-местный с дополнительным местом", capacity: 4, eyebrow: "Вариант с балконом", features: ["Wi‑Fi", "Балкон", "Кресло-кровать", "Санузел и душ"], note: "В карточке объекта — 3х-4х-местный с балконом" },
  { id: "four", title: "4-местный номер", capacity: 4, eyebrow: "Когда важно разместиться всем вместе", features: ["Wi‑Fi", "Балкон", "Холодильник", "Санузел и душ"], note: "Отдельный номер на 4 гостей" },
  { id: "clarify", title: "Вариант уточняется", capacity: 4, eyebrow: "Если нужен ещё один вариант", features: ["Вместимость до 4 гостей", "Характеристики уточняются"], note: "Подберём и подтвердим детали в WhatsApp" },
] satisfies Array<{ id: RoomId; title: string; capacity: number; eyebrow: string; features: string[]; note: string }>;

export function getRoom(roomId: RoomId) { return roomOptions.find((room) => room.id === roomId) ?? roomOptions[0]; }
export function formatPrice(value: number | null) { return value === null ? "Уточняется" : `${new Intl.NumberFormat("ru-RU").format(value)} ₽`; }
function parseDate(value: string) { return new Date(`${value}T12:00:00`); }
export function getNights(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  const difference = parseDate(checkOut).getTime() - parseDate(checkIn).getTime();
  return difference > 0 ? Math.round(difference / 86400000) : 0;
}
export function getEstimatedTotal(roomId: RoomId, checkIn: string, checkOut: string) {
  const room = getRoom(roomId);
  if (room.id === "clarify") return null;
  const nights = getNights(checkIn, checkOut);
  if (!nights) return null;
  let total = 0;
  for (let index = 0; index < nights; index += 1) {
    const date = parseDate(checkIn);
    date.setDate(date.getDate() + index);
    const isoDate = date.toISOString().slice(0, 10);
    const period = siteConfig.seasonPeriods.find((item) => isoDate >= item.from && isoDate <= item.to);
    if (!period) return null;
    total += period.prices[room.id];
  }
  return total;
}
export function getNightlyPrice(roomId: RoomId, checkIn: string) {
  const room = getRoom(roomId);
  if (room.id === "clarify" || !checkIn) return null;
  const period = siteConfig.seasonPeriods.find((item) => checkIn >= item.from && checkIn <= item.to);
  return period?.prices[room.id] ?? null;
}
