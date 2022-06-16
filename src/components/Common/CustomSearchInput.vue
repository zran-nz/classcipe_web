<template>
  <div class='custom-search-input'>
    <a-input
      v-model='data'
      :style="{borderRadius: round ? '32px' : '6px'}"
      :placeholder='placeholder'
      @keyup.native.enter='handleSearch'
      @keyup.native='handleUpdateValue'/>
    <div class='search-icon' @click='handleSearch'>
      <search-icon />
    </div>

    <div v-if="data" class="search-close" @click='handleClear'>
      <a-icon type="close" />
    </div>
  </div>
</template>

<script>

import SearchIcon from '@/assets/v2/icons/search.svg?inline'

export default {
  name: 'CustomSearchInput',
  components: {
    SearchIcon
  },
  props: {
    value: {
      type: String,
      default: null
    },
    round: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      data: null
    }
  },
  watch: {
    value(val) {
      this.data = val
    }
  },
  created() {
    this.data = this.value
  },
  methods: {
    handleSearch () {
      this.$logger.info('search', this.data)
      this.$emit('search', this.data)
    },
    handleUpdateValue () {
      this.$emit('update:value', this.data)
      this.$emit('change', this.data)
    },
    handleClear() {
      this.data = ''
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.custom-search-input {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: row;
  cursor: pointer;

  .search-close{
    position: absolute;
    right: 5px;
    cursor: pointer;
    font-size: 12px;
    top: 6px;
    &:hover {
     font-weight: bold;
      color:#17181A
    }
  }

  .search-icon {
    position: absolute;
    width: 35px;
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: flex-end;
    padding-right: 10px;
    cursor: pointer;

    svg {
      width: 13px;
      height: 13px;
    }
  }

  /deep/ input {
    padding-left: 30px;
    border-color: #EEF1F6;
    border-width: 2px !important;
    border-radius: 6px;
    transition: all 0.3s ease-in-out;

    &:focus {
      box-shadow: none;
      border-color: #d4d9e0;
    }

    &::placeholder {
      font-family: Arial;
      font-weight: 400;
      color: #44464F;
      font-size: 13px;
    }
  }
}
</style>
