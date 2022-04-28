<template>
  <a-modal
    v-model='visible'
    :closable='true'
    :footer='null'
    :maskClosable='false'
    destroyOnClose
    width='600px'
    @cancel='handleClose'>
    <div class='publish-title'>
      Please select the elements and set price before publishing.
    </div>
    <div class='publish-selection'>
      <div class='publish-item' v-for='(item, idx) in publishList' :key='idx'>
        <div class='item-type-label'>
          {{ item.typeLabel }}
        </div>
        <div class='content-item'>
          <div class='cover'>
            <div class='cover-block' :style="{'background-image': 'url(' + item.image + ')'}">
            </div>
          </div>
          <div class='detail'>
            <div class='detail-content'>
              <div class='base-info'>
                <div class='name'>
                  {{ item.name }}
                </div>
                <div class='update-time'>
                  {{ item.updateTime | dayjs }}
                </div>
                <div class='owner'>
                  {{ item.createBy }}
                </div>
              </div>
            </div>
            <div class='detail-price'>
              <div class='price-setting'>
                <a-switch size='small' v-model='item.enablePrice' />
              </div>
              <div class='price-input' v-if='item.enablePrice'>
                Price: <a-input v-model="item.price" class='dollar-price-input' suffix="$"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class='modal-action-right'>
      <a-space>
        <a-button @click='handleClose'>Cancel</a-button>
        <a-button type='primary' @click='handlePublish'>Publish</a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<script>
export default {
  name: 'ContentPublish',
  props: {
    content: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      // TODO V2:测试待发布设置价格数据
      publishList: [
        {
          typeLabel: 'The main task',
          enablePrice: false,
          price: 0,
          name: '测试Task info',
          updateTime: '2022-04-27 08:58:19',
          createBy: 'yangxunwu@gmail.com',
          image: 'https://dcdkqlzgpl5ba.cloudfront.net/1392467808404684802/ppt/20220418/Ehr_wldG1BxvE8hwhKwWtfXytSDvZHe_TKBokBkishXf-G0P_qA2O7BkVHmBbHuH1IvY-qpxSTRbxxbdxoUyIKBDz_M4u2jyE01vsPp0bgtIQVaty9pyHFFMAvw9LnBUl1Y9KOrvd_t4u9-XcZcOq_dlBQMwqR2-IgVdN3lVOMQTUVgRffep3FlPdSNNh8kotBUVh8HCi30dVNzKB0yIH528YOX2ob_whb5v0g=s800'
        },
        {
          typeLabel: 'Origrnal Video Tips',
          enablePrice: false,
          price: 0,
          name: 'Tips Video Title.',
          updateTime: '2022-04-17 08:58:19',
          createBy: 'yangxunwu@gmail.com',
          image: 'https://dcdkqlzgpl5ba.cloudfront.net/file/202203100225445519-th1.jpg'
        },
        {
          typeLabel: 'Sub task(s)',
          enablePrice: false,
          price: 0,
          name: 'Sub task(s) Title.',
          updateTime: '2022-04-17 08:58:19',
          createBy: 'yangxunwu@gmail.com',
          image: 'https://dcdkqlzgpl5ba.cloudfront.net/file/202203100225445519-th1.jpg'
        }
      ],

      visible: true
    }
  },
  created() {
    this.$logger.info('ContentPublish', this.content)
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },

    handlePublish () {
      this.$logger.info('handlePublish')
      this.$emit('publish', {
        content: this.content,
        publishList: this.publishList
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.publish-title {
  font-size: 15px;
  font-weight: 400;
  color: #333;
}

.publish-selection {
  padding: 10px 0;

  .publish-item {
    .item-type-label {
      font-size: 15px;
      line-height: 30px;
      color: #333;
      font-weight: 400;
    }
  }
}

.content-item {
  margin-bottom: 15px;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  border-bottom: 1px solid #15c39a;
  padding-bottom: 15px;

  .cover {
    .cover-block {
      height: 120px;
      width: 180px;
      background-position: center center;
      background-size: cover;
      background-repeat: no-repeat;
    }
  }

  .detail {
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding-left: 10px;

    .detail-content {
      display: flex;
      flex-direction: column;

      .base-info {
        .name {
          line-height: 26px;
          font-size: 14px;
          color: #333;
          font-weight: 500;
        }

        .update-time, .owner {
          font-size: 13px;
          color: @text-color-secondary;
        }
      }
    }

    .detail-price {
      padding-left: 10px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;

      .price-setting {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        min-height: 32px;
        padding-right: 10px;
      }

      .price-input {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        .dollar-price-input {
          margin-left: 10px;

          /deep/ input {
            border-top: none;
            border-left: none;
            border-right: none;
            box-shadow: none;
          }
        }
      }
    }
  }
}
</style>
