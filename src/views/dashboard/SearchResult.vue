<!--<template>-->
<!--  <a-card :bordered="false">-->
<!--    <div-->
<!--      v-infinite-scroll="handleInfiniteOnLoad"-->
<!--      class="demo-infinite-container"-->
<!--      :infinite-scroll-disabled="busy"-->
<!--      :infinite-scroll-distance="10"-->
<!--    >-->
<!--      <a-list item-layout="vertical" size="large" :data-source="data">-->
<!--        <a-list-item slot="renderItem" key="item.title" slot-scope="item">-->
<!--          <img-->
<!--            slot="extra"-->
<!--            width="272"-->
<!--            alt="logo"-->
<!--            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"-->
<!--          />-->
<!--          <a-list-item-meta :description="item.description">-->
<!--            <a slot="title" :href="item.href">{{ item.title }}</a>-->
<!--            <a-avatar slot="avatar" :src="item.avatar" />-->
<!--          </a-list-item-meta>-->
<!--          {{ item.content }}-->
<!--        </a-list-item>-->
<!--      </a-list>-->
<!--    </div>-->
<!--  </a-card>-->
<!--</template>-->
<!--<script>-->
<!--// import request from '@/utils/request'-->
<!--import infiniteScroll from 'vue-infinite-scroll'-->
<!--import { baseMixin } from '@/store/app-mixin'-->
<!--// const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo'-->
<!--export default {-->
<!--  directives: { infiniteScroll },-->
<!--  mixins: [baseMixin],-->
<!--  data () {-->
<!--    return {-->
<!--      data: [],-->
<!--      count: 0,-->
<!--      actions: [-->
<!--        { type: 'star-o', text: '156' },-->
<!--        { type: 'like-o', text: '156' },-->
<!--        { type: 'message', text: '2' }-->
<!--      ],-->
<!--      loading: false,-->
<!--      busy: false-->
<!--    }-->
<!--  },-->
<!--  beforeMount () {-->
<!--    this.fetchData(res => {-->
<!--      this.listData = res.results-->
<!--    })-->
<!--  },-->
<!--  methods: {-->
<!--    fetchData (callback) {-->
<!--      const listData = []-->
<!--      for (let i = 0; i < 8; i++) {-->
<!--        listData.push({-->
<!--          href: 'https://www.antdv.com/',-->
<!--          title: `ant design vue part ${i}`,-->
<!--          avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',-->
<!--          description:-->
<!--            'Ant Design, a design language for background applications, is refined by Ant UED Team.',-->
<!--          content:-->
<!--            'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.'-->
<!--        })-->
<!--      }-->
<!--      callback(listData)-->
<!--      // return request({-->
<!--      //   url: fakeDataUrl,-->
<!--      //   type: 'json',-->
<!--      //   method: 'get',-->
<!--      //   contentType: 'application/json',-->
<!--      //   success: res => {-->
<!--      //     callback(res)-->
<!--      //   }-->
<!--      // })-->
<!--    },-->
<!--    handleInfiniteOnLoad () {-->
<!--      this.count++-->
<!--      console.log(this.count)-->
<!--      this.loading = true-->
<!--      if (this.count > 5) {-->
<!--        this.$message.warning('Infinite List loaded all')-->
<!--        this.busy = true-->
<!--        this.loading = false-->
<!--        return-->
<!--      }-->
<!--      this.fetchData(res => {-->
<!--        this.data = this.data.concat(res)-->
<!--        this.loading = false-->
<!--      })-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->
<!--<style>-->
<!--.demo-infinite-container {-->
<!--  border: 1px solid #e8e8e8;-->
<!--  border-radius: 4px;-->
<!--  overflow: auto;-->
<!--  padding: 8px 24px;-->
<!--  max-height: 1000px;-->
<!--}-->
<!--.demo-loading-container {-->
<!--  position: absolute;-->
<!--  bottom: 40px;-->
<!--  width: 100%;-->
<!--  text-align: center;-->
<!--}-->
<!--.ant-list-item {-->
<!--  display: flex;-->
<!--  flex-direction: row-reverse;-->
<!--}-->
<!--.ant-list-vertical .ant-list-item-extra{-->
<!--  margin-right: 40px;-->
<!--}-->
<!--</style>-->
