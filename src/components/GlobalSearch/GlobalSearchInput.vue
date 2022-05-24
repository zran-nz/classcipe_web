<template>
  <div class='global-search-input'>
    <a-input
      v-model='data'
      placeholder='Search here...'/>
    <div class='search-icon'>
      <search-icon />
    </div>
    <div class='global-search'>

    </div>
  </div>
</template>

<script>
import SearchIcon from '@/assets/v2/icons/search.svg?inline'

export default {
  name: 'GlobalSearchInput',
  components: { SearchIcon },
  data() {
    return {
      data: null
    }
  },
  created() {
  },
  methods: {}
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.global-search-input {
  position: relative;
  display: flex;
  align-items: center;
  flex-direction: row;
  cursor: pointer;

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
