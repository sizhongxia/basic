import axios from '@/libs/api.request'

export const loadSystemMessages = ({ searchValue, page, size, orderField, orderType }) => {
  const data = {
    searchValue,
    page,
    size,
    orderField,
    orderType
  }
  return axios.request({
    url: 'system/message/list',
    data,
    method: 'post'
  })
}

export const upinsertSystemMessage = (data) => {
  return axios.request({
    url: 'system/message/upinsert',
    data,
    method: 'post'
  })
}

export const deleteSystemMessage = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'system/message/delete',
    data,
    method: 'post'
  })
}
