import {
  login,
  logout,
  getUserInfo
} from '@/api/user'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    userName: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    }
  },
  actions: {
    // 登录
    handleLogin ({ commit }, { userName, password }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          if (res.status !== 200) {
            reject(new Error(res.status))
            return
          }
          const data = res.data
          if (data.code !== 200) {
            reject(new Error(data.message))
            return
          }
          const userinfo = data.data
          commit('setToken', userinfo.token)
          commit('setAvator', userinfo.avator)
          commit('setUserName', userinfo.userName)
          commit('setAccess', userinfo.access)
          commit('setHasGetInfo', true)
          resolve(userinfo)
        }).catch(err => {
          console.error(err)
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          window.localStorage.removeItem('tagNaveList')
          window.localStorage.removeItem('page_farm_edit_farm_id')
          window.localStorage.removeItem('page_farm_area_farm_id')
          window.localStorage.removeItem('page_farm_area_farm_name')
          window.localStorage.removeItem('page_farm_picture_farm_id')
          window.localStorage.removeItem('page_farm_console_farm_id')
          commit('setToken', '')
          commit('setAccess', [])
          resolve()
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            if (res.status !== 200) {
              reject(new Error(res.status))
              return
            }
            const data = res.data
            if (data.code !== 200) {
              reject(new Error(data.message))
              return
            }
            const userinfo = data.data
            commit('setAvator', userinfo.avator)
            commit('setUserName', userinfo.userName)
            commit('setAccess', userinfo.access)
            commit('setHasGetInfo', true)
            resolve(userinfo)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
