import{d as p,c as n,a as u,j as _,k as r,f as d,K as h,_ as y}from"./index-afa4b27f.js";const f={key:0,class:"poll-question-choice"},k=p({__name:"poll-question-choice",props:{question:{},answer:{},readonly:{type:Boolean}},emits:["update:answer"],setup(a,{emit:c}){const o=a,s=n({get:()=>o.answer,set:e=>{e.choices.length>(o.question.maxChoices||1)&&(e.choices=e.choices.slice(0,o.question.maxChoices)),c("update:answer",e)}}),i=n(()=>(o.question.choices||[]).map(e=>({name:e})));return(e,t)=>{const l=h;return s.value?(u(),_("div",f,[r(l,{modelValue:s.value.choices,"onUpdate:modelValue":t[0]||(t[0]=m=>s.value.choices=m),items:i.value,"item-label-key":"name","item-key":"name",multiple:e.question.maxChoices!==1,readonly:e.readonly},null,8,["modelValue","items","multiple","readonly"])])):d("",!0)}}});const C=y(k,[["__scopeId","data-v-506e8145"]]);export{C as default};