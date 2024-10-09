export const formatNumberSocial = (number: number) =>
  Intl.NumberFormat('en', { notation: 'compact' }).format(number)

export function formatCurrency(currency: number) {
  return new Intl.NumberFormat('de-DE').format(currency)
}

// Hàm tính toán thời gian đã trôi qua
export const timeAgo = (dateString: string) => {
  const now = new Date()
  const updatedDate = new Date(dateString)
  const seconds = Math.floor((now.getTime() - updatedDate.getTime()) / 1000)

  let interval = Math.floor(seconds / 31536000)
  if (interval > 1) return `${interval} năm trước`

  interval = Math.floor(seconds / 2592000)
  if (interval > 1) return `${interval} tháng trước`

  interval = Math.floor(seconds / 86400)
  if (interval > 1) return `${interval} ngày trước`

  interval = Math.floor(seconds / 3600)
  if (interval > 1) return `${interval} giờ trước`

  interval = Math.floor(seconds / 60)
  if (interval > 1) return `${interval} phút trước`

  return 'Vừa mới đây'
}
