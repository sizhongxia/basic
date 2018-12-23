import axios from '@/libs/api.request'

export const areas = () => {
  const data = {
  }
  return axios.request({
    url: 'areas',
    data,
    method: 'post'
  })
}
