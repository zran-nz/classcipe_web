(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1ed2196f"],{"980a":function(e,t,n){"use strict";n.d(t,"a",(function(){return i})),n.d(t,"c",(function(){return c})),n.d(t,"b",(function(){return a}));var d=n("b775"),r={PDContentAddOrUpdate:"/classcipe/api/v2/pd/addOrUpdate",PDContentQueryById:"/classcipe/api/v2/pd/queryById",PDContentDelete:"/classcipe/api/v2/pd/delete",PDContentDeleteBatch:"/classcipe/api/v2/pd/deleteBatch",PDContentList:"/classcipe/api/v2/pd/list"};function i(e){return Object(d["d"])({url:r.PDContentAddOrUpdate,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function c(e){return Object(d["d"])({url:r.PDContentQueryById,method:"get",params:e})}function a(e){return Object(d["d"])({url:r.PDContentDelete+"?id="+e.id,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}},ab3a8:function(e,t,n){"use strict";n.r(t);var d=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("a-card",{attrs:{bordered:!1,bodyStyle:{padding:"16px 24px",height:"100%",minHeight:"500px"}}},[n("a-spin",{staticClass:"redirect-spin",attrs:{tip:"Loading...",size:"large"}})],1)},r=[],i=n("5530"),c=(n("ac1f"),n("5319"),n("980a")),a=n("9574"),o=n("2f62"),s={name:"PDContentRedirect",props:{pdId:{type:String,default:null}},data:function(){return{visible:!1,curriculumId:null,list:[],radioStyle:{display:"block",height:"30px",lineHeight:"30px"}}},computed:Object(i["a"])({},Object(o["e"])({currentSchool:function(e){return e.user.currentSchool}})),created:function(){this.$logger.info("pd redirecting "+this.pdId),a["b"].$on(a["a"].GOOGLE_AUTH_REFRESH,this.handlePdRedirect),this.handlePdRedirect()},beforeDestroy:function(){a["b"].$off(a["a"].GOOGLE_AUTH_REFRESH,this.handlePdRedirect)},methods:{handlePdRedirect:function(){this.$logger.info("task redirecting "+this.pdId),this.pdId?this.$router.replace("/teacher/pd-content/"+this.pdId):this.select()},select:function(){var e=this,t={name:"Unnamed PD Content",status:0};Object(c["a"])(t).then((function(t){e.$logger.info("PDContentAddOrUpdate response",t.result),t.success?520!==t.code&&403!==t.code?e.$router.replace("/teacher/pd-content/"+t.result.id):e.$logger.info("等待授权回调"):e.$message.error(t.message)}))}}},p=s,u=(n("f39c"),n("0c7c")),l=Object(u["a"])(p,d,r,!1,null,"e2d7bf6e",null);t["default"]=l.exports},d250:function(e,t,n){},f39c:function(e,t,n){"use strict";n("d250")}}]);