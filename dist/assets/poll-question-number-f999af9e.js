import{d as r,c as p,a as i,i as d,j as c,a0 as _}from"./index-7e0372b3.js";const y={class:"poll-question-number"},b=r({__name:"poll-question-number",props:{question:{},answer:{},readonly:{type:Boolean}},emits:["update:answer"],setup(a,{emit:t}){const s=a,l=t,n=p({get:()=>s.answer,set:e=>l("update:answer",e)});return(e,o)=>{const u=_;return i(),d("div",y,[c(u,{type:"number",modelValue:n.value.number,"onUpdate:modelValue":o[0]||(o[0]=m=>n.value.number=m),label:"Введите число",min:e.question.minValue,max:e.question.maxValue,step:e.question.onlyIntegerValue?1:void 0,readonly:e.readonly},null,8,["modelValue","min","max","step","readonly"])])}}});export{b as default};
