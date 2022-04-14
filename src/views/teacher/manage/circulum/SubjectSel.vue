<template>
  <div class="subject-col">
    <div v-show="currentCurriculum">
      <div class="subject-result-wrap" ref="subjectWrap">
        <div class="subject-circulum">
          <div class="circulum-item active">
            <div class="circulum-item-avatar">
              <a-avatar
                shape="square"
                :size="50"
                :style="{ backgroundColor: '#3377FF', verticalAlign: 'middle' }"
              >
                {{ currentCurriculum.name }}
              </a-avatar>
            </div>
            <div class="circulum-item-detail">
              <div>{{ currentCurriculum.name }}</div>
              <div>{{ formatGrade(currentCurriculum.id) }} </div>
            </div>
          </div>
        </div>
        <div class="subject-selected" ref="subjectSelected">
          <div class="selected-title">Selected</div>
          <div class="subject-selected-wrap" v-show="!noChecked">
            <div class="selected-content" v-for="(item, index) in result" :key="'seletedArea_'+index">
              <div class="selected-content-title" v-show="item.checkedList.length > 0">
                {{ item.name }}
              </div>
              <a-space class="selected-content-detail" v-show="item.checkedList.length > 0">
                <a-tag class="tag-item" :key="'tagCat'+index + 'tag' + tagIndex" v-for="(tag, tagIndex) in item.checkedList" :closable="true" @close="e => closeTag(e, index, tagIndex)">
                  {{ formatTag(item, tag) }}
                </a-tag>
              </a-space>
            </div>
          </div>
          <div v-show="noChecked">No results</div>
        </div>
        <div ref="copySelected"></div>
      </div>
      <div class="subject-area">
        <div
          class="subject-area-item"
          v-for="(item, index) in result"
          :key="'subectArr_' + index"
        >
          <div class="area-item-title">Studies in {{ item.name }}</div>
          <div class="area-item-check">
            <div>
              <a-checkbox :indeterminate="item.indeterminate" :checked="item.checkAll" @change="e => onCheckAllChange(e, index)">
                Check all
              </a-checkbox>
            </div>
            <a-checkbox-group v-model="item.checkedList" :options="item.data" @change="check => onCheckChange(check, index)">
              <span slot="label" slot-scope="{ label }">{{ label }}</span>
            </a-checkbox-group>
          </div>
        </div>
      </div>
    </div>
    <div v-show="!currentCurriculum" class="no-subject">
      <img src='~@/assets/newBrowser/no-subject.png'/>
      <p>None Subject because you dont choose the Circulum</p>
    </div>
  </div>
</template>

<script>
import { SubjectTree } from '@/api/subject'
export default {
  name: 'SubjectSel',
  props: {
    curriculum: {
      type: Object,
      default: () => {}
    },
    gradeOptions: {
      type: Array,
      default: () => []
    },
    subjectIds: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    curriculum: {
      handler(val, valPrev) {
        this.currentCurriculum = val ? { ...val } : {}
        if (val && val.id && (!valPrev || val.id !== valPrev.id)) {
          this.initData()
        }
      },
      immediate: true,
      deep: true
    },
    subjectIds: {
      handler(val, valPrev) {
        this.selected = val ? [ ...val ] : []
        this.prevSelected = val ? [ ...val ] : []
      },
      immediate: true
    }
  },
  data() {
    return {
      loading: false,
      selected: this.subjectIds,
      prevSelected: this.subjectIds,
      result: [
        {
          indeterminate: false,
          checkAll: false,
          checkedList: []
        }
      ]
    }
  },
  computed: {
    noChecked() {
      return this.result.length === 0 || !this.result.find(item => item.checkedList.length > 0)
    }
  },
  mounted () {
    window.addEventListener('scroll', this.fixSelected, true)
    // this.init()
  },
  destroyed() {
    window.removeEventListener('scroll', this.fixSelected)
  },
  methods: {
    initData() {
      this.loading = true
      SubjectTree({
        curriculumId: this.currentCurriculum.id
      }).then((res) => {
        if (res.success) {
          this.result = res.result.map(item => {
            return {
              ...item,
              indeterminate: false,
              checkAll: false,
              checkedList: [],
              data: item.children.map(child => {
                return {
                  label: child.name,
                  value: child.id
                }
              })
            }
          })
          this.setSelected()
        }
      })
    },
    reset() {
      this.selected = [ ...this.prevSelected ]
      this.setSelected()
      this.$emit('change', this.selected)
    },
    setSelected() {
      this.result = this.result.map(item => {
        let checkedList = []
        let indeterminate = false
        let checkAll = false
        if (item.children && item.children.length > 0) {
          checkedList = item.children.filter(child => {
            return this.selected.includes(child.id)
          }).map(_ => _.id)
          if (checkedList.length === item.children.length) {
            checkAll = true
          } else {
            if (checkedList.length > 0) {
              indeterminate = true
            }
          }
        }
        return {
          ...item,
          indeterminate: indeterminate,
          checkAll: checkAll,
          checkedList: checkedList
        }
      })
    },
    formatGrade(id) {
      const current = this.gradeOptions.filter(item => item.curriculumId === id)
      const ages = current.map(item => item.age ? Number(item.age) : 0)
      return Math.min(...ages) + '-' + Math.max(...ages) + ' Years'
    },
    formatTag(item, tag) {
      if (item.children && tag) {
        const findItem = item.children.find(child => child.id === tag)
        return findItem ? findItem.name : null
      }
      return null
    },
    fixSelected() {
      if (this.$refs.subjectWrap && this.$refs.subjectSelected) {
        const subjectWrapDom = this.$refs.subjectWrap.getBoundingClientRect()
        const subjectSelDom = this.$refs.subjectSelected.getBoundingClientRect()
        if (subjectWrapDom.top < -44) {
          this.$refs.subjectSelected.style.cssText = `position:fixed;top:60px;background: #fff;width:${subjectWrapDom.width}px;margin-left: -24px;padding: 20px;border: 1px solid #dfdfdf;box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);`
          this.$refs.copySelected.style.cssText = `display: block;height: ${subjectSelDom.height}px;`
        } else {
          this.$refs.subjectSelected.style.cssText = ''
          this.$refs.copySelected.style.cssText = ''
        }
      }
    },
    sendChecked() {
      let checkedList = []
      this.result.forEach(item => {
        checkedList = checkedList.concat(item.checkedList)
      })
      this.$emit('change', checkedList)
    },
    onCheckAllChange(e, index) {
      Object.assign(this.result[index], {
        checkedList: e.target.checked ? this.result[index].data.concat().map(item => item.value) : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
      this.sendChecked()
    },
    onCheckChange(checkedList, index) {
      this.result[index].indeterminate = !!checkedList.length && checkedList.length < this.result[index].data.length
      this.result[index].checkAll = checkedList.length === this.result[index].data.length
      this.sendChecked()
    },
    closeTag(e, index, tagIndex) {
      this.result[index].checkedList.splice(tagIndex, 1)
      this.onCheckChange(this.result[index].checkedList, index)
    }
  }
}
</script>

<style scoped lang='less'>
@import "~@/components/index.less";
.subject-col {
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 10px;
  background: #fff;
  .subject-result-wrap {
    background: rgba(228, 228, 228, 0.2);
    opacity: 1;
    padding: 24px;
    .subject-circulum {
      display: flex;
      .circulum-item {
        background: #fff;
        display: flex;
        padding: 15px 20px;
        border: 1px solid #eee;
        cursor: pointer;
        &.active {
          border-color: @primary-color;
        }
        & ~ .circulum-item {
          margin-left: 15px;
        }
        .circulum-item-avatar {
          width: 50px;
          height: 50px;
          margin-right: 10px;
        }
        .circulum-item-detail {
          display: flex;
          flex-direction: column;
          div {
            height: 19px;
            font-size: 14px;
            font-family: Leelawadee UI;
            font-weight: 400;
            color: #070707;
            opacity: 1;
            & ~ div {
              margin-top: 5px;
            }
          }
        }
      }
    }
    .subject-selected {
      padding-top: 10px;
      z-index: 100;
      .selected-title {
        line-height: 19px;
        font-size: 14px;
        font-family: Leelawadee UI;
        font-weight: bold;
        color: #070707;
        opacity: 1;
        margin-bottom: 15px;
      }
      .subject-selected-wrap {
        max-height: 200px;
        overflow: auto;
        .selected-content {
          display: flex;
          align-items: center;
          // & ~ .selected-content {
          //   margin-top: 10px;
          // }
          .selected-content-title {
            width: 150px;
            font-size: 16px;
            font-family: Inter-Bold;
            line-height: 25px;
            color: #000000;
            opacity: 0.5;
          }
          .selected-content-detail {
            display: flex;
            flex-wrap: wrap;
            flex: 1;
            .tag-item {
              cursor: pointer;
              border-radius: 28px;
              padding: 5px 10px;
              margin-bottom: 8px;
              word-break:normal;
              width:auto;
              display:block!important;
              white-space:pre-wrap;
              word-wrap : break-word ;
              overflow: hidden ;
              border: 1px solid @primary-color;
              background: @primary-color;
              color: #fff;
              /deep/ .anticon {
                color: #fff;
              }
            }
          }
        }
      }
    }
  }
  .subject-area {
    padding: 20px;
    background: #fff;
    border-radius: 0 0 10px 10px;
    .subject-area-item {
      position: relative;
      & ~ .subject-area-item {
        margin-top: 20px;
      }
      .area-item-title {
        line-height: 19px;
        font-size: 14px;
        font-family: Leelawadee UI;
        font-weight: bold;
        color: #7D7D7D;
        opacity: 1;
        margin-bottom: 15px;
      }
      .area-item-check {
        position: relative;
        /deep/ .ant-checkbox-group-item {
          margin-right: 0;
          min-width: 100px;
          margin-top: 10px;
        }
      }
    }
  }
  .no-subject {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    width: 400px;
    img {
      width: 400px;
      height: 400px;
    }
    p {
      font-size: 14px;
      font-family: Leelawadee UI;
      font-weight: bold;
      color: #070707;
      opacity: 1;
      text-align: center;
    }
  }
}
</style>
