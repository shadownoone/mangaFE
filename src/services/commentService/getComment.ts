import { axiosClients } from '@/apis/axiosClients'

export const getComment = async () => {
  return await axiosClients.get('/comments/').then((res: any) => {
    return res.data
  })
}
