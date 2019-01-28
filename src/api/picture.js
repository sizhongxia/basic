import axios from '@/libs/api.request'

export const loadPictures = ({ page, size }) => {
  const data = {
    page,
    size
  }
  return axios.request({
    url: 'system/picture/list',
    data,
    method: 'post'
  })
}
