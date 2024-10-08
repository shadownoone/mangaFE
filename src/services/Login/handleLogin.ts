import { axiosClients } from '@/apis/axiosClients'
import PATH from '@/utils/path'

export const handleLogin = async (username: string, password: string) => {
  try {
    const response = await axiosClients.post('/auth/login', {
      username,
      password
    })

    // Kiểm tra code trong response.data.user
    if (response.data.user && response.data.user.code === 0) {
      alert('Login successful!')

      if (response.data.user.data.role === 0) {
        window.location.href = PATH.home
      } else {
        window.location.href = 'http://localhost:5174/'
      }
    } else {
      alert(response.data.user?.message || 'Login failed!')
    }
  } catch (error) {
    console.error('Error during login:', error)
    alert('Login failed, please try again.')
  }
}
