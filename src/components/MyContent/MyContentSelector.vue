<template>
  <div class="my-content-selector">
    <div class="nav-bar-top">
      <div class="nav-bar-wrapper">
        <div :class="{'nav-bar-item': true, 'selected-nav-bar' : selectedType === 'created-by-me'}">
          <a @click="handleToggleType('created-by-me')">
            <img src="~@/assets/icons/myContent/Created_by_me@2x.png" class="icon-img" />
            {{ $t('teacher.main.created-by-me') }}
          </a>
        </div>
        <div :class="{'nav-bar-item': true, 'selected-nav-bar' : selectedType === 'my-favorite'}">
          <a @click="handleToggleType('my-favorite')">
            <img src="~@/assets/icons/myContent/My favorite@2x.png" class="icon-img" />
            {{ $t('teacher.main.my-favorite') }}
          </a>
        </div>
        <div :class="{'nav-bar-item': true, 'selected-nav-bar' : selectedType === 'shared'}">
          <a @click="handleToggleType('shared')">
            <img src="~@/assets/icons/myContent/Shared@2x.png" class="icon-img" />
            {{ $t('teacher.main.shared') }}
          </a>
        </div>
      </div>
    </div>
    <my-content-created-by-me
      :filter-type-list="filterTypeList"
      :selected-list="selectedList"
      :mode="mode"
      :selected-type="selectedType"
      :current-id="currentId"
    />
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
    },
    currentId: {
      type: String,
      default: ''
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

.my-content-selector {
  min-height: 300px;

  .nav-bar-left {
    height: 100%;
    box-sizing: border-box;
    margin-top: 70px;
    padding-right: 5px;
    .nav-bar-wrapper {
      border-radius: 6px;
      .nav-bar-item {
        font-family: Inter-Bold;
        font-size: 14px;
        cursor: pointer;
        background-image: url("~@/assets/icons/myContent/Rectangle@2x.png");
        background-repeat: repeat;
        background-size: cover;

        a {
          display: inline-block;
          width: 100%;
          line-height: 30px;
          padding: 10px 20px;
          color: #000000;
          &:hover {
            color: @primary-color;
          }

          img.icon-img {
            width: 25px;
            margin-right: 10px;
          }
        }

        &:hover {
          a {
            color: @primary-color;
          }
        }
      }

      .selected-nav-bar {
        a {
          color: @primary-color;
        }
      }
    }
  }
}
</style>
