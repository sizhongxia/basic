import axios from '@/libs/api.request'

export const loadFuncs = ({ searchValue, searchChargingMode, searchState, searchShow, page, size, orderField, orderType }) => {
  const data = {
    searchValue,
    searchChargingMode,
    searchState,
    searchShow,
    page,
    size,
    orderField,
    orderType
  }
  return axios.request({
    url: 'system/func/list',
    data,
    method: 'post'
  })
}

export const upinsertFunc = (data) => {
  return axios.request({
    url: 'system/func/upinsert',
    data,
    method: 'post'
  })
}

export const deleteFunc = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'system/func/delete',
    data,
    method: 'post'
  })
}

export const funcDetail = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'system/func/detail',
    data,
    method: 'post'
  })
}

export const funcDescription = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'system/func/description',
    data,
    method: 'post'
  })
}

export const upinsertFuncDescription = (data) => {
  return axios.request({
    url: 'system/func/upinsertDescription',
    data,
    method: 'post'
  })
}

export const funcPlatformInfos = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'system/func/platformInfos',
    data,
    method: 'post'
  })
}

export const upinsertFuncPlatform = (data) => {
  return axios.request({
    url: 'system/func/upinsertPlatform',
    data,
    method: 'post'
  })
}
