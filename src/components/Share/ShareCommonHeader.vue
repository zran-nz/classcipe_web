<template>
  <div class='share-common-header'>
    <div class='header-content'>
      <div class='content-info'>
        <div class='title'>{{ title }}</div>
        <div class='meta-info'>
          <div class='avatar'>
            <avatar-svg />
          </div>
          <div class='create-info'>
            <div class='user-info'>
              <div class='user-name'>{{ createBy }}</div>
              <div class='create-time'>{{ createTime | localFormatDate }}</div>
            </div>
            <div class='star-info'>
              <a-tooltip placement="right">
                <template slot="title">
                  10 people gave a score of 5 stars
                </template>
                <a-rate :default-value="5" allow-half disabled class='my-star'/>
              </a-tooltip>
            </div>
          </div>
        </div>
        <div class='favorite-info' @click='handleFavorite'>
          <div class='favorite-item' v-if='isFavorite'>
            <div class='favorite-button'>
              <div class='favorite-icon'>
                <favorite-yellow />
              </div>
              <div class='favorite-text'>Like</div>
            </div>
          </div>
          <div class='unfavorite-item' v-if='!isFavorite'>
            <div class='favorite-button'>
              <div class='favorite-icon'>
                <favorite-white />
              </div>
              <div class='favorite-text'>Like</div>
            </div>
          </div>
        </div>
      </div>
      <div class='share-cover'>
        <img :src='image' alt='' v-if='image'>
      </div>
    </div>
  </div>
</template>

<script>

import AvatarSvg from '@/assets/icons/share/defaultAvatar.svg?inline'
import FavoriteWhite from '@/assets/icons/share/favoriteWhite.svg?inline'
import FavoriteYellow from '@/assets/icons/share/favoriteYellow.svg?inline'

const { FavoritesAdd } = require('@/api/favorites')

export default {
  name: 'ShareCommonHeader',
  components: {
    AvatarSvg,
    FavoriteWhite,
    FavoriteYellow
  },
  props: {
    id: {
      type: String,
      required: true
    },
    type: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: ''
    },
    createBy: {
      type: String,
      default: ''
    },
    createTime: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    isFavorite: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleFavorite () {
      FavoritesAdd({
        sourceId: this.id,
        sourceType: this.type
      }).then(response => {
        this.$logger.info('FavoritesAdd ', response)
        this.isFavorite = !this.isFavorite
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";

.share-common-header {
  width: 100%;
  height: 300px;
  background: #bfc2d3;
  padding: 20px 30px;

  .header-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    max-width: 1000px;
    margin: auto;
  }
}

.content-info {
  width: 600px;
  padding: 0 10px;

  .title {
    padding-bottom: 10px;
    line-height: 30px;
    font-weight: bold;
    font-size: 22px;
    color: #222;
  }

  .meta-info {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;

    .avatar {
      padding-top: 10px;
      margin-left: -5px;
      svg {
        height: 25px;
      }
    }

    .create-info {
      padding-left: 5px;
      .user-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        .user-name {
          font-size: 14px;
          color: #182552;
          font-weight: 400;
        }

        .create-time {
          font-size: 12px;
          color: #444;
          padding-left: 10px;
        }
      }
    }
  }
}

.share-cover {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 260px;
  max-width: 400px;
  overflow: hidden;
  img {
    height: 250px;
  }
}

.favorite-info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.favorite-item {
  color: #fff;
  cursor: pointer;
}

.unfavorite-item {
  color: #fff;
  cursor: pointer;
}

.favorite-button {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: #07AB84;
  border-radius: 30px;
  height: 30px;
  min-width: 80px;
  line-height: 30px;

  .favorite-icon {
    width: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .favorite-text {
    font-size: 12px;
    padding-left: 10px;
  }
}
</style>
