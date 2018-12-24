import axios from '@/libs/api.request'

export const loadEquipmentTypes = ({ searchValue, page, size, orderField, orderType }) => {
  const data = {
    searchValue,
    page,
    size,
    orderField,
    orderType
  }
  return axios.request({
    url: 'equipmentType/list',
    data,
    method: 'post'
  })
}

export const deleteEquipmentType = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'equipmentType/delete',
    data,
    method: 'post'
  })
}

export const upinsertEquipmentType = ({ typeId, typeName }) => {
  const data = {
    typeId,
    typeName
  }
  return axios.request({
    url: 'equipmentType/upinsert',
    data,
    method: 'post'
  })
}

export const allEquipmentTypes = () => {
  const data = {
  }
  return axios.request({
    url: 'equipmentType/all',
    data,
    method: 'post'
  })
}
