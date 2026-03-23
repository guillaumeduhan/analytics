import numeral from 'numeral'

export function formatNumber(value: number): string {
  if (value < 1000) return numeral(value).format('0')
  if (value < 10000) return numeral(value).format('0.0a')
  if (value < 1000000) return numeral(value).format('0a')
  return numeral(value).format('0.0a')
}
