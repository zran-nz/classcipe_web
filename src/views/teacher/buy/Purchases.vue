<template>
  <div class="my-content">
    <div class="content-title">My Purchases</div>
    <div class="filter-line">
      <div class="type-owner">
        <div class="my-search">
          <a-input-search
            placeholder="Search"
            v-model="filterParams.searchKey"
            @search="triggerSearch"
            @pressEnter="triggerSearch"
            :allowClear="true"
            size="large"
          >
          </a-input-search>
        </div>
        <div class="filter-option">
          <label>Type: </label>
          <a-select
            v-model="filterParams.types"
            mode="multiple"
            allowClear
            class="filter-item"
            size="large"
            @change="triggerSearch"
            placeholder="Search by type"
          >
            <a-select-option :value="item.value" v-for="(item, index) in typeOptions" :key="'type_'+index">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <div class="filter-option">
          <label>Price: </label>
          <a-select
            v-model="filterParams.priceType"
            class="filter-item"
            size="large"
            @change="triggerSearch"
            placeholder="Search by price"
          >
            <a-select-option :value="item.value" v-for="(item, index) in priceOptions" :key="'price_'+index">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
        <div class="filter-option">
          <label>Sort: </label>
          <a-select
            v-model="filterParams.sortTypes"
            class="filter-item"
            size="large"
            @change="triggerSearch"
            placeholder="Order by sort"
          >
            <a-select-option :value="item.value" v-for="(item, index) in sortOptions" :key="'sort_'+index">
              {{ item.label }}
            </a-select-option>
          </a-select>
        </div>
      </div>
      <div class="view-mode-toggle">
        <div class="view-mode">
          <div :class="{'view-mode-item': true, 'active-view': viewMode === 'img'}" @click="toggleViewMode('img')">
            <pubu-svg />
          </div>
          <div :class="{'view-mode-item': true, 'active-view': viewMode === 'list'}" @click="toggleViewMode('list')">
            <liebiao-svg />
          </div>
        </div>
      </div>
    </div>

    <course-list
      :loadData="loadData"
      :viewMode="viewMode"
      :optArray="['Edit review', 'Preview']"
      ref="myCourseList"
    >
    </course-list>
  </div>
</template>

<script>

import { SESSION_VIEW_MODE } from '@/const/common'
import { typeMap } from '@/const/teacher'

import CourseList from '@/components/Teacher/CourseList'

import LiebiaoSvg from '@/assets/svgIcon/myContent/liebiao.svg?inline'
import PubuSvg from '@/assets/svgIcon/myContent/pubu.svg?inline'
import FilterIcon from '@/assets/libraryv2/filter.svg?inline'
import FilterActiveIcon from '@/assets/libraryv2/filter_active.svg?inline'
import CollaborateSvg from '@/assets/icons/collaborate/collaborate_group.svg?inline'

import { FindPurchases } from '@/api/teacher'

import storage from 'store'

export default {
  name: 'TeacherBuyPurchases',
  components: {
    FilterIcon,
    FilterActiveIcon,
    LiebiaoSvg,
    PubuSvg,
    CollaborateSvg,
    CourseList
  },
  data() {
    return {
      loading: true,
      typeOptions: [
        // {
        //   label: 'All',
        //   value: ''
        // },
        {
          label: 'Unit Plan',
          value: typeMap['unit-plan']
        },
        {
          label: 'Task',
          value: typeMap.task
        },
        {
          label: 'Assessment',
          value: typeMap.evaluation
        },
        {
          label: 'Video',
          value: 8
        }
      ],
      priceOptions: [
        {
          label: 'All',
          value: ''
        },
        {
          label: 'Paid',
          value: 1
        },
        {
          label: 'Free',
          value: 2
        }
      ],
      sortOptions: [
        {
          label: 'Recently Purchased',
          value: 1
        },
        {
          label: 'Recently Updated',
          value: 2
        },
        {
          label: 'Alphabetical',
          value: 3
        }
      ],
      viewMode: storage.get(SESSION_VIEW_MODE) ? storage.get(SESSION_VIEW_MODE) : 'img',
      filterParams: {
        searchKey: '',
        types: [],
        priceType: '',
        sortTypes: 1
      },

      loadData: (pageParams) => {
        const params = {
          ...this.filterParams,
          ...pageParams
        }
        return FindPurchases(params)
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {

    },
    toggleViewMode (viewMode) {
      storage.set(SESSION_VIEW_MODE, viewMode)
      this.viewMode = viewMode
    },
    triggerSearch() {
      this.$refs.myCourseList && this.$refs.myCourseList.loadMyContent()
    }
  }
}
</script>

<style scoped lang="less">
@import "~@/components/index.less";
.ant-list-item {
  padding: 8px 0;
  position: relative;
}

.active-item {
  background-color: fade(@outline-color, 20%);
  color: @primary-color;
}

.my-list-item {
  min-width: 800px;
  opacity: 1;
  width: 100%;
  border-radius: 4px;
  background: #FFFFFF;
  padding: 15px 10px;
  margin-bottom: 15px;
  cursor: pointer;
  .collaborate-icon-item{
    width:30px;
    height: 30px;
    margin-left: 10px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.my-content {
  background: #fff;
  padding: 0 20px 25px 20px;
  .content-title {
    font-size: 24px;
    font-weight: bold;
    padding-top: 20px;
  }
  .filter-line {
    padding: 15px 0;
    display: flex;
    justify-content: space-between;
    .status-tab {
      cursor: pointer;
      display: flex;
      flex-direction: row;
      align-items: center;
      .toggle-mode-type-wrapper {
        width: 280px;
        box-sizing: border-box;
        .toggle-mode-type {
          height: 40px;
          display: inline-block;
          border-radius: 40px;
          background: rgba(228, 228, 228, 0.3);

          .toggle-mode {
            border-radius: 40px;
            height: 40px;
            display: flex;
            flex-direction: row;
            font-size: 14px;

            .mode-item {
              padding: 0 8px;
              font-size: 13px;
              height: 40px;
              color: rgba(17, 20, 45, 1);
              border-radius: 40px;
              font-family: Inter-Bold;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 90px;
            }

            .active-mode {
              color: #fff;
              background: rgba(21, 195, 154, 1);
            }
          }
        }
      }
    }

    .type-owner {
      min-height: 40px;
      display: flex;
      flex-direction: row;
      align-items: center;
    }
    .my-search{
      margin-right: 10px;
      border-radius:6px;
      width: 200px;
      /deep/ .ant-input{
        border-radius:6px;
        height: 40px;
        font-size: 14px;
      }
    }

    .filter-icon {
      .filter-item {
        color: #333;
        cursor: pointer;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        background: #FFFFFF;
        border: 1px solid #D3D3D3;
        opacity: 1;
        border-radius: 6px;
        padding: 9px 15px;
        white-space:nowrap;
        margin-right: 20px;

        svg {
          height: 20px;
        }
        .filter-active-icon {
          display: none;
        }
        .filter-icon {
          display: inline;
        }

        &:hover {
          color: #38cfa6;
          border: 1px solid #38cfa6;
          .filter-active-icon {
            display: inline;
          }

          .filter-icon {
            display: none;
          }
        }

        .filter-label {
          font-family: Inter-Bold;
          line-height: 20px;
          padding-left: 8px;
        }
      }
    }

    .filter-option {
      display: flex;
      align-items: center;
      margin-right: 10px;
      label {
        margin-right: 5px;
      }
      .filter-item {
        width: 220px;
        line-height: 40px;
        font-size: 14px;
      }
    }

  }
  .filter-params{
    margin-bottom: 5px;
    border: 1px solid #E4E4E4;
    padding: 5px 15px;
    border-radius: 5px;
    max-height: 290px;
    overflow: auto;
    background: rgba(228, 228, 228, 0.2);

    &::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    &::-webkit-scrollbar-track {
      border-radius: 3px;
      background: rgba(0,0,0,0.00);
      box-shadow: inset 0 0 5px rgba(0,0,0,0.01);
    }
    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
      border-radius: 5px;
      background: rgba(0,0,0,0.12);
      box-shadow: inset 0 0 10px rgba(0,0,0,0.01);
    }
  }
  .expand-icon {
    margin-bottom: 10px;
    cursor: pointer;
    line-height: 30px;
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;

    i {
      padding: 0 5px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      svg {
        font-size: 23px;
      }
    }
  }

}
a.delete-action {
  color: @red-4;
}

.view-mode-toggle {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-right: 10px;
  background: #FFFFFF;
  border: 1px solid #D8D8D8;
  opacity: 1;
  border-radius: 6px;
  height: 40px;
  padding: 0px 15px;
  margin-left: 20px;

  &:hover {
    border: 1px solid #15c39a;
  }
  .view-mode {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    color: @text-color-secondary;

    .view-mode-item {
      font-size: 20px;
      padding-left: 5px;
      margin: 0 3px;
      display: flex;
      flex-direction: row;
      align-items: center;

      svg {
        height: 22px;
      }
    }

    .active-view {
      svg {
        fill: @primary-color;
      }
    }
  }
}
</style>
