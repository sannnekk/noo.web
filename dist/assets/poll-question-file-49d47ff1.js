import{d as c,c as f,a as i,j as u,g as o,y as s,v as n,f as y,k as q,ao as w,_ as F}from"./index-b7960b75.js";const v={class:"poll-question-file"},V={class:"poll-question-file__hint"},g={key:0},x=c({__name:"poll-question-file",props:{question:{},answer:{},readonly:{type:Boolean}},emits:["update:answer"],setup(p,{emit:d}){const m=p,r=d,a=f({get:()=>m.answer,set:e=>r("update:answer",e)});return(e,t)=>{const _=w;return i(),u("div",v,[o("p",V,[e.question.allowedFileTypes?(i(),u("span",g,[s(" Разрешены файлы типа: "),o("b",null,n(e.question.allowedFileTypes.map(l=>l.split("/")[1]).join(", ")),1)])):y("",!0),o("span",null,[s(" Максимальное количество файлов: "),o("b",null,n(e.question.maxFileCount||1),1)]),o("span",null,[s(" Максимальный размер файла: "),o("b",null,n(e.question.maxFileSize||1)+" МБ",1)])]),q(_,{modelValue:a.value.files,"onUpdate:modelValue":t[0]||(t[0]=l=>a.value.files=l),label:"Выберите файлы","allowed-mime-types":e.question.allowedFileTypes,"max-file-size":(e.question.maxFileSize||1)*1024*1024,"max-count":e.question.maxFileCount||1,readonly:e.readonly},null,8,["modelValue","allowed-mime-types","max-file-size","max-count","readonly"])])}}});const k=F(x,[["__scopeId","data-v-586fcd5f"]]);export{k as default};