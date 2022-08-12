import Vue from 'vue'

export const ClasscipeEventBus = new Vue()

export const ClasscipeEvent = {
  GOOGLE_AUTH_REFRESH: 'GOOGLE_AUTH_REFRESH',
  LIBRARY_IFRAME_EVENT: 'LIBRARY_IFRAME_EVENT'
}
