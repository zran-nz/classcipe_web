export const RightModule = {
  'collaborate': 1,
  'collaborateComment': 2,
  'imageUpload': 3,
  'customTag': 4,
  'taskDetails': 5,
  'recommend': 6
}
export const BaseEventMixin = {
  data () {
    return {
      rightModule: RightModule,
      showModuleList: [RightModule.imageUpload, RightModule.customTag, RightModule.recommend]
    }
  },
  created () {

  },
  computed: {
    showRightModule () {
      return function (module) {
        if (this.showModuleList.indexOf(module) > -1) {
          return true
        }
        return false
      }
    }
  },
  methods: {
    setRightModuleVisible (module) {
      if (module === this.rightModule.collaborate) {
        this.showModuleList = [RightModule.collaborate]
      } else if (module === this.rightModule.collaborateComment) {
        this.showModuleList = [RightModule.collaborateComment]
      } else if (module === this.rightModule.customTag) {
        this.showModuleList = [RightModule.customTag]
      } else if (module === this.rightModule.taskDetails) {
        this.showModuleList = [RightModule.taskDetails]
      } else if (module === this.rightModule.recommend) {
        this.showModuleList = [RightModule.recommend]
      } else {
        this.showModuleList = [RightModule.imageUpload, RightModule.customTag, RightModule.recommend]
      }
    },
    resetRightModuleVisible () {
      this.showModuleList = [RightModule.imageUpload, RightModule.customTag, RightModule.recommend]
    }
  }

}
