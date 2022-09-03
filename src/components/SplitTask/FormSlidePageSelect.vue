<template>
  <div class='form-slide-page-select'>
    <a-row>
      <a-col span='12'>
        <div class='cover-list'>
          <div class='page-item' v-for='(pageItem) in thumbnailList' :key='pageItem.id' @click='handleSelectPage(pageItem)'>
            <div class='page-cover' :class="{'active-page': selectedPageList.indexOf(pageItem) !== -1}" :style="{ backgroundImage: 'url(' + pageItem.contentUrl + ')' }">
              <img src="~@/assets/icons/lesson/selected.png" class='selected-img' />
            </div>
          </div>
        </div>
      </a-col>
      <a-col span='11' offset='1' v-show="needPreview">
        <div class='cover-preview'>
          <div class='cover-image'>
            <img :src='currentCover.contentUrl' v-if='currentCover' alt=''/>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
export default {
  name: 'FormSlidePageSelect',
  props: {
    thumbnailList: {
      type: Array,
      default: () => []
    },
    selectPageObjectIds: {
      type: Array,
      default: () => []
    },
    needPreview: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      currentCover: null,
      selectedPageList: []
    }
  },
  created() {
    this.$logger.info('FormSlidePageSelect created', this.thumbnailList)
  },
  methods: {
    handleSelectPage (pageItem) {
      this.selectedPageList.indexOf(pageItem) === -1 ? this.selectedPageList.push(pageItem) : this.selectedPageList.splice(this.selectedPageList.indexOf(pageItem), 1)
      this.currentCover = pageItem
      this.$emit('update:selectPageObjectIds', this.selectedPageList.map(page => page.id))
    }
  }
}
</script>

<style lang='less'>

.form-slide-page-select {
  .cover-list {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    max-height: calc(100vh - 200px);
    overflow-y: auto;

    .page-item {
      width: 30%;
      margin: 0 10px 10px 0;

      .page-cover {
        user-select: none;
        border: 1px solid #B6B6B6;
        width: 100%;
        padding-bottom: 58%;
        cursor: pointer;
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
        position: relative;

        .selected-img {
          display: none;
        }
      }

      .active-page {
        border: 1px solid #15C39A;

        .selected-img {
          position: absolute;
          right: 5px;
          top: 5px;
          width: 20px;
          display: block !important;
        }
      }
    }
  }

  .cover-preview {
    .cover-image {
      padding: 0 10px;
      img {
        width: 100%;
      }
    }
  }
}
</style>
