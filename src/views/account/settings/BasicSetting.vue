<template>
  <div class="account-settings-info-view">
    <div class="loading-wrapper">
      <a-spin size="large" v-if="loading"/>
    </div>
    <avatar-modal ref="modal" @ok="setAvatar" v-show="!loading"/>
    <a-row :gutter="[16, 16]" v-show="!loading">
      <a-col span="24" :style="{ minHeight: '180px' }" class="username-line">
        <div class="ant-upload-preview" @click="$refs.modal.edit(1)">
          <a-icon type="cloud-upload-o" class="upload-icon"/>
          <div class="mask">
            <a-icon type="plus"/>
          </div>
          <img :src="userInfo.avatar"/>
        </div>
        <div class="user-name">
          <h1 v-if="!editMode">{{ userInfo.nickname }}</h1>
          <div class="edit-user-name" v-if="editMode">
            <a-input v-model="userInfo.tempNickname" size="large" :maxLength="80"/>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-divider v-show="!loading"/>
    <a-row :gutter="[16, 16]" v-show="!loading">
      <a-col span="24">
        <!--        role-->
        <div class="profile-item-line">
          <div class="profile-label">
            <span class="label-txt">Role : </span>
          </div>
          <div class="profile-text profile-data">
            {{ userInfo.currentRole.substr(0, 1).toUpperCase() + userInfo.currentRole.substr(1) }}
          </div>
        </div>

        <!--        time-->
        <div class="profile-item-line">
          <div class="profile-label">
            <span class="label-txt">Member since :</span>
          </div>
          <div class="profile-text profile-data">
            {{ userInfo.createTime | dayjs }}
          </div>
        </div>

        <!--        expert-->
        <div class="profile-item-line" v-if="$store.getters.currentRole === 'expert'">
          <div class="profile-label">
            <span class="label-txt">Area(s) :</span>
          </div>
          <div class="profile-text profile-data" v-if="!editMode">
            <div class="profile-tag-item" v-for="(areaName,index) in userInfo.areaNameList" :key="index">
              <a-tag>{{ areaName }}</a-tag>
            </div>
            <div
              class="profile-tag-item"
              v-for="(otherName,index) in userInfo.others"
              :key="'o' + index"
              v-if="userInfo.others && userInfo.others.length">
              <a-tag color="#108ee9">{{ otherName }}</a-tag>
            </div>
          </div>
          <div class="profile-input profile-data" v-if="editMode">
            <a-select v-model="userInfo.areaIds" placeholder="Please select">
              <a-select-option
                :value="areaOption.id"
                v-for="areaOption in areaOptions"
                :key="areaOption.id"
                @click.native="handleSelectAreaOption(areaOption)">{{ areaOption.name }}
              </a-select-option>
            </a-select>
            <a-input
              class="area-input"
              v-if="currentArea && currentArea.name === 'Others'"
              v-model="userInfo.tempOthers"
              placeholder="Please input"/>
          </div>
        </div>
        <!--        curriculum-->
        <div class="profile-item-line" v-if="$store.getters.currentRole === 'teacher'">
          <div class="profile-label">
            <span class="label-txt">Curriculum :</span>
          </div>
          <div class="profile-text profile-data" v-if="!editMode">
            {{ userInfo.curriculumName }}
          </div>
          <div class="profile-input profile-data" v-if="editMode">
            <a-select v-model="userInfo.curriculumId" placeholder="Please select curriculum">
              <a-select-option
                :value="curriculumOption.id"
                v-for="curriculumOption in curriculumOptions"
                :key="curriculumOption.id"
                @click.native="handleSelectCurriculumOption(curriculumOption)">{{
                  curriculumOption.name
                }}
              </a-select-option>
            </a-select>
          </div>
        </div>

        <!--        subject-->
        <div class="profile-item-line" v-if="$store.getters.currentRole === 'teacher'">
          <div class="profile-label">
            <span class="label-txt">Subject(s) :</span>
          </div>
          <div class="profile-text profile-data" v-if="!editMode">
            <div class="profile-tag-item" v-for="(subjectName,index) in userInfo.subjectNameList" :key="index">
              <a-tag>{{ subjectName }}</a-tag>
            </div>
          </div>
          <div class="profile-input profile-data" v-if="editMode">
            <a-select v-model="userInfo.subjectIds" mode="multiple">
              <a-select-opt-group v-for="subjectOptGroup in subjectOptions" :key="subjectOptGroup.optGroupId">
                <span slot="label">{{ subjectOptGroup.optGroupName }}</span>
                <a-select-option
                  :value="subjectOption.id"
                  v-for="subjectOption in subjectOptGroup.options"
                  :key="subjectOption.id">{{ subjectOption.name }}
                </a-select-option>
              </a-select-opt-group>
            </a-select>
          </div>
        </div>

        <!--        grade-->
        <div class="profile-item-line" v-if="$store.getters.currentRole === 'teacher'">
          <div class="profile-label">
            <span class="label-txt">Level/Grade :</span>
          </div>
          <div class="profile-text profile-data" v-if="!editMode">
            <div class="profile-tag-item" v-for="(gradeName,index) in userInfo.gradeNameList" :key="index">
              <a-tag>{{ gradeName }}</a-tag>
            </div>
          </div>
          <div class="profile-input profile-data" v-if="editMode">
            <a-select v-model="userInfo.gradeIds" placeholder="Please select grade" mode="multiple">
              <a-select-option :value="gradeOption.id" v-for="gradeOption in gradeOptions" :key="gradeOption.id">
                {{ gradeOption.name }}
              </a-select-option>
            </a-select>
          </div>
        </div>

        <!-- Customized tags -->

      </a-col></a-row>

    <a-row v-show="!loading">
      <a-col span="24" class="action-line">
        <div class="edit-action-wrapper" v-if="!editMode">
          <div class="edit-action" @click="editMode = !editMode">
            <a-icon type="edit"/>
            Edit
          </div>
        </div>
        <div class="submit-action-wrapper" v-if="editMode">
          <a-button type="primary" @click="saveDetail">{{ $t('account.settings.basic.update') }}</a-button>
        </div>
        <div class="submit-action-wrapper-second" v-if="editMode">
          <a-button @click="editMode = !editMode">{{ $t('account.settings.basic.cancel') }}</a-button>
        </div>
      </a-col>
    </a-row>

    <a-row>
      <a-col span="4" class="action-line">
        <div class="profile-label">
          <span class="label-txt">Customized tags :</span>
        </div>
      </a-col>

      <a-col span="12" class="action-line">
        <custom-tag></custom-tag>
      </a-col>

    </a-row>

  </div>
</template>

<script>
import AvatarModal from './AvatarModal'
import * as logger from '@/utils/logger'
import { editUser } from '@/api/user'
import {
  addPreference,
  getAllAreas,
  getAllCurriculums,
  GetGradesByCurriculumId,
  getAllSubjectsByCurriculumId,
  getAllSubjectsByParentId, getCustomizedTags
} from '@/api/preference'
import CustomTag from '@/components/UnitPlan/CustomTag'

export default {
  name: 'BasicSetting',
  components: {
    AvatarModal,
    CustomTag
  },
  data () {
    return {
      curriculumList: [],
      subjectList: [],
      gradeList: [],

      userInfo: {
        avatar: '',
        nickname: '',
        tempNickname: '',
        currentRole: '',
        createTime: null,
        curriculumId: this.$store.getters.bindCurriculum,
        curriculumName: null,
        subjectNameList: [],
        gradeNameList: [],
        areaNameList: [],
        subjectIds: [],
        gradeIds: [],
        areaIds: [],
        others: null,
        tempOthers: null
      },

      currentArea: null,
      otherAreaId: null,

      currentCurriculum: null,
      curriculumOptions: [],
      subjectOptions: [],
      gradeOptions: [],
      areaOptions: [],
      customizedTags: [],
      customizedTagIds: [],

      loading: true,
      editMode: false
    }
  },
  watch: {
    'userInfo.curriculumId' (val) {
      logger.info('userInfo.curriculumId change', val)
      this.loadSubjectByCurriculumId(val)
    }
  },
  created () {
    this.initData()
  },
  methods: {

    initData () {
      this.userInfo.subjectNameList = []
      this.userInfo.gradeNameList = []
      this.userInfo.areaNameList = []
      this.userInfo.avatar = this.$store.getters.avatar
      this.userInfo.nickname = this.$store.getters.nickname
      this.userInfo.tempNickname = this.$store.getters.nickname
      this.userInfo.currentRole = this.$store.getters.currentRole
      this.userInfo.createTime = this.$store.getters.userInfo.createTime
      this.userInfo.curriculumId = this.$store.getters.bindCurriculum
      this.userInfo.subjectIds = this.$store.getters.userInfo.preference.subjectIds
      this.userInfo.gradeIds = this.$store.getters.userInfo.preference.gradeIds
      this.userInfo.areaIds = this.$store.getters.userInfo.preference.areaIds
      this.userInfo.others = this.$store.getters.userInfo.preference.others
      this.customizedTagIds = []
      this.$store.getters.userInfo.customizedTags.forEach(item => {
        this.customizedTagIds.push({
          'label': item.name,
          'value': item.id
        })
      })
      this.$logger.info('user info loaded', this.userInfo)

      this.loading = true
      if (this.$store.getters.currentRole === 'teacher') {
        Promise.all([
          getAllCurriculums(),
          GetGradesByCurriculumId({ curriculumId: this.userInfo.curriculumId }),
          getAllSubjectsByCurriculumId({ curriculumId: this.$store.getters.bindCurriculum }),
          getCustomizedTags()
        ]).then(response => {
          this.$logger.info('init data', response)
          if (!response[0].code) {
            logger.info('getAllCurriculums response', response[0])
            this.curriculumOptions = response[0].result

            this.curriculumOptions.forEach(item => {
              if (item.id === this.$store.getters.bindCurriculum) {
                this.userInfo.curriculumName = item.name
              }
            })
          }

          if (!response[1].code) {
            logger.info('GetGradesByCurriculumId response', response[1])
            this.gradeOptions = response[1].result
            this.gradeOptions.forEach(item => {
              if (this.userInfo.gradeIds.indexOf(item.id) !== -1) {
                this.userInfo.gradeNameList.push(item.name)
              }
            })
          }

          if (!response[2].code) {
            logger.info('SubjectTree response', response[2])
            this.subjectOptions = []
            response[2].result.forEach(subject => {
              this.subjectOptions.push({
                optGroupName: subject.name,
                optGroupNId: subject.id,
                options: []
              })

              getAllSubjectsByParentId({ parentId: subject.id }).then(sResponse => {
                logger.info('getAllSubjectsByParentId ' + subject.id, sResponse)
                const options = []
                sResponse.result.forEach(option => {
                  options.push({
                    name: option.name,
                    id: option.id
                  })

                  if (this.userInfo.subjectIds.indexOf(option.id) !== -1) {
                    this.userInfo.subjectNameList.push(subject.name + '-' + option.name)
                  } else {
                    this.$logger.info('subject id ' + option.id + ' dont exist in ', this.userInfo.subjectIds)
                  }
                })
                if (options.length) {
                  const optGroups = this.subjectOptions.filter(optGroup => optGroup.optGroupNId === subject.id)
                  if (optGroups && optGroups.length) {
                    optGroups[0].options = options
                    logger.info('add subject ' + subject.name + ' options', options)
                    logger.info('subjectOptions ', this.subjectOptions)
                  } else {
                    logger.warn('not find subject group', subject)
                  }
                } else {
                  logger.info('subject ' + subject.name + ' not options')
                }
              })
            })
          }

          if (!response[3].code) {
            logger.info('getCustomizedTags response', response[3])
            this.customizedTags = response[3].result
            this.customizedTags.forEach(item => {
              item.selectable = item.children.length === 0
            })
          }

          this.loading = false
        }).catch(err => {
          this.$message.error(err)
        }).finally(() => {
        })
      } else {
        Promise.all([
          getAllAreas()
        ]).then(response => {
          this.$logger.info('init data', response)

          if (!response[0].code) {
            logger.info('getAllAreas', response[0])
            this.areaOptions = response[0].result
            logger.info('areaOptions', this.areaOptions)
            this.areaOptions.forEach(item => {
              if (this.userInfo.areaIds.indexOf(item.id) !== -1) {
                this.userInfo.areaNameList.push(item.name)
                this.currentArea = item

                if (item.name === 'Others') {
                  this.userInfo.tempOthers = (this.userInfo.others && this.userInfo.others.length) ? this.userInfo.others[0] : null
                }
              }

              if (item.name === 'Others') {
                this.otherAreaId = item.id
              }
            })
          }

          this.loading = false
        }).catch(err => {
          this.$message.error(err)
        }).finally(() => {
        })
      }
    },

    handleSelectCurriculumOption (curriculum) {
      logger.info('handleSelectCurriculumOption', curriculum)
      if (this.currentCurriculum === null || this.currentCurriculum.id !== curriculum.id) {
        this.currentSubject = null
        this.userInfo.subjectIds = []
      }
      this.currentCurriculum = curriculum
    },

    handleSelectAreaOption (area) {
      logger.info('handleSelectAreaOption', area)
      this.currentArea = area
    },

    loadSubjectByCurriculumId (curriculumId) {
      this.$logger.info('loadSubjectByCurriculumId ' + curriculumId)
      this.userInfo.subjectIds = []
      this.userInfo.gradeIds = []
      getAllSubjectsByCurriculumId({ curriculumId }).then(response => {
        logger.info('subjectOptions', response.result)
        this.subjectOptions = []
        response.result.forEach(subject => {
          this.subjectOptions.push({
            optGroupName: subject.name,
            optGroupNId: subject.id,
            options: []
          })

          getAllSubjectsByParentId({ parentId: subject.id }).then(sResponse => {
            logger.info('getAllSubjectsByParentId ' + subject.id, sResponse)
            const options = []
            sResponse.result.forEach(option => {
              options.push({
                name: option.name,
                id: option.id
              })

              if (this.userInfo.subjectIds.indexOf(option.id) !== -1) {
                this.userInfo.subjectNameList.push(option.name)
              }
            })
            if (options.length) {
              const optGroups = this.subjectOptions.filter(optGroup => optGroup.optGroupNId === subject.id)
              if (optGroups && optGroups.length) {
                optGroups[0].options = options
                logger.info('add subject ' + subject.name + ' options', options)
                logger.info('subjectOptions ', this.subjectOptions)
              } else {
                logger.warn('not find subject group', subject)
              }
            } else {
              logger.info('subject ' + subject.name + ' not options')
            }
          })
        })
      })

      GetGradesByCurriculumId({ curriculumId }).then((response) => {
        logger.info('GetGradesByCurriculumId', response)
        this.gradeOptions = response.result
        logger.info('gradeOptions', this.gradeOptions)
      })
    },

    setAvatar (url) {
      logger.info('setAvatar ' + url)
      this.userInfo.avatar = url
      const userData = {
        avatar: this.userInfo.avatar,
        nickname: this.userInfo.tempNickname,
        id: this.$store.getters.userInfo.id
      }
      editUser(userData).then(response => {
        this.$logger.info('update preference and edit user response', response)
      }).finally(() => {
        this.$store.dispatch('GetInfo').then(() => {
          this.initData()
        })
      })
    },

    saveDetail () {
      let postData = null
      if (this.$store.getters.currentRole === 'expert') {
        postData = {
          areaIds: Array.isArray(this.userInfo.areaIds) ? this.userInfo.areaIds : [this.userInfo.areaIds]
        }

        if (postData.areaIds.indexOf(this.otherAreaId) !== -1) {
          this.$logger.info('others ', this.userInfo.tempOthers)
          if (this.userInfo.tempOthers && this.userInfo.tempOthers.length <= 80) {
            postData.others = [this.userInfo.tempOthers]
          } else {
            this.$message.warn('illegal [others] contents')
          }
        }
      } else if (this.$store.getters.currentRole === 'teacher') {
        postData = {
          curriculumId: this.userInfo.curriculumId,
          gradeIds: this.userInfo.gradeIds,
          subjectIds: this.userInfo.subjectIds,
          tagIds: this.customizedTagIds.map(function (item) {
            return item.value
          })
        }
      }
      this.$logger.info('tempNickname ', this.userInfo.tempNickname)
      if (this.userInfo.tempNickname && this.userInfo.tempNickname.length < 80) {
        const userData = {
          avatar: this.userInfo.avatar,
          nickname: this.userInfo.tempNickname,
          id: this.$store.getters.userInfo.id
        }

        this.$logger.info('update preference and edit user post data', postData, userData)
        Promise.all([addPreference(postData), editUser(userData)]).then(response => {
          this.$logger.info('update preference and edit user response', response)
        }).finally(() => {
          this.$store.dispatch('GetInfo').then(() => {
            this.initData()
            this.editMode = false
          })
        })
      } else {
        this.$message.warn('illegal nickname')
      }
    },

    onChange (value) {
      if (!value) {
        this.$emit('change', '')
        this.treeValue = null
      } else if (value instanceof Array) {
        this.$emit('change', value.map(item => item.value).join(','))
        this.treeValue = value
      } else {
        this.$emit('change', value.value, value.label)
        this.treeValue = value
      }
    },
    onSearch (value) {
      console.log(value)
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.account-settings-info-view {
  position: relative;
  min-height: 300px;

  .loading-wrapper {
    width: 100px;
    text-align: center;
    position: absolute;
    top: 45%;
    left: 50%;
    margin-left: -50px;
  }
}

.avatar-upload-wrapper {
  height: 200px;
  width: 100%;
}

.username-line {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;

  .user-name {
    font-size: 25px;
    padding-left: 30px;
  }
}

.ant-upload-preview {
  position: relative;
  width: 100%;
  max-width: 180px;
  border-radius: 50%;
  box-shadow: 0 0 4px #ccc;

  .upload-icon {
    display: none;
    position: absolute;
    top: 0;
    right: 10px;
    font-size: 1.4rem;
    padding: 0.5rem;
    background: rgba(222, 221, 221, 0.7);
    border-radius: 50%;
    border: 1px solid rgba(0, 0, 0, 0.2);
  }

  &:hover {
    .upload-icon {
      display: block;
    }
  }

  .mask {
    opacity: 0;
    position: absolute;
    background: rgba(0, 0, 0, 0.4);
    cursor: pointer;
    transition: opacity 0.4s;

    &:hover {
      opacity: 1;
    }

    i {
      font-size: 2rem;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-left: -1rem;
      margin-top: -1rem;
      color: #d6d6d6;
    }
  }

  img, .mask {
    width: 100%;
    max-width: 180px;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
}

.profile-item-line {
  line-height: 30px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 16px;
  margin-bottom: 20px;

  .profile-label {
    width: 150px;
    font-weight: 500;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    cursor: pointer;
    padding-right: 5px;

    .label-txt {
      padding: 0 5px;
    }
  }

  .profile-data {
    width: 50%;
    font-weight: 600;
    color: #000;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;

    .profile-tag-item {
      padding: 5px;

      .ant-tag {
        color: #000;
      }
    }

    .ant-select {
      width: 100%;
    }
  }

  .edit-action {
    display: none;
    padding-left: 10px;
  }

  &:hover {
    .edit-action {
      display: block;
      color: @primary-color;
    }
  }
}

.edit-action-wrapper {
  width: 300px;
  cursor: pointer;
  text-align: left;
  color: @primary-color;
  font-weight: 500;
  margin-left: 150px;
}

.submit-action-wrapper {
  text-align: left;
  margin-left: 150px;
  margin-right: 20px;
}

.submit-action-wrapper-second {
  text-align: left;
  margin-right: 20px;
}

.action-line {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.area-input {
  margin-top: 10px;
}
</style>
