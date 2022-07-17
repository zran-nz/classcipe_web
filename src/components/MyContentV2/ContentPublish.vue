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
                <a-space>
                  <a-switch size='small' v-model='enablePrice' /> Price:
                </a-space>
              </div>
              <div class='price-input' v-if='enablePrice'>
                <a-input v-model="item.price" class='dollar-price-input' suffix="$"/>
              </div>
            </div>
            <div class='detail-price' v-if='enablePrice'>
              <div class='price-setting'>
                Discount Price:
              </div>
              <div class='price-input'>
                <a-input v-model="item.discount" class='dollar-price-input' suffix="$"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class='modal-action-right'>
      <a-space>
        <a-button @click='handleClose'>Cancel</a-button>
        <a-button :loading="publishLoading" type='primary' @click='handlePublish'>Publish</a-button>
      </a-space>
    </div>
  </a-modal>
</template>

<script>
import { UpdateContentField } from '@/api/v2/mycontent'
import { getEntityType } from '@/const/teacher'

export default {
  name: 'ContentPublish',
  props: {
    content: {
      type: Object,
      default: null
    },
    publishLoading: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: true,
      enablePrice: this.content.price !== 0
    }
  },
  computed: {
    publishList() {
      const result = [this.content]
      return result
    }
  },
  created() {
    this.$logger.info('ContentPublish', this.content)
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },

    async handlePublish () {
      this.$logger.info('handlePublish')
      this.$emit('publish', {
        content: this.content,
        publishList: this.publishList
      })

      const contentType = this.content.type
      const price = this.enablePrice ? this.content.price : 0
      await UpdateContentField({
        id: this.content.id,
        entity: getEntityType(contentType),
        fieldName: 'price',
        fieldValue: price
      }).then((response) => {
        this.$logger.info('response : {}', response)
      })

      await UpdateContentField({
        id: this.content.id,
        entity: getEntityType(contentType),
        fieldName: 'discount',
        fieldValue: this.content.discount
      }).then((response) => {
        this.$logger.info('response : {}', response)
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
  overflow: hidden;

  .cover {
    border: 1px solid #e1e1e1;
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
    flex-direction: column;
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
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;

      .price-setting {
        width: 120px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
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
          width: 40%;

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
