(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-75031bb4"],{"09ec":function(e,t,n){"use strict";n("9675")},3236:function(e,t,n){"use strict";n.r(t);var r=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("a-card",{style:{height:"100%"},attrs:{bordered:!1,bodyStyle:{padding:"16px 24px",height:"100%"}}},[n("a-layout",[n("a-layout-sider",[n("a-space",{staticClass:"school-name",attrs:{size:5,align:"center"},on:{click:function(e){e.stopPropagation()}}},[n("label",{staticStyle:{cursor:"pointer"},on:{click:function(t){return e.$router.push("/account/info")}}},[e._v("Account Info")]),n("label",{attrs:{for:""}},[e._v(">")]),n("label",{staticStyle:{"font-weight":"normal"}},[e._v("Orders")])]),n("s-menu",{attrs:{mainRouter:e.mainRouter,fromRole:"",currentRouterName:e.currentRouterName,initSelected:e.selectedKey,hiddenRoute:e.hiddenRoute,className:"cc-menu",iconTheme:"outlined"}})],1),n("a-layout-content",{staticClass:"main-content"},[n("router-view")],1)],1)],1)},u=[],c=n("5530"),o=n("c0d2"),a=n("f93e"),i=n("255b"),s=n("2f62"),l={name:"Main",components:{SMenu:i["a"],PageHeaderWrapper:o["b"]},data:function(){return{selectedKey:"/manage/order/buy",currentRouterName:"manage",mainRouter:"Order",curriculumType:a["h"]}},computed:Object(c["a"])(Object(c["a"])({},Object(s["e"])({bindCurriculum:function(e){return e.user.bindCurriculum},currentSchool:function(e){return e.user.currentSchool},userMode:function(e){return e.app.userMode}})),{},{head:function(){return this.userMode===a["X"].SELF?"Personal managing":this.currentSchool.schoolName+" managing"}}),mounted:function(){},methods:{handleMenuSelect:function(e){var t=e.key;this.$router.push({path:t})},hiddenRoute:function(e){return!(!e.meta.curriculumType||e.meta.curriculumType+""===this.bindCurriculum)||!(!e.meta.mode||e.meta.mode===this.userMode)}}},d=l,m=(n("09ec"),n("92d2"),n("0c7c")),h=Object(m["a"])(d,r,u,!1,null,"b87e4f80",null);t["default"]=h.exports},"92d2":function(e,t,n){"use strict";n("9ef9")},9675:function(e,t,n){},"9ef9":function(e,t,n){}}]);