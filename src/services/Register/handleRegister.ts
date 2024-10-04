import { axiosClients } from '@/apis/axiosClients'
interface RegisterParams {
  username: string
  email: string
  password: string
}
export const handleRegister = async ({ username, email, password }: RegisterParams) => {
  try {
    const response = await axiosClients.post('/users/create', {
      username,
      email,
      password
    })

    return response.data
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}
