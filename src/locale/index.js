import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { localRead } from '@/libs/util'
import customZhCn from './lang/zh-CN'

Vue.use(VueI18n)

// 自动根据浏览器系统语言设置语言
const navLang = navigator.language

const localLang = (navLang === 'zh-CN') ? navLang : false
let lang = localRead('local') || localLang || 'zh-CN'

Vue.config.lang = lang
// vue-i18n 6.x+写法
Vue.locale = () => {}
const messages = {
  'zh-CN': customZhCn
}
const i18n = new VueI18n({
  locale: lang,
  messages
})

export default i18n

// vue-i18n 5.x写法
// Vue.locale('zh-CN', Object.assign(zhCnLocale, customZhCn))
// Vue.locale('zh-TW', Object.assign(enUsLocale, customEnUs))
