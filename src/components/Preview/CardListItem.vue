<template>
  <div class="cc-card">
    <div class="cover-img relative-position" :style="{backgroundImage: 'url(' + content.image + ')', 'width' : width + 'rem'}">
      <div class="card-bottom-section q-pa-sm col q-gutter-xs inner-desc absolute-bottom" v-if="innerDesc">
        <div class="card-title text-bold text-h7">{{ content.name }}</div>
        <div class="card-info">
          <div class="row items-center justify-start q-gutter-xs q-pa-none">
            <q-avatar size="2rem">
              <img :src="content.owner.avatar">
            </q-avatar>
            <div class="card-owner-name">
              {{ content.owner.nickname }}
            </div>
            <div class="price text-bold text-red-7">
              $ {{ content.price }}
            </div>
            <div class="star-rating row items-center justify-start">
              <q-rating :model-value="5" size="1em" readonly/>
              <span class="rating-num"> 10</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-bottom-section q-py-md col q-gutter-sm" v-if="outerDesc" :style="{'width' : width + 'rem'}">
      <div class="card-title ellipsis text-bold text-h7">{{ content.name }}</div>
      <div class="card-info">
        <div class="row items-center justify-start q-gutter-sm">
          <template v-if="content.owner">
            <a-avatar :src="content.owner.avatar"/>
          </template>
          <template v-if="!content.owner && content.createBy">
            <a-avatar
              :style="{ backgroundColor: '#15c39a', verticalAlign: 'middle' }">
              {{ content.createBy[0].toUpperCase() }}
            </a-avatar>
          </template>
          <div class='card-extra-info'>
            <div class="card-owner-name">
              <template v-if="content.owner">
                {{ content.owner.nickname }}
              </template>
              <template v-if="!content.owner && content.createBy">
                {{ content.createBy }}
              </template>
            </div>
            <div class='row price-star'>
              <div class="price text-bold text-red-7">
                ${{ content.price }}
              </div>
              <div class="star-rating row items-center justify-start">
                <a-rate :value="5" disabled class='cc-rate'/>
                <span class="rating-num"> 10 </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'CardListItem',
  props: {
    content: {
      type: Object,
      required: true
    },
    width: {
      type: Number,
      default: 20
    },
    innerDesc: {
      type: Boolean,
      default: false
    },
    outerDesc: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {}
  },
  created() {
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.cc-card {
}

.cover-img {
  padding-bottom: 52%;
  background: #F1F1F1 center;
  border-radius: 10px;
  border: 1px solid #F1F1F1;
  overflow: hidden;
  background-size: cover;
}

.inner-desc {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.8);
}

.q-py-md {
  margin-top: 10px;
  margin-bottom: 10px;
}

.text-h7 {
  font-size: 15px;
  color: #000;
  font-weight: 400;
}

.card-info {
  margin-top: 5px;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
}

.card-extra-info {
  padding-left: 10px;
}

.price {
  font-family: Arial;
  font-weight: 400;
  color: #D3271A;
  line-height: 20px;
}

.star-rating {
  margin-left: 10px;
}
</style>
