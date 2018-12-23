import axios from '@/libs/api.request'

export const loadFarmAreas = ({ farmId, name, page, size, orderField, orderType }) => {
  const data = {
    farmId,
    name,
    page,
    size,
    orderField,
    orderType
  }
  return axios.request({
    url: 'farmArea/list',
    data,
    method: 'post'
  })
}

export const deleteFarmArea = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'farmArea/delete',
    data,
    method: 'post'
  })
}

export const upinsertFarmArea = (data) => {
  return axios.request({
    url: 'farmArea/upinsert',
    data,
    method: 'post'
  })
}
