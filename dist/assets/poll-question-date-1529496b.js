import{d as r,c as u,a as m,j as c,k as i,L as _}from"./index-eed45b92.js";const y={class:"poll-question-date"},w=r({__name:"poll-question-date",props:{question:{},answer:{},readonly:{type:Boolean}},emits:["update:answer"],setup(a,{emit:n}){const s=a,l=n,o=u({get:()=>s.answer,set:e=>l("update:answer",e)});return(e,t)=>{const d=_;return m(),c("div",y,[i(d,{label:"Выберите дату",type:"date",modelValue:o.value.date,"onUpdate:modelValue":t[0]||(t[0]=p=>o.value.date=p),readonly:e.readonly},null,8,["modelValue","readonly"])])}}});export{w as default};
