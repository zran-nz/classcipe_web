<template>
  <a-space>
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
  </a-space>
</template>

<script>
import { DICT_BLOOM_TAXONOMY, DICT_KNOWLEDGE_DIMENSION } from '@/const/common'
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
    }
  }
}
</script>

<style scoped lang="less">
.bloom-color {
  /deep/ .ant-rate-star{
    border: 1px solid #76b54a;
    .rate-bar {
      background: #fff!important;
    }
  }
  /deep/ .ant-rate-star-full {
    border: none;
    .rate-bar {
      background: #76b54a!important;
    }
  }
}
.knowledge-color {
  /deep/ .ant-rate-star{
    border: .5px solid #2f74b5;
    .rate-bar {
      background: #fff!important;
    }
  }
  /deep/ .ant-rate-star-full {
    border: none;
    .rate-bar {
      background: #2f74b5!important;
    }
  }
}
</style>
