<template>
  <div class='format-form'>
    <div class='format-form-header'>
      <div class='format-form-title'>
        <span class='title-num'>1</span>
        <span class='title'>{{ title }}</span>
      </div>
      <div class='format-tag-settings'>
        <a-button type='primary'><a-icon type="setting" /> Set tags</a-button>
      </div>
    </div>
    <div class='common-field-list'>
      <draggable
        class="list-group"
        tag="ul"
        v-model="myCommonList"
        v-bind="commonDragOptions"
        @start="commonDrag = true"
        @end="commonDrag = false"
      >
        <transition-group type="transition" :name="!commonDrag ? 'flip-list' : null">
          <li
            class="list-group-item"
            v-for="fieldItem in myCommonList"
            :key="fieldItem.sortNo"
          >
            <div class='sort-icon'>
              <img src='~@/assets/icons/formConfig/line3_green.png' alt='' class='green'/>
              <img src='~@/assets/icons/formConfig/line3.png' alt='' class='gray'/>
            </div>
            <div class='field-item-config'>
              <div class='field-label'>
                {{ fieldItem.fieldLabel }}
              </div>
              <div class='field-config'>
                <div class='field-config-left'>
                  <div class='field-display-name field-line-item'>
                    <a-input v-model='fieldItem.showName' class='show-name-input' />
                  </div>
                  <div class='field-display-hint-label'>
                    hint
                  </div>
                  <div class='field-display-hint field-line-item'>
                    <a-input v-model='fieldItem.hint' class='hint-input'/>
                  </div>
                </div>
                <div class='field-config-right'>
                  <div class='tag-setting'>
                    <a-icon type="setting" />
                    <div class='set-tag-label'>
                      Set tag
                    </div>
                  </div>
                </div>
              </div>
              <div class='visible-toggle'>
                <div class='field-visible'>Show on</div>
                <a-switch size="small" v-model='fieldItem.visible' />
              </div>
            </div>
          </li>
        </transition-group>
      </draggable>
    </div>
    <div class='custom-field-list'></div>
  </div>
</template>

<script>

import draggable from 'vuedraggable'

export default {
  name: 'FormatForm',
  components: {
    draggable
  },
  props: {
    commonList: {
      type: Array,
      required: true
    },
    customList: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      commonDrag: false,
      myCommonList: [],
      myCustomList: [],

      fieldLabelCol: { span: 4 },
      wrapperCol: { span: 8 }
    }
  },
  computed: {
    commonDragOptions() {
      return {
        animation: 200,
        group: 'common',
        disabled: false,
        ghostClass: 'ghost'
      }
    },
    customDragOptions() {
      return {
        animation: 200,
        group: 'custom',
        disabled: false,
        ghostClass: 'ghost'
      }
    }
  },
  created() {
    this.myCommonList = this.commonList.slice()
    this.myCustomList = this.customList.slice()
    this.$logger.info('FormatForm created', this.myCommonList, this.myCustomList)
  },
  methods: {
  }
}
</script>

<style lang='less' scoped>
@import "~@/components/index.less";

.format-form {

  .format-form-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
    cursor: pointer;

    .format-form-title {
      display: flex;
      flex-direction: row;
      align-items: center;
      .title-num {
        font-size: 18px;
        line-height: 25px;
        height: 25px;
        width: 25px;
        text-align: center;
        border-radius: 25px;
        background: #15C39A;
        color: #fff;
        margin-right: 8px;
      }

      .title {
        font-size: 16px;
        color: #333;
      }
    }
  }
  .common-field-list {
    .list-group {
      padding: 0;
      margin: 0;
      .list-group-item {
        margin-bottom: 15px;
        background: #f8f8f8;
        padding: 10px 10px 15px 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        cursor: pointer;
        border: 1px solid #f8f8f8;

        .sort-icon {
          margin-right: 10px;
          cursor: pointer;
          img {
            height: 15px;
          }

          .green {
            display: none;
          }

          .gray {
            display: block;
          }
        }

        &:hover {
          background: rgba(21, 195, 154, 0.1);
          color: rgba(0, 0, 0, 0.65);
          border: 1px solid #15C39A;
          .sort-icon {
            .green {
              display: block;
            }
            .gray {
              display: none;
            }
          }

          .show-name-input, .hint-input {
          }
        }

        .field-item-config {
          display: flex;
          width: 100%;
          flex-direction: column;
          justify-content: flex-start;
          align-items: flex-start;
          position: relative;

          .field-label {
            font-size: 12px;
            font-weight: 600;
            font-family: Inter-Bold;
            padding-bottom: 8px;
            color: #474747;
            padding-left: 3px;
          }
          .field-config {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;

            .field-config-left {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-start;
              .field-line-item {
                margin-right: 30px;

                .show-name-input {
                  width: 300px;
                }

                .hint-input {
                  width: 300px;
                }
              }
              .field-display-hint-label {
                padding-right: 10px;
                color: #999;
              }
            }

            .field-config-right {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: flex-end;
              .tag-setting {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                .set-tag-label {
                  padding-left: 5px;
                  font-size: 12px;
                  color: #15C39A;
                }
              }
            }
          }

          .visible-toggle {
            position: absolute;
            right: 0;
            top: 0;
            display: flex;
            align-items: center;
            justify-content: center;

            .field-visible {
              font-size: 12px;
              color: #999;
              padding-right: 5px;
            }
          }
        }
      }
    }
  }
}

</style>
