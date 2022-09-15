(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2511f503"],{"07b2":function(e,t,a){},"0f44":function(e,t,a){"use strict";a("2ba1")},"23b3":function(e,t,a){},"2ba1":function(e,t,a){},3111:function(e,t,a){"use strict";var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"status-icon-item"},["image"===e.type?a("image-type-svg",{style:{height:e.size}}):"video"===e.type?a("video-type-svg",{style:{height:e.size}}):"audio"===e.type?a("audio-type-svg",{style:{height:e.size}}):"iframe"===e.type?a("youtube-type-svg",{style:{height:e.size}}):"website"===e.type?a("url-type-svg",{style:{height:e.size}}):"pdf"===e.type?a("pdf-type-svg",{style:{height:e.size}}):(e.type,a("text-type-svg",{style:{height:e.size}}))],1)},s=[],i=a("8448"),r=a.n(i),o=a("998c"),l=a.n(o),d=a("4084"),c=a.n(d),u=a("8a21"),p=a.n(u),g=a("1eeb"),y=a.n(g),f=a("5a1d"),m=a.n(f),h=a("6631"),w=a.n(h),v={name:"MaterialTypeIcon",components:{TextTypeSvg:r.a,ImageTypeSvg:l.a,VideoTypeSvg:c.a,AudioTypeSvg:p.a,YoutubeTypeSvg:y.a,PdfTypeSvg:m.a,UrlTypeSvg:w.a},props:{type:{type:String,required:!0},size:{type:String,default:"30px"}},data:function(){return{}}},T=v,C=(a("e573"),a("0c7c")),b=Object(C["a"])(T,n,s,!1,null,"59c3a98a",null);t["a"]=b.exports},"49de":function(e,t,a){"use strict";a.r(t),a.d(t,"materialAPIUrl",(function(){return s})),a.d(t,"MaterialAddOrUpdate",(function(){return i})),a.d(t,"MaterialQueryById",(function(){return r})),a.d(t,"MaterialDelete",(function(){return o})),a.d(t,"MaterialDeleteBatch",(function(){return l})),a.d(t,"MaterialList",(function(){return d})),a.d(t,"YoutubeQueryByKeywords",(function(){return c})),a.d(t,"FileRecord",(function(){return u})),a.d(t,"addFileUploadRecord",(function(){return p}));var n=a("b775"),s={MaterialAddOrUpdate:"/classcipe/api/material/addOrUpdate",MaterialQueryById:"/classcipe/api/material/queryById",MaterialDelete:"/classcipe/api/material/delete",MaterialDeleteBatch:"/classcipe/api/material/deleteBatch",MaterialList:"/classcipe/api/material/list",YoutubeQueryByKeywords:"/classcipe/api/youtube/queryByKeywords",FileRecord:"/classcipe/api/fileUploadRecord/list",addFileUploadRecord:"/classcipe/api/fileUploadRecord/add"};function i(e){return Object(n["d"])({url:s.MaterialAddOrUpdate,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function r(e){return Object(n["d"])({url:s.MaterialQueryById,method:"get",params:e})}function o(e){return Object(n["d"])({url:s.MaterialDelete,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function l(e){return Object(n["d"])({url:s.MaterialDeleteBatch,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function d(e){return Object(n["d"])({url:s.MaterialList,method:"get",params:e})}function c(e){return Object(n["d"])({url:s.YoutubeQueryByKeywords,method:"get",params:e})}function u(e){return Object(n["d"])({url:s.FileRecord,method:"get",params:e})}function p(e){return Object(n["d"])({url:s.addFileUploadRecord,method:"post",data:e})}},"542c":function(e,t,a){"use strict";var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"preview-preview"},[e.loadingClass?[a("a-skeleton",{attrs:{active:""}})]:[a("div",{staticClass:"material-preview"},[a("a-row",{staticClass:"title-header"},[a("a-col",{staticClass:"action-header-toggle title-line",attrs:{span:"24"}},[e.computerSize("video")>0?a("div",{staticClass:"title"},[a("span",{staticClass:"title-name"},[e._v("Video :")]),a("span",{staticClass:"title-size"},[e._v(e._s(e.computerSize("video")))])]):e._e(),e.computerSize("audio")>0?a("div",{staticClass:"title"},[e.filterType?e._e():a("span",{staticClass:"title-split"},[e._v(" |")]),a("span",{staticClass:"title-name"},[e._v("Audio :")]),a("span",{staticClass:"title-size"},[e._v(e._s(e.computerSize("audio")))])]):e._e(),e.computerSize("pdf")>0?a("div",{staticClass:"title"},[e.filterType?e._e():a("span",{staticClass:"title-split"},[e._v(" |")]),a("span",{staticClass:"title-name"},[e._v("Pdf :")]),a("span",{staticClass:"title-size"},[e._v(e._s(e.computerSize("pdf")))])]):e._e(),e.computerSize("image")>0?a("div",{staticClass:"title"},[e.filterType?e._e():a("span",{staticClass:"title-split"},[e._v(" |")]),a("span",{staticClass:"title-name"},[e._v("Image :")]),a("span",{staticClass:"title-size"},[e._v(e._s(e.computerSize("image")))])]):e._e(),e.computerSize("iframe")>0?a("div",{staticClass:"title"},[e.filterType?e._e():a("span",{staticClass:"title-split"},[e._v(" |")]),a("span",{staticClass:"title-name"},[e._v("Youtube :")]),a("span",{staticClass:"title-size"},[e._v(e._s(e.computerSize("iframe")))])]):e._e(),e.computerSize("website")>0?a("div",{staticClass:"title"},[e.filterType?e._e():a("span",{staticClass:"title-split"},[e._v(" |")]),a("span",{staticClass:"title-name"},[e._v("Website :")]),a("span",{staticClass:"title-size"},[e._v(e._s(e.computerSize("website")))])]):e._e()])],1),a("a-row",{staticClass:"preview-data-info"},[a("div",{staticClass:"content-wrapper"},[a("div",{staticClass:"content-list"},[a("a-list",{attrs:{size:"large","data-source":e.elementsList},scopedSlots:e._u([{key:"renderItem",fn:function(t){return a("a-list-item",{key:"item.key",staticClass:"my-list-item"},[a("material-type-icon",{staticClass:"icon-content",attrs:{type:t.type}}),a("span",{staticClass:"name-content",attrs:{title:t.tip||t.url}},[a("span",{staticClass:"name-text"},[e._v(" "+e._s(t.tip||t.url)+" ")])]),a("span",{staticClass:"page-content"},[a("span",{staticClass:"name-text"},[e._v(" Page "+e._s(e.currentPageIndex+1)+" ")])]),a("div",{staticClass:"action"},["tip"!==t.type?a("a-button",{staticClass:"action-ensure action-item",attrs:{shape:"round"},on:{click:function(a){return e.handlePreviewMaterial(t)}}},[a("a-icon",{attrs:{type:"eye",theme:"filled"}}),a("div",{staticClass:"btn-text"},[e._v(" Preview ")])],1):e._e()],1)],1)}}])})],1)])])],1)]],2)},s=[],i=(a("a9e3"),a("4de4"),a("159b"),a("69b3")),r=a("8448"),o=a.n(r),l=a("998c"),d=a.n(l),c=a("4084"),u=a.n(c),p=a("8a21"),g=a.n(p),y=a("1eeb"),f=a.n(y),m=a("5a1d"),h=a.n(m),w=a("6631"),v=a.n(w),T=a("7aef"),C=a("3111"),b={name:"TaskMaterialPreview",components:{MaterialTypeIcon:C["a"],NoMoreResources:i["a"],TextTypeSvg:o.a,ImageTypeSvg:d.a,VideoTypeSvg:u.a,AudioTypeSvg:g.a,YoutubeTypeSvg:f.a,PdfTypeSvg:h.a,UrlTypeSvg:v.a},props:{currentPageElementLists:{type:Array,default:function(){return[]}},currentPageIndex:{type:Number,default:0},filterType:{type:String,default:""}},computed:{},mounted:function(){},data:function(){return{elementsList:[],showMenuList:[],fileTypeMap:T["a"],loadingClass:!1}},created:function(){var e=this;this.$logger.info("currentPageElementLists ",this.currentPageElementLists),this.filterType?this.elementsList=this.currentPageElementLists.filter((function(t){return t.type===e.filterType})):this.elementsList=this.currentPageElementLists},methods:{handleGotoImgIndex:function(e){this.$logger.info("handleGotoImgIndex "+e),this.currentImgIndex=e,this.$refs.carousel.goTo(e)},handlePreviewMaterial:function(e){this.$logger.info("handlePreviewMaterial "+e),"tip"!==e.type&&window.open(e.url,"_blank")},computerSize:function(e){var t=0;return this.elementsList.forEach((function(a){a.type===e&&t++})),t}}},I=b,_=(a("a475"),a("0c7c")),S=Object(_["a"])(I,n,s,!1,null,"27616282",null);t["a"]=S.exports},"873a":function(e,t,a){"use strict";var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"material-preview"},[a("a-row",{staticClass:"action-header"},[a("a-col",{staticClass:"action-header-toggle",attrs:{span:"24"}})],1),a("a-row",{staticClass:"top-header"}),a("a-row",{staticClass:"preview-data-info"},[a("a-col",{staticClass:"slide-preview",attrs:{span:"24"}},[a("a-col",{attrs:{span:"24"}},[e.mediaList.length?e._e():a("div",{staticClass:"no-preview-img"},[a("no-more-resources")],1)]),a("a-col",{staticStyle:{display:"flex","flex-direction":"row"},attrs:{span:"24"}},[a("div",{staticClass:"media-preview"},[e.mediaList.length?a("a-carousel",{ref:"carousel",staticClass:"my-carousel",attrs:{arrows:"","after-change":e.onChangePage}},[a("div",{staticClass:"custom-slick-arrow",staticStyle:{left:"-40px",zIndex:"9"},attrs:{slot:"prevArrow"},slot:"prevArrow"},[a("a-icon",{attrs:{type:"left-circle"}})],1),a("div",{staticClass:"custom-slick-arrow",staticStyle:{right:"-30px",zIndex:"9"},attrs:{slot:"nextArrow"},slot:"nextArrow"},[a("a-icon",{attrs:{type:"right-circle"}})],1),e._l(e.mediaList,(function(t,n){return a("div",{key:"cIndex"+n},[a("div",{staticStyle:{height:"400px"}},["image"==t.type?a("img",{attrs:{src:t.url,preview:0}}):e._e(),"video"==t.type?a("video",{attrs:{src:t.url,controls:""}}):e._e(),"audio"==t.type?a("audio",{attrs:{src:t.url,controls:""}}):e._e(),"iframe"==t.type?a("iframe",{staticClass:"detail-iframe",attrs:{frameborder:"no",border:"0",allowfullscreen:"",src:t.url}}):e._e()])])}))],2):e._e()],1)])],1)],1),e.mediaList&&e.mediaList.length?a("div",{staticClass:"page-info"},[e._v(" "+e._s(e.currentImgIndex+1)+" / "+e._s(e.mediaList.length)+" ")]):e._e()],1)},s=[],i=a("69b3"),r=a("8448"),o=a.n(r),l=a("998c"),d=a.n(l),c=a("4084"),u=a.n(c),p=a("8a21"),g=a.n(p),y=a("1eeb"),f=a.n(y),m=a("5a1d"),h=a.n(m),w=a("6631"),v=a.n(w),T=a("7aef"),C=a("3111"),b={name:"MediaPreview",components:{MaterialTypeIcon:C["a"],NoMoreResources:i["a"],TextTypeSvg:o.a,ImageTypeSvg:d.a,VideoTypeSvg:u.a,AudioTypeSvg:g.a,YoutubeTypeSvg:f.a,PdfTypeSvg:h.a,UrlTypeSvg:v.a},props:{mediaList:{type:Array,default:function(){return[]}},materialType:{type:String,default:"image"}},computed:{},mounted:function(){},data:function(){return{elementsList:[],currentImgIndex:0,fileTypeMap:T["a"],loadingClass:!1}},created:function(){},methods:{onChangePage:function(e){this.currentImgIndex=e}}},I=b,_=(a("0f44"),a("0c7c")),S=Object(_["a"])(I,n,s,!1,null,"71a7280b",null);t["a"]=S.exports},a475:function(e,t,a){"use strict";a("07b2")},d33b4:function(e,t,a){"use strict";a.d(t,"a",(function(){return o}));a("4de4"),a("b0c0");var n=a("823b"),s=a("3f76"),i=a("c1df"),r=a.n(i),o={data:function(){return{type2Name:{1:"Topic",2:"Unit Plan",3:"Material",4:"Task",5:"Lesson",6:"Evaluation"},browserDataType:{bigIdea:"bigIdea",sync:"sync",curriculum:"curriculum",subjectSpecificSkill:"subjectSpecificSkill",centurySkill:"centurySkill",all21Century:"all21Century",assessmentType:"assessmentType",idu:"idu"}}},created:function(){},computed:{getWeek:function(){if(2===this.rangeDate.length){var e="",t=Math.abs(parseInt(this.rangeDate[0].diff(this.rangeDate[1],"days")/7)),a=Math.abs(this.rangeDate[0].diff(this.rangeDate[1],"days"))%7;return t>0&&(e+=t>1?t+" weeks ":t+" week "),a>0&&(e+=a>1?a+" days ":a+" day "),e}return""}},methods:{tagIsExist:function(e,t){return t.filter((function(t){return t.toLowerCase()===e.toLowerCase()})).length>0},tagNameIsExist:function(e,t){return t.filter((function(t){return t.name.toLowerCase()===e.toLowerCase()})).length>0},handleOpenItem:function(e){e.type=this.type,n["info"]("handleEditItem",e),e.type===s["e"]["unit-plan"]?window.open("/teacher/unit-plan-redirect/"+e.id,"_blank"):e.type===s["e"].task?window.open("/teacher/task-redirect/"+e.id,"_blank"):e.type===s["e"].evaluation&&window.open("/teacher/evaluation-redirect/"+e.id,"_blank")},handleLocationItem:function(e){n["info"]("handleEditItem",e),e.type===s["e"]["unit-plan"]?window.location.href="/teacher/unit-plan-redirect/"+e.id:e.type===s["e"].task?window.location.href="/teacher/task-redirect/"+e.id:e.type===s["e"].evaluation&&(window.location.href="/teacher/evaluation-redirect/"+e.id)},getWeekByDate:function(e,t){if(this.$logger.info("getWeekByDate",e,t),e&&t){var a="",n=r()(t).diff(r()(e),"days");this.$logger.info("diffDays",n);var s=Math.floor(Math.abs(n/7)),i=Math.ceil(Math.abs(n%7));return s>0&&(a+=s>1?s+" weeks ":s+" week "),i>0&&(a+=i>1?i+" days ":i+" day "),this.$logger.info("getWeekByDate str",a),a}return""}}}},d6ea:function(e,t,a){var n=a("b2b7");e.exports={__esModule:!0,default:n.svgComponent({tag:"svg",attrsMap:{xmlns:"http://www.w3.org/2000/svg",width:"27",height:"27",viewBox:"0 0 27 27"},children:[{tag:"g",attrsMap:{transform:"translate(-771.25 -365.25)"},children:[{tag:"path",attrsMap:{class:"a",style:"fill:#15c39a;stroke:#15c39a;",d:"M13,0A13,13,0,1,1,0,13,13,13,0,0,1,13,0Z",transform:"translate(771.75 365.75)"}},{tag:"path",attrsMap:{class:"b",style:"fill:#fff;",d:"M16702.625,20201.145a.935.935,0,0,1-.67-.314.953.953,0,0,1-.254-.684v-4.016h-4.029a.964.964,0,0,1,0-1.926h4.029v-4.031a.965.965,0,0,1,1.928,0v4.031h4.035a.956.956,0,0,1,.918.922.942.942,0,0,1-.254.689.956.956,0,0,1-.664.314h-4.035v4.092a.962.962,0,0,1-.965.922Z",transform:"translate(-15917.914 -19816.447)"}}]}]})}},db6a:function(e,t,a){"use strict";a.r(t),a.d(t,"knowledgeAPIUrl",(function(){return s})),a.d(t,"KnowledgeGetTree",(function(){return i})),a.d(t,"KnowledgeAddOrUpdateTag",(function(){return r})),a.d(t,"KnowledgeAddOrUpdate",(function(){return o})),a.d(t,"KnowledgeQueryById",(function(){return l})),a.d(t,"KnowledgeQueryTagsByKnowledgeId",(function(){return d})),a.d(t,"KnowledgeDelete",(function(){return c})),a.d(t,"KnowledgeDeleteBatch",(function(){return u})),a.d(t,"KnowledgeList",(function(){return p})),a.d(t,"KnowledgeSearch",(function(){return g})),a.d(t,"KnowledgeQueryContentByDescriptionId",(function(){return y})),a.d(t,"GetAssessmentTypeList",(function(){return f})),a.d(t,"QueryContentByAssessmentTypeId",(function(){return m})),a.d(t,"QueryKnowledgesByAssessmentTypeId",(function(){return h})),a.d(t,"Get21Century",(function(){return w})),a.d(t,"getAll21Century",(function(){return v})),a.d(t,"GetIBIduList",(function(){return T})),a.d(t,"SearchKnowledge",(function(){return C})),a.d(t,"FindRecommendByKnowledgeId",(function(){return b}));var n=a("b775"),s={KnowledgeGetTree:"/classcipe/api/knowledge/getTree",KnowledgeAddOrUpdate:"/classcipe/api/knowledge/addOrUpdate",KnowledgeAddOrUpdateTag:"/classcipe/api/knowledge/addOrUpdateTag",KnowledgeQueryById:"/classcipe/api/knowledge/queryById",KnowledgeQueryTagsByKnowledgeId:"/classcipe/api/knowledge/queryTagsByKnowledgeId",FindRecommendByKnowledgeId:"/classcipe/api/knowledge/findRecommendByKnowledgeId",KnowledgeDelete:"/classcipe/api/knowledge/delete",KnowledgeDeleteBatch:"/classcipe/api/knowledge/deleteBatch",KnowledgeList:"/classcipe/api/knowledge/list",KnowledgeSearch:"/classcipe/api/knowledge/search",KnowledgeQueryContentByDescriptionId:"/classcipe/api/knowledge/queryContentByDescriptionId",GetAssessmentTypeList:"/classcipe/api/knowledgeAssessmentType/getAssessmentTypeList",QueryContentByAssessmentTypeId:"/classcipe/api/knowledgeAssessmentType/queryContentByAssessmentTypeId",QueryKnowledgesByAssessmentTypeId:"/classcipe/api/knowledgeAssessmentType/queryKnowledgesByAssessmentTypeId",Get21Century:"/classcipe/api/knowledge/get21Century",getAll21Century:"/classcipe/api/knowledge/getAll21Century",GetIBIduList:"/classcipe/api/knowledge/getIBIduList",SearchKnowledge:"/classcipe/api/knowledge/searchKnowledge"};function i(e){return Object(n["d"])({url:s.KnowledgeGetTree,method:"get",params:e})}function r(e){return Object(n["d"])({url:s.KnowledgeAddOrUpdateTag,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function o(e){return Object(n["d"])({url:s.KnowledgeAddOrUpdate,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function l(e){return Object(n["d"])({url:s.KnowledgeQueryById,method:"get",params:e})}function d(e){return Object(n["d"])({url:s.KnowledgeQueryTagsByKnowledgeId,method:"get",params:e})}function c(e){return Object(n["d"])({url:s.KnowledgeDelete,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function u(e){return Object(n["d"])({url:s.KnowledgeDeleteBatch,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function p(e){return Object(n["d"])({url:s.KnowledgeList,method:"get",params:e})}function g(e){return Object(n["d"])({url:s.KnowledgeSearch,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function y(e){return Object(n["d"])({url:s.KnowledgeQueryContentByDescriptionId,method:"get",params:e})}function f(e){return Object(n["d"])({url:s.GetAssessmentTypeList,method:"get",params:e})}function m(e){return Object(n["d"])({url:s.QueryContentByAssessmentTypeId,method:"get",params:e})}function h(e){return Object(n["d"])({url:s.QueryKnowledgesByAssessmentTypeId,method:"get",params:e})}function w(e){return Object(n["d"])({url:s.Get21Century,method:"get",params:e})}function v(e){return Object(n["d"])({url:s.getAll21Century,method:"get",params:e})}function T(e){return Object(n["d"])({url:s.GetIBIduList,method:"get",params:e})}function C(e){return Object(n["d"])({url:s.SearchKnowledge,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function b(e){return Object(n["d"])({url:s.FindRecommendByKnowledgeId,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}},e573:function(e,t,a){"use strict";a("23b3")}}]);