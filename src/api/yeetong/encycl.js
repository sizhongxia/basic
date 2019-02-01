import axios from '@/libs/api.request'

export const loadEncycls = ({ searchValue, page, size, orderField, orderType }) => {
  const data = {
    searchValue,
    page,
    size,
    orderField,
    orderType
  }
  return axios.request({
    url: 'yt/encycl/list',
    data,
    method: 'post'
  })
}

export const encyclDetail = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'yt/encycl/detail',
    data,
    method: 'post'
  })
}

export const upinsertEncycl = (data) => {
  return axios.request({
    url: 'yt/encycl/upinsert',
    data,
    method: 'post'
  })
}

export const deleteEncycl = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'yt/encycl/delete',
    data,
    method: 'post'
  })
}

export const deleteEncyclLabel = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'yt/encycl/deleteLabel',
    data,
    method: 'post'
  })
}
