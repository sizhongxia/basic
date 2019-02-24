import axios from '@/libs/api.request'

export const loadEquipments = ({ name, code, sn, page, size, orderField, orderType }) => {
  const data = {
    name,
    code,
    sn,
    page,
    size,
    orderField,
    orderType
  }
  return axios.request({
    url: 'equipment/list',
    data,
    method: 'post'
  })
}

export const farmAllEquipments = ({ farmId }) => {
  const data = {
    farmId
  }
  return axios.request({
    url: 'equipment/farmAll',
    data,
    method: 'post'
  })
}

export const equipmentDetail = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'equipment/detail',
    data,
    method: 'post'
  })
}

export const deleteEquipment = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'equipment/delete',
    data,
    method: 'post'
  })
}

export const upinsertEquipment = ({ equipmentId, farmId, farmAreaId, equipmentName, equipmentCode, equipmentSn, monitorTerms, equipmentDtuId, equipment485Addr, modelId, typeId, operator, remark }) => {
  const data = {
    equipmentId,
    farmId,
    farmAreaId,
    equipmentName,
    equipmentCode,
    equipmentSn,
    monitorTerms,
    equipmentDtuId,
    equipment485Addr,
    modelId,
    typeId,
    operator,
    remark
  }
  return axios.request({
    url: 'equipment/upinsert',
    data,
    method: 'post'
  })
}

export const monitorTerms = () => {
  const data = {}
  return axios.request({
    url: 'equipment/monitorTerms',
    data,
    method: 'post'
  })
}
