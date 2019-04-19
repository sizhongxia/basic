import axios from '@/libs/api.request'

export const loadMoaWpap200dzs = ({ searchValue, page, size }) => {
  const data = {
    searchValue,
    page,
    size
  }
  return axios.request({
    url: 'moa/wpap/200dzs/list',
    data,
    method: 'post'
  })
}

export const upinsertWpap200dzs = (data) => {
  return axios.request({
    url: 'moa/wpap/200dzs/upinsert',
    data,
    method: 'post'
  })
}

export const deleteWpap200dzs = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'moa/wpap/200dzs/delete',
    data,
    method: 'post'
  })
}

export const loadMoaWpap200mzs = ({ searchYear, searchMonth, page, size }) => {
  const data = {
    searchYear,
    searchMonth,
    page,
    size
  }
  return axios.request({
    url: 'moa/wpap/200mzs/list',
    data,
    method: 'post'
  })
}

export const upinsertWpap200mzs = (data) => {
  return axios.request({
    url: 'moa/wpap/200mzs/upinsert',
    data,
    method: 'post'
  })
}

export const deleteWpap200mzs = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'moa/wpap/200mzs/delete',
    data,
    method: 'post'
  })
}

export const loadMoaWpapMonth = ({ searchYear, searchMonth, searchTypeId, page, size }) => {
  const data = {
    searchYear,
    searchMonth,
    searchTypeId,
    page,
    size
  }
  return axios.request({
    url: 'moa/wpap/month/list',
    data,
    method: 'post'
  })
}

export const upinsertWpapMonth = (data) => {
  return axios.request({
    url: 'moa/wpap/month/upinsert',
    data,
    method: 'post'
  })
}

export const deleteWpapMonth = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'moa/wpap/month/delete',
    data,
    method: 'post'
  })
}

export const loadMoaWpapWeek = ({ searchYear, searchWeek, searchTypeId, page, size }) => {
  const data = {
    searchYear,
    searchWeek,
    searchTypeId,
    page,
    size
  }
  return axios.request({
    url: 'moa/wpap/week/list',
    data,
    method: 'post'
  })
}

export const upinsertWpapWeek = (data) => {
  return axios.request({
    url: 'moa/wpap/week/upinsert',
    data,
    method: 'post'
  })
}

export const deleteWpapWeek = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'moa/wpap/week/delete',
    data,
    method: 'post'
  })
}

export const allMoaTypes = () => {
  const data = { }
  return axios.request({
    url: 'moa/getAllMoaTypes',
    data,
    method: 'post'
  })
}
