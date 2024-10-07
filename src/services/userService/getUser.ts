import { axiosClients } from '@/apis/axiosClients'

export const getCurrentUser = async () => {
  return await axiosClients.get('/auth/current-user').then((res: any) => {
    return res.data
  })
}

export const getHistoryBytUser = async () => {
  return await axiosClients.get('/users/last-read').then((res: any) => {
    return res.data
  })
}

export const getFavoriteBytUser = async () => {
  return await axiosClients.get('/users/favorites').then((res: any) => {
    return res.data
  })
}
