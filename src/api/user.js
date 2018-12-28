import axios from '@/libs/api.request'

export const login = ({ userName, password }) => {
  const data = {
    userName,
    password
  }
  return axios.request({
    url: 'login',
    data,
    method: 'post'
  })
}

export const getUserInfo = () => {
  return axios.request({
    url: 'userInfo',
    method: 'post'
  })
}

export const logout = () => {
  return axios.request({
    url: 'logout',
    method: 'post'
  })
}

export const loadUsers = ({ searchValue, page, size, orderField, orderType }) => {
  const data = {
    searchValue,
    page,
    size,
    orderField,
    orderType
  }
  return axios.request({
    url: 'user/list',
    data,
    method: 'post'
  })
}

export const toggleStateUser = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'user/toggleState',
    data,
    method: 'post'
  })
}

export const upinsertUser = ({ userId, userName, phoneNo, email, organizeId }) => {
  const data = {
    userId,
    userName,
    phoneNo,
    email,
    organizeId
  }
  return axios.request({
    url: 'user/upinsert',
    data,
    method: 'post'
  })
}

export const resetUserPwd = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'user/resetPwd',
    data,
    method: 'post'
  })
}

export const userIdentities = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'user/identities',
    data,
    method: 'post'
  })
}

export const changeUserIdentities = ({ userId, identities }) => {
  const data = {
    userId,
    identities
  }
  return axios.request({
    url: 'user/changeIdentity',
    data,
    method: 'post'
  })
}

export const userAuthFarms = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'user/authFarms',
    data,
    method: 'post'
  })
}

export const query = ({ searchValue }) => {
  const data = {
    searchValue
  }
  return axios.request({
    url: 'user/query',
    data,
    method: 'post'
  })
}

export const authFarmVisit = ({ farmId, userId, identity, applyRemark }) => {
  const data = {
    farmId,
    userId,
    identity,
    applyRemark
  }
  return axios.request({
    url: 'user/authFarm',
    data,
    method: 'post'
  })
}

export const handleAuthApply = ({ farmId, userId, applyState }) => {
  const data = {
    farmId,
    userId,
    applyState
  }
  return axios.request({
    url: 'user/handleAuthApply',
    data,
    method: 'post'
  })
}

export const userAuthMenus = ({ userId }) => {
  const data = {
    userId
  }
  return axios.request({
    url: 'user/authMenus',
    data,
    method: 'post'
  })
}

export const handleMenuAuth = ({ userId, menuAccessKey, checked }) => {
  const data = {
    userId,
    menuAccessKey,
    checked
  }
  return axios.request({
    url: 'user/handleMenuAuth',
    data,
    method: 'post'
  })
}
