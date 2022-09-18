<template>
  <div class="no-more-resources">
    <div class="icon">
      <!-- <img src="~@/assets/libraryv2/empty.png" /> -->
      <no-content />
    </div>
    <div class="tips">
      <a @click="showDialog()">
        {{ tips }}
      </a>
    </div>
  </div>
</template>

<script>
import NoContent from '@/assets/v2/icons/no_content.svg?inline'
export default {
  name: 'NoMoreResources',
  components: {
    NoContent
  },

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
  user-select: none;
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
