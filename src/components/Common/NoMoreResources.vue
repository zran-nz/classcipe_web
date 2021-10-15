<template>
  <div class="no-more-resources">
    <div class="icon">
      <img src="~@/assets/icons/library/no_more_resources.png" />
    </div>
    <div class="tips">
      <a @click="showDialog()">
        {{ tips }}
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NoMoreResources',

  methods: {
    showDialog () {
      this.$emit('show-library')
    }
  },
  props: {
    tips: {
      type: String,
      default: 'No more resources'
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.no-more-resources {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .icon {
    img {
      width: 150px;
    }
  }

  .tips {
    line-height: 24px;
  }
}
</style>
