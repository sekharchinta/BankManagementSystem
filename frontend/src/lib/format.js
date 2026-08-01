import { CURRENCY, CURRENCY_LOCALE } from "./constants";

const currencyFormatter = new Intl.NumberFormat(CURRENCY_LOCALE, {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const currencyCompactFormatter = new Intl.NumberFormat(CURRENCY_LOCALE, {
  style: "currency",
  currency: CURRENCY,
  notation: "compact",
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat(CURRENCY_LOCALE, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberCompactFormatter = new Intl.NumberFormat(CURRENCY_LOCALE, {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** Convert a string/float/undefined safely to a number. */
export function toNumber(value) {
  if (value === null || value === undefined || value === "") return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function formatCurrency(value) {
  return currencyFormatter.format(toNumber(value));
}

export function formatCurrencyCompact(value) {
  return currencyCompactFormatter.format(toNumber(value));
}

export function formatNumber(value) {
  return numberFormatter.format(toNumber(value));
}

export function formatNumberCompact(value) {
  return numberCompactFormatter.format(toNumber(value));
}

export function formatDate(value, { withTime = false } = {}) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const datePart = date.toLocaleDateString(CURRENCY_LOCALE, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  if (!withTime) return datePart;

  const timePart = date.toLocaleTimeString(CURRENCY_LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart}, ${timePart}`;
}

export function formatDateTime(value) {
  return formatDate(value, { withTime: true });
}

export function timeAgo(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

/** "SB100000001" -> "SB 100 000 001" */
export function formatAccountNumber(value) {
  if (!value) return "—";
  const str = String(value);
  const prefix = str.slice(0, 2);
  const rest = str.slice(2);
  const groups = rest.match(/.{1,3}/g) || [];
  return [prefix, ...groups].join(" ");
}

export function initials(name = "") {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export function toISODate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
}
