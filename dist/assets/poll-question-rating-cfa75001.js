import{d as u,c as d,a as _,i as m,g as s,v as p,s as c,ar as y,_ as v,j as V}from"./index-959d0ab5.js";const b={сlass:"rating-input"},f={class:"rating-input__label"},I={class:"rating-input__input"},R=["min","max","step","disabled"],q={class:"rating-input__input__value"},B=u({__name:"rating-input",props:{label:{},modelValue:{},readonly:{type:Boolean},minRating:{},maxRating:{},onlyIntegers:{type:Boolean}},emits:["update:modelValue"],setup(o,{emit:i}){const a=o,l=i,n=d({get:()=>a.modelValue,set:e=>l("update:modelValue",a.onlyIntegers?parseInt(e):parseFloat(e))});return(e,t)=>(_(),m("label",b,[s("span",f,p(e.label),1),s("div",I,[c(s("input",{class:"rating-input__input__field",type:"range",min:e.minRating,max:e.maxRating,step:e.onlyIntegers?1:.25,"onUpdate:modelValue":t[0]||(t[0]=r=>n.value=r),disabled:e.readonly},null,8,R),[[y,n.value]]),s("span",q,p(n.value),1)])]))}});const h=v(B,[["__scopeId","data-v-4531dc93"]]),w={class:"poll-question-rating"},k=u({__name:"poll-question-rating",props:{question:{},answer:{},readonly:{type:Boolean}},emits:["update:answer"],setup(o,{emit:i}){const a=o,l=i,n=d({get:()=>a.answer,set:e=>l("update:answer",e)});return(e,t)=>{const r=h;return _(),m("div",w,[V(r,{modelValue:n.value.rating,"onUpdate:modelValue":t[0]||(t[0]=g=>n.value.rating=g),label:"Выберите значение","only-integers":e.question.onlyIntegerRating,"min-rating":e.question.minRating,"max-rating":e.question.maxRating,readonly:e.readonly},null,8,["modelValue","only-integers","min-rating","max-rating","readonly"])])}}});export{k as default};