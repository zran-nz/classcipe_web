<template>
  <a-card :loading='loading' :body-style="{'padding': '10px 0', 'border': 'none' }" :bordered="false">
    <div class='set-tag'>
      <div class='tag-list-table'>
        <div class='tag-header'>
          <a-row>
            <a-col span='23' offset='1'>
              <div class='tag-header-item'>Tag Category</div>
            </a-col>
          </a-row>
        </div>
        <div class='tag-body'>
          <a-row class='tag-category-item' v-for='tag in allTagList' :key='tag.set'>
            <a-col span='1'>
              <a-checkbox :checked='selectedSet.indexOf(tag.set) !== -1' @change='handleCheckedChange(tag)'></a-checkbox>
            </a-col>
            <a-col span='23' @click='handleCheckedChange(tag)'>
              <div class='tag-body-item tag-name'>
                <div class='tag-name-item'>
                  <div class='tag-name-text'>
                    {{ tag.set }}
                  </div>
                </div>
                <div class='tag-detail'>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
        <div class='tag-action'>
          <a-space>
            <a-button type='primary' @click='handleEnsureSelected'>Confirm</a-button>
          </a-space>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>

import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const setColor = [
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
]

export default {
  name: 'SetTag',
  props: {
    selectedTags: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      loading: true,
      tagList: [],
      selectedSet: []
    }
  },
  watch: {
    selectedTags: {
      immediate: true,
      deep: true,
      handler(newVal) {
        this.selectedSet = this.selectedTags
      }
    }
  },
  computed: {
    allTagList () {
      const pubTagList = this.$store.getters.pubTagList
      const priTagList = this.$store.getters.priTagList
      const tagList = [...pubTagList, ...priTagList]
      return tagList.map((tag, index) => {
        return {
          ...tag,
          isSelected: false,
          expand: false,
          tagColor: setColor[ index % setColor.length ]
        }
      })
    }
  },
  created() {
    console.info('SetTag created', this.selectedTags)
    this.loadCustomTags()
  },
  methods: {
    loadCustomTags () {
      this.loading = true
      this.$store.dispatch('initTagData', storage.get(ACCESS_TOKEN)).then(() => {
      }).catch((err) => {
        console.log(err)
        this.$message.error('init tag data error. ' + err.message)
      }).finally(() => {
        this.loading = false
      })
    },

    handleCheckedChange (tag) {
      console.info('handleCheckedChange tag', tag)
      const index = this.selectedSet.indexOf(tag.set)
      if (index === -1) {
        this.selectedSet.push(tag.set)
      } else {
        this.selectedSet.splice(index, 1)
      }
    },
    handleCancel () {
      this.$emit('close')
    },

    handleEnsureSelected () {
      console.info('handleEnsureSelected tagList', this.selectedSet)
      this.$emit('update', this.selectedSet)
    },

    handleGoToTagPage () {
      this.$emit('go-to-tag-page')
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.set-tag {
  margin-top: 10px;
}

.tag-header {
  padding: 8px 0;
  background-color: #f1f1f1;
  font-size: 14px;
  color: #000;
  user-select: none;
  cursor: pointer;
}

.tag-body {
  max-height: 350px;
  overflow-y: scroll;
  box-shadow: inset 0 0 3px 3px #fff;
  user-select: none;

  .tag-category-item {
    padding: 8px 5px;
    cursor: pointer;

    &:hover {
      background-color: rgba(21, 195, 154, 0.2);
    }
    .tag-body-item {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .tag-name {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;

      .tag-name-item {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;

        .expand-icon {
          width: 15px;
        }

        .tag-name-text {
          padding-left: 3px;
          font-size: 13px;
          color: #111;
        }

        &:hover {
          .tag-name-text {
            color: #15C39A;
          }
        }
      }

      .tag-detail {
        padding-left: 18px;
        .tag-keyword {
          margin-top: 4px;
          margin-bottom: 4px;
          font-size: 13px;
        }
      }
    }
  }
}

.tag-action {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  .tag-tips {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 10px;
    font-size: 13px;
    color: #999;

    a {
      padding: 0 5px;
    }
  }
}

.my-tag-selected {
  border-radius: 22px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .my-tag-selected-name {
    padding-left: 3px;
  }
}

.sub-tag {
  margin-top: 10px;
  .sub-tag-title {
    font-weight: bold;
  }
}

</style>
