import{d as _,c,a as i,j as u,g as l,y as s,v as n,f,k as y,M as q,_ as w}from"./index-85a2f4f2.js";const F={class:"poll-question-file"},v={class:"poll-question-file__hint"},V={key:0},g=_({__name:"poll-question-file",props:{question:{},answer:{},readonly:{type:Boolean}},emits:["update:answer"],setup(p,{emit:d}){const m=p,a=c({get:()=>m.answer,set:e=>d("update:answer",e)});return(e,t)=>{const r=q;return i(),u("div",F,[l("p",v,[e.question.allowedFileTypes?(i(),u("span",V,[s(" Разрешены файлы типа: "),l("b",null,n(e.question.allowedFileTypes.map(o=>o.split("/")[1]).join(", ")),1)])):f("",!0),l("span",null,[s(" Максимальное количество файлов: "),l("b",null,n(e.question.maxFileCount||1),1)]),l("span",null,[s(" Максимальный размер файла: "),l("b",null,n(e.question.maxFileSize||1)+" МБ",1)])]),y(r,{modelValue:a.value.files,"onUpdate:modelValue":t[0]||(t[0]=o=>a.value.files=o),label:"Выберите файлы","allowed-mime-types":e.question.allowedFileTypes,"max-file-size":(e.question.maxFileSize||1)*1024*1024,"max-count":e.question.maxFileCount||1,readonly:e.readonly},null,8,["modelValue","allowed-mime-types","max-file-size","max-count","readonly"])])}}});const b=w(g,[["__scopeId","data-v-586fcd5f"]]);export{b as default};
