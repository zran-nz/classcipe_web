import Vue from 'vue'

export const LibraryEventBus = new Vue()

export const LibraryEvent = {
  ChangeCurriculum: 'ChangeCurriculum',
  ResetContentList: 'ResetContentList',
  ContentListUpdate: 'ContentListUpdate',
  ContentListItemClick: 'ContentListItemClick',
  ContentListSelectClick: 'ContentListSelectClick',
  ContentListSelectedListUpdate: 'ContentListSelectedListUpdate',
  GradeUpdate: 'GradeUpdate',
  CenturySkillsSelect: 'CenturySkillsSelect', // 选择21世纪技能grade后的任意层级事件处理
  CancelCenturySkillsSelect: 'CancelCenturySkillsSelect' // 选择21世纪技能grade后的任意层级事件处理
}
