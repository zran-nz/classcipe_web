(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["invite"],{"4e8a":function(e,t,n){"use strict";n.d(t,"j",(function(){return a})),n.d(t,"f",(function(){return r})),n.d(t,"e",(function(){return o})),n.d(t,"a",(function(){return s})),n.d(t,"b",(function(){return i})),n.d(t,"d",(function(){return u})),n.d(t,"c",(function(){return d})),n.d(t,"k",(function(){return l})),n.d(t,"g",(function(){return p})),n.d(t,"m",(function(){return h})),n.d(t,"i",(function(){return m})),n.d(t,"h",(function(){return f})),n.d(t,"l",(function(){return v}));var c=n("b775"),a={getSchoolRoleList:"/classcipe/api/school/role/getRoles",getSchoolClassList:"/classcipe/api/school/class/list",addStaff:"/classcipe/api/school/user/addStaff",addStudent:"/classcipe/api/school/user/addStudents",getOrCreateInvite:"/classcipe/api/school/user/getOrCreateInvite",checkInvite:"/classcipe/api/school/user/checkInvite",acceptInvite:"/classcipe/api/school/user/acceptInvite",updateInvite:"/classcipe/api/school/user/updateInvite",getSchoolUsers:"/classcipe/api/school/user/getSchoolUsers",queryUser:"/classcipe/api/school/user/queryUser",updateUserStatus:"/classcipe/api/school/user/updateUserStatus",importStaff:"/classcipe/api/school/user/importStaffByExcel",importStudent:"/classcipe/api/school/user/importStudentByExcel",exportInvalidStaff:"/classcipe/api/school/user/exportInvalidStaff",exportInvalidStudent:"/classcipe/api/school/user/exportInvalidStudent",removeSchoolUser:"/classcipe/api/school/user/removeSchoolUser",getUserInfo:"/classcipe/api/school/user/getUserInfo",updateProfile:"/classcipe/api/school/user/updateProfile"};function r(e){return Object(c["d"])({url:a.getSchoolRoleList,method:"get",params:e})}function o(e){return Object(c["d"])({url:a.getSchoolClassList,method:"get",params:e})}function s(e){return Object(c["d"])({url:a.addStaff,method:"post",params:e})}function i(e){return Object(c["d"])({url:a.addStudent,method:"post",params:e})}function u(e){return Object(c["d"])({url:a.getOrCreateInvite,method:"post",params:e})}function d(e){return Object(c["d"])({url:a.checkInvite,method:"get",params:e})}function l(e){return Object(c["d"])({url:a.updateInvite,method:"post",params:e})}function p(e){return Object(c["d"])({url:a.getSchoolUsers,method:"get",params:e})}function h(e){return Object(c["d"])({url:a.updateUserStatus,method:"post",params:e})}function m(e){return Object(c["d"])({url:a.removeSchoolUser,method:"post",params:e})}function f(e){return Object(c["d"])({url:a.getUserInfo,method:"get",params:e})}function v(e){return Object(c["d"])({url:a.updateProfile,method:"post",data:e})}},"9cb2":function(e,t,n){"use strict";n.r(t);var c=function(){var e=this,t=e.$createElement,c=e._self._c||t;return c("div",{staticClass:"main-content"},[c("a-spin",{attrs:{spinning:e.checkLoading}},[e.invalid||e.checkLoading?e._e():c("div",[c("div",{staticClass:"title"},[e._v(" "+e._s(e.labelTxt)+" ")]),e.alreayApply?c("a-button",{attrs:{type:"primary",block:"",loading:e.loading,size:"large"},on:{click:e.goHome}},[e._v("Go Home")]):c("a-button",{attrs:{type:"primary",block:"",loading:e.loading,size:"large"},on:{click:e.handleBtn}},[e._v(e._s(e.btnText))])],1),e.invalid?c("div",{staticClass:"title"},[c("img",{staticClass:"no-result",attrs:{src:n("ffed"),alt:""}})]):e._e()])],1)},a=[],r=n("1da1"),o=n("5530"),s=(n("96cf"),n("d3b7"),n("3ca3"),n("ddb0"),n("2b3d"),n("ac1f"),n("841c"),n("4e8a")),i=n("ec09"),u=n("c24f"),d=n("9fb0"),l=n("f93e"),p=n("2f62"),h=n("4360"),m={name:"Invite",components:{},data:function(){return{inviteCode:"",schoolName:"",schoolId:"",loading:!1,checkLoading:!1,btnText:"",invalid:!1,isAdmin:!1,isTeacher:!1,alreayApply:!1,isInSchool:!1,labelTxt:"",roleMap:{2:"teacher",4:"student"}}},created:function(){var e=new URLSearchParams(window.location.search),t=e.get("inviteCode");this.inviteCode=t,this.checkInviteCode()},computed:Object(o["a"])({},Object(p["e"])({info:function(e){return e.user.info},currentSchool:function(e){return e.user.currentSchool},userMode:function(e){return e.app.userMode}})),methods:Object(o["a"])(Object(o["a"])(Object(o["a"])({},Object(p["d"])([d["M"],"SET_CURRENT_SCHOOL"])),Object(p["b"])(["GetClassList"])),{},{checkInviteCode:function(){var e=this;return Object(r["a"])(regeneratorRuntime.mark((function t(){var n,c,a,r,o,i,u,d,l,p,m;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.checkLoading=!0,t.next=3,Object(s["c"])({inviteCode:e.inviteCode});case 3:n=t.sent,n.success&&(null!==n&&void 0!==n&&null!==(c=n.result)&&void 0!==c&&c.valid?e.roleMap[null===n||void 0===n||null===(a=n.result)||void 0===a?void 0:a.role]!==h["a"].getters.currentRole?e.invalid=!0:(e.isAdmin=null===n||void 0===n||null===(r=n.result)||void 0===r?void 0:r.isSchoolAdmin,e.schoolId=null===n||void 0===n||null===(o=n.result)||void 0===o?void 0:o.schoolId,e.schoolName=null===n||void 0===n||null===(i=n.result)||void 0===i?void 0:i.schoolName,e.isTeacher=2===(null===n||void 0===n||null===(u=n.result)||void 0===u?void 0:u.role),e.isInSchool=null===n||void 0===n||null===(d=n.result)||void 0===d?void 0:d.isSchoolUser,m=null===n||void 0===n||null===(l=n.result)||void 0===l?void 0:l.schoolUserStatus,e.btnText=null!==n&&void 0!==n&&null!==(p=n.result)&&void 0!==p&&p.approveFlag?"Apply":"Join",e.labelTxt="You have been invited to join ".concat(e.schoolName," community"),e.isInSchool&&(e.isAdmin||1===m?e.doRedirect():(e.alreayApply=!0,e.labelTxt="Application received, please wait for admin to approve."))):e.invalid=!0),e.checkLoading=!1;case 6:case"end":return t.stop()}}),t)})))()},handleBtn:function(){var e=this;return Object(r["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.loading=!0,t.next=3,Object(i["a"])({inviteCode:e.inviteCode,email:h["a"].getters.userInfo.email});case 3:n=t.sent,n.success&&0===n.code?(e.$message.success(n.message),e.$store.dispatch("GetInfo").then((function(){"Join"===e.btnText?e.doRedirect():e.isTeacher&&(e.alreayApply=!0,e.labelTxt="Application received, please wait for admin to approve.")}))):e.$message.error(n.message),e.loading=!1;case 6:case"end":return t.stop()}}),t)})))()},goHome:function(){this.$router.push(this.$store.getters.defaultRouter)},doRedirect:function(){var e=this;this.$store.dispatch("GetInfo").then((function(){Object(u["c"])({isPersonal:!1,schoolId:e.schoolId}).then((function(t){e[d["M"]](l["X"].SCHOOL),e.GetClassList(e.currentSchool.id),e.$store.dispatch("GetInfo").then((function(){e.isAdmin?e.$router.push("/manage/school-info"):e.$router.push("/account/info")}))}))}))}})},f=m,v=(n("f818"),n("0c7c")),b=Object(v["a"])(f,c,a,!1,null,"0c11585a",null);t["default"]=b.exports},e27f:function(e,t,n){},ec09:function(e,t,n){"use strict";n.d(t,"m",(function(){return s})),n.d(t,"c",(function(){return i})),n.d(t,"d",(function(){return u})),n.d(t,"s",(function(){return d})),n.d(t,"t",(function(){return l})),n.d(t,"l",(function(){return p})),n.d(t,"x",(function(){return h})),n.d(t,"z",(function(){return m})),n.d(t,"h",(function(){return f})),n.d(t,"g",(function(){return v})),n.d(t,"a",(function(){return b})),n.d(t,"e",(function(){return g})),n.d(t,"f",(function(){return j})),n.d(t,"n",(function(){return S})),n.d(t,"p",(function(){return O})),n.d(t,"i",(function(){return T})),n.d(t,"j",(function(){return I})),n.d(t,"k",(function(){return C})),n.d(t,"u",(function(){return U})),n.d(t,"q",(function(){return k})),n.d(t,"y",(function(){return y})),n.d(t,"w",(function(){return A})),n.d(t,"r",(function(){return w})),n.d(t,"v",(function(){return P})),n.d(t,"b",(function(){return x})),n.d(t,"o",(function(){return E}));var c=n("b775"),a=n("ca00"),r="api2/school/user",o={getSchoolUsers:"/classcipe/".concat(r,"/getSchoolUsers"),addStudents:"/classcipe/".concat(r,"/addStudents"),addTeacher:"/classcipe/".concat(r,"/addTeacher"),removeStudents:"/classcipe/".concat(r,"/removeStudents"),removeTeachers:"/classcipe/".concat(r,"/removeTeachers"),updateTeacher:"/classcipe/".concat(r,"/updateTeacher"),getInvite:"/classcipe/".concat(r,"/getInvite"),updateInvite:"/classcipe/".concat(r,"/updateInvite"),bulkActTeacher:"/classcipe/".concat(r,"/teacher/bulkAct"),bulkActStudent:"/classcipe/".concat(r,"/student/bulkAct"),acceptInvite:"/classcipe/".concat(r,"/acceptInvite"),batchAddStudent:"/classcipe/".concat(r,"/batchAddStudent"),batchAddTeacher:"/classcipe/".concat(r,"/batchAddTeacher"),getStudentInfo:"/classcipe/".concat(r,"/getStudentInfo"),getTeacherInfo:"/classcipe/".concat(r,"/getTeacherInfo"),checkEmailParent:"/classcipe/".concat(r,"/parent/checkEmail"),resetPassword:"/classcipe/".concat(r,"/resetPassword"),checkEmailStudent:"/classcipe/".concat(r,"/student/checkEmail"),moveClassStudent:"/classcipe/".concat(r,"/student/moveClass"),sendParentEmail:"/classcipe/".concat(r,"/student/sendParentEmail"),checkEmailTeacher:"/classcipe/".concat(r,"/teacher/checkEmail"),updateStudent:"/classcipe/".concat(r,"/updateStudent"),addAdmin:"/classcipe/".concat(r,"/addAdmin"),removeAdmins:"/classcipe/".concat(r,"/removeAdmins"),resetUserPassword:"/classcipe/".concat(r,"/user/resetPassword"),addSchoolAdmin:"/classcipe/".concat(r,"/addSchoolAdmin"),getTeacherCount:"/classcipe/".concat(r,"/getTeacherCount")};function s(e){return Object(c["d"])({url:o.getSchoolUsers,method:"get",params:e})}function i(e){return e=Object(a["trimParams"])(e),Object(c["d"])({url:o.addStudents,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function u(e){return e=Object(a["trimParams"])(e),Object(c["d"])({url:o.addTeacher,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function d(e){return Object(c["d"])({url:o.removeStudents,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function l(e){return Object(c["d"])({url:o.removeTeachers,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function p(e){return Object(c["d"])({url:o.getInvite,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function h(e){return e=Object(a["trimParams"])(e),Object(c["d"])({url:o.updateInvite,method:"post",data:e,params:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function m(e){return e=Object(a["trimParams"])(e),Object(c["d"])({url:o.updateTeacher,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function f(e){return Object(c["d"])({url:o.bulkActTeacher,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function v(e){return Object(c["d"])({url:o.bulkActStudent,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function b(e){return Object(c["d"])({url:o.acceptInvite,method:"post",data:e,params:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function g(e){return e=Object(a["trimParams"])(e),Object(c["d"])({url:o.batchAddStudent,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function j(e){return e=Object(a["trimParams"])(e),Object(c["d"])({url:o.batchAddTeacher,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function S(e){return Object(c["d"])({url:o.getStudentInfo,method:"get",params:e})}function O(e){return Object(c["d"])({url:o.getTeacherInfo,method:"get",params:e})}function T(e){return Object(c["d"])({url:o.checkEmailParent,method:"get",params:e})}function I(e){return Object(c["d"])({url:o.checkEmailStudent,method:"get",params:e})}function C(e){return Object(c["d"])({url:o.checkEmailTeacher,method:"get",params:e})}function U(e){return Object(c["d"])({url:o.resetPassword,method:"get",params:e})}function k(e){return Object(c["d"])({url:o.moveClassStudent,method:"get",params:e})}function y(e){return e=Object(a["trimParams"])(e),Object(c["d"])({url:o.updateStudent,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function A(e){return Object(c["d"])({url:o.sendParentEmail,method:"get",params:e})}function w(e){return Object(c["d"])({url:o.removeAdmins,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function P(e){return Object(c["d"])({url:o.resetUserPassword,method:"get",params:e})}function x(e){return e=Object(a["trimParams"])(e),Object(c["d"])({url:o.addSchoolAdmin,method:"post",data:e,params:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function E(e){return Object(c["d"])({url:o.getTeacherCount,method:"get",params:e})}},f818:function(e,t,n){"use strict";n("e27f")},ffed:function(e,t,n){e.exports=n.p+"img/invalidLink.419e7942.png"}}]);