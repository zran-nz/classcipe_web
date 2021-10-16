<template>
  <a-card :bordered="false" title="Notification">
    <div>
      <a-list item-layout="vertical" size="large" :data-source="data">
        <a-list-item slot="renderItem" key="item.title" slot-scope="item">
          <!--          <img-->
          <!--            slot="extra"-->
          <!--            width="272"-->
          <!--            alt="logo"-->
          <!--            src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"-->
          <!--          />-->
          <a-list-item-meta :description="item.description">
            <a slot="title" :href="item.href">{{ item.title }}</a>
            <a-avatar slot="avatar" :src="item.avatar" />
          </a-list-item-meta>
          <a-button type="primary" @click="handleOk">立即查看</a-button>
        </a-list-item>
      </a-list>
    </div>
  </a-card>
</template>

<script>
import { baseMixin } from '@/store/app-mixin'

const directionType = {
  horizontal: 'horizontal',
  vertical: 'vertical'
}

export default {
  name: 'Notification',
  mixins: [baseMixin],
  data () {
    this.directionType = directionType
    return {
      data: [
        {
          'title': 'Mike invite you to collabrate the task ：History of China',
          'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. ',
          'time': '2021 09 13  15:00',
          'avatar': 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png'
      }, {
          'title': 'Mike invite you to collabrate the task ：History of China',
          'description': 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar sic tempor. Sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. ',
          'time': '2021 09 13  15:00',
          'avatar': 'https://gw.alipayobjects.com/zos/rmsportal/OKJXDXrmkNshAMvwtvhu.png'
        }]
    }
  },
  computed: {

  }
}
</script>
