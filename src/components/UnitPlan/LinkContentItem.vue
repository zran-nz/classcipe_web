<template>
  <div class='content-item' v-if='content'>
    <div class='cover' @click='handlePreviewDetail(content)'>
      <div class='cover-block' :style="{'background-image': 'url(' + content.image + ')'}">
      </div>
    </div>
    <div class='detail'>
      <div class='detail-content' @click='handlePreviewDetail(content)'>
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
      <div class='action'>
        <a-space>
          <a-button type='primary' @click='editItem(content)'>Edit</a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script>

import { typeMap } from '@/const/teacher'
import { ContentItemMixin } from '@/mixins/ContentItemMixin'
import PreviewContent from '@/components/MyContentV2/PreviewContent'

export default {
  name: 'LinkContentItem',
  components: { PreviewContent },
  props: {
    content: {
      type: Object,
      default: null
    }
  },
  mixins: [ ContentItemMixin ],
  data () {
    return {
      typeMap: typeMap,
      isSelfLearning: false
    }
  },
  computed: {
    status () {
      return this.content.status
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
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.content-item {
  padding: 15px;
  border: 1px dashed #15c39a;
  margin: 15px 0;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  overflow: hidden;

  .cover {
    border: 1px solid #e1e1e1;
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
</style>
