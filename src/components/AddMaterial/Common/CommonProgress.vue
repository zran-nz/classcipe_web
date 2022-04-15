<template>
  <div class="fix-progress" v-if="progress > 0">
    <div class="progress">
      <span :style="`width: ${progress}%;`"><span>{{ progress }}%</span></span>
    </div>
    <!-- <div class="cancel" @click="cancel" v-if="showCancel">cancel</div> -->
  </div>
</template>
<script>
export default {
  props: {
    progress: {
      type: Number,
      default: 0
    },
    cancel: {
      type: Function,
      default: () => null
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    appendBody: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    if (this.appendBody) {
      this.$nextTick(() => {
        const body = document.querySelector('body')
        if (body.append) {
          body.append(this.$el)
        } else {
          body.appendChild(this.$el)
        }
      })
    }
  }
}
</script>
<style scoped>
.fix-progress{
  position: absolute;
  top: 0;
  width: 200px;
  right: 10px;
  z-index: 999;
  background-color: #b1abab;
  padding: 7px 10px;
  box-sizing: border-box;
  border-radius: 5px;
}
.progress {
  height: 13px;
  background: #ebebeb;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  border-radius: 7px;
  font-weight: normal;
}
.progress > span {
  position: relative;
  float: left;
  margin: 0 -1px;
  min-width: 40px;
  height: 13px;
  line-height: 11px;
  text-align: right;
  border: 1px solid rgba(21, 195, 154, 1);
  border-radius: 8px;
  font-size: 8px;
  background: rgba(21, 195, 154, 1);
}
.progress > span > span {
  padding: 0;
  font-size: 10px;
  color: #fff;
  text-shadow: 0 1px rgba(255, 255, 255, 0.4);
  font-weight: normal;
}
.cancel {
  width: 80px;
  height: 16px;
  background: rgba(21, 195, 154, 1);
  text-align: center;
  color: #fff;
  border-radius: 15px;
  cursor: pointer;
  font-size: 12px;
  font-weight: normal;
  margin-top: 6px;
  margin-left: auto;
  margin-right: auto;
}
</style>
