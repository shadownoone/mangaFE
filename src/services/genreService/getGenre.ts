import { axiosClients } from '@/apis/axiosClients'

export const getGenre = async () => {
  return await axiosClients.get('/genres/all').then((res: any) => {
    return res.data
  })
}

export const getMangaByGenre = async (genre: string, params?: any) => {
  return await axiosClients.get(`/genres/${genre}`, { params }).then((res: any) => {
    return res.data
  })
}
