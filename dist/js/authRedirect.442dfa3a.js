(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["authRedirect"],{"3d4e":function(module,exports,__webpack_require__){eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/views/user/AuthRedirect.vue?./node_modules/mini-css-extract-plugin/dist/loader.js??ref--6-oneOf-1-0!./node_modules/@vue/cli-service/node_modules/css-loader/dist/cjs.js??ref--6-oneOf-1-1!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-oneOf-1-2!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options")},"65abf":function(module,__webpack_exports__,__webpack_require__){"use strict";eval('// ESM COMPAT FLAG\n__webpack_require__.r(__webpack_exports__);\n\n// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"622fa9d5-vue-loader-template"}!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/views/user/AuthRedirect.vue?vue&type=template&id=767abcee&scoped=true&\nvar render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(\'div\',{staticClass:"main-content"},[_c(\'a-spin\',{attrs:{"size":"large"}})],1)}\nvar staticRenderFns = []\n\n\n// CONCATENATED MODULE: ./src/views/user/AuthRedirect.vue?vue&type=template&id=767abcee&scoped=true&\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.to-string.js\nvar es_object_to_string = __webpack_require__("d3b7");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.iterator.js\nvar es_string_iterator = __webpack_require__("3ca3");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-collections.iterator.js\nvar web_dom_collections_iterator = __webpack_require__("ddb0");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url.js\nvar web_url = __webpack_require__("2b3d");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.exec.js\nvar es_regexp_exec = __webpack_require__("ac1f");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.search.js\nvar es_string_search = __webpack_require__("841c");\n\n// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/@vue/cli-plugin-babel/node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/views/user/AuthRedirect.vue?vue&type=script&lang=js&\n\n\n\n\n\n\n//\n//\n//\n//\n//\n//\n//\n// 其他课堂、插件端的用户授权跳转\n/* harmony default export */ var AuthRedirectvue_type_script_lang_js_ = ({\n  name: \'AuthRedirect\',\n  created: function created() {\n    var _this = this;\n\n    var paramSearch = new URLSearchParams(window.location.search);\n    var token = paramSearch.get(\'token\');\n    var redirect = paramSearch.get(\'redirect\');\n    this.$store.dispatch(\'LoginWithToken\', token).then(function () {\n      _this.$store.dispatch(\'GetInfo\').then(function (response) {\n        _this.$logger.info(\'redirect path is \' + redirect);\n\n        _this.$router.push({\n          path: redirect\n        });\n      }).catch(function (e) {\n        _this.$message.error(\'Redirect Auth Failed,\' + e);\n      });\n    }).catch(function () {\n      location.href = \'/v2/login?call=\' + location.pathname;\n    });\n  },\n  methods: {}\n});\n// CONCATENATED MODULE: ./src/views/user/AuthRedirect.vue?vue&type=script&lang=js&\n /* harmony default export */ var user_AuthRedirectvue_type_script_lang_js_ = (AuthRedirectvue_type_script_lang_js_); \n// EXTERNAL MODULE: ./src/views/user/AuthRedirect.vue?vue&type=style&index=0&id=767abcee&scoped=true&lang=css&\nvar AuthRedirectvue_type_style_index_0_id_767abcee_scoped_true_lang_css_ = __webpack_require__("d506");\n\n// EXTERNAL MODULE: ./node_modules/@vue/cli-service/node_modules/vue-loader/lib/runtime/componentNormalizer.js\nvar componentNormalizer = __webpack_require__("0c7c");\n\n// CONCATENATED MODULE: ./src/views/user/AuthRedirect.vue\n\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(componentNormalizer["a" /* default */])(\n  user_AuthRedirectvue_type_script_lang_js_,\n  render,\n  staticRenderFns,\n  false,\n  null,\n  "767abcee",\n  null\n  \n)\n\n/* harmony default export */ var AuthRedirect = __webpack_exports__["default"] = (component.exports);\n\n//# sourceURL=webpack:///./src/views/user/AuthRedirect.vue_+_4_modules?')},d506:function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_AuthRedirect_vue_vue_type_style_index_0_id_767abcee_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("3d4e");\n/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_AuthRedirect_vue_vue_type_style_index_0_id_767abcee_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_6_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_6_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_oneOf_1_2_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_AuthRedirect_vue_vue_type_style_index_0_id_767abcee_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);\n/* unused harmony reexport * */\n\n\n//# sourceURL=webpack:///./src/views/user/AuthRedirect.vue?')}}]);