(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-366314ae"],{"0fac":function(t,e,a){"use strict";a.d(e,"a",(function(){return i}));var o=a("85b1"),s=a("ca00"),r=a("8ded"),n=a.n(r),i={data:function(){return{saving:!1,saveTime:null,asyncSaveLocalDataFn:null,asyncSaveDataFn:null,autoSaveLocalKey:"FORM_",needAutoSave:!1,needAutoSaveRemote:!1}},created:function(){this.asyncSaveLocalDataFn=Object(o["a"])(this.autoSaveLocalData,200),this.asyncSaveDataFn=Object(o["a"])(this.autoSaveData,3e3)},watch:{formModel:{deep:!0,handler:function(t,e){this.needAutoSave&&this.asyncSaveLocalDataFn(t),this.needAutoSaveRemote&&!this.loading&&this.asyncSaveDataFn(t)}}},computed:{lastChangeSavedTime:function(){var t=this.saveTime||this.formModel&&(this.formModel.updateTime||this.form.createTime);return t?Object(s["formatLocalUTC"])(t):""}},methods:{autoSaveLocalData:function(t){var e=this.$store.getters.userInfo.id,a=this.$store.state.user.currentSchool.id;n.a.set(this.autoSaveLocalKey+e+a,JSON.stringify(t)),this.saveTime=new Date},autoSaveData:function(t){var e=this;this.handleSave((function(){e.saveTime=new Date}))},getAutoLocalData:function(){var t=this.$store.getters.userInfo.id,e=this.$store.state.user.currentSchool.id,a=n.a.get(this.autoSaveLocalKey+t+e);return a?JSON.parse(a):{}},clearLocalData:function(){var t=this.$store.getters.userInfo.id,e=this.$store.state.user.currentSchool.id;n.a.remove(this.autoSaveLocalKey+t+e)}}}},"178d":function(t,e,a){},"21fb":function(t,e,a){"use strict";a.d(e,"a",(function(){return o}));a("b0c0");var o={data:function(){return{unwatch:null,routeName:this.$route.name}},created:function(){var t=this;this.unwatch=this.$store.watch((function(t){return t.user.currentSchool}),(function(e){return e&&t.$route.name===t.routeName&&t.handleSchoolChange(e)}))},computed:{},beforeDestroy:function(){this.unwatch&&this.unwatch()},methods:{handleSchoolChange:function(t){}}}},4992:function(t,e,a){t.exports=a.p+"img/default-avatar.db1c5445.png"},"4c77":function(t,e,a){"use strict";a("178d")},"6d78":function(t,e,a){"use strict";a.d(e,"a",(function(){return r}));a("4de4"),a("07ac"),a("b64b");var o=a("8ded"),s=a.n(o),r={data:function(){return{validateFileds:{},refName:"form"}},computed:{hasErrors:function(){return Object.values(this.validateFileds).filter((function(t){return!t})).length>0}},methods:{initValidate:function(t){var e=this;!t&&this.validatorRules&&this.$refs[this.refName].validateField(Object.keys(this.validatorRules),(function(t){var a=e.$store.getters.userInfo.id,o=e.autoSaveLocalKey?s.a.get(e.autoSaveLocalKey+a):"";o||e.$refs[e.refName].clearValidate()}))},fillValidate:function(t,e){this.$set(this.validateFileds,t,e)}}}},"6e84":function(t,e,a){"use strict";a.d(e,"a",(function(){return o}));a("b0c0");var o={data:function(){return{unwatch:null,routeName:this.$route.name}},computed:{redirectUrl:function(){return"student"===this.$store.state.user.currentRole?"/student/main/my-task":"/account/info"}},created:function(){var t=this;this.unwatch=this.$store.watch((function(t){return t.app.userMode}),(function(e){e&&t.$route.name===t.routeName&&(t.handleModeChange(e),t.routeInMode())})),this.routeInMode()},beforeDestroy:function(){this.unwatch&&this.unwatch()},methods:{routeInMode:function(){this.$route.meta.mode&&this.$route.meta.mode!==this.$store.state.app.userMode&&this.$router.push({path:this.redirectUrl})},handleModeChange:function(t){}}}},"72f8":function(t,e,a){"use strict";a("c564")},"8d90":function(t,e,a){"use strict";var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a-modal",{attrs:{title:t.$t("account.settings.avatar.edit"),visible:t.visible,maskClosable:!1,confirmLoading:t.confirmLoading,width:800,footer:null},on:{cancel:t.cancelHandel}},[a("a-row",[a("a-col",{style:{height:"350px"},attrs:{xs:24,md:12}},[a("vue-cropper",{ref:"cropper",attrs:{img:t.options.img,info:!0,autoCrop:t.options.autoCrop,autoCropWidth:t.options.autoCropWidth,autoCropHeight:t.options.autoCropHeight,fixedBox:t.options.fixedBox},on:{realTime:t.realTime}})],1),a("a-col",{style:{height:"350px"},attrs:{xs:24,md:12}},[a("div",{staticClass:"avatar-upload-preview"},[a("img",{style:t.previews.img,attrs:{src:t.previews.url}})])])],1),a("br"),a("a-row",[a("a-col",{attrs:{lg:2,md:2}},[a("a-upload",{attrs:{name:"file",beforeUpload:t.beforeUpload,showUploadList:!1}},[a("a-button",{attrs:{icon:"upload"}},[t._v(t._s(t.$t("account.settings.avatar.select-image")))])],1)],1),a("a-col",{attrs:{lg:{span:1,offset:2},md:2}},[a("a-button",{attrs:{icon:"plus"},on:{click:function(e){return t.changeScale(1)}}})],1),a("a-col",{attrs:{lg:{span:1,offset:1},md:2}},[a("a-button",{attrs:{icon:"minus"},on:{click:function(e){return t.changeScale(-1)}}})],1),a("a-col",{attrs:{lg:{span:1,offset:1},md:2}},[a("a-button",{attrs:{icon:"undo"},on:{click:t.rotateLeft}})],1),a("a-col",{attrs:{lg:{span:1,offset:1},md:2}},[a("a-button",{attrs:{icon:"redo"},on:{click:t.rotateRight}})],1),a("a-col",{attrs:{lg:{span:4,offset:6},md:4}},[a("a-space",[a("a-button",{on:{click:t.close}},[t._v(" Cancel ")]),a("a-button",{attrs:{type:"primary",disabled:t.confirmLoading,loading:t.confirmLoading},on:{click:t.uploadImage}},[t._v("Save")])],1)],1)],1)],1)},s=[],r=(a("ac1f"),a("1276"),a("466d"),a("ace4"),a("d3b7"),a("5cc6"),a("9a8c"),a("a975"),a("735e"),a("c1ac"),a("d139"),a("3a7b"),a("d5d6"),a("82f8"),a("e91f"),a("60bd"),a("5f96"),a("3280"),a("3fcc"),a("ca91"),a("25a1"),a("cd26"),a("3c5d"),a("2954"),a("649e"),a("219c"),a("170b"),a("b39a"),a("72f7"),a("99af"),a("fb6a"),a("25f0"),a("d0d0")),n={data:function(){return{visible:!1,id:null,confirmLoading:!1,fileList:[],uploading:!1,options:{img:"",autoCrop:!0,autoCropWidth:200,autoCropHeight:200,fixedBox:!0},previews:{}}},methods:{edit:function(t){this.visible=!0,this.id=t},close:function(){this.id=null,this.visible=!1},cancelHandel:function(){this.close()},changeScale:function(t){t=t||1,this.$refs.cropper.changeScale(t)},rotateLeft:function(){this.$refs.cropper.rotateLeft()},rotateRight:function(){this.$refs.cropper.rotateRight()},beforeUpload:function(t){var e=this,a=new FileReader;return a.readAsDataURL(t),a.onload=function(){e.options.img=a.result},!1},uploadImage:function(){var t=this;this.$refs.cropper.getCropData((function(e){var a=e.split(","),o=a[0].match(/:(.*?);/)[1],s=atob(a[1]),n=s.length,i=new Uint8Array(n);while(n--)i[n]=s.charCodeAt(n);t.model=!0,t.modelSrc=e;var c=o.split("/")[1],l=new File([i],"custom_image_".concat(Date.now(),"_").concat(Math.random().toString(36).slice(2),".").concat(c),{type:o});t.$logger.info("upload file",l),t.confirmLoading=!0,Object(r["a"])(t.$store.getters.userInfo.id,l,t.getProgressUpLoad,(function(e){t.onSuccess(l,e)}),!0)}))},getProgressUpLoad:function(t){this.$logger.info("getProgressUpLoad",t),this.confirmLoading=!0},onSuccess:function(t,e){this.$logger.info("upload success",t,e),this.$emit("ok",e),this.confirmLoading=!1,this.okHandel()},okHandel:function(){var t=this;t.confirmLoading=!0,setTimeout((function(){t.confirmLoading=!1,t.close(),t.$message.success("update avatar successfully!")}),2e3)},realTime:function(t){this.previews=t}}},i=n,c=(a("4c77"),a("0c7c")),l=Object(c["a"])(i,o,s,!1,null,"06163b63",null);e["a"]=l.exports},"9e9b":function(t,e,a){"use strict";a.r(e);var o=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"my-full-form-wrapper",attrs:{id:"formRoot"}},[o("fixed-form-header",{scopedSlots:t._u([{key:"header",fn:function(){return[o("form-header",{attrs:{title:t.title,"show-share":!1,"show-collaborate":!1,"is-preview-mode":!0},on:{back:t.goBack},scopedSlots:t._u([{key:"back",fn:function(){return[o("img",{staticClass:"single-logo-img",attrs:{src:a("be50"),alt:"classcipe"},on:{click:function(e){return e.stopPropagation(),t.$router.push("/")}}})]},proxy:!0},{key:"left",fn:function(){return[o("a-space",{attrs:{size:5,align:"center"},on:{click:function(t){t.stopPropagation()}}},[o("label",{staticStyle:{cursor:"pointer"},on:{click:function(e){return t.$router.push("/account/info")}}},[t._v("Account Info")]),o("label",{attrs:{for:""}},[t._v(">")]),o("label",{staticStyle:{cursor:"pointer"},on:{click:function(e){return t.$router.push("/manage/student/list")}}},[t._v("School Student")]),o("label",{attrs:{for:""}},[t._v(">")]),t.onlyClass?[o("label",{staticStyle:{cursor:"pointer"},on:{click:function(e){return t.$router.push("/manage/student/list?classId="+t.onlyClass.id)}}},[t._v(t._s(t.onlyClass.name))]),o("label",{attrs:{for:""}},[t._v(">")])]:t._e(),o("label",{staticStyle:{"font-weight":"normal"}},[t._v(t._s(t.title))])],2)]},proxy:!0},{key:"right",fn:function(){},proxy:!0}])})]},proxy:!0}])}),o("div",{staticClass:"form-content"},[o("school-student-add",{ref:"schoolStudentAdd",attrs:{school:t.currentSchool,id:t.id},on:{getCls:t.changeCls,save:t.handleSave}})],1)],1)},s=[],r=a("5530"),n=a("f93e"),i=a("6e84"),c=a("21fb"),l=a("b5ff8"),d=a("b5a9"),u=a("b116"),m=a("2f62"),f=a("4fcf"),p=f.debounce,h={name:"SchoolStudentEdit",mixins:[i["a"],c["a"]],components:{FixedFormHeader:l["a"],FormHeader:d["a"],SchoolStudentAdd:u["a"]},props:{id:{type:String,default:null}},data:function(){return{USER_MODE:n["U"],SCHOOL_USER_STATUS:n["z"],onlyClass:null}},created:function(){this.debounceLoad=p(this.loadData,300)},computed:Object(r["a"])(Object(r["a"])({},Object(m["e"])({userMode:function(t){return t.app.userMode},currentSchool:function(t){return t.user.currentSchool}})),{},{title:function(){return this.id?"Edit":"Add"}}),methods:{goBack:function(){this.$router.go(-1)},handleSchoolChange:function(t){this.userMode===n["U"].SCHOOL&&(this.queryParam.schoolId=t.id,this.initDict(),this.debounceInit())},handleModeChange:function(t){this.debounceInit()},loadData:function(){},handleSave:function(t){this.goBack()},changeCls:function(t){this.onlyClass=t}}},b=h,g=(a("72f8"),a("0c7c")),v=Object(g["a"])(b,o,s,!1,null,"741840d8",null);e["default"]=v.exports},a393:function(t,e,a){"use strict";a("ac93")},ac93:function(t,e,a){},b116:function(t,e,a){"use strict";var o=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",[t.studentId?o("div",{staticClass:"account-info-self"},[o("div",{staticClass:"info-self-avatar"},[t.formModel.avatar?o("img",{attrs:{src:t.formModel.avatar}}):o("img",{attrs:{src:a("4992")}}),o("a-button",{attrs:{type:"primary",size:"small"},on:{click:function(e){return t.$refs.avatarModal.edit(1)}}},[t._v("Upload")])],1),o("div",{staticClass:"info-self-detail"},[o("div",{staticClass:"self-detail-name"},[t._v(" ID: "+t._s(t.origin.workNo||t.studentId)+" ")]),o("div",{staticClass:"self-detail-email"},[t._v(t._s(t.formModel.inviteEmail))])])]):t._e(),o("a-form-model",t._b({ref:"form",attrs:{layout:"horizontal",model:t.formModel,rules:t.validatorRules},on:{validate:t.doValidate}},"a-form-model",t.formItemLayout,!1),[t.studentId?o("a-form-model-item",{attrs:{label:"Last Login",wrapperCol:{span:18}}},[o("a-row",{attrs:{gutter:0}},[o("a-col",{attrs:{span:16}},[t.origin.lastLogin?o("label",{attrs:{for:""}},[t._v(t._s(t._f("dayjs")(t.origin.lastLogin)))]):o("label",{attrs:{for:""}},[t._v("-")])]),o("a-col",{staticStyle:{"text-align":"center"},attrs:{span:2}}),t.origin.inviteEmail||t.origin.parentEmailStatus?t._e():o("a-col",{staticStyle:{"text-align":"center"},attrs:{span:6}},[o("a-button",{attrs:{type:"black",loading:t.confirmLoading},on:{click:t.handleReset}},[t._v("Reset Password")])],1)],1)],1):t._e(),o("a-form-model-item",{staticClass:"mb0",attrs:{label:"Name",required:!0}},[o("a-row",{attrs:{gutter:16}},[o("a-col",{attrs:{span:12}},[o("a-form-model-item",{attrs:{prop:"firstName",hasFeedback:!0}},[o("a-input",{attrs:{placeholder:"First name"},on:{change:t.doValidParentEmail},model:{value:t.formModel.firstName,callback:function(e){t.$set(t.formModel,"firstName",e)},expression:"formModel.firstName"}})],1)],1),o("a-col",{attrs:{span:12}},[o("a-form-model-item",{attrs:{prop:"lastName",hasFeedback:!0}},[o("a-input",{attrs:{placeholder:"Last name"},on:{change:t.doValidParentEmail},model:{value:t.formModel.lastName,callback:function(e){t.$set(t.formModel,"lastName",e)},expression:"formModel.lastName"}})],1)],1)],1)],1),o("a-form-model-item",{staticClass:"mb0",attrs:{label:"Email",prop:"inviteEmail",required:!1,wrapperCol:{span:18}}},[o("a-row",{attrs:{gutter:0}},[o("a-col",{attrs:{span:16}},[o("a-form-model-item",[o("a-input",{attrs:{placeholder:"Email",disabled:t.studentId&&!!t.formModel.inviteEmail&&1===t.origin.status},model:{value:t.formModel.inviteEmail,callback:function(e){t.$set(t.formModel,"inviteEmail",e)},expression:"formModel.inviteEmail"}})],1)],1),t.formModel.inviteEmail&&1===t.origin.status?o("a-col",{staticStyle:{"text-align":"center"},attrs:{span:2}},[o("a-tooltip",{attrs:{title:"Student Active"}},[o("a-icon",{staticStyle:{color:"#007990"},attrs:{type:"check"}})],1)],1):t._e(),t.formModel.inviteEmail&&0===t.origin.status?o("a-col",{staticStyle:{"text-align":"center"},attrs:{span:6}},[o("a-tooltip",{attrs:{title:"Student InActive"}},[o("a-icon",{staticStyle:{color:"#8D9496"},attrs:{type:"check"}})],1)],1):t._e()],1)],1),o("a-form-model-item",{attrs:{label:"DOB"}},[o("a-date-picker",{attrs:{"disabled-date":t.disabledDate},model:{value:t.formModel.birthDay,callback:function(e){t.$set(t.formModel,"birthDay",e)},expression:"formModel.birthDay"}})],1),o("a-form-model-item",{staticClass:"mb0",attrs:{label:"Class",required:!0}},[o("a-row",{attrs:{gutter:16}},[o("a-col",{attrs:{span:18}},[o("a-form-model-item",{staticClass:"select",attrs:{prop:"classes"}},[t.classUnModify?o("a-space",[t.classArrDetail.length>0?o("a-space",{staticClass:"flex-wrap"},[t._l(t.classArrDetail,(function(e){return[o("a-tag",{key:e.id,attrs:{color:0===e.classType?"#2db7f5":"#f50"}},[t._v(" "+t._s(1===e.classType?t.formatViewName(e.subject)+"-"+e.name:e.name)+" ")])]}))],2):o("label",{attrs:{for:""}},[t._v(" - ")])],1):[o("a-select",{attrs:{showSearch:"",optionFilterProp:"children",getPopupContainer:function(t){return t.parentElement},"option-label-prop":"label",placeholder:"Please select class"},model:{value:t.formModel.classes,callback:function(e){t.$set(t.formModel,"classes",e)},expression:"formModel.classes"}},t._l(t.classNameList,(function(e,a){return o("a-select-option",{key:a,attrs:{label:e}},[t._v(" "+t._s(e)+" ")])})),1)]],2)],1),t.showClassLink?o("a-col",{attrs:{span:6}},[o("a-button",{attrs:{type:"link"},on:{click:t.handelGoClass}},[t._v("Class Manage")])],1):t._e()],1)],1),o("div",{staticClass:"sub-title"},[o("label",{attrs:{for:""}},[t._v("Parent guardian")])]),o("a-form-model-item",{staticClass:"mb0",attrs:{label:"Name"}},[o("a-row",{attrs:{gutter:16}},[o("a-col",{attrs:{span:12}},[o("a-form-model-item",{attrs:{prop:"parentFirstName"}},[o("a-input",{attrs:{placeholder:"First name"},model:{value:t.formModel.parentFirstName,callback:function(e){t.$set(t.formModel,"parentFirstName",e)},expression:"formModel.parentFirstName"}})],1)],1),o("a-col",{attrs:{span:12}},[o("a-form-model-item",{attrs:{prop:"parentLastName"}},[o("a-input",{attrs:{placeholder:"Last name"},model:{value:t.formModel.parentLastName,callback:function(e){t.$set(t.formModel,"parentLastName",e)},expression:"formModel.parentLastName"}})],1)],1)],1)],1),o("a-form-model-item",{staticClass:"mb0",attrs:{label:"Email",required:!0,wrapperCol:{span:18}}},[o("a-row",{attrs:{gutter:0}},[o("a-col",{attrs:{span:16}},[o("a-form-model-item",{attrs:{prop:"parentEmail",hasFeedback:!0}},[o("a-input",{attrs:{placeholder:"Email"},model:{value:t.formModel.parentEmail,callback:function(e){t.$set(t.formModel,"parentEmail",e)},expression:"formModel.parentEmail"}})],1)],1),1===t.origin.parentEmailStatus?o("a-col",{staticStyle:{"text-align":"center"},attrs:{span:2}},[o("a-icon",{staticStyle:{color:"#007990"},attrs:{type:"check"}})],1):t._e(),0===t.origin.parentEmailStatus?o("a-col",{staticStyle:{"text-align":"center"},attrs:{span:6}},[o("a-button",{attrs:{type:"black",loading:t.loading},on:{click:t.resendParent}},[t._v("Resend")])],1):t._e()],1)],1),o("a-form-model-item",{attrs:{label:"Phone"}},[o("a-input",{attrs:{placeholder:"Phone"},model:{value:t.formModel.parentPhone,callback:function(e){t.$set(t.formModel,"parentPhone",e)},expression:"formModel.parentPhone"}})],1),t.studentId?t._e():o("a-form-model-item",{attrs:{wrapperCol:{offset:6}}},[o("a-button",{attrs:{disabled:t.hasErrors,loading:t.loading,type:"primary"},on:{click:function(e){return t.handleSave()}}},[t._v(t._s(t.studentId?"Update":"Create"))])],1)],1),o("a-modal",{attrs:{destroyOnClose:"",title:"Reset Password",width:"600px",footer:null},model:{value:t.passwordVis,callback:function(e){t.passwordVis=e},expression:"passwordVis"}},[o("a-space",{staticStyle:{"justify-content":"center",width:"100%"}},[o("label",{staticStyle:{"font-size":"20px",color:"#15c39a","font-weight":"bold"},attrs:{for:""}},[t._v(t._s(t.randomPass))]),o("a-icon",{staticStyle:{cursor:"pointer"},attrs:{type:"copy"},on:{click:t.onCopy}})],1)],1),o("avatar-modal",{ref:"avatarModal",on:{ok:t.setAvatar}})],1)},s=[],r=a("3835"),n=a("1da1"),i=a("5530"),c=(a("96cf"),a("159b"),a("4de4"),a("99af"),a("d81d"),a("caad"),a("2532"),a("d3b7"),a("3ca3"),a("ddb0"),a("b0c0"),a("a15b"),a("ac1f"),a("1276"),a("7db0"),a("ad59")),l=a("ec09"),d=a("9bfe"),u=a("8ee6"),m=a("f371"),f=a("8d90"),p=a("6d78"),h=a("0fac"),b=a("c1df"),g=a.n(b),v=a("ca00"),w=a("4fcf"),S=w.sortBy,y={name:"SchoolStudentAdd",components:{ResetPassword:m["a"],AvatarModal:f["a"]},mixins:[p["a"],h["a"]],props:{school:{type:Object,default:function(){}},id:{type:String,default:null},showClassLink:{type:Boolean,default:!1}},watch:{school:{handler:function(t){this.currentSchool=Object(i["a"])({},t),this.initData()},deep:!0,immediate:!0},id:{handler:function(t){this.studentId=t,this.initForm()},immediate:!0}},data:function(){var t;return{currentSchool:this.school,studentId:this.id,classList:[],classNameList:{},formModel:{firstName:"",lastName:"",birthDay:"",classes:"",classArr:[],subjectCls:[],inviteEmail:"",parentEmail:"",parentEmailStatus:0,parentFirstName:"",parentLastName:"",parentPhone:"",avatar:"",schoolId:(null===(t=this.school)||void 0===t?void 0:t.id)||""},formItemLayout:{labelCol:{span:6},wrapperCol:{span:12}},loading:!1,passwordVis:!1,origin:{},confirmLoading:!1,cacheKey:"SUBMIT_VALIDATE_SCHOOL_STUDENT_",autoSaveLocalKey:"FORM_SCHOOL_STUDENT_",needAutoSave:!this.id,needAutoSaveRemote:this.id,randomPass:"",classUnModify:!1,subjectOptions:[],curriculumOptions:[],gradeOptions:[]}},computed:{validatorRules:function(){return{firstName:[{required:!0,message:"Please Input First Name!"}],lastName:[{required:!0,message:"Please Input Last Name!"}],inviteEmail:[{validator:this.validateRemoteEmail,trigger:"blur"}],parentEmail:[{required:!0,message:"Please Input Email!",trigger:"change"},{type:"email",message:"Please Input Valid Email!",trigger:"blur"}],classes:[{required:!0,message:"Please Select a class!",trigger:"change"}]}},filterClassList:function(){var t=this;if(this.gradeOptions&&this.gradeOptions.length>0){var e=[];return this.gradeOptions.forEach((function(a){var o=t.classList.filter((function(t){return t.gradeId===a.gradeId}));e=e.concat(o.map((function(t){return Object(i["a"])(Object(i["a"])({},t),{},{curriculumName:a.curriculumName})})))})),e}return[]},classArrDetail:function(){var t=this,e=this.classList.filter((function(e){return t.formModel.classArr.includes(e.id)}));return S(e,"classType")}},methods:{initData:function(){var t=this;return Object(n["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:Promise.all([Object(c["g"])({schoolId:t.currentSchool.id,pageNo:1,pageSize:1e4}),Object(d["a"])({schoolId:t.currentSchool.id}),Object(u["a"])({schoolId:t.currentSchool.id})]).then((function(e){var a=Object(r["a"])(e,3),o=a[0],s=a[1],n=a[2];if(0===o.code){t.classNameList={},t.classList=o.result.records,o.result.records.map((function(e){var a=[e.name];t.classNameList[e.id]=a.join(" - ")})),t.$forceUpdate(),t.formModel.classes&&(t.classNameList[t.formModel.classes]||(t.formModel.classes="",t.formModel.classArr=[])),t.classUnModify=!1;var c=t.$route.query;c.classId&&t.classNameList[c.classId]&&(t.studentId||(t.formModel.classArr=[c.classId],t.formModel.classes=c.classId),t.classUnModify=!0,t.$emit("getCls",{id:c.classId,name:t.classNameList[c.classId]}))}if(s.success){var l=[];s.result.forEach((function(t){t.subjectList&&t.subjectList.length>0&&(l=l.concat(t.subjectList))}));var d=[];l.forEach((function(t){d.push({subjectId:t.subjectId,subjectName:t.subjectName}),d.push({subjectId:t.parentSubjectId,subjectName:t.parentSubjectName})})),t.subjectOptions=d}if(n.success&&n.result){var u=[];t.curriculumOptions=n.result,n.result.forEach((function(t){u=u.concat((t.gradeSettingInfo||[]).map((function(e){return Object(i["a"])(Object(i["a"])({},e),{},{curriculumId:t.curriculumId,curriculumName:t.curriculumName})})))})),t.gradeOptions=u}}));case 1:case"end":return e.stop()}}),e)})))()},initForm:function(t){var e=this;if(this.id)this.loading=!0,Object(l["n"])({schoolId:this.currentSchool.id,userId:this.id}).then((function(t){if(0===t.code&&(e.origin=Object(i["a"])({},t.result),e.formModel.id=t.result.id,e.formModel.firstName=t.result.firstname,e.formModel.lastName=t.result.lastname,e.formModel.birthDay=t.result.birthday,e.formModel.avatar=t.result.avatar,e.formModel.inviteEmail=t.result.inviteEmail,e.formModel.parentEmail=t.result.parentEmail,e.formModel.parentEmailStatus=t.result.parentEmailStatus||0,e.formModel.parentFirstName=t.result.parentFirstName,e.formModel.parentLastName=t.result.parentLastName,e.formModel.avatar=t.result.avatar,e.formModel.parentPhone=t.result.parentPhone,t.result.classes)){var a=t.result.classes.filter((function(t){return 0===t.classType})),o=t.result.classes.filter((function(t){return 1===t.classType}));e.formModel.classArr=a.map((function(t){return t.id})),e.formModel.classes=e.formModel.classArr.join(","),e.formModel.subjectCls=o.map((function(t){return t.id}))}})).finally((function(){e.loading=!1}));else{var a=this.getAutoLocalData();this.formModel=Object(i["a"])(Object(i["a"])(Object(i["a"])({},this.formModel),a),t),this.formModel.classes&&(this.formModel.classArr=this.formModel.classes.split(","))}this.$nextTick((function(){e.initValidate(!!e.id)}))},doValidate:function(t,e){this.fillValidate(t,e)},setAvatar:function(t){this.formModel.avatar=t},disabledDate:function(t){return t&&t>g()()},resendParent:function(){var t=this;this.formModel.parentEmail&&Object(v["isEmail"])(this.formModel.parentEmail)?(this.loading=!0,Object(l["x"])({parentEmail:this.formModel.parentEmail,schoolId:this.currentSchool.id,userId:this.studentId}).then((function(e){0===e.code&&t.$message.success("Send successfully")})).finally((function(){t.loading=!1}))):this.$message.error("Please input valid email")},validateRemoteEmail:function(t,e,a){return e?this.studentId&&e===this.origin.inviteEmail?a():void Object(l["j"])({emails:e,schoolId:this.currentSchool.id}).then((function(t){0===t.code&&t.result&&t.result[0].exists?a(new Error("already exists at this school")):a()})).catch((function(t){a(new Error(t.message))})):a()},validateRemoteParentEmail:function(t,e,a){return e?(this.formModel.firstName&&this.formModel.lastName||a(),this.studentId&&e===this.origin.parentEmail?a():void Object(l["i"])({"parentEmailInfos[0].firstName":this.formModel.firstName,"parentEmailInfos[0].lastName":this.formModel.lastName,"parentEmailInfos[0].parentEmail":e,userId:this.id,schoolId:this.currentSchool.id}).then((function(t){0===t.code&&t.result&&t.result[0].exists?a(new Error("This student already exists")):a()})).catch((function(t){a(new Error(t.message))}))):a()},doValidParentEmail:function(){this.formModel.firstName&&this.formModel.lastName&&this.formModel.parentEmail&&this.$refs.form.validateField("parentEmail")},handelGoClass:function(){this.$router.push("/manage/class")},doReset:function(t){return Object(l["w"])(Object(i["a"])(Object(i["a"])({},t),{},{schoolId:this.currentSchool.id,userId:this.studentId}))},handleClose:function(){this.passwordVis=!1},handleReset:function(){var t=this;this.randomPass=Object(v["randomString"])(6),Object(l["w"])({newPassword:this.randomPass,schoolId:this.currentSchool.id,userId:this.studentId}).then((function(e){0===e.code&&(t.passwordVis=!0)}))},handleSave:function(t){var e=this;this.$refs.form.validate((function(a){if(a){var o=Object(i["a"])({},e.formModel);e.validateRemoteParentEmail(null,o.parentEmail,(function(a){if(a&&a.message)e.$message.error(a.message);else{o.schoolId=e.currentSchool.id,o.birthDay&&(o.birthday=o.birthDay=g.a.utc(o.birthDay).format("YYYY-MM-DD HH:mm:ss")),o.classes=o.classes.split(",").concat(o.subjectCls).filter((function(t){return!!t})).join(",");var s=null;s=e.id?l["z"]:l["c"],e.loading=!0,s(o).then((function(a){0===a.code&&(e.$message.success("Save successfully"),e.clearLocalData(),e.origin=Object(i["a"])(Object(i["a"])({},o),{},{id:e.id}),t?t():e.$emit("save",a.result))})).finally((function(){e.loading=!1}))}}))}}))},onCopy:function(){var t=this;this.$copyText(this.randomPass).then((function(e){t.$message.success("Copy success!")})).catch((function(e){t.$message.error("Copy Failed")}))},formatName:function(t,e){var a=e.find((function(e){return e.id===t}));return a?a.name:""},closeCls:function(t){this.formModel.classArr=this.formModel.classArr.filter((function(e){return e!==t}))},showSelect:function(t){this.$refs.tagRender.previousElementSibling.click()},formatViewName:function(t){var e=this.subjectOptions.find((function(e){return e.subjectId===t}));return e?e.subjectName:"Untitle"}}},M=y,j=(a("a393"),a("0c7c")),O=Object(j["a"])(M,o,s,!1,null,"4750d4b9",null);e["a"]=O.exports},c564:function(t,e,a){},ec09:function(t,e,a){"use strict";a.d(e,"m",(function(){return i})),a.d(e,"c",(function(){return c})),a.d(e,"d",(function(){return l})),a.d(e,"t",(function(){return d})),a.d(e,"u",(function(){return u})),a.d(e,"l",(function(){return m})),a.d(e,"y",(function(){return f})),a.d(e,"A",(function(){return p})),a.d(e,"h",(function(){return h})),a.d(e,"g",(function(){return b})),a.d(e,"a",(function(){return g})),a.d(e,"e",(function(){return v})),a.d(e,"f",(function(){return w})),a.d(e,"n",(function(){return S})),a.d(e,"p",(function(){return y})),a.d(e,"i",(function(){return M})),a.d(e,"j",(function(){return j})),a.d(e,"k",(function(){return O})),a.d(e,"v",(function(){return C})),a.d(e,"r",(function(){return E})),a.d(e,"z",(function(){return I})),a.d(e,"x",(function(){return P})),a.d(e,"s",(function(){return k})),a.d(e,"w",(function(){return T})),a.d(e,"b",(function(){return L})),a.d(e,"o",(function(){return $})),a.d(e,"q",(function(){return _}));var o=a("b775"),s=a("ca00"),r="api2/school/user",n={getSchoolUsers:"/classcipe/".concat(r,"/getSchoolUsers"),addStudents:"/classcipe/".concat(r,"/addStudents"),addTeacher:"/classcipe/".concat(r,"/addTeacher"),removeStudents:"/classcipe/".concat(r,"/removeStudents"),removeTeachers:"/classcipe/".concat(r,"/removeTeachers"),updateTeacher:"/classcipe/".concat(r,"/updateTeacher"),getInvite:"/classcipe/".concat(r,"/getInvite"),updateInvite:"/classcipe/".concat(r,"/updateInvite"),bulkActTeacher:"/classcipe/".concat(r,"/teacher/bulkAct"),bulkActStudent:"/classcipe/".concat(r,"/student/bulkAct"),acceptInvite:"/classcipe/".concat(r,"/acceptInvite"),batchAddStudent:"/classcipe/".concat(r,"/batchAddStudent"),batchAddTeacher:"/classcipe/".concat(r,"/batchAddTeacher"),getStudentInfo:"/classcipe/".concat(r,"/getStudentInfo"),getTeacherInfo:"/classcipe/".concat(r,"/getTeacherInfo"),checkEmailParent:"/classcipe/".concat(r,"/parent/checkEmail"),resetPassword:"/classcipe/".concat(r,"/resetPassword"),checkEmailStudent:"/classcipe/".concat(r,"/student/checkEmail"),moveClassStudent:"/classcipe/".concat(r,"/student/moveClass"),sendParentEmail:"/classcipe/".concat(r,"/student/sendParentEmail"),checkEmailTeacher:"/classcipe/".concat(r,"/teacher/checkEmail"),updateStudent:"/classcipe/".concat(r,"/updateStudent"),addAdmin:"/classcipe/".concat(r,"/addAdmin"),removeAdmins:"/classcipe/".concat(r,"/removeAdmins"),resetUserPassword:"/classcipe/".concat(r,"/user/resetPassword"),addSchoolAdmin:"/classcipe/".concat(r,"/addSchoolAdmin"),getTeacherCount:"/classcipe/".concat(r,"/getTeacherCount"),listStudents:"/classcipe/".concat(r,"/list/students")};function i(t){return Object(o["d"])({url:n.getSchoolUsers,method:"get",params:t})}function c(t){return t=Object(s["trimParams"])(t),Object(o["d"])({url:n.addStudents,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function l(t){return t=Object(s["trimParams"])(t),Object(o["d"])({url:n.addTeacher,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function d(t){return Object(o["d"])({url:n.removeStudents,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function u(t){return Object(o["d"])({url:n.removeTeachers,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function m(t){return Object(o["d"])({url:n.getInvite,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function f(t){return t=Object(s["trimParams"])(t),Object(o["d"])({url:n.updateInvite,method:"post",data:t,params:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function p(t){return t=Object(s["trimParams"])(t),Object(o["d"])({url:n.updateTeacher,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function h(t){return Object(o["d"])({url:n.bulkActTeacher,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function b(t){return Object(o["d"])({url:n.bulkActStudent,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function g(t){return Object(o["d"])({url:n.acceptInvite,method:"post",data:t,params:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function v(t){return t=Object(s["trimParams"])(t),Object(o["d"])({url:n.batchAddStudent,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function w(t){return t=Object(s["trimParams"])(t),Object(o["d"])({url:n.batchAddTeacher,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function S(t){return Object(o["d"])({url:n.getStudentInfo,method:"get",params:t})}function y(t){return Object(o["d"])({url:n.getTeacherInfo,method:"get",params:t})}function M(t){return Object(o["d"])({url:n.checkEmailParent,method:"get",params:t})}function j(t){return Object(o["d"])({url:n.checkEmailStudent,method:"get",params:t})}function O(t){return Object(o["d"])({url:n.checkEmailTeacher,method:"get",params:t})}function C(t){return Object(o["d"])({url:n.resetPassword,method:"get",params:t})}function E(t){return Object(o["d"])({url:n.moveClassStudent,method:"get",params:t})}function I(t){return t=Object(s["trimParams"])(t),Object(o["d"])({url:n.updateStudent,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function P(t){return Object(o["d"])({url:n.sendParentEmail,method:"get",params:t})}function k(t){return Object(o["d"])({url:n.removeAdmins,method:"post",data:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function T(t){return Object(o["d"])({url:n.resetUserPassword,method:"get",params:t})}function L(t){return t=Object(s["trimParams"])(t),Object(o["d"])({url:n.addSchoolAdmin,method:"post",data:t,params:t,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function $(t){return Object(o["d"])({url:n.getTeacherCount,method:"get",params:t})}function _(t){return Object(o["d"])({url:n.listStudents,method:"get",params:t})}},f371:function(t,e,a){"use strict";var o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("a-form-model",t._b({ref:"form",attrs:{layout:"horizontal",model:t.formModel,rules:t.validatorRules}},"a-form-model",t.formItemLayout,!1),[t.needOld?a("a-form-model-item",{attrs:{label:"Old Password",prop:"password"}},[a("a-input-password",{attrs:{autocomplete:"off",required:!0,type:"password",placeholder:"input password"},model:{value:t.formModel.password,callback:function(e){t.$set(t.formModel,"password",e)},expression:"formModel.password"}})],1):t._e(),a("a-form-model-item",{attrs:{label:"New Password",prop:"newPassword"}},[a("a-input-password",{attrs:{autocomplete:"off",type:"password",placeholder:"input password"},model:{value:t.formModel.newPassword,callback:function(e){t.$set(t.formModel,"newPassword",e)},expression:"formModel.newPassword"}})],1),a("a-form-model-item",{attrs:{label:"Confirm Password",prop:"confirmPassword"}},[a("a-input-password",{attrs:{autocomplete:"off",type:"password",placeholder:"input password"},model:{value:t.formModel.confirmPassword,callback:function(e){t.$set(t.formModel,"confirmPassword",e)},expression:"formModel.confirmPassword"}})],1),a("a-form-model-item",{attrs:{wrapperCol:{offset:6,span:12},label:""}},[a("a-button",{attrs:{loading:t.loading,type:"primary"},on:{click:t.handleSave}},[t._v("update")])],1)],1)},s=[],r=(a("d3b7"),a("7ded")),n={name:"ResetPassword",props:{needOld:{type:Boolean,default:!0},saveFn:{type:Function,default:null}},data:function(){var t=this,e=/^(?=.*[a-zA-Z])(?=.*[0-9])[^]{8,}$/,a=function(t,e,a){if(!e)return a(new Error("Please input the password"));Object(r["b"])({password:e}).then((function(t){"Success"!==t.result?a(new Error("Incorrect password")):a()}))},o=function(a,o,s){""===o?s(new Error("Please input the password")):e.test(o)?(""!==t.formModel.confirmPassword&&t.$refs.form.validateField("confirmPassword"),s()):s(new Error("The password must be a combination of letters and numbers, and it must be 8 characters or more."))},s=function(e,a,o){""===a?o(new Error("Please input the password again")):a!==t.formModel.newPassword?o(new Error("Passwords did not match!")):o()};return{formModel:{password:"",newPassword:"",confirmPassword:""},formItemLayout:{labelCol:{span:6},wrapperCol:{span:18}},validatorRules:{password:[{required:!0,trigger:"change",message:"Please input the password"},{validator:a,trigger:"blur"}],newPassword:[{validator:o,trigger:"change"}],confirmPassword:[{validator:s,trigger:"change"}]},loading:!1}},methods:{handleSave:function(){var t=this;this.$refs.form.validate((function(e){e&&(t.loading=!0,t.saveFn?t.saveFn({newPassword:t.formModel.newPassword,oldPassword:t.formModel.password}).then((function(e){0===e.code&&t.$message.success("Update password successfully")})).finally((function(){t.loading=!1})):Object(r["a"])({newPassword:t.formModel.newPassword,oldPassword:t.formModel.password}).then((function(e){0===e.code&&t.$message.success("Update password successfully")})).finally((function(){t.loading=!1})))}))}}},i=n,c=a("0c7c"),l=Object(c["a"])(i,o,s,!1,null,"f6bcd576",null);e["a"]=l.exports}}]);