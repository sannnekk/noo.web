import{d as c,c as f,a as i,i as u,g as l,y as s,v as n,f as y,j as q,$ as w,_ as F}from"./index-7b41356c.js";const v={class:"poll-question-file"},V={class:"poll-question-file__hint"},g={key:0},x=c({__name:"poll-question-file",props:{question:{},answer:{},readonly:{type:Boolean}},emits:["update:answer"],setup(p,{emit:d}){const m=p,r=d,a=f({get:()=>m.answer,set:e=>r("update:answer",e)});return(e,t)=>{const _=w;return i(),u("div",v,[l("p",V,[e.question.allowedFileTypes?(i(),u("span",g,[s(" Разрешены файлы типа: "),l("b",null,n(e.question.allowedFileTypes.map(o=>o.split("/")[1]).join(", ")),1)])):y("",!0),l("span",null,[s(" Максимальное количество файлов: "),l("b",null,n(e.question.maxFileCount||1),1)]),l("span",null,[s(" Максимальный размер файла: "),l("b",null,n(e.question.maxFileSize||1)+" МБ",1)])]),q(_,{modelValue:a.value.files,"onUpdate:modelValue":t[0]||(t[0]=o=>a.value.files=o),label:"Выберите файлы","allowed-mime-types":e.question.allowedFileTypes,"max-file-size":(e.question.maxFileSize||1)*1024*1024,"max-count":e.question.maxFileCount||1,readonly:e.readonly},null,8,["modelValue","allowed-mime-types","max-file-size","max-count","readonly"])])}}});const z=F(x,[["__scopeId","data-v-586fcd5f"]]);export{z as default};