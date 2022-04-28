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
      <div class='action'>
        <a-space>
          <a-button type='primary' shape='round' v-if='content.type === typeMap.task'>SubTask</a-button>
          <a-button type='primary' shape='round'>Original Tips</a-button>
          <a-button type='primary' shape='round' v-if='content.type === typeMap.task'>Schedule</a-button>
          <a-button type='primary' shape='round' @click='editItem(content)'>Edit</a-button>
          <a-dropdown :trigger="['click']" :getPopupContainer="trigger => trigger.parentElement">
            <a-button type='primary' shape='round'><a-icon type="dash" /></a-button>
            <div class='content-item-more-action' slot="overlay">
              <div class='self-learning menu-item' v-if='content.type === typeMap.task'>
                Self learning <a-switch size="small" />
              </div>
              <div class='menu-item'>
                <a-button type='primary' size='small' shape='round'>Unpublish</a-button>
              </div>
              <div class='menu-item'>
                <a-button type='primary' size='small' shape='round' @click='handleDeleteItem'>Delete</a-button>
              </div>
            </div>
          </a-dropdown>

        </a-space>
      </div>
    </div>
  </div>
</template>

<script>

import { typeMap } from '@/const/teacher'
import * as logger from '@/utils/logger'
import { deleteMyContentByType } from '@/api/teacher'

export default {
  name: 'ContentItem',
  props: {
    content: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      typeMap: typeMap
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

    handleDeleteItem (item) {
      logger.info('handleDeleteItem', item)
      deleteMyContentByType(item).then(res => {
        logger.info('DeleteMyContentByType', res)
      }).then(() => {
        this.loadMyContent()
      })
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
</style>
