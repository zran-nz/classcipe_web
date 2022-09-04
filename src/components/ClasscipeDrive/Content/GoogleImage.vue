<template>
  <div class='google-image-container'>
    <div class='google-image-filter'>
      <a-space>
        <a-select
          :getPopupContainer="trigger => trigger.parentElement"
          v-model='image_type_value'
          class='cc-select-white-no-round'
          placeholder='Image type'
          @change='imageTypeChange'>
          <a-select-option v-for='item in imageTypes' :key='item.value' :value='item.value'>
            {{ item.label }}
          </a-select-option >
        </a-select>

        <div class='color-filter'>
          <div v-for='(item,index) in colors' :key='item' style='margin-right: 5px;' @click='changeColor(index)'>
            <div
              v-if="currentColor !== item && item !== '#FFFFFF'"
              :style='`background-color: ${item};`'
              class='color--unselect'>
            </div>
            <div
              v-if="currentColor !== item && item === '#FFFFFF'"
              :style='`background-color: ${item};`'
              class='color--unselect--white'>
            </div>
            <div v-if='currentColor === item' :style='`background-color: ${item};`' class='color--select'></div>
          </div>
        </div>
      </a-space>
    </div>
    <div>
      <span class='result-tips'>Results displayed have been modified for commercial use. </span>
      <span
        style='font-size: 14px;color:#15C39A;cursor: pointer;margin-left: 2px;'
        @click='showPrivate()'>See more</span>
    </div>

    <div id='search_parent'>
      <a-spin :spinning="loading">
        <div id='test'></div>
      </a-spin>
    </div>

    <div
      style='position: absolute; bottom: 10px; left: 10px;  font-size: 12px; color: #808191; height: 20px; background-color: #ffffff;'>
      Only use image that you have the right to post.
    </div>
  </div>
</template>

<script>
import ClasscipeDriveEvent from '@/components/ClasscipeDrive/ClasscipeDriveEvent'
import { uploadImageToAwsByUrl } from '@/components/AddMaterial/Utils/Common'

export default {
  name: 'GoogleImage',
  props: {
    field: {
      type: String,
      default: null
    },
    contentId: {
      type: String,
      default: null
    },
    contentType: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      loadiingType: 2,
      image_type_value: '',
      imageTypes: [{
        'value': '',
        'label': 'Any type'
      }, {
        'value': 'clipart',
        'label': 'Clip art'
      }, {
        'value': 'face',
        'label': 'Faces of people'
      }, {
        'value': 'lineart',
        'label': 'Line drawings'
      }, {
        'value': 'stock',
        'label': 'Stock photos'
      }, {
        'value': 'photo',
        'label': 'Photographs'
      }, {
        'value': 'animated',
        'label': 'Animated GIFs'
      }],
      colors: [
        '#FF8D87',
        '#676EF9',
        '#FF6B5B',
        '#FFCE00',
        '#D67A00',
        '#FF9300',
        '#D9D9D9',
        '#1AE4A8',
        '#00A4FC',
        '#010001',
        '#FFFFFF'
      ],
      colorStr: [
        'pink',
        'purple',
        'red',
        'yellow',
        'brown',
        'orange',
        'gray',
        'teal',
        'blue',
        'black',
        'white'
      ],
      currentColor: '#00FFFFFF',
      currentColorIndex: -1,
      lastSearchKey: '',
      firebaseObj: null,
      db: null,
      headerAuthToken: '',
      optSlideId: '',
      test11: null,
      divE: null
    }
  },
  created() {
    this.$logger.info(`GoogleImage field ${this.field} contentId ${this.contentId}`)
    this.loadGooleScript()
  },
  mounted() {
    this.initCallback()
  },
  beforeDestroy() {
    this.$logger.info('GoogleImage Destroy')
    window.__gcse = null
  },
  methods: {
    // 显示提示
    showPrivate() {
      window.open('https://support.google.com/drive/answer/179622?p=docs_image_search&hl=en&visit_id=637765802042272752-1731005835&rd=1')
    },
    imageTypeChange() {
      const _this = this
      this.lastSearchKey = this.test11.getInputQuery()
      document.getElementById('test').innerHTML = ''
      this.test11 = window.google.search.cse.element.render({
        div: 'test',
        attributes: {
          disableWebSearch: true,
          image_type: _this.image_type_value,
          enableHistory: false,
          image_as_rights: 'cc_publicdomain cc_noncommercial cc_nonderived cc_sharealike',
          image_as_filetype: 'jgp png bmp',
          image_dominantcolor: _this.currentColorIndex === -1 ? '' : _this.colorStr[_this.currentColorIndex]
        },
        tag: 'search'
      })
      this.test11.execute(this.lastSearchKey)
    },
    changeColor(index) {
      if (this.currentColorIndex === index) {
        this.currentColorIndex = -1
        this.currentColor = '#00FFFFFF'
      } else {
        this.currentColor = this.colors[index]
        this.currentColorIndex = index
      }
      const _this = this
      this.lastSearchKey = this.test11.getInputQuery()
      document.getElementById('test').innerHTML = ''
      this.test11 = window.google.search.cse.element.render({
        div: 'test',
        attributes: {
          disableWebSearch: true,
          image_type: _this.image_type_value,
          image_as_filetype: 'jgp png bmp', // jpg, gif, png, bmp, svg, webp, ico, raw.
          enableHistory: false,
          image_as_rights: 'cc_publicdomain cc_noncommercial cc_nonderived cc_sharealike',
          image_dominantcolor: _this.currentColorIndex === -1 ? '' : _this.colorStr[_this.currentColorIndex]
        },
        tag: 'search'
      })
      this.test11.execute(this.lastSearchKey)
    },
    select(url) {
      this.$logger.info('select google image', url, {
        contentId: this.contentId,
        contentType: this.contentType
      })
      this.image_type_value = ''
      this.currentColorIndex = -1
      this.currentColor = '#00FFFFFF'
      const hideLoading = this.$message.loading('Download...', 0)
      this.loading = true
      uploadImageToAwsByUrl(this.$store.getters.userInfo.id, url, {
        contentId: this.contentId,
        contentType: this.contentType
      })
        .then(url => {
          this.$logger.info('uploadImageToAwsByUrl', url)
          this.$EventBus.$emit(ClasscipeDriveEvent.INSERT_GOOGLE_IMAGE, {
            field: this.field,
            data: this.$classcipe.replaceToClasscipeCDN(url)
          })
        })
        .catch(e => {
          console.log(e)
          this.$logger.warn('uploadImageToAwsByUrl', e)
          this.$message.error('The image you selected is not available')
        }).finally(() => {
          hideLoading()
          this.loading = false
      })
    },

    initCallback() {
      const _this = this
      const makeTwoPartCallback = () => {
        let urls
        const readyCallback = (name, q, promos, results, resultsDiv) => {
          urls = []
          for (const result of results) {
            urls.push(result['image'])
          }
        }
        const renderedCallback = (name, q, promos, results) => {
          const removeEventListeners = element => {
            const clone = element.cloneNode(true)
            element.parentNode.replaceChild(clone, element)
            return clone
          }
          for (let i = 0; i < results.length; ++i) {
            const element = removeEventListeners(results[i])
            element.addEventListener('click', () => {
              console.log(urls[i].url)
              _this.select(urls[i].url)
            })
          }
        }

        const myInitCallback = function() {
          if (document.readyState === 'complete') {
            // Document is ready when Search Element is initialized.
            // Render an element with both search box and search results in div with id 'test'.
            _this.divE = document.getElementById('test')
            _this.divE.innerHTML = ''
            _this.test11 = window.google.search.cse.element.render({
              div: 'test',
              attributes: {
                disableWebSearch: true,
                image_type: _this.image_type_value,
                enableHistory: false,
                image_as_rights:
                  'cc_publicdomain, cc_noncommercial, cc_nonderived',
                image_dominantcolor:
                  _this.currentColorIndex === -1
                    ? ''
                    : _this.colorStr[_this.currentColorIndex]
              },
              tag: 'search'
            })
            console.log('init call back 1', _this.image_type_value)
          } else {
            // Document is not ready yet, when Search Element is initialized.
            window.google.setOnLoadCallback(function() {
              // Render an element with both search box and search results in div with id 'test'.
              _this.divE = document.getElementById('test')
              _this.divE.innerHTML = ''
              _this.test11 = window.google.search.cse.element.render({
                div: 'test',
                attributes: {
                  disableWebSearch: true,
                  enableHistory: false,
                  image_type: _this.image_type_value,
                  image_as_rights:
                    'cc_publicdomain, cc_noncommercial, cc_nonderived',
                  image_dominantcolor:
                    _this.currentColorIndex === -1
                      ? ''
                      : _this.colorStr[_this.currentColorIndex]
                },
                tag: 'search'
              })
            }, true)
            console.log('init call back 2', _this.image_type_value)
          }
        }
        return {
          readyCallback,
          renderedCallback,
          myInitCallback
        }
      }
      const {
        readyCallback: imageResultsReadyCallback,
        renderedCallback: imageResultsRenderedCallback,
        myInitCallback: myInitializationCallback
      } = makeTwoPartCallback()
      window.__gcse ||
      (window.__gcse = {
        parsetags: 'onload', // Defaults to 'onload'
        initializationCallback: myInitializationCallback,
        searchCallbacks: {
          image: {
            ready: imageResultsReadyCallback,
            rendered: imageResultsRenderedCallback
          }
        }
      })
    },

    loadGooleScript() {
      const gcse = document.createElement('script')
      gcse.type = 'text/javascript'
      gcse.async = true
      gcse.id = 'gcse'
      gcse.src = 'https://www.google.com/cse/cse.js?cx=d29cfc91a5299e6d9'
      const s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(gcse, s)
    }
  }
}
</script>

<style scoped>
.google-image-container {
  width: 100%;
  position: relative;
}

.google-image-filter {
  margin-top: 15px;
}

.color--select {
  width: 35px;
  height: 35px;
  border: 2px solid #15c39a;
}

.result-tips {
  line-height: 30px;
  font-size: 13px;
  color: #808191;
}

.color-filter {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}

.color--unselect {
  width: 35px;
  height: 35px;
}

.color--unselect--white {
  width: 35px;
  height: 35px;
  border: 1px solid #36425a;
}

@-webkit-keyframes rotation {
  from {
    -webkit-transform: rotate(0deg);
  }

  to {
    -webkit-transform: rotate(360deg);
  }
}

#search_parent {
  min-height: 400px;
  background-color: #fff;
}
</style>
