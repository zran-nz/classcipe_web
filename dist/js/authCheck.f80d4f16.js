(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["authCheck"],{"22ae":function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_AuthCheck_vue_vue_type_style_index_0_id_d201e760_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ecbe");\n/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_AuthCheck_vue_vue_type_style_index_0_id_d201e760_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_AuthCheck_vue_vue_type_style_index_0_id_d201e760_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);\n/* unused harmony reexport * */\n\n\n//# sourceURL=webpack:///./src/views/user/AuthCheck.vue?')},d62f:function(module,__webpack_exports__,__webpack_require__){"use strict";eval('// ESM COMPAT FLAG\n__webpack_require__.r(__webpack_exports__);\n\n// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"13ebeca6-vue-loader-template"}!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/views/user/AuthCheck.vue?vue&type=template&id=d201e760&scoped=true&\nvar render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(\'div\',{staticClass:"main-content"},[_c(\'a-spin\',{attrs:{"size":"large"}})],1)}\nvar staticRenderFns = []\n\n\n// CONCATENATED MODULE: ./src/views/user/AuthCheck.vue?vue&type=template&id=d201e760&scoped=true&\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.exec.js\nvar es_regexp_exec = __webpack_require__("ac1f");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.replace.js\nvar es_string_replace = __webpack_require__("5319");\n\n// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/@vue/cli-plugin-babel/node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/views/user/AuthCheck.vue?vue&type=script&lang=js&\n\n\n//\n//\n//\n//\n//\n//\n//\n/* harmony default export */ var AuthCheckvue_type_script_lang_js_ = ({\n  name: \'AuthCheck\',\n  created: function created() {\n    var _this = this;\n\n    // 没有session 数据，尝试验证token，如果失效那么重新登录\n    this.$store.dispatch(\'GetInfo\').then(function (data) {\n      var redirect = decodeURIComponent(_this.$route.query.redirect);\n\n      _this.$router.push({\n        path: redirect\n      });\n    }).catch(function (err) {\n      _this.$logger.warn(\'AuthCheck token invalid, try login\', err);\n\n      _this.$store.dispatch(\'ClearAuth\').then(function () {\n        _this.$router.push({\n          name: \'login\',\n          query: {\n            redirect: _this.$route.fullPath\n          }\n        });\n      }).catch(function (err) {\n        _this.$logger.error(\'AuthCheck logout failed\', err);\n\n        _this.goHomeHandle();\n      });\n    });\n  },\n  methods: {\n    goHomeHandle: function goHomeHandle() {\n      this.$router.replace({\n        name: \'login\'\n      });\n    }\n  }\n});\n// CONCATENATED MODULE: ./src/views/user/AuthCheck.vue?vue&type=script&lang=js&\n /* harmony default export */ var user_AuthCheckvue_type_script_lang_js_ = (AuthCheckvue_type_script_lang_js_); \n// EXTERNAL MODULE: ./src/views/user/AuthCheck.vue?vue&type=style&index=0&id=d201e760&scoped=true&lang=css&\nvar AuthCheckvue_type_style_index_0_id_d201e760_scoped_true_lang_css_ = __webpack_require__("22ae");\n\n// EXTERNAL MODULE: ./node_modules/@vue/cli-service/node_modules/vue-loader/lib/runtime/componentNormalizer.js\nvar componentNormalizer = __webpack_require__("0c7c");\n\n// CONCATENATED MODULE: ./src/views/user/AuthCheck.vue\n\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(componentNormalizer["a" /* default */])(\n  user_AuthCheckvue_type_script_lang_js_,\n  render,\n  staticRenderFns,\n  false,\n  null,\n  "d201e760",\n  null\n  \n)\n\n/* harmony default export */ var AuthCheck = __webpack_exports__["default"] = (component.exports);\n\n//# sourceURL=webpack:///./src/views/user/AuthCheck.vue_+_4_modules?')},ecbe:function(module,exports,__webpack_require__){eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/views/user/AuthCheck.vue?./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/@vue/cli-service/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-oneOf-1-2!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options")}}]);