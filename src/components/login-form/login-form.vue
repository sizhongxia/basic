<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" :placeholder="$t('input_username')">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" :placeholder="$t('input_password')">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" :loading="loading" type="primary" long>{{$t('login')}}</Button>
    </FormItem>
  </Form>
</template>
<script>
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      loading: false,
      form: {
        userName: '',
        password: ''
      }
    }
  },
  computed: {
    inputUsername () {
      return this.$t('input_username')
    },
    inputPassword () {
      return this.$t('input_password')
    },
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password
          })
          setTimeout(() => {
            this.loading = false
          }, 1600)
        }
      })
    }
  }
}
</script>
