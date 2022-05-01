<template>
  <div class='content-item' v-if='content'>
    <div class='cover'>
      <div class='cover-block' :style="{'background-image': 'url(' + content.image + ')'}">
      </div>
    </div>
    <div class='detail'>
      <div class='detail-content'>
        <div class='base-info'>
          <div class='name'>
            {{ content.name }}
          </div>
          <div class='tag-info'></div>
          <div class='owner'>
            {{ content.createBy }}
          </div>
        </div>
        <div class='right-info'>
          <div class='update-time'>
            {{ content.updateTime | dayjs }}
          </div>
        </div>
      </div>
      <div class="detail-price">
        <price-slider />
      </div>
      <div class='action'>
        <a-space>
          <a-button type='primary' @click="handleShare(content)" shape='round'>Share</a-button>
          <template v-if="WORK_SHOPS_TYPE.FEATURE.value === content.workshopsType">
            <a-button type='primary' shape='round' @click='editItem(content)'>Register</a-button>
          </template>
          <template v-if="WORK_SHOPS_TYPE.LUNCHEDBYME.value === content.workshopsType">
            <a-button type='primary' shape='round' @click='editItem(content)'>Edit</a-button>
            <a-button type='primary' shape='round' @click='editItem(content)'>Delete</a-button>
          </template>
          <template v-if="WORK_SHOPS_TYPE.REGISTERED.value === content.workshopsType">
            <a-button type='primary' shape='round' @click='editItem(content)'>Cancel</a-button>
          </template>

        </a-space>
      </div>
    </div>
    <a-modal
      v-model='shareVisible'
      :closable='true'
      :footer='null'
      :maskClosable='true'
      destroyOnClose
      width='300px'
      @cancel='handleCloseShare'>
      <share-button
        :link="shareItem.name || 'https://dev.classcipe.com/'"
        :title="shareItem.name || 'test'"
      />
    </a-modal>
  </div>
</template>

<script>
import { WORK_SHOPS_STATUS, WORK_SHOPS_TYPE } from '@/const/common'
import { typeMap } from '@/const/teacher'
import PriceSlider from '@/components/Slider/PriceSlider'
import ShareButton from '@/components/Share/ShareButton'

export default {
  name: 'LiveWorkShopContentItem',
  components: {
    PriceSlider,
    ShareButton
  },
  props: {
    content: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      typeMap: typeMap,
      WORK_SHOPS_STATUS: WORK_SHOPS_STATUS,
      WORK_SHOPS_TYPE: WORK_SHOPS_TYPE,
      shareVisible: false,
      shareItem: {}
    }
  },
  methods: {
    editItem (item) {
      if (item.type === typeMap['unit-plan']) {
        this.$router.push({
          path: '/teacher/unit-plan-redirect/' + item.id
        })
      } else if (item.type === typeMap.task) {
        this.$router.push({
          path: '/teacher/task-redirect/' + item.id
        })
      } else if (item.type === typeMap.video) {
        this.$router.push({
          path: '/teacher/video-redirect/' + item.id
        })
      } else if (item.type === typeMap.pd) {
        this.$router.push({
          path: '/teacher/pd-content-redirect/' + item.id
        })
      }
    },

    handleCloseShare () {
      this.shareVisible = false
    },
    handleShare(item) {
      this.shareVisible = true
      this.shareLink = { ...item }
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.content-item {
padding: 10px;
border: 1px dashed #15c39a;
margin: 10px 0;
display: flex;
flex-direction: row;
align-items: flex-start;

.cover {
.cover-block {
height: 160px;
width: 260px;
background-position: center center;
background-size: cover;
background-repeat: no-repeat;
}
}

.detail {
flex: 1;
display: flex;
flex-direction: column;
padding-left: 10px;
height: 160px;

.detail-content {
display: flex;
flex-direction: row;
justify-content: space-between;
flex-grow: 1;

.base-info {
.name {
line-height: 30px;
font-size: 15px;
color: #333;
font-weight: 500;
}
}
}

.action {
flex-shrink: 0;
height: 50px;
display: flex;
flex-direction: row;
align-items: center;
justify-content: flex-end;
}
}
}
.detail-price {
padding: 0 10px;
}
</style>
