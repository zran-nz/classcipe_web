<template>
  <div class="content-item" v-if='content'>
    <div class="item-title">
      <a-checkbox v-model="checked">The title</a-checkbox>
    </div>
    <div class="item-user">
      <div class="user-avatar">
        <img :src="content.avatar" alt="" v-if="content.avatar">
        <img src="~@/assets/icons/library/default-avatar.png" alt="" v-else>
      </div>
      <div class="user-detail">
        <label for="">nime</label>
      </div>
    </div>
    <div class="item-desc">
      <label class="desc-during">2021/11/05-2022/03/03  12:00</label>
      <label class="desc-storage">20Mb</label>
    </div>
    <div class="item-cover">
      <!-- <div
        class='cover-block'
        :style="{'background-image': 'url(' + (content.cover) + ')'}">
      </div> -->
      <div
        class='cover-block'
        style="background-image: url('https://dcdkqlzgpl5ba.cloudfront.net/1393741943869063170/ppt/20220616/Q0nHcgzR8vOVqYQxIWV6BFlLXrmWUOOpOR7icIzXPOjJP5PhK7coZPF3kg93iMg4BCiCoM-FZa0qpPqNE6xFUX7fKe4bU6sWY0peKhbEH2l4iHUyLxkxQ4Bio3DrUPEv8wBthJGMPVTQORIoK9DbCEhl1eGXJtC7r0hBjivkc4G-EAEasxBSt9zK9AEHmhEvUOi5rx-I1zczCc1iADTfp3dopJDIYfnHobKLWi8tTC-3q2UiTcg=s800')">
      </div>
      <div class="cover-tag">
        <div class="tag-item">No linked task</div>
      </div>
    </div>
    <div class="item-opt">
      <a-dropdown :getPopupContainer="trigger => trigger.parentElement">
        <a-icon type="more" />
        <a-menu slot="overlay">
          <a-menu-item>
            <a href="javascript:;" @click="handleDelete(cls)">Delete</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpaceContentItem',
  props: {
    content: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      checked: false
    }
  },
  methods: {
    handleDelete() {

    }
  }
}
</script>

<style lang="less" scoped>
@import "~@/components/index.less";
.content-item {
  position: relative;
  padding: 10px;
  background: #fff;
  border: 1px solid #EEF1F6;
  border-radius: 10px;
  .item-title {
    font-family: Arial;
    font-weight: bold;
    color: #16171A;
    margin-bottom: 10px;
    font-size: 16px;
  }
  .item-user {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .user-avatar {
      width: 50px;
      height: 50px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        border-radius: 100%;
      }
    }
    .user-detail {
      margin-left: 10px;
      label {
        font-family: Arial;
        font-weight: 400;
        color: #3F81A5;
        font-size: 14px;
      }
    }
  }
  .item-desc {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    label {
      font-family: Arial;
      font-weight: 400;
      color: #2D2E2F;
      font-size: 12px;
    }
  }
  .item-cover {
    width: 100%;
    height: 150px;
    position: relative;
    .cover-block {
      width:100%;
      height: 100%;
      background-position: center center;
      background-size: cover;
      background-repeat: no-repeat;
    }
    .cover-tag {
      position: absolute;
      bottom: 10px;
      left: 10px;
      .tag-item {
        height: 20px;
        background: rgba(0, 0, 0, 0.45);
        border-radius: 3px;
        line-height: 20px;
        padding: 0 5px;
        color: #fff;
        font-family: Arial;
        font-weight: 400;
        font-size: 12px;
        opacity: .8;
      }
    }
  }
  .item-opt {
    position: absolute;
    cursor: pointer;
    right: 10px;
    top: 10px;
    font-size: 20px;
    i {
      color: #9AA4B3;
    }
  }
}
</style>
