import{G as I,C as p,r as m,w as $,Z as C,d as f,c as F,a as _,i as g,g as r,j as a,$ as B,p as h,l as b,_ as k,q as A,s as N,u as M,b as D,e as l,y as u,f as H,v as P,P as T,a0 as U,E,M as R,a1 as Y}from"./index-7b41356c.js";import{S}from"./settings-section-dc3f9d56.js";const y=I("settings-module:personalization",()=>{const n=p.Services.UI,t=p.Services.UserSettings,i=t.Store(),s=m(!1),e=m();$(()=>i.userSettings,o=>{e.value=o||d()},{immediate:!0,deep:!0});async function c(){if(e.value){s.value=!0;try{await t.update(e.value)}catch(o){n.openErrorModal("Ошибка при загрузке сниппетов",o.message)}finally{s.value=!1}}}function d(){return C("user-settings")}return{moduleLoading:s,settings:e,changeSettings:c}}),Z=n=>(h("data-v-537a207f"),n=n(),b(),n),q={class:"change-background-form"},K={class:"change-background-form__change"},X=Z(()=>r("p",null,"Фоновое изображение отобразится после перезагрузки страницы",-1)),j=f({__name:"change-background-form",setup(n){const t=y(),i=F({get:()=>t.settings.backgroundImage?[t.settings.backgroundImage]:[],set:s=>{s.length?t.settings.backgroundImage=s[0]:t.settings.backgroundImage=null,t.changeSettings()}});return(s,e)=>{const c=B;return _(),g("div",q,[r("div",K,[a(c,{label:"Выбрать фон",modelValue:i.value,"onUpdate:modelValue":e[0]||(e[0]=d=>i.value=d),"max-count":1,"allowed-mime-types":["image/png","image/jpeg"]},null,8,["modelValue"])]),X])}}});const G=k(j,[["__scopeId","data-v-537a207f"]]),L=n=>(h("data-v-b3d41e9f"),n=n(),b(),n),Q={class:"change-background-form"},J=L(()=>r("p",null,[u(" Выбранный размер шрифта будет использоваться в работах и курсах "),r("br"),u(" Предпросмотр: ")],-1)),O={class:"task-view__question"},W={class:"task-view__question__max-score"},ee=f({__name:"change-fontsize-form",setup(n){const t=y(),i=[{value:"small",label:"Маленький"},{value:"medium",label:"Средний"},{value:"large",label:"Большой"}],s={id:"01HRPNY2VXZE2CRTHAMX5RPNDB",createdAt:"2024-03-11T12:52:39.243Z",updatedAt:"2024-03-11T18:07:25.000Z",slug:"d82b702b-0b93-4630-be45-46c7fef4e70e",order:34,content:{ops:[{insert:"34.(6) Установление соответствия"},{insert:`
`},{insert:"Установите соответствие между признаками и группами белков: к каждой позиции из левого столбца подберите соответствующую позицию из правого столбца. "},{insert:`

`},{insert:"ПРИЗНАК ГРУППА БЕЛКОВ "},{insert:`
`},{insert:"А) как правило, растворимы в воде "},{insert:`
`},{insert:"Б) обладают высокой механической прочностью "},{insert:`
`},{insert:"В) образуют ферменты "},{insert:`
`},{insert:"Г) выполняют структурную и сократительную функции "},{insert:`
`},{insert:"Д) представляют нити, волокна "},{insert:`
`},{insert:"Е) имеют вид компактных телец "},{insert:`
`},{insert:"1) фибриллярные"},{insert:`
`},{insert:"2) глобулярные"},{insert:`

`}]},highestScore:2,type:"word",workId:"01HRPNY2VKQXAGK0D9VFAK96YY",rightAnswer:"212112",solveHint:null,checkHint:null,checkingStrategy:"type2",isAnswerVisibleBeforeCheck:!1},e=m(t.settings.fontSize);function c(){t.settings.fontSize=e.value,t.changeSettings()}return(d,o)=>{const w=U,z=E,V=R,x=A("auto-animate");return _(),g(T,null,[N((_(),g("div",Q,[a(w,{label:"Размер шрифта",options:i,modelValue:e.value,"onUpdate:modelValue":o[0]||(o[0]=v=>e.value=v)},null,8,["modelValue"]),e.value!==M(t).settings.fontSize?(_(),D(z,{key:0,class:"change-background-form__apply-button",onClick:o[1]||(o[1]=v=>c())},{default:l(()=>[u(" Применить ")]),_:1})):H("",!0),J])),[[x]]),r("div",O,[a(V,{content:s.content,"font-size":e.value},null,8,["content","font-size"]),r("p",W," Максимальный балл: "+P(s.highestScore),1)])],64)}}});const te=k(ee,[["__scopeId","data-v-b3d41e9f"]]),ne={class:"personalization-view"},ae=f({__name:"personalization-view",setup(n){return p.Services.UserSettings.reload(),(i,s)=>{const e=Y;return _(),g("div",ne,[a(S,null,{title:l(()=>[u("Смена фона "),a(e)]),content:l(()=>[a(G)]),_:1}),a(S,null,{title:l(()=>[u("Размер шрифта")]),content:l(()=>[a(te)]),_:1})])}}});export{ae as default};