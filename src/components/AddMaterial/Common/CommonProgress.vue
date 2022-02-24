<template>
  <div class="fix-progress" v-if="progress > 0">
    <div class="progress">
      <span :style="`width: ${progress}%;`"><span>{{ progress }}%</span></span>
    </div>
    <div class="cancel" @click="cancel" v-if="showCancel">cancel</div>
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
  height: 10px;
  background: #ebebeb;
  border-left: 1px solid transparent;
  border-right: 1px solid transparent;
  border-radius: 5px;
}
.progress > span {
  position: relative;
  float: left;
  margin: 0 -1px;
  min-width: 40px;
  height: 10px;
  line-height: 8px;
  text-align: right;
  border: 1px solid rgba(21, 195, 154, 1);
  border-radius: 10px;
  font-size: 8px;
  background: rgba(21, 195, 154, 1);
}
.progress .green {

}
.progress > span > span {
  padding: 0;
  font-size: 11px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 1px rgba(255, 255, 255, 0.4);
}
.cancel {
  width: 80px;
  height: 15px;
  background: rgba(21, 195, 154, 1);
  text-align: center;
  color: #fff;
  border-radius: 15px;
  cursor: pointer;
  font-size: 10px;
  margin: 5px auto 0;
}
</style>
