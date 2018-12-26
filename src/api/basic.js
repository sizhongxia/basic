import axios from '@/libs/api.request'

export const areas = () => {
  const data = {
  }
  return axios.request({
    url: 'areas',
    data,
    method: 'post'
  })
}

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
