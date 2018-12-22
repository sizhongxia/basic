import axios from '@/libs/api.request'

export const loadOrganizes = ({ searchValue, page, size, orderField, orderType }) => {
  const data = {
    searchValue,
    page,
    size,
    orderField,
    orderType
  }
  return axios.request({
    url: 'organize/list',
    data,
    method: 'post'
  })
}

export const deleteOrganize = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'organize/delete',
    data,
    method: 'post'
  })
}

export const upinsertOrganize = ({ organizeId, organizeName }) => {
  const data = {
    organizeId,
    organizeName
  }
  return axios.request({
    url: 'organize/upinsert',
    data,
    method: 'post'
  })
}

export const allOrganizes = () => {
  const data = {
  }
  return axios.request({
    url: 'organize/all',
    data,
    method: 'post'
  })
}
