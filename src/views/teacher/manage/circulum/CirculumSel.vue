<template>
  <a-card>
    <div class="opt-area">
      <a-form layout="inline">
        <a-row type="flex" justify="start">
          <a-col :span="8">
            <a-input-search placeholder="Search for Name" v-model="queryParam.searchKey" enter-button @search="triggerSearch"/>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="circulum-con">
      <div class="circulum-title">International Bacalaureate</div>
      <div class="circulum-content">
        <div class="circulum-detail">
          <div class="detail-item">
            <div class="item-check">
              <a-checkbox @change="onChange">

              </a-checkbox>
            </div>
            <div class="item-content">
              <div class="item-content-avatar">
                <a-avatar
                  shape="square"
                  :size="50"
                  :style="{ backgroundColor: '#3377FF', verticalAlign: 'middle' }"
                >
                  ED INT
                </a-avatar>
              </div>
              <div class="item-content-detail">
                <div class="content-detail-title">IB Diploma</div>
                <div class="content-detail-sub">16-19 Years</div>
                <a-space class="content-detail-opt">
                  <a-button size="small" type='danger'>L3</a-button>
                  <a-button size="small" type='primary'>Enable</a-button>
                </a-space>
              </div>
            </div>
          </div>
          <div class="detail-item">
            <div class="item-check">
              <a-checkbox @change="onChange">

              </a-checkbox>
            </div>
            <div class="item-content">
              <div class="item-content-avatar">
                <a-avatar
                  shape="square"
                  :size="50"
                  :style="{ backgroundColor: '#3377FF', verticalAlign: 'middle' }"
                >
                  ED INT
                </a-avatar>
              </div>
              <div class="item-content-detail">
                <div class="content-detail-title">IB Diploma</div>
                <div class="content-detail-sub">16-19 Years</div>
                <a-space class="content-detail-opt">
                  <a-button size="small" type='danger'>L3</a-button>
                  <a-button size="small" type='primary'>Enable</a-button>
                </a-space>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'CirculumSel',
  data() {
    return {
      queryParam: {
        searchKey: ''
      }
    }
  },
  methods: {
    triggerSearch() {

    },
    onChange() {

    }
  }
}
</script>

<style scoped lang="less">
.ant-card-bordered {
  border-radius: 10px;
}
.circulum-con {
  position: relative;
  margin-top: 20px;
  .circulum-title {
    height: 21px;
    font-size: 16px;
    font-family: Leelawadee UI;
    font-weight: bold;
    color: #070707;
    opacity: 1;
    margin-bottom: 20px;
  }
  .circulum-content {
    min-height: 140px;
    background: #FAFAFA;
    opacity: 1;
    border-radius: 10px;
    padding: 20px;
    .circulum-detail {
      min-height: 100px;
      width: 100%;
      background: #FFFFFF;
      opacity: 1;
      border-radius: 10px;
      display: flex;
      flex-wrap: wrap;
      padding: 10px 20px;
      .detail-item {
        display: flex;
        width: 25%;
        margin: 10px 0;
        .item-check {
          width:20px;
          height: 20px;
          margin-right: 20px;
          margin-top: 12px;
        }
        .item-content {
          display: flex;
          .item-content-avatar {
            width: 50px;
            height: 50px;
            border-radius: 5px;
            margin-right: 10px;
          }
          .item-content-detail {
            display: flex;
            flex-direction: column;
            .content-detail-title {
              line-height: 19px;
              font-size: 14px;
              font-family: Leelawadee UI;
              font-weight: 400;
              color: #070707;
              opacity: 1;
              margin-bottom: 5px;
            }
            .content-detail-sub {
              line-height: 19px;
              font-size: 14px;
              font-family: Leelawadee UI;
              font-weight: 400;
              color: #070707;
              opacity: 1;
              margin-bottom: 5px;
            }
            .content-detail-opt {
              display: flex;
            }
          }
        }
      }
    }
  }
}
</style>
