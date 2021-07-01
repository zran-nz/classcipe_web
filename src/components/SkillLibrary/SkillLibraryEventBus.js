import Vue from 'vue'
export const SkillLibraryEventBus = new Vue()

export const SkillLibraryEvent = {
  SkillContentListUpdate: 'SkillContentListUpdate',
  SkillContentListItemClick: 'SkillContentListItemClick',
  SkillContentListSelectClick: 'SkillContentListSelectClick',
  SkillContentListSelectedListUpdate: 'SkillContentListSelectedListUpdate'
}
