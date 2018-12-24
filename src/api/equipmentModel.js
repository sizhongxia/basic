import axios from '@/libs/api.request'

export const loadEquipmentModels = ({ searchValue, page, size, orderField, orderType }) => {
  const data = {
    searchValue,
    page,
    size,
    orderField,
    orderType
  }
  return axios.request({
    url: 'equipmentModel/list',
    data,
    method: 'post'
  })
}

export const deleteEquipmentModel = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'equipmentModel/delete',
    data,
    method: 'post'
  })
}

export const upinsertEquipmentModel = ({ modelId, modelName, typeId, supplier, remark }) => {
  const data = {
    modelId,
    modelName,
    typeId,
    supplier,
    remark
  }
  return axios.request({
    url: 'equipmentModel/upinsert',
    data,
    method: 'post'
  })
}

export const allEquipmentModels = ({ typeId }) => {
  const data = {
    typeId
  }
  return axios.request({
    url: 'equipmentModel/all',
    data,
    method: 'post'
  })
}
