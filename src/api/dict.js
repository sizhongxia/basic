import axios from '@/libs/api.request'

export const loadDicts = ({ searchValue, page, size, orderField, orderType }) => {
  const data = {
    searchValue,
    page,
    size,
    orderField,
    orderType
  }
  return axios.request({
    url: 'system/dict/list',
    data,
    method: 'post'
  })
}

export const selectDictItemsByCode = ({ code }) => {
  const data = {
    code
  }
  return axios.request({
    url: 'system/dict/selectDictItemsByCode',
    data,
    method: 'post'
  })
}

export const deleteDict = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'system/dict/delete',
    data,
    method: 'post'
  })
}

export const deleteDictItem = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'system/dict/deleteItem',
    data,
    method: 'post'
  })
}

export const upinsertDict = (data) => {
  return axios.request({
    url: 'system/dict/upinsert',
    data,
    method: 'post'
  })
}
export const upinsertItem = (data) => {
  return axios.request({
    url: 'system/dict/upinsertItem',
    data,
    method: 'post'
  })
}
