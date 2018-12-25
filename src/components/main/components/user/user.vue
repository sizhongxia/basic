<template>
  <div class="user-avator-dropdown">
    <Dropdown trigger="click" @on-click="handleClick">
      <Badge>
        <Avatar :src="userAvator"/>
      </Badge>
      <span>{{ userName }}</span>
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="logout">{{$t('logout')}}</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'
import { mapActions } from 'vuex'
export default {
  name: 'User',
  props: {
    userName: {
      type: String,
      default: ''
    },
    userAvator: {
      type: String,
      default: ''
    }
  },
  methods: {
    ...mapActions([
      'handleLogOut'
    ]),
    logout () {
      this.handleLogOut().then(() => {
        this.$router.push({
          name: 'login'
        })
      })
    },
    handleClick (name) {
      switch (name) {
        case 'logout': this.logout()
          break
      }
    }
  }
}
</script>
