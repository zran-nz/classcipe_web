<template>
  <div class='google-image-container'>
    <a-spin tip="Loading..." :spinning="loading">
      <div style='display: flex;width: 100%; justify-content: start; align-items: center;margin-left: 20px;'>
        <a-select
          :getPopupContainer="trigger => trigger.parentElement"
          v-model='image_type_value'
          placeholder='Image type'
          @change='imageTypeChange'>
          <a-select-option v-for='item in imageTypes' :key='item.value' :value='item.value'>
            {{ item.label }}
          </a-select-option >
        </a-select>

        <div style='display: flex; margin-left: 10px;'>
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
      </div>

      <div style='display: flex;width: 100%; justify-content: start; margin-top: 15px;margin-left: 20px;'>
        <span style='font-size: 14px; color: #808191;'>Results displayed have been modified for commercial use. </span>
        <span
          style='font-size: 14px;color:#15C39A;cursor: pointer;margin-left: 2px;'
          @click='showPrivate()'>See more</span>
      </div>

      <div style='width: 100%;  height: 1px; background-color: #d8d8d8; margin-top: 10px;'></div>

      <div id='search_parent' style='width: 80%; flex: 1; margin-bottom: 20px;'>
        <div id='test'></div>
      </div>

      <div
        style='position: absolute; bottom: 10px; left: 10px;  font-size: 12px; color: #808191; height: 20px; background-color: #ffffff;'>
        Only use image that you have the right to post.
      </div>
    </a-spin>
  </div>
</template>

<script>
var test11
var divE
export default {
  props: {
    doneSelect: {
      type: Function,
      default: () => null
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
      optSlideId: ''
    }
  },
  created() {
    this.loadGooleScript()
  },
  mounted() {
    this.initCallback()
  },
  methods: {
    // 显示提示
    showPrivate() {
      window.open('https://support.window.google.com/drive/answer/179622?p=docs_image_search&hl=en&visit_id=637765802042272752-1731005835&rd=1')
    },
    imageTypeChange() {
      const _this = this
      this.lastSearchKey = test11.getInputQuery()
      document.getElementById('test').innerHTML = ''
      test11 = window.google.search.cse.element.render({
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
      test11.execute(this.lastSearchKey)
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
      this.lastSearchKey = test11.getInputQuery()
      document.getElementById('test').innerHTML = ''
      test11 = window.google.search.cse.element.render({
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
      test11.execute(this.lastSearchKey)
    },
    select(url) {
      console.log('select image', url)
      this.image_type_value = ''
      this.currentColorIndex = -1
      this.currentColor = '#00FFFFFF'
      this.doneSelect(url)
    },
    insertImage(url) {
      console.log('insertImage', url)
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
            divE = document.getElementById('test')
            divE.innerHTML = ''
            test11 = window.google.search.cse.element.render({
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
            // window.google.search.cse.element.render({
            //   div: "image_result",
            //   attributes: {
            //     disableWebSearch: true,
            //     image_type: _this.image_type_value,
            //     image_dominantcolor:
            //       _this.currentColorIndex == -1
            //         ? ""
            //         : _this.colorStr[_this.currentColorIndex]
            //   },
            //   tag: "search"
            // });
            console.log('init call back 1', _this.image_type_value)
          } else {
            // Document is not ready yet, when Search Element is initialized.
            window.google.setOnLoadCallback(function() {
              // Render an element with both search box and search results in div with id 'test'.
              var divE = document.getElementById('test')
              divE.innerHTML = ''
              test11 = window.google.search.cse.element.render({
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
      var gcse = document.createElement('script')
      gcse.type = 'text/javascript'
      gcse.async = true
      gcse.src = 'https://www.window.google.com/cse/cse.js?cx=2f882a468dfb03fa9'
      var s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(gcse, s)
    }
  }
}
</script>

<style scoped>
.google-image-container {
  width: 100%;
  height: 600px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.color--select {
  width: 35px;
  height: 35px;
  border: 2px solid #15c39a;
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

</style>
