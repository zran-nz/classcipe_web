(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7e689ca6"],{"21fb":function(t,e,i){"use strict";i.d(e,"a",(function(){return n}));i("b0c0");var n={data:function(){return{unwatch:null,routeName:this.$route.name}},created:function(){var t=this;this.unwatch=this.$store.watch((function(t){return t.user.currentSchool}),(function(e){return e&&t.$route.name===t.routeName&&t.handleSchoolChange(e)}))},computed:{},beforeDestroy:function(){this.unwatch&&this.unwatch()},methods:{handleSchoolChange:function(t){}}}},2365:function(t,e,i){},"3bcb":function(t,e,i){},"4362e":function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"cc-card"},[i("div",{staticClass:"cover-img relative-position",style:{backgroundImage:"url("+(t.content.image||"http://dcdkqlzgpl5ba.cloudfront.net/1392467808404684802/file/202208140641519097-20220814143449.png")+")",width:t.width+"rem"}},[t.innerDesc?i("div",{staticClass:"inner-mask"}):t._e(),t.innerDesc?i("div",{staticClass:"card-bottom-section q-pa-sm col q-gutter-xs inner-desc absolute-bottom"},[i("div",{staticClass:"type-tag"},[i("a-tag",{attrs:{color:"#15C39A"}},[t._v(t._s(t._f("type2Name")(t.content.type)))])],1),i("div",{staticClass:"card-title",attrs:{title:t.mainTitle}},[t._v(t._s(t.mainTitle))]),i("div",{staticClass:"card-sub-title",attrs:{title:t.subDescription}},[t._v(" "+t._s(t.subDescription)+" ")])]):t._e(),t.outerDesc?i("div",{staticClass:"inner-tag"},[i("a-tag",{attrs:{color:"#15C39A"}},[t._v(t._s(t._f("type2Name")(t.content.type)))])],1):t._e()]),t.outerDesc?i("div",{staticClass:"card-bottom-section outer-desc",style:{width:t.width+"rem"}},[i("div",{staticClass:"main-title-line"},[i("div",{staticClass:"main-title",attrs:{title:t.mainTitle}},[t._v(" "+t._s(t.mainTitle)+" ")]),i("div",{staticClass:"main-action"},[i("a-space",[t.content.star?i("a-rate",{staticClass:"cc-library-rate",attrs:{value:t.content.star||10,disabled:""}}):t._e(),t.content.star?t._e():i("div",{staticClass:"no-review"},[t._v("No reviews")]),i("div",{staticClass:"share-icon",on:{click:function(t){t.stopPropagation(),t.preventDefault()}}},[i("a-tooltip",{attrs:{trigger:"click",getPopupContainer:function(t){return t.parentElement},placement:"bottomRight"}},[i("template",{slot:"title"},[i("div",{staticClass:"detail-share"},[i("share-button",{attrs:{link:t.wrapperLink(t.content),title:t.content.name}})],1)]),i("a-icon",{attrs:{type:"share-alt"}})],2)],1)],1)],1)]),i("div",{staticClass:"sub-desc",attrs:{title:t.subDescription}},[t._v(" "+t._s(t.subDescription)+" ")])]):t._e()])},r=[],s=(i("a9e3"),i("b0c0"),i("fb6a"),i("a4d3"),i("e01a"),i("99af"),i("5fc3")),o={name:"CardListItem",components:{ShareButton:s["a"]},props:{content:{type:Object,required:!0},width:{type:Number,default:20},innerDesc:{type:Boolean,default:!1},outerDesc:{type:Boolean,default:!0}},computed:{mainTitle:function(){var t=this.content.name||"Untitled";return t.slice(0,1).toUpperCase()+t.slice(1)},subDescription:function(){return this.content.description||""}},data:function(){return{}},created:function(){},methods:{wrapperLink:function(t){if(t&&t.id){var e=this.$classcipe.getContentTypeName(t.type);return"".concat("https://www.classcipe.com","/v2/").concat(e,"/").concat(t.id)}return""}}},a=o,c=(i("697f"),i("0c7c")),l=Object(c["a"])(a,n,r,!1,null,"5c48bee0",null);e["a"]=l.exports},"44f5":function(t,e,i){"use strict";i.d(e,"d",(function(){return o})),i.d(e,"b",(function(){return a})),i.d(e,"a",(function(){return c})),i.d(e,"e",(function(){return l})),i.d(e,"c",(function(){return d}));var n=i("b775"),r="live",s={CreateQRCode:"/classcipe/api/v2/".concat(r,"/createQRCode"),FindWorkShops:"/classcipe/api/v2/".concat(r,"/findWorkShops"),SaveRegisteredRecord:"/classcipe/api/v2/".concat(r,"/saveRegisteredRecord"),CancelRegistered:"/classcipe/api/v2/".concat(r,"/cancelRegistered"),DetailBySessionId:"/classcipe/api/v2/".concat(r,"/detailBySessionId")};function o(t){return Object(n["d"])({url:s.FindWorkShops,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function a(t){return Object(n["d"])({url:s.CreateQRCode,method:"get",responseType:"blob",params:t})}function c(t){return Object(n["d"])({url:s.CancelRegistered,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function l(t){return Object(n["d"])({url:s.SaveRegisteredRecord,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function d(t){return Object(n["d"])({url:s.DetailBySessionId,method:"get",params:t})}},"5fc3":function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"share-button"},[i("div",{staticClass:"share-title"},[t._v("Share by QR code")]),i("a-spin",{attrs:{spinning:t.loading}},[i("div",{staticClass:"share-qrcode"},[i("img",{attrs:{src:t.qrCode,alt:"qrCode"}})])]),i("div",{staticClass:"share-divider"},[t._v("Or")]),i("div",{staticClass:"share-out"},[i("icon-font",{attrs:{type:"icon-Facebook"},on:{click:function(e){return t.share("fb")}}}),i("icon-font",{attrs:{type:"icon-Linkdin"},on:{click:function(e){return t.share("in")}}}),i("icon-font",{attrs:{type:"icon-Twitter"},on:{click:function(e){return t.share("twitter")}}}),i("icon-font",{attrs:{type:"icon-lianjie1"},on:{click:t.handleCopy}})],1)],1)},r=[],s=(i("99af"),i("9911"),i("d3b7"),i("44f5")),o={name:"ShareButton",props:{link:{type:String,required:!0},title:{type:String,default:"Share"}},data:function(){return{qrCode:"",loading:!1,shareLink:{fb:"https://www.facebook.com/share.php?title=".concat(this.title,"&u=").concat(encodeURIComponent(this.link)),in:"https://www.linkedin.com/shareArticle?mini=true&source=str&title=".concat(this.title,"&url=").concat(encodeURIComponent(this.link)),twitter:"https://twitter.com/intent/tweet?text=".concat(this.title,"&url=").concat(encodeURIComponent(this.link)),whatsapp:"https://api.whatsapp.com/send?text=".concat(encodeURIComponent(this.link))}}},created:function(){this.initQrcode()},methods:{initQrcode:function(){var t=this;this.link&&(this.loading=!0,Object(s["b"])({url:this.link}).then((function(e){var i=new FileReader;i.readAsDataURL(new Blob([e])),i.onload=function(){t.qrCode=i.result},i.onerror=function(){}})).finally((function(e){t.loading=!1})))},share:function(t){window.open(this.shareLink[t],"_blank")},handleCopy:function(){var t=this;this.$copyText(this.link).then((function(){t.$message.success("Copy successfully")})).catch((function(){t.$message.error("Copy failed")}))}}},a=o,c=(i("8190"),i("0c7c")),l=Object(c["a"])(a,n,r,!1,null,"35e10260",null);e["a"]=l.exports},"697f":function(t,e,i){"use strict";i("d3b0")},"6e84":function(t,e,i){"use strict";i.d(e,"a",(function(){return n}));i("b0c0");var n={data:function(){return{unwatch:null,routeName:this.$route.name}},computed:{redirectUrl:function(){return"student"===this.$store.state.user.currentRole?"/student/main/my-task":"/account/info"}},created:function(){var t=this;this.unwatch=this.$store.watch((function(t){return t.app.userMode}),(function(e){e&&t.$route.name===t.routeName&&(t.handleModeChange(e),t.routeInMode())})),this.routeInMode()},beforeDestroy:function(){this.unwatch&&this.unwatch()},methods:{routeInMode:function(){this.$route.meta.mode&&this.$route.meta.mode!==this.$store.state.app.userMode&&this.$router.push({path:this.redirectUrl})},handleModeChange:function(t){}}}},8190:function(t,e,i){"use strict";i("2365")},d3b0:function(t,e,i){},e719:function(t,e,i){"use strict";i("3bcb")},ed22:function(t,e,i){"use strict";var n=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"card-list-wrapper"},["center"===t.titlePosition?[i("div",{staticClass:"card-list-title-center"},[i("div",{staticClass:"title-item"},[i("div",{staticClass:"main-title"},[t._v(" "+t._s(t.title)+" ")]),i("div",{staticClass:"sub-title"},[t._v(" "+t._s(t.subTitle)+" ")])]),i("div",{staticClass:"more-action"},[t.isSchoolMode?t._e():i("router-link",{attrs:{to:"/teacher/library-all/"+t.category}},[t._v("More")]),t.isSchoolMode?i("router-link",{attrs:{to:"/teacher/resource-all/"+t.category}},[t._v("More")]):t._e()],1)])]:t._e(),"left"===t.titlePosition?[i("div",{staticClass:"card-list-title"},[i("div",{staticClass:"title-item"},[i("div",{staticClass:"main-title"},[t._v(" "+t._s(t.title)+" ")]),i("div",{staticClass:"sub-title"},[t._v(" "+t._s(t.subTitle)+" ")])]),i("div",{staticClass:"more-action"},[t.isSchoolMode?t._e():i("router-link",{attrs:{to:"/teacher/library-all/"+t.category}},[t._v("More")]),t.isSchoolMode?i("router-link",{attrs:{to:"/teacher/resource-all/"+t.category}},[t._v("More")]):t._e()],1)])]:t._e(),i("div",{staticClass:"scroll-left",class:{"inner-scroll-left":t.innerDesc,"outer-scroll-left":t.outerDesc,"no-more-left":!t.hasMoreLeft},on:{click:t.scrollLeft}},[i("a-icon",{style:{fontSize:"16px",color:"#6967C3"},attrs:{type:"arrow-left"}})],1),i("div",{staticClass:"scroll-right",class:{"inner-scroll-right":t.innerDesc,"outer-scroll-right":t.outerDesc,"no-more-right":!t.hasMoreRight},on:{click:t.scrollRight}},[i("a-icon",{style:{fontSize:"16px",color:"#6967C3"},attrs:{type:"arrow-right"}})],1),i("div",{staticClass:"card-list",attrs:{id:t.category}},t._l(t.list,(function(e,n){return i("div",{key:n,staticClass:"card-item",on:{click:function(i){return t.handlePreviewDetail(e)}}},[i("card-list-item",t._b({attrs:{"inner-desc":t.innerDesc,"outer-desc":t.outerDesc,content:e,width:t.cardSize}},"card-list-item",t.$attrs,!1))],1)})),0),t.previewVisible?i("content-preview",{attrs:{"content-id":t.previewCurrentId,"content-type":t.previewType,"show-buy-button":"library"===t.cardMode,"show-edit-button":!0},on:{close:t.handlePreviewClose}}):t._e()],2)},r=[],s=(i("a9e3"),i("99af"),i("4362e")),o=i("ce85"),a=i("f031"),c={components:{CardListItem:s["a"],ContentPreview:o["a"]},props:{title:{type:String,required:!0},subTitle:{type:String,default:""},titlePosition:{type:String,default:"left"},category:{type:String,required:!0},cardSize:{type:Number,default:20},list:{type:Array,required:!0},isSchoolMode:{type:Boolean,default:!1},cardMode:{type:String,default:"library"},innerDesc:{type:Boolean,default:!1},outerDesc:{type:Boolean,default:!0}},mixins:[a["a"]],data:function(){return{scrollX:0,slide:1,stars:1,showPreview:!1,contentId:null,contentType:0,hasMoreLeft:!0,hasMoreRight:!0}},watch:{list:function(t){t&&t.length&&this.hiddenArrow(document.getElementById(this.category))}},mounted:function(){this.hiddenArrow(document.getElementById(this.category))},methods:{scrollFn:function(t){this.scrollX=0===t.target.scrollLeft?0:1},moveTo:function(t){var e=this.$refs.list,i=e.scrollLeft+t*e.offsetWidth*.7;i<0&&(i=0),this.scrollX=0===e.scrollLeft?0:1,this.$refs.list.scrollTo({left:i,behavior:"smooth"})},viewAll:function(){},scrollLeft:function(){var t=document.getElementById(this.category);t.scrollBy({left:-800,behavior:"smooth"}),this.hiddenArrow(t)},scrollRight:function(){var t=document.getElementById(this.category);t.scrollBy({left:800,behavior:"smooth"}),this.hiddenArrow(t)},hiddenArrow:function(t){var e=this;setTimeout((function(){e.$logger.info("hidden arrow",t,"scrollLeft",t.scrollLeft,"offsetWidth",t.offsetWidth,"scrollWidth",t.scrollWidth),t&&t.scrollLeft+t.offsetWidth>=t.scrollWidth?e.hasMoreRight=!1:e.hasMoreRight=!0,t&&t.scrollLeft<=0?e.hasMoreLeft=!1:e.hasMoreLeft=!0,e.$logger.info("hasMoreLeft ".concat(e.hasMoreLeft," hasMoreRight ").concat(e.hasMoreRight))}),500)}}},l=c,d=(i("e719"),i("0c7c")),u=Object(d["a"])(l,n,r,!1,null,"166a04c8",null);e["a"]=u.exports},f031:function(t,e,i){"use strict";i.d(e,"a",(function(){return o}));var n=i("1da1"),r=(i("96cf"),i("d81d"),i("0481"),i("b0c0"),i("c621")),s=i("944d"),o={data:function(){return{allowPreview:!0,previewCurrentId:null,previewType:null,previewCode:null,previewVisible:!1,updateEditSlideLoading:!1,setColor:["#FFEDAF","#C8F4FF","#E6E4FF","#ffccb0","#ffa9a2","#a3ecb9","#f7c5f8","#ffbfe2","#d5b9ff","#c4f6b1"],savingSlides:!1}},computed:{commandTermsList:function(){return Object(s["a"])(this.content.learnOuts.map((function(t){return t.commandTerms})).flat(2),"name").map((function(t){return t.name}))},knowledgeTagsList:function(){return Object(s["a"])(this.content.learnOuts.map((function(t){return t.knowledgeTags})).flat(2),"name").map((function(t){return t.name}))}},methods:{handlePreviewDetail:function(t){var e=this;this.$logger.info("handlePreviewDetail",t,"allowPreview",this.allowPreview),this.allowPreview&&(this.previewVisible=!1,this.$nextTick((function(){e.previewCurrentId=t.id,e.previewType=t.type,e.previewCode=t.sessionId,e.previewVisible=!0})),this.$emit("preview",t))},handlePreviewClose:function(){this.$logger.info("handlePreviewClose"),this.previewVisible=!1,this.previewCurrentId=null,this.previewType=null,this.previewCode=null},updateEditSlideStatus:function(){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function e(){var i;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(t.updateEditSlideLoading){e.next=20;break}if(e.prev=1,t.updateEditSlideLoading=!0,i=parseInt(t.content.type),i!==t.$classcipe.typeMap.task){e.next=9;break}return e.next=7,Object(r["c"])({taskId:t.content.id,needRefresh:!0});case 7:e.next=12;break;case 9:if(i!==t.$classcipe.typeMap.pd){e.next=12;break}return e.next=12,Object(r["c"])({taskId:t.content.id,needRefresh:!0});case 12:t.content.slideEditing=!1,e.next=17;break;case 15:e.prev=15,e.t0=e["catch"](1);case 17:return e.prev=17,t.updateEditSlideLoading=!1,e.finish(17);case 20:case"end":return e.stop()}}),e,null,[[1,15,17,20]])})))()}}}}}]);