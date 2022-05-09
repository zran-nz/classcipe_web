<template>
  <div class='link-text' :style="{'font-size': size + 'px', 'line-height': size + 'px', color: color}" @click='handleClick'>
    {{ text }}
  </div>
</template>

<script>
export default {
  name: 'CustomLinkText',
  props: {
    text: {
      type: String,
      default: null
    },
    color: {
      type: String,
      default: '#007A8E'
    },
    size: {
      type: Number,
      default: 14
    }
  },
  data() {
    return {}
  },
  created() {
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";
.link-text {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Arial;
  color: #8A8D93;
  font-weight: normal;
  cursor: pointer;
  user-select: none;

  &:hover {
    text-decoration: underline;
    color: #007A8E;
  }
}

</style>
