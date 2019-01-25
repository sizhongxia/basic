import axios from '@/libs/api.request'

export const loadCameras = ({ name, page, size, orderField, orderType }) => {
  const data = {
    name,
    page,
    size,
    orderField,
    orderType
  }
  return axios.request({
    url: 'video/list',
    data,
    method: 'post'
  })
}

export const farmAllCameras = ({ farmId }) => {
  const data = {
    farmId
  }
  return axios.request({
    url: 'video/farmAll',
    data,
    method: 'post'
  })
}

export const cameraDetail = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'video/detail',
    data,
    method: 'post'
  })
}

export const deleteCamera = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'video/delete',
    data,
    method: 'post'
  })
}

export const upinsertCamera = (data) => {
  return axios.request({
    url: 'video/upinsert',
    data,
    method: 'post'
  })
}
