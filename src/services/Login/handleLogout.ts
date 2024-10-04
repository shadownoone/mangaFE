import { axiosClients } from '@/apis/axiosClients'
import PATH from '@/utils/path'
import Cookies from 'js-cookie'

export const handleLogout = async () => {
  try {
    // Gọi API đăng xuất từ backend
    const response = await axiosClients.get('/auth/logout')

    if (response.status === 200) {
      // Xóa các cookies 'accessToken' và 'refreshToken' ở phía FE
      Cookies.remove('accessToken')
      Cookies.remove('refreshToken')

      // Chuyển hướng người dùng về trang đăng nhập
      window.location.href = PATH.login
    }
  } catch (error) {
    console.error('Error during logout:', error)
    alert('Logout failed, please try again.')
  }
}
