import { axiosClients } from '@/apis/axiosClients'

export const getManga = async () => {
  return await axiosClients.get('/mangas/all').then((res: any) => {
    return res.data
  })
}

export const getMangaBySlug = async (slug: any) => {
  return await axiosClients.get('/mangas/' + slug).then((res: any) => {
    return res.data
  })
}

export const getMangaBySlugAndChapter = async (slug: any, slug_chapter: any) => {
  return await axiosClients
    .get(`/mangas/${slug}/${slug_chapter}`)
    .then((res: any) => res.data)
    .catch((err) => {
      console.error(err)
      throw err // Để xử lý lỗi nếu cần
    })
}

export const getMangaTop = async () => {
  return await axiosClients.get('mangas/top').then((res: any) => {
    return res.data
  })
}

// Hàm để tìm kiếm manga theo từ khóa
export const searchManga = async (params: any) => {
  try {
    const response = await axiosClients.get('/mangas/search', {
      params // Gửi từ khóa tìm kiếm như là tham số query
    })
    return response.data // Trả về dữ liệu từ API
  } catch (error) {
    console.error('Error fetching search results:', error)
    throw error // Ném lỗi lên để xử lý ở nơi gọi hàm
  }
}

export const getNewManga = async () => {
  return await axiosClients.get('/mangas/new-manga').then((res: any) => {
    return res.data
  })
}
