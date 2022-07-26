<template>
  <div class="subject-col">
    <div v-if="currentCurriculum">
      <div class="subject-result-wrap" ref="subjectWrap">
        <div class="subject-circulum">
          <div
            :class="{'circulum-item': true, 'active': item.id === choosed.id}"
            v-for="item in currentCurriculum"
            :key="item.id"
            @click="chooseCurriculum(item)">
            <div class="circulum-item-avatar">
              <a-avatar
                shape="square"
                :size="50"
                :style="{ backgroundColor: '#3377FF', verticalAlign: 'middle' }"
              >
                {{ (item.curriculumName || item.name).substring(0, 2) }}
              </a-avatar>
            </div>
            <div class="circulum-item-detail">
              <div>{{ item.curriculumName || item.name }}</div>
            </div>
          </div>
        </div>
        <!-- <a-radio-group v-model="choosed.id" class="subject-circulum">
          <a-radio-button :value="item.id" v-for="item in currentCurriculum" :key="item.id">
            {{ item.name }}
          </a-radio-button>
        </a-radio-group> -->
        <div class="subject-selected" ref="subjectSelected">
          <div class="selected-title">Selected<b ref="curName" style="display:none;"> : {{ choosed.curriculumName || choosed.name }}</b></div>
          <div class="subject-selected-wrap" v-show="!noChecked" v-if="totalResult[choosed.id]">
            <div class="selected-content" v-for="(item, index) in totalResult[choosed.id].result" :key="'seletedArea_'+index">
              <div class="selected-content-title" v-show="item.checkedList.length > 0">
                {{ item.name }}
              </div>
              <a-space class="selected-content-detail" v-show="item.checkedList.length > 0">
                <a-tag class="tag-item" :key="'tagCat'+index + 'tag' + tagIndex" v-for="(tag, tagIndex) in item.checkedList" :closable="true" @close="e => closeTag(e, index, tagIndex, choosed.id)">
                  {{ formatTag(item, tag, choosed.id) }}
                </a-tag>
              </a-space>
            </div>
          </div>
          <div v-show="noChecked">You have not selected any subject</div>
        </div>
        <div ref="copySelected"></div>
      </div>
      <div class="subject-area" v-if="totalResult[choosed.id]">
        <div
          class="subject-area-item"
          v-for="(item, index) in totalResult[choosed.id].result"
          :key="'subectArr_' + index"
        >
          <div class="area-item-title">
            Subjects in {{ item.name }}
            <a-checkbox :indeterminate="item.indeterminate" :checked="item.checkAll" @change="e => onCheckAllChange(e, index, choosed.id)">Select all
            </a-checkbox>
          </div>
          <div class="area-item-check">
            <!-- <div>
              <a-checkbox :indeterminate="item.indeterminate" :checked="item.checkAll" @change="e => onCheckAllChange(e, index, choosed.id)">Select all
              </a-checkbox>
            </div> -->
            <a-checkbox-group v-model="item.checkedList" :options="item.data" @change="check => onCheckChange(check, index, choosed.id)">
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
    <class-archive-batch ref="classArchiveBatch" @finish="truelySave" :school="currentSchool"/>
  </div>
</template>

<script>
import { SubjectTree } from '@/api/subject'
import { getSubjectBySchoolId, saveSubject } from '@/api/academicSettingSubject'
import ClassArchiveBatch from '../class/ClassArchiveBatch'
import { difference, reduce } from 'lodash-es'
export default {
  name: 'SubjectSel',
  components: {
    ClassArchiveBatch
  },
  props: {
    curriculum: {
      type: Array,
      default: () => []
    },
    school: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    curriculum: {
      handler(val, valPrev) {
        this.currentCurriculum = val ? [ ...val ] : []
        this.initData()
      },
      immediate: true,
      deep: true
    },
    school: {
      handler(val, valPrev) {
        this.currentSchool = val ? { ...val } : null
        this.initSubject()
      },
      immediate: true
    }
  },
  data() {
    return {
      loading: false,
      currentSchool: this.school,
      choosed: null,
      totalResult: {
        '-1': {
          curriculumId: '',
          selected: [], // 当前选中
          currentSelected: [], // 原始选中
          result: [
            {
              indeterminate: false,
              checkAll: false,
              checkedList: []
            }
          ]
        }
      },
      initResult: []
    }
  },
  computed: {
    noChecked() {
      const current = this.totalResult[this.choosed.id]
      const result = current ? current.result : []
      return result.length === 0 || !result.find(item => item.checkedList.length > 0)
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
      if (this.choosed) {
        const isExist = this.currentCurriculum.find(item => item.id === this.choosed.id)
        if (!isExist) {
          this.choosed = { ...this.currentCurriculum[0] }
        }
      } else {
        this.choosed = { ...this.currentCurriculum[0] }
      }
      if (this.choosed.id && !this.totalResult[this.choosed.id]) {
        this.loading = true
        SubjectTree({
          curriculumId: this.choosed.id
        }).then((res) => {
          if (res.success) {
            const result = res.result.map(item => {
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
            this.$set(this.totalResult, this.choosed.id, {
              selected: [], // 当前选中
              currentSelected: [], // 原始选中
              result: result
            })
            this.setSelected()
          }
        })
      } else {
        this.setSelected()
      }
    },
    initSubject() {
      if (this.currentSchool && this.currentSchool.id) {
        getSubjectBySchoolId({
          schoolId: this.currentSchool.id
        }).then(res => {
          if (res.success) {
            this.initResult = res.result
            this.setSelected()
          }
        })
      }
    },
    chooseCurriculum(item) {
      this.choosed = { ...item }
      this.initData()
    },
    reset() {
      this.setSelected()
    },
    setSelected() {
      // init from db
      if (this.initResult && this.initResult.length > 0) {
        for (const curriculumId in this.totalResult) {
          const selectedFromDb = this.initResult.find(item => item.curriculumId === curriculumId)
          if (selectedFromDb) {
            this.totalResult[curriculumId].currentSelected = selectedFromDb.subjectList.map(item => item.subjectId)
          }
        }
      }
      for (const curriculumId in this.totalResult) {
        if (curriculumId === '-1') continue
        const current = this.totalResult[curriculumId]
        current.selected = []
        current.result = current.result.map(item => {
          let checkedList = []
          let indeterminate = false
          let checkAll = false
          if (item.children && item.children.length > 0) {
            // 原始的
            checkedList = item.children.filter(child => {
              return current.currentSelected.includes(child.id)
            }).map(_ => _.id)
            // 原始的+当前的
            checkedList = Array.from(new Set([...item.checkedList, ...checkedList]))
            current.selected = checkedList.concat()
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
      }
      this.sendChecked()
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
        if (subjectWrapDom.top < (-44 - 60)) {
          this.$refs.subjectSelected.style.cssText = `position:fixed;top:60px;background: #fff;width:${subjectWrapDom.width}px;margin-left: -24px;padding: 20px;border: 1px solid #dfdfdf;box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);`
          this.$refs.copySelected.style.cssText = `display: block;height: ${subjectSelDom.height}px;`
          this.$refs.curName.style.display = 'block'
        } else {
          this.$refs.subjectSelected.style.cssText = ''
          this.$refs.copySelected.style.cssText = ''
          this.$refs.curName.style.display = 'none'
        }
      }
    },
    sendChecked() {
      let checkedList = []
      for (const key in this.totalResult) {
        const result = this.totalResult[key].result
        result.forEach(item => {
          checkedList = checkedList.concat(item.checkedList)
        })
      }
      this.$emit('change', checkedList)
    },
    onCheckAllChange(e, index, curriculumId) {
      Object.assign(this.totalResult[curriculumId].result[index], {
        checkedList: e.target.checked ? this.totalResult[curriculumId].result[index].data.concat().map(item => item.value) : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
      this.sendChecked()
    },
    onCheckChange(checkedList, index, curriculumId) {
      this.totalResult[curriculumId].result[index].indeterminate = !!checkedList.length && checkedList.length < this.totalResult[curriculumId].result[index].data.length
      this.totalResult[curriculumId].result[index].checkAll = checkedList.length === this.totalResult[curriculumId].result[index].data.length
      this.sendChecked()
    },
    closeTag(e, index, tagIndex, curriculumId) {
      this.totalResult[curriculumId].result[index].checkedList.splice(tagIndex, 1)
      this.onCheckChange(this.totalResult[curriculumId].result[index].checkedList, index, curriculumId)
    },
    doSave() {
      // 被删除的学科下的班级需要删除
      let rmSubjects = []
      for (const curriculum in this.totalResult) {
        if (curriculum !== '-1') {
          const result = this.totalResult[curriculum].result
          const originSelected = this.totalResult[curriculum].currentSelected
          const currentSelected = reduce(result, (res, cur) => {
            return res.concat(cur.checkedList)
          }, [])
          rmSubjects = rmSubjects.concat(difference(originSelected, currentSelected))
        }
      }
      console.log(rmSubjects)
      if (rmSubjects.length > 0) {
        this.$refs.classArchiveBatch.doCreate({
          subjectIds: rmSubjects,
          curriculums: true
        })
      } else {
        this.truelySave(true)
      }
    },
    truelySave(save = false, notip = false) {
      if (!save) {
        this.$emit('save-success', true)
        return
      }
      const promises = []
      for (const curriculum in this.totalResult) {
        if (curriculum !== '-1') {
          const result = this.totalResult[curriculum].result
          const subjectList = []
          result.forEach(parent => {
            if (parent.checkedList.length > 0) {
              parent.children.forEach(child => {
                if (parent.checkedList.includes(child.id)) {
                  subjectList.push({
                    curriculumId: curriculum,
                    parentSubjectId: parent.id,
                    parentSubjectName: parent.name,
                    subjectId: child.id,
                    subjectName: child.name
                  })
                }
              })
            }
          })
          promises.push({
            curriculumId: curriculum,
            schoolId: this.currentSchool.id,
            subjectList: subjectList
          })
        }
      }
      Promise.all(promises.map(params => saveSubject(params))).then(res => {
        console.log(res)
      }).finally(() => {
        this.initSubject()
        this.$emit('save-success', notip)
        this.$store.dispatch('initSubjectGradeData', {
          schoolId: this.$store.getters.school,
          bindCurriculumId: this.$store.getters.bindCurriculum
        })
      })
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
  height: 100%;
  overflow: auto;
  .subject-result-wrap {
    background: rgba(228, 228, 228, 0.2);
    opacity: 1;
    padding: 24px;
    .subject-circulum {
      display: flex;
      width: 100%;
      overflow: auto;
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
            white-space: nowrap;
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
        display: flex;
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
            font-size: 14px;
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
        margin-top: 40px;
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
