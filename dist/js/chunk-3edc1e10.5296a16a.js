(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3edc1e10"],{"093a":function(t,e,n){"use strict";n.d(e,"a",(function(){return i})),n.d(e,"c",(function(){return o})),n.d(e,"b",(function(){return r}));var a=n("b775"),s={VideoAddOrUpdate:"/classcipe/api/v2/video/addOrUpdate",VideoQueryById:"/classcipe/api/v2/video/queryById",VideoDelete:"/classcipe/api/v2/video/delete",VideoDeleteBatch:"/classcipe/api/v2/video/deleteBatch",VideoList:"/classcipe/api/v2/video/list"};function i(t){return Object(a["d"])({url:s.VideoAddOrUpdate,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function o(t){return Object(a["d"])({url:s.VideoQueryById,method:"get",params:t})}function r(t){return Object(a["d"])({url:s.VideoDelete+"?id="+t.id,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}},"0f1c":function(t,e){t.exports="data:image/png;base64,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"},"23f6":function(t,e,n){"use strict";n.d(e,"a",(function(){return o})),n.d(e,"b",(function(){return r}));var a=n("b775"),s="api/contentGrade",i={save:"/classcipe/".concat(s,"/save"),getStatByContentId:"/classcipe/".concat(s,"/getStatByContentId")};function o(t){return Object(a["d"])({url:i.save,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function r(t){return Object(a["d"])({url:i.getStatByContentId,method:"get",params:t})}},"2f59":function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var a=n("b775"),s=n("9574"),i={data:function(){return{ErrorCode:a["a"],currentMethodName:null,currentMethodParam:null}},created:function(){s["b"].$on(s["a"].GOOGLE_AUTH_REFRESH,this.handleAuthCallback)},beforeDestroy:function(){s["b"].$off(s["a"].GOOGLE_AUTH_REFRESH,this.handleAuthCallback)},methods:{handleAuthCallback:function(){}}}},3404:function(t,e,n){var a=n("b2b7");t.exports={__esModule:!0,default:a.svgComponent({tag:"svg",attrsMap:{t:"1654058113220",class:"icon",viewBox:"0 0 1024 1024",version:"1.1",xmlns:"http://www.w3.org/2000/svg","p-id":"4384","xmlns:xlink":"http://www.w3.org/1999/xlink",width:"48",height:"48"},children:[{tag:"defs"},{tag:"path",attrsMap:{d:"M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z",fill:"#8094B2","p-id":"4385"}},{tag:"path",attrsMap:{d:"M521.671111 189.62963a156.292741 156.292741 0 0 1 153.979259 130.844444 123.505778 123.505778 0 0 1 36.598519-5.688889 125.345185 125.345185 0 0 1 87.988148 36.02963 122.88 122.88 0 0 1 2.844444 170.913185l29.392593 29.278815a130.123852 130.123852 0 0 1 29.582222 43.33037 132.020148 132.020148 0 0 1 10.24 51.617185v36.295111a48.772741 48.772741 0 0 1-8.722963 27.83763 37.717333 37.717333 0 0 1-26.548148 15.985778 7.149037 7.149037 0 0 1-2.654815 0.341333h-28.634074v9.481482a22.33837 22.33837 0 0 1-22.755555 22.546963H259.982222a22.452148 22.452148 0 0 1-22.755555-22.546963v-9.481482h-28.444445a7.149037 7.149037 0 0 1-2.654815-0.341333 37.338074 37.338074 0 0 1-26.548148-15.985778A48.96237 48.96237 0 0 1 170.666667 682.249481v-36.295111a131.242667 131.242667 0 0 1 39.822222-94.966518l29.582222-29.278815a122.159407 122.159407 0 0 1 3.034074-170.913185 124.548741 124.548741 0 0 1 87.798519-36.02963 120.414815 120.414815 0 0 1 36.408889 5.688889 156.387556 156.387556 0 0 1 154.358518-130.844444m69.973333 523.946666v-20.10074l0.37926-1.896297v-80.137481a13.558519 13.558519 0 1 1 27.117037 0v59.316148h58.785185a10.448593 10.448593 0 0 0 1.137778-5.12v-47.597037a120.794074 120.794074 0 0 0-9.102223-48.146963 139.320889 139.320889 0 0 0-14.601481-25.391407l-0.379259-0.341334v-0.189629l-0.37926-0.303408-0.379259-0.360296a135.168 135.168 0 0 0-11.946666-13.520593l-48.924445-48.488296a154.680889 154.680889 0 0 1-71.68 17.768296 157.013333 157.013333 0 0 1-72.248889-17.768296l-48.545185 48.488296a137.765926 137.765926 0 0 0-12.136296 13.520593v0.360296l-0.568889 0.303408v0.170666l-0.379259 0.341334a151.381333 151.381333 0 0 0-14.601482 25.391407 124.245333 124.245333 0 0 0-9.291852 48.146963v47.597037a13.103407 13.103407 0 0 0 1.137778 5.12h58.785185v-59.297185a13.748148 13.748148 0 0 1 27.496297 0v102.153481h140.325925z m-69.973333-259.621926a109.530074 109.530074 0 1 0-110.554074-109.70074 110.08 110.08 0 0 0 110.554074 109.70074M283.117037 713.576296h66.180741a42.116741 42.116741 0 0 1-20.66963-15.947852 55.333926 55.333926 0 0 1-10.24-31.971555v-47.634963a163.972741 163.972741 0 0 1 9.671111-56.888889 135.907556 135.907556 0 0 1-51.01037-12.193185l-34.322963 33.583407a98.929778 98.929778 0 0 0-19.911111 29.108148v0.18963a91.268741 91.268741 0 0 0-6.447408 34.133333v35.19526h39.442963v-39.822223a13.786074 13.786074 0 0 1 13.842963-13.577481 13.463704 13.463704 0 0 1 13.463704 13.577481v72.248889z m84.385185-344.670815a126.008889 126.008889 0 0 0-13.084444-5.575111 83.437037 83.437037 0 0 0-23.514074-3.39437 80.554667 80.554667 0 0 0-55.751111 22.85037 77.615407 77.615407 0 0 0 0 110.174815 80.384 80.384 0 0 0 71.30074 21.409185c3.223704-0.967111 6.447407-1.744593 9.481482-2.711703 3.982222-4.645926 8.154074-9.481481 12.705185-13.748148l43.994074-43.330371-1.137778-0.967111h-0.189629a158.53037 158.53037 0 0 1-41.718519-74.619259 58.235259 58.235259 0 0 0-1.517037-7.243852v-0.796445l-0.18963-0.625777z m392.533334 344.670815v-72.248889a13.387852 13.387852 0 0 1 13.653333-13.577481 13.615407 13.615407 0 0 1 13.653333 13.577481v39.822223h39.632593v-35.176297a87.798519 87.798519 0 0 0-6.826667-34.133333h0.379259l-0.379259-0.18963a94.644148 94.644148 0 0 0-19.721481-29.108148l-34.512593-33.583407a133.328593 133.328593 0 0 1-51.01037 12.193185 163.972741 163.972741 0 0 1 9.671111 56.888889V665.6a56.357926 56.357926 0 0 1-9.860741 31.952593 44.316444 44.316444 0 0 1-20.859259 15.947851h66.180741z m-84.385186-344.670815l-0.379259 1.441186v0.625777l-0.379259 0.474075v0.360296a158.53037 158.53037 0 0 1-43.045926 81.806222h-0.18963l-0.948148 0.967111 43.614815 43.330371a158.473481 158.473481 0 0 1 12.894815 13.748148c2.844444 0.967111 6.068148 1.744593 9.481481 2.711703a80.801185 80.801185 0 0 0 15.54963 1.441186A78.336 78.336 0 0 0 767.81037 493.037037a77.160296 77.160296 0 0 0 0-110.174815 79.056593 79.056593 0 0 0-55.561481-22.85037 83.437037 83.437037 0 0 0-23.514074 3.39437c-4.361481 1.72563-8.912593 3.508148-13.084445 5.575111",fill:"#FFFFFF","p-id":"4386"}}]})}},3752:function(t,e,n){},"40ee":function(t,e,n){},60427:function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"my-modal-header"},[t.title?a("div",{staticClass:"title",style:{fontSize:t.size+"px"}},[t._v(t._s(t.title))]):t._e(),a("div",{directives:[{name:"show",rawName:"v-show",value:t.allowClose,expression:"allowClose"}],staticClass:"close-icon",on:{click:t.handleClickClose}},[t.white?t._e():a("img",{attrs:{src:n("0f1c")}}),t.white?a("img",{attrs:{src:n("f8af5")}}):t._e()])])},s=[],i=(n("a9e3"),{name:"ModalHeader",props:{white:{type:Boolean,default:!1},title:{type:String,default:""},allowClose:{type:Boolean,default:!0},size:{type:Number,default:16}},methods:{handleClickClose:function(){this.$logger.info("handleClickClose"),this.$emit("close")}}}),o=i,r=(n("7fab"),n("0c7c")),c=Object(r["a"])(o,a,s,!1,null,"9007633e",null);e["a"]=c.exports},"63e4":function(t,e,n){"use strict";var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return t.content?n("div",{staticClass:"content-item"},[n("div",{staticClass:"cover",on:{click:function(e){return t.handlePreviewDetail(t.content)}}},[n("div",{staticClass:"cover-block",style:{"background-image":"url('"+(t.content.image||"http://dcdkqlzgpl5ba.cloudfront.net/1392467808404684802/file/202208140641519097-20220814143449.png")+"')"}})]),n("div",{staticClass:"detail"},[n("div",{staticClass:"detail-content",on:{click:function(e){return t.handlePreviewDetail(t.content)}}},[n("div",{staticClass:"base-info"},[n("div",{staticClass:"name-type"},[n("div",{staticClass:"type-icon"},[n("content-type-icon",{attrs:{type:t.content.type}})],1),n("div",{staticClass:"name"},[t._v(" "+t._s(t.content.name||"Untitled "+t.contentTypeName)+" ")])]),n("div",{staticClass:"extra-info"},[n("a-space",[n("div",{directives:[{name:"show",rawName:"v-show",value:t.curriculumName&&t.content.type!==t.typeMap.pd,expression:"curriculumName && content.type !== typeMap.pd"}],staticClass:"info-item curriculum-info"},[t._v(" "+t._s(t.curriculumName)+" ")]),n("div",{staticClass:"info-item subject-info"},[n("a-space",t._l(t.content.subjectList,(function(e,a){return n("div",{key:a,staticClass:"subject-item"},[t._v(t._s(e))])})),0)],1),n("div",{staticClass:"info-item year-info"},[n("a-space",t._l(t.content.yearList,(function(e,a){return n("div",{key:a,staticClass:"subject-item"},[t._v(t._s(e))])})),0)],1),t.content.taskType?n("div",{staticClass:"info-item task-type-info"},[n("div",{staticClass:"self-type-wrapper"},[n("div",{staticClass:"self-field-label"},["FA"===t.content.taskType?n("div",{staticClass:"task-type-item green-active-task-type"},[n("a-tooltip",{attrs:{placement:"top",title:"Formative Assessment"}},[t._v("FA")])],1):t._e(),"SA"===t.content.taskType?n("div",{staticClass:"task-type-item red-active-task-type"},[n("a-tooltip",{attrs:{title:"Summative Assessment",placement:"top"}},[t._v("SA")])],1):t._e(),"Activity"===t.content.taskType?n("div",{staticClass:"task-type-item blue-active-task-type task-type-activity"},[n("a-tooltip",{attrs:{title:"Teaching/Learning Activity",placement:"top"}},[t._v("Activity")])],1):t._e(),"IA"===t.content.taskType?n("div",{staticClass:"task-type-item blue-active-task-type task-type-examine"},[n("a-tooltip",{attrs:{title:"Internal Assessment",placement:"top"}},[t._v("IA")])],1):t._e()])])]):t._e()])],1),n("div",{staticClass:"tag-info"},t._l(t.content.customTags,(function(e,a){return n("div",{key:a,staticClass:"tag-info-item"},[n("a-tag",{staticClass:"tag-item",attrs:{color:"#FFEDAF",title:e.category}},[t._v(" "+t._s(e.name)+" ")])],1)})),0),n("div",{staticClass:"owner"},[t.content.owner?[n("a-avatar",{attrs:{src:t.content.owner.avatar,size:"small"}})]:[n("a-avatar",{attrs:{size:"small"}},[t._v(t._s(t.content.createBy.toUpperCase()[0]))])],t.content.owner.email===t.$store.getters.email?n("div",{staticClass:"user-name"},[t._v(" Me ")]):n("div",{staticClass:"user-name"},[t._v(" "+t._s(t._f("upCaseFirst")(t.content.owner?t.content.owner.firstname+" "+t.content.owner.lastname:t.content.createBy))+" ")])],2),"released"==t.category?n("div",{staticClass:"update-time"},[t._v(" "+t._s(t._f("dayjs")(t.content.publishTime))+" ")]):n("div",{staticClass:"update-time"},[t._v(" "+t._s(t._f("dayjs")(t.content.updateTime||t.content.createTime))+" ")])]),n("div",{staticClass:"right-info"},[n("div",{staticClass:"buy-info",on:{click:function(t){t.stopPropagation()}}},[n("a-space",[n("div",{staticClass:"price"},[t._v("$"+t._s(t.content.discountPrice||t.content.price||0))]),t.content.discountPrice>0&&t.content.discountPrice!==t.content.price?n("div",{staticClass:"price_was"},[t._v("$"+t._s(t.content.price))]):t._e(),n("div",{staticClass:"buy"},[t.content.createBy===t.$store.getters.userInfo.email||t.content.buyed?t._e():n("a-button",{attrs:{type:"danger",shape:"round",loading:t.copyLoading},on:{click:function(e){return t.handleBuyItem()}}},[t._v(" Buy now ")]),t.content.createBy===t.$store.getters.userInfo.email||t.content.createBy!==t.$store.getters.userInfo.email&&t.content.buyed&&-1!=t.content.myContentId?n("a-button",{staticClass:"cc-dark-button",attrs:{type:"danger",shape:"round",loading:t.copyLoading},on:{click:function(e){return t.handleEditItem()}}},[t._v(" Edit ")]):t._e(),n("a-tooltip",{attrs:{title:"You have already purchased this content, please copy it directly",placement:"top"}},[t.content.createBy!==t.$store.getters.userInfo.email&&t.content.buyed&&-1==t.content.myContentId?n("a-button",{attrs:{type:"primary",shape:"round",loading:t.copyLoading},on:{click:function(e){t.handleBuyItem("Copy successfully")}}},[t._v(" Copy ")]):t._e()],1)],1)])],1)])]),n("div",{staticClass:"action"}),t.previewVisible?n("content-preview",{attrs:{"content-id":t.previewCurrentId,"content-type":t.previewType,"show-enter-button":!1,"review-edit":!1,"review-create":!1},on:{close:t.handlePreviewClose}}):t._e(),n("a-modal",{attrs:{title:null,closable:!1,"append-to-body":!0,"destroy-on-close":!1,width:"500px"},on:{ok:t.handleEnsureBuyStat,cancel:t.handleCancelBuyStat},model:{value:t.contentBuyStatVisible,callback:function(e){t.contentBuyStatVisible=e},expression:"contentBuyStatVisible"}},[n("modal-header",{attrs:{title:"Which age(s) will you use this resource with?"},on:{close:t.handleCancelBuyStat}}),n("div",{staticClass:"grade-list"},[n("div",{staticClass:"content-tag-list"},t._l(t.allAges,(function(e){return n("div",{key:e,staticClass:"content-tag",class:{"selected-tag":-1!==t.selectedGradeList.indexOf(e)},on:{click:function(n){return t.toggleSelectContentTag(e)}}},[t._v(" "+t._s(e)+" ")])})),0)])],1)],1)]):t._e()},s=[],i=(n("d3b7"),n("a434"),n("3f76")),o=n("f031"),r=n("0381"),c=n("d185"),d=n.n(c),u=n("dfbd"),l=n.n(u),p=n("ce85"),h=n("8f46"),y=n("82bf"),f=n("23f6"),m=n("60427"),g=n("2f59"),v={name:"LibraryContentItem",components:{ModalHeader:m["a"],ContentTypeIcon:h["a"],ContentPreview:p["a"],CustomButton:r["a"],DuplicateIcon:l.a,EditIcon:d.a},props:{content:{type:Object,default:null},showButton:{type:Boolean,default:!0},clickPreview:{type:Boolean,default:!0},category:{type:String,default:""}},mixins:[o["a"],g["a"]],data:function(){return{typeMap:i["e"],isSelfLearning:!1,copyLoading:!1,contentBuyStatVisible:!1,selectedGradeList:[]}},created:function(){this.allowPreview=this.clickPreview},computed:{status:function(){return this.content.status},contentTypeName:function(){return this.content?Object(i["b"])(this.content.type):null},curriculumName:function(){return this.$store.getters.curriculumId2NameMap.hasOwnProperty(this.content.curriculumId)?this.$store.getters.curriculumId2NameMap[this.content.curriculumId]:null},allAges:function(){for(var t=[],e=3;e<19;e++)t.push(e+" years");return t}},methods:{handleBuyItem:function(t){var e=this;this.$logger.info("handleBuyItem",this.content),Object(y["a"])({id:this.content.id,type:this.content.type}).then((function(n){n.code!==e.ErrorCode.ppt_google_token_expires&&n.code!==e.ErrorCode.ppt_forbidden?(e.$logger.info("Duplicate response",n),t?e.$message.success(t):e.$message.success("Buy successfully")):e.currentMethodName="handleBuyItem"})).finally((function(){e.buyLoading=!1,e.contentBuyStatVisible=!0}))},handleEditItem:function(){if(this.content.createBy!==this.$store.getters.userInfo.email)return this.handleEditBuy();var t=this.content;t.canPublish||this.$classcipe.setRequiredCheck(t.id),t.type===i["e"]["unit-plan"]?this.$router.push({path:"/teacher/unit-plan-redirect/"+t.id}):t.type===i["e"].task?this.$router.push({path:"/teacher/task-redirect/"+t.id}):t.type===i["e"].video?this.$router.push({path:"/teacher/video-redirect/"+t.id}):t.type===i["e"].pd&&this.$router.push({path:"/teacher/pd-content-redirect/"+t.id})},handleEnsureBuyStat:function(){var t=this;Object(f["a"])({contentId:this.contentId,contentType:this.contentType,grades:this.selectedGradeList}).finally((function(){t.handleCancelBuyStat()}))},handleCancelBuyStat:function(){this.contentBuyStatVisible=!1,this.selectedGradeList=[],this.$router.push({path:"/teacher/main/created-by-me"})},toggleSelectContentTag:function(t){this.$logger.info("toggleSelectContentTag",t);var e=this.selectedGradeList.indexOf(t);-1===e?this.selectedGradeList.push(t):this.selectedGradeList.splice(e,1)},handleEditBuy:function(){this.$logger.info("handleEdit",this.content.myContentId),this.content.type===this.typeMap["unit-plan"]?window.open("/teacher/unit-plan-redirect/"+this.content.myContentId,"_blank"):this.content.type===this.typeMap.task?window.open("/teacher/task-redirect/"+this.content.myContentId,"_blank"):this.content.type===this.typeMap.pd?window.open("/teacher/pd-content-redirect/"+this.content.myContentId,"_blank"):this.contentType===this.typeMap.video&&window.open("/teacher/video-redirect/"+this.content.myContentId,"_blank")}}},C=v,b=(n("84d1"),n("0c7c")),A=Object(b["a"])(C,a,s,!1,null,"6f8eb1d6",null);e["a"]=A.exports},"6e84":function(t,e,n){"use strict";n.d(e,"a",(function(){return a}));n("b0c0");var a={data:function(){return{unwatch:null,routeName:this.$route.name}},computed:{redirectUrl:function(){return"student"===this.$store.state.user.currentRole?"/student/main/my-task":"/account/info"}},created:function(){var t=this;this.unwatch=this.$store.watch((function(t){return t.app.userMode}),(function(e){e&&t.$route.name===t.routeName&&(t.handleModeChange(e),t.routeInMode())})),this.routeInMode()},beforeDestroy:function(){this.unwatch&&this.unwatch()},methods:{routeInMode:function(){this.$route.meta.mode&&this.$route.meta.mode!==this.$store.state.app.userMode&&this.$router.push({path:this.redirectUrl})},handleModeChange:function(t){}}}},7702:function(t,e,n){"use strict";n("3752")},"7fab":function(t,e,n){"use strict";n("40ee")},"82bf":function(t,e,n){"use strict";n.d(e,"e",(function(){return i})),n.d(e,"c",(function(){return o})),n.d(e,"b",(function(){return r})),n.d(e,"a",(function(){return c})),n.d(e,"d",(function(){return d}));var a=n("b775"),s={GetLinkCategory:"/classcipe/api/v2/mycontent/getLinkCategory",AddOrUpdateLinkCategory:"/classcipe/api/v2/mycontent/addOrUpdateLinkCategory",QueryTagsByIds:"/classcipe/api/v2/mycontent/queryTagsByIds",DeleteLinkCategory:"/classcipe/api/v2/mycontent/deleteLinkCategory",QueryCustomTags:"/classcipe/api/v2/mycontent/queryCustomTags",ImportOtherIdentityContent:"/classcipe/api/v2/mycontent/importOtherIdentityContent",UpdateContentField:"/classcipe/api/v2/mycontent/updateContentField",ContentBuy:"/classcipe/api/v2/mycontent/content/bye",QueryNewBigIdea:"/classcipe/api/v2/mycontent/queryNewBigIdea"};function i(t){return Object(a["d"])({url:s.QueryTagsByIds,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function o(t){return Object(a["d"])({url:s.QueryCustomTags,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function r(t){return Object(a["d"])({url:s.ImportOtherIdentityContent,method:"post",data:t})}function c(t){return Object(a["d"])({url:s.ContentBuy,method:"post",data:t})}function d(t){return Object(a["d"])({url:s.QueryNewBigIdea,method:"post",data:t})}},8315:function(t,e,n){"use strict";n.r(e);var a=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"search-result"},[n("div",{staticClass:"library-search"},[n("div",{staticClass:"create-new"},[n("a-space",[n("global-search-input",{attrs:{source:"resource","school-id":t.currentSchool.id},on:{search:t.handleSearch}}),n("user-profile-avatar")],1)],1)]),n("div",{staticClass:"content-wrapper"},[n("a-spin",{attrs:{tip:"Loading...",spinning:t.searching}},[n("div",{staticClass:"content-list"},[0===t.dataList.length||t.searching?t._e():t._l(t.dataList,(function(t){return n("library-content-item",{key:t.id,attrs:{content:t}})})),0!==t.dataList.length||t.searching?t._e():[n("div",{staticClass:"empty-tips"},[n("common-no-data",{attrs:{text:"No Data Found!",isBig:!0},scopedSlots:t._u([{key:"icon",fn:function(){return[n("no-content")]},proxy:!0}],null,!1,1271653318)})],1),n("div",{staticClass:"go-back"},[n("a-button",{attrs:{shape:"round",type:"primary"},on:{click:function(e){return t.$router.go(-1)}}},[t._v("Go Back")])],1)]],2)])],1)])},s=[],i=n("5530"),o=(n("d3b7"),n("cd3e")),r=n("3881"),c=n("49a2"),d=n("63e4"),u=n("fdff"),l=n("d573"),p=n("6e84"),h=n("8519"),y=n.n(h),f=n("2f62"),m={name:"ResourceSearch",components:{CommonNoData:u["a"],ContentItem:c["a"],LibraryContentItem:d["a"],UserProfileAvatar:r["a"],GlobalSearchInput:o["a"],NoContent:y.a},props:{keyword:{type:String,default:null}},data:function(){return{searching:!0,searchKeyword:this.keyword,dataList:[]}},computed:Object(i["a"])({},Object(f["e"])({currentSchool:function(t){return t.user.currentSchool}})),mixins:[p["a"]],created:function(){this.$logger.info("LibrarySearch: created",this.searchKeyword),this.handleDoSearch()},methods:{handleDoSearch:function(){var t,e=this;this.searching=!0,Object(l["QueryContentsFilter"])({searchKey:this.searchKeyword,schoolId:null===(t=this.currentSchool)||void 0===t?void 0:t.id}).then((function(t){e.$logger.info("QueryContentsFilter result : ",t),e.dataList=t.result?t.result:[]})).finally((function(){e.searching=!1}))},handleSearch:function(t){this.$logger.info("LibrarySearch handleSearch",t),this.searchKeyword=t,this.handleDoSearch()}}},g=m,v=(n("7702"),n("0c7c")),C=Object(v["a"])(g,a,s,!1,null,"439ab783",null);e["default"]=C.exports},"84d1":function(t,e,n){"use strict";n("f67c")},"9afb":function(t,e,n){"use strict";n.r(e),n.d(e,"teacherAPIUrl",(function(){return u})),n.d(e,"GetAssociate",(function(){return l})),n.d(e,"getMyContent",(function(){return p})),n.d(e,"FindMyContent",(function(){return h})),n.d(e,"GetMyGrades",(function(){return y})),n.d(e,"DeleteMyContentByType",(function(){return f})),n.d(e,"PermanentDeleteMyContent",(function(){return m})),n.d(e,"UpdateContentStatus",(function(){return g})),n.d(e,"Associate",(function(){return v})),n.d(e,"AssociateCancel",(function(){return C})),n.d(e,"SaveSessonTags",(function(){return b})),n.d(e,"AddOrSaveGroupName",(function(){return A})),n.d(e,"DeleteGroup",(function(){return w})),n.d(e,"SaveGroupItems",(function(){return F})),n.d(e,"GetReferOutcomes",(function(){return O})),n.d(e,"Duplicate",(function(){return T})),n.d(e,"Rename",(function(){return j})),n.d(e,"FindSourceOutcomes",(function(){return B})),n.d(e,"FindBigIdeaSourceOutcomes",(function(){return U})),n.d(e,"ContentRestore",(function(){return I})),n.d(e,"FindPurchases",(function(){return M})),n.d(e,"FindInspirationStudents",(function(){return S})),n.d(e,"FindInspirationTeachers",(function(){return k})),n.d(e,"GetAssociateRecommend",(function(){return L}));var a=n("b775"),s=n("3f76"),i=n("de0d"),o=n("b199"),r=n("823b"),c=n("980a"),d=n("093a"),u={Associate:"/classcipe/api/teacher/associate",AssociateCancel:"/classcipe/api/teacher/associateCancel",GetAssociate:"/classcipe/api/teacher/getAssociate",GetMyContent:"/classcipe/api/teacher/getMyContent",FindMyContent:"/classcipe/api/teacher/findMyContent",GetMyGrades:"/classcipe/api/teacher/getMyGrades",UpdateContentStatus:"/classcipe/api/teacher/content/status",saveSessonTags:"/classcipe/api/sessonTags/addBatch",AddOrSaveGroupName:"/classcipe/api/teacher/addOrSaveGroupName",SaveGroupItems:"/classcipe/api/teacher/saveGroupItems",DeleteGroup:"/classcipe/api/teacher/deleteGroup",GetReferOutcomes:"/classcipe/api/teacher/getReferOutcomes",Duplicate:"/classcipe/api/teacher/content/duplicate",PermanentDelete:"/classcipe/api/teacher/content/permanentDelete",Rename:"/classcipe/api/teacher/content/rename",FindSourceOutcomes:"/classcipe/api/teacher/findSourceOutcomes",FindBigIdeaSourceOutcomes:"/classcipe/api/teacher/findBigIdeaSourceOutcomes",ContentRestore:"/classcipe/api/teacher/content/restore",FindPurchases:"/classcipe/api/teacher/findPurchases",FindInspirationStudents:"/classcipe/api/teacher/findInspirationStudents",FindInspirationTeachers:"/classcipe/api/teacher/findInspirationTeachers",GetAssociateRecommend:"/classcipe/api/teacher/getAssociateRecommend"};function l(t){return Object(a["d"])({url:u.GetAssociate,method:"get",params:t})}function p(t){return Object(a["d"])({url:u.GetMyContent,method:"get",params:t})}function h(t){return Object(a["d"])({url:u.FindMyContent,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function y(){return Object(a["d"])({url:u.GetMyGrades,method:"get"})}function f(t){var e=t.type,n=t.id;switch(e){case s["e"]["unit-plan"]:return Object(i["UnitPlanDelete"])({id:n});case s["e"].task:return Object(o["TaskDelete"])({id:n});case s["e"].pd:return Object(c["b"])({id:n});case s["e"].video:return Object(d["b"])({id:n});default:r["error"]("wrong delete type "+e+" id: "+n);break}}function m(t){return Object(a["d"])({url:u.PermanentDelete,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function g(t){return Object(a["d"])({url:u.UpdateContentStatus,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function v(t){return Object(a["d"])({url:u.Associate,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function C(t){return Object(a["d"])({url:u.AssociateCancel,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function b(t){return Object(a["d"])({url:u.saveSessonTags,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function A(t){return Object(a["d"])({url:u.AddOrSaveGroupName,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function w(t){return Object(a["d"])({url:u.DeleteGroup,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function F(t){return Object(a["d"])({url:u.SaveGroupItems,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function O(t){return Object(a["d"])({url:u.GetReferOutcomes,method:"get",params:t})}function T(t){return Object(a["d"])({url:u.Duplicate,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function j(t){return Object(a["d"])({url:u.Rename,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function B(t){return Object(a["d"])({url:u.FindSourceOutcomes,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function U(t){return Object(a["d"])({url:u.FindBigIdeaSourceOutcomes,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function I(t){return Object(a["d"])({url:u.ContentRestore,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function M(t){return Object(a["d"])({url:u.FindPurchases,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function S(t){return Object(a["d"])({url:u.FindInspirationStudents,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function k(t){return Object(a["d"])({url:u.FindInspirationTeachers,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function L(t){return Object(a["d"])({url:u.GetAssociateRecommend,method:"get",params:t})}},d573:function(t,e,n){"use strict";n.r(e),n.d(e,"libraryURL",(function(){return s})),n.d(e,"Search",(function(){return i})),n.d(e,"QueryContents",(function(){return o})),n.d(e,"QueryKeyContents",(function(){return r})),n.d(e,"QueryRecommendContents",(function(){return c})),n.d(e,"QueryContentsFilter",(function(){return d}));var a=n("b775"),s={Search:"/classcipe/api/library/search",QueryContents:"/classcipe/api/library/queryContents",QueryKeyContents:"/classcipe/api/library/queryKeyContents",queryContentsFilter:"/classcipe/api/library/queryContentsFilter",QueryRecommendContents:"/classcipe/api/library/queryRecommendContents"};function i(t){return Object(a["d"])({url:s.Search,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function o(t){return Object(a["d"])({url:s.QueryContents,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function r(t){return Object(a["d"])({url:s.QueryKeyContents,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function c(t){return Object(a["d"])({url:s.QueryRecommendContents,method:"get",params:t})}function d(t){return Object(a["d"])({url:s.queryContentsFilter,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}},de0d:function(t,e,n){"use strict";n.r(e),n.d(e,"unitPlanAPIUrl",(function(){return s})),n.d(e,"UnitPlanAddOrUpdate",(function(){return i})),n.d(e,"UnitPlanQueryById",(function(){return o})),n.d(e,"UnitPlanDelete",(function(){return r})),n.d(e,"UnitPlanDeleteBatch",(function(){return c})),n.d(e,"UnitPlanList",(function(){return d})),n.d(e,"ChangeStatus",(function(){return u}));var a=n("b775"),s={UnitPlanAddOrUpdate:"/classcipe/api/unitPlan/addOrUpdate",UnitPlanQueryById:"/classcipe/api/unitPlan/queryById",UnitPlanDelete:"/classcipe/api/unitPlan/delete",UnitPlanDeleteBatch:"/classcipe/api/unitPlan/deleteBatch",UnitPlanList:"/classcipe/api/unitPlan/list",ChangeStatus:"/classcipe/api/unitPlan/status"};function i(t){return Object(a["d"])({url:s.UnitPlanAddOrUpdate,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function o(t){return Object(a["d"])({url:s.UnitPlanQueryById,method:"get",params:t})}function r(t){return Object(a["d"])({url:s.UnitPlanDelete,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function c(t){return Object(a["d"])({url:s.UnitPlanDeleteBatch,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function d(t){return Object(a["d"])({url:s.UnitPlanList,method:"get",params:t})}function u(t){return Object(a["d"])({url:s.ChangeStatus,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}},dfbd:function(t,e,n){var a=n("b2b7");t.exports={__esModule:!0,default:a.svgComponent({tag:"svg",attrsMap:{t:"1651918650328",class:"icon",viewBox:"0 0 1177 1024",version:"1.1",xmlns:"http://www.w3.org/2000/svg","p-id":"3725","xmlns:xlink":"http://www.w3.org/1999/xlink",width:"55.171875",height:"48"},children:[{tag:"defs"},{tag:"path",attrsMap:{d:"M1177.559963 350.415734v518.177582a148.014168 148.014168 0 0 1-46.846407 109.717869 155.693906 155.693906 0 0 1-112.636171 45.668848H380.147075a155.693906 155.693906 0 0 1-112.63617-45.668848 147.962969 147.962969 0 0 1-46.795209-109.717869V350.415734a147.860573 147.860573 0 0 1 46.795209-109.71787 155.693906 155.693906 0 0 1 112.63617-45.668847h637.93031a155.693906 155.693906 0 0 1 112.636171 45.668847A147.911771 147.911771 0 0 1 1177.559963 350.415734z m-195.01417 262.544673v-6.911765a33.022877 33.022877 0 0 0-10.546841-24.267975 34.661222 34.661222 0 0 0-24.882354-10.239651h-208.991294V367.618349a32.818084 32.818084 0 0 0-10.546842-24.267975 34.558825 34.558825 0 0 0-24.882354-10.239652h-7.065359a34.558825 34.558825 0 0 0-24.882354 10.239652 32.818084 32.818084 0 0 0-10.546842 24.267975v203.666675H451.210259a34.661222 34.661222 0 0 0-24.882354 10.239652 33.022877 33.022877 0 0 0-10.546842 24.267975v6.860567a32.971679 32.971679 0 0 0 10.546842 24.267975 34.251635 34.251635 0 0 0 24.882354 10.239652H660.457544v203.666675a32.766886 32.766886 0 0 0 10.546842 24.267975 34.149239 34.149239 0 0 0 24.882354 10.239652h7.06536a34.558825 34.558825 0 0 0 24.882354-10.239652 32.766886 32.766886 0 0 0 10.546841-24.267975V647.160845H947.167796a34.661222 34.661222 0 0 0 24.882354-10.239652 31.896516 31.896516 0 0 0 10.495643-23.960786z","p-id":"3726"}},{tag:"path",attrsMap:{d:"M686.927044 219.450587l220.766894 24.370371-6.143791-68.912857a98.761442 98.761442 0 0 0-99.785407-97.276692H179.603493a98.761442 98.761442 0 0 0-99.734209 97.276692V629.753436a98.761442 98.761442 0 0 0 99.734209 97.276693l114.786498 4.505447V292.664097z m294.389991-44.542486v151.905235l-196.294126-58.622007-311.695002 68.810461-7.218955 4.351852 1.228759 131.374733-99.324623 112.636171-26.162311 219.384541H179.603493A177.299572 177.299572 0 0 1 0 629.753436V174.959299A177.35077 177.35077 0 0 1 179.603493 0.014847H801.76474a177.35077 177.35077 0 0 1 179.552295 174.893254z","p-id":"3727"}}]})}},e6fe:function(t,e,n){var a=n("b2b7");t.exports={__esModule:!0,default:a.svgComponent({tag:"svg",attrsMap:{t:"1653279259330",class:"icon",viewBox:"0 0 1024 1024",version:"1.1",xmlns:"http://www.w3.org/2000/svg","p-id":"4202","xmlns:xlink":"http://www.w3.org/1999/xlink"},children:[{tag:"path",attrsMap:{d:"M54.859102 64.003017A64.804294 64.804294 0 0 0 120.321679 128.002743h783.356642a63.999726 63.999726 0 1 0 0-127.999452H120.321679A64.804294 64.804294 0 0 0 54.859102 64.003017zM212.115571 640.000549h103.862412v319.998628A65.060293 65.060293 0 0 0 381.44056 1023.998903h261.11888a65.060293 65.060293 0 0 0 65.462577-63.999726V640.000549h103.862412a63.926583 63.926583 0 0 0 46.079803-109.457817l-299.518717-293.740455a66.194002 66.194002 0 0 0-92.159605 0l-299.884429 293.740455A63.890012 63.890012 0 0 0 212.115571 640.000549z","p-id":"4203"}}]})}},f67c:function(t,e,n){},f8af5:function(t,e){t.exports="data:image/png;base64,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"}}]);