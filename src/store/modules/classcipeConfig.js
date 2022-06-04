import storage from 'store'
import { SET_CURRICULUM_LIST } from '@/store/mutation-types'
import * as logger from '@/utils/logger'
import { getAllCurriculums } from '@/api/preference'

const classcipeConfig = {
  state: {
    curriculumList: [],
    curriculumMap: {},
    curriculumId2NameMap: {}
  },
  mutations: {
    [SET_CURRICULUM_LIST]: (state, curriculumList) => {
      logger.info('curriculumList', curriculumList)
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
    }
  },
  actions: {
    initCurriculumData ({ commit }, token) {
      return new Promise((resolve, reject) => {
        getAllCurriculums().then(response => {
          logger.info('init getAllCurriculums', response.result)
          commit(SET_CURRICULUM_LIST, response.result)
          resolve(response.result)
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default classcipeConfig
