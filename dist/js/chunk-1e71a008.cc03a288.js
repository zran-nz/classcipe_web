(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1e71a008"],{"093a":function(t,e,a){"use strict";a.d(e,"a",(function(){return i})),a.d(e,"c",(function(){return r})),a.d(e,"b",(function(){return c}));var n=a("b775"),s={VideoAddOrUpdate:"/classcipe/api/v2/video/addOrUpdate",VideoQueryById:"/classcipe/api/v2/video/queryById",VideoDelete:"/classcipe/api/v2/video/delete",VideoDeleteBatch:"/classcipe/api/v2/video/deleteBatch",VideoList:"/classcipe/api/v2/video/list"};function i(t){return Object(n["d"])({url:s.VideoAddOrUpdate,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function r(t){return Object(n["d"])({url:s.VideoQueryById,method:"get",params:t})}function c(t){return Object(n["d"])({url:s.VideoDelete+"?id="+t.id,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}},1474:function(t,e,a){},"1da17":function(t,e,a){"use strict";a.r(e);var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"task-content-select"},[a("content-select",{attrs:{type:t.type,title:t.type===t.typeMap.task?"Select Task content":"Select PD content"},on:{choose:t.handleChoose,cancel:t.handleCloseImport}})],1)},s=[],i=(a("a9e3"),a("81d3")),r=a("3f76"),c={name:"TaskContentSelect",props:{type:{type:Number,default:void 0}},components:{ContentSelect:i["a"]},data:function(){return{typeMap:r["e"]}},methods:{handleChoose:function(t){this.$router.push({path:"/teacher/live-workshop/"+t.id+"/"+t.type})},handleCloseImport:function(){if(window.history.length<=1)return this.$router.push({path:"/teacher/main/live-workshops"}),!1;this.$router.go(-1)}}},o=c,d=(a("a1e8"),a("0c7c")),u=Object(d["a"])(o,n,s,!1,null,"60b275b1",null);e["default"]=u.exports},"21fb":function(t,e,a){"use strict";a.d(e,"a",(function(){return n}));a("b0c0");var n={data:function(){return{unwatch:null,routeName:this.$route.name}},created:function(){var t=this;this.unwatch=this.$store.watch((function(t){return t.user.currentSchool}),(function(e){return e&&t.$route.name===t.routeName&&t.handleSchoolChange(e)}))},computed:{},beforeDestroy:function(){this.unwatch&&this.unwatch()},methods:{handleSchoolChange:function(t){}}}},3404:function(t,e,a){var n=a("b2b7");t.exports={__esModule:!0,default:n.svgComponent({tag:"svg",attrsMap:{t:"1654058113220",class:"icon",viewBox:"0 0 1024 1024",version:"1.1",xmlns:"http://www.w3.org/2000/svg","p-id":"4384","xmlns:xlink":"http://www.w3.org/1999/xlink",width:"48",height:"48"},children:[{tag:"defs"},{tag:"path",attrsMap:{d:"M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z",fill:"#8094B2","p-id":"4385"}},{tag:"path",attrsMap:{d:"M521.671111 189.62963a156.292741 156.292741 0 0 1 153.979259 130.844444 123.505778 123.505778 0 0 1 36.598519-5.688889 125.345185 125.345185 0 0 1 87.988148 36.02963 122.88 122.88 0 0 1 2.844444 170.913185l29.392593 29.278815a130.123852 130.123852 0 0 1 29.582222 43.33037 132.020148 132.020148 0 0 1 10.24 51.617185v36.295111a48.772741 48.772741 0 0 1-8.722963 27.83763 37.717333 37.717333 0 0 1-26.548148 15.985778 7.149037 7.149037 0 0 1-2.654815 0.341333h-28.634074v9.481482a22.33837 22.33837 0 0 1-22.755555 22.546963H259.982222a22.452148 22.452148 0 0 1-22.755555-22.546963v-9.481482h-28.444445a7.149037 7.149037 0 0 1-2.654815-0.341333 37.338074 37.338074 0 0 1-26.548148-15.985778A48.96237 48.96237 0 0 1 170.666667 682.249481v-36.295111a131.242667 131.242667 0 0 1 39.822222-94.966518l29.582222-29.278815a122.159407 122.159407 0 0 1 3.034074-170.913185 124.548741 124.548741 0 0 1 87.798519-36.02963 120.414815 120.414815 0 0 1 36.408889 5.688889 156.387556 156.387556 0 0 1 154.358518-130.844444m69.973333 523.946666v-20.10074l0.37926-1.896297v-80.137481a13.558519 13.558519 0 1 1 27.117037 0v59.316148h58.785185a10.448593 10.448593 0 0 0 1.137778-5.12v-47.597037a120.794074 120.794074 0 0 0-9.102223-48.146963 139.320889 139.320889 0 0 0-14.601481-25.391407l-0.379259-0.341334v-0.189629l-0.37926-0.303408-0.379259-0.360296a135.168 135.168 0 0 0-11.946666-13.520593l-48.924445-48.488296a154.680889 154.680889 0 0 1-71.68 17.768296 157.013333 157.013333 0 0 1-72.248889-17.768296l-48.545185 48.488296a137.765926 137.765926 0 0 0-12.136296 13.520593v0.360296l-0.568889 0.303408v0.170666l-0.379259 0.341334a151.381333 151.381333 0 0 0-14.601482 25.391407 124.245333 124.245333 0 0 0-9.291852 48.146963v47.597037a13.103407 13.103407 0 0 0 1.137778 5.12h58.785185v-59.297185a13.748148 13.748148 0 0 1 27.496297 0v102.153481h140.325925z m-69.973333-259.621926a109.530074 109.530074 0 1 0-110.554074-109.70074 110.08 110.08 0 0 0 110.554074 109.70074M283.117037 713.576296h66.180741a42.116741 42.116741 0 0 1-20.66963-15.947852 55.333926 55.333926 0 0 1-10.24-31.971555v-47.634963a163.972741 163.972741 0 0 1 9.671111-56.888889 135.907556 135.907556 0 0 1-51.01037-12.193185l-34.322963 33.583407a98.929778 98.929778 0 0 0-19.911111 29.108148v0.18963a91.268741 91.268741 0 0 0-6.447408 34.133333v35.19526h39.442963v-39.822223a13.786074 13.786074 0 0 1 13.842963-13.577481 13.463704 13.463704 0 0 1 13.463704 13.577481v72.248889z m84.385185-344.670815a126.008889 126.008889 0 0 0-13.084444-5.575111 83.437037 83.437037 0 0 0-23.514074-3.39437 80.554667 80.554667 0 0 0-55.751111 22.85037 77.615407 77.615407 0 0 0 0 110.174815 80.384 80.384 0 0 0 71.30074 21.409185c3.223704-0.967111 6.447407-1.744593 9.481482-2.711703 3.982222-4.645926 8.154074-9.481481 12.705185-13.748148l43.994074-43.330371-1.137778-0.967111h-0.189629a158.53037 158.53037 0 0 1-41.718519-74.619259 58.235259 58.235259 0 0 0-1.517037-7.243852v-0.796445l-0.18963-0.625777z m392.533334 344.670815v-72.248889a13.387852 13.387852 0 0 1 13.653333-13.577481 13.615407 13.615407 0 0 1 13.653333 13.577481v39.822223h39.632593v-35.176297a87.798519 87.798519 0 0 0-6.826667-34.133333h0.379259l-0.379259-0.18963a94.644148 94.644148 0 0 0-19.721481-29.108148l-34.512593-33.583407a133.328593 133.328593 0 0 1-51.01037 12.193185 163.972741 163.972741 0 0 1 9.671111 56.888889V665.6a56.357926 56.357926 0 0 1-9.860741 31.952593 44.316444 44.316444 0 0 1-20.859259 15.947851h66.180741z m-84.385186-344.670815l-0.379259 1.441186v0.625777l-0.379259 0.474075v0.360296a158.53037 158.53037 0 0 1-43.045926 81.806222h-0.18963l-0.948148 0.967111 43.614815 43.330371a158.473481 158.473481 0 0 1 12.894815 13.748148c2.844444 0.967111 6.068148 1.744593 9.481481 2.711703a80.801185 80.801185 0 0 0 15.54963 1.441186A78.336 78.336 0 0 0 767.81037 493.037037a77.160296 77.160296 0 0 0 0-110.174815 79.056593 79.056593 0 0 0-55.561481-22.85037 83.437037 83.437037 0 0 0-23.514074 3.39437c-4.361481 1.72563-8.912593 3.508148-13.084445 5.575111",fill:"#FFFFFF","p-id":"4386"}}]})}},4133:function(t,e,a){"use strict";a("973f")},4992:function(t,e,a){t.exports=a.p+"img/default-avatar.db1c5445.png"},"6e84":function(t,e,a){"use strict";a.d(e,"a",(function(){return n}));a("b0c0");var n={data:function(){return{unwatch:null,routeName:this.$route.name}},computed:{redirectUrl:function(){return"student"===this.$store.state.user.currentRole?"/student/main/my-task":"/account/info"}},created:function(){var t=this;this.unwatch=this.$store.watch((function(t){return t.app.userMode}),(function(e){e&&t.$route.name===t.routeName&&(t.handleModeChange(e),t.routeInMode())})),this.routeInMode()},beforeDestroy:function(){this.unwatch&&this.unwatch()},methods:{routeInMode:function(){this.$route.meta.mode&&this.$route.meta.mode!==this.$store.state.app.userMode&&this.$router.push({path:this.redirectUrl})},handleModeChange:function(t){}}}},"81d3":function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"content-select"},[n("div",{directives:[{name:"show",rawName:"v-show",value:t.title,expression:"title"}],staticClass:"content-select-title"},[t._v(" "+t._s(t.title)+" ")]),n("div",{staticClass:"content-select-wrap"},[n("div",{staticClass:"content-select-left"},[n("div",{directives:[{name:"show",rawName:"v-show",value:t.showFilter,expression:"showFilter"}],staticClass:"content-select-filter"},[n("a-radio-group",{attrs:{"button-style":"solid"},on:{change:t.handleSearch},model:{value:t.sourceApi,callback:function(e){t.sourceApi=e},expression:"sourceApi"}},[n("a-radio-button",{attrs:{value:"FindMyContent"}},[t._v(" My content ")])],1),n("div",{staticClass:"filter-search"},[n("a-input-search",{attrs:{placeholder:"Search",allowClear:!0},on:{search:t.handleSearch,pressEnter:t.handleSearch},model:{value:t.queryParams.searchKey,callback:function(e){t.$set(t.queryParams,"searchKey",e)},expression:"queryParams.searchKey"}})],1)],1),n("div",{staticClass:"content-select-con"},[n("a-spin",{attrs:{spinning:t.loading}},[n("div",{staticClass:"content-list"},[0===t.myContentList.length||t.loading?t._e():[t._l(t.myContentList,(function(e){return[n("div",{key:e.id,class:{"content-item":!0,selected:t.selectedId===e.id,unselect:t.calculateCantSelect(e)},on:{click:function(a){return t.handlePreviewDetail(e)}}},[n("div",{staticClass:"cover"},[n("div",{staticClass:"cover-block",style:{"background-image":"url('"+(e.image||"http://dcdkqlzgpl5ba.cloudfront.net/1392467808404684802/file/202208140641519097-20220814143449.png")+"')"}})]),n("div",{staticClass:"detail"},[n("div",{staticClass:"detail-content"},[n("div",{staticClass:"base-info"},[n("div",{staticClass:"header-line vertical-between"},[n("div",{staticClass:"left vertical-left"},[n("div",{staticClass:"type-icon vertical-left"},[n("a-space",[n("content-type-icon",{attrs:{type:e.type}}),e.collaborates>0?n("collaborate-icon"):t._e(),e.sourceFrom?n("a-icon",{attrs:{type:"shopping"}}):t._e()],1)],1),n("div",{staticClass:"name"},[t._v(" "+t._s(e.name||"Untitled "+t.contentTypeName(e))+" ")])]),n("div",{staticClass:"right vertical-right",staticStyle:{width:"90px"}},[n("div",{staticClass:"time-at"},[t._v(" "+t._s(t._f("datejs")(e.updateTime||e.createTime))+" ")])])]),n("div",{staticClass:"extra-info"},[n("a-space",[n("div",{directives:[{name:"show",rawName:"v-show",value:t.curriculumName(e)&&e.type!==t.typeMap.pd,expression:"curriculumName(content) && content.type !== typeMap.pd"}],staticClass:"info-item curriculum-info"},[t._v(" "+t._s(t.curriculumName(e))+" ")]),n("div",{staticClass:"info-item subject-info"},[n("a-space",t._l(e.subjectList.slice(0,2),(function(e,a){return n("div",{key:e+a,staticClass:"subject-item"},[t._v(t._s(e))])})),0),e.subjectList.slice(2).length?n("div",{staticClass:"more-item"},[n("a-tooltip",{attrs:{placement:"top",title:e.subjectList.slice(2).join("、 ")}},[t._v("more("+t._s(e.subjectList.slice(2).length)+")")])],1):t._e()],1),n("div",{staticClass:"info-item year-info"},[n("a-space",t._l(e.yearList.slice(0,4),(function(e,a){return n("div",{key:e+a,staticClass:"subject-item"},[t._v(t._s(e))])})),0),e.yearList.slice(4).length?n("div",{staticClass:"more-item"},[n("a-tooltip",{attrs:{placement:"top",title:e.yearList.slice(4).join("、 ")}},[t._v("more("+t._s(e.yearList.slice(4).length)+")")])],1):t._e()],1),e.taskType?n("div",{staticClass:"info-item task-type-info"},[n("div",{staticClass:"self-type-wrapper"},[n("div",{staticClass:"self-field-label"},["FA"===e.taskType?n("div",{staticClass:"task-type-item green-active-task-type"},[n("a-tooltip",{attrs:{placement:"top",title:"Formative Assessment"}},[t._v("FA")])],1):t._e(),"SA"===e.taskType?n("div",{staticClass:"task-type-item red-active-task-type"},[n("a-tooltip",{attrs:{placement:"top",title:"Summative Assessment"}},[t._v("SA")])],1):t._e(),"Activity"===e.taskType?n("div",{staticClass:"task-type-item blue-active-task-type task-type-activity"},[n("a-tooltip",{attrs:{title:"Teaching/Learning Activity",placement:"top"}},[t._v("Activity")])],1):t._e(),"IA"===e.taskType?n("div",{staticClass:"task-type-item blue-active-task-type task-type-examine"},[n("a-tooltip",{attrs:{title:"Internal Assessment",placement:"top"}},[t._v("IA")])],1):t._e()])])]):t._e()])],1),t.knowledgeTagsList(e).length?n("div",{staticClass:"tag-info"},t._l(t.knowledgeTagsList(e),(function(e,a){return n("div",{key:e+a,staticClass:"tag-info-item"},[n("a-tag",{staticClass:"tag-item knowledge-tag",attrs:{color:"#EABA7F",title:e}},[t._v(t._s(e))])],1)})),0):t._e(),n("div",{staticClass:"tag-info"},[t.commandTermsList(e).length?t._l(t.commandTermsList(e),(function(e,a){return n("div",{key:e+a,staticClass:"tag-info-item"},[n("a-tag",{staticClass:"tag-item command-tag",attrs:{color:"#06ACD7",title:e}},[t._v(t._s(e))])],1)})):t._e(),t._l(e.customTags,(function(e,a){return n("div",{key:e.name+a,staticClass:"tag-info-item"},[n("a-tag",{staticClass:"tag-item",attrs:{color:"#FFEDAF",title:e.category}},[t._v(" "+t._s(e.name)+" ")])],1)}))],2)])]),n("div",{staticClass:"footer-line"},[n("div",{staticClass:"avatar-info"},[n("div",{staticClass:"owner"},[e.owner?[e.owner.avatar?n("a-avatar",{attrs:{src:e.owner.avatar,size:"small"}}):n("img",{attrs:{src:a("4992")}})]:[n("a-avatar",{attrs:{size:"small"}},[t._v(t._s(e.createBy.toUpperCase()[0]))])],n("div",{staticClass:"user-name"},[t._v(" "+t._s(t._f("upCaseFirst")(e.owner?e.owner.firstname+" "+e.owner.lastname:e.createBy))+" ")])],2)]),n("div",{staticClass:"action vertical-right"},[t.calculateCantSelect(e)?n("a-tooltip",{attrs:{title:"Incompleted content"}},[n("a-icon",{staticStyle:{"font-size":"16px","font-weight":"bold",color:"#ef4136"},attrs:{type:"exclamation"}})],1):t._e()],1)])]),n("div",{directives:[{name:"show",rawName:"v-show",value:t.selectedId===e.id,expression:"selectedId === content.id"}],staticClass:"opt"},[t.calculateCantSelect(e)?n("a-tooltip",{attrs:{title:"Incompleted content"}},[n("a-icon",{attrs:{type:"check-circle",theme:"filled"}})],1):n("a-icon",{attrs:{type:"check-circle",theme:"filled"}})],1)])]}))],0!==t.myContentList.length||t.loading?t._e():[n("div",{staticClass:"empty-tips"},[n("no-more-resources")],1)]],2)])],1)]),n("div",{staticClass:"content-select-right"},[t.selectedId?t._e():n("div",{staticClass:"empty-tips"},[n("no-more-resources",{attrs:{tips:"No content selected"}})],1),n("div",{directives:[{name:"show",rawName:"v-show",value:t.selectedId,expression:"selectedId"}],staticClass:"preview-wrap"},[n("iframe",{ref:"previewFrame",staticClass:"preview-iframe",attrs:{src:"/v2/v2Box?header=0"}})])])]),n("div",{staticClass:"content-select-action"},[n("a-button",{attrs:{type:""},on:{click:t.handleCancel}},[t._v(t._s(t.backText))]),!t.selectedId||t.calculateCantSelect(t.selectedObj)?n("a-tooltip",{attrs:{title:"No completed content selected"}},[n("a-button",{attrs:{disabled:!0,type:"primary"}},[t._v("Next")])],1):n("a-button",{attrs:{type:"primary"},on:{click:t.handleNext}},[t._v("Next")])],1)])},s=[],i=a("1da1"),r=a("5530"),c=(a("96cf"),a("a9e3"),a("99af"),a("4de4"),a("d3b7"),a("7db0"),a("d81d"),a("0481"),a("b0c0"),a("9afb")),o=a("d573"),d=a("69b3"),u=a("8f46"),l=a("3404"),p=a.n(l),h=a("6e84"),m=a("21fb"),f=a("f93e"),y=a("3f76"),v=a("2f62"),C=a("944d"),b={name:"ContentSelect",mixins:[h["a"],m["a"]],components:{NoMoreResources:d["a"],ContentTypeIcon:u["a"],CollaborateIcon:p.a},props:{type:{type:Number,default:void 0},title:{type:String,default:""},backTxt:{type:String,default:"Discard"},datas:{type:Array,default:function(){return[]}},needFilter:{type:Boolean,default:!0}},watch:{datas:function(t){var e=this;t&&!this.showFilter&&(this.myContentList=t.filter((function(t){return t.owner.email===e.$store.getters.email})).concat(),0===this.myContentList.length&&(this.selectedId=""))},needFilter:function(t){var e=this;this.showFilter=t,!t&&this.datas&&(this.myContentList=this.datas.filter((function(t){return t.owner.email===e.$store.getters.email})).concat(),0===this.myContentList.length&&(this.selectedId=""))},backTxt:function(t,e){this.backText=t}},data:function(){return{typeMap:y["e"],FindMyContent:c["FindMyContent"],QueryContentsFilter:o["QueryContentsFilter"],loading:!1,sourceApi:"FindMyContent",queryParams:{type:[this.type],searchKey:"",delFlag:0,pageNo:1,pageSize:1e3,types:[this.type]},myContentList:[],selectedId:"",selectedObj:"",previewLoading:!0,backText:this.backTxt,showFilter:this.needFilter,baseUrl:null}},computed:Object(r["a"])({},Object(v["e"])({userMode:function(t){return t.app.userMode},currentSchool:function(t){return t.user.currentSchool}})),created:function(){this.init();var t=window.location.host;-1!==t.indexOf("localhost")?this.baseUrl="http://localhost:9004":-1!==t.indexOf("dev.classcipe.com")?this.baseUrl="https://dev.classcipe.com":-1!==t.indexOf("my.classcipe.com")?this.baseUrl="https://my.classcipe.com":this.$logger.warn("ContentPreview: unknown host",t)},methods:{init:function(){var t=this;this.showFilter&&(this.loading=!0,this.type===y["e"]["unit-plan"]?this.queryParams.linkedTask=!0:delete this.queryParams.linkedTask,this[this.sourceApi](Object(r["a"])(Object(r["a"])({},this.queryParams),{},{schoolId:this.currentSchool.id})).then((function(e){e.success&&(t.myContentList=(e.result&&e.result.records||[]).filter((function(e){return e.owner.email===t.$store.getters.email})))})).finally((function(e){t.loading=!1})))},handleSchoolChange:function(t){this.init()},handleModeChange:function(t){t===f["U"].SELF&&this.init()},handlePreviewDetail:function(t){var e=this;return Object(i["a"])(regeneratorRuntime.mark((function a(){var n;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return n={4:"task",2:"unit",9:"pd",8:"video",slide:"session"}[t.type],window._test=e.$refs.previewFrame,e.$refs.previewFrame.contentWindow.postMessage({id:"iframeBox",data:{path:"/v2Box",query:{header:0}}}),a.next=5,sleep(300);case 5:e.$refs.previewFrame.contentWindow.postMessage({id:"iframeBox",data:{path:"/".concat(n,"/view/").concat(t.id),query:{header:0}}}),e.selectedId===t.id?(e.selectedId="",e.selectedObj=null):(e.selectedId=t.id,e.selectedObj=Object(r["a"])({},t)),e.previewLoading=!0,setTimeout((function(){e.previewLoading=!1}),300);case 9:case"end":return a.stop()}}),a)})))()},calculateCantSelect:function(t){return!t||!t.canPublish||t.slideEditing},handleSearch:function(){this.init()},handleCancel:function(){this.$emit("cancel")},handleNext:function(){var t=this,e=this.myContentList.find((function(e){return e.id===t.selectedId}));this.$emit("choose",e)},contentTypeName:function(t){return t?Object(y["b"])(t.type):null},curriculumName:function(t){return this.$store.getters.curriculumId2NameMap.hasOwnProperty(t.curriculumId)?this.$store.getters.curriculumId2NameMap[t.curriculumId]:null},isOwner:function(t){return this.$store.getters.userInfo.email===t.createBy},commandTermsList:function(t){return Object(C["a"])(t.learnOuts.map((function(t){return t.commandTerms})).flat(2),"name").map((function(t){return t.name}))},knowledgeTagsList:function(t){return Object(C["a"])(t.learnOuts.map((function(t){return t.knowledgeTags})).flat(2),"name").map((function(t){return t.name}))}}},T=b,g=(a("ef3b"),a("0c7c")),j=Object(g["a"])(T,n,s,!1,null,"01ecf95b",null);e["a"]=j.exports},"8f46":function(t,e,a){"use strict";var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"status-icon-item"},[t.type===t.typeMap.task?a("span",[t._v("Task")]):t._e(),t.type===t.typeMap["unit-plan"]?a("span",[t._v("Unit")]):t._e(),t.type===t.typeMap.pd?a("span",[t._v("PD")]):t._e(),t.type===t.typeMap.video?a("span",[t._v("Video")]):t._e()])},s=[],i=(a("a9e3"),a("3f76")),r={name:"ContentTypeIcon",props:{type:{type:Number,default:-1},size:{type:String,default:"30px"}},data:function(){return{typeMap:i["e"]}}},c=r,o=(a("4133"),a("0c7c")),d=Object(o["a"])(c,n,s,!1,null,"a464ed10",null);e["a"]=d.exports},9516:function(t,e,a){},"973f":function(t,e,a){},"980a":function(t,e,a){"use strict";a.d(e,"a",(function(){return i})),a.d(e,"c",(function(){return r})),a.d(e,"b",(function(){return c}));var n=a("b775"),s={PDContentAddOrUpdate:"/classcipe/api/v2/pd/addOrUpdate",PDContentQueryById:"/classcipe/api/v2/pd/queryById",PDContentDelete:"/classcipe/api/v2/pd/delete",PDContentDeleteBatch:"/classcipe/api/v2/pd/deleteBatch",PDContentList:"/classcipe/api/v2/pd/list"};function i(t){return Object(n["d"])({url:s.PDContentAddOrUpdate,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function r(t){return Object(n["d"])({url:s.PDContentQueryById,method:"get",params:t})}function c(t){return Object(n["d"])({url:s.PDContentDelete+"?id="+t.id,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}},"9afb":function(t,e,a){"use strict";a.r(e),a.d(e,"teacherAPIUrl",(function(){return u})),a.d(e,"GetAssociate",(function(){return l})),a.d(e,"getMyContent",(function(){return p})),a.d(e,"FindMyContent",(function(){return h})),a.d(e,"GetMyGrades",(function(){return m})),a.d(e,"DeleteMyContentByType",(function(){return f})),a.d(e,"PermanentDeleteMyContent",(function(){return y})),a.d(e,"UpdateContentStatus",(function(){return v})),a.d(e,"Associate",(function(){return C})),a.d(e,"AssociateCancel",(function(){return b})),a.d(e,"SaveSessonTags",(function(){return T})),a.d(e,"AddOrSaveGroupName",(function(){return g})),a.d(e,"DeleteGroup",(function(){return j})),a.d(e,"SaveGroupItems",(function(){return w})),a.d(e,"GetReferOutcomes",(function(){return O})),a.d(e,"Duplicate",(function(){return k})),a.d(e,"Rename",(function(){return F})),a.d(e,"FindSourceOutcomes",(function(){return U})),a.d(e,"FindBigIdeaSourceOutcomes",(function(){return S})),a.d(e,"ContentRestore",(function(){return _})),a.d(e,"FindPurchases",(function(){return P})),a.d(e,"FindInspirationStudents",(function(){return I})),a.d(e,"FindInspirationTeachers",(function(){return A})),a.d(e,"GetAssociateRecommend",(function(){return M}));var n=a("b775"),s=a("3f76"),i=a("de0d"),r=a("b199"),c=a("823b"),o=a("980a"),d=a("093a"),u={Associate:"/classcipe/api/teacher/associate",AssociateCancel:"/classcipe/api/teacher/associateCancel",GetAssociate:"/classcipe/api/teacher/getAssociate",GetMyContent:"/classcipe/api/teacher/getMyContent",FindMyContent:"/classcipe/api/teacher/findMyContent",GetMyGrades:"/classcipe/api/teacher/getMyGrades",UpdateContentStatus:"/classcipe/api/teacher/content/status",saveSessonTags:"/classcipe/api/sessonTags/addBatch",AddOrSaveGroupName:"/classcipe/api/teacher/addOrSaveGroupName",SaveGroupItems:"/classcipe/api/teacher/saveGroupItems",DeleteGroup:"/classcipe/api/teacher/deleteGroup",GetReferOutcomes:"/classcipe/api/teacher/getReferOutcomes",Duplicate:"/classcipe/api/teacher/content/duplicate",PermanentDelete:"/classcipe/api/teacher/content/permanentDelete",Rename:"/classcipe/api/teacher/content/rename",FindSourceOutcomes:"/classcipe/api/teacher/findSourceOutcomes",FindBigIdeaSourceOutcomes:"/classcipe/api/teacher/findBigIdeaSourceOutcomes",ContentRestore:"/classcipe/api/teacher/content/restore",FindPurchases:"/classcipe/api/teacher/findPurchases",FindInspirationStudents:"/classcipe/api/teacher/findInspirationStudents",FindInspirationTeachers:"/classcipe/api/teacher/findInspirationTeachers",GetAssociateRecommend:"/classcipe/api/teacher/getAssociateRecommend"};function l(t){return Object(n["d"])({url:u.GetAssociate,method:"get",params:t})}function p(t){return Object(n["d"])({url:u.GetMyContent,method:"get",params:t})}function h(t){return Object(n["d"])({url:u.FindMyContent,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function m(){return Object(n["d"])({url:u.GetMyGrades,method:"get"})}function f(t){var e=t.type,a=t.id;switch(e){case s["e"]["unit-plan"]:return Object(i["UnitPlanDelete"])({id:a});case s["e"].task:return Object(r["TaskDelete"])({id:a});case s["e"].pd:return Object(o["b"])({id:a});case s["e"].video:return Object(d["b"])({id:a});default:c["error"]("wrong delete type "+e+" id: "+a);break}}function y(t){return Object(n["d"])({url:u.PermanentDelete,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function v(t){return Object(n["d"])({url:u.UpdateContentStatus,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function C(t){return Object(n["d"])({url:u.Associate,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function b(t){return Object(n["d"])({url:u.AssociateCancel,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function T(t){return Object(n["d"])({url:u.saveSessonTags,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function g(t){return Object(n["d"])({url:u.AddOrSaveGroupName,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function j(t){return Object(n["d"])({url:u.DeleteGroup,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function w(t){return Object(n["d"])({url:u.SaveGroupItems,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function O(t){return Object(n["d"])({url:u.GetReferOutcomes,method:"get",params:t})}function k(t){return Object(n["d"])({url:u.Duplicate,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function F(t){return Object(n["d"])({url:u.Rename,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function U(t){return Object(n["d"])({url:u.FindSourceOutcomes,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function S(t){return Object(n["d"])({url:u.FindBigIdeaSourceOutcomes,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function _(t){return Object(n["d"])({url:u.ContentRestore,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function P(t){return Object(n["d"])({url:u.FindPurchases,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function I(t){return Object(n["d"])({url:u.FindInspirationStudents,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function A(t){return Object(n["d"])({url:u.FindInspirationTeachers,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function M(t){return Object(n["d"])({url:u.GetAssociateRecommend,method:"get",params:t})}},a1e8:function(t,e,a){"use strict";a("1474")},b199:function(t,e,a){"use strict";a.r(e),a.d(e,"taskAPIUrl",(function(){return s})),a.d(e,"TaskCreateTaskPPT",(function(){return i})),a.d(e,"TaskCreateNewTaskPPT",(function(){return r})),a.d(e,"TaskAddOrUpdate",(function(){return c})),a.d(e,"SplitTask",(function(){return o})),a.d(e,"TaskQueryById",(function(){return d})),a.d(e,"TaskDelete",(function(){return u})),a.d(e,"getTaskBySessionId",(function(){return l})),a.d(e,"UpdateSlideEditing",(function(){return p})),a.d(e,"QuerySubTask",(function(){return h}));var n=a("b775"),s={createTaskPPT:"/classcipe/api/task/createTaskPPT",createNewTaskPPT:"/classcipe/api/task/createNewTaskPPT",addOrUpdate:"/classcipe/api/task/addOrUpdate",delete:"/classcipe/api/task/delete",deleteBatch:"/classcipe/api/task/deleteBatch",list:"/classcipe/api/task/list",queryById:"/classcipe/api/task/queryById",splitTask:"/classcipe/api/task/spliteTask",getTaskBySessonId:"/classcipe/api/task/getTaskBySessonId",updateSlideEditing:"/classcipe/api/task/updateSlideEditing",querySubTask:"/classcipe/api/task/querySubTask"};function i(t){return Object(n["d"])({url:s.createTaskPPT,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function r(t){return Object(n["d"])({url:s.createNewTaskPPT,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function c(t){return Object(n["d"])({url:s.addOrUpdate,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function o(t){return Object(n["d"])({url:s.splitTask,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function d(t){return Object(n["d"])({url:s.queryById,method:"get",params:t})}function u(t){return Object(n["d"])({url:s.delete+"?id="+t.id,method:"post",data:t})}function l(t){return Object(n["d"])({url:s.getTaskBySessonId,method:"get",params:t})}function p(t){return Object(n["d"])({url:s.updateSlideEditing,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function h(t){return Object(n["d"])({url:s.querySubTask,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}},d573:function(t,e,a){"use strict";a.r(e),a.d(e,"libraryURL",(function(){return s})),a.d(e,"Search",(function(){return i})),a.d(e,"QueryContents",(function(){return r})),a.d(e,"QueryKeyContents",(function(){return c})),a.d(e,"QueryRecommendContents",(function(){return o})),a.d(e,"QueryContentsFilter",(function(){return d}));var n=a("b775"),s={Search:"/classcipe/api/library/search",QueryContents:"/classcipe/api/library/queryContents",QueryKeyContents:"/classcipe/api/library/queryKeyContents",queryContentsFilter:"/classcipe/api/library/queryContentsFilter",QueryRecommendContents:"/classcipe/api/library/queryRecommendContents"};function i(t){return Object(n["d"])({url:s.Search,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function r(t){return Object(n["d"])({url:s.QueryContents,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function c(t){return Object(n["d"])({url:s.QueryKeyContents,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function o(t){return Object(n["d"])({url:s.QueryRecommendContents,method:"get",params:t})}function d(t){return Object(n["d"])({url:s.queryContentsFilter,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}},de0d:function(t,e,a){"use strict";a.r(e),a.d(e,"unitPlanAPIUrl",(function(){return s})),a.d(e,"UnitPlanAddOrUpdate",(function(){return i})),a.d(e,"UnitPlanQueryById",(function(){return r})),a.d(e,"UnitPlanDelete",(function(){return c})),a.d(e,"UnitPlanDeleteBatch",(function(){return o})),a.d(e,"UnitPlanList",(function(){return d})),a.d(e,"ChangeStatus",(function(){return u}));var n=a("b775"),s={UnitPlanAddOrUpdate:"/classcipe/api/unitPlan/addOrUpdate",UnitPlanQueryById:"/classcipe/api/unitPlan/queryById",UnitPlanDelete:"/classcipe/api/unitPlan/delete",UnitPlanDeleteBatch:"/classcipe/api/unitPlan/deleteBatch",UnitPlanList:"/classcipe/api/unitPlan/list",ChangeStatus:"/classcipe/api/unitPlan/status"};function i(t){return Object(n["d"])({url:s.UnitPlanAddOrUpdate,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function r(t){return Object(n["d"])({url:s.UnitPlanQueryById,method:"get",params:t})}function c(t){return Object(n["d"])({url:s.UnitPlanDelete,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function o(t){return Object(n["d"])({url:s.UnitPlanDeleteBatch,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function d(t){return Object(n["d"])({url:s.UnitPlanList,method:"get",params:t})}function u(t){return Object(n["d"])({url:s.ChangeStatus,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}},ef3b:function(t,e,a){"use strict";a("9516")}}]);