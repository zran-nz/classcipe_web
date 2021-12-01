export const UtilMixin = {
  data () {
    return {}
  },
  created () {

  },
  computed: {},
  methods: {

    /**
     * 判断标签值是否在列表中，忽律大小写
     */
    tagIsExist (createTagName, tagSearchList) {
      return tagSearchList.filter(item => item.toLowerCase() === createTagName.toLowerCase()).length > 0
    },
    tagNameIsExist (createTagName, showTagList) {
      return showTagList.filter(item => item.name.toLowerCase() === createTagName.toLowerCase()).length > 0
    }
  }

}
