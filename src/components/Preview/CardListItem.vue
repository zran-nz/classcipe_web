<template>
  <div class="cc-card">
    <div class="cover-img relative-position" :style="{backgroundImage: 'url(' + content.image + ')', 'width' : width + 'rem'}">
      <div class='inner-mask' v-if="innerDesc"></div>
      <div class="card-bottom-section q-pa-sm col q-gutter-xs inner-desc absolute-bottom" v-if="innerDesc">
        <div class='type-tag'>
          <a-tag color="#15C39A">{{ content.type | type2Name }}</a-tag>
        </div>
        <div class="card-title" :title="mainTitle">{{ mainTitle }}</div>
        <div class='card-sub-title' :title='subDescription'>
          {{ subDescription }}
        </div>
      </div>
      <div class='inner-tag' v-if="outerDesc">
        <a-tag color="#15C39A">{{ content.type | type2Name }}</a-tag>
      </div>
    </div>
    <div class="card-bottom-section outer-desc" v-if="outerDesc" :style="{'width' : width + 'rem'}">
      <div class='main-title-line'>
        <div class='main-title' :title='mainTitle'>
          {{ mainTitle }}
        </div>
        <div class='main-action'>
          <a-space>
            <a-rate :value='content.star || 10' disabled class='cc-library-rate'/>
            <div class='share-icon' @click.stop.prevent=''>
              <a-tooltip
                trigger="click"
                :getPopupContainer="trigger => trigger.parentElement"
                placement="bottomRight"
              >
                <template slot="title">
                  <div class="detail-share">
                    <share-button
                      :link="wrapperLink(content)"
                      :title="content.name"
                    />
                  </div>
                </template>
                <a-icon type="share-alt" />
              </a-tooltip>
            </div>
          </a-space>
        </div>
      </div>
      <div class='sub-desc' :title='subDescription'>
        {{ subDescription }}
      </div>
    </div>
  </div>
</template>

<script>

import ShareButton from '@/components/Share/ShareButton'

export default {
  name: 'CardListItem',
  components: { ShareButton },
  props: {
    content: {
      type: Object,
      required: true
    },
    width: {
      type: Number,
      default: 20
    },
    innerDesc: {
      type: Boolean,
      default: false
    },
    outerDesc: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    mainTitle () {
      const title = this.content.name || 'Untitled'
      return title.slice(0, 1).toUpperCase() + title.slice(1)
    },
    subDescription () {
      // let desc
      // if (this.content.type === typeMap['unit-plan']) {
      //   desc = this.content.inquiry
      // } else if (this.content.type === typeMap.pd) {
      //   desc = this.content.goals
      // } else {
      //   desc = this.content.overview
      // }
      return this.content.description || ''
    }
  },
  data() {
    return {}
  },
  created() {
  },
  methods: {
    wrapperLink(item) {
      if (item && item.id) {
        return `${process.env.VUE_APP_SHARE_URL}/v2/${item.type}/${item.id}`
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cc-card {
}

.cover-img {
  padding-bottom: 55%;
  background: #F1F1F1 center;
  border-radius: 5px;
  border: 1px solid #F1F1F1;
  overflow: hidden;
  background-size: cover;
}

.inner-mask {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
}

.inner-desc {
  color: #fff;
  cursor: pointer;
  padding: 10px 10px 5px 10px;
  transition: all 0.3s ease-in-out;
  .card-title {
    padding: 3px 0;
    font-size: 17px;
    font-weight: normal;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    word-break: break-all;
    cursor: pointer;
  }
  .card-sub-title {
    font-size: 13px;
    line-height: 13px;
    padding-bottom: 3px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
}

.inner-tag {
  position: absolute;
  left: 10px;
  bottom: 10px;
}

.q-py-md {
  margin-top: 10px;
  margin-bottom: 10px;
}

.text-h7 {
  font-size: 15px;
  color: #000;
  font-weight: 400;
}

.card-info {
  margin-top: 5px;
}

.q-gutter-xs {
  div {
    margin-right: 5px;
  }
}

.card-title-black {
  color: #333;
  font-weight: 500;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
  cursor: pointer;
}

.col {
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.card-extra-info {
  padding-left: 10px;
  display: flex;
  flex-direction: column;
}

.price-star {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.price {
  font-family: Arial;
  font-weight: 400;
  color: #D3271A;
  height: 19px;
}

.star-rating {
  margin-left: 10px;
}

.relative-position {
  position: relative;
}

.absolute-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}

.outer-desc {
  padding: 10px 5px 0 5px;
  .main-title-line {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    .main-title {
      padding: 3px 0;
      font-size: 17px;
      font-weight: 600;
      color: #000;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      cursor: pointer;
    }

    .main-action {
      min-width: 120px;
      cursor: pointer;
      text-align: right;
      .share-icon {
      }
    }
  }

  .sub-desc {
    user-select: none;
    cursor: pointer;
    font-weight: normal;
    line-height: 16px;
    font-size: 13px;
    color: #aaa;
    max-height: 50px;
    overflow: hidden;
  }
}

.cc-library-rate {

}
</style>
