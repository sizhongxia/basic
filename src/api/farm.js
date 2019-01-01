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

export const savePictures = ({ farmId, farmAreaId, fileList, title, sortNum }) => {
  const data = {
    farmId,
    farmAreaId,
    fileList,
    title,
    sortNum
  }
  return axios.request({
    url: 'farm/savePictures',
    data,
    method: 'post'
  })
}

export const farmPictures = ({ farmId, farmAreaId }) => {
  const data = {
    farmId,
    farmAreaId
  }
  return axios.request({
    url: 'farm/pictures',
    data,
    method: 'post'
  })
}

export const deleteFarmPicture = ({ picId }) => {
  const data = {
    picId
  }
  return axios.request({
    url: 'farm/deletePicture',
    data,
    method: 'post'
  })
}

export const updateFarmPicture = ({ picId, sortNum, title, farmAreaId }) => {
  const data = {
    picId,
    sortNum,
    title,
    farmAreaId
  }
  return axios.request({
    url: 'farm/updatePicture',
    data,
    method: 'post'
  })
}

export const resetFarmQR = ({ farmId }) => {
  const data = {
    farmId
  }
  return axios.request({
    url: 'farm/refreshQr',
    data,
    method: 'post'
  })
}
