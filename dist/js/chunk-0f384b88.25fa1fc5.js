(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0f384b88"],{"0fac":function(e,t,n){"use strict";n.d(t,"a",(function(){return s}));var a=n("85b1"),r=n("ca00"),o=n("8ded"),i=n.n(o),s={data:function(){return{saving:!1,saveTime:null,asyncSaveLocalDataFn:null,asyncSaveDataFn:null,autoSaveLocalKey:"FORM_",needAutoSave:!1,needAutoSaveRemote:!1}},created:function(){this.asyncSaveLocalDataFn=Object(a["a"])(this.autoSaveLocalData,200),this.asyncSaveDataFn=Object(a["a"])(this.autoSaveData,1e3)},watch:{formModel:{deep:!0,handler:function(e,t){this.needAutoSave&&this.asyncSaveLocalDataFn(e),this.needAutoSaveRemote&&!this.loading&&this.asyncSaveDataFn(e)}}},computed:{lastChangeSavedTime:function(){var e=this.saveTime||this.formModel&&(this.formModel.updateTime||this.form.createTime);return e?Object(r["formatLocalUTC"])(e):""}},methods:{autoSaveLocalData:function(e){var t=this.$store.getters.userInfo.id,n=this.$store.state.user.currentSchool.id;i.a.set(this.autoSaveLocalKey+t+n,JSON.stringify(e)),this.saveTime=new Date},autoSaveData:function(e){var t=this;this.handleSave((function(){t.saveTime=new Date}))},getAutoLocalData:function(){var e=this.$store.getters.userInfo.id,t=this.$store.state.user.currentSchool.id,n=i.a.get(this.autoSaveLocalKey+e+t);return n?JSON.parse(n):{}},clearLocalData:function(){var e=this.$store.getters.userInfo.id,t=this.$store.state.user.currentSchool.id;i.a.remove(this.autoSaveLocalKey+e+t)}}}},"21fb":function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));n("b0c0");var a={data:function(){return{unwatch:null,routeName:this.$route.name}},created:function(){var e=this;this.unwatch=this.$store.watch((function(e){return e.user.currentSchool}),(function(t){return t&&e.$route.name===e.routeName&&e.handleSchoolChange(t)}))},computed:{},beforeDestroy:function(){this.unwatch&&this.unwatch()},methods:{handleSchoolChange:function(e){}}}},"2aa5":function(e,t,n){},"31d3":function(e,t,n){"use strict";n("2aa5")},"6a3c":function(e,t,n){},"6b84":function(e,t,n){"use strict";n("adda")},"6d78":function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));n("4de4"),n("07ac"),n("b64b");var a=n("8ded"),r=n.n(a),o={data:function(){return{validateFileds:{},refName:"form"}},computed:{hasErrors:function(){return Object.values(this.validateFileds).filter((function(e){return!e})).length>0}},methods:{initValidate:function(e){var t=this;!e&&this.validatorRules&&this.$refs[this.refName].validateField(Object.keys(this.validatorRules),(function(e){var n=t.$store.getters.userInfo.id,a=t.autoSaveLocalKey?r.a.get(t.autoSaveLocalKey+n):"";a||t.$refs[t.refName].clearValidate()}))},fillValidate:function(e,t){this.$set(this.validateFileds,e,t)}}}},"6e84":function(e,t,n){"use strict";n.d(t,"a",(function(){return a}));n("b0c0");var a={data:function(){return{unwatch:null,routeName:this.$route.name}},computed:{redirectUrl:function(){return"student"===this.$store.state.user.currentRole?"/student/main/my-task":"/account/info"}},created:function(){var e=this;this.unwatch=this.$store.watch((function(e){return e.app.userMode}),(function(t){t&&e.$route.name===e.routeName&&(e.handleModeChange(t),e.routeInMode())})),this.routeInMode()},beforeDestroy:function(){this.unwatch&&this.unwatch()},methods:{routeInMode:function(){this.$route.meta.mode&&this.$route.meta.mode!==this.$store.state.app.userMode&&this.$router.push({path:this.redirectUrl})},handleModeChange:function(e){}}}},"7af3":function(e,t,n){"use strict";n("d8d6")},"8d40":function(e,t,n){},a16a:function(e,t,n){"use strict";var a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("FullCalendar",{ref:"fullCalendar",staticClass:"schedule-calendar",attrs:{options:e.calendarOptions},scopedSlots:e._u([{key:"eventContent",fn:function(t){return[e._t("eventContent",(function(){return[e._v(e._s(t.event.title))]}),{info:t})]}}],null,!0)})},r=[],o=(n("5574"),n("f5ff")),i=n("3cdd"),s=n("3e32"),c=n("a20c"),l=n("c1df"),d=n.n(l),u={name:"CcCalendar",props:{eventsApi:{type:Function,default:function(e,t,n){return t([])},required:!0},slotDuration:{type:String,default:"00:15:00"},slotMinTime:{type:String,default:"00:00:00"},slotMaxTime:{type:String,default:"24:00:00"},scrollTime:{type:String,default:"06:00:00"},slotLabelInterval:{type:String,default:"01:00"},editable:{type:Boolean,default:!0},selectable:{type:Boolean,default:!0},headerToolbar:{type:[Object,Boolean],default:function(){return{left:"prev,next,today",center:"title",right:"dayGridMonth,timeGridWeek,timeGridDay"}}},selfViews:{type:Object,default:function(){}},initView:{type:String,default:"timeGridWeek"},selectAllow:{type:Function,default:function(){return!0}},dayHeaderContent:{type:Function,default:function(e){return e.text}},validRange:{type:Function,default:function(){}}},components:{FullCalendar:o["a"]},data:function(){return{loading:!1,calendarOptions:{plugins:[i["b"],c["a"],s["a"]],initialView:this.initView,headerToolbar:this.headerToolbar,views:this.selfViews,events:this.eventsApi,slotEventOverlap:!0,editable:this.editable,selectable:this.selectable,allDaySlot:!1,selectMirror:!0,dayMaxEvents:!0,nowIndicator:!0,weekends:!0,lazyFetching:!1,slotMinTime:this.slotMinTime,slotMaxTime:this.slotMaxTime,scrollTime:this.scrollTime,slotDuration:this.slotDuration,slotLabelInterval:this.slotLabelInterval,select:this.handleDateSelect,eventClick:this.handleEventClick,eventsSet:this.handleEvents,datesSet:this.handleDatesSet,eventMouseEnter:this.handleMouseEnter,eventMouseLeave:this.handleMouseLeave,eventDrop:this.handleEventDrop,eventResize:this.handleEventResize,dayHeaderContent:this.dayHeaderContent,eventTimeFormat:{hour:"2-digit",minute:"2-digit",hour12:!1,meridiem:!1},slotLabelFormat:function(e){return d()(e.date).format("HH:mm")},viewDidMount:this.handleViewDidMount,selectAllow:this.selectAllow,validRange:this.validRange}}},mounted:function(){var e=this;setTimeout((function(){e.reRender()}),100)},methods:{handleViewDidMount:function(){this.$nextTick((function(){var e=document.getElementsByClassName("fc-timegrid-now-indicator-line");if(e&&e.length>0){var t=document.getElementsByClassName("fc-timegrid-body")[0];t.insertBefore(e[0],t.firstChild)}}))},getApi:function(){return this.$refs.fullCalendar?this.$refs.fullCalendar.getApi():null},handleDateSelect:function(e){this.$emit("select",e)},handleEventClick:function(e){this.$emit("eventClick",e)},handleEvents:function(e){this.$emit("eventsSet",e)},handleDatesSet:function(e){this.$emit("datesSet",e)},handleMouseEnter:function(e){this.$emit("eventMouseEnter",e)},handleMouseLeave:function(e){this.$emit("eventMouseLeave",e)},handleEventDrop:function(e){this.$emit("eventDrop",e)},handleEventResize:function(e){this.$emit("eventResize",e)},reRender:function(){var e=this;this.$nextTick((function(){if(e.$refs.fullCalendar){var t=e.$refs.fullCalendar.getApi();t&&t.render()}}))},reFetch:function(){var e=this;this.$nextTick((function(){if(e.$refs.fullCalendar){var t=e.$refs.fullCalendar.getApi();t&&t.refetchEvents()}}))}}},f=u,m=(n("cc1a"),n("0c7c")),h=Object(m["a"])(f,a,r,!1,null,"9d6e228e",null);t["a"]=h.exports},adda:function(e,t,n){},cc1a:function(e,t,n){"use strict";n("6a3c")},d789:function(e,t,n){"use strict";n.r(t);var a=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"my-full-form-wrapper",attrs:{id:"formRoot"}},[a("fixed-form-header",{scopedSlots:e._u([{key:"header",fn:function(){return[a("form-header",{attrs:{title:e.title,"show-share":!1,"show-collaborate":!1,"is-preview-mode":!0},on:{back:e.goBack},scopedSlots:e._u([{key:"back",fn:function(){return[a("img",{staticClass:"single-logo-img",attrs:{src:n("be50"),alt:"classcipe"},on:{click:function(t){return t.stopPropagation(),e.$router.push("/")}}})]},proxy:!0},{key:"left",fn:function(){return[a("a-space",{attrs:{size:5,align:"center"},on:{click:function(e){e.stopPropagation()}}},[a("label",{staticStyle:{cursor:"pointer"},on:{click:function(t){return e.$router.push("/account/info")}}},[e._v("Account Info")]),a("label",{attrs:{for:""}},[e._v(">")]),a("label",{staticStyle:{cursor:"pointer"},on:{click:function(t){return e.$router.push("/manage/class/list?tab=subject")}}},[e._v(e._s(e.userMode===e.USER_MODE.SELF?"Personal":"School")+" Class")]),a("label",{attrs:{for:""}},[e._v(">")]),a("label",{staticStyle:{"font-weight":"normal"}},[e._v(e._s(e.title))])])]},proxy:!0},{key:"right",fn:function(){},proxy:!0}])})]},proxy:!0}])}),a("div",{staticClass:"form-content"},[a("class-subject-add",{ref:"classSubjectAdd",attrs:{school:e.currentSchool,id:e.id},on:{save:e.handleSave}})],1)],1)},r=[],o=n("5530"),i=n("f93e"),s=n("6e84"),c=n("21fb"),l=n("b5ff8"),d=n("b5a9"),u=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("a-spin",{attrs:{spinning:e.loading}},[n("div",{staticClass:"subject-content"},[n("div",{staticClass:"content-left"},[n("a-form-model",e._b({ref:"form",attrs:{layout:"horizontal",model:e.formModel,rules:e.validatorRules},on:{validate:e.doValidate}},"a-form-model",e.formItemLayout,!1),[n("a-form-model-item",{attrs:{label:"Class Name",prop:"name"}},[n("a-input",{attrs:{placeholder:"input class name"},model:{value:e.formModel.name,callback:function(t){e.$set(e.formModel,"name",t)},expression:"formModel.name"}})],1),n("a-form-model-item",{attrs:{label:"Subject",prop:"subject"}},[n("a-select",{attrs:{getPopupContainer:function(e){return e.parentElement},placeholder:"Please select subject"},on:{change:e.changeSubject},model:{value:e.formModel.subject,callback:function(t){e.$set(e.formModel,"subject",t)},expression:"formModel.subject"}},e._l(e.subjectOptions.filter((function(t){return!e.curriculumId||t.curriculumId===e.curriculumId})),(function(t){return n("a-select-option",{key:t.subjectId},[e._v(" "+e._s(e.curriculumMap[e.curriculumOptions[t.curriculumId]]||e.curriculumOptions[t.curriculumId])+" - "+e._s(t.subjectName)+" ")])})),1)],1),n("a-form-model-item",{attrs:{labelCol:{span:12},wrapperCol:{span:12},label:"Student-self registration"}},[n("a-switch",{on:{change:e.changeOwnJoin},model:{value:e.formModel.ownJoin,callback:function(t){e.$set(e.formModel,"ownJoin",t)},expression:"formModel.ownJoin"}})],1),e.formModel.ownJoin?[n("a-form-model-item",{attrs:{label:"Grade"}},[n("a-select",{attrs:{getPopupContainer:function(e){return e.parentElement},placeholder:"Please select grade"},model:{value:e.formModel.gradeId,callback:function(t){e.$set(e.formModel,"gradeId",t)},expression:"formModel.gradeId"}},e._l(e.gradeOptions,(function(t){return n("a-select-option",{key:t.gradeId},[e._v(" "+e._s(t.gradeName)+" ")])})),1)],1),n("a-form-model-item",{attrs:{label:"Max Std",prop:"maxStudent"}},[n("a-input",{attrs:{placeholder:"input max student count"},model:{value:e.formModel.maxStudent,callback:function(t){e.$set(e.formModel,"maxStudent",t)},expression:"formModel.maxStudent"}})],1)]:e._e(),e.formQuery&&e.formModel.term?n("a-form-model-item",{attrs:{label:"Term"}},[n("div",{staticClass:"fix-term"},[e._v(e._s(e.formModel.termTime&&e.formModel.termTime.join(" ~ ")))])]):n("a-form-model-item",{attrs:{label:"Term",prop:"termArr",extra:e.formModel.termTime&&e.formModel.termTime.join(" ~ ")}},[n("a-space",[n("a-cascader",{attrs:{options:e.termsOptions,"allow-clear":!1,placeholder:"Please select term"},on:{change:e.onChangeTerm},model:{value:e.formModel.termArr,callback:function(t){e.$set(e.formModel,"termArr",t)},expression:"formModel.termArr"}})],1)],1),n("a-form-model-item",{attrs:{label:"",wrapperCol:{offset:6,span:18}}},[n("a-space",[n("a-button",{on:{click:e.goTerm}},[e._v("Set Blocks")]),n("a-button",{attrs:{loading:e.loading,type:"primary",disabled:e.hasErrors||e.formModel.ownJoin&&!e.formModel.blockSetting},on:{click:e.handleSave}},[e._v("Done")])],1)],1)],2)],1),n("div",{staticClass:"content-right"},[n("a-row",{staticClass:"calendar-con",attrs:{gutter:16}},[n("term-calendar",{attrs:{termId:e.formModel.term,choose:e.origin.blockSetting},on:{"date-select":e.handleSelectBlock}}),e.formModel.ownJoin&&!e.formModel.blockSetting?n("div",{staticClass:"error_field"},[e._v("Please Select Block")]):e._e()],1)],1)])])},f=[],m=n("3835"),h=(n("d3b7"),n("3ca3"),n("ddb0"),n("159b"),n("99af"),n("d81d"),n("b0c0"),n("7db0"),n("a9e3"),n("fb6a"),n("9bfe")),v=n("8ee6"),p=n("e806"),b=n("ad59"),g=n("20ae"),S=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticStyle:{width:"100%"}},[n("a-spin",{attrs:{spinning:e.loading}},[n("div",{ref:"scheduleContent",staticClass:"schedule-content",attrs:{id:"scheduleContent"}},[n("cc-calendar",{ref:"fullCalendar",staticClass:"schedule-calendar",attrs:{eventsApi:e.loadEvents,headerToolbar:e.headerToolbar,selfViews:e.selfViews,initView:e.initView,editable:!0,selectable:!0,dayHeaderContent:e.dayHeaderContent},on:{select:e.handleDateSelect,eventClick:e.handleEventClick,eventsSet:e.handleEvents,datesSet:e.handleDatesSet,eventMouseEnter:e.handleMouseEnter,eventMouseLeave:e.handleMouseLeave},scopedSlots:e._u([{key:"eventContent",fn:function(t){var a=t.info;return[n("div",{staticClass:"schedule-event-content",style:{backgroundColor:a.event.extendedProps.backgroundColor,color:"#333",minHeight:"20px",lineHeight:1},attrs:{"data-id":a.event.extendedProps.val}},[n("div",[e._v(" "+e._s(e.moment(a.event.start).format(e.FORMATTER_SIM))+"-"+e._s(e.moment(a.event.end).format(e.FORMATTER_SIM))+" ")])])]}}])})],1)])],1)},M=[],C=n("1da1"),y=(n("ac1f"),n("5319"),n("4de4"),n("1276"),n("a15b"),n("96cf"),n("a16a")),D=n("2f62"),T=n("c1df"),k=n.n(T),j=n("85b1"),Y={name:"TermCalendar",mixins:[s["a"],c["a"]],props:{termId:{type:String,default:""},choose:{type:String,default:""}},watch:{termId:function(e){this.id=e,this.debounceRefetch()}},components:{CcCalendar:y["a"]},data:function(){return{BG_COLORS:i["c"],moment:k.a,FORMATTER_SIM:"h:mma",id:this.termId,loading:!1,startDate:"",endDate:"",minDate:"06:00:00",viewType:"timeGridWeek",initView:"timeGridWeek",calendarDatas:[],allEvents:[],currentEvents:[],blockEvents:[],event:{title:"My Event"},headerToolbar:{left:"",center:"",right:""},dayHeaderContent:function(e){var t=k()(e.date).format("dddd");return t},selfViews:{timeGridFourDay:{type:"timeGrid",dayCount:4,duration:{days:4},buttonText:"4 Days",allDaySlot:!1,selectable:!1,editable:!1,nowIndicator:!1}}}},computed:Object(o["a"])({},Object(D["e"])({currentSchool:function(e){return e.user.currentSchool}})),created:function(){this.debounceLoad=Object(j["a"])(this.loadData,300),this.debounceRefetch=Object(j["a"])(this.reFetch,300),this.initData()},mounted:function(){var e=this;setTimeout((function(){e.reRender()}),100)},methods:{initData:function(){},loadData:function(e){return Object(C["a"])(regeneratorRuntime.mark((function t(){var n;return regeneratorRuntime.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,Object(p["h"])(e);case 2:return n=t.sent,t.abrupt("return",n);case 4:case"end":return t.stop()}}),t)})))()},loadEvents:function(e,t,n){var a=this,r=k()(e.start).format("YYYY-MM-DD"),o=k()(e.end).format("YYYY-MM-DD");if(this.startDate=r,this.endDate=o,this.$refs.fullCalendar){var s=this.$refs.fullCalendar.getApi();s&&s.removeAllEvents()}this.loading=!0,this.loadData({termId:this.id,schoolId:this.currentSchool.id}).then((function(r){if(r&&r.success&&r.result){var o={blockSettings:[]};r.result.forEach((function(e){if(e.terms&&e.terms.length>0){var t=e.terms.find((function(e){return e.id===a.id}));t&&(o=t.block)}})),a.calendarDatas=r.result,o&&o.blockSettings&&o.blockSettings.length>0?function(){var n=0,s=a.minDate;o.blockSettings.forEach((function(e,t){var a=parseInt(e.start.replace(":",""));(a<n||0===t)&&(n=a,s=e.start)})),a.minDate=k()("2000-01-01 "+s+":00").format("HH:mm");var c=[],l=k()(e.start).subtract(1,"day");while(k()(e.end).isAfter(l))c=c.concat(o.blockSettings.map((function(e,t){return{start:k()(l).format("YYYY-MM-DD")+" "+e.start+":00",end:k()(l).format("YYYY-MM-DD")+" "+e.end+":00",name:e.name,color:i["c"][t],display:"background",backgroundColor:i["c"][t],editable:!1,extendedProps:{backgroundColor:i["c"][t],val:e.start+" - "+e.end}}}))),l=l.add(1,"days");a.blockEvents=c.concat(),a.calendarDatas=r.result,a.allEvents=c;var d=c.filter((function(e){return!0}));t(d)}():(a.minDate="06:00:00",a.calendarDatas=[],a.allEvents=[],a.blockEvents=[],t([])),a.handleViewDidMount(),a.handleScrollTime(),a.initChoose()}else n()})).catch((function(){n()})).finally((function(){a.loading=!1}))},initChoose:function(){var e=this;if(this.$refs.fullCalendar){var t=this.$refs.fullCalendar.getApi(),n=function(t){var n=k()(e.startDate),a="";while(k()(e.endDate).isAfter(n)&&!a)t===k()(n).format("dddd")&&(a=n.format("YYYY-MM-DD")),n=n.add(1,"days");return a};if(this.choose){var a=this.choose.split(",").map((function(e){var t=e.split("~");if(2===t.length){var a=k()(t[0]),r=a.format("HH:mm:ss"),o=n(a.format("dddd")),i=k()(t[1]),s=i.format("HH:mm:ss"),c=n(i.format("dddd"));return"".concat(o," ").concat(r,"~").concat(c," ").concat(s)}return""})).filter((function(e){return!!e})),r=0===this.blockEvents.length;a.forEach((function(e){var n=e.split("~");t.addEvent({title:"DateSelect",start:n[0],end:n[1],backgroundColor:"transparent",borderColor:"transparent",editable:r,extendedProps:{eventType:"selectDate",backgroundColor:"#3688d8",val:k()(n[0]).format("YYYY-MM-DD HH:mm:ss")+"~"+k()(n[1]).format("YYYY-MM-DD HH:mm:ss")}})}))}}},handleSchoolChange:function(e){var t=this;this.initData(),setTimeout((function(){t.reFetch()}),100)},handleViewDidMount:function(){this.$nextTick((function(){var e=document.getElementsByClassName("fc-timegrid-now-indicator-line");if(e&&e.length>0){var t=document.getElementsByClassName("fc-timegrid-body")[0];t.insertBefore(e[0],t.firstChild)}}))},handleScrollTime:function(){var e=this;this.$nextTick((function(){if(e.$refs.fullCalendar){var t=e.$refs.fullCalendar.getApi();t&&t.scrollToTime(e.minDate)}}))},handleDateSelect:function(e){var t=k()(e.start).format("YYYY-MM-DD HH:mm:ss"),n=k()(e.end).format("YYYY-MM-DD HH:mm:ss"),a=!0;if(0===this.blockEvents.length)a=!0;else{var r=this.blockEvents.find((function(t){if(k()(t.start).date()===k()(e.start).date())if(k()(t.start).isSameOrBefore(k()(e.start))){if(k()(t.end).isSameOrAfter(k()(e.start)))return!0}else if(k()(t.start).isSameOrBefore(k()(e.end)))return!0;return!1}));r?(t=k()(r.start).format("YYYY-MM-DD HH:mm:ss"),n=k()(r.end).format("YYYY-MM-DD HH:mm:ss"),a=!0):a=!1}if(this.$refs.fullCalendar){var o=this.$refs.fullCalendar.getApi(),i=k()(t),s=k()(n),c={title:"DateSelect",start:t,end:n,backgroundColor:"transparent",borderColor:"transparent",editable:0===this.blockEvents.length,extendedProps:{eventType:"selectDate",backgroundColor:"#3688d8",val:i.format("YYYY-MM-DD HH:mm:ss")+"~"+s.format("YYYY-MM-DD HH:mm:ss")}};if(a){var l=this.currentEvents.filter((function(e){return"background"!==e.display})).find((function(e){return k()(e.start).isSame(k()(c.start))&&k()(e.end).isSame(k()(c.end))}));!l&&o.addEvent(c)}o.unselect()}},handleEventClick:function(e){"background"!==e.event.display&&e.event.remove()},handleEvents:function(e){this.currentEvents=e;var t=e.filter((function(e){return"background"!==e.display})).map((function(e){return e.extendedProps.val})).join(",");this.$emit("date-select",t)},handleDatesSet:function(e){this.startDate=k()(e.start).format("YYYY-MM-DD"),this.endDate=k()(e.end).format("YYYY-MM-DD"),this.viewType=e.view.type},handleMouseEnter:function(e){},handleMouseLeave:function(e){},reRender:function(){var e=this;this.$nextTick((function(){if(e.$refs.fullCalendar){var t=e.$refs.fullCalendar.getApi();t&&t.render()}}))},reFetch:function(){var e=this;this.$nextTick((function(){if(e.$refs.fullCalendar){var t=e.$refs.fullCalendar.getApi();t&&t.refetchEvents()}}))}}},O=Y,w=(n("db0b"),n("6b84"),n("0c7c")),$=Object(w["a"])(O,S,M,!1,null,"e13a0f9a",null),E=$.exports,I=n("6d78"),x=n("0fac"),_=n("cd3f"),L=n.n(_),A=n("944d"),F={name:"ClassSubjectAdd",components:{CustomTextButton:g["a"],TermCalendar:E},mixins:[I["a"],x["a"],s["a"],c["a"]],props:{id:{type:String,default:""}},watch:{id:{handler:function(e){this.formModel.id=e,this.initForm()}}},data:function(){return{gradeOptions:[],subjectOptions:[],termsOptions:[],blockOptions:{},curriculumOptions:{},curriculumMap:{"Cambridge Primary & Lower Secondary":"Cambridge P & LS"},queryParam:{searchKey:""},origin:{blockSetting:""},formModel:{id:this.id,name:"",subject:"",subjectName:"",ownJoin:!1,gradeId:"",maxStudent:200,studentCount:0,teacherCount:0,term:"",termArr:[],termTime:[],blockSetting:"",classType:1,schoolId:""},formItemLayout:{labelCol:{span:6},wrapperCol:{span:18}},loading:!1,autoSaveLocalKey:"FORM_CLASS_SUBJECT_",needAutoSave:!this.id,formQuery:!1,curriculumId:""}},computed:Object(o["a"])(Object(o["a"])({},Object(D["e"])({info:function(e){return e.user.info},userMode:function(e){return e.app.userMode},currentSchool:function(e){return e.user.currentSchool}})),{},{validatorRules:function(){return{name:[{required:!0,message:"Please Input Class Name!"}],subject:[{required:!0,message:"Please Select Subject!"}],termArr:[{required:this.formModel.ownJoin,type:"array",message:"Please Select Term!"}],maxStudent:[{required:this.formModel.ownJoin,message:"Please Input Student Number!"}],blockSetting:[{required:this.formModel.ownJoin,message:"Please Select Block!"}]}}}),created:function(){this.initValue=L()(this.formModel),this.initData()},methods:{handleSchoolChange:function(e){this.userMode===i["Y"].SCHOOL&&this.initData()},handleModeChange:function(e){this.initData()},initData:function(){var e=this;this.loading=!0,Promise.all([Object(h["a"])({schoolId:this.currentSchool.id}),Object(v["a"])({schoolId:this.currentSchool.id}),Object(p["h"])({schoolId:this.currentSchool.id})]).then((function(t){var n=Object(m["a"])(t,3),a=n[0],r=n[1],i=n[2];if(a.success){var s=[];a.result.forEach((function(e){e.subjectList&&e.subjectList.length>0&&(s=s.concat(e.subjectList.map((function(t){return Object(o["a"])(Object(o["a"])({},t),{},{curriculumId:e.curriculumId})}))))})),e.subjectOptions=Object(A["a"])(s.map((function(e){return{subjectId:e.parentSubjectId,subjectName:e.parentSubjectName,curriculumId:e.curriculumId}})),"subjectId")}if(i.success&&(e.termsOptions=i.result.map((function(t){return{value:t.id,label:t.name,startTime:t.startTime,endTime:t.endTime,children:t.terms.map((function(t){return e.blockOptions[t.id]=t.block.blockSettings||[],{value:t.id,label:t.name,startTime:t.startTime,endTime:t.endTime}}))}}))),r.success){var c=[];r.result.forEach((function(t){c=c.concat(t.gradeSettingInfo||[]),e.curriculumOptions[t.curriculumId]=t.curriculumName})),e.gradeOptions=c}})).finally((function(){e.loading=!1,e.initForm()}))},initForm:function(e){var t=this;if(this.formModel.id)this.loading=!0,Object(b["e"])({classId:this.formModel.id}).then((function(e){0===e.code&&t.doCreate(e.result)})).finally((function(){t.loading=!1}));else{var n=this.getAutoLocalData(),a=this.$route.query;a.termId?(n.term=a.termId,this.formQuery=!0):this.formQuery=!1,a.curriculumId&&(this.curriculumId=a.curriculumId),this.doCreate(n)}},initSels:function(){var e=this;if(this.formModel.term){var t=[];this.termsOptions.forEach((function(n){if(n.children&&n.children.length>0){var a=n.children.find((function(t){return t.value===e.formModel.term}));a&&(t=[n.value,a.value],e.formModel.termTime=[k()(a.startTime).format("DD/MM/YYYY"),k()(a.endTime).format("DD/MM/YYYY")])}})),0===t.length&&(this.formModel.term=""),this.formModel.termArr=t}},doCreate:function(e){var t=this;this.doEdit(Object(o["a"])({},e)),this.$nextTick((function(){t.initValidate(!!t.id)}))},doValidate:function(e,t){this.fillValidate(e,t)},doEdit:function(e){this.formModel=L()(Object(o["a"])(Object(o["a"])(Object(o["a"])({},this.initValue),e),{},{ownJoin:Boolean(e.ownJoin)})),this.origin=L()(this.formModel),this.initSels()},handleSave:function(){var e=this;this.$refs.form.validate((function(t){if(t){var n=Object(o["a"])({},e.formModel);n.schoolId=e.currentSchool.id,n.ownJoin=Number(n.ownJoin),n.classType=1,e.loading=!0,e.userMode===i["Y"].SELF?(n.userId=e.info.id,n.classMode=2):n.classMode=1,Object(b["k"])(n).then((function(t){t.success&&0===t.code&&(e.$store.dispatch("GetInfo"),e.$message.success("Save successfully"),e.$emit("save",n),e.clearLocalData())})).finally((function(){e.loading=!1}))}}))},changeOwnJoin:function(){var e=this;this.$nextTick((function(){e.initValidate(!!e.id)}))},changeSubject:function(e){var t=this.subjectOptions.find((function(t){return t.subjectId===e}));this.formModel.subjectName=t.subjectName},onChangeTerm:function(e){if(this.formModel.termTime=[],e&&e.length>0){this.formModel.term=e.slice(e.length-1)[0];var t=this.termsOptions.find((function(t){return t.value===e[0]})),n=t.children.find((function(t){return t.value===e[1]}));n&&(this.formModel.termTime=[k()(n.startTime).format("DD/MM/YYYY"),k()(n.endTime).format("DD/MM/YYYY")])}else this.formModel.term="";this.$refs.form.validateField(["termArr"])},handleSelectBlock:function(e){this.formModel.blockSetting=e,this.$refs.form.validateField(["blockSetting"])},goTerm:function(){this.$router.push("/manage/academic")}}},H=F,R=(n("7af3"),Object(w["a"])(H,u,f,!1,null,"4bcdf84e",null)),B=R.exports,N=n("4fcf"),P=N.debounce,V={name:"ClassSubjectEdit",mixins:[s["a"],c["a"]],components:{FixedFormHeader:l["a"],FormHeader:d["a"],ClassSubjectAdd:B},props:{id:{type:String,default:null}},data:function(){return{USER_MODE:i["Y"],SCHOOL_USER_STATUS:i["A"]}},created:function(){this.debounceLoad=P(this.loadData,300)},computed:Object(o["a"])(Object(o["a"])({},Object(D["e"])({userMode:function(e){return e.app.userMode},currentSchool:function(e){return e.user.currentSchool}})),{},{title:function(){return this.id?"Edit":"Add"}}),methods:{goBack:function(){this.$router.go(-1)},handleSchoolChange:function(e){this.userMode===i["Y"].SCHOOL&&(this.queryParam.schoolId=e.id,this.initDict(),this.debounceInit())},handleModeChange:function(e){this.debounceInit()},loadData:function(){},handleSave:function(e){this.$router.push("/manage/class/list?tab=subject")}}},J=V,U=(n("31d3"),Object(w["a"])(J,a,r,!1,null,"7a0dcb18",null));t["default"]=U.exports},d8d6:function(e,t,n){},db0b:function(e,t,n){"use strict";n("8d40")},e806:function(e,t,n){"use strict";n.d(t,"a",(function(){return i})),n.d(t,"c",(function(){return s})),n.d(t,"d",(function(){return c})),n.d(t,"b",(function(){return l})),n.d(t,"e",(function(){return d})),n.d(t,"f",(function(){return u})),n.d(t,"g",(function(){return f})),n.d(t,"h",(function(){return m}));var a=n("b775"),r="academic/academicTermInfo",o={addTerm:"/classcipe/".concat(r,"/addTerm"),addYear:"/classcipe/".concat(r,"/addYear"),deleteTerm:"/classcipe/".concat(r,"/deleteTerm"),deleteYear:"/classcipe/".concat(r,"/deleteYear"),editTerm:"/classcipe/".concat(r,"/editTerm"),editYear:"/classcipe/".concat(r,"/editYear"),saveBlockSetting:"/classcipe/".concat(r,"/saveBlockSetting"),termList:"/classcipe/".concat(r,"/termList")};function i(e){return Object(a["d"])({url:o.addTerm,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function s(e){return Object(a["d"])({url:o.deleteTerm,method:"delete",params:e})}function c(e){return Object(a["d"])({url:o.deleteYear,method:"delete",params:e})}function l(e){return Object(a["d"])({url:o.addYear,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function d(e){return Object(a["d"])({url:o.editTerm,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function u(e){return Object(a["d"])({url:o.editYear,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function f(e){return Object(a["d"])({url:o.saveBlockSetting,method:"post",data:e,headers:{"Content-Type":"application/json;charset=UTF-8"}})}function m(e){return Object(a["d"])({url:o.termList,method:"get",params:e})}}}]);