(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-ae4024f8"],{"21fb":function(t,e,n){"use strict";n.d(e,"a",(function(){return o}));n("b0c0");var o={data:function(){return{unwatch:null,routeName:this.$route.name}},created:function(){var t=this;this.unwatch=this.$store.watch((function(t){return t.user.currentSchool}),(function(e){return e&&t.$route.name===t.routeName&&t.handleSchoolChange(e)}))},computed:{},beforeDestroy:function(){this.unwatch&&this.unwatch()},methods:{handleSchoolChange:function(t){}}}},"6e84":function(t,e,n){"use strict";n.d(e,"a",(function(){return o}));n("b0c0");var o={data:function(){return{unwatch:null,routeName:this.$route.name}},computed:{redirectUrl:function(){return"student"===this.$store.state.user.currentRole?"/student/main/my-task":"/account/info"}},created:function(){var t=this;this.unwatch=this.$store.watch((function(t){return t.app.userMode}),(function(e){e&&t.$route.name===t.routeName&&(t.handleModeChange(e),t.routeInMode())})),this.routeInMode()},beforeDestroy:function(){this.unwatch&&this.unwatch()},methods:{routeInMode:function(){this.$route.meta.mode&&this.$route.meta.mode!==this.$store.state.app.userMode&&this.$router.push({path:this.redirectUrl})},handleModeChange:function(t){}}}},7817:function(t,e,n){"use strict";n.r(e);var o=function(){var t=this,e=t.$createElement,o=t._self._c||e;return o("div",{staticClass:"my-full-form-wrapper",attrs:{id:"formRoot"}},[o("fixed-form-header",{scopedSlots:t._u([{key:"header",fn:function(){return[o("form-header",{attrs:{title:"Tags Setting","show-share":!1,"show-collaborate":!1,"is-preview-mode":!0},on:{back:t.goBack},scopedSlots:t._u([{key:"back",fn:function(){return[o("img",{staticClass:"single-logo-img",attrs:{src:n("be50"),alt:"classcipe"},on:{click:function(e){return e.stopPropagation(),t.$router.push("/")}}})]},proxy:!0},{key:"left",fn:function(){return[o("a-space",{attrs:{size:5,align:"center"},on:{click:function(t){t.stopPropagation()}}},[o("label",{staticStyle:{cursor:"pointer"},on:{click:function(e){return t.$router.push("/account/info")}}},[t._v("Account Info")]),o("label",{attrs:{for:""}},[t._v(">")]),o("label",{staticStyle:{"font-weight":"normal"}},[t._v("Tags Setting")])])]},proxy:!0},{key:"right",fn:function(){},proxy:!0}])})]},proxy:!0}])}),o("div",{staticClass:"form-content"},[o("a-spin",{attrs:{spinning:t.loading}}),t.iframeSrc?o("iframe",{staticClass:"preview-iframe",attrs:{src:t.iframeSrc,id:"tags-iframe"}}):t._e()],1)],1)},r=[],s=n("5530"),a=(n("d81d"),n("caad"),n("2532"),n("6e84")),i=n("21fb"),c=n("b5ff8"),u=n("b5a9"),h=n("2f62"),l=n("f93e"),f={name:"TagsSetting",components:{FixedFormHeader:c["a"],FormHeader:u["a"]},mixins:[a["a"],i["a"]],data:function(){return{baseUrl:null,loading:!1}},created:function(){var t=this,e=window.location.host;e.indexOf("local")>-1||-1!==e.indexOf("dev.classcipe.com")?this.baseUrl="https://dev.classcipe.com":-1!==e.indexOf("my.classcipe.com")?this.baseUrl="https://my.classcipe.com":this.$logger.warn("TagsSetting: unknown host",e),this.loading=!0,setTimeout((function(){t.loading=!1}),1e3)},computed:Object(s["a"])(Object(s["a"])({},Object(h["e"])({user:function(t){return t.user},currentSchool:function(t){return t.user.currentSchool},userMode:function(t){return t.app.userMode}})),{},{iframeSrc:function(){if(this.baseUrl){if(this.userMode===l["X"].SELF)return this.baseUrl+"/v2/com/tags?token="+this.user.token;var t=this.currentSchool.roleNames.map((function(t){return t.toLowerCase()}));return t.includes("admin")?this.baseUrl+"/v2/com/tags/"+this.currentSchool.id+"?token="+this.user.token:this.baseUrl+"/v2/com/tags/school/"+this.currentSchool.id+"?token="+this.user.token}return null}}),methods:{goBack:function(){this.$router.go(-1)}}},d=f,m=(n("f691"),n("0c7c")),p=Object(m["a"])(d,o,r,!1,null,"6dc6899a",null);e["default"]=p.exports},9360:function(t,e,n){},f691:function(t,e,n){"use strict";n("9360")}}]);