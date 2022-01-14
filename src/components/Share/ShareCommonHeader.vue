<template>
  <div class='share-common-header'>
    <div class='header-content'>
      <div class='content-info'>
        <div class='title'></div>
        <div class='meta-info'>
          <div class='avatar'></div>
          <div class='create-info'>
            <div class='user-info'>
              <div class='user-name'></div>
              <div class='create-time'></div>
            </div>
            <div class='star-info'></div>
          </div>
        </div>
        <div class='favorite-info'>
          <div class='favorite-item'>
            <div class='favorite-button'>
              <div class='favorite-icon'></div>
              <div class='favorite-text'></div>
            </div>
          </div>
          <div class='unfavorite-item'>
            <div class='favorite-button'>
              <div class='favorite-icon'></div>
              <div class='favorite-text'></div>
            </div>
          </div>
        </div>
      </div>
      <div class='cover-img'>
        <img :src='image' alt='' v-if='image'>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShareCommonHeader',
  props: {
    title: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: '',
    },
    createBy: {
      type: String,
      default: '',
    },
    createTime: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    isFavorite: {
      type: Boolean,
      default: false,
    }
  },
  methods: {

  }
}
</script>

<style scoped>

</style>