(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5b3ef7b1"],{"0381":function(t,i,l){"use strict";var a=function(){var t=this,i=t.$createElement,l=t._self._c||i;return l("div",{class:{"disabled-button":t.disabled,"cc-custom-button":!t.disabled},style:{"background-color":t.bgColor,color:t.color},on:{click:t.handleClick,dblclick:t.handleDbClick}},[t.disabled&&t.disabledTooltip?[l("a-tooltip",{attrs:{title:t.disabledTooltip}},[t.loading?l("div",{staticClass:"loading vertical-center"},[l("a-spin",[l("a-icon",{staticStyle:{"font-size":"14px",color:"#666666"},attrs:{slot:"indicator",type:"loading",spin:""},slot:"indicator"})],1)],1):t._e(),l("div",{staticClass:"icon"},[t._t("icon")],2),l("div",{staticClass:"label"},[t._v(" "+t._s(t.label)+" ")])])]:[t.loading?l("div",{staticClass:"loading vertical-center"},[l("a-spin",[l("a-icon",{staticStyle:{"font-size":"14px",color:"#666666"},attrs:{slot:"indicator",type:"loading",spin:""},slot:"indicator"})],1)],1):t._e(),l("div",{staticClass:"icon"},[t._t("icon")],2),l("div",{staticClass:"label"},[t._v(" "+t._s(t.label)+" ")])]],2)},o=[],e={name:"CustomButton",props:{label:{type:String,default:""},bgColor:{type:String,default:"#EEF1F3"},color:{type:String,default:"#16274A"},loading:{type:Boolean,default:!1},disabled:{type:Boolean,default:!1},disabledTooltip:{type:String,default:""}},methods:{handleClick:function(){this.disabled||this.$emit("click")},handleDbClick:function(){this.disabled||this.$emit("dblclick")}}},s=e,n=(l("8a17"),l("0c7c")),c=Object(n["a"])(s,a,o,!1,null,"35841a14",null);i["a"]=c.exports},5813:function(t,i,l){},"8a17":function(t,i,l){"use strict";l("5813")}}]);