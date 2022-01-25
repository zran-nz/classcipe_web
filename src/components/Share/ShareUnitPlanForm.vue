<template>
  <div class='share-plan-form'>
    <div class='form-item'>
      <div class='form-item-label'>
        Unit Name
      </div>
      <div class='form-item-text'>
        {{ shareContent.plan.name }}
      </div>
    </div>

    <div class='form-item'>
      <div class='form-item-label'>
        Project-based Unit
      </div>
      <div class='form-item-text'>
        {{ shareContent.plan.projectBased ? 'Yes': 'No' }}
      </div>
    </div>

    <div class='form-item'>
      <div class='form-item-label'>
        Unit type
      </div>
      <div class='form-item-text'>
        {{ shareContent.plan.unitType === 0 ? 'Single-subject Unit': '' }}
        {{ shareContent.plan.unitType === 1 ? 'Integrated Unit': '' }}
      </div>
    </div>

    <div class='form-item'>
      <div class='form-item-label'>
        Start Date
      </div>
      <div class='form-item-text'>
        {{ shareContent.plan.startDate }} - {{ shareContent.plan.endDate }}
      </div>
    </div>

    <div class='form-item'>
      <div class='form-item-label'>
        Big Idea/ Statement of Inquiry/ Central Idea
      </div>
      <div class='form-item-text'>
        {{ shareContent.plan.inquiry }}
      </div>
    </div>

    <div class='form-item'>
      <div class='form-item-label'>
        Teaching goals
      </div>
      <div class='form-item-text'>
        {{ shareContent.plan.inquiry }}
      </div>
    </div>

    <div class='form-item'>
      <div class='form-item-label'>
        UN Sustainable Development Goal(s)
      </div>
      <div class='form-desc-list'>
        <div class="objectives-list" v-for="(k,index) in shareContent.plan.scenarios" :key="index">
          <div class="objectives-list-item objectives-list-item-skill objectives-list-item-top-fixed">
            <div class="skt-description">
              <a-tooltip :title="k.description"> {{ k.sdgName }}</a-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class='form-item'>
      <div class='form-item-label'>
        Assessment objectives
      </div>
      <div class='form-desc-list'>
        <div class="objectives-list" v-for="(k,index) in assessmentObjectives" :key="index">
          <div class="objectives-list-item objectives-list-item-skill objectives-list-item-top-fixed">
            <div class="skt-description">
              <a-tooltip :title="k.path"> {{ k.name }}</a-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class='form-item'>
      <div class='form-item-label'>
        Learning outcomes
      </div>
      <div class='form-desc-list'>
        <div class="objectives-list" v-for="(k,index) in learningOutcomes" :key="index">
          <div class="objectives-list-item objectives-list-item-learn objectives-list-item-top-fixed">
            <div class="skt-description">
              <a-tooltip :title="k.path"> {{ k.name }}</a-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class='form-item'>
      <div class='form-item-label'>
        21st Century Skills
      </div>
      <div class='form-desc-list'>
        <div class="objectives-list" v-for="(k,index) in centurySkills" :key="index">
          <div class="objectives-list-item objectives-list-item-21 objectives-list-item-top-fixed" @click="handleActiveDescription(TagType.century,k)">
            <div class="skt-description skt-description-21">
              <a-tooltip :title="k.path"> {{ k.name }}</a-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class='form-item'>
      <div class='form-item-label'>
        Prior learning experience
      </div>
      <div class='form-item-text'>
        {{ shareContent.plan.prior }}
      </div>
    </div>
  </div>
</template>

<script>
import ShareCommonHeader from '@/components/Share/ShareCommonHeader'
import SharePptPreview from '@/components/Share/SharePptPreview'
export default {
  name: 'ShareUnitPlanForm',
  components: { SharePptPreview, ShareCommonHeader },
  props: {
    shareContent: {
      type: Object,
      required: true
    }
  },
  computed: {
    assessmentObjectives: function () {
      return this.shareContent.plan.learnOuts.filter(item => item.tagType === 5)
    },
    learningOutcomes: function () {
      return this.shareContent.plan.learnOuts.filter(item => item.tagType === 1)
    },
    centurySkills: function () {
      return this.shareContent.plan.learnOuts.filter(item => item.tagType === 4)
    }
  },
  methods: {
    openLink (link) {
      window.open(link, '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.share-plan-form {
  background: #F7F8FF;
  padding: 5px 15px;
}

.form-item {
  margin-bottom: 10px;

  .form-item-label {
    font-size: 16px;
    font-weight: 500;
    font-family: Inter-Bold;
    line-height: 24px;
    padding: 5px 10px;
  }

  .form-item-text {
    color: #000;
    padding: 10px;
    font-size: 13px;
    background: #fff;
  }
}

.link-list {
  .link-item {
    margin-bottom: 10px;
    padding: 10px;
    background: #fff;

    .link-name {
      line-height: 25px;
      color: #999;
    }

    .link-url {
      color: #38cfa6;
      text-decoration: underline;
      cursor: pointer;
    }
  }
}

.objectives-list {
  position: relative;
  .skt-description-sub-list {
    max-height: 300px;
    overflow-y: scroll;
    border: 1px solid #f9f9f9;
  }
  .objectives-list-item {
    width: 100%;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    opacity: 1;
    border-radius: 4px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 10px;
    position: relative;
    color: #000000;
    &:hover {
      color: @primary-color;
      border: 1px solid @primary-color !important;
    }
    .skt-description {
      cursor: pointer;
      width: 98%;
      padding-right: 10px;
      line-height: 22px;
      position: relative;
      .description-txt {
        padding: 10px;
        border: 1px dashed #666;
        line-height: 24px;
        color: #11142D;
        display: inline-block;
        width: 100%;
      }
    }
    .skt-description-21{
      width: 90%;
    }

    .skt-description-tag-list {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 5px 10px;
      .tag-list-item {
        margin: 3px 10px 3px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        vertical-align: middle;
        cursor: pointer;
        .tag-item {
          cursor: pointer;
          border-radius: 10px;
          word-break:normal;
          width:auto;
          display:block;
          white-space:pre-wrap;
          word-wrap : break-word ;
          overflow: hidden ;
          padding-bottom: 3px;
          /deep/ .anticon-close{
            color: rgba(239, 78, 78, 1);
          }
        }
      }

      .skill-mode {
        .tag-item {
          //background-color: rgba(21, 195, 154, 0.1);
          color: #000000;
          //border: 1px solid rgba(21, 195, 154, 1);
          background: #D7E0E9;
          border: 1px solid #92B2D1;
        }
      }

    }
    .actions{
      display: flex;
      align-items: center;
      .add-action {
        display: flex;
        cursor:pointer;
        height: 20px;
        img {
          width: 20px;
        }
      }
      .up-down{
        cursor: pointer;
        display: flex;
        width: 20px;
        margin-left: 8px;
      }
    }
  }
  .objectives-list-item-skill{
    background: #FF978E;
    border: 1px solid #EED1AA;
    opacity: 1;
    border-radius: 10px;
  }
  .objectives-list-item-learn{
    background: #D4EBE7;
    border: 1px solid #B1D1CC;
    opacity: 1;
    border-radius: 10px;
  }
  .objectives-list-item-21{
    background: #D7E0E9;
    border: 1px solid #92B2D1;
    opacity: 1;
    border-radius: 10px;
  }
  .delete-action {
    position: absolute;
    top:5px;
    right: -35px;
    display: none;
    cursor: pointer;
    height: 35px;
    img {
      width: 35px;
    }
  }
}

.form-desc-list {
  padding: 10px 5px;
}
</style>
