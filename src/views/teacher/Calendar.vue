<template>
  <div class='my-content'>
    <a-spin :spinning="loading">
      <div class="schedule-content">
        <FullCalendar
          ref="fullCalendar"
          :options="calendarOptions"
          class="schedule-calendar"
        >
          <template v-slot:eventContent="info">
            <div
              class="schedule-event-content"
              :style="{backgroundColor: info.event._def.extendedProps.backgroundColor, color: '#fff'}"
            >
              <div v-show="info.view.type === 'timeGridWeek' || info.view.type === 'timeGridDay'">
                {{ info.event.start | dayjs(FORMATTER_SIM) }} - {{ info.event.end | dayjs(FORMATTER_SIM) }}
              </div>
              <span v-show="info.view.type === 'dayGridMonth'" style="margin-right: 5px;">
                {{ info.event.start | dayjs(FORMATTER_SIM) }}
              </span>
              <span
                class="event-content-dot"
                :style="{backgroundColor: ABSENT_COLORS[getColorIndex(info.event._def.extendedProps.status)]}"
              >
              </span>
              <a-tooltip>
                <template slot="title">
                  {{ info.event.title }}
                </template>
                <label for="">{{ info.event.title }} </label>
              </a-tooltip>
            </div>
          </template>
        </FullCalendar>
      </div>
    </a-spin>
    <div class="tooltip" v-clickOutside="closeTip">
      <div class="tooltip-wrap" ref="tooltip">
        <div class="tooltip-content">
          <div class="content-item" @click="handleAddUnit"><span>Add Unit</span></div>
          <div class="content-item" @click="handleAddSession"><span>Add Session</span></div>
        </div>
      </div>
    </div>
    <a-modal
      v-model='importVisible'
      :closable='true'
      :footer='null'
      :maskClosable='true'
      destroyOnClose
      width='1000px'
      @cancel='handleCloseImport'>
      <content-select
        :type="importType"
        :title="importTitle"
        @choose="handleChoose"
      />
    </a-modal>
  </div>
</template>

<script>

import { UserModeMixin } from '@/mixins/UserModeMixin'
import { CurrentSchoolMixin } from '@/mixins/CurrentSchoolMixin'

import '@fullcalendar/core/vdom' // solves problem with Vite
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ContentSelect from '@/components/MyContentV2/ContentSelect'

import { getClassSchedule } from '@/api/selfStudy'

import { ABSENT_COLORS, BG_COLORS, TASK_ATTENDANCE } from '@/const/common'
import { typeMap } from '@/const/teacher'

import { mapState } from 'vuex'

import moment from 'moment'

export default {
  name: 'Calendar',
  mixins: [UserModeMixin, CurrentSchoolMixin],
  components: {
    FullCalendar,
    ContentSelect
  },
  data() {
    return {
      ABSENT_COLORS: ABSENT_COLORS,
      BG_COLORS: BG_COLORS,
      typeMap: typeMap,
      currentClassList: [{
        id: '1'
      }],
      attendanceVisible: false,
      loading: false,
      startDate: '',
      endDate: '',
      viewType: 'dayGridMonth',
      classSchedules: [],
      allEvents: [],
      // fullcalendar
      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin, timeGridPlugin ],
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next,today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        // initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
        events: (date, successCb, failCb) => {
          const start = moment(date.start).format('YYYY-MM-DD')
          const end = moment(date.end).format('YYYY-MM-DD')
          this.loading = true
          if (this.$refs.fullCalendar) {
            const calendarApi = this.$refs.fullCalendar.getApi()
            calendarApi && calendarApi.removeAllEvents()
          }
          getClassSchedule({
            dateStart: start,
            dateEnd: end
          }).then(res => {
            if (res.success && res.result) {
              res = {
                'success': true,
                'message': 'Successful operation！',
                'code': 0,
                'result': [
                  {
                    'id': '1473122342068105218',
                    'name': '弱提醒测试用task2',
                    'image': 'https://dcdkqlzgpl5ba.cloudfront.net/ppt/20220304/uaUFbGWhyI1zelbT4kJZJh5di3YDiJcZ-1psiAI2Q9OfCPlYUfHNGRo3WMUAdyJk0ISYVSFe-5swvKqZ5EGmsqKPPM0ASRAVVdfYkRzkfOXc4QSpKu265I3C0s9276Eq4xnNUvrVYSAl_SOY0E6WYia9TI3-DpV1Vamq1XrxC418wR1EZ5-coZ9PQkZNYjnOXU3QdbO4z0UcLvHqnnbeqYbTmk32IWML5AgM9H1v-A=s800',
                    'audioUrl': null,
                    'taskType': 'SA',
                    'overview': '这个task用来测试弱提醒 trump',
                    'presentationId': '1RJezmonFwzN5L4m1szhkaRW1gKJBUYu2tTpeqUVJmME',
                    'revisionId': 'tEZxPT8W6_mzrw',
                    'pageObjectIds': 'SLIDES_API574226365_0,SLIDES_API574226365_361,SLIDES_API574226365_717,SLIDES_API574226365_1079',
                    'status': 1,
                    'delFlag': 0,
                    'createBy': 'karenwanghust@gmail.com',
                    'createTime': '2021-12-21 02:45:10',
                    'updateBy': 'karenwanghust@gmail.com',
                    'updateTime': '2022-03-07 05:32:14',
                    'sourceFrom': null,
                    'similarity': null,
                    'bloomCategories': null,
                    'curriculumId': '8',
                    'templateId': null,
                    'copyFromSlide': null,
                    'showSelected': false,
                    'gradeId': '3',
                    'startDate': '2022-03-07 05:31:20',
                    'endDate': '2022-04-25 05:31:20',
                    'hasUploadImage': false,
                    'fileDeleted': false,
                    'materials': '',
                    'taskMode': 1,
                    'customFieldData': '{"1499605683533328386":"","1499605683529134081":"","1498594754869415938":"","1499598237435768834":""}',
                    'sessionId': 'pcaL9',
                    'classId': '1',
                    'attendance': 'absent'
                  },
                  {
                    'id': '1490115234196172801',
                    'name': '测试学生端',
                    'image': 'https://dcdkqlzgpl5ba.cloudfront.net/ppt/20220417/MNNzz4BMyhibaJvZhhuU3MVnaJL3RDdaiHwqOgVYe9OddfJGOiQ13Ku50BoI0eq8OwHp9IY6AMcJNsniVEYDJN54QeKxvHVyQyUNzNFx0D6vzZecPT623nlZBxYDRelMWRoUNHodq5jS-KE70SZXFxwn3KJEMdwwqITYkWCIJiaBGYC9RSpJyHBjK19EA0NPYqtf0Isg2U5iueQkn1jHb7bnTN8L63JlAgNTPfCG=s800',
                    'audioUrl': null,
                    'taskType': 'SA',
                    'overview': null,
                    'presentationId': '1PJ5zBhp5IL8etcoRSFKi97s4tpJFuUsOqEkaG697zJc',
                    'revisionId': 'ejJYRTlqRABh3A',
                    'pageObjectIds': 'SLIDES_API1146886155_0,SLIDES_API337542663_0,SLIDES_API833310197_0,SLIDES_API205669576_0,SLIDES_API903554661_0,SLIDES_API787275567_0,SLIDES_API424080037_0,SLIDES_API219914360_0,SLIDES_API1200154017_0,SLIDES_API1340087829_0,SLIDES_API168074431_0,SLIDES_API2060905546_0,SLIDES_API1314436168_0,SLIDES_API384745045_0,SLIDES_API1611987201_0,SLIDES_API868930287_0,SLIDES_API457984971_0,SLIDES_API457984971_52,SLIDES_API968102328_0,SLIDES_API1657352709_0,SLIDES_API609643253_0,SLIDES_API722997025_0',
                    'status': 1,
                    'delFlag': 0,
                    'createBy': 'karenwanghust@gmail.com',
                    'createTime': '2022-02-06 00:08:51',
                    'updateBy': 'appleshennz@gmail.com',
                    'updateTime': '2022-04-17 04:36:30',
                    'sourceFrom': null,
                    'similarity': null,
                    'bloomCategories': null,
                    'curriculumId': '2',
                    'templateId': null,
                    'copyFromSlide': null,
                    'showSelected': false,
                    'gradeId': '1',
                    'startDate': '2022-03-23 00:51:19',
                    'endDate': '2022-03-24 00:51:19',
                    'hasUploadImage': false,
                    'fileDeleted': false,
                    'materials': '[{}]',
                    'taskMode': 1,
                    'customFieldData': '{"1499605683533328386":"","1499605683529134081":"","1498594754869415938":"","1499598237435768834":""}',
                    'sessionId': null,
                    'classId': '1',
                    'attendance': null
                  },
                  {
                    'id': '1490875866134687745',
                    'name': 'copy of 测试课堂评估task',
                    'image': 'https://dcdkqlzgpl5ba.cloudfront.net/ppt/20220224/fZuDNF5MKgkDlydmrnWc8Xb26CDfGazlU0rnJ6BZ27o-w4G0u7OQGyioiouxIB2WUlQDh_cMr7Obf9Ip-fvedUqpyKmx45n0VdPIzl1bjqUc-jip9wKnt1LQpIm0GdjWFIPrLjPWeGI26CmKod-H6HDh1WFoJQbGfs81MiO7sfjcUfna6eA214P2Mqq_g81q2Pefb8RW38wX_bQ0AQyHjT5oyPpwwJzajs9Reg=s800',
                    'audioUrl': null,
                    'taskType': 'FA',
                    'overview': 'Will it be a happy new year? Depends who you are talking to',
                    'presentationId': '1QADueLJ8JtTo_Y-URPlhB8m4-_BpQaVzcCzLPJ_UvrA',
                    'revisionId': 'VjhOMqDpMTeT0w',
                    'pageObjectIds': 'g10cdc144e5a_0_1,g115d16deb53_1_0,SLIDES_API110223177_0,g10cdc144e5a_0_6,g10f6c2be912_0_0,g10f6c2be912_0_6,g10f6c2be94a_0_12,g10f6c2be94a_0_7,g10f6c2be94a_0_1,g10f6c2be94a_0_19',
                    'status': 0,
                    'delFlag': 0,
                    'createBy': 'nangezgp@gmail.com',
                    'createTime': '2022-02-08 02:31:20',
                    'updateBy': 'nangezgp@gmail.com',
                    'updateTime': '2022-03-19 12:16:40',
                    'sourceFrom': null,
                    'similarity': null,
                    'bloomCategories': null,
                    'curriculumId': '1',
                    'templateId': null,
                    'copyFromSlide': '1wkckOkSCBswDT_d6zh_IYloejyBUeqOmW6iEelu7900',
                    'showSelected': true,
                    'gradeId': '2',
                    'startDate': '2022-03-01 09:26:09',
                    'endDate': '2022-03-14 09:26:09',
                    'hasUploadImage': false,
                    'fileDeleted': false,
                    'materials': '[{"link":"http://localhost:8000/teacher/add-task/1480399515002941441","name":"teacher"},{"link":"https://www.notion.so/3ae09feb567b45688130ea2282627f37?v=8b82714544c74096998bc964003634e0","name":"notion"}]',
                    'taskMode': 1,
                    'customFieldData': null,
                    'sessionId': 'tPlFu',
                    'classId': '1483625815024373761',
                    'attendance': 'absent'
                  },
                  {
                    'id': '1495409942376034306',
                    'name': 'Text response',
                    'image': 'https://dcdkqlzgpl5ba.cloudfront.net/ppt/20220209/8ErQ-UxdxNk2BAK8uT6-4PXgvIC1-3OShKboh1PILAVGCjLv4iNprKRO4vybD-ICcGCu3yGyOCP8j2l5UYOa769Gwha0Xi13FbSC1baw-059-wrulgi5CPHMWgjNsIHWZyiLz9c1jcMlcYkr5DiKi-W2L6t789-e-tJ9ZO6XGOCg1UYVPWmuTO2_BkVyqeR0PJt8DGdCD0vWeuZABSPz4foDiuiY4sN8ziK4Ndd2=s800',
                    'audioUrl': null,
                    'taskType': 'FA',
                    'overview': null,
                    'presentationId': 'fake_quick_ou5hl4dhwsbrz7utuc88aw4xoyo43uux',
                    'revisionId': '3',
                    'pageObjectIds': 'p1',
                    'status': 0,
                    'delFlag': 0,
                    'createBy': 'nangezgp@gmail.com',
                    'createTime': '2022-02-20 14:48:08',
                    'updateBy': 'nangezgp@gmail.com',
                    'updateTime': '2022-03-28 04:54:17',
                    'sourceFrom': null,
                    'similarity': null,
                    'bloomCategories': null,
                    'curriculumId': '1',
                    'templateId': null,
                    'copyFromSlide': '1Fc-3rXenvpUgdVFyVrPh6TmfUf0OIqfizy2B79c3T0k',
                    'showSelected': false,
                    'gradeId': '1464056798575169537',
                    'startDate': '2022-03-24 11:51:30',
                    'endDate': '2022-03-31 11:51:30',
                    'hasUploadImage': false,
                    'fileDeleted': true,
                    'materials': '',
                    'taskMode': 2,
                    'customFieldData': null,
                    'sessionId': 'ZsOq8',
                    'classId': '1483625815024373761',
                    'attendance': 'absent'
                  },
                  {
                    'id': '1497069823638188034',
                    'name': 'Text response',
                    'image': 'https://dcdkqlzgpl5ba.cloudfront.net/ppt/20220209/RbUAkleregQbuOv5LK5IIPC5K2KCF9o-ULXvRiwLrn44C9mai0jk4EdK_NP1mHPQfaXOeOw8BOdp61u3ksp1q826gUEKvWp7teX8ubXI3TUA_RhROczTjobk0yecgWRLrajno-UK-RAQjrhN59j_4kosWIN5efFILboZEsk1lO7XWq5Q0BDkQHObvrdfgjTh7dFLvz7bgrxg6DMruBTnh4Ii4HVgwrqvm0Uy_MWzZw=s800',
                    'audioUrl': null,
                    'taskType': 'FA',
                    'overview': null,
                    'presentationId': 'fake_quick_5027q0ds3sa4eq29mo2zs9gqymkcf9xx',
                    'revisionId': '2',
                    'pageObjectIds': 'p1',
                    'status': 0,
                    'delFlag': 0,
                    'createBy': 'karenwanghust@gmail.com',
                    'createTime': '2022-02-25 04:43:55',
                    'updateBy': 'karenwanghust@gmail.com',
                    'updateTime': '2022-03-14 23:52:19',
                    'sourceFrom': null,
                    'similarity': null,
                    'bloomCategories': null,
                    'curriculumId': '1',
                    'templateId': null,
                    'copyFromSlide': '1CyE9JPHy_feCZcL7X6WymryzkyFfTplikxBSAakf238',
                    'showSelected': false,
                    'gradeId': '1',
                    'startDate': '2022-03-14 23:52:02',
                    'endDate': '2022-03-15 23:52:02',
                    'hasUploadImage': false,
                    'fileDeleted': true,
                    'materials': '',
                    'taskMode': 2,
                    'customFieldData': null,
                    'sessionId': 'B1U2A',
                    'classId': '1493035097415823362',
                    'attendance': 'absent'
                  },
                  {
                    'id': '1502559143350317058',
                    'name': 'math',
                    'image': 'https://dcdkqlzgpl5ba.cloudfront.net/ppt/20220209/8ErQ-UxdxNk2BAK8uT6-4PXgvIC1-3OShKboh1PILAVGCjLv4iNprKRO4vybD-ICcGCu3yGyOCP8j2l5UYOa769Gwha0Xi13FbSC1baw-059-wrulgi5CPHMWgjNsIHWZyiLz9c1jcMlcYkr5DiKi-W2L6t789-e-tJ9ZO6XGOCg1UYVPWmuTO2_BkVyqeR0PJt8DGdCD0vWeuZABSPz4foDiuiY4sN8ziK4Ndd2=s800',
                    'audioUrl': null,
                    'taskType': 'FA',
                    'overview': 'testset',
                    'presentationId': 'fake_quick_d7741jqkgqymxgbllrtix2iih215pl5b',
                    'revisionId': '1',
                    'pageObjectIds': 'p1',
                    'status': 0,
                    'delFlag': 0,
                    'createBy': 'luorixin1@gmail.com',
                    'createTime': '2022-03-12 08:16:31',
                    'updateBy': 'luorixin1@gmail.com',
                    'updateTime': '2022-03-31 23:18:27',
                    'sourceFrom': null,
                    'similarity': null,
                    'bloomCategories': null,
                    'curriculumId': '1',
                    'templateId': null,
                    'copyFromSlide': '1Fc-3rXenvpUgdVFyVrPh6TmfUf0OIqfizy2B79c3T0k',
                    'showSelected': false,
                    'gradeId': '3',
                    'startDate': '2022-03-15 08:44:26',
                    'endDate': '2022-03-16 08:44:26',
                    'hasUploadImage': false,
                    'fileDeleted': true,
                    'materials': '',
                    'taskMode': 2,
                    'customFieldData': '{}',
                    'sessionId': 'NwssK',
                    'classId': '1502492152434339842',
                    'attendance': 'absent'
                  },
                  {
                    'id': '1502559435009634306',
                    'name': 'sience',
                    'image': 'https://dcdkqlzgpl5ba.cloudfront.net/ppt/20220209/RbUAkleregQbuOv5LK5IIPC5K2KCF9o-ULXvRiwLrn44C9mai0jk4EdK_NP1mHPQfaXOeOw8BOdp61u3ksp1q826gUEKvWp7teX8ubXI3TUA_RhROczTjobk0yecgWRLrajno-UK-RAQjrhN59j_4kosWIN5efFILboZEsk1lO7XWq5Q0BDkQHObvrdfgjTh7dFLvz7bgrxg6DMruBTnh4Ii4HVgwrqvm0Uy_MWzZw=s800',
                    'audioUrl': null,
                    'taskType': 'FA',
                    'overview': 'jsdfds',
                    'presentationId': 'fake_quick_e1ictwsckxksfwnjqhbp3nagycfq7a32',
                    'revisionId': '1',
                    'pageObjectIds': 'p1',
                    'status': 0,
                    'delFlag': 0,
                    'createBy': 'luorixin1@gmail.com',
                    'createTime': '2022-03-12 08:17:40',
                    'updateBy': 'luorixin1@gmail.com',
                    'updateTime': '2022-03-31 23:18:37',
                    'sourceFrom': null,
                    'similarity': null,
                    'bloomCategories': null,
                    'curriculumId': '1',
                    'templateId': null,
                    'copyFromSlide': '1CyE9JPHy_feCZcL7X6WymryzkyFfTplikxBSAakf238',
                    'showSelected': false,
                    'gradeId': '3',
                    'startDate': '2022-03-14 08:41:33',
                    'endDate': '2022-03-14 11:41:33',
                    'hasUploadImage': false,
                    'fileDeleted': true,
                    'materials': '',
                    'taskMode': 2,
                    'customFieldData': '{}',
                    'sessionId': 'kRwIN',
                    'classId': '1502492152434339842',
                    'attendance': 'absent'
                  },
                  {
                    'id': '1502562058173493249',
                    'name': 'sience',
                    'image': 'https://dcdkqlzgpl5ba.cloudfront.net/file/202111271330492511-Welcome_slide.png',
                    'audioUrl': null,
                    'taskType': 'FA',
                    'overview': 'Schedule a session for this clas',
                    'presentationId': null,
                    'revisionId': null,
                    'pageObjectIds': null,
                    'status': 0,
                    'delFlag': 0,
                    'createBy': 'luorixin1@gmail.com',
                    'createTime': '2022-03-12 08:28:06',
                    'updateBy': 'luorixin1@gmail.com',
                    'updateTime': '2022-04-05 03:34:42',
                    'sourceFrom': null,
                    'similarity': null,
                    'bloomCategories': null,
                    'curriculumId': '1',
                    'templateId': null,
                    'copyFromSlide': null,
                    'showSelected': false,
                    'gradeId': '3',
                    'startDate': '2022-03-14 00:12:24',
                    'endDate': '2022-03-16 00:12:24',
                    'hasUploadImage': false,
                    'fileDeleted': false,
                    'materials': '',
                    'taskMode': 2,
                    'customFieldData': null,
                    'sessionId': null,
                    'classId': '1502483685900365825',
                    'attendance': null
                  },
                  {
                    'id': '1502624424437297153',
                    'name': 'test split task',
                    'image': 'https://dcdkqlzgpl5ba.cloudfront.net/ppt/20220315/6AJ8woAcFESWgbKqpRrl980GqgMre3pLL6p13g-j2r8hEWA2jE1auqfrs_XUlyRwefDSFSx-fcdXu7dAkGTSS0sRVBX1ud002NojkzqFtTdExmwuLCierCHMf72If7Lx7o7taA_IpafYaeV0VCkYLAtFDc0V2BVAw7pEj9W-lzChcgl7eqkiq90xqaO3YQrvyQCUheUpvWOG8lXg85mnlDnrRqzjqDGVFeoiSgITeA=s800',
                    'audioUrl': null,
                    'taskType': 'FA',
                    'overview': null,
                    'presentationId': '1xpy5LOgwd_Ac68-vD6UJ0QqBVRlXqzEiDs2GB1e3ZTY',
                    'revisionId': 'QZpt_atxB4mnYQ',
                    'pageObjectIds': 'g106c1788ee5_0_0,SLIDES_API889725972_0,g10a52c782d4_3_0,SLIDES_API1265143581_0',
                    'status': 0,
                    'delFlag': 0,
                    'createBy': 'nangezgp@gmail.com',
                    'createTime': '2022-03-12 12:35:55',
                    'updateBy': 'nangezgp@gmail.com',
                    'updateTime': '2022-03-15 13:25:51',
                    'sourceFrom': null,
                    'similarity': null,
                    'bloomCategories': null,
                    'curriculumId': '5',
                    'templateId': null,
                    'copyFromSlide': '1Z7ZmfmkO4ip9pOX_uOGwLy9wtlaXC5eBXQYFsiaJmTk',
                    'showSelected': false,
                    'gradeId': '2',
                    'startDate': '2022-03-09 12:36:10',
                    'endDate': '2022-04-28 12:36:10',
                    'hasUploadImage': false,
                    'fileDeleted': false,
                    'materials': '',
                    'taskMode': 1,
                    'customFieldData': null,
                    'sessionId': 'nYsTY',
                    'classId': '1483625815024373761',
                    'attendance': 'absent'
                  },
                  {
                    'id': '1503519487786823681',
                    'name': '15日测试学生端',
                    'image': 'https://dcdkqlzgpl5ba.cloudfront.net/1393741943869063170/ppt/20220423/BVkcOYxLmqtCY_A0bc16h_EPtDsPwp8Oph78qnj22_MypuivR11IPdX0DhMp9SHBuU786lL8YdhNM0SuO6KM2YFgOAnSG6q5bqlnbuLz-bRZSqlhU28OH7S_GfgFH2YajfeedOdV5hXht2UrGz6tV4qRkoVEpFk4RvrBJrfgR5XbQWc9Dl_-dMi1xLBW5fEx_qty6yzcAK6hEzCSU6OQd0qe8cpc7FzfkVpMwSrQGQ=s800',
                    'audioUrl': null,
                    'taskType': 'FA',
                    'overview': null,
                    'presentationId': '1-U123guwuTWAUlv5qn7T-jUXsn7n2SUwcq2lbeUpmsc',
                    'revisionId': '0u5DdeSNiSqyTA',
                    'pageObjectIds': 'g102c658cc05_3_3',
                    'status': 0,
                    'delFlag': 0,
                    'createBy': 'karenwanghust@gmail.com',
                    'createTime': '2022-03-14 23:52:35',
                    'updateBy': 'karenwanghust@gmail.com',
                    'updateTime': '2022-05-23 02:48:19',
                    'sourceFrom': null,
                    'similarity': null,
                    'bloomCategories': null,
                    'curriculumId': '5',
                    'templateId': null,
                    'copyFromSlide': null,
                    'showSelected': false,
                    'gradeId': '1',
                    'startDate': '2022-03-14 23:52:35',
                    'endDate': '2022-03-15 23:52:35',
                    'hasUploadImage': false,
                    'fileDeleted': false,
                    'materials': '',
                    'taskMode': 1,
                    'customFieldData': '{}',
                    'sessionId': 'KSh9B',
                    'classId': '1493035097415823362',
                    'attendance': 'absent'
                  },
                  {
                    'id': '1506439937567813634',
                    'name': 'copy of 祁迪的lesson test copy',
                    'image': 'https://dcdkqlzgpl5ba.cloudfront.net/ppt/20220224/VXbZ-fwEu0agXJW6EuIDfF0ItthAEu2Supue4xxBmDVS8YMPXCjNFvcch9zaKzeq3zzcYwbwvWnNv0d2bO7u4TPcVytVSDXE8UMAAJfy7dnKzZah558MhZxqxvNvagGipWPGreyRd_Kfk9X3poTw3WV9hOCmGONTzzYAoEpZsIikUETmqPv0bafVQCPJVb9K_D12S_Jqzk619oJJPYoiIgQCG1FwlCfPNDkUJe9IRA=s800',
                    'audioUrl': null,
                    'taskType': 'FA',
                    'overview': null,
                    'presentationId': 'fake_zymutpms2ldq4dxp97linfsxq36wywjq',
                    'revisionId': 'Dg5e5wN7eJOopA',
                    'pageObjectIds': 'gf3118d2c62_0_0,SLIDES_API1068190746_0,SLIDES_API1068190746_49,SLIDES_API1068190746_98,SLIDES_API1068190746_148,SLIDES_API1068190746_199,SLIDES_API1068190746_250,SLIDES_API1068190746_299,SLIDES_API1068190746_349,SLIDES_API1068190746_399,SLIDES_API1068190746_448,SLIDES_API1068190746_499,SLIDES_API1068190746_549,SLIDES_API1068190746_598,SLIDES_API1068190746_649,SLIDES_API1068190746_700,SLIDES_API1068190746_750,SLIDES_API1068190746_799,SLIDES_API468714021_0,SLIDES_API468714021_50,SLIDES_API468714021_100,SLIDES_API468714021_150,SLIDES_API468714021_200,SLIDES_API468714021_250,SLIDES_API468714021_302,SLIDES_API468714021_351,SLIDES_API468714021_401,SLIDES_API1889756935_0,SLIDES_API1889756935_49,SLIDES_API1889756935_100,SLIDES_API1889756935_152,SLIDES_API1889756935_204,SLIDES_API1889756935_255,SLIDES_API1889756935_304,SLIDES_API1889756935_354,SLIDES_API1889756935_404,SLIDES_API1889756935_453,SLIDES_API1889756935_504,SLIDES_API1889756935_554,SLIDES_API1889756935_603,SLIDES_API1889756935_654,SLIDES_API1889756935_705,SLIDES_API1889756935_755,SLIDES_API1889756935_804,gf523268de2_0_0,gf58481f9af_3_0,gf523268de2_0_10,gf523268de2_0_5',
                    'status': 0,
                    'delFlag': 0,
                    'createBy': 'luorixin1@gmail.com',
                    'createTime': '2022-03-23 01:17:24',
                    'updateBy': 'luorixin1@gmail.com',
                    'updateTime': '2022-03-31 23:17:52',
                    'sourceFrom': '1448673882812772356',
                    'similarity': null,
                    'bloomCategories': null,
                    'curriculumId': '1',
                    'templateId': null,
                    'copyFromSlide': '1Jt7ig3DuVoHrunl6VlyOAXTz2nV_G6wxDmOmdwTCJ-Q',
                    'showSelected': false,
                    'gradeId': null,
                    'startDate': '2022-04-04 23:17:43',
                    'endDate': '2022-04-06 23:17:43',
                    'hasUploadImage': false,
                    'fileDeleted': true,
                    'materials': '',
                    'taskMode': 1,
                    'customFieldData': null,
                    'sessionId': null,
                    'classId': '1502483685900365825',
                    'attendance': null
                  },
                  {
                    'id': '1506801453215313921',
                    'name': 'copy of 祁迪的lesson test copy',
                    'image': 'https://dcdkqlzgpl5ba.cloudfront.net/ppt/20220224/VXbZ-fwEu0agXJW6EuIDfF0ItthAEu2Supue4xxBmDVS8YMPXCjNFvcch9zaKzeq3zzcYwbwvWnNv0d2bO7u4TPcVytVSDXE8UMAAJfy7dnKzZah558MhZxqxvNvagGipWPGreyRd_Kfk9X3poTw3WV9hOCmGONTzzYAoEpZsIikUETmqPv0bafVQCPJVb9K_D12S_Jqzk619oJJPYoiIgQCG1FwlCfPNDkUJe9IRA=s800',
                    'audioUrl': null,
                    'taskType': 'FA',
                    'overview': null,
                    'presentationId': 'fake_1rcm8owh3odve90486kl8gy15xrr8vw3',
                    'revisionId': 'Dg5e5wN7eJOopA',
                    'pageObjectIds': 'gf3118d2c62_0_0,SLIDES_API1068190746_0,SLIDES_API1068190746_49,SLIDES_API1068190746_98,SLIDES_API1068190746_148,SLIDES_API1068190746_199,SLIDES_API1068190746_250,SLIDES_API1068190746_299,SLIDES_API1068190746_349,SLIDES_API1068190746_399,SLIDES_API1068190746_448,SLIDES_API1068190746_499,SLIDES_API1068190746_549,SLIDES_API1068190746_598,SLIDES_API1068190746_649,SLIDES_API1068190746_700,SLIDES_API1068190746_750,SLIDES_API1068190746_799,SLIDES_API468714021_0,SLIDES_API468714021_50,SLIDES_API468714021_100,SLIDES_API468714021_150,SLIDES_API468714021_200,SLIDES_API468714021_250,SLIDES_API468714021_302,SLIDES_API468714021_351,SLIDES_API468714021_401,SLIDES_API1889756935_0,SLIDES_API1889756935_49,SLIDES_API1889756935_100,SLIDES_API1889756935_152,SLIDES_API1889756935_204,SLIDES_API1889756935_255,SLIDES_API1889756935_304,SLIDES_API1889756935_354,SLIDES_API1889756935_404,SLIDES_API1889756935_453,SLIDES_API1889756935_504,SLIDES_API1889756935_554,SLIDES_API1889756935_603,SLIDES_API1889756935_654,SLIDES_API1889756935_705,SLIDES_API1889756935_755,SLIDES_API1889756935_804,gf523268de2_0_0,gf58481f9af_3_0,gf523268de2_0_10,gf523268de2_0_5',
                    'status': 0,
                    'delFlag': 0,
                    'createBy': 'luorixin1@gmail.com',
                    'createTime': '2022-03-24 01:13:56',
                    'updateBy': 'luorixin1@gmail.com',
                    'updateTime': '2022-03-31 23:18:08',
                    'sourceFrom': '1449188728721436673',
                    'similarity': null,
                    'bloomCategories': null,
                    'curriculumId': '1',
                    'templateId': null,
                    'copyFromSlide': '1Jt7ig3DuVoHrunl6VlyOAXTz2nV_G6wxDmOmdwTCJ-Q',
                    'showSelected': false,
                    'gradeId': null,
                    'startDate': '2022-03-31 23:17:55',
                    'endDate': '2022-04-20 23:17:55',
                    'hasUploadImage': false,
                    'fileDeleted': true,
                    'materials': '',
                    'taskMode': 1,
                    'customFieldData': null,
                    'sessionId': null,
                    'classId': '1502492152434339842',
                    'attendance': null
                  },
                  {
                    'id': '1511265075215790082',
                    'name': 'test command',
                    'image': 'https://dcdkqlzgpl5ba.cloudfront.net/file/202111271330492511-Welcome_slide.png',
                    'audioUrl': null,
                    'taskType': 'FA',
                    'overview': 'test command term',
                    'presentationId': null,
                    'revisionId': null,
                    'pageObjectIds': null,
                    'status': 0,
                    'delFlag': 0,
                    'createBy': 'luorixin1@gmail.com',
                    'createTime': '2022-04-05 08:50:47',
                    'updateBy': 'luorixin1@gmail.com',
                    'updateTime': '2022-04-05 08:52:24',
                    'sourceFrom': null,
                    'similarity': null,
                    'bloomCategories': null,
                    'curriculumId': '1',
                    'templateId': null,
                    'copyFromSlide': null,
                    'showSelected': false,
                    'gradeId': null,
                    'startDate': '2022-04-05 08:50:48',
                    'endDate': '2022-04-07 08:50:48',
                    'hasUploadImage': false,
                    'fileDeleted': false,
                    'materials': '',
                    'taskMode': 2,
                    'customFieldData': null,
                    'sessionId': null,
                    'classId': '1502492152434339842',
                    'attendance': null
                  },
                  {
                    'id': '1511267039056031746',
                    'name': 'copy of copy of test',
                    'image': 'https://dcdkqlzgpl5ba.cloudfront.net/ppt/20220405/eiineMIPX4U5mK-ABTo7WtfbjDRceYb6NQIVo9l5rrFZrOaqzVOUE8JW9pX-xrlBZsaGRcGmDeP4IkrYY21I36w8qF9IR7-fn4owuMBRVWgVJ1r8uxhDmQnc5InM3_eWRkOvlULEuOfBJSxpOjaKiXMngIEEcjkjCK-9jltEo7sZZ_Y_vYfdDgAO8qcOTqDCt0EVK7mAwsVcfQxIE8DvOyn2uqZyRcO3W0Oi2c5jPw=s800',
                    'audioUrl': null,
                    'taskType': 'FA',
                    'overview': 'test commandterm',
                    'presentationId': '1oQerRn1DFqSvhAnUPAjTFB8NkSkBk6V_rOP3HadMYco',
                    'revisionId': 'yK3JoukPaHvL3Q',
                    'pageObjectIds': 'SLIDES_API1147739953_0,SLIDES_API869019241_0,SLIDES_API560933389_0,SLIDES_API1213123692_0,SLIDES_API1531787158_0,SLIDES_API1472995235_0,SLIDES_API436703922_0,SLIDES_API1270323513_0',
                    'status': 0,
                    'delFlag': 0,
                    'createBy': 'luorixin1@gmail.com',
                    'createTime': '2022-04-05 08:58:35',
                    'updateBy': 'luorixin1@gmail.com',
                    'updateTime': '2022-04-07 23:28:10',
                    'sourceFrom': '1506641694944194562',
                    'similarity': null,
                    'bloomCategories': null,
                    'curriculumId': '1',
                    'templateId': null,
                    'copyFromSlide': '1fL0K0Ssj5PhPuOM7KZsNGjAJMUW2etSZOkp7XS0czk0',
                    'showSelected': false,
                    'gradeId': '7',
                    'startDate': '2022-04-08 09:19:20',
                    'endDate': '2022-04-09 09:19:20',
                    'hasUploadImage': false,
                    'fileDeleted': false,
                    'materials': '',
                    'taskMode': 1,
                    'customFieldData': null,
                    'sessionId': null,
                    'classId': '1502483685900365825',
                    'attendance': null
                  }
                ],
                'timestamp': 1653374615060
              }
              const events = res.result.map(item => {
                // 根据classId获取颜色
                const index = Math.floor(Math.random() * 10) // this.currentClassList.findIndex(clasz => clasz.id === item.classId)
                const color = BG_COLORS[index]

                return {
                  id: item.id,
                  title: item.name,
                  start: item.startDate,
                  end: item.endDate,
                  // backgroundColor: 'transparent',
                  // borderColor: 'transparent',
                  extendedProps: {
                    classId: item.classId,
                    status: item.attendance || 'absent',
                    backgroundColor: color
                  }
                }
              })
              this.classSchedules = res.result
              this.allEvents = events
              const filterEvents = events.filter(event => {
                // const props = event.extendedProps
                return true
              })
              successCb(filterEvents)
            } else {
              failCb()
            }
          }).catch(() => {
            failCb()
          }).finally(() => {
            this.loading = false
          })
        },
        editable: true,
        selectable: true,
        selectMirror: true,
        dayMaxEvents: true,
        weekends: true,
        select: this.handleDateSelect,
        eventClick: this.handleEventClick,
        eventsSet: this.handleEvents,
        datesSet: this.handleDatesSet,
        eventMouseEnter: this.handleMouseEnter,
        eventMouseLeave: this.handleMouseLeave,
        eventTimeFormat: {
          hour: 'numeric',
          minute: '2-digit',
          meridiem: 'short'
        }
      },
      currentEvents: [],
      // pie chart
      labelConfig: [],
      // radius: {
      //   radius: 0.85,
      //   innerRadius: 0.8
      // },
      radius: ['60%', '80%'],
      currentClass: 1,
      event: {
        title: 'My Event'
      },
      timer: null,
      FORMATTER: 'h:mm a',
      FORMATTER_SIM: 'h:mma',
      FORMATTER_FULL: 'YYYY-MM-DD h:mm a',

      showClass: [],
      showStatus: [],
      showStatusOptions: [],

      importVisible: false,
      importType: typeMap.task
    }
  },
  computed: {
    ...mapState({
      currentSchool: state => state.user.currentSchool
    }),
    showClassOptions() {
      return this.currentClassList.map((item, index) => {
        return {
          value: item.id,
          name: item.name,
          index: index
        }
      })
    },
    importTitle() {
      let title = 'Select Task content'
      switch (this.importType) {
        case typeMap.task:
          title = 'Select Task content'
          break
        case typeMap['unit-plan']:
          title = 'Select Unit content'
          break
        default:
          break
      }
      return title
    }
  },
  created() {
    this.initData()
  },
  mounted() {
    setTimeout(() => {
      this.reRender()
    }, 100)
  },
  methods: {
    initData() {
      this.currentClass = this.currentClassList.length > 0 ? this.currentClassList[0].id : ''
      this.showClass = this.currentClassList.map(item => item.id)
      this.showStatus = Object.values(TASK_ATTENDANCE)
      this.showStatusOptions = Object.keys(TASK_ATTENDANCE).map((key, index) => {
        return {
          value: TASK_ATTENDANCE[key],
          name: key.slice(0, 1).toUpperCase() + key.slice(1).toLowerCase(),
          index: index
        }
      })
    },
    handleSchoolChange(school) {
      // this.triggerSearch()
      this.initData()
      setTimeout(() => {
        this.reFetch()
      }, 100)
    },
    handleWeekendsToggle() {
      this.calendarOptions.weekends = !this.calendarOptions.weekends // update a property
    },
    handleDateSelect(selectInfo) {
      console.log(selectInfo)
      this.$refs.tooltip.style.visibility = 'visible'
      this.$refs.tooltip.style.top = selectInfo.jsEvent.clientY + 'px'
      this.$refs.tooltip.style.left = selectInfo.jsEvent.clientX + 'px'
      this.event = selectInfo
      // const title = prompt('Please enter a new title for your event')
      // const calendarApi = selectInfo.view.calendar
      // calendarApi.unselect() // clear date selection
      // if (title) {
      //   calendarApi.addEvent({
      //     id: new Date().getTime(),
      //     title,
      //     start: selectInfo.startStr,
      //     end: selectInfo.endStr,
      //     allDay: selectInfo.allDay
      //   })
      // }
    },
    closeTip() {
      this.$refs.tooltip.style.visibility = 'hidden'
    },
    handleAddUnit() {
      this.closeTip()
    },
    handleAddSession() {
      this.closeTip()
      this.importVisible = true
    },
    handleCloseImport() {
      this.importVisible = false
    },
    handleEventClick(clickInfo) {
      console.log(clickInfo)
      if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
        clickInfo.event.remove()
      }
    },
    handleEvents(events) {
      this.currentEvents = events
      console.log(events)
    },
    handleDatesSet(event) {
      this.startDate = moment(event.start).format('YYYY-MM-DD')
      this.endDate = moment(event.end).format('YYYY-MM-DD')
      this.viewType = event.view.type
    },
    handleMouseEnter(info) {

    },
    // handleMouseLeave(event) {
    //   if (this.timer) clearTimeout(this.timer)
    //   this.timer = setTimeout(() => {
    //     this.$refs.tooltip.style.visibility = 'hidden'
    //   }, 200)
    // },
    showAttendance() {
      this.attendanceVisible = !this.attendanceVisible
      this.reRender()
    },
    reRender() {
      this.$nextTick(() => {
        if (this.$refs.fullCalendar) {
          const calendarApi = this.$refs.fullCalendar.getApi()
          calendarApi && calendarApi.render()
        }
      })
    },
    reFetch() {
      this.$nextTick(() => {
        if (this.$refs.fullCalendar) {
          const calendarApi = this.$refs.fullCalendar.getApi()
          calendarApi && calendarApi.refetchEvents()
        }
      })
    },
    getCurrentEvents() {
      const dateStart = this.startDate
      let dateEnd = this.endDate
      if (this.viewType === 'timeGridDay') {
        dateEnd = dateStart
      }
      const currentEvents = this.classSchedules.filter(item => {
        return item.classId === this.currentClass && moment(dateEnd).diff(moment(item.startDate), 'days') >= 0
      })

      return currentEvents
    },
    getColorIndex(status) {
      return Object.values(TASK_ATTENDANCE).findIndex(item => item === status)
    },
    handleChoose(item) {
      console.log(item)
      this.importVisible = false
      this.$router.push({
        path: '/teacher/schedule-session/' + item.id + '/' + item.type,
        query: {
          startDate: moment(this.event.start).format('YYYY-MM-DD HH:mm:ss'),
          endDate: moment(this.event.end).format('YYYY-MM-DD HH:mm:ss')
        }
      })
    }
  }
}
</script>
<style lang='less'>
@import "~@/components/index.less";

.my-content {
  padding: 15px;
  background: #fff;
  height: 100%;
}
.schedule-event-content {
  padding: 2px;
  border-radius: 5px;
  width:100%;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow-y: auto;
  height: 100%;
  .event-content-dot {
    width: 8px;
    height: 8px;
    border-radius: 8px;
    display: inline-block;
    margin-right: 5px;
  }
}
</style>

<style lang='less' scoped>
.opt {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.attendance {
  // position: fixed;
  // left: 58px;
  // bottom: 20px;
  // z-index: 101;
  width: 200px;
  border: 1px solid #dfdfdf;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
  flex-direction: column;
  align-items: center;
  background: #fff;
  .attendance-choose {
    width: 150px;
    margin: 10px 25px;
  }
}
.tooltip {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  .tooltip-wrap {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    background: #fff;
    color: rgba(0,0,0,.65);
    font-size: 14px;
    font-variant: tabular-nums;
    line-height: 1.5;
    list-style: none;
    font-feature-settings: "tnum";
    position: fixed;
    z-index: 1060;
    max-width: 250px;
    visibility: hidden;
    transition: left .5s, top .5s;
    border: 1px solid #dfdf;
    .tooltip-content {
      padding: 4px 0;
      .content-item {
        padding: 5px 12px;
        color: rgba(0, 0, 0, 0.65);
        font-weight: normal;
        font-size: 14px;
        line-height: 22px;
        white-space: nowrap;
        cursor: pointer;
        // transition: all 0.3s;
        clear: both;
        margin: 0;
        span {
          font-family: Arial;
          font-weight: 400;
          color: #525252;
        }
        &:hover {
          color: #15c39a;
          background: #EDF1F5;
        }
      }
    }
  }
}
.schedule-content {
  position: relative;
  display: flex;
  .schedule-calendar {
    flex: 1;
    /deep/ .fc-view-harness {
      background: #fff;
    }
  }
  .schedule-tip {
    width: 200px;
    margin-left: 10px;
    display: flex;
    flex-direction: column;
    .class-tip {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      .tip-check {
        width: 100%;
      }
      .tip-content {
        height: 30px;
        line-height: 30px;
        display: inline-block;
        align-items: center;
        .tip-dot {
          display: inline-block;
          margin-right: 5px;
          width: 20px;
          height: 10px;
          // border-radius: 10px;
          &.dot-status {
            width: 10px;
            border-radius: 10px;
          }
        }
      }
    }
  }
}
</style>
