import storage from 'store'
import {
  SET_CURRICULUM_LIST,
  SET_PRI_TAG,
  SET_PUB_TAG,
  SET_PD_TAG,
  SET_SCHOOL_SUBJECT,
  SET_SCHOOL_GRADE
} from '@/store/mutation-types'
import * as logger from '@/utils/logger'
import { getAllCurriculums } from '@/api/preference'
import { getSubjectBySchoolId } from '@/api/academicSettingSubject'
import { getCurriculumBySchoolId } from '@/api/academicSettingCurriculum'
import { listIbAuth } from '@/api/academicSettingIbAuth'

const classcipeConfig = {
  state: {
    curriculumList: [],
    curriculumMap: {},
    curriculumId2NameMap: {},
    pubTagList: [],
    priTagList: [],
    pdTagList: [],
    currentSchoolSubjectList: [],
    currentSchoolGradeList: [],
    ibAuth: false
  },
  mutations: {
    [SET_CURRICULUM_LIST]: (state, curriculumList) => {
      console.info('curriculumList', curriculumList)
      state.curriculumList = curriculumList
      const curriculumMap = {}
      const curriculumId2NameMap = {}
      curriculumList.forEach(item => {
        curriculumMap[item.id] = item
        curriculumId2NameMap[item.id] = item.name
      })
      state.curriculumList = curriculumList
      state.curriculumMap = curriculumMap
      state.curriculumId2NameMap = curriculumId2NameMap
      storage.set(SET_CURRICULUM_LIST, curriculumList)
    },
    [SET_PUB_TAG]: (state, pubTagList) => {
      state.pubTagList = pubTagList
      storage.set(SET_PUB_TAG, pubTagList)
    },
    [SET_PRI_TAG]: (state, priTagList) => {
      state.priTagList = priTagList
      storage.set(SET_PRI_TAG, priTagList)
    },
    [SET_PD_TAG]: (state, pdTagList) => {
      state.pdTagList = pdTagList
      storage.set(SET_PD_TAG, pdTagList)
    },
    [SET_SCHOOL_SUBJECT]: (state, subjectList) => {
      state.currentSchoolSubjectList = subjectList
      storage.set(SET_SCHOOL_SUBJECT, subjectList)
    },
    [SET_SCHOOL_GRADE]: (state, gradeList) => {
      state.currentSchoolGradeList = gradeList
      storage.set(SET_SCHOOL_GRADE, gradeList)
    },
    setIbAuth: (state, ibAuth) => {
      state.ibAuth = ibAuth
    }
  },
  actions: {
    initCurriculumData ({ commit }, token) {
      return new Promise((resolve, reject) => {
        getAllCurriculums().then(response => {
          console.info('init getAllCurriculums', response.result)
          commit(SET_CURRICULUM_LIST, response.result)
          resolve(response.result)
        }).catch(err => {
          reject(err)
        })
      })
    },

    initSubjectGradeData({ commit, state }, data) {
     const schoolId = data.schoolId
     const bindCurriculumId = data.bindCurriculumId
     const applyUserId = data.applyUserId
     const applyType = data.applyType
     console.info('initSubjectGradeData schoolId ' + schoolId + ' bindCurriculum ' + bindCurriculumId + ' applyType ' + applyType, data)
      getSubjectBySchoolId({ schoolId }).then(response => {
       console.info('initSubjectGradeData getSubjectBySchoolId response', response.result)
        // const schoolSubject = response.result.find(item => parseInt(item.curriculumId) === parseInt(bindCurriculumId))
        let subjects = []
        response.result.forEach(item => {
          subjects = subjects.concat(item.subjectList || [])
        })
        commit(SET_SCHOOL_SUBJECT, subjects)
      })
      getCurriculumBySchoolId({ schoolId }).then(response => {
       console.info('initSubjectGradeData getCurriculumBySchoolId', response.result)
        // const schoolGrade = response.result.find(item => parseInt(item.curriculumId) === parseInt(bindCurriculumId))
        let grades = []
        const curriculumids = []
        response.result.forEach(item => {
          curriculumids.push(item.curriculumId)
          grades = grades.concat(item.gradeSettingInfo || [])
        })
        // 是否包含Ib
        if (curriculumids.includes('4') || curriculumids.includes('5')) {
          listIbAuth({
            schoolId: schoolId,
            pageNo: 1,
            pageSize: 1000,
            queryType: 1
          }).then(response => {
            console.info('getAcademicSettingIbAuth response', response)
            const listAuths = response.result.records.filter(item => item.schoolId === schoolId)
            let ibAuth = false
            for (const curriculumId of curriculumids) {
              if (listAuths && listAuths.length > 0) {
                const selectedFromDb = listAuths.find(item => {
                  let isSelf = true
                  if (applyType === 2) {
                    isSelf = item.applyUserId === applyUserId && item.applyType === applyType
                  }
                  return item.curriculumId === curriculumId && isSelf && item.schoolId === schoolId && item.status === 2
                })
                if (selectedFromDb) {
                  ibAuth = true
                }
              }
            }
            commit('setIbAuth', ibAuth)
          })
        }
        commit(SET_SCHOOL_GRADE, grades)
      })
    },

    initTagData ({ commit }, token) {
      console.info('initTagData', token)
      return new Promise(async (resolve, reject) => {
        // eslint-disable-next-line no-undef
        await AppLogin(token)

        // eslint-disable-next-line no-undef
        const pubTagList = await App.service('tags').get('pubList')
        pubTagList.forEach(item => {
          item.isPub = true
          item.isPri = false

          const tags = item.tags.map(tag => { return { tag: tag, isPub: true, isPri: false } })
          item.tags = tags
        })

        // eslint-disable-next-line no-undef
        const priTagList = await App.service('tags').get('list')
        priTagList.forEach(item => {
          item.isPub = false
          item.isPri = true
          const tags = item.tags.map(tag => { return { tag: tag, isPub: false, isPri: true } })
          item.tags = tags
        })
        console.info('initTagData', pubTagList, priTagList)

        // 合并pri和pub重合set的数据

        commit(SET_PUB_TAG, pubTagList)
        commit(SET_PRI_TAG, priTagList)

        // eslint-disable-next-line no-undef
        const pdTagList = await App.service('conf').get('tags-pd')

        // pd tag转换结构方便处理
        const newPdTagList = []
        Object.keys(pdTagList).forEach(category => {
          const subCategoryList = []
          Object.keys(pdTagList[category]).forEach(subCategory => {
            subCategoryList.push({
              category,
              key: `${category}_${subCategory}`,
              subCategory,
              name: subCategory,
              isSubCategory: true,
              isTag: false,
              expand: false,
              children: pdTagList[category][subCategory].map(tag => {
                return {
                  key: `${category}_${subCategory}_${tag}`,
                  category,
                  subCategory,
                  name: tag,
                  isSubCategory: false,
                  isTag: true
                }
              })
            })
          })
          newPdTagList.push({
            category,
            children: subCategoryList
          })
        })
        commit(SET_PD_TAG, newPdTagList)
        console.info('newPdTagList', newPdTagList)
        resolve()
      })
    }
  }
}

export default classcipeConfig
