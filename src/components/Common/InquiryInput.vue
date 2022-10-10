<template>
  <div class='question-input-wrapper'>
    <div class='question-input'>
      <a-spin :spinning="updating">
        <a-input
          v-model='keyword'
          :placeholder='placeholder'
          class='cc-form-input'
          :disabled='!canEdit'/>
      </a-spin>
      <div class='create-item' v-show='keyword.trim().length && !listContainedKeyword'>
        <a-button type='primary' size="small" @click='handleEnsureInput'><a-icon type='plus' /> Create</a-button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'InquiryInput',
  props: {
    selected: {
      type: Array,
      default: () => []
    },
    canEdit: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      keyword: '',
      updating: false
    }
  },
  computed: {
    listContainedKeyword() {
      return this.selected.map(item => item.toLowerCase()).indexOf(this.keyword.toLowerCase().trim()) !== -1
    }
  },
  methods: {
    handleEnsureInput () {
      console.log('InquiryInput handleEnsureInput', this.canEdit, this.keyword)
      this.updating = true
      if (this.keyword && this.canEdit) {
        this.$emit('add', this.keyword)
        this.keyword = ''
      }
      this.updating = false
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.question-input {
  margin-top: 5px;
  position: relative;

  .filter-list {
    background-color: #fff;
    position: absolute;
    z-index: 4000;
    left: 0;
    right: 0;
    top: 40px;
    max-height: 300px;
    overflow-y: auto;
    border-radius: 4px;
    box-shadow: 0 0 3px 3px #f1f1f1;

    .filter-item {
      color: rgb(4, 28, 68);
      padding: 10px 10px 10px 20px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      &:hover {
        background-color: #14C39A12;
        color: #15C39A;
      }

      .item-desc {
        padding-right: 10px;
        cursor: pointer;
        font-weight: 500;
        user-select: none;
      }

      .item-subject-year {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;

        .item-sub-title {
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          white-space: nowrap;
          margin-right: 10px;
          font-weight: bold;
          cursor: pointer;
          user-select: none;
        }
      }
    }
  }

  .create-item {
    position: absolute;
    right: 5px;
    top: 4px;
  }
}

.cc-lo-list {
  margin-top: 15px;
  z-index: 1;

  .cc-lo-item {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    align-items: flex-start;
    .cc-left-lo {
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      margin-bottom: 10px;
      .item-desc-wrapper {
        background: #FAFAFA;
        border: 1px solid #E1E6ED;
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        color: #313234;
        font-family: Arial;
        cursor: pointer;
        border-radius: 4px;
        padding: 10px 10px 10px 20px;
        font-weight: 400;
        .item-desc {
          padding-right: 10px;
        }

        .item-subject-year {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: flex-end;

          .item-sub-title {
            max-width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            white-space: nowrap;
            margin-right: 10px;
            font-weight: bold;
            color: #111;
            cursor: pointer;
            user-select: none;
          }
        }
      }

      .item-bloom-wrapper {
        margin-top: 20px;
        display: flex;
        padding-left: 8px;
        .bloom-wrapper {
          font-size: 10px;
          font-family: Arial;
          font-weight: bold;
          color: #191A1C;
          margin-right: 50px;
          display: flex;
          align-items: center;
          label {
            margin-right: 5px;
          }
        }
      }

      .item-command-wrapper {
        display: flex;
        align-items: center;
        padding-left: 8px;
        margin-top: 24px;
        label {
          font-size: 10px;
          font-family: Arial;
          font-weight: bold;
          color: #191A1C;
          width: 100px;
        }
        .wrapper-list {
          margin-left: 10px;
          display: flex;
          flex-wrap: wrap;
          flex: 1;
          .wrapper-list-item {
            margin-bottom: 5px;

          }
        }
      }

      .delete-wrapper {
        position: absolute;
        right: -20px;
        width: 30px;
        top: 50%;
        margin-top: -10px;
        display: none;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
      }

      &:hover {
        .delete-wrapper {
          display: flex;
        }
      }
    }
  }
}

.sub-desc {
  color: #999;
  font-size: 13px;
}
.question-selected-list {
  padding-bottom: 15px;
}
</style>
