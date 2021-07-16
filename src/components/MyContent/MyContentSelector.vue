<template>
  <div class="my-content-selector">
    <a-row>
      <a-col span="5">
        <div class="nav-bar-left">
          <div class="nav-bar-wrapper">
            <div :class="{'nav-bar-item': true, 'selected-nav-bar' : selectedType === 'created-by-me'}">
              <a @click="handleToggleType('created-by-me')">
                <a-icon type="container" :theme="selectedType === 'created-by-me' ? 'filled': 'outlined'"/>
                {{ $t('teacher.main.created-by-me') }}
              </a>
            </div>
            <div :class="{'nav-bar-item': true, 'selected-nav-bar' : selectedType === 'my-favorite'}">
              <a @click="handleToggleType('my-favorite')">
                <a-icon type="like" :theme="selectedType === 'my-favorite' ? 'filled': 'outlined'" />
                {{ $t('teacher.main.my-favorite') }}
              </a>
            </div>
            <div :class="{'nav-bar-item': true, 'selected-nav-bar' : selectedType === 'shared'}">
              <a @click="handleToggleType('shared')">
                <a-icon type="share-alt"/>
                {{ $t('teacher.main.shared') }}
              </a>
            </div>
          </div>
        </div>
      </a-col>
      <a-col span="19">
        <my-content-created-by-me
          :filter-type-list="filterTypeList"
          :selected-list="selectedList"
          :mode="mode"
          :selected-type="selectedType"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script>
import MyContentCreatedByMe from './MyContentCreatedByMe'
import DisplayMode from '@/components/MyContent/DisplayMode'
export default {
  name: 'MyContentSelector',
  components: {
    MyContentCreatedByMe
  },
  props: {
    filterTypeList: {
      type: Array,
      default: () => []
    },
    selectedList: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: DisplayMode.Link
    }
  },
  data () {
    return {
      displayMode: DisplayMode,
      selectedType: 'created-by-me'
    }
  },
  computed: {
  },
  created () {
    this.$logger.info('MyContentSelector selectedType ' + this.selectedType + ', mode:' + this.mode + ', filterType ', this.filterTypeList)
  },
  mounted () {
  },
  methods: {
    handleToggleType (type) {
      this.$logger.info('handleToggleType ' + type)
      this.selectedType = type
    }
  }
}
</script>

<style lang="less" scoped>

@black: #000;
@primary-color: #15c39a;
@text-color-secondary: fade(@black, 45%);

.nav-bar-left {
  height: 100%;
  border-right: 1px solid #e8e8e8;
  box-sizing: border-box;
  .nav-bar-wrapper {
    .nav-bar-item {
      margin: 10px 0;
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;

      a {
        display: inline-block;
        height: 50px;
        line-height: 30px;
        border-radius: 25px;
        padding: 10px 20px;
        color: @text-color-secondary;
        &:hover {
          color: @primary-color;
        }
      }

      &:hover {
        a {
          background-color: fade(@primary-color, 10%);
          color: @primary-color;
        }
      }
    }

    .selected-nav-bar {
      a {
        background-color: fade(@primary-color, 10%);
        color: @primary-color;
        border-radius: 25px;
      }
    }
  }
}

</style>
