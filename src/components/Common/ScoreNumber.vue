<template>
  <div class='score-number'>
    <div class='score-number-label'>
      <div class='score-number-item' v-for='(num, nIdx) in numberLetters' :key='nIdx'>
        <img :style="{'width': size + 'px'}" src='~@/assets/icons/evaluation/score/0.png' :alt='num' v-if="num === '0'"/>
        <img :style="{'width': size + 'px'}" src='~@/assets/icons/evaluation/score/1.png' :alt='num' v-if="num === '1'"/>
        <img :style="{'width': size + 'px'}" src='~@/assets/icons/evaluation/score/2.png' :alt='num' v-if="num === '2'"/>
        <img :style="{'width': size + 'px'}" src='~@/assets/icons/evaluation/score/3.png' :alt='num' v-if="num === '3'"/>
        <img :style="{'width': size + 'px'}" src='~@/assets/icons/evaluation/score/4.png' :alt='num' v-if="num === '4'"/>
        <img :style="{'width': size + 'px'}" src='~@/assets/icons/evaluation/score/5.png' :alt='num' v-if="num === '5'"/>
        <img :style="{'width': size + 'px'}" src='~@/assets/icons/evaluation/score/6.png' :alt='num' v-if="num === '6'"/>
        <img :style="{'width': size + 'px'}" src='~@/assets/icons/evaluation/score/7.png' :alt='num' v-if="num === '7'"/>
        <img :style="{'width': size + 'px'}" src='~@/assets/icons/evaluation/score/8.png' :alt='num' v-if="num === '8'"/>
        <img :style="{'width': size + 'px'}" src='~@/assets/icons/evaluation/score/9.png' :alt='num' v-if="num === '9'"/>
      </div>
    </div>
    <div class='number-underline'>
      <img :style="{'width': (size * 1.5) + 'px' }" src='~@/assets/icons/evaluation/score/button_line_1.png' alt='' />
      <img :style="{'width': (size * 1.5) + 'px' }" src='~@/assets/icons/evaluation/score/button_line_2.png' alt=''/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScoreNumber',
  props: {
    score: {
      type: Number,
      default: 0
    },
    size: {
      type: Number,
      default: 40
    }
  },
  data () {
    return {
      numberLetters: []
    }
  },
  created() {
    const numberLetters = this.score.toString().split('')
    if (!numberLetters.length) {
      this.numberLetters = ['0']
    } else {
      this.numberLetters = numberLetters
    }
  },
  watch: {
    score: function (newScore) {
      const numberLetters = newScore.toString().split('')
      if (!numberLetters.length) {
        this.numberLetters = ['0']
      } else {
        this.numberLetters = numberLetters
      }
    }
  }
}
</script>

<style lang='less' scoped>
@import '~@/components/index.less';

.score-number {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .score-number-label {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .score-number-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }

  .number-underline {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}

</style>
