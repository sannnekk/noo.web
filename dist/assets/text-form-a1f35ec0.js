import{d as s,c as p,a as r,i,j as n,I as V}from"./index-cf083174.js";const _={class:"file-form"},f=s({__name:"text-form",props:{modelValue:{}},emits:["update:modelValue"],setup(m,{emit:u}){const d=m,e=p({get:()=>d.modelValue,set:t=>u("update:modelValue",t)});return(t,l)=>{const a=V;return r(),i("div",_,[n(a,{type:"number",modelValue:e.value.minLength,"onUpdate:modelValue":l[0]||(l[0]=o=>e.value.minLength=o),label:"Мин. длина"},null,8,["modelValue"]),n(a,{type:"number",modelValue:e.value.maxLength,"onUpdate:modelValue":l[1]||(l[1]=o=>e.value.maxLength=o),label:"Макс. длина"},null,8,["modelValue"])])}}});export{f as default};