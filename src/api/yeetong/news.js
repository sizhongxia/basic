import axios from '@/libs/api.request'

export const loadNews = ({ title, page, size, orderField, orderType }) => {
  const data = {
    title,
    page,
    size,
    orderField,
    orderType
  }
  return axios.request({
    url: 'yt/news/list',
    data,
    method: 'post'
  })
}
