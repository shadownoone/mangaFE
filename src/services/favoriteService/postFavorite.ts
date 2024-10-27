import { axiosClients } from '@/apis/axiosClients'
import { toast } from 'react-toastify'

export const handleAddToFavorites = async (mangaId: any) => {
  try {
    const response = await axiosClients.post('/favorites/add', {
      manga_id: mangaId
    })

    toast.success(response.data.message)
  } catch (error) {
    console.error('Error adding to favorites:', error)
    alert('Failed to add to favorites.')
  }
}

export const handleDeleteToFavorites = async (favoriteId: any) => {
  try {
    const response = await axiosClients.delete('/favorites/remove', {
      data: { favorite_id: favoriteId }
    })

    toast.success(response.data.message)
  } catch (error) {
    console.error('Error delete to favorites:', error)
    alert('Failed to delete to favorites.')
  }
}
