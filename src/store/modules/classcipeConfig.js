import storage from 'store'
import { SET_CURRICULUM_LIST, SET_PRI_TAG, SET_PUB_TAG, SET_PD_TAG } from '@/store/mutation-types'
import * as logger from '@/utils/logger'
import { getAllCurriculums } from '@/api/preference'

const classcipeConfig = {
  state: {
    curriculumList: [],
    curriculumMap: {},
    curriculumId2NameMap: {},
    pubTagList: [],
    priTagList: [],
    pdTagList: []
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
    },
    [SET_PD_TAG]: (state, pdTagList) => {
      state.pdTagList = pdTagList
      storage.set(SET_PD_TAG, pdTagList)
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
        logger.info('initTagData', pubTagList, priTagList)

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
        logger.info('newPdTagList', newPdTagList)
        resolve()
      })
    }
  }
}

export default classcipeConfig
