<template>
  <div class="space-content">
    <div class="space-content-item">
      <div class="space-title">
        <label for="">Vip Plan</label>
        <a-tooltip title="Vip Plan">
          <a-icon type="question-circle" theme="filled" />
        </a-tooltip>
      </div>
      <div class="space-item-con">
        <div class="space-item-wrap">
          <div class="space-item">
            <div class="item-title">
              Free users
            </div>
            <div class="item-desc">
              $0/month
            </div>
            <div class="item-opt">
              <a-icon v-if="true " type="check-circle" theme="filled" />
              <span v-else class="un-check"></span>
            </div>
          </div>
        </div>
        <div class="space-item-wrap">
          <div class="space-item">
            <div class="item-title">
              Professional Edition
            </div>
            <div class="item-desc">
              $40/month
            </div>
            <div class="item-opt">
              <a-icon v-if="false " type="check-circle" theme="filled" />
              <span v-else class="un-check"></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="space-content-item">
      <div class="space-title">
        <label for="">Vip Plan</label>
        <a-tooltip title="Vip Plan">
          <a-icon type="question-circle" theme="filled" />
        </a-tooltip>
      </div>
      <div class="space-item-con">
        <div class="space-item-wrap">
          <div class="space-item">
            <div class="item-title">
              Free users
            </div>
            <div class="item-desc">
              $0/month
            </div>
            <div class="item-opt">
              <a-icon v-if="true " type="check-circle" theme="filled" />
              <span v-else class="un-check"></span>
            </div>
          </div>
        </div>
        <div class="space-item-wrap">
          <div class="space-item">
            <div class="item-title">
              Professional Edition
            </div>
            <div class="item-desc">
              $40/month
            </div>
            <div class="item-opt">
              <a-icon v-if="false " type="check-circle" theme="filled" />
              <span v-else class="un-check"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpacePlan',
  props: {
    school: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    school: {
      handler(val) {
        console.log(val)
        this.currentSchool = { ...val }
        this.initData()
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      currentSchool: this.school
    }
  },
  methods: {
    initData() {

    }
  }
}
</script>

<style scoped lang="less">
.space-content {
  position: relative;
  .space-content-item {
    display: flex;
    width: 100%;
    flex-direction: column;
    margin-bottom: 20px;
    .space-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
      label {
        font-weight: bold;
        font-size: 24px;
      }
      i {
        font-size: 20px;
      }
    }
    .space-item-con {
      display: flex;
      flex-wrap: wrap;
      margin-left: -10px;
      margin-right: -10px;
      align-items: center;
      &::after {
        content: '';
        flex-grow: 999;
      }
      .space-item-wrap {
        width: 50%;
        flex-grow: 1;
        padding: 10px;
        cursor: pointer;
        .space-item {
          padding: 30px 20px;
          background: #FFFFFF;
          border: 1px solid #CED7E5;
          border-radius: 5px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .item-title {
            font-weight: bold;
          }
          .item-opt {
            width: 18px;
            height: 18px;
            cursor: pointer;
            i {
              font-size: 18px;
              color: #007A8E;
            }
            .un-check {
              width: 100%;
              height: 100%;
              border: 1px solid #007A8E;
              border-radius: 100%;
              background: #fff;
              display: inline-block;
            }
          }
        }
      }
    }
  }
}
</style>
