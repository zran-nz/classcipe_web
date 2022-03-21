<template>
  <div class="my-reviews">
    <a-space class="reviews-opt" v-if="(myReviews || role === 'teacher') && !footerBottom">
      <a-button type="link" v-if="!isEdit" @click="() => triggerEdit(true)">Edit Review</a-button>
      <a-button type="link" v-if="isEdit" @click="() => triggerEdit(false)">Cancel</a-button>
      <a-button type="primary" v-if="isEdit" @click="handleSaveMyReview">Send</a-button>
    </a-space>
    <!-- student review -->
    <a-spin :spinning="subLoading" v-if="role === 'student'">
      <div class="reviews-edit" v-show="isEdit">
        <div class="reviews-edit__check">
          <div>
            <label>Difficulty Level</label>
            <a-rate
              class="rate-bar-con"
              :count="3"
              :tooltips="reviewsText"
              :allowClear="false"
              v-model="subForm.reviewsLabel"
            >
              <div slot="character">
                <div class="rate-bar"></div>
              </div>
            </a-rate>
          </div>
          <div>
            <label>Overall review</label>
            <a-rate v-model="subForm.reviewsScore" :allowClear="false"/>
          </div>
        </div>
        <div class="reviews-edit__text">
          <a-textarea
            placeholder="Enter your reviews......"
            ref="reviewsNotes"
            v-model="subForm.reviewsNotes"
            :auto-size="{ minRows: 4, maxRows: 6 }"
          />
        </div>
      </div>
    </a-spin>
    <!-- teacher review -->
    <a-spin :spinning="subLoading" v-if="role === 'teacher'">
      <div class="reviews-edit" v-show="isEdit">
        <div class="reviews-edit__check">
          <div>
            <a-tooltip title="Overall review">
              <label>Overall review</label>
            </a-tooltip>
            <a-rate :tooltips="RATE_TOOLTIPS.OVERALL" v-model="subForm.overall" :allowClear="false"/>
          </div>
          <div>
            <a-tooltip title="Students engagement">
              <label>Students engagement</label>
            </a-tooltip>
            <a-rate :tooltips="RATE_TOOLTIPS.ENGAGEMENT" v-model="subForm.studentsEngagement" :allowClear="false"/>
          </div>
        </div>
        <div class="reviews-edit__check">
          <div>
            <a-tooltip title="Effectiveness of teaching & learning">
              <label>Effectiveness of teaching & learning</label>
            </a-tooltip>
            <a-rate :tooltips="RATE_TOOLTIPS.EFFETIVENESS" v-model="subForm.effectiveness" :allowClear="false"/>
          </div>
          <div>
            <a-tooltip title="Quality of the content">
              <label>Quality of the content</label>
            </a-tooltip>
            <a-rate :tooltips="RATE_TOOLTIPS.QUALITY" v-model="subForm.quality" :allowClear="false"/>
          </div>
        </div>
        <div class="reviews-edit__check">
          <div>
            <a-checkbox v-model="subForm.learningDistance">
              Distance learning
            </a-checkbox>
          </div>
          <div>
            <a-checkbox v-model="subForm.learningHome">
              At home learning
            </a-checkbox>
          </div>
          <div>
            <a-checkbox v-model="subForm.learningClass">
              In-class learning
            </a-checkbox>
          </div>
        </div>
        <div class="reviews-edit__check">
          <a-checkbox v-model="subForm.updatedMsg">
            Let me know if this resource is updated or a new alternative version is created
          </a-checkbox>
        </div>
        <div class="reviews-edit__text">
          <a-textarea
            placeholder="Enter your reviews......"
            ref="reviewsNotes"
            v-model="subForm.reviewsNotes"
            :auto-size="{ minRows: 4, maxRows: 6 }"
          />
        </div>
      </div>
    </a-spin>
    <a-space class="reviews-footer" v-if="(myReviews || role === 'teacher') && footerBottom">
      <a-button @click="handleCancel">Cancel</a-button>
      <a-button type="primary" @click="handleSaveMyReview">Send</a-button>
    </a-space>
  </div>
</template>

<script>
import { RATE_TOOLTIPS } from '@/const/common'
export default {
  name: 'ReviewsEdit',
  props: {
    footerBottom: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      default: 'student'
    },
    myReviews: {
      type: Object,
      default: null
    }
  },
  watch: {
    myReviews: {
      handler(val) {
        console.log(val)
        this.subForm = val ? { ...val } : { ...this.init }
        if (this.footerBottom || (this.role === 'teacher' && (!val || !val.id))) {
          this.isEdit = true
        } else {
          this.isEdit = false
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      subLoading: false,
      RATE_TOOLTIPS: RATE_TOOLTIPS,
      isEdit: false,
      reviewsText: ['Easy', 'Intermediate', 'Difficult'],
      subForm: this.myReviews,
      init: {
        reviewsLabel: 1,
        reviewsNotes: '',
        reviewsScore: 1,
        overall: 1,
        effectiveness: 1,
        quality: 1,
        studentsEngagement: 1,
        learningClass: false,
        learningDistance: false,
        learningHome: false,
        updatedMsg: true
      }
    }
  },
  mounted() {
    if (this.footerBottom || (this.role === 'teacher' && (!this.myReviews || !this.myReviews.id))) {
      this.isEdit = true
    }
  },
  methods: {
     handleSaveMyReview () {
      if (this.role === 'student' && !this.myReviews) return
      this.subLoading = true
      const params = {
        ...this.subForm,
        learningClass: Number(this.subForm.learningClass),
        learningDistance: Number(this.subForm.learningDistance),
        learningHome: Number(this.subForm.learningHome),
        updatedMsg: Number(this.subForm.updatedMsg)
      }
      this.$emit('submit', params)
     },
     handleCancel() {
       this.$emit('cancel')
     },
     triggerLoading(loading) {
       this.subLoading = loading
     },
     triggerIsEdit(isEdit) {
       this.isEdit = isEdit
     },
     triggerEdit(val) {
      this.isEdit = val
      this.$nextTick(() => {
        val && this.$refs.reviewsNotes && this.$refs.reviewsNotes.focus()
      })
    }
  }
}
</script>

<style scoped lang="less">
.my-reviews {
  position: relative;
  .reviews-opt {
    position: absolute;
    top: -30px;
    right: 0
  }
  .reviews-edit {
    position: relative;
    padding: 20px 0;
    .reviews-edit__check {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40px;
      padding: 10px;
      border: 1px solid #d9d9d9;
      border-bottom: none;
      div {
        display: flex;
        align-items: center;
        label {
          margin-right: 5px;
          width:150px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          display: inline-block;
        }
      }
    }
    // .reviews-edit__text {
    //   textarea {
    //     border: none;
    //   }
    // }
  }
  .reviews-footer {
    position: relative;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
