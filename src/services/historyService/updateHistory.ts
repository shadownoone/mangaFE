import { axiosClients } from '@/apis/axiosClients'
import { toast } from 'react-toastify'

export const updateHistory = async (mangaId: number, chapterId: number) => {
  try {
    const response = await axiosClients.post(`/histories/update`, {
      manga_id: mangaId,
      chapter_id: chapterId
    })
    return response.data
  } catch (error) {
    console.error('Error updating :', error)
    throw error
  }
}

export const handleDeleteToHistory = async (historyId: any) => {
  try {
    const response = await axiosClients.delete('/histories/delete', {
      data: { historyId }
    })

    toast.success(response.data.message)
  } catch (error) {
    console.error('Error delete to histories:', error)
    alert('Failed to delete to histories.')
  }
}
