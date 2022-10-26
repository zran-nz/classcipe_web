(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-ad63659c"],{"1a29":function(module,__webpack_exports__,__webpack_require__){"use strict";eval('// ESM COMPAT FLAG\n__webpack_require__.r(__webpack_exports__);\n\n// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"622fa9d5-vue-loader-template"}!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/views/promote/index.vue?vue&type=template&id=5955cf7a&scoped=true&\nvar render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(\'a-card\',{attrs:{"bordered":false,"bodyStyle":{ padding: \'16px 24px\', height: \'100%\', minHeight: \'500px\' }}},[_c(\'a-spin\',{staticClass:"redirect-spin",attrs:{"tip":"Loading...","size":"large"}})],1)}\nvar staticRenderFns = []\n\n\n// CONCATENATED MODULE: ./src/views/promote/index.vue?vue&type=template&id=5955cf7a&scoped=true&\n\n// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/objectSpread2.js\nvar objectSpread2 = __webpack_require__("5530");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.exec.js\nvar es_regexp_exec = __webpack_require__("ac1f");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.replace.js\nvar es_string_replace = __webpack_require__("5319");\n\n// EXTERNAL MODULE: ./src/utils/request.js\nvar request = __webpack_require__("b775");\n\n// CONCATENATED MODULE: ./src/api/v2/promotionChannel.js\n\nvar API_PREFIX = \'promotionChannel\';\nvar PromotionChannelApi = {\n  addPvCount: "/classcipe/api/".concat(API_PREFIX, "/addPvCount"),\n  addRegisterCount: "/classcipe/api/".concat(API_PREFIX, "/addRegisterCount"),\n  addParticipateCount: "/classcipe/api/".concat(API_PREFIX, "/addParticipateCount"),\n  queryById: "/classcipe/api/".concat(API_PREFIX, "/queryById")\n};\n/**\n * @param parameter\n * @returns {AxiosPromise}\n * @constructor\n */\n\nfunction addPvCount(parameter) {\n  return Object(request["d" /* default */])({\n    url: PromotionChannelApi.addPvCount,\n    method: \'get\',\n    params: parameter\n  });\n}\n/**\n * @param parameter\n * @returns {AxiosPromise}\n * @constructor\n */\n\nfunction addRegisterCount(parameter) {\n  return Object(request["d" /* default */])({\n    url: PromotionChannelApi.addRegisterCount,\n    method: \'get\',\n    params: parameter\n  });\n}\n/**\n * @param parameter\n * @returns {AxiosPromise}\n * @constructor\n */\n\nfunction addParticipateCount(parameter) {\n  return Object(request["d" /* default */])({\n    url: PromotionChannelApi.addParticipateCount,\n    method: \'get\',\n    params: parameter\n  });\n}\n/**\n * @param parameter\n * @returns {AxiosPromise}\n * @constructor\n */\n\nfunction queryById(parameter) {\n  return Object(request["d" /* default */])({\n    url: PromotionChannelApi.queryById,\n    method: \'get\',\n    params: parameter\n  });\n}\n// EXTERNAL MODULE: ./src/store/mutation-types.js\nvar mutation_types = __webpack_require__("9fb0");\n\n// EXTERNAL MODULE: ./node_modules/vuex/dist/vuex.esm.js\nvar vuex_esm = __webpack_require__("2f62");\n\n// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/@vue/cli-plugin-babel/node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/views/promote/index.vue?vue&type=script&lang=js&\n\n\n\n//\n//\n//\n//\n//\n//\n\n\n\n/* harmony default export */ var promotevue_type_script_lang_js_ = ({\n  name: \'PromoteTg\',\n  props: {\n    code: {\n      type: String,\n      default: null\n    }\n  },\n  data: function data() {\n    return {\n      redirects: [\'\', \'/teacher/library\', \'/teacher/main/live-workshops\']\n    };\n  },\n  created: function created() {\n    this.$logger.info(\'promote redirecting \' + this.code);\n    this.handleRedirect();\n  },\n  methods: Object(objectSpread2["a" /* default */])(Object(objectSpread2["a" /* default */])({}, Object(vuex_esm["d" /* mapMutations */])([mutation_types["v" /* SET_PROMOTE_CODE */]])), {}, {\n    handleRedirect: function handleRedirect() {\n      var _this = this;\n\n      this.$logger.info(\'promote redirecting \' + this.code);\n\n      if (this.code) {\n        queryById({\n          id: this.code\n        }).then(function (res) {\n          if (res.success && res.result && res.result.promotionContent) {\n            addPvCount({\n              channelId: _this.code\n            });\n\n            _this[mutation_types["v" /* SET_PROMOTE_CODE */]](_this.code); // 根据promotionContent 决定跳转地址\n            // （1：Latest publishing；2：Featured workshops）\n\n\n            _this.$router.replace(_this.redirects[res.result.promotionContent]);\n          } else {\n            _this.doDefault();\n          }\n        }).catch(function () {\n          _this.doDefault();\n        });\n      } else {\n        this.doDefault();\n      }\n    },\n    doDefault: function doDefault() {\n      this.$router.replace(\'/teacher/main/created-by-me\');\n    }\n  })\n});\n// CONCATENATED MODULE: ./src/views/promote/index.vue?vue&type=script&lang=js&\n /* harmony default export */ var views_promotevue_type_script_lang_js_ = (promotevue_type_script_lang_js_); \n// EXTERNAL MODULE: ./src/views/promote/index.vue?vue&type=style&index=0&id=5955cf7a&lang=less&scoped=true&\nvar promotevue_type_style_index_0_id_5955cf7a_lang_less_scoped_true_ = __webpack_require__("b918");\n\n// EXTERNAL MODULE: ./node_modules/@vue/cli-service/node_modules/vue-loader/lib/runtime/componentNormalizer.js\nvar componentNormalizer = __webpack_require__("0c7c");\n\n// CONCATENATED MODULE: ./src/views/promote/index.vue\n\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(componentNormalizer["a" /* default */])(\n  views_promotevue_type_script_lang_js_,\n  render,\n  staticRenderFns,\n  false,\n  null,\n  "5955cf7a",\n  null\n  \n)\n\n/* harmony default export */ var promote = __webpack_exports__["default"] = (component.exports);\n\n//# sourceURL=webpack:///./src/views/promote/index.vue_+_5_modules?')},b918:function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_5955cf7a_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("c267");\n/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_5955cf7a_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_index_vue_vue_type_style_index_0_id_5955cf7a_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__);\n/* unused harmony reexport * */\n\n\n//# sourceURL=webpack:///./src/views/promote/index.vue?')},c267:function(module,exports,__webpack_require__){eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/views/promote/index.vue?./node_modules/mini-css-extract-plugin/dist/loader.js??ref--10-oneOf-1-0!./node_modules/@vue/cli-service/node_modules/css-loader/dist/cjs.js??ref--10-oneOf-1-1!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--10-oneOf-1-2!./node_modules/less-loader/dist/cjs.js??ref--10-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options")}}]);