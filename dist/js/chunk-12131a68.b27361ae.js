(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-12131a68"],{"0023":function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_UnitPlanRedirect_vue_vue_type_style_index_0_id_421c1133_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("5ecf");\n/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_UnitPlanRedirect_vue_vue_type_style_index_0_id_421c1133_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_UnitPlanRedirect_vue_vue_type_style_index_0_id_421c1133_lang_less_scoped_true___WEBPACK_IMPORTED_MODULE_0__);\n/* unused harmony reexport * */\n\n\n//# sourceURL=webpack:///./src/views/teacher/UnitPlanRedirect.vue?')},"3c23":function(module,__webpack_exports__,__webpack_require__){"use strict";eval('// ESM COMPAT FLAG\n__webpack_require__.r(__webpack_exports__);\n\n// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"ac86b5fa-vue-loader-template"}!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/views/teacher/UnitPlanRedirect.vue?vue&type=template&id=421c1133&scoped=true&\nvar render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(\'a-card\',{attrs:{"bordered":false,"bodyStyle":{ padding: \'16px 24px\', height: \'100%\', minHeight: \'500px\' }}},[_c(\'a-spin\',{staticClass:"redirect-spin",attrs:{"tip":"Loading...","size":"large"}})],1)}\nvar staticRenderFns = []\n\n\n// CONCATENATED MODULE: ./src/views/teacher/UnitPlanRedirect.vue?vue&type=template&id=421c1133&scoped=true&\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.regexp.exec.js\nvar es_regexp_exec = __webpack_require__("ac1f");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.replace.js\nvar es_string_replace = __webpack_require__("5319");\n\n// EXTERNAL MODULE: ./node_modules/@ant-design-vue/pro-layout/es/index.js + 24 modules\nvar es = __webpack_require__("c0d2");\n\n// EXTERNAL MODULE: ./src/api/unitPlan.js\nvar unitPlan = __webpack_require__("de0d");\n\n// EXTERNAL MODULE: ./src/utils/logger.js\nvar logger = __webpack_require__("823b");\n\n// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/@vue/cli-plugin-babel/node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/views/teacher/UnitPlanRedirect.vue?vue&type=script&lang=js&\n\n\n//\n//\n//\n//\n//\n//\n\n\n\n/* harmony default export */ var UnitPlanRedirectvue_type_script_lang_js_ = ({\n  name: \'UnitPlanRedirect\',\n  components: {\n    PageHeaderWrapper: es["b" /* PageHeaderWrapper */]\n  },\n  props: {\n    unitPlanId: {\n      type: String,\n      default: null\n    }\n  },\n  created: function created() {\n    var _this = this;\n\n    if (this.unitPlanId !== \'create\') {\n      this.$router.replace(\'/teacher/unit-plan-v2/\' + this.unitPlanId);\n    } else {\n      var unitPlanData = {\n        name: \'Unnamed Unit Plan\'\n      };\n      Object(unitPlan["UnitPlanAddOrUpdate"])(unitPlanData).then(function (response) {\n        if (response.success) {\n          _this.$router.replace({\n            path: \'/teacher/unit-plan-v2/\' + response.result.id\n          });\n        } else {\n          _this.$message.error(response.message);\n        }\n      });\n    }\n  }\n});\n// CONCATENATED MODULE: ./src/views/teacher/UnitPlanRedirect.vue?vue&type=script&lang=js&\n /* harmony default export */ var teacher_UnitPlanRedirectvue_type_script_lang_js_ = (UnitPlanRedirectvue_type_script_lang_js_); \n// EXTERNAL MODULE: ./src/views/teacher/UnitPlanRedirect.vue?vue&type=style&index=0&id=421c1133&lang=less&scoped=true&\nvar UnitPlanRedirectvue_type_style_index_0_id_421c1133_lang_less_scoped_true_ = __webpack_require__("0023");\n\n// EXTERNAL MODULE: ./node_modules/@vue/cli-service/node_modules/vue-loader/lib/runtime/componentNormalizer.js\nvar componentNormalizer = __webpack_require__("0c7c");\n\n// CONCATENATED MODULE: ./src/views/teacher/UnitPlanRedirect.vue\n\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(componentNormalizer["a" /* default */])(\n  teacher_UnitPlanRedirectvue_type_script_lang_js_,\n  render,\n  staticRenderFns,\n  false,\n  null,\n  "421c1133",\n  null\n  \n)\n\n/* harmony default export */ var UnitPlanRedirect = __webpack_exports__["default"] = (component.exports);\n\n//# sourceURL=webpack:///./src/views/teacher/UnitPlanRedirect.vue_+_4_modules?')},"5ecf":function(module,exports,__webpack_require__){eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/views/teacher/UnitPlanRedirect.vue?./node_modules/mini-css-extract-plugin/dist/loader.js??ref--10-oneOf-1-0!./node_modules/@vue/cli-service/node_modules/css-loader/dist/cjs.js??ref--10-oneOf-1-1!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--10-oneOf-1-2!./node_modules/less-loader/dist/cjs.js??ref--10-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options")},de0d:function(module,__webpack_exports__,__webpack_require__){"use strict";eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"unitPlanAPIUrl\", function() { return unitPlanAPIUrl; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"UnitPlanAddOrUpdate\", function() { return UnitPlanAddOrUpdate; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"UnitPlanQueryById\", function() { return UnitPlanQueryById; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"UnitPlanDelete\", function() { return UnitPlanDelete; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"UnitPlanDeleteBatch\", function() { return UnitPlanDeleteBatch; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"UnitPlanList\", function() { return UnitPlanList; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ChangeStatus\", function() { return ChangeStatus; });\n/* harmony import */ var _utils_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(\"b775\");\n\nvar unitPlanAPIUrl = {\n  UnitPlanAddOrUpdate: '/classcipe/api/unitPlan/addOrUpdate',\n  UnitPlanQueryById: '/classcipe/api/unitPlan/queryById',\n  UnitPlanDelete: '/classcipe/api/unitPlan/delete',\n  UnitPlanDeleteBatch: '/classcipe/api/unitPlan/deleteBatch',\n  UnitPlanList: '/classcipe/api/unitPlan/list',\n  ChangeStatus: '/classcipe/api/unitPlan/status'\n};\n/**\n * @param parameter\n * @returns {AxiosPromise}\n * @constructor\n */\n\nfunction UnitPlanAddOrUpdate(parameter) {\n  return Object(_utils_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ \"d\"])({\n    url: unitPlanAPIUrl.UnitPlanAddOrUpdate,\n    method: 'post',\n    data: parameter,\n    headers: {\n      'Content-Type': 'application/json;charset=UTF-8'\n    }\n  });\n}\n/**\n * @param parameter\n * @returns {AxiosPromise}\n * @constructor\n */\n\nfunction UnitPlanQueryById(parameter) {\n  return Object(_utils_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ \"d\"])({\n    url: unitPlanAPIUrl.UnitPlanQueryById,\n    method: 'get',\n    params: parameter\n  });\n}\n/**\n * @param parameter\n * @returns {AxiosPromise}\n * @constructor\n */\n\nfunction UnitPlanDelete(parameter) {\n  return Object(_utils_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ \"d\"])({\n    url: unitPlanAPIUrl.UnitPlanDelete,\n    method: 'post',\n    data: parameter,\n    headers: {\n      'Content-Type': 'application/json;charset=UTF-8'\n    }\n  });\n}\n/**\n * @param parameter\n * @returns {AxiosPromise}\n * @constructor\n */\n\nfunction UnitPlanDeleteBatch(parameter) {\n  return Object(_utils_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ \"d\"])({\n    url: unitPlanAPIUrl.UnitPlanDeleteBatch,\n    method: 'post',\n    data: parameter,\n    headers: {\n      'Content-Type': 'application/json;charset=UTF-8'\n    }\n  });\n}\n/**\n * @param parameter\n * @returns {AxiosPromise}\n * @constructor\n */\n\nfunction UnitPlanList(parameter) {\n  return Object(_utils_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ \"d\"])({\n    url: unitPlanAPIUrl.UnitPlanList,\n    method: 'get',\n    params: parameter\n  });\n}\n/**\n * @param parameter\n * @returns {AxiosPromise}\n * @constructor\n */\n\nfunction ChangeStatus(parameter) {\n  return Object(_utils_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ \"d\"])({\n    url: unitPlanAPIUrl.ChangeStatus,\n    method: 'post',\n    data: parameter,\n    headers: {\n      'Content-Type': 'application/json;charset=UTF-8'\n    }\n  });\n}\n\n//# sourceURL=webpack:///./src/api/unitPlan.js?")}}]);