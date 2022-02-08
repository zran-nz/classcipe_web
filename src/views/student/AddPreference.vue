<template>
  <a-modal
    width="1000px"
    :maskClosable="false"
    :keyboard="false"
    :footer="null"
    :closable="false"
    :visible="visible">
    <a-spin :spinning="loading" class="container">
      <div class="title">Pick subject(s) you would like to learn</div>
      <!-- <a-select>
        <a-select-option :value="item.id" :key="item.id" v-for="item in studentSubjectList">{{
          item.name
        }}</a-select-option>
      </a-select> -->
      <div class="imgContainer">
        <div
          v-for="item in studentSubjectList"
          :class="subjectIds.find((i) => i === item.id) ? 'selected' : null"
          :key="item.id"
          @click="selectSubject(item)"
        >
          <img :src="item.coverUrl || defaultImgUrl" />
          <!-- <div class="desc">{{ item.name }}</div> -->
          <img
            class="selectIcon"
            src="~@/assets/icons/lesson/selected.png"
            v-if="subjectIds.find((i) => i === item.id)"
          />
        </div>
      </div>

      <div class="title">Select your age</div>
      <div>
        <a-select style="width: 300px" @change="selectAge">
          <a-select-option :value="item" :key="item" v-for="item in ageList">{{ item }}</a-select-option>
        </a-select>
      </div>

      <div class="btn">
        <a-button type="primary" :loading="submitLoading" :disabled="isBtnDisable" @click="handleSubmit">Confirm</a-button>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import { addPreference } from '@/api/preference'
import { SubjectStudentList } from '@/api/subject'
import storage from 'store'
import { CURRENT_ROLE, IS_ADD_PREFERENCE } from '@/store/mutation-types'

export default {
  name: 'AddPreference',
  components: {},
  data() {
    return {
      visible: false,
      loading: false,
      ageList: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
      studentSubjectList: [],
      defaultImgUrl: 'https://dcdkqlzgpl5ba.cloudfront.net/file/202201310500203218-组_5587.png',
      age: null,
      subjectIds: [],
      submitLoading: false
    }
  },
  computed: {
    isBtnDisable() {
      return !this.age || this.subjectIds.length <= 0
    }
  },
  created() {
    this.showModal()
    this.getStudentSubjectList()
  },
  watch: {},
  methods: {
    showModal() {
      if (!storage.get(IS_ADD_PREFERENCE) && storage.get(CURRENT_ROLE) === 'student') {
        this.visible = true
      }
    },
    hideModal() {
      this.visible = false
    },
    async getStudentSubjectList() {
      this.loading = true
      const res = await SubjectStudentList()
      if (res.success) {
        this.studentSubjectList = res.result || []
      } else {
        this.$message.error(res.message)
      }
      this.loading = false
    },
    selectSubject(item) {
      console.log(item)
      const index = this.subjectIds.findIndex(i => i === item.id)
      if (index > -1) {
        this.subjectIds.splice(index, 1)
      } else {
        this.subjectIds.push(item.id)
      }
    },
    selectAge(value) {
      this.age = value
    },
    async handleSubmit() {
      const param = {
        subjectIds: this.subjectIds,
        age: this.age
      }
      this.submitLoading = true
      const res = await addPreference(param)
      if (res.success) {
        this.$store.dispatch('GetInfo')
        this.hideModal()
      } else {
        this.$message.error(res.message)
      }
      this.submitLoading = false
    }
  }
}
</script>

<style lang="less">
.ant-select-dropdown {
  z-index: 9999;
}
</style>
<style lang="less" scoped>
@import '~@/components/index.less';
.container {
  padding: 12px 0px 24px 12px;
  .imgContainer {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    > div {
      border: 1px dashed #ccc;
      border-radius: 6px;
      overflow: hidden;
      margin: 12px;
      position: relative;
      :hover {
        cursor: pointer;
      }
    }
    img {
      width: 200px;
      height: 200px;
    }
    .selectIcon {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 20px;
      height: 20px;
    }
    .desc {
      position: absolute;
      bottom: 10px;
      text-align: center;
      width: 100%;
    }
  }
  .title {
    font-weight: 800;
    font-size: 14px;
    margin-bottom: 4px;
  }
  .btn {
    text-align: center;
    margin-top: 24px;
    button {
      width: 300px;
      height: 40px;
      border-radius: 8px;
      &:disabled {
        color: #d9d9d9;
      }
    }
  }
}
</style>
