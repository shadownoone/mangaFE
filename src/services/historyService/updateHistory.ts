import { axiosClients } from '@/apis/axiosClients'

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
