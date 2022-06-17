<template>
  <div class="cc-custom-tag-category-bar">
    <div class='cc-tag-tab' id='cc-tag-category-tab'>
      <div class='icon-left icon-nav' @click.stop='scrollLeft'>
        <a-icon type="left-circle" theme="filled" :style="{color: '#4A8DBC', fontSize: '18px'}"/>
      </div>
      <div class="user-tag-category-tabs" id='cc-user-tag-category-tabs'>
        <div
          :class="{ 'user-tag-item': true, 'active-tab': categoryItem === activeTagCategory }"
          v-for="categoryItem in categoryList"
          :id="'tag-category-' + categoryItem.category"
          @click="handleActiveTagCategory(categoryItem)"
          :key="categoryItem.category">
          <div class="action-icon">
            <div class="tag-title-item">
              <div class="tag-title">{{ categoryItem.category }}</div>
              <div class='tag-tips-icon' v-if='categoryItem.category === "Difficulty level"' @click='showDifficultyLevelTips'>
                <a-icon type="question-circle" alt='"Difficulty level' />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class='icon-right icon-nav' @click.stop='scrollRight'>
        <a-icon type="right-circle" theme="filled" :style="{color: '#4A8DBC', fontSize: '18px'}"/>
      </div>
    </div>

    <a-modal
      v-model="visible"
      :footer="null"
      destroyOnClose
      width="900px"
      :title="null"
      :body-style="{padding: '0'}"
      @ok="visible = false"
      @cancel="visible = false">
      <img src="~@/assets/v2/static/Rubric.jpg" alt='Rubric' class='difficulty-level-tip-img' />
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'CustomPdTagCategoryBar',
  props: {
    categoryList: {
      type: Array,
      default: () => []
    },
    activeTagCategory: {
      type: Object,
      default: null
    },
    dotTagCategoryNameList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      visible: false
    }
  },
  created() {
  },
  methods: {
    scrollLeft () {
      this.$logger.info('scrollLeft')
      const tagCategoryTabDom = document.getElementById('cc-user-tag-category-tabs')
      tagCategoryTabDom.scrollTo({
        left: tagCategoryTabDom.scrollLeft - 400,
        behavior: 'smooth'
      })
    },
    scrollRight () {
      this.$logger.info('scrollRight')
      const tagCategoryTabDom = document.getElementById('cc-user-tag-category-tabs')
      tagCategoryTabDom.scrollTo({
        left: tagCategoryTabDom.scrollLeft + 400,
        behavior: 'smooth'
      })
    },

    handleActiveTagCategory (categoryItem) {
      this.$logger.info('handleActiveTagCategory', categoryItem)
      this.$emit('update:activeTagCategory', categoryItem)
      this.$emit('update')
    },

    categoryScrollIntoView(category) {
      const dom = document.getElementById(`tag-category-${category.category}`)
      if (dom) {
        dom.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    },

    showDifficultyLevelTips () {
      this.visible = true
    }
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";
.cc-custom-tag-category-bar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow-x: hidden;
  width: 100%;

  .cc-tag-tab {
    position: relative;
    width: 100%;

    .icon-left {
      left: 0;
    }

    .icon-right {
      right: 0;
    }

    .icon-nav {
      background-color: #F7F8F9;
      color: #666;
      position: absolute;
      width: 40px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 0;
      cursor: pointer;
      z-index: 100;
    }

    .user-tag-category-tabs {
      padding: 0 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      overflow-x: scroll;

      &::-webkit-scrollbar {
        display: none;
      }

      .user-tag-item {
        cursor: pointer;
        padding: 0 10px;
        font-family: Arial;
        font-weight: bold;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        color: #070707;
        border-bottom: 2px solid #F7F8F9;

        &:hover {
          background: rgba(13, 126, 153, 0.05);
        }

        .action-icon {
          .tag-title-item {
            line-height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: row;

            .tag-title {
              display: block;
              white-space: nowrap;
              user-select: none;
            }
          }
        }
      }

      .active-tab {
        border-bottom: 2px solid #0D7E99;

        .tag-title {
          color: #0D7E99;
        }
      }
    }
  }
}

.tag-tips-icon {
  padding: 0 10px;
}

.difficulty-level-tip-img {
  width: 100%;
}

</style>
