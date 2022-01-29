<template>
  <div class='my-input-with-create' @click.stop=''>
    <a-input class='my-input-with-create' v-model='displayValue' @focus='showOptionList = true'>
    </a-input>
    <div class='option-list' v-show='showOptionList' @click.stop=''>
      <div class='option-item' v-for='(option, oIdx) in displayOptionList' :key='oIdx' @click='handleSelectItem(option)'>
        {{ option.name }}
      </div>
      <div class='create-item' v-show='displayOptionList.length === 0'>
        <div class='create-item-tag' @click='createNew'>
          Create {{ displayValue }}
        </div>
        <a-spin size='small' v-show='creating' class='creating-spin'/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InputWithCreate',
  props: {
    optionList: {
      type: Array,
      default: () => []
    },
    defaultSelectedId: {
      type: String,
      default: ''
    },
    index: {
      type: Number,
      default: -1
    }
  },
  watch: {
    optionList: {
      handler: function (newVal, oldVal) {
        this.$logger.info('optionList changed ' + newVal)
        this.myOptionList = newVal
      },
      deep: true
    },
    defaultSelectedId: {
      handler: function (newVal, oldVal) {
        this.$logger.info('defaultSelectedId changed ' + newVal)
        this.showOptionList = false
        this.selectedId = newVal
        this.creating = false
      },
      deep: true
    }
  },
  data () {
    return {
      selectedId: null,
      displayValue: '',
      myOptionList: [],
      showOptionList: false,
      creating: false
    }
  },
  computed: {
    displayOptionList () {
       if (this.displayValue) {
         return this.myOptionList.filter(option => option.name.indexOf(this.displayValue.trim()) !== -1)
       } else {
         return this.myOptionList
       }
    }
  },
  created() {
    this.myOptionList = this.optionList
    this.selectedId = this.defaultSelectedId
    if (this.selectedId) {
      this.displayValue = this.myOptionList.find(option => option.id === this.selectedId).name
    }
  },
  mounted () {
    this.globalClick(this.handleClick)
  },
  methods: {
    createNew () {
      this.$logger.info('create-new ' + this.displayValue + ' ' + this.creating)
      if (!this.creating) {
        this.creating = true
        this.$emit('create-new', { value: this.displayValue, index: this.index })
      }
    },

    handleSelectItem (item) {
      this.$emit('selected', item.id)
      this.displayValue = item.name
      this.selectedId = item.id
      this.showOptionList = false
    },

    handleClick () {
      this.showOptionList = false
      if (!this.defaultSelectedId) {
        this.displayValue = ''
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.my-input-with-create {
  width: 100%;
  position: relative;
}

.option-list {
  background: #fff;
  z-index: 100;
  position: absolute;
  top: 43px;
  width: 100%;
  max-height: 287px;
  overflow-y: scroll;
  box-shadow: 0 0 3px 3px rgba(0, 0, 0, 0.1);

  &::-webkit-scrollbar {
    width: 5px;
    height: 5px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 3px;
    background: rgba(0,0,0,0.00);
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.06);
  }
  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(0,0,0,0.12);
    -webkit-box-shadow: inset 0 0 10px rgba(0,0,0,0.04);
  }

  .option-item {
    font-size: 14px;
    padding: 0 10px;
    line-height: 40px;
    border-bottom: 1px solid #f6f6f6;
    &:hover {
      background: #f5f5f5;
      color: #38cfa6;
    }
  }
}

.create-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 40px;
  padding: 0 10px;
  line-height: 40px;

  &:hover {
    background: #fff;
  }
}
.create-item-tag {
  user-select: none;
  line-height: 23px;
  display: inline-block;
  padding: 0 10px;
  border-radius: 5px;
  color: #15C39A;
  font-size: 13px;
  background: rgba(21, 195, 154, 0.2);
}

.creating-spin {
  margin-left: 5px;
  display: flex;
  align-items: center;
}

</style>
