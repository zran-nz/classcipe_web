(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-bc39eb10"],{1778:function(e,t,s){"use strict";s.d(t,"c",(function(){return n})),s.d(t,"a",(function(){return r})),s.d(t,"b",(function(){return o})),s.d(t,"d",(function(){return c})),s.d(t,"e",(function(){return l}));s("ac1f");var a=s("b775"),i={search:"/classcipe/api/v2/library/search",getLibraryRecommend:"/classcipe/api/v2/library/getLibraryRecommend",getLibraryResource:"/classcipe/api/v2/library/getLibraryResource",queryAllResource:"/classcipe/api/v2/library/queryAllResource",queryLibraryResource:"/classcipe/api/v2/library/queryLibraryResource"};function n(e){return Object(a["d"])({url:i.search,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function r(e){return Object(a["d"])({url:i.getLibraryRecommend,method:"get",params:e})}function o(e){return Object(a["d"])({url:i.getLibraryResource,method:"get",params:e})}function c(e){return Object(a["d"])({url:i.queryAllResource,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function l(e){return Object(a["d"])({url:i.queryLibraryResource,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}},"270a":function(e,t,s){},3881:function(e,t,s){"use strict";var a=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"user-profile-avatar"},[a("div",{staticClass:"notification",on:{click:e.handleToNotification}},[a("a-badge",{attrs:{count:e.msg1Count}},[a("a-icon",{style:{fontSize:"20px",color:"#999"},attrs:{type:"mail"}})],1)],1),a("a-dropdown",{attrs:{getPopupContainer:function(e){return e.parentElement}}},[e.$store.getters.userInfo.avatar?a("a-avatar",{attrs:{src:e.$store.getters.userInfo.avatar}}):a("img",{attrs:{src:s("4992")}}),a("div",{staticClass:"profile-info",attrs:{slot:"overlay"},slot:"overlay"},[a("div",{staticClass:"base-info"},[a("div",{staticClass:"avatar"},[e.$store.getters.userInfo.avatar?a("a-avatar",{attrs:{src:e.$store.getters.userInfo.avatar}}):a("img",{attrs:{src:s("4992")}})],1),a("div",{staticClass:"base"},[a("div",{staticClass:"name"},[e._v(e._s(e.$store.getters.userInfo.firstname)+" "+e._s(e.$store.getters.userInfo.lastname))]),a("div",{staticClass:"email"},[e._v(e._s(e.$store.getters.userInfo.email))])])]),a("div",{staticClass:"storage-info"},[a("a-progress",{staticClass:"cc-storage-progress",attrs:{percent:e.storageProgress,"show-info":!1}}),a("div",{staticClass:"storage-info-text"},[e._v(" "+e._s(e._f("sizeFormat")(e.consumedSize))+" of "+e._s(e._f("sizeFormat")(e.totalSize))+" ")])],1),a("div",{staticClass:"plan-upgrade"},[a("a-space",[e.info.planInfo&&!e.info.planInfo.freeUsePlan?a("div",{staticClass:"free-plan"},[e._v(e._s(e.info.planInfo.planName))]):a("div",{staticClass:"free-plan"},[e._v("Free plan")]),a("div",{staticClass:"upgrade"},[e._v("Upgrade")])]),e.info.planInfo.planUser&&e.info.planInfo.planUser.planEndTime&&!e.info.planInfo.freeUsePlan?a("div",{staticClass:"plan-end"},[e._v(" Ends on "+e._s(e.info.planInfo.planUser.planEndTime)+" ")]):e._e()],1),a("a-divider",{staticClass:"cc-small-divider"}),a("div",{staticClass:"class-info"},[a("div",{staticClass:"class-list"},[a("div",{class:{"class-item":!0,active:e.userMode===e.USER_MODE.SELF},on:{click:e.handleChangePersonal}},[a("div",{staticClass:"class-avatar"},[e.$store.getters.userInfo.avatar?a("a-avatar",{attrs:{src:e.$store.getters.userInfo.avatar}}):a("img",{attrs:{src:s("4992")}})],1),a("div",{staticClass:"class-base-info"},[a("div",{staticClass:"class-name"},[e._v("Personal")]),a("div",{staticClass:"class-updated-by"},[e._v(e._s(e.$store.getters.userInfo.email))])])]),e._l(e.info.schoolList,(function(t){return a("div",{key:t.id,class:{"class-item":!0,active:e.userMode===e.USER_MODE.SCHOOL&&e.currentSchool.schoolName===t.schoolName},on:{click:function(s){return e.handleChangeSchool(t)}}},[a("div",{staticClass:"class-avatar"},[a("a-avatar",{staticStyle:{color:"#f56a00",backgroundColor:"#fde3cf"}},[e._v(" "+e._s(t.schoolName?t.schoolName[0].toUpperCase():"C")+" ")])],1),a("div",{staticClass:"class-base-info"},[a("div",{staticClass:"class-name"},[e._v(e._s(t.schoolName))]),a("div",{staticClass:"class-updated-by"},[t.roleNames.length>1||"teacher"!==t.roleNames[0].toLowerCase()?e._l(t.roleNames.filter((function(e){return"teacher"!==e.toLowerCase()})),(function(t){return a("div",{key:t,staticClass:"role-name"},[e._v(e._s(t))])})):a("div",{staticClass:"role-name"},[e._v("Teacher")])],2)])])}))],2)]),a("a-divider",{staticClass:"cc-small-divider"}),e.isAuth?a("div",{staticClass:"account profile-menu-item",on:{click:e.handleToAccounts}},[e.userMode===e.USER_MODE.SCHOOL?[e._v(" School account ")]:[e._v(" Account ")]],2):e._e(),a("div",{staticClass:"logout profile-menu-item",on:{click:e.handleLogout}},[e._v(" Logout ")])],1)],1)],1)},i=[],n=(s("cd17"),s("ed3b")),r=s("5530"),o=(s("99af"),s("d3b7"),s("d81d"),s("caad"),s("2532"),s("2f62")),c=s("c24f"),l=s("9fb0"),u=s("f93e"),h=s("6757"),d=s("0bb4"),f=s("8ee6"),v={name:"UserProfileAvatar",data:function(){return{unit:1073741824,schoolUserRole:h["a"],USER_MODE:u["X"],msg1Count:"0",msg2Count:"0",stopTimer:!1}},computed:Object(r["a"])(Object(r["a"])({},Object(o["e"])({info:function(e){return e.user.info},currentSchool:function(e){return e.user.currentSchool},userMode:function(e){return e.app.userMode}})),{},{msgTotal:function(){return parseInt(this.msg1Count)+parseInt(this.msg2Count)},consumedSize:function(){return this.userMode===u["X"].SELF?1024*this.info.usedSpace:1024*this.currentSchool.usedSpace},totalSize:function(){return this.info.planInfo?this.info.planInfo.storageSpace*this.unit:this.unit},storageProgress:function(){return Math.round(this.consumedSize/this.totalSize*100)},isAuth:function(){return!0}}),created:function(){this.initData(),this.hasSetCurriculum()},methods:Object(r["a"])(Object(r["a"])(Object(r["a"])({},Object(o["d"])([l["M"],"SET_CURRENT_SCHOOL"])),Object(o["b"])(["GetClassList"])),{},{timerFun:function(){var e=this;this.stopTimer=!1;var t=setInterval((function(){e.stopTimer?clearInterval(t):e.loadData()}),6e3)},initData:function(){var e=this;Object(d["c"])().then((function(t){t.success&&(e.announcement1=t.result.anntMsgList,e.msg1Count=t.result.anntMsgTotal,e.$store.commit("SET_UNREAD_COUNT",e.msg1Count?e.msg1Count:0),e.$store.commit("SET_SHARED_COUNT",t.result.collaborate?t.result.collaborate:0))})).catch((function(t){e.$logger.error("系统消息通知异常",t),e.stopTimer=!0,e.$logger.error("清理timer")}))},handleToSettings:function(){this.$router.push({path:"/account/settings"})},handleToAccounts:function(){this.$router.push({path:"/account/info"})},handleToNotification:function(){this.$router.push({path:"/notification"})},handleLogout:function(e){var t=this;n["a"].confirm({title:this.$t("layouts.usermenu.dialog.title"),content:this.$t("layouts.usermenu.dialog.content"),onOk:function(){var e="CURICULUM_SET_".concat(t.userMode,"_").concat(t.currentSchool.id,"_").concat(t.info.id);return t.$store.dispatch("Logout").then((function(){sessionStorage.removeItem(e),t.$router.push({name:"login"})}))},onCancel:function(){}})},handleChangePersonal:function(){var e=this;Object(c["c"])({isPersonal:!0,schoolId:""}).finally((function(){e[l["M"]](u["X"].SELF),e.GetClassList(),e.$store.dispatch("GetInfo").then((function(t){e.hasSetCurriculum()}))}))},handleChangeSchool:function(e){var t=this;Object(c["c"])({isPersonal:!1,schoolId:e.id}).then((function(s){t[l["M"]](u["X"].SCHOOL),t.GetClassList(e.id),t.$store.dispatch("GetInfo").then((function(e){t.hasSetCurriculum()}))}))},hasSetCurriculum:function(){var e=this;Object(f["a"])({schoolId:this.currentSchool.id}).then((function(t){0===t.code&&(t.result&&t.result.length>0?0===t.result[0].gradeSettingInfo.length&&e.doConfirmGoCuriculum():e.doConfirmGoCuriculum())}))},doConfirmGoCuriculum:function(){var e=this,t="CURICULUM_SET_".concat(this.userMode,"_").concat(this.currentSchool.id,"_").concat(this.info.id),s=sessionStorage.getItem(t);s||this.$confirm({title:"Curriculum Set",content:"Please Set Curriculum first",centered:!0,cancelButtonProps:{style:{display:"none"}},onOk:function(){sessionStorage.setItem(t,1),e.$router.push("/manage/curriculum")},onCancel:function(){}})},hasRolePermission:function(e){var t=!1;if(this.userMode===u["X"].SCHOOL&&this.currentSchool.roleNames){var s=this.currentSchool.roleNames.map((function(e){return e.toLowerCase()}));t=s.includes(e)}return t}})},p=v,m=(s("7f05"),s("0c7c")),g=Object(m["a"])(p,a,i,!1,null,"7d3c1a28",null);t["a"]=g.exports},"5a71":function(e,t,s){"use strict";s("dba5")},"7f05":function(e,t,s){"use strict";s("270a")},c44c:function(e,t,s){var a=s("b2b7");e.exports={__esModule:!0,default:a.svgComponent({tag:"svg",attrsMap:{t:"1651919287086",class:"icon",viewBox:"0 0 1024 1024",version:"1.1",xmlns:"http://www.w3.org/2000/svg","p-id":"3862","xmlns:xlink":"http://www.w3.org/1999/xlink",width:"48",height:"48"},children:[{tag:"defs"},{tag:"path",attrsMap:{d:"M1011.699621 955.59682l-299.842879-300.13541a400.32681 400.32681 0 1 0-56.555731 56.75075l299.84288 300.086654a39.686521 39.686521 0 0 0 28.277865 11.701186 41.636719 41.636719 0 0 0 28.765415-11.701186 39.784031 39.784031 0 0 0-0.48755-56.701994zM80.480272 401.594439a320.807504 320.807504 0 1 1 320.807503 321.148788 321.295053 321.295053 0 0 1-320.807503-321.343808z","p-id":"3863"}}]})}},cd3e:function(e,t,s){"use strict";var a=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"global-search-input"},[s("div",{staticClass:"search-icon"},[s("a-icon",{attrs:{type:"search"},nativeOn:{click:function(t){return e.activeSearchInput.apply(null,arguments)}}})],1),s("div",{directives:[{name:"show",rawName:"v-show",value:e.showSearchWrapper,expression:"showSearchWrapper"}],staticClass:"global-search"},[s("div",{staticClass:"search-input-line"},[s("div",{staticClass:"search-back"},[s("a-icon",{style:{color:"#999",fontSize:"16px"},attrs:{type:"arrow-left"},on:{click:e.handleBack}})],1),s("div",{staticClass:"search-input"},[s("input",{directives:[{name:"model",rawName:"v-model",value:e.searchKeyword,expression:"searchKeyword"}],attrs:{id:"search-input",placeholder:"Search..."},domProps:{value:e.searchKeyword},on:{keyup:[e.handleSearch,function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.emitSearchEvent(e.searchKeyword)}],input:function(t){t.target.composing||(e.searchKeyword=t.target.value)}}})]),s("div",{directives:[{name:"show",rawName:"v-show",value:e.searchKeyword.length>0,expression:"searchKeyword.length > 0"}],staticClass:"search-clear",on:{click:e.handleSearchClear}},[s("a-icon",{attrs:{type:"close"}})],1)]),s("div",{staticClass:"search-recommend-list"},[s("div",{directives:[{name:"show",rawName:"v-show",value:e.searchKeyword,expression:"searchKeyword"}],staticClass:"do-search",on:{click:function(t){return e.emitSearchEvent(e.searchKeyword)}}},[s("div",{staticClass:"icon"},[s("a-icon",{style:{color:"#999",fontSize:"16px"},attrs:{type:"search"}})],1),s("div",{staticClass:"search-content-left"},[e._v(' Search "'),s("span",{staticClass:"bold"},[e._v(e._s(e.searchKeyword))]),e._v('" ')])]),s("div",{directives:[{name:"show",rawName:"v-show",value:e.showSearchHistory,expression:"showSearchHistory"}],staticClass:"search-history"},e._l(e.historyList,(function(t){return s("div",{key:t,staticClass:"list-item",on:{click:function(s){return e.emitSearchEvent(t)}}},[s("div",{staticClass:"icon"},[s("a-icon",{style:{color:"#999",fontSize:"16px"},attrs:{type:"clock-circle",theme:"filled"}})],1),s("div",{staticClass:"search-content"},[e._v(" "+e._s(t)+" ")])])})),0),s("div",{directives:[{name:"show",rawName:"v-show",value:e.showSearchRecommend,expression:"showSearchRecommend"}],staticClass:"recommend-list"},[e._l(e.similarList,(function(t,a){return s("div",{key:a,staticClass:"list-item",on:{click:function(s){return e.emitSearchEvent(t.name)}}},[s("div",{staticClass:"icon similar-icon"},[e._v(" # ")]),s("div",{staticClass:"search-content"},[s("div",{staticClass:"content-name"},[e._v(" "+e._s(t.name)+" ")])])])})),e._l(e.pdList,(function(t){return s("div",{key:t.id,staticClass:"list-item",on:{click:function(s){return e.viewItem(t)}}},[e._m(0,!0),s("div",{staticClass:"search-content"},[s("div",{staticClass:"content-name"},[e._v(" "+e._s(t.name)+" ")])])])})),e._l(e.planList,(function(t){return s("div",{key:t.id,staticClass:"list-item",on:{click:function(s){return e.viewItem(t)}}},[e._m(1,!0),s("div",{staticClass:"search-content"},[s("div",{staticClass:"content-name"},[e._v(" "+e._s(t.name)+" ")])])])})),e._l(e.taskList,(function(t){return s("div",{key:t.id,staticClass:"list-item",on:{click:function(s){return e.viewItem(t)}}},[e._m(2,!0),s("div",{staticClass:"search-content"},[s("div",{staticClass:"content-name"},[e._v(" "+e._s(t.name)+" ")])])])}))],2),e.searching?s("div",{staticClass:"searching"},[s("a-spin",[s("a-icon",{staticStyle:{"font-size":"24px"},attrs:{slot:"indicator",type:"loading",spin:"",tip:"searching..."},slot:"indicator"})],1)],1):e._e()]),s("div",{staticClass:"bg-mask",on:{click:e.handleBack}})]),e.previewVisible?s("content-preview",{attrs:{"content-id":e.previewCurrentId,"content-type":e.previewType},on:{close:e.handlePreviewClose}}):e._e()],1)},i=[function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"icon"},[s("div",{staticClass:"tag-icon"},[e._v("PD")])])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"icon"},[s("div",{staticClass:"tag-icon"},[e._v("Unit")])])},function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{staticClass:"icon"},[s("div",{staticClass:"tag-icon"},[e._v("Task")])])}],n=s("5530"),r=(s("498a"),s("a434"),s("fb6a"),s("ac1f"),s("841c"),s("d3b7"),s("159b"),s("b0c0"),s("c44c")),o=s.n(r),c=s("85b1"),l=s("1778"),u=s("ce85"),h=s("f031"),d={name:"GlobalSearchInput",components:{ContentPreview:u["a"],SearchIcon:o.a},mixins:[h["a"]],data:function(){return{data:null,searchKeyword:"",showSearchWrapper:!1,searching:!1,handleSearch:null,pdList:[],planList:[],similarList:[],taskList:[],historyList:[]}},computed:{showSearchHistory:function(){return null===this.searchKeyword||""===this.searchKeyword.trim()},showSearchRecommend:function(){return this.searchKeyword}},created:function(){this.handleSearch=Object(c["a"])(this.doSearch,1e3),this.restoreSearchKey()},methods:{storeSearchKey:function(){var e=this.$store.getters.userInfo.id;window.sessionStorage.setItem("".concat(e,"_search_key_list"),JSON.stringify(this.historyList))},restoreSearchKey:function(){var e=this.$store.getters.userInfo.id,t=window.sessionStorage.getItem("".concat(e,"_search_key_list"));this.historyList=t?JSON.parse(t):[]},handleSearchClear:function(){this.searchKeyword="",this.recommendList=[]},handleBack:function(){this.$logger.info("handleBack"),this.showSearchWrapper=!1},doSearch:function(){var e=this.searchKeyword.trim();if(e){var t=this.historyList.indexOf(e);-1!==t&&this.historyList.splice(t,1),this.historyList.unshift(e),this.historyList.length>5&&(this.historyList=this.historyList.slice(0,5)),this.storeSearchKey(),this.search(e)}},search:function(e){var t=this;this.$logger.info("search",e),this.searching=!0,this.recommendList=[],Object(l["c"])({key:e}).then((function(s){t.$logger.info("searchByKeyword "+e,s);var a=[],i=s.result.similarList;t.pdList=s.result.pdList,t.planList=s.result.planList,t.taskList=s.result.taskList,i.forEach((function(t){if(t.name&&!a.some((function(e){return e.name===t.name}))){var s=0,i=t.name.toLowerCase().indexOf(e),n="";while(-1!==i&&i+e.length<=t.name.length)n+=t.name.substring(s,i)+'<span class="search-keyword-item">'+t.name.substring(i,i+e.length)+"</span>",s=i+e.length,i=t.name.toLowerCase().indexOf(e,i+e.length);n+=t.name.substring(s);var r={fromType:t.fromType,name:t.name,tagName:n,id:t.id};a.push(r)}})),t.similarList=i})).finally((function(){t.searching=!1}))},activeSearchInput:function(){this.showSearchWrapper=!0,this.$nextTick((function(){document.getElementById("search-input").focus()}))},emitSearchEvent:function(e){this.$logger.info("emitSearchEvent",e),this.$emit("search",e),this.handleBack()},viewItem:function(e){this.$logger.info("viewItem",e);var t=Object(n["a"])(Object(n["a"])({},e),{},{type:parseInt(e.fromType)});this.showSearchWrapper=!1,this.handlePreviewDetail(t)}}},f=d,v=(s("5a71"),s("0c7c")),p=Object(v["a"])(f,a,i,!1,null,"33c6e69c",null);t["a"]=p.exports},dba5:function(e,t,s){},f031:function(e,t,s){"use strict";s.d(t,"a",(function(){return r}));var a=s("1da1"),i=(s("96cf"),s("d81d"),s("0481"),s("b0c0"),s("c621")),n=s("944d"),r={data:function(){return{allowPreview:!0,previewCurrentId:null,previewType:null,previewCode:null,previewVisible:!1,updateEditSlideLoading:!1,setColor:["#FFEDAF","#C8F4FF","#E6E4FF","#ffccb0","#ffa9a2","#a3ecb9","#f7c5f8","#ffbfe2","#d5b9ff","#c4f6b1"],savingSlides:!1}},computed:{commandTermsList:function(){return Object(n["a"])(this.content.learnOuts.map((function(e){return e.commandTerms})).flat(2),"name").map((function(e){return e.name}))},knowledgeTagsList:function(){return Object(n["a"])(this.content.learnOuts.map((function(e){return e.knowledgeTags})).flat(2),"name").map((function(e){return e.name}))}},methods:{handlePreviewDetail:function(e){var t=this;this.$logger.info("handlePreviewDetail",e,"allowPreview",this.allowPreview),this.allowPreview&&(this.previewVisible=!1,this.$nextTick((function(){t.previewCurrentId=e.id,t.previewType=e.type,t.previewCode=e.sessionId,t.previewVisible=!0})),this.$emit("preview",e))},handlePreviewClose:function(){this.$logger.info("handlePreviewClose"),this.previewVisible=!1,this.previewCurrentId=null,this.previewType=null,this.previewCode=null},updateEditSlideStatus:function(){var e=this;return Object(a["a"])(regeneratorRuntime.mark((function t(){var s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(e.updateEditSlideLoading){t.next=20;break}if(t.prev=1,e.updateEditSlideLoading=!0,s=parseInt(e.content.type),s!==e.$classcipe.typeMap.task){t.next=9;break}return t.next=7,Object(i["c"])({taskId:e.content.id,needRefresh:!0});case 7:t.next=12;break;case 9:if(s!==e.$classcipe.typeMap.pd){t.next=12;break}return t.next=12,Object(i["c"])({taskId:e.content.id,needRefresh:!0});case 12:e.content.slideEditing=!1,t.next=17;break;case 15:t.prev=15,t.t0=t["catch"](1);case 17:return t.prev=17,e.updateEditSlideLoading=!1,t.finish(17);case 20:case"end":return t.stop()}}),t,null,[[1,15,17,20]])})))()}}}}}]);