(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-61bbeb16"],{"13e5":function(t,e,o){},"79eb":function(t,e,o){"use strict";o.r(e);var r=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{staticClass:"my-full-form-wrapper",staticStyle:{height:"100%",width:"100%"},style:{"font-size":t.fontSize},attrs:{id:"formRoot"}},[r("fixed-form-header",{scopedSlots:t._u([{key:"header",fn:function(){return[r("form-header",{attrs:{title:"School Curriculum","show-share":!1,"show-collaborate":!1,"is-preview-mode":!0},on:{back:t.goBack},scopedSlots:t._u([{key:"back",fn:function(){return[r("img",{staticClass:"single-logo-img",attrs:{src:o("be50"),alt:"classcipe"},on:{click:function(e){return e.stopPropagation(),t.$router.push("/")}}})]},proxy:!0},{key:"left",fn:function(){return[r("a-space",{attrs:{size:5,align:"center"},on:{click:function(t){t.stopPropagation()}}},[r("label",{staticStyle:{cursor:"pointer"},on:{click:function(e){return t.$router.push("/account/info")}}},[t._v("Account Info")]),r("label",{attrs:{for:""}},[t._v(">")]),r("label",{staticStyle:{"font-weight":"normal"}},[t._v(t._s(t.userMode===t.USER_MODE.SELF?"":"School ")+"Curriculum")])])]},proxy:!0},{key:"right",fn:function(){},proxy:!0}])})]},proxy:!0}])}),r("iframe",{staticClass:"form-content",staticStyle:{flex:"1",width:"100%"},attrs:{src:"/v2/com/curriculum/"+(t.userMode===t.USER_MODE.SELF?"my":t.currentSchool.id),frameborder:"0"}})],1)},n=[],c=o("5530"),i=o("f93e"),u=o("b5ff8"),s=o("b5a9"),a=o("2f62"),l={name:"CuriculumListV2",components:{FixedFormHeader:u["a"],FormHeader:s["a"]},data:function(){return{fontSize:"16px",fixHtmlWidth:1e3,USER_MODE:i["U"]}},computed:Object(c["a"])({},Object(a["e"])({info:function(t){return t.user.info},currentSchool:function(t){return t.user.currentSchool},userMode:function(t){return t.app.userMode}})),created:function(){},methods:{goBack:function(){this.$router.go(-1)}}},f=l,p=(o("cc66"),o("0c7c")),d=Object(p["a"])(f,r,n,!1,null,"1e06c11e",null);e["default"]=d.exports},cc66:function(t,e,o){"use strict";o("13e5")}}]);