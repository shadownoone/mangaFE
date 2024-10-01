import { axiosClients } from '@/apis/axiosClients'

export const handleAddToFavorites = async (mangaId: any) => {
  try {
    const response = await axiosClients.post('/favorites/add', {
      manga_id: mangaId
    })

    alert(response.data.message)
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

    alert(response.data.message)
  } catch (error) {
    console.error('Error delete to favorites:', error)
    alert('Failed to delete to favorites.')
  }
}
