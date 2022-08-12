import { mapState } from 'vuex'

const deviceMixin = {
  computed: {
    ...mapState({
      isMobile: state => state.app.isMobile,
      device: state => state.app.device
    })
  }
}

export { deviceMixin }
