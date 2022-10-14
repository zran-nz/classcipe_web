(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-cd303bbe"],{"05d7":function(t,e,a){"use strict";a.r(e);var s=function(){var t=this,e=t.$createElement,s=t._self._c||e;return s("div",{staticClass:"my-full-form-wrapper",attrs:{id:"formRoot"}},[s("fixed-form-header",{scopedSlots:t._u([{key:"header",fn:function(){return[s("form-header",{attrs:{title:"School Space","show-share":!1,"show-collaborate":!1,"is-preview-mode":!0},on:{back:t.goBack},scopedSlots:t._u([{key:"back",fn:function(){return[s("img",{staticClass:"single-logo-img",attrs:{src:a("be50"),alt:"classcipe"},on:{click:function(e){return e.stopPropagation(),t.$router.push("/")}}})]},proxy:!0},{key:"left",fn:function(){return[s("a-space",{attrs:{size:5,align:"center"},on:{click:function(t){t.stopPropagation()}}},[s("label",{staticStyle:{cursor:"pointer"},on:{click:function(e){return t.$router.push("/account/info")}}},[t._v("Account Info")]),s("label",{attrs:{for:""}},[t._v(">")]),s("label",{staticStyle:{"font-weight":"normal"}},[t._v("School Space")])])]},proxy:!0},{key:"right",fn:function(){},proxy:!0}])})]},proxy:!0}])}),s("div",{staticClass:"form-content",attrs:{id:"formContent"}},[s("div",{staticClass:"account-info"},[s("div",{staticClass:"info-title"},[t._v(t._s(t.currentSchool.schoolName))]),s("div",{staticClass:"info-storage"},[s("a-progress",{staticClass:"cc-storage-progress",attrs:{percent:t.storageProgress,"show-info":!1}}),s("a",{attrs:{type:"link"},on:{click:t.handleUpgrade}},[t._v("Upgrade")])],1),s("div",{staticClass:"info-storage-desc"},[t._v(" "+t._s(t._f("sizeFormat")(t.consumedSize))+" of "+t._s(t._f("sizeFormat")(t.totalSize))+" ")])]),s("div",{staticClass:"content-detail"},[s("div",{staticClass:"status-tab"},[s("div",{staticClass:"tab-list"},t._l(t.tabsList,(function(e,a){return s("div",{key:"types"+a,class:{"tab-item":!0,active:t.currentTab===e.value},on:{click:function(a){return t.toggleTab(e.value)}}},[t._v(" "+t._s(e.title)+" ")])})),0)]),s("div",{staticClass:"filter-tab"},[s("a-space",{staticClass:"filter-search"},[s("a-input-search",{attrs:{placeholder:"Teacher Name"},on:{search:t.searchQuery},model:{value:t.queryParam.searchKey,callback:function(e){t.$set(t.queryParam,"searchKey",e)},expression:"queryParam.searchKey"}}),s("a-select",{staticStyle:{width:"200px"},attrs:{getPopupContainer:function(t){return t.parentElement},placeholder:"Please select subject"},on:{change:t.searchQuery},model:{value:t.queryParam.subject,callback:function(e){t.$set(t.queryParam,"subject",e)},expression:"queryParam.subject"}},t._l(t.subjectOptions,(function(e){return s("a-select-option",{key:e.subjectId},[t._v(" "+t._s(e.subjectName)+" ")])})),1),s("a-cascader",{attrs:{options:t.termsOptions,"allow-clear":!1,placeholder:"Please select term"},on:{change:t.onChangeTerm},model:{value:t.queryParam.termArr,callback:function(e){t.$set(t.queryParam,"termArr",e)},expression:"queryParam.termArr"}})],1),s("a-space",{staticClass:"filter-opt"},[s("a-button",{attrs:{type:"primary"},on:{click:t.handleSelectAll}},[t._v("Select All")]),s("a-button",{attrs:{type:""},on:{click:t.handleDelete}},[t._v("Delete selected items")])],1)],1),s("div",{staticClass:"filter-tab",staticStyle:{"margin-top":"-20px"}},[s("a-checkbox",{model:{value:t.queryParam.showUnlinked,callback:function(e){t.$set(t.queryParam,"showUnlinked",e)},expression:"queryParam.showUnlinked"}},[t._v("Show sessions unlinked to tasks")])],1),s("div",{staticClass:"item-tab"},[s("div",{staticClass:"item-con"},[s("div",{staticClass:"content-item-wrap"},[s("space-content-item",{attrs:{content:{}}})],1),s("div",{staticClass:"content-item-wrap"},[s("space-content-item",{attrs:{content:{}}})],1)])])])]),s("a-modal",{staticClass:"upgrade-modal",attrs:{destroyOnClose:"",title:"Upgrade Space",width:"800px",okText:"Upgrade"},on:{ok:t.doUpgrade},model:{value:t.spaceModal,callback:function(e){t.spaceModal=e},expression:"spaceModal"}},[s("div",{staticClass:"upgrade-con"},[s("space-plan",{ref:"spacePlan",attrs:{school:t.currentSchool},on:{select:t.handleSelect}}),s("div",{staticClass:"upgrade-duration"},[s("div",{staticClass:"duration-title"},[t._v("Duration")]),s("div",{staticClass:"duration-desc"},[s("p",[t._v("The space plan will be valid for the duration of your current plan.")]),s("p",[t._v("当前套餐名称 2022.5.13-2023.5.13")])])]),s("div",{staticClass:"upgrade-price"},[s("span",[t._v("Price: ")]),t._v("$1000")])],1)])],1)},n=[],c=a("3835"),i=a("5530"),o=(a("d3b7"),a("3ca3"),a("ddb0"),a("159b"),a("99af"),a("d81d"),a("b0c0"),a("fb6a"),a("f93e")),r=a("6e84"),l=a("21fb"),u=a("b5ff8"),d=a("b5a9"),h=function(){var t=this,e=t.$createElement,s=t._self._c||e;return t.content?s("div",{staticClass:"content-item"},[s("div",{staticClass:"item-title"},[s("a-checkbox",{model:{value:t.checked,callback:function(e){t.checked=e},expression:"checked"}},[t._v("The title")])],1),s("div",{staticClass:"item-user"},[s("div",{staticClass:"user-avatar"},[t.content.avatar?s("img",{attrs:{src:t.content.avatar,alt:""}}):s("img",{attrs:{src:a("4992"),alt:""}})]),t._m(0)]),t._m(1),t._m(2),s("div",{staticClass:"item-opt"},[s("a-dropdown",{attrs:{getPopupContainer:function(t){return t.parentElement}}},[s("a-icon",{attrs:{type:"more"}}),s("a-menu",{attrs:{slot:"overlay"},slot:"overlay"},[s("a-menu-item",[s("a",{attrs:{href:"javascript:;"},on:{click:function(e){return t.handleDelete(t.cls)}}},[t._v("Delete")])])],1)],1)],1)]):t._e()},p=[function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"user-detail"},[a("label",{attrs:{for:""}},[t._v("nime")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"item-desc"},[a("label",{staticClass:"desc-during"},[t._v("2021/11/05-2022/03/03 12:00")]),a("label",{staticClass:"desc-storage"},[t._v("20Mb")])])},function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"item-cover"},[a("div",{staticClass:"cover-block",staticStyle:{"background-image":"url('https://dcdkqlzgpl5ba.cloudfront.net/1393741943869063170/ppt/20220616/Q0nHcgzR8vOVqYQxIWV6BFlLXrmWUOOpOR7icIzXPOjJP5PhK7coZPF3kg93iMg4BCiCoM-FZa0qpPqNE6xFUX7fKe4bU6sWY0peKhbEH2l4iHUyLxkxQ4Bio3DrUPEv8wBthJGMPVTQORIoK9DbCEhl1eGXJtC7r0hBjivkc4G-EAEasxBSt9zK9AEHmhEvUOi5rx-I1zczCc1iADTfp3dopJDIYfnHobKLWi8tTC-3q2UiTcg=s800')"}}),a("div",{staticClass:"cover-tag"},[a("div",{staticClass:"tag-item"},[t._v("No linked task")])])])}],m={name:"SpaceContentItem",props:{content:{type:Object,default:function(){}}},data:function(){return{checked:!1}},methods:{handleDelete:function(){}}},f=m,v=(a("5baa"),a("0c7c")),b=Object(v["a"])(f,h,p,!1,null,"4d629107",null),C=b.exports,g=a("2f82"),y=a("e806"),k=a("9bfe"),S=a("2f62"),_=a("4fcf"),P=_.debounce,j={name:"SchoolSpace",mixins:[r["a"],l["a"]],components:{FixedFormHeader:u["a"],FormHeader:d["a"],SpacePlan:g["a"],SpaceContentItem:C},data:function(){return{USER_MODE:o["U"],SCHOOL_USER_STATUS:o["z"],unit:1073741824,currentTab:"Session",tabsList:[{value:"Session",title:"Session"},{value:"Content",title:"Content"}],subjectOptions:[],termsOptions:[],blockOptions:[],queryParam:{teacherName:"",term:"",termArr:[],subject:void 0,searchKey:"",showUnlinked:!1},loading:!1,spaceModal:!1}},created:function(){this.debounceLoad=P(this.loadData,300),this.initDict()},computed:Object(i["a"])(Object(i["a"])({},Object(S["e"])({info:function(t){return t.user.info},userMode:function(t){return t.app.userMode},currentSchool:function(t){return t.user.currentSchool}})),{},{consumedSize:function(){return this.userMode===o["U"].SELF?1024*this.info.usedSpace:1024*this.currentSchool.usedSpace},totalSize:function(){return this.info.planInfo?this.info.planInfo.storageSpace*this.unit:this.unit},storageProgress:function(){return Math.round(this.consumedSize/this.totalSize*100)}}),methods:{goBack:function(){this.$router.go(-1)},handleSchoolChange:function(t){this.userMode===o["U"].SCHOOL&&(this.queryParam.schoolId=t.id,this.initDict(),this.debounceInit())},handleModeChange:function(t){this.debounceInit()},toggleTab:function(t){this.currentTab=t},initDict:function(){var t=this;this.loading=!0,Promise.all([Object(k["a"])({schoolId:this.currentSchool.id}),Object(y["h"])({schoolId:this.currentSchool.id})]).then((function(e){var a=Object(c["a"])(e,2),s=a[0],n=a[1];if(s.success){var i=[];s.result.forEach((function(t){t.subjectList&&t.subjectList.length>0&&(i=i.concat(t.subjectList))})),t.subjectOptions=i}n.success&&(t.termsOptions=n.result.map((function(e){return{value:e.id,label:e.name,children:e.terms.map((function(e){return t.blockOptions[e.id]=e.block.blockSettings||[],{value:e.id,label:e.name}}))}})))})).finally((function(){t.loading=!1}))},loadData:function(){},searchQuery:function(){},onChangeTerm:function(t){t&&t.length>0?this.queryParam.term=t.slice(t.length-1)[0]:this.queryParam.term=""},handleUpgrade:function(){this.spaceModal=!0},handleSelectAll:function(){},doUpgrade:function(){},handleSelect:function(t){},handleDelete:function(){},handleSave:function(t){this.goBack()}}},O=j,w=(a("51da"),Object(v["a"])(O,s,n,!1,null,"0c7e7b3e",null));e["default"]=w.exports},"070a":function(t,e,a){},"0ee2":function(t,e,a){},"21fb":function(t,e,a){"use strict";a.d(e,"a",(function(){return s}));a("b0c0");var s={data:function(){return{unwatch:null,routeName:this.$route.name}},created:function(){var t=this;this.unwatch=this.$store.watch((function(t){return t.user.currentSchool}),(function(e){return e&&t.$route.name===t.routeName&&t.handleSchoolChange(e)}))},computed:{},beforeDestroy:function(){this.unwatch&&this.unwatch()},methods:{handleSchoolChange:function(t){}}}},"2f82":function(t,e,a){"use strict";var s=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"space-content"},[a("div",{staticClass:"space-content-item"},[a("div",{staticClass:"space-title"},[a("label",{attrs:{for:""}},[t._v("Vip Plan")]),a("a-tooltip",{attrs:{title:"Vip Plan"}},[a("a-icon",{attrs:{type:"question-circle",theme:"filled"}})],1)],1),a("div",{staticClass:"space-item-con"},[a("div",{staticClass:"space-item-wrap"},[a("div",{staticClass:"space-item"},[a("div",{staticClass:"item-title"},[t._v(" Free users ")]),a("div",{staticClass:"item-desc"},[t._v(" $0/month ")]),a("div",{staticClass:"item-opt"},[a("a-icon",{attrs:{type:"check-circle",theme:"filled"}})],1)])]),a("div",{staticClass:"space-item-wrap"},[a("div",{staticClass:"space-item"},[a("div",{staticClass:"item-title"},[t._v(" Professional Edition ")]),a("div",{staticClass:"item-desc"},[t._v(" $40/month ")]),a("div",{staticClass:"item-opt"},[a("span",{staticClass:"un-check"})],1)])])])]),a("div",{staticClass:"space-content-item"},[a("div",{staticClass:"space-title"},[a("label",{attrs:{for:""}},[t._v("Vip Plan")]),a("a-tooltip",{attrs:{title:"Vip Plan"}},[a("a-icon",{attrs:{type:"question-circle",theme:"filled"}})],1)],1),a("div",{staticClass:"space-item-con"},[a("div",{staticClass:"space-item-wrap"},[a("div",{staticClass:"space-item"},[a("div",{staticClass:"item-title"},[t._v(" Free users ")]),a("div",{staticClass:"item-desc"},[t._v(" $0/month ")]),a("div",{staticClass:"item-opt"},[a("a-icon",{attrs:{type:"check-circle",theme:"filled"}})],1)])]),a("div",{staticClass:"space-item-wrap"},[a("div",{staticClass:"space-item"},[a("div",{staticClass:"item-title"},[t._v(" Professional Edition ")]),a("div",{staticClass:"item-desc"},[t._v(" $40/month ")]),a("div",{staticClass:"item-opt"},[a("span",{staticClass:"un-check"})],1)])])])])])},n=[],c=a("5530"),i={name:"SpacePlan",props:{school:{type:Object,default:function(){}}},watch:{school:{handler:function(t){this.currentSchool=Object(c["a"])({},t),this.initData()},deep:!0,immediate:!0}},data:function(){return{currentSchool:this.school}},methods:{initData:function(){}}},o=i,r=(a("b8812"),a("0c7c")),l=Object(r["a"])(o,s,n,!1,null,"ec96378a",null);e["a"]=l.exports},4992:function(t,e,a){t.exports=a.p+"img/default-avatar.db1c5445.png"},"51da":function(t,e,a){"use strict";a("74bf")},"5baa":function(t,e,a){"use strict";a("0ee2")},"6e84":function(t,e,a){"use strict";a.d(e,"a",(function(){return s}));a("b0c0");var s={data:function(){return{unwatch:null,routeName:this.$route.name}},computed:{redirectUrl:function(){return"student"===this.$store.state.user.currentRole?"/student/main/my-task":"/account/info"}},created:function(){var t=this;this.unwatch=this.$store.watch((function(t){return t.app.userMode}),(function(e){e&&t.$route.name===t.routeName&&(t.handleModeChange(e),t.routeInMode())})),this.routeInMode()},beforeDestroy:function(){this.unwatch&&this.unwatch()},methods:{routeInMode:function(){this.$route.meta.mode&&this.$route.meta.mode!==this.$store.state.app.userMode&&this.$router.push({path:this.redirectUrl})},handleModeChange:function(t){}}}},"74bf":function(t,e,a){},b8812:function(t,e,a){"use strict";a("070a")},e806:function(t,e,a){"use strict";a.d(e,"a",(function(){return i})),a.d(e,"c",(function(){return o})),a.d(e,"d",(function(){return r})),a.d(e,"b",(function(){return l})),a.d(e,"e",(function(){return u})),a.d(e,"f",(function(){return d})),a.d(e,"g",(function(){return h})),a.d(e,"h",(function(){return p}));var s=a("b775"),n="academic/academicTermInfo",c={addTerm:"/classcipe/".concat(n,"/addTerm"),addYear:"/classcipe/".concat(n,"/addYear"),deleteTerm:"/classcipe/".concat(n,"/deleteTerm"),deleteYear:"/classcipe/".concat(n,"/deleteYear"),editTerm:"/classcipe/".concat(n,"/editTerm"),editYear:"/classcipe/".concat(n,"/editYear"),saveBlockSetting:"/classcipe/".concat(n,"/saveBlockSetting"),termList:"/classcipe/".concat(n,"/termList")};function i(t){return Object(s["d"])({url:c.addTerm,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function o(t){return Object(s["d"])({url:c.deleteTerm,method:"delete",params:t})}function r(t){return Object(s["d"])({url:c.deleteYear,method:"delete",params:t})}function l(t){return Object(s["d"])({url:c.addYear,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function u(t){return Object(s["d"])({url:c.editTerm,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function d(t){return Object(s["d"])({url:c.editYear,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function h(t){return Object(s["d"])({url:c.saveBlockSetting,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function p(t){return Object(s["d"])({url:c.termList,method:"get",params:t})}}}]);