import axios from '@/libs/api.request'

export const loadSolutions = ({ searchValue, page, size, orderField, orderType }) => {
  const data = {
    searchValue,
    page,
    size,
    orderField,
    orderType
  }
  return axios.request({
    url: 'yt/solution/list',
    data,
    method: 'post'
  })
}

export const solutionDetail = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'yt/solution/detail',
    data,
    method: 'post'
  })
}

export const upinsertSolution = (data) => {
  return axios.request({
    url: 'yt/solution/upinsert',
    data,
    method: 'post'
  })
}

export const deleteSolution = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'yt/solution/delete',
    data,
    method: 'post'
  })
}
