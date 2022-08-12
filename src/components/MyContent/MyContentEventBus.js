import Vue from 'vue'

export const MyContentEventBus = new Vue()

export const MyContentEvent = {
  LinkToMyContentItem: 'LinkToMyContentItem',
  ToggleSelectContentItem: 'ToggleSelectContentItem',
  ReferContentItem: 'ReferContentItem',
  ReloadMyContent: 'ReloadMyContent'
}
