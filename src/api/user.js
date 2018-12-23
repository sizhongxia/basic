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

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    method: 'get'
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    method: 'get'
  })
}

export const getContentByMsgId = msg_id => {
  return axios.request({
    url: 'message/content',
    method: 'get',
    params: {
      msg_id
    }
  })
}

export const hasRead = msg_id => {
  return axios.request({
    url: 'message/has_read',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const removeReaded = msg_id => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    data: {
      msg_id
    }
  })
}

export const restoreTrash = msg_id => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    data: {
      msg_id
    }
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
