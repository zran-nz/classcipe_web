(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-327e3c5a"],{"0ed8":function(e,t,a){},1354:function(e,t,a){"use strict";a.r(t);var n=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"my-full-form-wrapper",attrs:{id:"formRoot"}},[n("fixed-form-header",{scopedSlots:e._u([{key:"header",fn:function(){return[n("form-header",{attrs:{title:"School Teacher","show-share":!1,"show-collaborate":!1,"is-preview-mode":!0},on:{back:e.goBack},scopedSlots:e._u([{key:"back",fn:function(){return[n("img",{staticClass:"single-logo-img",attrs:{src:a("be50"),alt:"classcipe"},on:{click:function(t){return t.stopPropagation(),e.$router.push("/")}}})]},proxy:!0},{key:"left",fn:function(){return[n("a-space",{attrs:{size:5,align:"center"},on:{click:function(e){e.stopPropagation()}}},[n("label",{staticStyle:{cursor:"pointer"},on:{click:function(t){return e.$router.push("/account/info")}}},[e._v("Account Info")]),n("label",{attrs:{for:""}},[e._v(">")]),e.onlyClass?[n("label",{staticStyle:{cursor:"pointer"},on:{click:e.routerRefresh}},[e._v("School Teacher")]),n("label",{attrs:{for:""}},[e._v(">")]),n("label",{staticStyle:{"font-weight":"normal"}},[e._v(e._s(e.onlyClass.name))])]:n("label",{staticStyle:{"font-weight":"normal"}},[e._v("School Teacher")])],2)]},proxy:!0},{key:"right",fn:function(){},proxy:!0}])})]},proxy:!0}])}),n("div",{staticClass:"form-content"},[n("div",{staticClass:"status-tab"},[n("div",{staticClass:"tab-list"},[n("div",{class:{"tab-item":!0,active:""===e.queryParam.schoolUserStatus},on:{click:function(t){return e.toggleTab("")}}},[e._v("All")]),e._l(e.tabsList,(function(t,a){return[n("a-badge",{key:"types"+a,class:{"tab-item":!0,active:e.queryParam.schoolUserStatus===t.value},attrs:{count:e.getBadge(t.value)}},[n("div",{on:{click:function(a){return e.toggleTab(t.value)}}},[e._v(" "+e._s(t.label)+" ")])])]}))],2),n("div",{staticClass:"opt-list"},[n("custom-text-button",{attrs:{label:"Invite"},on:{click:e.handleInvite}})],1)]),n("div",{staticClass:"filter-tab"},[n("div",{staticClass:"filter-search"},[n("a-input-search",{attrs:{"allow-clear":!0,placeholder:"Search"},on:{search:e.searchQuery},model:{value:e.queryParam.searchKey,callback:function(t){e.$set(e.queryParam,"searchKey",t)},expression:"queryParam.searchKey"}})],1),n("a-space",{staticClass:"filter-opt"},[""!==e.queryParam.schoolUserStatus?n("a-dropdown",{attrs:{disabled:0===e.selectedRowKeys.length}},[n("a-menu",{attrs:{slot:"overlay"},on:{click:e.handleBatchOpt},slot:"overlay"},[e.queryParam.schoolUserStatus===e.SCHOOL_USER_STATUS.INACTIVE.value?n("a-menu-item",{key:"ACT_"+e.ACT.RESEND.value},[e._v(" Resend ")]):e._e(),e.queryParam.schoolUserStatus===e.SCHOOL_USER_STATUS.ACTIVE.value?n("a-menu-item",{key:"ACT_"+e.ACT.RESET.value},[e._v(" Reset password ")]):e._e(),e.queryParam.schoolUserStatus===e.SCHOOL_USER_STATUS.PENDING.value?n("a-menu-item",{key:"ACT_"+e.ACT.APPROVE.value},[e._v(" Approve ")]):e._e(),e.queryParam.schoolUserStatus===e.SCHOOL_USER_STATUS.PENDING.value?n("a-menu-item",{key:"ACT_"+e.ACT.REJECT.value},[e._v(" Reject ")]):e._e(),e.queryParam.schoolUserStatus===e.SCHOOL_USER_STATUS.ARCHIVE.value?n("a-menu-item",{key:"ACT_"+e.ACT.RESTORE.value},[e._v(" Restore ")]):e._e(),e.queryParam.schoolUserStatus===e.SCHOOL_USER_STATUS.ACTIVE.value||e.queryParam.schoolUserStatus===e.SCHOOL_USER_STATUS.INACTIVE.value?n("a-menu-item",{key:"ACT_"+e.ACT.ARCHIVE.value},[e._v(" Archive ")]):e._e(),e.queryParam.schoolUserStatus===e.SCHOOL_USER_STATUS.ARCHIVE.value?n("a-menu-item",{key:"ACT_"+e.ACT.DELETE.value},[e._v(" Delete ")]):e._e()],1),n("a-button",{staticStyle:{"margin-left":"8px"}},[e._v(" Bulk manage "),n("a-icon",{attrs:{type:"down"}})],1)],1):e._e(),n("a-button",{attrs:{type:"primary"},on:{click:e.handleAdd}},[e._v("Add")]),n("a-button",{attrs:{type:"black"},on:{click:e.handleUpload}},[e._v("Bulk Upload")])],1)],1),n("div",{staticClass:"form-tab"},[n("a-table",{ref:"tableCon",attrs:{rowKey:"uid",columns:e.columns,dataSource:e.dataSource,pagination:e.ipagination,loading:e.loading,rowSelection:{selectedRowKeys:e.selectedRowKeys,onChange:e.onSelectChange}},on:{change:e.handleTableChange},scopedSlots:e._u([{key:"name",fn:function(t,s){return n("div",{staticClass:"user-info"},[n("div",{staticClass:"user-avatar"},[s.avatar?n("img",{attrs:{src:s.avatar,alt:""}}):n("img",{attrs:{src:a("4992"),alt:""}})]),n("div",{staticClass:"user-detail"},[n("label",{attrs:{for:""}},[e._v(e._s(s.firstname)+" "+e._s(s.lastname))]),n("label",{attrs:{for:""}},[e._v(e._s(s.email)),e.isSelfEmail(s.email)?n("span",[e._v(" (Me)")]):e._e()])])])}},{key:"classes",fn:function(t){return n("div",{staticClass:"flex-wrap"},[e._l(e.sortBy(t,"classType"),(function(t,a){return[a<1&&0===t.classType?n("a-tag",{key:t.id,staticClass:"ellispe-tag",attrs:{color:"#2db7f5"}},[e._v(" "+e._s(t.name)+" ")]):e._e(),a<1&&1===t.classType?n("a-tooltip",{key:t.id,attrs:{title:e.formatViewName(t.subject)+" - "+t.name}},[n("a-tag",{staticClass:"ellispe-tag",attrs:{color:"#f50"}},[e._v(" "+e._s(t.name)+" ")])],1):e._e()]})),t.length>1?n("a-popover",{attrs:{overlayStyle:{width:"310px"},overlayClassName:"tag-info-tip"}},[n("template",{slot:"content"},[n("a-space",{staticClass:"flex-wrap",attrs:{direction:"vertical"}},[e._l(e.sortBy(t,"classType"),(function(t){return[n("a-tag",{key:t.id,attrs:{color:0===t.classType?"#2db7f5":"#f50"}},[e._v(" "+e._s(1===t.classType?e.formatViewName(t.subject)+"-"+t.name:t.name)+" ")])]}))],2)],1),n("a-tag",[n("a-icon",{attrs:{type:"ellipsis"}})],1)],2):e._e()],2)}},{key:"status",fn:function(t){return n("div",{},[n("a-tag",{attrs:{color:e.getStatusFormat(t,"color")}},[e._v(e._s(e.getStatusFormat(t)||" - "))])],1)}},{key:"action",fn:function(t,a){return n("a-space",{},[a.status!==e.SCHOOL_USER_STATUS.ARCHIVE.value?n("a",{on:{click:function(t){return e.handleEdit(a)}}},[e._v("Edit")]):e._e(),n("a-dropdown",[n("a-menu",{attrs:{slot:"overlay"},on:{click:function(t){return e.handleSingleOpt(t,a)}},slot:"overlay"},[a.status===e.SCHOOL_USER_STATUS.INACTIVE.value?n("a-menu-item",{key:"ACT_"+e.ACT.RESEND.value},[e._v(" Resend ")]):e._e(),a.status===e.SCHOOL_USER_STATUS.ACTIVE.value?n("a-menu-item",{key:"ACT_"+e.ACT.RESET.value},[e._v(" Reset password ")]):e._e(),a.status===e.SCHOOL_USER_STATUS.PENDING.value?n("a-menu-item",{key:"ACT_"+e.ACT.APPROVE.value},[e._v(" Approve ")]):e._e(),a.status===e.SCHOOL_USER_STATUS.PENDING.value?n("a-menu-item",{key:"ACT_"+e.ACT.REJECT.value},[e._v(" Reject ")]):e._e(),a.status===e.SCHOOL_USER_STATUS.ARCHIVE.value?n("a-menu-item",{key:"ACT_"+e.ACT.RESTORE.value},[e._v(" Restore ")]):e._e(),a.status===e.SCHOOL_USER_STATUS.ACTIVE.value||a.status===e.SCHOOL_USER_STATUS.INACTIVE.value?n("a-menu-item",{key:"ACT_"+e.ACT.ARCHIVE.value},[e._v(" Archive ")]):e._e(),a.status===e.SCHOOL_USER_STATUS.ARCHIVE.value?n("a-menu-item",{key:"ACT_"+e.ACT.DELETE.value},[e._v(" Delete ")]):e._e()],1),n("a",{staticStyle:{"margin-left":"8px"}},[e._v(" More "),n("a-icon",{attrs:{type:"down"}})],1)],1)],1)}}])})],1)]),n("school-user-invite",{ref:"schoolUserInvite",attrs:{school:e.currentSchool}})],1)},s=[],r=a("3835"),c=a("2909"),o=a("5530"),i=(a("07ac"),a("7db0"),a("99af"),a("d81d"),a("b0c0"),a("a15b"),a("4de4"),a("498a"),a("fb6a"),a("ac1f"),a("5319"),a("d3b7"),a("3ca3"),a("ddb0"),a("159b"),a("1276"),a("f93e")),l=a("6e84"),u=a("21fb"),d=a("b65a"),h=a("4a76"),p=a("eda0"),f=a("ad59"),m=a("6f2a"),v=a("ec09"),b=a("9bfe"),S=a("b5ff8"),C=a("b5a9"),T=a("20ae"),g=a("cfa9"),y=a("2f62"),_=a("cd3f"),O=a.n(_),j=a("4fcf"),E=j.debounce,I=j.sortBy,R={name:"SchoolTeacher",mixins:[l["a"],u["a"],d["a"],h["a"],p["a"]],components:{FixedFormHeader:S["a"],FormHeader:C["a"],CustomTextButton:T["a"],SchoolUserInvite:g["a"]},data:function(){return{USER_MODE:i["X"],SCHOOL_USER_STATUS:i["A"],tabsList:Object.values(i["A"]),sortBy:I,ACT:{ARCHIVE:{value:"4",label:"archive"},APPROVE:{value:"1",label:"approve"},REJECT:{value:"3",label:"reject"},RESTORE:{value:"8",label:"restore"},RESEND:{value:"9",label:"resend"},DELETE:{value:"-1",label:"delete"},RESET:{value:"-2",label:"reset"}},loading:!1,queryParam:{searchKey:"",schoolId:this.$store.state.user.currentSchool.id,schoolUserStatus:"",grades:"",roles:"teacher"},filters:{classes:""},debounceInit:null,classList:[],roleList:[],currentSel:null,optType:"multi",url:{list:"/classcipe/api2/school/user/getSchoolUsers"},tableRefs:["tableCon"],pendingTeacherCount:0,disableMixinCreated:!0,subjectOptions:[],onlyClass:null}},created:function(){var e=this;if(this.$route.query){if(this.$route.query.tab){var t=this.tabsList.find((function(t){return t.value+""===e.$route.query.tab+""}));t&&(this.queryParam.schoolUserStatus=t.value)}this.$route.query.classId&&(this.filters.classes=this.$route.query.classId)}this.initDict(),this.queryParam.schoolId=this.currentSchool.id,this.debounceInit=E(this.loadData,300),this.loadData(),this.initDictConfig()},computed:Object(o["a"])(Object(o["a"])({},Object(y["e"])({info:function(e){return e.user.info},userMode:function(e){return e.app.userMode},currentSchool:function(e){return e.user.currentSchool}})),{},{columns:function(){var e,t;return[{title:"Name",align:"left",dataIndex:"nickname",width:250,scopedSlots:{customRender:"name"}}].concat(Object(c["a"])(this.onlyClass?[]:[{title:"Class",align:"left",dataIndex:"classes",width:120,scopedSlots:{customRender:"classes"},filters:[{text:"Not assigned",value:-1}].concat(null===(e=this.classList)||void 0===e?void 0:e.map((function(e){return{text:e.name,value:e.id}||[]})))}]),[{title:"Role",align:"center",dataIndex:"roles",width:120,filters:null===(t=this.roleList)||void 0===t?void 0:t.map((function(e){return{text:e.name,value:e.roleCode}||[]})),customRender:function(e,t){var a=(e||[{name:"teacher"}]).map((function(e){return e.name.toLowerCase()}));return a.length>1||"teacher"!==a[0]?a.filter((function(e){return"teacher"!==e})).map((function(e){return null!==e&&void 0!==e&&e.trim().length?e[0].toUpperCase()+e.slice(1):""})).join(", "):"Teacher"}},{title:"Status",align:"center",dataIndex:"status",width:120,scopedSlots:{customRender:"status"}},{title:"Action",align:"center",width:150,scopedSlots:{customRender:"action"}}])}}),methods:{goBack:function(){this.$router.go(-1)},routerRefresh:function(){this.onlyClass=null,this.$router.replace("/manage/teacher/list"),this.filters.classes="",this.onClearSelected(),this.searchQuery()},handleSchoolChange:function(e){this.userMode===i["X"].SCHOOL&&(this.queryParam.schoolId=e.id,this.initDict(),this.debounceInit())},handleModeChange:function(e){this.initDict(),this.debounceInit()},isSelfEmail:function(e){return e===this.info.email},initDict:function(){var e=this;Promise.all([Object(f["g"])({schoolId:this.currentSchool.id,pageNo:1,pageSize:1e4}),Object(m["g"])({schoolId:this.currentSchool.id}),Object(v["o"])({schoolId:this.currentSchool.id}),Object(b["a"])({schoolId:this.currentSchool.id})]).then((function(t){var a=Object(r["a"])(t,4),n=a[0],s=a[1],c=a[2],i=a[3];if(0===n.code){e.classList=n.result.records,e.onlyClass=null;var l=e.$route.query;if(l.classId){var u=e.classList.find((function(e){return e.id===l.classId}));u?(e.filters.classes=l.classId,e.onlyClass=Object(o["a"])({},u)):e.routerRefresh()}}if(0===s.code&&(e.roleList=s.result),c.success&&c.result&&(e.pendingTeacherCount=c.result.pendingCount),i.success){var d=[];i.result.forEach((function(e){e.subjectList&&e.subjectList.length>0&&(d=d.concat(e.subjectList))}));var h=[];d.forEach((function(e){h.push({subjectId:e.subjectId,subjectName:e.subjectName}),h.push({subjectId:e.parentSubjectId,subjectName:e.parentSubjectName})})),e.subjectOptions=h}e.onClearSelected()}))},toggleTab:function(e){this.queryParam.schoolUserStatus=e;var t="/manage/teacher/list?tab="+e+(this.onlyClass?"&classId=".concat(this.onlyClass.id):"");this.$router.replace({path:t}),this.onClearSelected(),this.searchQuery()},getStatusFormat:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"label",a=this.tabsList.find((function(t){return t.value===e}));return a?a[t]:""},handleBatchOpt:function(e){this.optType="multi",this.handleOpt(e)},handleSingleOpt:function(e,t){this.optType="single",this.currentSel=O()(t),this.handleOpt(e)},handleOpt:function(e){var t=this,a=[];if(a="multi"===this.optType?this.selectedRowKeys:[this.currentSel.uid],a.length>0){var n=null,s=e.key.split("_")[1],r=Object.values(this.ACT).find((function(e){return e.value===s}));n=s===this.ACT.DELETE.value?v["u"]:s===this.ACT.RESET.value?v["v"]:v["h"],this.$confirm({title:"Confirm ".concat(r.label),content:"Do you want to ".concat(r.label," this teacher(s)?"),centered:!0,onOk:function(){t.loading=!0,n({act:s,schoolId:t.currentSchool.id,userIdList:a,userIds:a}).then((function(e){0===e.code&&(t.$message.success("Opt Successfully"),t.onClearSelected(),t.initDict(),t.searchQuery())})).finally((function(){t.loading=!1}))}})}},getFilterParams:function(e){e.classes&&e.classes.length>0?this.filters.classes=e.classes.join(","):this.filters.classes="",e.roles&&e.roles.length>0?this.filters.teacherRoles=e.roles.join(","):this.filters.teacherRoles=""},handleAdd:function(){var e="/manage/teacher/detail"+(this.onlyClass?"?classId=".concat(this.onlyClass.id):"");this.$router.push(e)},handleUpload:function(){var e="/manage/teacher/upload"+(this.onlyClass?"/".concat(this.onlyClass.id):"");this.$router.push(e)},handleEdit:function(e){this.$router.push("/manage/teacher/detail/"+e.uid)},handleInvite:function(){this.$refs.schoolUserInvite.doCreate("teacher")},getBadge:function(e){return e!==i["A"].PENDING.value||this.onlyClass?0:this.pendingTeacherCount},formatViewName:function(e){var t=this.subjectOptions.find((function(t){return t.subjectId===e}));return t?t.subjectName:"Untitle"}}},A=R,k=(a("cb8b"),a("0c7c")),U=Object(k["a"])(A,n,s,!1,null,"899a72e8",null);t["default"]=U.exports},"31f4":function(e,t,a){"use strict";a("3f84")},"3f84":function(e,t,a){},4992:function(e,t,a){e.exports=a.p+"img/default-avatar.db1c5445.png"},"4a76":function(e,t,a){"use strict";a.d(t,"a",(function(){return n}));a("159b"),a("d81d"),a("c7cd");var n={data:function(){return{tableRefs:[],leftWidth:0,firstColumnWid:0}},mounted:function(){this.firstColumnWid=this.columns[0]?this.columns[0].width:0,this.resetTableWidth(200),window.addEventListener("resize",this.resetTableWidth,!0)},destroyed:function(){window.removeEventListener("resize",this.resetTableWidth)},methods:{resetTableWidth:function(e){var t=this;this.tableRefs&&this.tableRefs.length>0&&(this.tableRefs.forEach((function(a){if(t.$refs[a]&&t.columns&&t.columns.length>0){var n=t.columns.map((function(e){return e.width&&"auto"!==e.width?parseInt(e.width):parseInt(t.firstColumnWid)})).reduce((function(e,t){return e+t}),0),s=(t.$refs[a].$el||t.$refs[a]).getBoundingClientRect().width;s>n+t.leftWidth+e?(t.columns[0].width="auto",t.scroll={x:s}):(t.columns[0].width=t.firstColumnWid,t.scroll={x:n},t.columns[t.columns.length-1].fixed="right")}})),this.$forceUpdate())}}}},"6f2a":function(e,t,a){"use strict";a.d(t,"g",(function(){return c})),a.d(t,"h",(function(){return o})),a.d(t,"e",(function(){return i})),a.d(t,"b",(function(){return l})),a.d(t,"a",(function(){return u})),a.d(t,"f",(function(){return d})),a.d(t,"d",(function(){return h})),a.d(t,"i",(function(){return p})),a.d(t,"c",(function(){return f}));a("d3b7");var n=a("b775"),s="api2/school/role",r={listRole:"/classcipe/".concat(s,"/list"),pageListRole:"/classcipe/".concat(s,"/pageList"),getRolePermission:"/classcipe/".concat(s,"/getPermission"),bindRoleSubjectLeader:"/classcipe/".concat(s,"/user/bindSubjectLeader"),bindRoleClassTeachers:"/classcipe/".concat(s,"/user/bindTeachers"),getRoleSubjectLeaders:"/classcipe/".concat(s,"/user/getSubjectLeaders"),getRoleClassTeachers:"/classcipe/".concat(s,"/user/getTeachers"),getSchoolRole:"/classcipe/".concat(s,"/user/getSchoolRole"),saveSchoolRole:"/classcipe/".concat(s,"/user/saveSchoolRole"),geHeaderClassByUserId:"/classcipe/".concat(s,"/user/geHeaderClassByUserId")};function c(e){return Object(n["d"])({url:r.getSchoolRole,method:"get",params:e}).then((function(e){var t=e;if(0===t.code){var a=[];for(var n in t.result.roleNames)"Teacher"!==n&&a.push({roleCode:n,name:t.result.roleNames[n]});t.result=a}return Promise.resolve(t)})).catch((function(e){return Promise.reject(e)}))}function o(e){return Object(n["d"])({url:r.getSchoolRole,method:"get",params:e}).then((function(e){var t=e;if(0===t.code){var a=[];for(var n in t.result.roleNames)"Teacher"!==n&&a.push({roleCode:n,name:t.result.roleNames[n]});t.result={total:a.length,records:a}}return Promise.resolve(t)})).catch((function(e){return Promise.reject(e)}))}function i(e){return Object(n["d"])({url:r.getRolePermission,method:"get",params:e})}function l(e){return Object(n["d"])({url:r.bindRoleSubjectLeader,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function u(e){return Object(n["d"])({url:r.bindRoleClassTeachers,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function d(e){return Object(n["d"])({url:r.getRoleSubjectLeaders,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function h(e){return Object(n["d"])({url:r.getRoleClassTeachers,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function p(e){return Object(n["d"])({url:r.saveSchoolRole,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function f(e){return Object(n["d"])({url:r.geHeaderClassByUserId,method:"get",params:e})}},cb8b:function(e,t,a){"use strict";a("0ed8")},cfa9:function(e,t,a){"use strict";var n=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("a-modal",{attrs:{title:"Invite by link",footer:null},on:{cancel:e.handleInviteBackBtn},model:{value:e.modalVis,callback:function(t){e.modalVis=t},expression:"modalVis"}},[a("a-spin",{attrs:{spinning:e.loading}},[a("div",{staticClass:"invite"},[a("div",{staticClass:"invite-link"},[a("div",{staticClass:"link-text"},[e._v(" "+e._s(e.inviteUrl)+" ")]),a("div",{staticClass:"action-copy",on:{click:e.onCopy}},[a("a-tooltip",{attrs:{placement:"top",title:"Copy link"}},[a("a-icon",{attrs:{type:"link"}})],1)],1)]),a("div",{staticClass:"invite-checkbox"},[a("a-checkbox",{attrs:{checked:e.inviteCheckBoxChecked},on:{change:e.onInviteCheckBoxChange}},[e._v(" Applicants with this link will need your approval to join your school community ")])],1),a("div",{staticClass:"invite-reset-btn"},[a("a-button",{attrs:{shape:"round",type:"primary",icon:"sync",loading:e.loading},on:{click:e.handleInviteResetBtn}},[e._v(" Reset ")])],1)])])],1)},s=[],r=a("1da1"),c=a("5530"),o=(a("96cf"),a("99af"),a("ec09")),i={name:"SchoolUserInvite",props:{school:{type:Object,default:function(){}}},watch:{school:{handler:function(e){this.currentSchool=Object(c["a"])({},e)},deep:!0,immediate:!0}},data:function(){return{currentSchool:this.school,loading:!1,modalVis:!1,role:"student",inviteUrl:"",inviteCheckBoxChecked:!0,inviteCodeId:void 0}},methods:{doCreate:function(e){this.role=e,this.modalVis=!0,this.handleInviteEnterBtn()},getInviteUrl:function(e){var t=this;return Object(r["a"])(regeneratorRuntime.mark((function a(){var n,s,r,c;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.next=2,Object(o["l"])({schoolId:t.currentSchool.id,role:t.role,needApprove:t.inviteCheckBoxChecked?1:0,needRefresh:e,need_approve:t.inviteCheckBoxChecked?1:0,need_refresh:e});case 2:n=a.sent,null!==n&&void 0!==n&&n.success&&(t.inviteUrl="".concat("https://my.classcipe.com","/user/invite?inviteCode=").concat(null===n||void 0===n||null===(s=n.result)||void 0===s?void 0:s.inviteCode),t.inviteCheckBoxChecked=null===n||void 0===n||null===(r=n.result)||void 0===r?void 0:r.approveFlag,t.inviteCodeId=null===n||void 0===n||null===(c=n.result)||void 0===c?void 0:c.id);case 4:case"end":return a.stop()}}),a)})))()},handleInviteEnterBtn:function(){var e=this;return Object(r["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.loading=!0,t.next=3,e.getInviteUrl(0);case 3:e.loading=!1;case 4:case"end":return t.stop()}}),t)})))()},handleInviteResetBtn:function(){var e=this;return Object(r["a"])(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return e.loading=!0,t.next=3,e.getInviteUrl(1);case 3:e.loading=!1;case 4:case"end":return t.stop()}}),t)})))()},handleInviteBackBtn:function(){this.$emit("cancel")},onInviteCheckBoxChange:function(e){this.inviteCheckBoxChecked=e.target.checked,this.updateInviteCode(e.target.checked)},updateInviteCode:function(e){var t=this;return Object(r["a"])(regeneratorRuntime.mark((function a(){var n,s;return regeneratorRuntime.wrap((function(a){while(1)switch(a.prev=a.next){case 0:return a.next=2,Object(o["y"])({needApprove:e?1:0,need_approve:e?1:0,id:t.inviteCodeId});case 2:n=a.sent,n.success?t.inviteUrl="".concat("https://my.classcipe.com","/user/invite?inviteCode=").concat(null===n||void 0===n||null===(s=n.result)||void 0===s?void 0:s.inviteCode):t.$message.error(n.message);case 4:case"end":return a.stop()}}),a)})))()},onCopy:function(){var e=this;this.$copyText(this.inviteUrl).then((function(t){e.$message.success("Copy success!"),e.modalVis=!1})).catch((function(t){e.$message.error("Copy Failed")}))}}},l=i,u=(a("31f4"),a("0c7c")),d=Object(u["a"])(l,n,s,!1,null,"0a748f0f",null);t["a"]=d.exports},ec09:function(e,t,a){"use strict";a.d(t,"m",(function(){return o})),a.d(t,"c",(function(){return i})),a.d(t,"d",(function(){return l})),a.d(t,"t",(function(){return u})),a.d(t,"u",(function(){return d})),a.d(t,"l",(function(){return h})),a.d(t,"y",(function(){return p})),a.d(t,"A",(function(){return f})),a.d(t,"h",(function(){return m})),a.d(t,"g",(function(){return v})),a.d(t,"a",(function(){return b})),a.d(t,"e",(function(){return S})),a.d(t,"f",(function(){return C})),a.d(t,"n",(function(){return T})),a.d(t,"p",(function(){return g})),a.d(t,"i",(function(){return y})),a.d(t,"j",(function(){return _})),a.d(t,"k",(function(){return O})),a.d(t,"v",(function(){return j})),a.d(t,"r",(function(){return E})),a.d(t,"z",(function(){return I})),a.d(t,"x",(function(){return R})),a.d(t,"s",(function(){return A})),a.d(t,"w",(function(){return k})),a.d(t,"b",(function(){return U})),a.d(t,"o",(function(){return w})),a.d(t,"q",(function(){return P}));var n=a("b775"),s=a("ca00"),r="api2/school/user",c={getSchoolUsers:"/classcipe/".concat(r,"/getSchoolUsers"),addStudents:"/classcipe/".concat(r,"/addStudents"),addTeacher:"/classcipe/".concat(r,"/addTeacher"),removeStudents:"/classcipe/".concat(r,"/removeStudents"),removeTeachers:"/classcipe/".concat(r,"/removeTeachers"),updateTeacher:"/classcipe/".concat(r,"/updateTeacher"),getInvite:"/classcipe/".concat(r,"/getInvite"),updateInvite:"/classcipe/".concat(r,"/updateInvite"),bulkActTeacher:"/classcipe/".concat(r,"/teacher/bulkAct"),bulkActStudent:"/classcipe/".concat(r,"/student/bulkAct"),acceptInvite:"/classcipe/".concat(r,"/acceptInvite"),batchAddStudent:"/classcipe/".concat(r,"/batchAddStudent"),batchAddTeacher:"/classcipe/".concat(r,"/batchAddTeacher"),getStudentInfo:"/classcipe/".concat(r,"/getStudentInfo"),getTeacherInfo:"/classcipe/".concat(r,"/getTeacherInfo"),checkEmailParent:"/classcipe/".concat(r,"/parent/checkEmail"),resetPassword:"/classcipe/".concat(r,"/resetPassword"),checkEmailStudent:"/classcipe/".concat(r,"/student/checkEmail"),moveClassStudent:"/classcipe/".concat(r,"/student/moveClass"),sendParentEmail:"/classcipe/".concat(r,"/student/sendParentEmail"),checkEmailTeacher:"/classcipe/".concat(r,"/teacher/checkEmail"),updateStudent:"/classcipe/".concat(r,"/updateStudent"),addAdmin:"/classcipe/".concat(r,"/addAdmin"),removeAdmins:"/classcipe/".concat(r,"/removeAdmins"),resetUserPassword:"/classcipe/".concat(r,"/user/resetPassword"),addSchoolAdmin:"/classcipe/".concat(r,"/addSchoolAdmin"),getTeacherCount:"/classcipe/".concat(r,"/getTeacherCount"),listStudents:"/classcipe/".concat(r,"/list/students")};function o(e){return Object(n["d"])({url:c.getSchoolUsers,method:"get",params:e})}function i(e){return e=Object(s["trimParams"])(e),Object(n["d"])({url:c.addStudents,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function l(e){return e=Object(s["trimParams"])(e),Object(n["d"])({url:c.addTeacher,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function u(e){return Object(n["d"])({url:c.removeStudents,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function d(e){return Object(n["d"])({url:c.removeTeachers,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function h(e){return Object(n["d"])({url:c.getInvite,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function p(e){return e=Object(s["trimParams"])(e),Object(n["d"])({url:c.updateInvite,method:"post",data:e,params:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function f(e){return e=Object(s["trimParams"])(e),Object(n["d"])({url:c.updateTeacher,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function m(e){return Object(n["d"])({url:c.bulkActTeacher,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function v(e){return Object(n["d"])({url:c.bulkActStudent,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function b(e){return Object(n["d"])({url:c.acceptInvite,method:"post",data:e,params:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function S(e){return e=Object(s["trimParams"])(e),Object(n["d"])({url:c.batchAddStudent,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function C(e){return e=Object(s["trimParams"])(e),Object(n["d"])({url:c.batchAddTeacher,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function T(e){return Object(n["d"])({url:c.getStudentInfo,method:"get",params:e})}function g(e){return Object(n["d"])({url:c.getTeacherInfo,method:"get",params:e})}function y(e){return Object(n["d"])({url:c.checkEmailParent,method:"get",params:e})}function _(e){return Object(n["d"])({url:c.checkEmailStudent,method:"get",params:e})}function O(e){return Object(n["d"])({url:c.checkEmailTeacher,method:"get",params:e})}function j(e){return Object(n["d"])({url:c.resetPassword,method:"get",params:e})}function E(e){return Object(n["d"])({url:c.moveClassStudent,method:"get",params:e})}function I(e){return e=Object(s["trimParams"])(e),Object(n["d"])({url:c.updateStudent,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function R(e){return Object(n["d"])({url:c.sendParentEmail,method:"get",params:e})}function A(e){return Object(n["d"])({url:c.removeAdmins,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function k(e){return Object(n["d"])({url:c.resetUserPassword,method:"get",params:e})}function U(e){return e=Object(s["trimParams"])(e),Object(n["d"])({url:c.addSchoolAdmin,method:"post",data:e,params:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function w(e){return Object(n["d"])({url:c.getTeacherCount,method:"get",params:e})}function P(e){return Object(n["d"])({url:c.listStudents,method:"get",params:e})}},eda0:function(e,t,a){"use strict";a.d(t,"a",(function(){return o}));var n=a("f93e"),s=a("c24f"),r=a("9fb0"),c=a("2f62");const o={data(){return{}},created(){const e=this.$route.query;e.schoolId&&this.autoSwitchSchool(e.schoolId)},watch:{"$route.path"(e){console.log(e);const t=this.$route.query;t.schoolId&&this.autoSwitchSchool(t.schoolId)}},computed:{...Object(c["e"])({info:e=>e.user.info,currentSchool:e=>e.user.currentSchool,userMode:e=>e.app.userMode})},methods:{...Object(c["d"])([r["M"]]),...Object(c["b"])(["GetClassList"]),autoSwitchSchool(e){this.$store.dispatch("GetInfo").then(()=>{const t=this.info.schoolList.find(t=>t.id===e);t&&Object(s["c"])({isPersonal:!1,schoolId:t.id}).then(e=>{this[r["M"]](n["X"].SCHOOL),this.$store.dispatch("GetInfo"),this.GetClassList(t.id)})})}}}}}]);