import{d as i,c as r,a as _,i as V,j as a,O as c,I as f}from"./index-fb54ff9f.js";const v={class:"file-form"},g=i({__name:"file-form",props:{modelValue:{}},emits:["update:modelValue"],setup(u,{emit:m}){const p=u,e=r({get:()=>p.modelValue,set:n=>m("update:modelValue",n)}),s=[{label:"Изображение",value:["image/jpeg","image/png"]},{label:"PDF",value:["application/pdf"]}];return(n,l)=>{const d=c,t=f;return _(),V("div",v,[a(d,{modelValue:e.value.allowedFileTypes,"onUpdate:modelValue":l[0]||(l[0]=o=>e.value.allowedFileTypes=o),options:s,label:"Тип файлов"},null,8,["modelValue"]),a(t,{type:"number",modelValue:e.value.maxFileCount,"onUpdate:modelValue":l[1]||(l[1]=o=>e.value.maxFileCount=o),label:"Макс. количество файлов"},null,8,["modelValue"]),a(t,{type:"number",modelValue:e.value.maxFileSize,"onUpdate:modelValue":l[2]||(l[2]=o=>e.value.maxFileSize=o),label:"Макс. размер файлов (в МБ)"},null,8,["modelValue"])])}}});export{g as default};