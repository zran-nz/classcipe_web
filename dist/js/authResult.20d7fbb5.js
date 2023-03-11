(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["authResult"],{"754d":function(module,__webpack_exports__,__webpack_require__){"use strict";eval('// ESM COMPAT FLAG\n__webpack_require__.r(__webpack_exports__);\n\n// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"719c2c8a-vue-loader-template"}!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/views/user/AuthResult.vue?vue&type=template&id=2dea052e&scoped=true&\nvar render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(\'div\',{staticClass:"main-content"},[(!_vm.authFailed)?_c(\'a-spin\',{attrs:{"size":"large"}}):_vm._e(),(_vm.authFailed)?_c(\'div\',{staticClass:"auth-failed"},[_c(\'div\',{staticClass:"auth-failed-detail"},[_c(\'no-more-resources\',{attrs:{"tips":""}})],1),_c(\'div\',{staticClass:"auth-failed-tips"},[_vm._v(" Classcipe needs access to your google account to work properly, please grant permission again. ")]),_c(\'div\',{staticClass:"auth-failed-action"},[_c(\'a-button\',{attrs:{"icon":"redo","shape":"round","type":"primary"},on:{"click":_vm.handleRetryAuth}},[_vm._v("Retry")])],1)]):_vm._e()],1)}\nvar staticRenderFns = []\n\n\n// CONCATENATED MODULE: ./src/views/user/AuthResult.vue?vue&type=template&id=2dea052e&scoped=true&\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.to-string.js\nvar es_object_to_string = __webpack_require__("d3b7");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.iterator.js\nvar es_string_iterator = __webpack_require__("3ca3");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-collections.iterator.js\nvar web_dom_collections_iterator = __webpack_require__("ddb0");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/web.url.js\nvar web_url = __webpack_require__("2b3d");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.exec.js\nvar es_regexp_exec = __webpack_require__("ac1f");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.search.js\nvar es_string_search = __webpack_require__("841c");\n\n// EXTERNAL MODULE: ./src/config/router.config.js + 1 modules\nvar router_config = __webpack_require__("d73b");\n\n// EXTERNAL MODULE: ./src/api/thirdAuth.js\nvar thirdAuth = __webpack_require__("dbdc");\n\n// EXTERNAL MODULE: ./src/components/Common/NoMoreResources.vue + 4 modules\nvar NoMoreResources = __webpack_require__("69b3");\n\n// EXTERNAL MODULE: ./src/const/common.js\nvar common = __webpack_require__("f93e");\n\n// EXTERNAL MODULE: ./src/store/mutation-types.js\nvar mutation_types = __webpack_require__("9fb0");\n\n// EXTERNAL MODULE: ./src/utils/util.js\nvar util = __webpack_require__("ca00");\n\n// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/@vue/cli-plugin-babel/node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/views/user/AuthResult.vue?vue&type=script&lang=js&\n\n\n\n\n\n\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\n\n\n\n\n\n/* harmony default export */ var AuthResultvue_type_script_lang_js_ = ({\n  name: \'AuthResult\',\n  components: {\n    NoMoreResources: NoMoreResources["a" /* default */]\n  },\n  data: function data() {\n    return {\n      authFailed: false,\n      failedMessage: \'\'\n    };\n  },\n  created: function created() {\n    var _this = this;\n\n    var paramSearch = new URLSearchParams(window.location.search);\n    var accessToken = paramSearch.get(\'accessToken\');\n    this.$store.dispatch(\'LoginWithToken\', accessToken).then(function () {\n      _this.$store.dispatch(\'GetInfo\').then(function (response) {\n        var callbackUrl = window.sessionStorage.getItem(common["B" /* SESSION_CALLBACK_URL */]); // 如果有zoom授权token，且当前窗口有opener发送zoom 授权更新消息\n\n        _this.handleOpener();\n\n        if (callbackUrl) {\n          window.sessionStorage.removeItem(common["B" /* SESSION_CALLBACK_URL */]);\n          window.location.href = callbackUrl + (callbackUrl.indexOf(\'?\') > -1 ? \'&\' : \'?\') + \'token=\' + accessToken;\n        } else if (_this.$store.getters.currentRole) {\n          _this.$router.push(_this.$store.getters.defaultRouter);\n        } else {\n          _this.$router.push({\n            path: router_config["f" /* selectRoleRouter */]\n          });\n        }\n      }).catch(function (e) {\n        _this.authFailed = true;\n        _this.failedMessage = e;\n      });\n    }).catch(function () {\n      _this.handleOpener();\n\n      location.href = \'/v2/login?call=\' + encodeURIComponent(location.pathname + location.search);\n    });\n  },\n  methods: {\n    handleRetryAuth: function handleRetryAuth() {\n      var url = Object(thirdAuth["b" /* getThirdAuthURL */])(\'google\');\n      url += "?role=teacher";\n      url += "&channelId=".concat(Object(util["getCookie"])(mutation_types["v" /* SET_PROMOTE_CODE */]));\n      url += "&callbackUrl=";\n      url += thirdAuth["c" /* thirdAuthCallbackUrl */];\n      window.location.href = url;\n    },\n    handleOpener: function handleOpener() {\n      var authType = window.sessionStorage.getItem(\'SESSION_AUTH_TYPE\');\n\n      if (window.opener) {\n        if (window.opener.postMessage && authType) {\n          window.opener.postMessage({\n            authType: authType,\n            event: \'authUpdate\',\n            data: null\n          }, \'*\');\n        }\n\n        window.close();\n      }\n    }\n  }\n});\n// CONCATENATED MODULE: ./src/views/user/AuthResult.vue?vue&type=script&lang=js&\n /* harmony default export */ var user_AuthResultvue_type_script_lang_js_ = (AuthResultvue_type_script_lang_js_); \n// EXTERNAL MODULE: ./src/views/user/AuthResult.vue?vue&type=style&index=0&id=2dea052e&scoped=true&lang=less&\nvar AuthResultvue_type_style_index_0_id_2dea052e_scoped_true_lang_less_ = __webpack_require__("8e90");\n\n// EXTERNAL MODULE: ./node_modules/@vue/cli-service/node_modules/vue-loader/lib/runtime/componentNormalizer.js\nvar componentNormalizer = __webpack_require__("0c7c");\n\n// CONCATENATED MODULE: ./src/views/user/AuthResult.vue\n\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(componentNormalizer["a" /* default */])(\n  user_AuthResultvue_type_script_lang_js_,\n  render,\n  staticRenderFns,\n  false,\n  null,\n  "2dea052e",\n  null\n  \n)\n\n/* harmony default export */ var AuthResult = __webpack_exports__["default"] = (component.exports);\n\n//# sourceURL=webpack:///./src/views/user/AuthResult.vue_+_4_modules?')},7565:function(module,exports,__webpack_require__){eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/views/user/AuthResult.vue?./node_modules/mini-css-extract-plugin/dist/loader.js??ref--10-oneOf-1-0!./node_modules/@vue/cli-service/node_modules/css-loader/dist/cjs.js??ref--10-oneOf-1-1!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--10-oneOf-1-2!./node_modules/less-loader/dist/cjs.js??ref--10-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options")},"8e90":function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_AuthResult_vue_vue_type_style_index_0_id_2dea052e_scoped_true_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("7565");\n/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_AuthResult_vue_vue_type_style_index_0_id_2dea052e_scoped_true_lang_less___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_AuthResult_vue_vue_type_style_index_0_id_2dea052e_scoped_true_lang_less___WEBPACK_IMPORTED_MODULE_0__);\n/* unused harmony reexport * */\n\n\n//# sourceURL=webpack:///./src/views/user/AuthResult.vue?')},dbdc:function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return thirdAuthCallbackUrl; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return getThirdAuthURL; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return checkAuthExpired; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return unbindAuth; });\n/* harmony import */ var core_js_modules_es_string_trim_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("498a");\n/* harmony import */ var core_js_modules_es_string_trim_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_trim_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("d3b7");\n/* harmony import */ var core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("25f0");\n/* harmony import */ var core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_to_string_js__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var core_js_modules_es_array_concat_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("99af");\n/* harmony import */ var core_js_modules_es_array_concat_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_concat_js__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("a18c");\n/* harmony import */ var _utils_request__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("b775");\n\n\n\n\n\n\n/**\n * third auth callback url with vue router path\n * @type {string}\n */\n\nvar thirdAuthCallbackUrl = window.location.origin + (_router__WEBPACK_IMPORTED_MODULE_4__[/* default */ "a"].mode === \'hash\' ? \'#\' : \'\') + \'/user/auth-result\';\n/**\n * get auth url by source\n * @param source\n * @returns {string}\n */\n\nvar getThirdAuthURL = function getThirdAuthURL(source) {\n  if (!source) {\n    throw new Error(\'getThirdAuthURL got a illegal source: \' + source);\n  }\n\n  switch (source.toString().trim()) {\n    case \'google\':\n      return "" + \'/classcipe/thirdLogin/render/google\';\n\n    case \'zoom\':\n      return "" + \'/classcipe/thirdLogin/render/zoom\';\n\n    case \'microsoft\':\n      return "" + \'/classcipe/thirdLogin/render/microsoft\';\n\n    default:\n      throw new Error(\'not config auth url for source[\' + source + \']\');\n  }\n};\nfunction checkAuthExpired(source, email) {\n  return Object(_utils_request__WEBPACK_IMPORTED_MODULE_5__[/* default */ "d"])({\n    url: "/classcipe/thirdLogin/".concat(source, "/refreshToken?email=").concat(email),\n    method: \'get\'\n  });\n}\nfunction unbindAuth(source) {\n  return Object(_utils_request__WEBPACK_IMPORTED_MODULE_5__[/* default */ "d"])({\n    url: "/classcipe/thirdLogin/".concat(source, "/unbind"),\n    method: \'get\'\n  });\n}\n\n//# sourceURL=webpack:///./src/api/thirdAuth.js?')}}]);