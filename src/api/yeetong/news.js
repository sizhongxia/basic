import axios from '@/libs/api.request'

export const loadNews = ({ title, page, size, orderField, orderType }) => {
  const data = {
    title,
    page,
    size,
    orderField,
    orderType
  }
  return axios.request({
    url: 'yt/news/list',
    data,
    method: 'post'
  })
}

export const newsDetail = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'yt/news/detail',
    data,
    method: 'post'
  })
}

export const upinsertNews = (data) => {
  return axios.request({
    url: 'yt/news/upinsert',
    data,
    method: 'post'
  })
}

export const releaseNews = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'yt/news/release',
    data,
    method: 'post'
  })
}

export const outlineNews = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'yt/news/outline',
    data,
    method: 'post'
  })
}

export const deleteNews = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'yt/news/delete',
    data,
    method: 'post'
  })
}

export const newsToUp = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'yt/news/toUp',
    data,
    method: 'post'
  })
}

export const newsToDown = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'yt/news/toDown',
    data,
    method: 'post'
  })
}
