(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-ec971c5a"],{"357e":function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* unused harmony export baseApiUrl */\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return orderRecordList; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return orderRecordListPayment; });\n/* harmony import */ var _utils_request__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("b775");\n\nvar API_PREFIX = \'orderRecord\';\nvar baseApiUrl = {\n  list: "/classcipe/api/".concat(API_PREFIX, "/list"),\n  payment: "/classcipe/api/".concat(API_PREFIX, "/list/payment")\n};\n/**\n * @param parameter\n * @returns {AxiosPromise}\n * @constructor\n */\n\nfunction orderRecordList(parameter) {\n  return Object(_utils_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "d"])({\n    url: baseApiUrl.list,\n    method: \'get\',\n    params: parameter\n  });\n}\n/**\n * @param parameter\n * @returns {AxiosPromise}\n * @constructor\n */\n\nfunction orderRecordListPayment(parameter) {\n  return Object(_utils_request__WEBPACK_IMPORTED_MODULE_0__[/* default */ "d"])({\n    url: baseApiUrl.payment,\n    method: \'get\',\n    params: parameter\n  });\n}\n\n//# sourceURL=webpack:///./src/api/orderRecord.js?')},"4a76":function(module,__webpack_exports__,__webpack_require__){"use strict";eval("/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return TableWidthMixin; });\n/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(\"159b\");\n/* harmony import */ var core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(\"d81d\");\n/* harmony import */ var core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_map_js__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var core_js_modules_es_string_fixed_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(\"c7cd\");\n/* harmony import */ var core_js_modules_es_string_fixed_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_fixed_js__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nvar TableWidthMixin = {\n  data: function data() {\n    return {\n      tableRefs: [],\n      leftWidth: 0,\n      firstColumnWid: 0\n    };\n  },\n  mounted: function mounted() {\n    this.firstColumnWid = this.columns[0] ? this.columns[0].width : 0;\n    this.resetTableWidth(200);\n    window.addEventListener('resize', this.resetTableWidth, true);\n  },\n  destroyed: function destroyed() {\n    window.removeEventListener('resize', this.resetTableWidth);\n  },\n  methods: {\n    resetTableWidth: function resetTableWidth(init) {\n      var _this = this;\n\n      if (this.tableRefs && this.tableRefs.length > 0) {\n        this.tableRefs.forEach(function (tableRef) {\n          if (_this.$refs[tableRef] && _this.columns && _this.columns.length > 0) {\n            var totalWidth = _this.columns.map(function (item) {\n              if (item.width && item.width !== 'auto') {\n                return parseInt(item.width);\n              } else {\n                return parseInt(_this.firstColumnWid);\n              }\n            }).reduce(function (prev, current) {\n              return prev + current;\n            }, 0);\n\n            var conWidth = (_this.$refs[tableRef].$el || _this.$refs[tableRef]).getBoundingClientRect().width;\n\n            if (conWidth > totalWidth + _this.leftWidth + init) {\n              _this.columns[0].width = 'auto';\n              _this.scroll = {\n                x: conWidth\n              };\n            } else {\n              _this.columns[0].width = _this.firstColumnWid;\n              _this.scroll = {\n                x: totalWidth\n              };\n              _this.columns[_this.columns.length - 1].fixed = 'right';\n            }\n          }\n        });\n        this.$forceUpdate();\n      }\n    }\n  }\n};\n\n//# sourceURL=webpack:///./src/mixins/TableWidthMixin.js?")},"52b8":function(module,__webpack_exports__,__webpack_require__){"use strict";eval('// ESM COMPAT FLAG\n__webpack_require__.r(__webpack_exports__);\n\n// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"719c2c8a-vue-loader-template"}!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/views/student/MyOrders.vue?vue&type=template&id=fde08592&scoped=true&\nvar render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(\'div\',{ref:"tableCon",staticClass:"my-content"},[_c(\'div\',{staticClass:"filter-line"},[_c(\'div\',{staticClass:"status-tab"},[_c(\'div\',{staticClass:"toggle-mode-type-wrapper"},[_c(\'div\',{staticClass:"toggle-mode-type"},[_c(\'div\',{staticClass:"toggle-mode"},_vm._l((_vm.orderTypes),function(item,index){return _c(\'div\',{key:\'orderTypes\'+index,class:{\'mode-item\': true, \'active-mode\' : _vm.queryParam.orderType === item.value},on:{"click":function($event){return _vm.toggleType(item.value)}}},[_vm._v(" "+_vm._s(item.title)+" ")])}),0)])])]),_c(\'div\',{staticClass:"type-owner"},[_c(\'div\',{staticClass:"my-search"},[_c(\'a-input-search\',{attrs:{"placeholder":"Search","allowClear":true,"size":"large"},on:{"search":_vm.triggerSearch,"pressEnter":_vm.triggerSearch},model:{value:(_vm.queryParam.searchText),callback:function ($$v) {_vm.$set(_vm.queryParam, "searchText", $$v)},expression:"queryParam.searchText"}})],1)])]),_c(\'div\',{},[_c(\'s-table\',{ref:"table",staticClass:"content-list",attrs:{"size":"default","rowKey":function (row) { return row.id; },"columns":_vm.columns,"data":_vm.loadData,"scroll":_vm.scroll},scopedSlots:_vm._u([{key:"action",fn:function(text, record){return _c(\'span\',{},[[_c(\'a\',{on:{"click":function($event){return _vm.handlePaymentItem(record)}}},[_vm._v("Refund")])]],2)}}])})],1),_c(\'a-modal\',{attrs:{"footer":null,"destroyOnClose":"","width":"800px","zIndex":6000,"title":"Payment details"},on:{"ok":function($event){_vm.paymentVisible = false},"cancel":function($event){_vm.paymentVisible = false}},model:{value:(_vm.paymentVisible),callback:function ($$v) {_vm.paymentVisible=$$v},expression:"paymentVisible"}},[_c(\'payment-detail\',{attrs:{"taskId":_vm.currentTaskId,"taskName":_vm.currentTaskName}})],1)],1)}\nvar staticRenderFns = []\n\n\n// CONCATENATED MODULE: ./src/views/student/MyOrders.vue?vue&type=template&id=fde08592&scoped=true&\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.array.concat.js\nvar es_array_concat = __webpack_require__("99af");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.object.to-string.js\nvar es_object_to_string = __webpack_require__("d3b7");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.string.iterator.js\nvar es_string_iterator = __webpack_require__("3ca3");\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom-collections.iterator.js\nvar web_dom_collections_iterator = __webpack_require__("ddb0");\n\n// EXTERNAL MODULE: ./src/utils/logger.js\nvar logger = __webpack_require__("823b");\n\n// EXTERNAL MODULE: ./src/const/common.js\nvar common = __webpack_require__("f93e");\n\n// EXTERNAL MODULE: ./src/components/index.js + 115 modules\nvar components = __webpack_require__("2af9");\n\n// EXTERNAL MODULE: ./src/components/Student/PaymentDetail.vue + 4 modules\nvar PaymentDetail = __webpack_require__("bffd");\n\n// EXTERNAL MODULE: ./src/api/common.js\nvar api_common = __webpack_require__("2934");\n\n// EXTERNAL MODULE: ./src/api/orderRecord.js\nvar orderRecord = __webpack_require__("357e");\n\n// EXTERNAL MODULE: ./src/mixins/UserModeMixin.js\nvar UserModeMixin = __webpack_require__("6e84");\n\n// EXTERNAL MODULE: ./src/mixins/TableWidthMixin.js\nvar TableWidthMixin = __webpack_require__("4a76");\n\n// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/@vue/cli-plugin-babel/node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/views/student/MyOrders.vue?vue&type=script&lang=js&\n\n\n\n\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\n\n\n\n\n\n\n\n/* harmony default export */ var MyOrdersvue_type_script_lang_js_ = ({\n  name: \'MyOrders\',\n  mixins: [UserModeMixin["a" /* UserModeMixin */], TableWidthMixin["a" /* TableWidthMixin */]],\n  components: {\n    STable: components["d" /* STable */],\n    PaymentDetail: PaymentDetail["a" /* default */]\n  },\n  data: function data() {\n    var _this = this;\n\n    return {\n      loading: false,\n      orderTypes: [],\n      orderStatus: [],\n      // 查询参数\n      queryParam: {\n        status: null,\n        orderType: \'1\',\n        searchText: \'\'\n      },\n      // 加载数据方法 必须为 Promise 对象\n      loadData: function loadData(parameter) {\n        return Object(orderRecord["a" /* orderRecordList */])(Object.assign(parameter, _this.queryParam)).then(function (res) {\n          return res.result;\n        });\n      },\n      scroll: {},\n      currentTaskId: null,\n      currentTaskName: null,\n      paymentVisible: false,\n      tableRefs: [\'tableCon\'],\n      leftWidth: 230\n    };\n  },\n  computed: {\n    columns: function columns() {\n      var _this2 = this;\n\n      var results = [{\n        title: \'Task name\',\n        dataIndex: \'taskName\',\n        width: \'200px\'\n      }, {\n        title: \'Teacher\',\n        dataIndex: \'teacherName\',\n        width: \'150px\'\n      }];\n\n      if (this.queryParam.orderType === common["s" /* OrderType */].AskTeacher) {\n        results = results.concat([{\n          title: \'Times\',\n          dataIndex: \'times\',\n          width: \'100px\'\n        }]);\n      } else if (this.queryParam.orderType === common["s" /* OrderType */].Other) {\n        results = [{\n          title: \'Product name\',\n          dataIndex: \'productName\',\n          width: \'200px\'\n        }].concat(results);\n      }\n\n      results = results.concat([{\n        title: \'Price($)\',\n        dataIndex: \'price\',\n        width: \'150px\',\n        // sorter: true,\n        customRender: function customRender(text) {\n          return _this2.$options.filters[\'percentFormat\'](text);\n        }\n      }, {\n        title: \'Payment\',\n        dataIndex: \'payment\',\n        width: \'150px\',\n        // sorter: true,\n        customRender: function customRender(text) {\n          return _this2.$options.filters[\'percentFormat\'](text);\n        }\n      }, {\n        title: \'Payment Account\',\n        dataIndex: \'paymentAccount\',\n        width: \'150px\'\n      }, {\n        title: \'Date\',\n        dataIndex: \'createTime\',\n        width: \'150px\' // sorter: true,\n        // customRender: (text) => this.$options.filters[\'dayjs1\'](text)\n\n      }, {\n        title: \'Actions\',\n        dataIndex: \'action\',\n        width: \'100px\',\n        scopedSlots: {\n          customRender: \'action\'\n        }\n      }]);\n      return results;\n    }\n  },\n  created: function created() {\n    this.initDict();\n  },\n  methods: {\n    initDict: function initDict() {\n      var _this3 = this;\n\n      Promise.all([Object(api_common["a" /* GetDictItems */])(common["n" /* DICT_ORDER_STATUS */]), Object(api_common["a" /* GetDictItems */])(common["o" /* DICT_ORDER_TYPE */])]).then(function (res) {\n        if (res[0].success) {\n          _this3.orderStatus = res[0].result;\n        }\n\n        if (res[1].success) {\n          _this3.orderTypes = res[1].result;\n        }\n      });\n    },\n    toggleType: function toggleType(type) {\n      this.queryParam.orderType = type;\n      this.$refs.table.refresh(true);\n      this.resetTableWidth();\n    },\n    triggerSearch: function triggerSearch() {\n      this.$refs.table.refresh(true);\n    },\n    handlePaymentItem: function handlePaymentItem(item) {\n      if (!item.taskId) {\n        return;\n      }\n\n      this.currentTaskId = item.taskId;\n      this.currentTaskName = item.taskName;\n      this.paymentVisible = true;\n    }\n  }\n});\n// CONCATENATED MODULE: ./src/views/student/MyOrders.vue?vue&type=script&lang=js&\n /* harmony default export */ var student_MyOrdersvue_type_script_lang_js_ = (MyOrdersvue_type_script_lang_js_); \n// EXTERNAL MODULE: ./src/views/student/MyOrders.vue?vue&type=style&index=0&id=fde08592&scoped=true&lang=less&\nvar MyOrdersvue_type_style_index_0_id_fde08592_scoped_true_lang_less_ = __webpack_require__("54b8");\n\n// EXTERNAL MODULE: ./node_modules/@vue/cli-service/node_modules/vue-loader/lib/runtime/componentNormalizer.js\nvar componentNormalizer = __webpack_require__("0c7c");\n\n// CONCATENATED MODULE: ./src/views/student/MyOrders.vue\n\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(componentNormalizer["a" /* default */])(\n  student_MyOrdersvue_type_script_lang_js_,\n  render,\n  staticRenderFns,\n  false,\n  null,\n  "fde08592",\n  null\n  \n)\n\n/* harmony default export */ var MyOrders = __webpack_exports__["default"] = (component.exports);\n\n//# sourceURL=webpack:///./src/views/student/MyOrders.vue_+_4_modules?')},"54b8":function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_MyOrders_vue_vue_type_style_index_0_id_fde08592_scoped_true_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("a952");\n/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_MyOrders_vue_vue_type_style_index_0_id_fde08592_scoped_true_lang_less___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_MyOrders_vue_vue_type_style_index_0_id_fde08592_scoped_true_lang_less___WEBPACK_IMPORTED_MODULE_0__);\n/* unused harmony reexport * */\n\n\n//# sourceURL=webpack:///./src/views/student/MyOrders.vue?')},"6e84":function(module,__webpack_exports__,__webpack_require__){"use strict";eval("/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"a\", function() { return UserModeMixin; });\n/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(\"b0c0\");\n/* harmony import */ var core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_function_name_js__WEBPACK_IMPORTED_MODULE_0__);\n\nvar UserModeMixin = {\n  data: function data() {\n    return {\n      unwatch: null,\n      routeName: this.$route.name\n    };\n  },\n  computed: {\n    redirectUrl: function redirectUrl() {\n      return '/account/info?_=UserModeMixin:13'; // if (this.$store.state.user.currentRole === 'student') {\n      //   return '/student/main/my-task'\n      // } else {\n      // }\n    }\n  },\n  created: function created() {\n    var _this = this;\n\n    this.unwatch = this.$store.watch(function (state) {\n      return state.app.userMode;\n    }, function (userMode) {\n      if (userMode && _this.$route.name === _this.routeName) {\n        _this.handleModeChange(userMode);\n\n        _this.routeInMode();\n      }\n    });\n    this.routeInMode();\n  },\n  beforeDestroy: function beforeDestroy() {\n    this.unwatch && this.unwatch();\n  },\n  methods: {\n    // 判断路由是否存在\n    routeInMode: function routeInMode() {\n      if (this.$route.meta.mode && this.$route.meta.mode !== this.$store.state.app.userMode) {\n        // 返回公共页面\n        this.$router.push({\n          path: this.redirectUrl\n        });\n      }\n    },\n    // 默认方法,可覆盖\n    handleModeChange: function handleModeChange(userMode) {}\n  }\n};\n\n//# sourceURL=webpack:///./src/mixins/UserModeMixin.js?")},"8be6":function(module,__webpack_exports__,__webpack_require__){"use strict";eval('/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_PaymentDetail_vue_vue_type_style_index_0_id_0ebf6467_scoped_true_lang_less___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("ded03");\n/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_PaymentDetail_vue_vue_type_style_index_0_id_0ebf6467_scoped_true_lang_less___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_10_oneOf_1_0_node_modules_vue_cli_service_node_modules_css_loader_dist_cjs_js_ref_10_oneOf_1_1_node_modules_vue_cli_service_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_10_oneOf_1_2_node_modules_less_loader_dist_cjs_js_ref_10_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_cli_service_node_modules_vue_loader_lib_index_js_vue_loader_options_PaymentDetail_vue_vue_type_style_index_0_id_0ebf6467_scoped_true_lang_less___WEBPACK_IMPORTED_MODULE_0__);\n/* unused harmony reexport * */\n\n\n//# sourceURL=webpack:///./src/components/Student/PaymentDetail.vue?')},a952:function(module,exports,__webpack_require__){eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/views/student/MyOrders.vue?./node_modules/mini-css-extract-plugin/dist/loader.js??ref--10-oneOf-1-0!./node_modules/@vue/cli-service/node_modules/css-loader/dist/cjs.js??ref--10-oneOf-1-1!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--10-oneOf-1-2!./node_modules/less-loader/dist/cjs.js??ref--10-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options")},bffd:function(module,__webpack_exports__,__webpack_require__){"use strict";eval('\n// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"719c2c8a-vue-loader-template"}!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/components/Student/PaymentDetail.vue?vue&type=template&id=0ebf6467&scoped=true&\nvar render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c(\'div\',{staticClass:"my-content"},[_c(\'div\',{staticClass:"modal-title"},[_vm._v("Task: "+_vm._s(_vm.taskName))]),_c(\'s-table\',{ref:"table",staticClass:"content-list",attrs:{"size":"default","rowKey":function (row) { return row.id; },"columns":_vm.columns,"data":_vm.loadData,"scroll":_vm.scroll}})],1)}\nvar staticRenderFns = []\n\n\n// CONCATENATED MODULE: ./src/components/Student/PaymentDetail.vue?vue&type=template&id=0ebf6467&scoped=true&\n\n// EXTERNAL MODULE: ./node_modules/core-js/modules/es.number.constructor.js\nvar es_number_constructor = __webpack_require__("a9e3");\n\n// EXTERNAL MODULE: ./src/utils/logger.js\nvar logger = __webpack_require__("823b");\n\n// EXTERNAL MODULE: ./src/components/index.js + 115 modules\nvar components = __webpack_require__("2af9");\n\n// EXTERNAL MODULE: ./src/api/orderRecord.js\nvar orderRecord = __webpack_require__("357e");\n\n// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/@vue/cli-plugin-babel/node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options!./src/components/Student/PaymentDetail.vue?vue&type=script&lang=js&\n\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\n\n\n/* harmony default export */ var PaymentDetailvue_type_script_lang_js_ = ({\n  name: \'PaymentDetail\',\n  props: {\n    taskId: {\n      type: [String, Number],\n      required: true\n    },\n    taskName: {\n      type: String,\n      required: true\n    }\n  },\n  components: {\n    STable: components["d" /* STable */]\n  },\n  data: function data() {\n    var _this = this;\n\n    return {\n      loading: false,\n      // 查询参数\n      queryParam: {\n        status: null,\n        searchText: \'\',\n        taskId: this.taskId\n      },\n      // 加载数据方法 必须为 Promise 对象\n      loadData: function loadData(parameter) {\n        return Object(orderRecord["b" /* orderRecordListPayment */])(Object.assign(parameter, _this.queryParam)).then(function (res) {\n          return res.result;\n        });\n      },\n      scroll: {}\n    };\n  },\n  computed: {\n    columns: function columns() {\n      var _this2 = this;\n\n      var results = [{\n        title: \'Date\',\n        dataIndex: \'paymentTime\'\n      }, {\n        title: \'Type\',\n        dataIndex: \'productName\',\n        width: \'200px\'\n      }, {\n        title: \'Price($)\',\n        dataIndex: \'price\',\n        width: \'150px\',\n        // sorter: true,\n        customRender: function customRender(text) {\n          return _this2.$options.filters[\'percentFormat\'](text);\n        }\n      }];\n      return results;\n    }\n  },\n  created: function created() {},\n  methods: {\n    triggerSearch: function triggerSearch() {\n      this.$refs.table.refresh(true);\n    },\n    handleDetail: function handleDetail(record) {}\n  }\n});\n// CONCATENATED MODULE: ./src/components/Student/PaymentDetail.vue?vue&type=script&lang=js&\n /* harmony default export */ var Student_PaymentDetailvue_type_script_lang_js_ = (PaymentDetailvue_type_script_lang_js_); \n// EXTERNAL MODULE: ./src/components/Student/PaymentDetail.vue?vue&type=style&index=0&id=0ebf6467&scoped=true&lang=less&\nvar PaymentDetailvue_type_style_index_0_id_0ebf6467_scoped_true_lang_less_ = __webpack_require__("8be6");\n\n// EXTERNAL MODULE: ./node_modules/@vue/cli-service/node_modules/vue-loader/lib/runtime/componentNormalizer.js\nvar componentNormalizer = __webpack_require__("0c7c");\n\n// CONCATENATED MODULE: ./src/components/Student/PaymentDetail.vue\n\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(componentNormalizer["a" /* default */])(\n  Student_PaymentDetailvue_type_script_lang_js_,\n  render,\n  staticRenderFns,\n  false,\n  null,\n  "0ebf6467",\n  null\n  \n)\n\n/* harmony default export */ var PaymentDetail = __webpack_exports__["a"] = (component.exports);\n\n//# sourceURL=webpack:///./src/components/Student/PaymentDetail.vue_+_4_modules?')},ded03:function(module,exports,__webpack_require__){eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./src/components/Student/PaymentDetail.vue?./node_modules/mini-css-extract-plugin/dist/loader.js??ref--10-oneOf-1-0!./node_modules/@vue/cli-service/node_modules/css-loader/dist/cjs.js??ref--10-oneOf-1-1!./node_modules/@vue/cli-service/node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--10-oneOf-1-2!./node_modules/less-loader/dist/cjs.js??ref--10-oneOf-1-3!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/@vue/cli-service/node_modules/vue-loader/lib??vue-loader-options")}}]);