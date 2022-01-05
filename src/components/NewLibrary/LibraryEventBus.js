import Vue from 'vue'

export const LibraryEventBus = new Vue()

export const LibraryEvent = {
  ContentListUpdate: 'ContentListUpdate',
  ContentListItemClick: 'ContentListItemClick',
  ContentListSelectClick: 'ContentListSelectClick',
  ContentListSelectedListUpdate: 'ContentListSelectedListUpdate',
  GradeUpdate: 'GradeUpdate'
}
