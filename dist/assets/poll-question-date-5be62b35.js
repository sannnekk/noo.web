import{d as p,c as r,a as u,j as m,k as c,J as _}from"./index-85a2f4f2.js";const i={class:"poll-question-date"},f=p({__name:"poll-question-date",props:{question:{},answer:{},readonly:{type:Boolean}},emits:["update:answer"],setup(t,{emit:n}){const s=t,o=r({get:()=>s.answer,set:e=>n("update:answer",e)});return(e,a)=>{const l=_;return u(),m("div",i,[c(l,{label:"Выберите дату",type:"date",modelValue:o.value.date,"onUpdate:modelValue":a[0]||(a[0]=d=>o.value.date=d),readonly:e.readonly},null,8,["modelValue","readonly"])])}}});export{f as default};
