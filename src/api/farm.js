import axios from '@/libs/api.request'

export const loadFarms = ({ name, code, page, size, orderField, orderType }) => {
  const data = {
    name,
    code,
    page,
    size,
    orderField,
    orderType
  }
  return axios.request({
    url: 'farm/list',
    data,
    method: 'post'
  })
}

export const deleteFarm = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'farm/delete',
    data,
    method: 'post'
  })
}

export const upinsertFarm = (data) => {
  return axios.request({
    url: 'farm/upinsert',
    data,
    method: 'post'
  })
}

export const allFarms = () => {
  const data = {
  }
  return axios.request({
    url: 'farm/all',
    data,
    method: 'post'
  })
}

export const farmDetail = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'farm/detail',
    data,
    method: 'post'
  })
}

export const farmOwnerInfo = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'farm/ownerInfo',
    data,
    method: 'post'
  })
}

export const changeFarmOwner = ({ farmId, ownerUserId }) => {
  const data = {
    farmId,
    ownerUserId
  }
  return axios.request({
    url: 'farm/changeOwner',
    data,
    method: 'post'
  })
}

export const farmAuthUsers = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'farm/authUsers',
    data,
    method: 'post'
  })
}
