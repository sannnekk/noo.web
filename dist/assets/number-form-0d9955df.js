import{d as r,c as V,a as i,i as _,j as a,O as c,a5 as f}from"./index-959d0ab5.js";const b={class:"file-form"},g=r({__name:"number-form",props:{modelValue:{}},emits:["update:modelValue"],setup(m,{emit:t}){const s=m,d=t,e=V({get:()=>s.modelValue,set:n=>d("update:modelValue",n)});return(n,l)=>{const u=c,p=f;return i(),_("div",b,[a(u,{type:"number",modelValue:e.value.minValue,"onUpdate:modelValue":l[0]||(l[0]=o=>e.value.minValue=o),label:"Мин. значение"},null,8,["modelValue"]),a(u,{type:"number",modelValue:e.value.maxValue,"onUpdate:modelValue":l[1]||(l[1]=o=>e.value.maxValue=o),label:"Макс. значение"},null,8,["modelValue"]),a(p,{style:{"margin-top":"1em"},modelValue:e.value.onlyIntegerValue,"onUpdate:modelValue":l[2]||(l[2]=o=>e.value.onlyIntegerValue=o),label:"Только целые числа"},null,8,["modelValue"])])}}});export{g as default};