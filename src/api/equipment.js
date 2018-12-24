import axios from '@/libs/api.request'

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

export const upinsertEquipment = ({ equipmentId, farmId, farmAreaId, equipmentName, equipmentCode, equipmentSn, modelId, typeId, operator, remark }) => {
  const data = {
    equipmentId,
    farmId,
    farmAreaId,
    equipmentName,
    equipmentCode,
    equipmentSn,
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
