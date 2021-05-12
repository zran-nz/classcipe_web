import Finder from './Finder'

const LibraryModule = {
  Finder,

  install (Vue) {
    // Register components with vue
    Vue.component('Finder', Finder)
  }
}

// Export library
export default LibraryModule

// Export components
export { Finder }
