import axios from '@/libs/api.request'

export const areaLevels = ({ searchValue }) => {
  const data = {
    searchValue
  }
  return axios.request({
    url: 'areaLevels',
    data,
    method: 'post'
  })
}

export const weatherCities = ({ searchValue }) => {
  const data = {
    searchValue
  }
  return axios.request({
    url: 'weatherCities',
    data,
    method: 'post'
  })
}

export const weatherInfo = ({ cid }) => {
  const data = {
    cid
  }
  return axios.request({
    url: 'weather/now',
    data,
    method: 'post'
  })
}
