import Vue from 'vue'

export const AddMaterialEventBus = new Vue()

export const ModalEventsTypeEnum = {
  TEXT: 'TEXT',
  VIDEO: 'VIDEO',
  AUDIO: 'AUDIO'
}

export const ModalEventsNameEnum = {
  ADD_NEW_MEDIA: 'ADD_NEW_MEDIA',
  DELETE_MEDIA_ELEMENT: 'DELETE_MEDIA_ELEMENT',
  ADD_MEDIA_FOR_TIP: 'ADD_MEDIA_FOR_TIP'
}
