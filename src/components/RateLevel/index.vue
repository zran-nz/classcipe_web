<template>
  <a-space>
    <a-popover trigger="click" overlayClassName="choose-con" :visible="bloomTagVisible" @visibleChange="handleBloomChange">
      <template slot="content">
        <div class="choose-bar-title">Set Bloom's taxonomy</div>
        <div class="choose-bar">
          <div
            class="choose-bar-item"
            @click="changeLevel('bloomTag', item.title)"
            :style="{background: COLOR_LEVEL.BLOOM[index], height: HEIGHT[index]+'px'}"
            v-for="(item, index) in bloomLevel"
            :key="'bloom_' + item.title">
            <label>{{ item.title }}</label>
          </div>
        </div>
      </template>
      <a-rate
        v-show="currentBloom"
        class="rate-bar-con super-small bloom-color"
        :tooltips="bloomLevelDesc"
        :count="bloomLevel.length"
        :value="currentBloomLevel"
        disabled>
        <div slot="character">
          <div class="rate-bar"></div>
        </div>
      </a-rate>
    </a-popover>
    <a-popover trigger="click" overlayClassName="choose-con" :visible="knowledgeDimensionVisible" @visibleChange="handleKnowledgeChange">
      <template slot="content">
        <div class="choose-bar-title">Set Knowledge Dimensions</div>
        <div class="choose-bar">
          <div
            class="choose-bar-item"
            @click="changeLevel('knowledgeDimension', item.title)"
            :style="{background: COLOR_LEVEL.KNOWLEDGE[index], height: HEIGHT[index]+'px'}"
            v-for="(item, index) in knowledgeLevel"
            :key="'knowledge_' + item.title">
            <label>{{ item.title }}</label>
          </div>
        </div>
      </template>
      <a-rate
        v-show="currentKnowledge"
        class="rate-bar-con super-small knowledge-color"
        :tooltips="knowledgeLevelDesc"
        :count="knowledgeLevel.length"
        :value="currentKnowledgeLevel"
        disabled>
        <div slot="character">
          <div class="rate-bar"></div>
        </div>
      </a-rate>
    </a-popover>
  </a-space>
</template>

<script>
import { DICT_BLOOM_TAXONOMY, DICT_KNOWLEDGE_DIMENSION, COLOR_LEVEL } from '@/const/common'
import { GetDictItems } from '@/api/common'
export default {
  name: 'RateLevel',
  props: {
    bloom: {
      type: String,
      default: ''
    },
    knowledge: {
      type: String,
      default: ''
    }
  },
  watch: {
    bloom: {
      handler(val) {
        this.currentBloom = val
      }
    },
    knowledge: {
      handler(val) {
        this.currentKnowledge = val
      }
    }
  },
  computed: {
    bloomLevelDesc() {
      if (this.bloomLevel && this.bloomLevel.length > 0) {
        return this.bloomLevel.map(item => item.title)
      } else {
        return []
      }
    },
    currentBloomLevel() {
      if (this.currentBloom && this.bloomLevel.length > 0) {
        const val = this.bloomLevel.find(bloom => bloom.text === this.currentBloom)
        return val ? parseInt(val.value) : 0
      }
      return 0
    },
    knowledgeLevelDesc() {
      if (this.knowledgeLevel && this.knowledgeLevel.length > 0) {
        return this.knowledgeLevel.map(item => item.title)
      } else {
        return []
      }
    },
    currentKnowledgeLevel() {
      if (this.currentKnowledge && this.knowledgeLevel.length > 0) {
        const val = this.knowledgeLevel.find(bloom => bloom.text === this.currentKnowledge)
        return val ? parseInt(val.value) : 0
      }
      return 0
    }
  },
  data() {
    return {
      COLOR_LEVEL: COLOR_LEVEL,
      bloomTagVisible: false,
      knowledgeDimensionVisible: false,
      HEIGHT: [20, 27, 35, 45, 56, 67, 78, 100],
      currentBloom: this.bloom,
      currentKnowledge: this.knowledge,
      bloomLevel: [],
      knowledgeLevel: []
    }
  },
  created() {
    this.initDict()
  },
  methods: {
    initDict() {
      Promise.all([
        GetDictItems(DICT_BLOOM_TAXONOMY),
        GetDictItems(DICT_KNOWLEDGE_DIMENSION)
      ]).then(([bloomRes, knowledgeRes]) => {
        if (bloomRes.success) {
          this.bloomLevel = bloomRes.result
        }
        if (knowledgeRes.success) {
          this.knowledgeLevel = knowledgeRes.result
        }
      })
    },
    changeLevel(type, title) {
      this[type + 'Visible'] = false
      this.$emit('change', {
        type: type,
        title: title
      })
    },
    handleKnowledgeChange(visible) {
      this.knowledgeDimensionVisible = visible
    },
    handleBloomChange(visible) {
      this.bloomTagVisible = visible
    }
  }
}
</script>

<style scoped lang="less">
.bloom-color {
  /deep/ .ant-rate-star{
    // border: 1px solid #76b54a;
    transition: none;
    & > div:hover {
      transform: scale(1);
    }
    & > div:focus {
      transform: scale(1);
    }
    .rate-bar {
      background: #CDCDCD;
    }
  }
  /deep/ .ant-rate-star-full {
    border-top: none;
    .rate-bar {
      background: #76b54a!important;
    }
  }
}
.knowledge-color {
  /deep/ .ant-rate-star{
    // border: .5px solid #2f74b5;
    transition: none;
    & > div:hover {
      transform: scale(1);
    }
    & > div:focus {
      transform: scale(1);
    }
    .rate-bar {
      background: #CDCDCD;
    }
  }
  /deep/ .ant-rate-star-full {
    border-top: none;
    .rate-bar {
      background: #2f74b5!important;
    }
  }
}
</style>
<style lang="less">
.choose-con {
  .ant-popover-content {
    .ant-popover-arrow {
      border-right-color: #222634;
      border-bottom-color: #222634;
    }
    .ant-popover-inner {
      background: #222634;
      border-radius: 2px;
    }
  }
  .choose-bar-title {
    font-size: 10px;
    font-family: Arial;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 10px;
  }
  .choose-bar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    .choose-bar-item {
      flex: 1;
      min-width: 80px;
      margin:0 5px;
      color: #fff;
      display: flex;
      align-items: center;
      text-align: center;
      cursor: pointer;
      border-radius: 3px;
      label {
        width: 100%;
        cursor: pointer;
        font-size: 10px;
        color: #4A6B98;
      }
    }
  }
}
</style>
