(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-8238f9ec"],{"0b08":function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_CardList_vue_vue_type_style_index_0_id_406e3d15_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("da92");\n/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_CardList_vue_vue_type_style_index_0_id_406e3d15_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_CardList_vue_vue_type_style_index_0_id_406e3d15_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__);\n/* unused harmony reexport * */\n\n\n//# sourceURL=webpack:///./src/components/LibraryV3/CardList.vue?')},"21fb":function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CurrentSchoolMixin; });\n/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("b0c0");\n/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0__);\n\nvar CurrentSchoolMixin = {\n  data: function data() {\n    return {\n      unwatch: null,\n      routeName: this.$route.name\n    };\n  },\n  created: function created() {\n    var _this = this;\n\n    this.unwatch = this.$store.watch(function (state) {\n      return state.user.currentSchool;\n    }, function (currentSchool) {\n      return currentSchool && _this.$route.name === _this.routeName && _this.handleSchoolChange(currentSchool);\n    });\n  },\n  computed: {},\n  beforeDestroy: function beforeDestroy() {\n    this.unwatch && this.unwatch();\n  },\n  methods: {\n    // 默认方法，各个组件可自定义覆盖此方法\n    handleSchoolChange: function handleSchoolChange(currentSchool) {}\n  }\n};\n\n//# sourceURL=webpack:///./src/mixins/CurrentSchoolMixin.js?')},2365:function(module,exports,__webpack_require__){eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/components/Share/ShareButton.vue?./node_modules/mini-css-extract-plugin/dist/loader.js??ref--10-oneOf-1-0!./node_modules/@vue/cli-service/node_modules/css-loader/dist/cjs.js??ref--10-oneOf-1-1!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--10-oneOf-1-2!./node_modules/less-loader/dist/cjs.js??ref--10-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options")},"430c":function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_CardListItem_vue_vue_type_style_index_0_id_9a225396_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("d9f7");\n/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_CardListItem_vue_vue_type_style_index_0_id_9a225396_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_CardListItem_vue_vue_type_style_index_0_id_9a225396_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__);\n/* unused harmony reexport * */\n\n\n//# sourceURL=webpack:///./src/components/Preview/CardListItem.vue?')},"4362e":function(module,__webpack_exports__,__webpack_require__){"use strict";eval('\n// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"719c2c8a-vue-loader-template"}!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/components/Preview/CardListItem.vue?vue&type=template&id=9a225396&scoped=true&\nvar render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(\'div\',{staticClass:"cc-card"},[_c(\'div\',{staticClass:"cover-img relative-position",style:({backgroundImage: ("url(\'" + ((_vm.content.image || \'//dcdkqlzgpl5ba.cloudfront.net/1392467808404684802/file/202208140641519097-20220814143449.png\')) + "\')"), \'width\' : _vm.width + \'rem\'})},[(_vm.innerDesc)?_c(\'div\',{staticClass:"inner-mask"}):_vm._e(),(_vm.innerDesc)?_c(\'div\',{staticClass:"card-bottom-section q-pa-sm col q-gutter-xs inner-desc absolute-bottom"},[_c(\'div\',{staticClass:"type-tag"},[_c(\'a-tag\',{attrs:{"color":"#15C39A"}},[_vm._v(_vm._s(_vm._f("type2Name")(_vm.content.type)))])],1),_c(\'div\',{staticClass:"card-title",attrs:{"title":_vm.mainTitle}},[_vm._v(_vm._s(_vm.mainTitle))]),_c(\'div\',{staticClass:"card-sub-title",attrs:{"title":_vm.subDescription}},[_vm._v(" "+_vm._s(_vm.subDescription)+" ")])]):_vm._e(),(_vm.outerDesc)?_c(\'div\',{staticClass:"inner-tag"},[_c(\'a-tag\',{attrs:{"color":"#15C39A"}},[_vm._v(_vm._s(_vm._f("type2Name")(_vm.content.type)))])],1):_vm._e(),(_vm.content.status === 0 && _vm.content.createBy === _vm.$store.getters.email)?_c(\'div\',{staticClass:"publish-tag"},[_c(\'a-tooltip\',{attrs:{"title":"Wait to publish"}},[_c(\'publish-icon\',{staticStyle:{"width":"13px","height":"14px"}})],1)],1):_vm._e()]),(_vm.outerDesc)?_c(\'div\',{staticClass:"card-bottom-section outer-desc",style:({\'width\' : _vm.width + \'rem\'})},[_c(\'div\',{staticClass:"main-title-line"},[_c(\'div\',{staticClass:"main-title",attrs:{"title":_vm.mainTitle}},[_vm._v(" "+_vm._s(_vm.mainTitle)+" ")]),_c(\'div\',{staticClass:"main-action"},[_c(\'a-space\',[(_vm.content.star)?_c(\'a-rate\',{staticClass:"cc-library-rate",attrs:{"value":_vm.content.star || 10,"disabled":""}}):_vm._e(),(!_vm.content.star)?_c(\'div\',{staticClass:"no-review"},[_vm._v("No reviews")]):_vm._e(),_c(\'div\',{staticClass:"share-icon",on:{"click":function($event){$event.stopPropagation();$event.preventDefault();}}},[_c(\'a-tooltip\',{attrs:{"trigger":"click","getPopupContainer":function (trigger) { return trigger.parentElement; },"placement":"bottomRight"}},[_c(\'template\',{slot:"title"},[_c(\'div\',{staticClass:"detail-share"},[_c(\'share-button\',{attrs:{"link":_vm.wrapperLink(_vm.content),"title":_vm.content.name}})],1)]),_c(\'a-icon\',{attrs:{"type":"share-alt"}})],2)],1)],1)],1)]),_c(\'div\',{staticClass:"sub-desc",attrs:{"title":_vm.subDescription}},[_vm._v(" "+_vm._s(_vm.subDescription)+" ")])]):_vm._e()])}\nvar staticRenderFns = []\n\n\n// CONCATENATED MODULE: ./src/components/Preview/CardListItem.vue?vue&type=template&id=9a225396&scoped=true&\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.number.constructor.js\nvar es_number_constructor = __webpack_require__("a9e3");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.function.name.js\nvar es_function_name = __webpack_require__("b0c0");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.slice.js\nvar es_array_slice = __webpack_require__("fb6a");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.js\nvar es_symbol = __webpack_require__("a4d3");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.symbol.description.js\nvar es_symbol_description = __webpack_require__("e01a");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.concat.js\nvar es_array_concat = __webpack_require__("99af");\n\n// EXTERNAL MODULE: ./src/components/Share/ShareButton.vue + 4 modules\nvar ShareButton = __webpack_require__("5fc3");\n\n// EXTERNAL MODULE: ./src/assets/v2/icons/publish_new.svg?inline\nvar publish_newinline = __webpack_require__("e6fe");\nvar publish_newinline_default = /*#__PURE__*/__webpack_require__.n(publish_newinline);\n\n// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/@vue/cli-plugin-babel/node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/components/Preview/CardListItem.vue?vue&type=script&lang=js&\n\n\n\n\n\n\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\n\n/* harmony default export */ var CardListItemvue_type_script_lang_js_ = ({\n  name: \'CardListItem\',\n  components: {\n    ShareButton: ShareButton["a" /* default */],\n    PublishIcon: publish_newinline_default.a\n  },\n  props: {\n    content: {\n      type: Object,\n      required: true\n    },\n    width: {\n      type: Number,\n      default: 20\n    },\n    innerDesc: {\n      type: Boolean,\n      default: false\n    },\n    outerDesc: {\n      type: Boolean,\n      default: true\n    }\n  },\n  computed: {\n    mainTitle: function mainTitle() {\n      var title = this.content.name || \'Untitled\';\n      return title.slice(0, 1).toUpperCase() + title.slice(1);\n    },\n    subDescription: function subDescription() {\n      // let desc\n      // if (this.content.type === typeMap[\'unit-plan\']) {\n      //   desc = this.content.inquiry\n      // } else if (this.content.type === typeMap.pd) {\n      //   desc = this.content.goals\n      // } else {\n      //   desc = this.content.overview\n      // }\n      return this.content.description || \'\';\n    }\n  },\n  data: function data() {\n    return {};\n  },\n  created: function created() {},\n  methods: {\n    wrapperLink: function wrapperLink(item) {\n      if (item && item.id) {\n        var typeName = this.$classcipe.getContentTypeName(item.type);\n        return "".concat("https://classcipe.com", "/v2/").concat(typeName, "/").concat(item.id);\n      } else {\n        return \'\';\n      }\n    }\n  }\n});\n// CONCATENATED MODULE: ./src/components/Preview/CardListItem.vue?vue&type=script&lang=js&\n /* harmony default export */ var Preview_CardListItemvue_type_script_lang_js_ = (CardListItemvue_type_script_lang_js_); \n// EXTERNAL MODULE: ./src/components/Preview/CardListItem.vue?vue&type=style&index=0&id=9a225396&lang=less&scoped=true&\nvar CardListItemvue_type_style_index_0_id_9a225396_lang_less_scoped_true_ = __webpack_require__("430c");\n\n// EXTERNAL MODULE: ./node_modules/@vue/cli-service/node_modules/vue-loader/lib/runtime/componentNormalizer.js\nvar componentNormalizer = __webpack_require__("0c7c");\n\n// CONCATENATED MODULE: ./src/components/Preview/CardListItem.vue\n\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(componentNormalizer["a" /* default */])(\n  Preview_CardListItemvue_type_script_lang_js_,\n  render,\n  staticRenderFns,\n  false,\n  null,\n  "9a225396",\n  null\n  \n)\n\n/* harmony default export */ var CardListItem = __webpack_exports__["a"] = (component.exports);\n\n//# sourceURL=webpack:///./src/components/Preview/CardListItem.vue_+_4_modules?')},"44f5":function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* unused harmony export LiveApiUrl */\n/* unused harmony export FindWorkShops */\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return CreateQRCode; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CancelRegistered; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return SaveRegisteredRecord; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return DetailBySessionId; });\n/* harmony import */ var _utils_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("b775");\n\nvar API_PREFIX = \'live\';\nvar LiveApiUrl = {\n  CreateQRCode: "/classcipe/api/v2/".concat(API_PREFIX, "/createQRCode"),\n  FindWorkShops: "/classcipe/api/v2/".concat(API_PREFIX, "/findWorkShops"),\n  SaveRegisteredRecord: "/classcipe/api/v2/".concat(API_PREFIX, "/saveRegisteredRecord"),\n  CancelRegistered: "/classcipe/api/v2/".concat(API_PREFIX, "/cancelRegistered"),\n  DetailBySessionId: "/classcipe/api/v2/".concat(API_PREFIX, "/detailBySessionId")\n};\n/**\n * @param parameter\n * @returns {AxiosPromise}\n * @constructor\n */\n\nfunction FindWorkShops(parameter) {\n  return Object(_utils_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "d"])({\n    url: LiveApiUrl.FindWorkShops,\n    method: \'post\',\n    data: parameter,\n    headers: {\n      \'Content-Type\': \'application/json;charset=UTF-8\'\n    }\n  });\n}\n/**\n * @param parameter\n * @returns {AxiosPromise}\n * @constructor\n */\n\nfunction CreateQRCode(parameter) {\n  return Object(_utils_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "d"])({\n    url: LiveApiUrl.CreateQRCode,\n    method: \'get\',\n    responseType: \'blob\',\n    params: parameter\n  });\n}\n/**\n * @param parameter\n * @returns {AxiosPromise}\n * @constructor\n */\n\nfunction CancelRegistered(parameter) {\n  return Object(_utils_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "d"])({\n    url: LiveApiUrl.CancelRegistered,\n    method: \'post\',\n    data: parameter,\n    headers: {\n      \'Content-Type\': \'application/json;charset=UTF-8\'\n    }\n  });\n}\n/**\n * @param parameter\n * @returns {AxiosPromise}\n * @constructor\n */\n\nfunction SaveRegisteredRecord(parameter) {\n  return Object(_utils_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "d"])({\n    url: LiveApiUrl.SaveRegisteredRecord,\n    method: \'post\',\n    data: parameter,\n    headers: {\n      \'Content-Type\': \'application/json;charset=UTF-8\'\n    }\n  });\n}\n/**\n * @param parameter\n * @returns {AxiosPromise}\n * @constructor\n */\n\nfunction DetailBySessionId(parameter) {\n  return Object(_utils_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "d"])({\n    url: LiveApiUrl.DetailBySessionId,\n    method: \'get\',\n    params: parameter\n  });\n}\n\n//# sourceURL=webpack:///./src/api/v2/live.js?')},"5fc3":function(module,__webpack_exports__,__webpack_require__){"use strict";eval('\n// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"719c2c8a-vue-loader-template"}!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/components/Share/ShareButton.vue?vue&type=template&id=35e10260&scoped=true&\nvar render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(\'div\',{staticClass:"share-button"},[_c(\'div\',{staticClass:"share-title"},[_vm._v("Share by QR code")]),_c(\'a-spin\',{attrs:{"spinning":_vm.loading}},[_c(\'div\',{staticClass:"share-qrcode"},[_c(\'img\',{attrs:{"src":_vm.qrCode,"alt":"qrCode"}})])]),_c(\'div\',{staticClass:"share-divider"},[_vm._v("Or")]),_c(\'div\',{staticClass:"share-out"},[_c(\'icon-font\',{attrs:{"type":"icon-Facebook"},on:{"click":function($event){return _vm.share(\'fb\')}}}),_c(\'icon-font\',{attrs:{"type":"icon-Linkdin"},on:{"click":function($event){return _vm.share(\'in\')}}}),_c(\'icon-font\',{attrs:{"type":"icon-Twitter"},on:{"click":function($event){return _vm.share(\'twitter\')}}}),_c(\'icon-font\',{attrs:{"type":"icon-lianjie1"},on:{"click":_vm.handleCopy}})],1)],1)}\nvar staticRenderFns = []\n\n\n// CONCATENATED MODULE: ./src/components/Share/ShareButton.vue?vue&type=template&id=35e10260&scoped=true&\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.concat.js\nvar es_array_concat = __webpack_require__("99af");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.link.js\nvar es_string_link = __webpack_require__("9911");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.to-string.js\nvar es_object_to_string = __webpack_require__("d3b7");\n\n// EXTERNAL MODULE: ./src/api/v2/live.js\nvar live = __webpack_require__("44f5");\n\n// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/@vue/cli-plugin-babel/node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/components/Share/ShareButton.vue?vue&type=script&lang=js&\n\n\n\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\n/* harmony default export */ var ShareButtonvue_type_script_lang_js_ = ({\n  name: \'ShareButton\',\n  props: {\n    link: {\n      type: String,\n      required: true\n    },\n    title: {\n      type: String,\n      default: \'Share\'\n    }\n  },\n  data: function data() {\n    return {\n      qrCode: \'\',\n      loading: false,\n      shareLink: {\n        fb: "https://www.facebook.com/share.php?title=".concat(this.title, "&u=").concat(encodeURIComponent(this.link)),\n        in: "https://www.linkedin.com/shareArticle?mini=true&source=str&title=".concat(this.title, "&url=").concat(encodeURIComponent(this.link)),\n        twitter: "https://twitter.com/intent/tweet?text=".concat(this.title, "&url=").concat(encodeURIComponent(this.link)),\n        whatsapp: "https://api.whatsapp.com/send?text=".concat(encodeURIComponent(this.link))\n      }\n    };\n  },\n  created: function created() {\n    this.initQrcode();\n  },\n  methods: {\n    initQrcode: function initQrcode() {\n      var _this = this;\n\n      if (this.link) {\n        this.loading = true;\n        Object(live["b" /* CreateQRCode */])({\n          url: this.link\n        }).then(function (data) {\n          var reader = new FileReader();\n          reader.readAsDataURL(new Blob([data]));\n\n          reader.onload = function () {\n            _this.qrCode = reader.result;\n          };\n\n          reader.onerror = function () {};\n        }).finally(function (res) {\n          _this.loading = false;\n        });\n      }\n    },\n    share: function share(type) {\n      window.open(this.shareLink[type], \'_blank\');\n    },\n    handleCopy: function handleCopy() {\n      var _this2 = this;\n\n      this.$copyText(this.link).then(function () {\n        _this2.$message.success(\'Copy successfully\');\n      }).catch(function () {\n        _this2.$message.error(\'Copy failed\');\n      });\n    }\n  }\n});\n// CONCATENATED MODULE: ./src/components/Share/ShareButton.vue?vue&type=script&lang=js&\n /* harmony default export */ var Share_ShareButtonvue_type_script_lang_js_ = (ShareButtonvue_type_script_lang_js_); \n// EXTERNAL MODULE: ./src/components/Share/ShareButton.vue?vue&type=style&index=0&id=35e10260&scoped=true&lang=less&\nvar ShareButtonvue_type_style_index_0_id_35e10260_scoped_true_lang_less_ = __webpack_require__("8190");\n\n// EXTERNAL MODULE: ./node_modules/@vue/cli-service/node_modules/vue-loader/lib/runtime/componentNormalizer.js\nvar componentNormalizer = __webpack_require__("0c7c");\n\n// CONCATENATED MODULE: ./src/components/Share/ShareButton.vue\n\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(componentNormalizer["a" /* default */])(\n  Share_ShareButtonvue_type_script_lang_js_,\n  render,\n  staticRenderFns,\n  false,\n  null,\n  "35e10260",\n  null\n  \n)\n\n/* harmony default export */ var ShareButton = __webpack_exports__["a"] = (component.exports);\n\n//# sourceURL=webpack:///./src/components/Share/ShareButton.vue_+_4_modules?')},"6e84":function(module,__webpack_exports__,__webpack_require__){"use strict";eval("/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return UserModeMixin; });\n/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(\"b0c0\");\n/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0__);\n\nvar UserModeMixin = {\n  data: function data() {\n    return {\n      unwatch: null,\n      routeName: this.$route.name\n    };\n  },\n  computed: {\n    redirectUrl: function redirectUrl() {\n      return '/account/info?_=UserModeMixin:13'; // if (this.$store.state.user.currentRole === 'student') {\n      //   return '/student/main/my-task'\n      // } else {\n      // }\n    }\n  },\n  created: function created() {\n    var _this = this;\n\n    this.unwatch = this.$store.watch(function (state) {\n      return state.app.userMode;\n    }, function (userMode) {\n      if (userMode && _this.$route.name === _this.routeName) {\n        _this.handleModeChange(userMode); // this.routeInMode()\n\n      }\n    }); // this.routeInMode()\n  },\n  beforeDestroy: function beforeDestroy() {\n    this.unwatch && this.unwatch();\n  },\n  methods: {\n    // 判断路由是否存在\n    routeInMode: function routeInMode() {// if (this.$route.meta.mode && this.$route.meta.mode !== this.$store.state.app.userMode) {\n      //   // 返回公共页面\n      //   this.$router.push({ path: this.redirectUrl })\n      // }\n    },\n    // 默认方法,可覆盖\n    handleModeChange: function handleModeChange(userMode) {}\n  }\n};\n\n//# sourceURL=webpack:///./src/mixins/UserModeMixin.js?")},8190:function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_ShareButton_vue_vue_type_style_index_0_id_35e10260_scoped_true_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("2365");\n/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_ShareButton_vue_vue_type_style_index_0_id_35e10260_scoped_true_lang_less___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_ShareButton_vue_vue_type_style_index_0_id_35e10260_scoped_true_lang_less___WEBPACK_IMPORTED_MODULE_0__);\n/* unused harmony reexport * */\n\n\n//# sourceURL=webpack:///./src/components/Share/ShareButton.vue?')},d9f7:function(module,exports,__webpack_require__){eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/components/Preview/CardListItem.vue?./node_modules/mini-css-extract-plugin/dist/loader.js??ref--10-oneOf-1-0!./node_modules/@vue/cli-service/node_modules/css-loader/dist/cjs.js??ref--10-oneOf-1-1!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--10-oneOf-1-2!./node_modules/less-loader/dist/cjs.js??ref--10-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options")},da92:function(module,exports,__webpack_require__){eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/components/LibraryV3/CardList.vue?./node_modules/mini-css-extract-plugin/dist/loader.js??ref--10-oneOf-1-0!./node_modules/@vue/cli-service/node_modules/css-loader/dist/cjs.js??ref--10-oneOf-1-1!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--10-oneOf-1-2!./node_modules/less-loader/dist/cjs.js??ref--10-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options")},e6fe:function(module,exports,__webpack_require__){eval('\n    var runtime = __webpack_require__("b2b7")\n    module.exports = {\n      __esModule: true,\n      default: runtime.svgComponent({\n  "tag": "svg",\n  "attrsMap": {\n    "t": "1653279259330",\n    "class": "icon",\n    "viewBox": "0 0 1024 1024",\n    "version": "1.1",\n    "xmlns": "http://www.w3.org/2000/svg",\n    "p-id": "4202",\n    "xmlns:xlink": "http://www.w3.org/1999/xlink"\n  },\n  "children": [\n    {\n      "tag": "path",\n      "attrsMap": {\n        "d": "M54.859102 64.003017A64.804294 64.804294 0 0 0 120.321679 128.002743h783.356642a63.999726 63.999726 0 1 0 0-127.999452H120.321679A64.804294 64.804294 0 0 0 54.859102 64.003017zM212.115571 640.000549h103.862412v319.998628A65.060293 65.060293 0 0 0 381.44056 1023.998903h261.11888a65.060293 65.060293 0 0 0 65.462577-63.999726V640.000549h103.862412a63.926583 63.926583 0 0 0 46.079803-109.457817l-299.518717-293.740455a66.194002 66.194002 0 0 0-92.159605 0l-299.884429 293.740455A63.890012 63.890012 0 0 0 212.115571 640.000549z",\n        "p-id": "4203"\n      }\n    }\n  ]\n})\n    }\n  \n\n//# sourceURL=webpack:///./src/assets/v2/icons/publish_new.svg?')},ed22:function(module,__webpack_exports__,__webpack_require__){"use strict";eval('\n// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"719c2c8a-vue-loader-template"}!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/components/LibraryV3/CardList.vue?vue&type=template&id=406e3d15&scoped=true&\nvar render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(\'div\',{staticClass:"card-list-wrapper"},[(_vm.titlePosition === "center")?[_c(\'div\',{staticClass:"card-list-title-center"},[_c(\'div\',{staticClass:"title-item"},[_c(\'div\',{staticClass:"main-title"},[_vm._v(" "+_vm._s(_vm.title)+" ")]),_c(\'div\',{staticClass:"sub-title"},[_vm._v(" "+_vm._s(_vm.subTitle)+" ")])]),(_vm.category !== \'pd\')?_c(\'div\',{staticClass:"more-action"},[(!_vm.isSchoolMode)?_c(\'router-link\',{attrs:{"to":\'/teacher/library-all/\' + _vm.category}},[_vm._v("More")]):_vm._e(),(_vm.isSchoolMode)?_c(\'router-link\',{attrs:{"to":\'/teacher/resource-all/\' + _vm.category}},[_vm._v("More")]):_vm._e()],1):_c(\'div\',{staticClass:"more-action"},[_c(\'router-link\',{attrs:{"to":\'/teacher/main/live-workshops\'}},[_vm._v("More")])],1)])]:_vm._e(),(_vm.titlePosition === "left")?[_c(\'div\',{staticClass:"card-list-title"},[_c(\'div\',{staticClass:"title-item"},[_c(\'div\',{staticClass:"main-title"},[_vm._v(" "+_vm._s(_vm.title)+" ")]),_c(\'div\',{staticClass:"sub-title"},[_vm._v(" "+_vm._s(_vm.subTitle)+" ")])]),(_vm.category !== \'pd\')?_c(\'div\',{staticClass:"more-action"},[(!_vm.isSchoolMode)?_c(\'router-link\',{attrs:{"to":\'/teacher/library-all/\' + _vm.category}},[_vm._v("More")]):_vm._e(),(_vm.isSchoolMode)?_c(\'router-link\',{attrs:{"to":\'/teacher/resource-all/\' + _vm.category}},[_vm._v("More")]):_vm._e()],1):_c(\'div\',{staticClass:"more-action"},[_c(\'router-link\',{attrs:{"to":\'/teacher/main/live-workshops\'}},[_vm._v("More")])],1)])]:_vm._e(),_c(\'div\',{staticClass:"scroll-left",class:{\'inner-scroll-left\': _vm.innerDesc, \'outer-scroll-left\': _vm.outerDesc, \'no-more-left\': !_vm.hasMoreLeft},on:{"click":_vm.scrollLeft}},[_c(\'a-icon\',{style:({fontSize: \'16px\', color: \'#6967C3\'}),attrs:{"type":"arrow-left"}})],1),_c(\'div\',{staticClass:"scroll-right",class:{\'inner-scroll-right\': _vm.innerDesc, \'outer-scroll-right\': _vm.outerDesc, \'no-more-right\': !_vm.hasMoreRight},on:{"click":_vm.scrollRight}},[_c(\'a-icon\',{style:({fontSize: \'16px\', color: \'#6967C3\'}),attrs:{"type":"arrow-right"}})],1),_c(\'div\',{staticClass:"card-list",attrs:{"id":_vm.category}},_vm._l((_vm.list),function(item,idx){return _c(\'div\',{key:idx,staticClass:"card-item",on:{"click":function($event){return _vm.handlePreviewDetail(item)}}},[_c(\'card-list-item\',_vm._b({attrs:{"inner-desc":_vm.innerDesc,"outer-desc":_vm.outerDesc,"content":item,"width":_vm.cardSize}},\'card-list-item\',_vm.$attrs,false))],1)}),0),(_vm.previewVisible)?_c(\'content-preview\',{attrs:{"content-id":_vm.previewCurrentId,"content-type":_vm.previewType,"show-buy-button":_vm.cardMode === \'library\' || _vm.cardMode === \'resource\',"is-library":_vm.cardMode === \'library\',"school-resource":_vm.cardMode === \'resource\',"show-subtask":_vm.cardMode !== \'resource\',"review-edit":false,"review-create":false,"show-enter-button":false,"liveWorkShopCode":_vm.previewCode},on:{"close":_vm.handlePreviewClose}}):_vm._e()],2)}\nvar staticRenderFns = []\n\n\n// CONCATENATED MODULE: ./src/components/LibraryV3/CardList.vue?vue&type=template&id=406e3d15&scoped=true&\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.number.constructor.js\nvar es_number_constructor = __webpack_require__("a9e3");\n\n// EXTERNAL MODULE: ./src/components/Preview/CardListItem.vue + 4 modules\nvar CardListItem = __webpack_require__("4362e");\n\n// EXTERNAL MODULE: ./src/components/Preview/ContentPreview.vue + 4 modules\nvar ContentPreview = __webpack_require__("ce85");\n\n// EXTERNAL MODULE: ./src/mixins/ContentItemMixin.js\nvar ContentItemMixin = __webpack_require__("f031");\n\n// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/@vue/cli-plugin-babel/node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/components/LibraryV3/CardList.vue?vue&type=script&lang=js&\n\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\n\n\n/* harmony default export */ var CardListvue_type_script_lang_js_ = ({\n  components: {\n    CardListItem: CardListItem["a" /* default */],\n    ContentPreview: ContentPreview["a" /* default */]\n  },\n  props: {\n    title: {\n      type: String,\n      required: true\n    },\n    subTitle: {\n      type: String,\n      default: \'\'\n    },\n    titlePosition: {\n      type: String,\n      default: \'left\'\n    },\n    category: {\n      type: String,\n      required: true\n    },\n    cardSize: {\n      type: Number,\n      default: 20\n    },\n    list: {\n      type: Array,\n      required: true\n    },\n    isSchoolMode: {\n      type: Boolean,\n      default: false\n    },\n    cardMode: {\n      type: String,\n      default: \'library\'\n    },\n    innerDesc: {\n      type: Boolean,\n      default: false\n    },\n    outerDesc: {\n      type: Boolean,\n      default: true\n    }\n  },\n  mixins: [ContentItemMixin["a" /* ContentItemMixin */]],\n  data: function data() {\n    return {\n      scrollX: 0,\n      slide: 1,\n      stars: 1,\n      showPreview: false,\n      contentId: null,\n      contentType: 0,\n      hasMoreLeft: true,\n      hasMoreRight: true,\n      previewCode: null\n    };\n  },\n  watch: {\n    list: function list(newValue) {\n      if (newValue && newValue.length) {\n        this.hiddenArrow(document.getElementById(this.category));\n      }\n    }\n  },\n  mounted: function mounted() {\n    this.hiddenArrow(document.getElementById(this.category));\n  },\n  methods: {\n    scrollFn: function scrollFn(e) {\n      this.scrollX = e.target.scrollLeft === 0 ? 0 : 1;\n    },\n    moveTo: function moveTo(x) {\n      var dom = this.$refs.list;\n      var left = dom.scrollLeft + x * dom.offsetWidth * 0.7;\n      if (left < 0) left = 0;\n      this.scrollX = dom.scrollLeft === 0 ? 0 : 1;\n      this.$refs.list.scrollTo({\n        left: left,\n        behavior: \'smooth\'\n      });\n    },\n    viewAll: function viewAll() {},\n    scrollLeft: function scrollLeft() {\n      var dom = document.getElementById(this.category);\n      dom.scrollBy({\n        left: -800,\n        behavior: \'smooth\'\n      });\n      this.hiddenArrow(dom);\n    },\n    scrollRight: function scrollRight() {\n      var dom = document.getElementById(this.category);\n      dom.scrollBy({\n        left: 800,\n        behavior: \'smooth\'\n      });\n      this.hiddenArrow(dom);\n    },\n    hiddenArrow: function hiddenArrow(dom) {\n      var _this = this;\n\n      setTimeout(function () {\n        if (dom && dom.scrollLeft + dom.offsetWidth >= dom.scrollWidth) {\n          _this.hasMoreRight = false;\n        } else {\n          _this.hasMoreRight = true;\n        }\n\n        if (dom && dom.scrollLeft <= 0) {\n          _this.hasMoreLeft = false;\n        } else {\n          _this.hasMoreLeft = true;\n        }\n      }, 500);\n    }\n  }\n});\n// CONCATENATED MODULE: ./src/components/LibraryV3/CardList.vue?vue&type=script&lang=js&\n /* harmony default export */ var LibraryV3_CardListvue_type_script_lang_js_ = (CardListvue_type_script_lang_js_); \n// EXTERNAL MODULE: ./src/components/LibraryV3/CardList.vue?vue&type=style&index=0&id=406e3d15&lang=less&scoped=true&\nvar CardListvue_type_style_index_0_id_406e3d15_lang_less_scoped_true_ = __webpack_require__("0b08");\n\n// EXTERNAL MODULE: ./node_modules/@vue/cli-service/node_modules/vue-loader/lib/runtime/componentNormalizer.js\nvar componentNormalizer = __webpack_require__("0c7c");\n\n// CONCATENATED MODULE: ./src/components/LibraryV3/CardList.vue\n\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(componentNormalizer["a" /* default */])(\n  LibraryV3_CardListvue_type_script_lang_js_,\n  render,\n  staticRenderFns,\n  false,\n  null,\n  "406e3d15",\n  null\n  \n)\n\n/* harmony default export */ var CardList = __webpack_exports__["a"] = (component.exports);\n\n//# sourceURL=webpack:///./src/components/LibraryV3/CardList.vue_+_4_modules?')}}]);