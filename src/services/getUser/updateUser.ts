import { axiosClients } from '@/apis/axiosClients'

export const updateProfile = async (updateData: any) => {
  try {
    const response = await axiosClients.put(`/users/update`, updateData)
    return response.data
  } catch (error) {
    console.error('Error updating profile:', error)
    throw error // Ném lỗi ra để xử lý bên ngoài nếu cần
  }
}
