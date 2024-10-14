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

export const uploadSingleImage = async (base64: any) => {
  try {
    const response = await axiosClients.post(`/users/uploadImage`, { image: base64 })
    return response.data
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error // Ném lỗi ra để xử lý bên ngoài nếu cần
  }
}

export const uploadMultipleImages = async (images: any) => {
  try {
    const response = await axiosClients.post(`/users/uploadMultipleImages`, { images })
    return response.data
  } catch (error) {
    console.error('Error uploading multiple images:', error)
    throw error // Ném lỗi ra để xử lý bên ngoài nếu cần
  }
}
