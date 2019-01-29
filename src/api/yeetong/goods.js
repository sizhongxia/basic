import axios from '@/libs/api.request'

export const loadGoods = ({ goodsName, page, size, orderField, orderType }) => {
  const data = {
    goodsName,
    page,
    size,
    orderField,
    orderType
  }
  return axios.request({
    url: 'yt/goods/list',
    data,
    method: 'post'
  })
}

export const goodsDetail = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'yt/goods/detail',
    data,
    method: 'post'
  })
}

export const goodsDetailContent = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'yt/goods/detailContent',
    data,
    method: 'post'
  })
}

export const updateGoodsDetailContent = (data) => {
  return axios.request({
    url: 'yt/goods/updateDetailContent',
    data,
    method: 'post'
  })
}

export const upinsertGoods = (data) => {
  return axios.request({
    url: 'yt/goods/upinsert',
    data,
    method: 'post'
  })
}

export const deleteGoods = ({ resultId }) => {
  const data = {
    resultId
  }
  return axios.request({
    url: 'yt/goods/delete',
    data,
    method: 'post'
  })
}
