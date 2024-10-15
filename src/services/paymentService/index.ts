import { axiosClients } from '@/apis/axiosClients'

// Hàm gọi API thanh toán
export const createPaymentLink = async () => {
  try {
    const response = await axiosClients.post('/payment-link', {
      amount: 10000 // Số tiền thanh toán, bạn có thể tùy chỉnh
    })

    // Điều hướng người dùng tới URL thanh toán mà PayOS trả về
    window.location.href = response.data.checkoutUrl
  } catch (error) {
    console.error('Lỗi khi tạo liên kết thanh toán:', error)
    alert('Có lỗi xảy ra khi tạo liên kết thanh toán. Vui lòng thử lại.')
  }
}
