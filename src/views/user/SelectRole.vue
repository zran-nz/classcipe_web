<template>
  <div class="main-content">
    <div class="role">
      <div>
        <div><img src="~@/assets/logo/logo2.png" class="logo" /></div>
        <div><img src="~@/assets/logo/Lasscipe-dark.png" class="name" /></div>
        <div class="desc">Choose your role to enter</div>
      </div>
      <div class="role-item" :class="{ selected: selectedRole === 2 }" @click="handleSelectRole(2)">
        <div class="role-info">
          <img src="~@/assets/icons/role/teacher@2x.png" class="role-img" />
          <div>
            <div class="role-name">I am a teacher</div>
            <div class="role-desc">Teacher/Expert/Admin</div>
          </div>
        </div>
        <div class="arrow">
          <span></span>
        </div>
      </div>
      <div class="role-item" :class="{ selected: selectedRole === 4 }" @click="handleSelectRole(4)">
        <div class="role-info">
          <img src="~@/assets/icons/role/student@2x.png" class="role-img" />
          <div>
            <div class="role-name">I am a Student</div>
          </div>
        </div>
        <div class="arrow">
          <span></span>
        </div>
      </div>
    </div>
    <div class="actions">
      <a-button type="primary" size="large" :disabled="this.selectedRole === null" block @click="goNext"> ok </a-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SelectRole',
  components: {},
  data() {
    return {
      selectedRole: null,
      selectedRoleStr: ''
    }
  },
  created() {},
  methods: {
    handleSelectRole(role) {
      this.selectedRole = role
      if (role === 2) {
        this.selectedRoleStr = 'teacher'
      }
      if (role === 4) {
        this.selectedRoleStr = 'student'
      }
    },
    goNext() {
      if (this.selectedRole) {
        this.$store.dispatch('ChangeRole', { role: this.selectedRoleStr }).then(() => {
          if (this.$store.getters.currentRole) {
            this.$router.push(this.$store.getters.defaultRouter)
          } else {
            location.href = '/v2/login'
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
// @import '~@/components/index.less';
a {
  color: #0e71eb;
}
.main-content {
  width: 520px;
  min-width: 520px;
  margin: 0 auto;
  border: 1px solid #d3d7ec;
  border-radius: 20px;
  padding: 0px 50px;
  background-color: #fff;
  position: relative;

  .role {
    padding: 82px 0px 0px;
    text-align: center;
    .logo {
      margin-bottom: 9px;
    }
    .name {
      margin-bottom: 17px;
    }
    .desc {
      margin-bottom: 61px;
      font-size: 16px;
      color: #000;
      font-family: FZCuYuan-M03S;
      font-weight: 800;
    }
    .role-item {
      &:hover {
        border: 1px solid @primary-color;
      }
      display: flex;
      flex-direction: row;
      align-items: center;
      height: 80px;
      border: 1px solid #d3d7ec;
      border-radius: 10px;
      margin-bottom: 20px;
      justify-content: space-between;
      padding: 0px 37px 0px 15px;
      cursor: pointer;
      .role-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        text-align: left;
        .role-img {
          width: 66px;
          height: 66px;
          margin-right: 15px;
        }
        .role-name {
          font-size: 16px;
          font-family: ZCuYuan-M03S;
          font-weight: 800;
          color: #000;
        }
        .role-desc {
          font-size: 14px;
          color: #000;
        }
      }
      .arrow {
        background-color: #828282;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        padding-right: 3px;
        span {
          display: inline-block;
          margin: 2px;
          border-top: 1px solid #fff;
          border-right: 1px solid #fff;
          width: 8px;
          height: 8px;
          transform: rotate(45deg);
        }
      }
    }
    .selected {
      border: 1px solid @primary-color;
      .arrow {
        background-color: @primary-color;
      }
    }
  }
  .actions {
    margin-bottom: 40px;
    button {
      border-radius: 8px;
    }
  }
}
</style>
