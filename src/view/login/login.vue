<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" :title="$t('login_card_title')" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip" v-html="$t('login_tip')"></p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  methods: {
    ...mapActions([
      'handleLogin'
    ]),
    handleSubmit ({ userName, password, callback }) {
      const _this = this
      _this.handleLogin({ userName, password }).then(res => {
        this.$router.push({
          name: _this.$config.homeName
        })
      }).catch(function (reason) {
        callback()
        _this.$Modal.error({
          title: _this.$t('login_error') + reason.message
        })
      })
    }
  },
  mounted () {
    window.localStorage.removeItem('tagNaveList')
    window.localStorage.removeItem('page_farm_edit_farm_id')
    window.localStorage.removeItem('page_farm_area_farm_id')
    window.localStorage.removeItem('page_farm_area_farm_name')
    window.localStorage.removeItem('page_farm_picture_farm_id')
    window.localStorage.removeItem('page_farm_console_farm_id')
    window.localStorage.removeItem('page_farm_console_farm_name')
    window.localStorage.removeItem('editorCache')
  }
}
</script>
