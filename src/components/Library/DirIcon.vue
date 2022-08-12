<template>
  <div class="dir-icon">
    <blue-dir-svg class="blue" v-if="dirType === 'blue'"/>
    <yellow-dir-svg v-else-if="dirType === 'yellow'" class="yellow"/>
    <open-dir-svg class="opened" v-else-if="dirType === 'opened'"/>
    <img src="~@/assets/icons/library/Task.png" v-else-if="contentType === typeMap.task"/>
    <img src="~@/assets/icons/library/unitplan.png" v-else-if="contentType === typeMap['unit-plan']"/>
    <img src="~@/assets/icons/library/evaluation.png" v-else-if="contentType === typeMap.evaluation"/>
    <img src="~@/assets/icons/library/evaluation.png" v-else/>
  </div>
</template>

<script>
import BlueDirSvg from '@/assets/svgIcon/library/blue_dir.svg?inline'
import YellowDirSvg from '@/assets/svgIcon/library/yellow_dir.svg?inline'
import OpenDirSvg from '@/assets/svgIcon/library/open_dir.svg?inline'

import { typeMap } from '@/const/teacher'
export default {
  name: 'DirIcon',
  components: {
    BlueDirSvg,
    YellowDirSvg,
    OpenDirSvg
  },
  props: {
    dirType: {
      type: String,
      default: null
    },
    contentType: {
      type: Number,
      default: null
    }
  },
  data: function () {
    return {
      typeMap: typeMap
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../index.less');

.dir-icon {
  padding: 0 10px 0 0;

  img {
    width: 30px;
  }

  .blue {
    width: 22px;
  }

  .opened {
    width: 25px;
  }

  .yellow {
    width: 25px;
  }
}
</style>
