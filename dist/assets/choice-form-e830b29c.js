import{d as i,c,a as r,i as _,j as a,as as V,O as f}from"./index-959d0ab5.js";const v={class:"file-form"},C=i({__name:"choice-form",props:{modelValue:{}},emits:["update:modelValue"],setup(m,{emit:u}){const s=m,d=u,e=c({get:()=>s.modelValue,set:n=>d("update:modelValue",n)});return(n,o)=>{const p=V,t=f;return r(),_("div",v,[a(p,{modelValue:e.value.choices,"onUpdate:modelValue":o[0]||(o[0]=l=>e.value.choices=l),label:"Варианты ответа"},null,8,["modelValue"]),a(t,{type:"number",modelValue:e.value.minChoices,"onUpdate:modelValue":o[1]||(o[1]=l=>e.value.minChoices=l),label:"Мин. количество ответов"},null,8,["modelValue"]),a(t,{type:"number",modelValue:e.value.maxChoices,"onUpdate:modelValue":o[2]||(o[2]=l=>e.value.maxChoices=l),label:"Макс. количество ответов"},null,8,["modelValue"])])}}});export{C as default};