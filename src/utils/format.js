export function fmtMoney(n) {
  return "₹" + (Number(n) || 0).toLocaleString("en-IN");
}
