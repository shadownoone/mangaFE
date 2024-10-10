import { axiosClients } from '@/apis/axiosClients'

export const getComment = async () => {
  return await axiosClients.get('/comments/all').then((res: any) => {
    return res.data
  })
}

export const getCommentByManga = async (manga_id: any) => {
  return await axiosClients.get('/comments/' + manga_id).then((res: any) => {
    return res.data
  })
}

export const addComment = async (manga_id: string, content: string, chapter_id?: string) => {
  try {
    const response = await axiosClients.post('/comments/create', {
      manga_id,
      content,
      chapter_id
    })

    return response.data // Trả về dữ liệu từ server
  } catch (error) {
    console.error('Error adding comment:', error)
    throw error // Bắn ra lỗi nếu có vấn đề
  }
}

export const deleteComment = async (commentId: any) => {
  try {
    const response = await axiosClients.delete('/comments/delete', {
      data: { commentId }
    })

    alert(response.data.message)
  } catch (error) {
    console.error('Error delete to comments:', error)
    alert('Failed to delete to comments.')
  }
}
