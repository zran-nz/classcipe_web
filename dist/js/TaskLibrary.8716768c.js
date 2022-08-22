(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["TaskLibrary"],{"093a":function(e,t,n){"use strict";n.d(t,"a",(function(){return r})),n.d(t,"c",(function(){return i})),n.d(t,"b",(function(){return o}));var a=n("b775"),s={VideoAddOrUpdate:"/classcipe/api/v2/video/addOrUpdate",VideoQueryById:"/classcipe/api/v2/video/queryById",VideoDelete:"/classcipe/api/v2/video/delete",VideoDeleteBatch:"/classcipe/api/v2/video/deleteBatch",VideoList:"/classcipe/api/v2/video/list"};function r(e){return Object(a["d"])({url:s.VideoAddOrUpdate,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function i(e){return Object(a["d"])({url:s.VideoQueryById,method:"get",params:e})}function o(e){return Object(a["d"])({url:s.VideoDelete+"?id="+e.id,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}},4133:function(e,t,n){"use strict";n("973f")},"49de":function(e,t,n){"use strict";n.r(t),n.d(t,"materialAPIUrl",(function(){return s})),n.d(t,"MaterialAddOrUpdate",(function(){return r})),n.d(t,"MaterialQueryById",(function(){return i})),n.d(t,"MaterialDelete",(function(){return o})),n.d(t,"MaterialDeleteBatch",(function(){return d})),n.d(t,"MaterialList",(function(){return c})),n.d(t,"YoutubeQueryByKeywords",(function(){return l})),n.d(t,"FileRecord",(function(){return u})),n.d(t,"addFileUploadRecord",(function(){return p}));var a=n("b775"),s={MaterialAddOrUpdate:"/classcipe/api/material/addOrUpdate",MaterialQueryById:"/classcipe/api/material/queryById",MaterialDelete:"/classcipe/api/material/delete",MaterialDeleteBatch:"/classcipe/api/material/deleteBatch",MaterialList:"/classcipe/api/material/list",YoutubeQueryByKeywords:"/classcipe/api/youtube/queryByKeywords",FileRecord:"/classcipe/api/fileUploadRecord/list",addFileUploadRecord:"/classcipe/api/fileUploadRecord/add"};function r(e){return Object(a["d"])({url:s.MaterialAddOrUpdate,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function i(e){return Object(a["d"])({url:s.MaterialQueryById,method:"get",params:e})}function o(e){return Object(a["d"])({url:s.MaterialDelete,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function d(e){return Object(a["d"])({url:s.MaterialDeleteBatch,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function c(e){return Object(a["d"])({url:s.MaterialList,method:"get",params:e})}function l(e){return Object(a["d"])({url:s.YoutubeQueryByKeywords,method:"get",params:e})}function u(e){return Object(a["d"])({url:s.FileRecord,method:"get",params:e})}function p(e){return Object(a["d"])({url:s.addFileUploadRecord,method:"post",data:e})}},"7aa6":function(e,t){e.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAAAXNSR0IArs4c6QAABWlJREFUWEfVmX9MHFUQx7/THvGuLaAUKNge7Qnyo9IgAYUWjNo0NipEaqgl0QQbDOgfNcFEA4l/mNSERhJJ1Kgl4o9EE6pVUUi1ptLGKumlJaQttaAVECilSLFAhSP8eGaWXXK3t3e7e3do+/7Zy723bz47b2bevHmEIJoQIg9AAYAkAHEANshPnnUYwKD87ALwPRH9Eqg4MvuiEOJBAM/KgNEm3x8F0ALgA7PQhkGFECkADgAoUuB6pyfw3bU+tE+OYGR2CkMzU9KTW2zYKtita7DWYsX9EXF4JCoBDluE+3c1Aagiom4jH6sLKoSwAqgD8BwAyz/zs6gf6kTj1d/Q65owImNpjMMagZJ1ySi/Mx2rV4bx/3OsXQCVROTyN5lfUCEE293XAHLnxAI+Gb6Iuv4OjMxOmwJUD44Ns6EyIROlcWmw0AruPgVgFxGxXWs2n6BCiAzZnjb0uybxzK9H0TX1d1CA6pdTV92BTzfvRII1nLvY8QqI6KyWEE1QGfJnAGuc48Mo6zoWtBZ9fSFrtyF1B3IiefFwA0C+FqwXqLzcpznUNI/2oLy7FfNChFST6slWEqE+ZTsKo+/irj4AW9Vm4AEqO85xtknWZFFny7JDKtAM25ReoGiWV/NhImJnk5oa9D0Az7NNPnb2m2Vbbn9mcCTjCcVm3yeiF7xAhRCpAM7PiQXL9o6vQu44Rm2HHaw180mOBqzNNCK65KFRIQSHoaKGKxdQ/Ueb0XkDHsdLzaFpZmHea47axHyUxqfx/01EtGsJVN4WT3AwzzlzaNmXvCohGy/aMyTQhqELqO7xVAxHAmf2HmVTyCUip2SjQoiPeP+uG+hAzZ9nAtaSkRf3O3JRsX6Lx9Dyrh/RNNrj8V/1xmxU2jP5v4+JaC8JISwArgCIZm2a3RaNwCljtCC5782BDhxQKSjJdjvasnZz9ygRxTBoPoCTnGDktB8yI9fUWF+QPElx5xH8dP2y13zOrD1KIvMAg9ZwFvPu4Dm81uc0JdzoYH+Q/uTud2xFxfp0FvM6g37BH1V28Riar/UalW14nD/I+svn8Wov5yParXCtAw1pO7jzMIOe5P218Ny3cE5c1XyjOCZJSs04lLDDtV7n/EG/BQPJs2+LjEfTFj5A4ASDsho3ZZ1uxMDMpJd0t8FSH6d75V2taNHRfrCQLMt+Wzja7yvhn30Mysml1d72oWbwrdqYjZcWw8RS04MNBSQLW73Cgt5te/nnDV3QkthkvJXMxyTP5gs2VJBaoH6Xnre6L9Mfl+xFDzaUkFpLr+tMvASN9zyqpGCaZpATsc5rx1EG6nm3L7dUO5Oh8OQP1p//BwrJc6rDk+GAbxY2GEgGVQd8eQsdR07757rB0ShssJAM4sx6Cg5bJP+UtlDTSYkebCggvZISxlXSPK0sxpeKfcGGApJlusXvxTRPBn0IwHGziTPD1iTmSdUP3l7f6G/H24Oax3Jdk3IfoEqc+UR6aulwt3QU0ci49aQwsEvMh+zEWpuYh9L4zSzW8ygia/XWONzJsDfTcfkdItqnrOatWYCQtcpFoJu7pKOoWQhxL5+j/qciGXt5p9qB/ZUdGbaZi2X/UdmRi2OFWpAMbaqQ+9lwtxQr/wqykBsTZsMrCVl4Oi5FKeRyUWx3QIVcNzPwKo0fHOrE4ZHfcWl6XC/EevQn2SJRHHs3KrxL4/vcK3dak+rW8N2A+Yqm1vOyYRw/jPVLh8KxORcGXJMYm10sxUeFWWG3hiPKYgXnqouXDVKCoTS+bHhZKYLpfbFhUDdgzrbKgry+Ocjboh6ce79pUPeX5SrLTgC8q/Gd0yb5ycP4TokdhJ98IXaUiNgWA2r/AqKY1RuF7jn8AAAAAElFTkSuQmCC"},"8f46":function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"status-icon-item"},[e.type===e.typeMap.task?n("span",[e._v("Task")]):e._e(),e.type===e.typeMap["unit-plan"]?n("span",[e._v("Unit")]):e._e(),e.type===e.typeMap.pd?n("span",[e._v("PD")]):e._e(),e.type===e.typeMap.video?n("span",[e._v("Video")]):e._e()])},s=[],r=(n("a9e3"),n("3f76")),i={name:"ContentTypeIcon",props:{type:{type:Number,default:-1},size:{type:String,default:"30px"}},data:function(){return{typeMap:r["e"]}}},o=i,d=(n("4133"),n("0c7c")),c=Object(d["a"])(o,a,s,!1,null,"a464ed10",null);t["a"]=c.exports},"95c6":function(e,t,n){"use strict";n.r(t),n.d(t,"favoritesAPIUrl",(function(){return s})),n.d(t,"FavoritesAdd",(function(){return r})),n.d(t,"FavoritesQueryById",(function(){return i})),n.d(t,"FavoritesDelete",(function(){return o})),n.d(t,"FavoritesDeleteBatch",(function(){return d})),n.d(t,"FavoritesList",(function(){return c})),n.d(t,"FavoritesGetMyFavorites",(function(){return l}));var a=n("b775"),s={FavoritesAdd:"/classcipe/api/favorites/add",FavoritesQueryById:"/classcipe/api/favorites/queryById",FavoritesDelete:"/classcipe/api/favorites/delete",FavoritesDeleteBatch:"/classcipe/api/favorites/deleteBatch",FavoritesList:"/classcipe/api/favorites/list",FavoritesGetMyFavorites:"/classcipe/api/favorites/getMyFavorites"};function r(e){return Object(a["d"])({url:s.FavoritesAdd,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function i(e){return Object(a["d"])({url:s.FavoritesQueryById,method:"get",params:e})}function o(e){return Object(a["d"])({url:s.FavoritesDelete,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function d(e){return Object(a["d"])({url:s.FavoritesDeleteBatch,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function c(e){return Object(a["d"])({url:s.FavoritesList,method:"get",params:e})}function l(e){return Object(a["d"])({url:s.FavoritesGetMyFavorites,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}},"973f":function(e,t,n){},"980a":function(e,t,n){"use strict";n.d(t,"a",(function(){return r})),n.d(t,"c",(function(){return i})),n.d(t,"b",(function(){return o}));var a=n("b775"),s={PDContentAddOrUpdate:"/classcipe/api/v2/pd/addOrUpdate",PDContentQueryById:"/classcipe/api/v2/pd/queryById",PDContentDelete:"/classcipe/api/v2/pd/delete",PDContentDeleteBatch:"/classcipe/api/v2/pd/deleteBatch",PDContentList:"/classcipe/api/v2/pd/list"};function r(e){return Object(a["d"])({url:s.PDContentAddOrUpdate,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function i(e){return Object(a["d"])({url:s.PDContentQueryById,method:"get",params:e})}function o(e){return Object(a["d"])({url:s.PDContentDelete+"?id="+e.id,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}},"9afb":function(e,t,n){"use strict";n.r(t),n.d(t,"teacherAPIUrl",(function(){return l})),n.d(t,"GetAssociate",(function(){return u})),n.d(t,"getMyContent",(function(){return p})),n.d(t,"FindMyContent",(function(){return h})),n.d(t,"GetMyGrades",(function(){return f})),n.d(t,"DeleteMyContentByType",(function(){return m})),n.d(t,"PermanentDeleteMyContent",(function(){return y})),n.d(t,"UpdateContentStatus",(function(){return g})),n.d(t,"Associate",(function(){return T})),n.d(t,"AssociateCancel",(function(){return O})),n.d(t,"SaveSessonTags",(function(){return w})),n.d(t,"AddOrSaveGroupName",(function(){return b})),n.d(t,"DeleteGroup",(function(){return k})),n.d(t,"SaveGroupItems",(function(){return S})),n.d(t,"GetReferOutcomes",(function(){return C})),n.d(t,"Duplicate",(function(){return I})),n.d(t,"Rename",(function(){return j})),n.d(t,"FindSourceOutcomes",(function(){return A})),n.d(t,"FindBigIdeaSourceOutcomes",(function(){return v})),n.d(t,"ContentRestore",(function(){return U})),n.d(t,"FindPurchases",(function(){return D})),n.d(t,"FindInspirationStudents",(function(){return F})),n.d(t,"FindInspirationTeachers",(function(){return L})),n.d(t,"GetAssociateRecommend",(function(){return B}));var a=n("b775"),s=n("3f76"),r=n("de0d"),i=n("b199"),o=n("823b"),d=n("980a"),c=n("093a"),l={Associate:"/classcipe/api/teacher/associate",AssociateCancel:"/classcipe/api/teacher/associateCancel",GetAssociate:"/classcipe/api/teacher/getAssociate",GetMyContent:"/classcipe/api/teacher/getMyContent",FindMyContent:"/classcipe/api/teacher/findMyContent",GetMyGrades:"/classcipe/api/teacher/getMyGrades",UpdateContentStatus:"/classcipe/api/teacher/content/status",saveSessonTags:"/classcipe/api/sessonTags/addBatch",AddOrSaveGroupName:"/classcipe/api/teacher/addOrSaveGroupName",SaveGroupItems:"/classcipe/api/teacher/saveGroupItems",DeleteGroup:"/classcipe/api/teacher/deleteGroup",GetReferOutcomes:"/classcipe/api/teacher/getReferOutcomes",Duplicate:"/classcipe/api/teacher/content/duplicate",PermanentDelete:"/classcipe/api/teacher/content/permanentDelete",Rename:"/classcipe/api/teacher/content/rename",FindSourceOutcomes:"/classcipe/api/teacher/findSourceOutcomes",FindBigIdeaSourceOutcomes:"/classcipe/api/teacher/findBigIdeaSourceOutcomes",ContentRestore:"/classcipe/api/teacher/content/restore",FindPurchases:"/classcipe/api/teacher/findPurchases",FindInspirationStudents:"/classcipe/api/teacher/findInspirationStudents",FindInspirationTeachers:"/classcipe/api/teacher/findInspirationTeachers",GetAssociateRecommend:"/classcipe/api/teacher/getAssociateRecommend"};function u(e){return Object(a["d"])({url:l.GetAssociate,method:"get",params:e})}function p(e){return Object(a["d"])({url:l.GetMyContent,method:"get",params:e})}function h(e){return Object(a["d"])({url:l.FindMyContent,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function f(){return Object(a["d"])({url:l.GetMyGrades,method:"get"})}function m(e){var t=e.type,n=e.id;switch(t){case s["e"]["unit-plan"]:return Object(r["UnitPlanDelete"])({id:n});case s["e"].task:return Object(i["TaskDelete"])({id:n});case s["e"].pd:return Object(d["b"])({id:n});case s["e"].video:return Object(c["b"])({id:n});default:o["error"]("wrong delete type "+t+" id: "+n);break}}function y(e){return Object(a["d"])({url:l.PermanentDelete,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function g(e){return Object(a["d"])({url:l.UpdateContentStatus,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function T(e){return Object(a["d"])({url:l.Associate,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function O(e){return Object(a["d"])({url:l.AssociateCancel,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function w(e){return Object(a["d"])({url:l.saveSessonTags,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function b(e){return Object(a["d"])({url:l.AddOrSaveGroupName,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function k(e){return Object(a["d"])({url:l.DeleteGroup,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function S(e){return Object(a["d"])({url:l.SaveGroupItems,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function C(e){return Object(a["d"])({url:l.GetReferOutcomes,method:"get",params:e})}function I(e){return Object(a["d"])({url:l.Duplicate,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function j(e){return Object(a["d"])({url:l.Rename,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function A(e){return Object(a["d"])({url:l.FindSourceOutcomes,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function v(e){return Object(a["d"])({url:l.FindBigIdeaSourceOutcomes,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function U(e){return Object(a["d"])({url:l.ContentRestore,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function D(e){return Object(a["d"])({url:l.FindPurchases,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function F(e){return Object(a["d"])({url:l.FindInspirationStudents,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function L(e){return Object(a["d"])({url:l.FindInspirationTeachers,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function B(e){return Object(a["d"])({url:l.GetAssociateRecommend,method:"get",params:e})}},ab87:function(e,t,n){e.exports=n.p+"img/loading.4bb514a8.gif"},b199:function(e,t,n){"use strict";n.r(t),n.d(t,"taskAPIUrl",(function(){return s})),n.d(t,"TaskCreateTaskPPT",(function(){return r})),n.d(t,"TaskCreateNewTaskPPT",(function(){return i})),n.d(t,"TaskAddOrUpdate",(function(){return o})),n.d(t,"SplitTask",(function(){return d})),n.d(t,"TaskQueryById",(function(){return c})),n.d(t,"TaskDelete",(function(){return l})),n.d(t,"getTaskBySessionId",(function(){return u})),n.d(t,"UpdateSlideEditing",(function(){return p}));var a=n("b775"),s={createTaskPPT:"/classcipe/api/task/createTaskPPT",createNewTaskPPT:"/classcipe/api/task/createNewTaskPPT",addOrUpdate:"/classcipe/api/task/addOrUpdate",delete:"/classcipe/api/task/delete",deleteBatch:"/classcipe/api/task/deleteBatch",list:"/classcipe/api/task/list",queryById:"/classcipe/api/task/queryById",splitTask:"/classcipe/api/task/spliteTask",getTaskBySessonId:"/classcipe/api/task/getTaskBySessonId",updateSlideEditing:"/classcipe/api/task/updateSlideEditing"};function r(e){return Object(a["d"])({url:s.createTaskPPT,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function i(e){return Object(a["d"])({url:s.createNewTaskPPT,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function o(e){return Object(a["d"])({url:s.addOrUpdate,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function d(e){return Object(a["d"])({url:s.splitTask,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function c(e){return Object(a["d"])({url:s.queryById,method:"get",params:e})}function l(e){return Object(a["d"])({url:s.delete+"?id="+e.id,method:"post",data:e})}function u(e){return Object(a["d"])({url:s.getTaskBySessonId,method:"get",params:e})}function p(e){return Object(a["d"])({url:s.updateSlideEditing,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}},cec3:function(e,t,n){"use strict";n("ec20")},d33b4:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));n("4de4"),n("b0c0");var a=n("823b"),s=n("3f76"),r=n("c1df"),i=n.n(r),o={data:function(){return{type2Name:{1:"Topic",2:"Unit Plan",3:"Material",4:"Task",5:"Lesson",6:"Evaluation"},browserDataType:{bigIdea:"bigIdea",sync:"sync",curriculum:"curriculum",subjectSpecificSkill:"subjectSpecificSkill",centurySkill:"centurySkill",all21Century:"all21Century",assessmentType:"assessmentType",idu:"idu"}}},created:function(){},computed:{getWeek:function(){if(2===this.rangeDate.length){var e="",t=Math.abs(parseInt(this.rangeDate[0].diff(this.rangeDate[1],"days")/7)),n=Math.abs(this.rangeDate[0].diff(this.rangeDate[1],"days"))%7;return t>0&&(e+=t>1?t+" weeks ":t+" week "),n>0&&(e+=n>1?n+" days ":n+" day "),e}return""}},methods:{tagIsExist:function(e,t){return t.filter((function(t){return t.toLowerCase()===e.toLowerCase()})).length>0},tagNameIsExist:function(e,t){return t.filter((function(t){return t.name.toLowerCase()===e.toLowerCase()})).length>0},handleOpenItem:function(e){e.type=this.type,a["info"]("handleEditItem",e),e.type===s["e"]["unit-plan"]?window.open("/teacher/unit-plan-redirect/"+e.id,"_blank"):e.type===s["e"].task?window.open("/teacher/task-redirect/"+e.id,"_blank"):e.type===s["e"].evaluation&&window.open("/teacher/evaluation-redirect/"+e.id,"_blank")},handleLocationItem:function(e){a["info"]("handleEditItem",e),e.type===s["e"]["unit-plan"]?window.location.href="/teacher/unit-plan-redirect/"+e.id:e.type===s["e"].task?window.location.href="/teacher/task-redirect/"+e.id:e.type===s["e"].evaluation&&(window.location.href="/teacher/evaluation-redirect/"+e.id)},getWeekByDate:function(e,t){if(this.$logger.info("getWeekByDate",e,t),e&&t){var n="",a=i()(t).diff(i()(e),"days");this.$logger.info("diffDays",a);var s=Math.floor(Math.abs(a/7)),r=Math.ceil(Math.abs(a%7));return s>0&&(n+=s>1?s+" weeks ":s+" week "),r>0&&(n+=r>1?r+" days ":r+" day "),this.$logger.info("getWeekByDate str",n),n}return""}}}},db6a:function(e,t,n){"use strict";n.r(t),n.d(t,"knowledgeAPIUrl",(function(){return s})),n.d(t,"KnowledgeGetTree",(function(){return r})),n.d(t,"KnowledgeAddOrUpdateTag",(function(){return i})),n.d(t,"KnowledgeAddOrUpdate",(function(){return o})),n.d(t,"KnowledgeQueryById",(function(){return d})),n.d(t,"KnowledgeQueryTagsByKnowledgeId",(function(){return c})),n.d(t,"KnowledgeDelete",(function(){return l})),n.d(t,"KnowledgeDeleteBatch",(function(){return u})),n.d(t,"KnowledgeList",(function(){return p})),n.d(t,"KnowledgeSearch",(function(){return h})),n.d(t,"KnowledgeQueryContentByDescriptionId",(function(){return f})),n.d(t,"GetAssessmentTypeList",(function(){return m})),n.d(t,"QueryContentByAssessmentTypeId",(function(){return y})),n.d(t,"QueryKnowledgesByAssessmentTypeId",(function(){return g})),n.d(t,"Get21Century",(function(){return T})),n.d(t,"getAll21Century",(function(){return O})),n.d(t,"GetIBIduList",(function(){return w})),n.d(t,"SearchKnowledge",(function(){return b})),n.d(t,"FindRecommendByKnowledgeId",(function(){return k}));var a=n("b775"),s={KnowledgeGetTree:"/classcipe/api/knowledge/getTree",KnowledgeAddOrUpdate:"/classcipe/api/knowledge/addOrUpdate",KnowledgeAddOrUpdateTag:"/classcipe/api/knowledge/addOrUpdateTag",KnowledgeQueryById:"/classcipe/api/knowledge/queryById",KnowledgeQueryTagsByKnowledgeId:"/classcipe/api/knowledge/queryTagsByKnowledgeId",FindRecommendByKnowledgeId:"/classcipe/api/knowledge/findRecommendByKnowledgeId",KnowledgeDelete:"/classcipe/api/knowledge/delete",KnowledgeDeleteBatch:"/classcipe/api/knowledge/deleteBatch",KnowledgeList:"/classcipe/api/knowledge/list",KnowledgeSearch:"/classcipe/api/knowledge/search",KnowledgeQueryContentByDescriptionId:"/classcipe/api/knowledge/queryContentByDescriptionId",GetAssessmentTypeList:"/classcipe/api/knowledgeAssessmentType/getAssessmentTypeList",QueryContentByAssessmentTypeId:"/classcipe/api/knowledgeAssessmentType/queryContentByAssessmentTypeId",QueryKnowledgesByAssessmentTypeId:"/classcipe/api/knowledgeAssessmentType/queryKnowledgesByAssessmentTypeId",Get21Century:"/classcipe/api/knowledge/get21Century",getAll21Century:"/classcipe/api/knowledge/getAll21Century",GetIBIduList:"/classcipe/api/knowledge/getIBIduList",SearchKnowledge:"/classcipe/api/knowledge/searchKnowledge"};function r(e){return Object(a["d"])({url:s.KnowledgeGetTree,method:"get",params:e})}function i(e){return Object(a["d"])({url:s.KnowledgeAddOrUpdateTag,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function o(e){return Object(a["d"])({url:s.KnowledgeAddOrUpdate,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function d(e){return Object(a["d"])({url:s.KnowledgeQueryById,method:"get",params:e})}function c(e){return Object(a["d"])({url:s.KnowledgeQueryTagsByKnowledgeId,method:"get",params:e})}function l(e){return Object(a["d"])({url:s.KnowledgeDelete,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function u(e){return Object(a["d"])({url:s.KnowledgeDeleteBatch,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function p(e){return Object(a["d"])({url:s.KnowledgeList,method:"get",params:e})}function h(e){return Object(a["d"])({url:s.KnowledgeSearch,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function f(e){return Object(a["d"])({url:s.KnowledgeQueryContentByDescriptionId,method:"get",params:e})}function m(e){return Object(a["d"])({url:s.GetAssessmentTypeList,method:"get",params:e})}function y(e){return Object(a["d"])({url:s.QueryContentByAssessmentTypeId,method:"get",params:e})}function g(e){return Object(a["d"])({url:s.QueryKnowledgesByAssessmentTypeId,method:"get",params:e})}function T(e){return Object(a["d"])({url:s.Get21Century,method:"get",params:e})}function O(e){return Object(a["d"])({url:s.getAll21Century,method:"get",params:e})}function w(e){return Object(a["d"])({url:s.GetIBIduList,method:"get",params:e})}function b(e){return Object(a["d"])({url:s.SearchKnowledge,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function k(e){return Object(a["d"])({url:s.FindRecommendByKnowledgeId,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}},de0d:function(e,t,n){"use strict";n.r(t),n.d(t,"unitPlanAPIUrl",(function(){return s})),n.d(t,"UnitPlanAddOrUpdate",(function(){return r})),n.d(t,"UnitPlanQueryById",(function(){return i})),n.d(t,"UnitPlanDelete",(function(){return o})),n.d(t,"UnitPlanDeleteBatch",(function(){return d})),n.d(t,"UnitPlanList",(function(){return c})),n.d(t,"ChangeStatus",(function(){return l}));var a=n("b775"),s={UnitPlanAddOrUpdate:"/classcipe/api/unitPlan/addOrUpdate",UnitPlanQueryById:"/classcipe/api/unitPlan/queryById",UnitPlanDelete:"/classcipe/api/unitPlan/delete",UnitPlanDeleteBatch:"/classcipe/api/unitPlan/deleteBatch",UnitPlanList:"/classcipe/api/unitPlan/list",ChangeStatus:"/classcipe/api/unitPlan/status"};function r(e){return Object(a["d"])({url:s.UnitPlanAddOrUpdate,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function i(e){return Object(a["d"])({url:s.UnitPlanQueryById,method:"get",params:e})}function o(e){return Object(a["d"])({url:s.UnitPlanDelete,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function d(e){return Object(a["d"])({url:s.UnitPlanDeleteBatch,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function c(e){return Object(a["d"])({url:s.UnitPlanList,method:"get",params:e})}function l(e){return Object(a["d"])({url:s.ChangeStatus,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}},ec20:function(e,t,n){},eeb2:function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"task-library"},[e.taskLoading?[e._m(0)]:e._e(),e.taskLoading?e._e():[n("new-browser",{ref:"newBrowser",attrs:{"question-index":"_questionIndex_1","show-curriculum":!0,"show-menu":[e.NavigationType.specificSkills,e.NavigationType.centurySkills,e.NavigationType.learningOutcomes,e.NavigationType.assessmentType,e.NavigationType.idu],"default-active-menu":e.NavigationType.learningOutcomes,"recommend-data":e.recommendData,"selected-list":e.selectedList,"selected-id":e.selectedIdList,"display-mode":"iframe"},on:{"select-assessmentType":e.handleSelectAssessmentType,"select-sync":e.handleSelectListData,"select-curriculum":e.handleSelectCurriculum,"select-subject-specific-skill":e.handleSelectSubjectSpecificSkillListData,"select-century-skill":e.handleSelect21CenturySkillListData,"select-idu":e.handleSelectIdu,"select-recommend":e.handleSelectRecommend,"cancel-select":e.handleCancelSelectData,"ensure-select":e.handleEnsureSelectData}})]],2)},s=[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"loading-task"},[a("img",{attrs:{src:n("ab87")}})])}],r=n("1da1"),i=(n("96cf"),n("d3b7"),n("159b"),n("4de4"),n("c740"),n("b0c0"),n("99af"),n("ab44")),o=n("823b"),d=n("b199"),c=n("3264"),l=n("489c"),u={name:"TaskLibrary",components:{NewBrowser:c["a"]},props:{taskId:{type:String,required:!0}},data:function(){return{taskLoading:!0,recommendData:[],recommendDataIdList:[],selectedList:[],selectedIdList:[],oldFormData:null,form:{id:null,image:"",copyFromSlide:null,presentationId:"",pageObjectIds:"",name:"Untitled Task",overview:"",tasks:[],status:0,taskType:"",createTime:"",createBy:"",updateTime:"",customTags:[],subjectIds:[],gradeIds:[],bloomCategories:"",learnOuts:[],selfOuts:[],showSelect:!1,startDate:"",endDate:"",gradeId:void 0,materialList:[],taskClassList:[],customFieldData:null},selectedSyncList:[],selectedCurriculumList:[],selectedSpecificSkillList:[],selectedCenturySkillList:[],selectedAssessmentList:[],selectModel:l["a"],selectedIduList:[],selectedRecommendList:[],NavigationType:i["a"]}},mounted:function(){window.parent&&window.parent.postMessage(JSON.stringify({from:"addon",event:"task-library-loaded",data:null}),"*")},created:function(){this.loadTaskData(this.taskId)},methods:{loadTaskData:function(e){var t=this;o["info"]("loadTaskData "+e),Object(d["TaskQueryById"])({id:e}).then((function(n){o["info"]("TaskQueryById "+e,n.result);var a=n.result;a.materialList||(a.materialList=[]),t.form=a,t.oldFormData=JSON.stringify(t.form),t.selectedList=JSON.parse(JSON.stringify(t.form.learnOuts)),t.form.learnOuts.forEach((function(e){e.knowledgeId?t.selectedIdList.push(e.knowledgeId):t.$logger.info("parentData selected id not exist ",e)}))})).finally((function(){t.taskLoading=!1}))},handleSelectAssessmentType:function(e){this.$logger.info("handleSelectAssessmentType",e),this.selectedAssessmentList=e},handleSelectListData:function(e){this.$logger.info("handleSelectListData",e),this.selectedSyncList=e},handleSelectCurriculum:function(e){this.$logger.info("handleSelectCurriculum",e),this.selectedCurriculumList=e},handleSelectSubjectSpecificSkillListData:function(e){this.selectedSpecificSkillList=e,this.$logger.info("handleSelectSubjectSpecificSkillListData",e)},handleSelect21CenturySkillListData:function(e){this.$logger.info("handleSelect21CenturySkillListData",e),this.selectedCenturySkillList=e},handleSelectIdu:function(e){this.$logger.info("handleSelectIdu",e),this.selectedIduList=e},handleSelectRecommend:function(e){this.$logger.info("handleSelectRecommend",e),this.selectedRecommendList=e},handleCancelSelectData:function(){this.selectedSyncList=[],this.selectedCurriculumList=[],this.selectedSpecificSkillList=[],this.selectedCenturySkillList=[],this.selectedAssessmentList=[],this.selectedIduList=[],this.selectedRecommendList=[],this.selectSyncDataVisible=!1,window.parent&&window.parent.postMessage(JSON.stringify({from:"addon",event:"close",data:null}),"*")},handleEnsureSelectData:function(){var e=this;this.$logger.info("handleEnsureSelectData",this.selectedCurriculumList,this.selectedSpecificSkillList,this.selectedCenturySkillList,this.selectedAssessmentList,this.selectedIduList,this.selectedRecommendList,this.selectedSyncList),this.$logger.info("mySelectedList",this.$refs.newBrowser.mySelectedList),this.$logger.info("learnOuts",this.form.learnOuts);var t=this.$refs.newBrowser.mySelectedList.filter((function(e){return!e.hasOwnProperty("isSelfCustom")||e.hasOwnProperty("isSelfCustom")&&!e.isSelfCustom}));this.$logger.info("filterLearnOuts",t),this.form.learnOuts=JSON.parse(JSON.stringify(t)),this.$refs.newBrowser.selectedRecommendList.forEach((function(t){if(t.hasOwnProperty("isSelfCustom")&&t.isSelfCustom){var n=JSON.parse(JSON.stringify(t));n.key=Math.random()+"",e.form.selfOuts.push(n)}else{var a=e.form.learnOuts.findIndex((function(e){return e.knowledgeId===t.knowledgeId}));-1===a&&e.form.learnOuts.push(t)}})),this.selectedSyncList.forEach((function(t){var n=e.form.learnOuts.filter((function(e){return e.knowledgeId===t.knowledgeId}));n.length>0||e.form.learnOuts.push({knowledgeId:t.knowledgeId,name:t.name,tags:t.tags,tagType:t.tagType,path:t.path})})),this.selectedRecommendList.forEach((function(t){if(!t.hasOwnProperty("isSelfCustom")||!t.isSelfCustom){var n=e.form.learnOuts.filter((function(e){return e.knowledgeId===t.knowledgeId}));if(n.length>0)return;e.form.learnOuts.push({knowledgeId:t.knowledgeId,name:t.name,tags:t.tags,tagType:t.tagType,path:t.path})}})),this.selectedIduList.forEach((function(t){var n=e.form.learnOuts.filter((function(e){return e.knowledgeId===t.id}));n.length>0||e.form.learnOuts.push({knowledgeId:t.knowledgeData.id,name:t.knowledgeData.name,tagType:t.knowledgeData.tagType,gradeId:t.knowledgeData.selectedGradeId,path:t.knowledgeData.path,tags:t.tags})}));var n=this.selectedCurriculumList.concat(this.selectedSpecificSkillList).concat(this.selectedCenturySkillList).concat(this.selectedAssessmentList);n.forEach((function(t){var n=e.form.learnOuts.filter((function(e){return e.knowledgeId===t.knowledgeId}));n.length>0||e.form.learnOuts.push({knowledgeId:t.knowledgeData.id,name:t.knowledgeData.name,gradeId:t.knowledgeData.selectedGradeId,tagType:t.knowledgeData.tagType,path:t.knowledgeData.path})})),this.$logger.info("this.form.learnOuts",this.form.learnOuts),this.selectSyncDataVisible=!1,this.autoSave()},autoSave:function(){var e=this;return Object(r["a"])(regeneratorRuntime.mark((function t(){var n,a,s;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return n=Object.assign({},e.form),n.customFieldData&&(n.customFieldData=JSON.stringify(n.customFieldData)),o["info"]("basic taskData",n),t.next=5,Object(d["TaskAddOrUpdate"])(n);case 5:a=t.sent,o["info"]("TaskAddOrUpdate",a.result),a.success?e.$message.success("add successfully"):e.$message.error(a.message),window.parent&&(s=JSON.stringify(e.form),window.parent.postMessage(JSON.stringify({from:"addon",event:"close",data:s===e.oldFormData?null:s}),"*"));case 9:case"end":return t.stop()}}),t)})))()}}},p=u,h=(n("cec3"),n("0c7c")),f=Object(h["a"])(p,a,s,!1,null,"0bae8323",null);t["default"]=f.exports}}]);