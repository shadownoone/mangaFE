import { axiosClients } from '@/apis/axiosClients'
import PATH from '@/utils/path'
import Cookies from 'js-cookie'

export const handleLogin = async (username: string, password: string) => {
  try {
    const response = await axiosClients.post('/auth/login', {
      username,
      password
    })

    // Kiểm tra code trong response.data.user
    if (response.data.user && response.data.user.code === 0) {
      alert('Login successful!')
      Cookies.set('accessToken', response.data.user.data.accessToken, { expires: 1 })

      if (response.data.user.data.role === 0) {
        window.location.href = PATH.home
      }
    } else {
      alert(response.data.user?.message || 'Login failed!')
    }
  } catch (error) {
    console.error('Error during login:', error)
    alert('Login failed, please try again.')
  }
}
