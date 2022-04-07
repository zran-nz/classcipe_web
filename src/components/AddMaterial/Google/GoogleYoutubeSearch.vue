<template>
  <div class="page"> youtubeSearch</div>
</template>
<script>
export default {
  data() {
    return {
      youtubePlayerId: `youtubePlayerId${Math.random()}`,
      videoId: '',
      ytPlayer: null,
      startTime: 0,
      endTime: 0,
      url: '',
      videoUrl: '',
      delaySetTime: null,
      playerStatus: -1,
      playerStatusInterval: null
    }
  },

  created() {},
  watch: {},
  mounted() {
    this.$logger.info(this.videoId, 'watch videoId')
  },
  methods: {}
}
</script>

<style></style>
