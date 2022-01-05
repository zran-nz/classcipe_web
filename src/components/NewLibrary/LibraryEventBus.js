import Vue from 'vue'

export const LibraryEventBus = new Vue()

export const LibraryEvent = {
  ContentListUpdate: 'ContentListUpdate',
  ContentListItemClick: 'ContentListItemClick',
  ContentListSelectClick: 'ContentListSelectClick',
  ContentListSelectedListUpdate: 'ContentListSelectedListUpdate',
  GradeUpdate: 'GradeUpdate',
  CenturySkillsSelect: 'CenturySkillsSelect' // 选择21世纪技能grade后的任意层级事件处理
}
