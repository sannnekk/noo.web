import{d as y,C as _,u as v,a as x,y as f,o as p,b as m,e as g,f as d,g as s,v as k,_ as h,j as U,m as S}from"./index-227761f5.js";import{_ as w}from"./entity-table-8e7157fb.js";import"./useDate-126c6fe0.js";const L=y("users-module:users",()=>{const u=_.Services.User,i=_.Services.UI,{pagination:e,isListLoading:a,results:t,resultsMeta:n}=v(o);async function o(r){try{return await u.getUsers(r)}catch(l){i.openErrorModal("Произошла ошибка при получении списка пользователей",l.message)}}return{pagination:e,isListLoading:a,results:t,resultsMeta:n}}),V={class:"index-students-view"},C={class:"index-students-view__search"},T={class:"index-students-view__table"},b={key:0,class:"index-students-view__pagination"},M=x({__name:"index",setup(u){var a;const i=[{title:"",keys:["avatar.url","name"],type:"avatar"},{title:"Имя",value:t=>t.verificationToken?`[не подтвержден] ${t.name}`:t.name,type:"text"},{title:"Роль",keys:["role"],type:"tag",tagFunction:(t,n)=>{switch(n){case"admin":return{text:"Администратор",type:"danger"};case"teacher":return{text:"Преподаватель",type:"success"};case"mentor":return{text:"Куратор",type:"black"};case"student":default:return{text:"Ученик",type:"info"}}}},{title:"Никнейм",keys:["username"],type:"text"},{title:"E-mail",keys:["email"],type:"text"},{title:"Telegram",keys:["telegramUsername"],type:"link",design:"telegram",linkTo:t=>`https://t.me/${t.telegramUsername}`},{title:"",value:((a=_.Context.User)==null?void 0:a.role)==="mentor"?"Перейти":"Редактировать",type:"link",design:"secondary",linkTo:t=>`/users/edit/${t.username}`}],e=L();return f("Пользователи"),(t,n)=>{const o=h,r=w,l=U;return p(),m("div",V,[g("div",C,[d(o,{modelValue:s(e).pagination.search,"onUpdate:modelValue":n[0]||(n[0]=c=>s(e).pagination.search=c),"is-loading":s(e).isListLoading},null,8,["modelValue","is-loading"])]),g("div",T,[d(r,{cols:i,data:s(e).results,"is-loading":s(e).isListLoading},null,8,["data","is-loading"])]),s(e).resultsMeta.total?(p(),m("div",b,[d(l,{page:s(e).pagination.page,"onUpdate:page":n[1]||(n[1]=c=>s(e).pagination.page=c),total:s(e).resultsMeta.total,limit:s(e).pagination.limit},null,8,["page","total","limit"])])):k("",!0)])}}});const N=S(M,[["__scopeId","data-v-6efe3c07"]]);export{N as default};
