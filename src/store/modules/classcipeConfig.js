import storage from 'store'
import { SET_CURRICULUM_LIST, SET_PRI_TAG, SET_PUB_TAG } from '@/store/mutation-types'
import * as logger from '@/utils/logger'
import { getAllCurriculums } from '@/api/preference'

const classcipeConfig = {
  state: {
    curriculumList: [],
    curriculumMap: {},
    curriculumId2NameMap: {},
    pubTagList: [],
    priTagList: []
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
    },
    [SET_PUB_TAG]: (state, pubTagList) => {
      state.pubTagList = pubTagList
      storage.set(SET_PUB_TAG, pubTagList)
    },
    [SET_PRI_TAG]: (state, priTagList) => {
      state.priTagList = priTagList
      storage.set(SET_PRI_TAG, priTagList)
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
    },

    initTagData ({ commit }, token) {
      logger.info('initTagData', token)
      return new Promise(async (resolve, reject) => {
        // eslint-disable-next-line no-undef
        const result = await AppLogin(token)
        logger.info('initTagData AppLogin', result)

        // eslint-disable-next-line no-undef
        const pubTagList = await App.service('tags').get('pubList')
        pubTagList.forEach(item => {
          item.isPub = true
          item.isPri = false
        })

        // eslint-disable-next-line no-undef
        const priTagList = await App.service('tags').get('list')
        priTagList.forEach(item => {
          item.isPub = false
          item.isPri = true
        })
        logger.info('initTagData', pubTagList, priTagList)

        // 合并pri和pub重合set的数据

        commit(SET_PUB_TAG, pubTagList)
        commit(SET_PRI_TAG, priTagList)
        resolve()
      })
    }
  }
}

export default classcipeConfig
