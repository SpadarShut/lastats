export function formatUSD(n) {
  return new Intl.NumberFormat('ru', {
    style: 'currency',
    currency: 'USD',
  }).format(n)
}