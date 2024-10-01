import { axiosClients } from '@/apis/axiosClients'

export const getChapter = async () => {
  return await axiosClients.get('/chapters').then((res: any) => {
    return res.data
  })
}
