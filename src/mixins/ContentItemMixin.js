import { TemplatesGetPresentation } from '@/api/template'
import { PdField, PlanField, TaskField } from '@/const/common'
// import { TaskAddOrUpdate } from '@/api/task'
// import { PDContentAddOrUpdate } from '@/api/pdContent'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { uniqBy } from 'lodash-es'

export const ContentItemMixin = {
  data () {
    return {
      allowPreview: true,
      previewCurrentId: null,
      previewType: null,
      previewCode: null, // live workshop sessionId
      previewVisible: false,
      updateEditSlideLoading: false,
      setColor: [
        '#FFEDAF',
        '#C8F4FF',
        '#E6E4FF',
        '#ffccb0',
        '#ffa9a2',
        '#a3ecb9',
        '#f7c5f8',
        '#ffbfe2',
        '#d5b9ff',
        '#c4f6b1'
      ],
      savingSlides: false,

      formSteps: [],
      requiredFields: [],
      emptyRequiredFields: []
    }
  },
  async created() {
    let token = this.$route.query.token
    if (!token) {
      token = storage.get(ACCESS_TOKEN)
    }
    const contentType = parseInt(this.content.type)
    if (contentType === this.$classcipe.typeMap.task) {
      if (!this.$store.getters.formConfigData.taskSteps || !this.$classcipe.taskRequiredFields) {
        this.$store.dispatch('loadFormConfigData', token).then(() => {
          this.formSteps = this.$store.getters.formConfigData.taskSteps || []
          this.$logger.info('formSteps', this.formSteps)
          this.requiredFields = this.$classcipe.taskRequiredFields
          // TODO 暂时，等下面的TODO完成去掉
          this.calculateCanPublish()
        })
      } else {
        // TODO 暂时，等下面的TODO完成去掉
        this.calculateCanPublish()
      }
    }
    if (contentType === this.$classcipe.typeMap.pd) {
      this.requiredFields = this.$classcipe.pdRequiredFields
      this.formSteps = [
        {
          id: 1,
          name: 'PD goals',
          commonFields: [
            PdField.Name,
            PdField.Image,
            PdField.CoverVideo,
            PdField.Goals
          ],
          showRequiredTips: false,
          showSatisfiedTips: false
        },
        {
          id: 2,
          name: 'Edit Slides',
          commonFields: [
            PdField.Slides
          ],
          showRequiredTips: false,
          showSatisfiedTips: false
        },
        {
          id: 3,
          name: 'Link Tasks',
          commonFields: [
            PdField.Link
          ],
          showRequiredTips: false,
          showSatisfiedTips: false
        }
      ]
      // TODO 暂时，等下面的TODO完成去掉
      this.calculateCanPublish()
    }
  },
  computed: {
    commandTermsList () {
      return uniqBy((this.content.learnOuts.map(item => item.commandTerms)).flat(2), 'name').map(item => item.name)
    },
    knowledgeTagsList () {
      return uniqBy((this.content.learnOuts.map(item => item.knowledgeTags)).flat(2), 'name').map(item => item.name)
    }
  },
  methods: {
    handlePreviewDetail (data, isOrigin = false) {
      this.$logger.info('handlePreviewDetail', data, 'allowPreview', this.allowPreview)
      if (this.allowPreview) {
        this.previewVisible = false
        this.$nextTick(() => {
          this.previewCurrentId = isOrigin ? (data.sourceFrom || data.id) : data.id
          this.previewType = data.type
          this.previewCode = data.sessionId
          // 原件显示创建编辑评论不显示评论列表，自己copy的时不显示创建编辑评论列表
          this.reviewList = false // !isOrigin
          this.reviewCreate = !!isOrigin
          this.reviewEdit = !!isOrigin
          this.previewVisible = true
        })
        this.$emit('preview', data)
      }
    },
    handlePreviewClose () {
      this.$logger.info('handlePreviewClose')
      this.previewVisible = false
      this.previewCurrentId = null
      this.previewType = null
      this.previewCode = null
    },
    async updateEditSlideStatus() {
      if (!this.updateEditSlideLoading) {
        try {
          this.updateEditSlideLoading = true
          const contentType = parseInt(this.content.type)
          let res = null
          // 只有task 和 pd需要save changes
          if (contentType === this.$classcipe.typeMap.task) {
            // await TaskAddOrUpdate({ id: this.content.id, slideEditing: false })
           res = await TemplatesGetPresentation({
              taskId: this.content.id,
              needRefresh: true
            })
          } else if (contentType === this.$classcipe.typeMap.pd) {
            res = await TemplatesGetPresentation({
              taskId: this.content.id,
              needRefresh: true
            })
          }
          if (res && res.code === 0) {
            this.content.presentationId = res.result.presentationId
            this.content.pageObjects = res.result.pageObjects
          }
          this.content.slideEditing = false
        } catch (e) {
          console.log('updateEditSlideStatus', e)
        } finally {
          this.updateEditSlideLoading = false
          this.calculateCanPublish()
        }
      }
    },
    simpleIsEmpty(value) {
      if (value === null || value === '' || value === undefined) {
        return true
      }
      if (value.hasOwnProperty('length') && value.length === 0) {
        return true
      }

      if (JSON.stringify(value) === '{}') {
        return true
      }

      return false
    },
    calculateCanPublish () {
      // 给有未填写字段的step添加红色提示
      let canPublish = true
      this.emptyRequiredFields = []
      this.formSteps.forEach(step => {
        step.showRequiredTips = false
        step.showSatisfiedTips = false
      })
      this.requiredFields.forEach(field => {
        if (field === TaskField.Slides || field === PdField.Slides) {
          if (!this.content.presentationId || !this.content.pageObjects?.length) {
            console.log('slide is empty', this.content)
            this.emptyRequiredFields.push(field)
            this.formSteps.forEach(step => {
              if (step.commonFields.indexOf(field) > -1) {
                step.showRequiredTips = true
                step.showSatisfiedTips = false
                canPublish = false
              }
            })
          }
        } else if (field === TaskField.Link || field === PlanField.Link) {
          // TODO
          // if (!this.associateUnitPlanIdList?.length && !this.associateTaskIdList?.length) {
          //   this.$logger.info(`${field} is empty`, this.associateUnitPlanIdList, this.associateTaskIdList)
          //   this.emptyRequiredFields.push(field)
          //   this.formSteps.forEach(step => {
          //     if (step.commonFields.indexOf(field) > -1) {
          //       step.showRequiredTips = true
          //       step.showSatisfiedTips = false
          //       canPublish = false
          //     }
          //   })
          // }
        } else if (field === 'learnOuts') {
          console.log('learnOuts test', this.content.learnOuts)
          if (!this.content.learnOuts?.length) {
            console.log('learnOuts is empty')
            this.emptyRequiredFields.push(field)
            this.formSteps.forEach(step => {
              if (step.commonFields.indexOf(field) > -1) {
                step.showRequiredTips = true
                step.showSatisfiedTips = false
                canPublish = false
              }
            })
          }
        } else if (field === 'questions') {
          // TODO列表后端未返回
          // console.log('questions is ', this.content.questions)
          // if (this.content.hasOwnProperty('questions')) {
          //   console.log('questions test ', this.content.questions)
          //   if (this.content.questions.length === 0) {
          //     console.log('questions is empty')
          //     this.emptyRequiredFields.push(field)
          //     this.formSteps.forEach(step => {
          //       if (step.commonFields.indexOf(field) > -1) {
          //         step.showRequiredTips = true
          //         step.showSatisfiedTips = false
          //         canPublish = false
          //       }
          //     })
          //   }
          // }
        } else {
          // TODO列表后端未返回
          if (field === 'overview' || field === 'goals') {

          } else if (this.simpleIsEmpty(this.content[field])) {
            this.$logger.info(`${field} is empty`, this.content[field])
            this.emptyRequiredFields.push(field)
            this.formSteps.forEach(step => {
              if (step.commonFields.indexOf(field) > -1) {
                step.showRequiredTips = true
                step.showSatisfiedTips = false
                canPublish = false
              }
            })
          }
        }
      })

      console.log(canPublish)

      if (this.content.canPublish !== canPublish) {
        // TODO 需要部分保存
        // const params = {
        //   slideEditing: this.content.slideEditing,
        //   canPublish: canPublish,
        //   presentationId: this.content.presentationId,
        //   pageObjects: this.content.pageObjects,
        //   id: this.content.id
        // }
        // const contentType = parseInt(this.content.type)
        // if (contentType === this.$classcipe.typeMap.task) {
        //   TaskAddOrUpdate(params)
        // }
        // if (contentType === this.$classcipe.typeMap.pd) {
        //   PDContentAddOrUpdate(params)
        // }
      }
      this.content.canPublish = canPublish
    }
  }
}
