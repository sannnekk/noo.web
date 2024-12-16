import{d as S,C as b,c as F,a as v,b as C,a4 as q,r as f,w as g,a0 as U,q as G,s as x,i as V,g as s,j as u,f as y,e as h,y as N,v as L,O as T,an as z,ao as A,a5 as H,D as J,E as K,p as P,l as Q,_ as R,G as W}from"./index-a7f2efe5.js";import{S as X}from"./settings-section-a9d859aa.js";const Y=S({__name:"course-select",props:{label:{},modelValue:{}},emits:["update:modelValue"],setup(i,{emit:m}){const r=i,o=m,e=b.Services.Course,a=b.Services.UI;async function d(c){try{return e.getCourses(c)}catch(p){a.openErrorModal("Произошла ошибка при загрузке курсов",p.message)}}const n=F({get:()=>r.modelValue?[r.modelValue]:[],set:c=>{c.length===0&&o("update:modelValue",null),o("update:modelValue",c[0])}});return(c,p)=>{const _=q;return v(),C(_,{label:c.label,"fetch-function":d,"label-keys":["subject.name","name"],"max-count":1,modelValue:n.value,"onUpdate:modelValue":p[0]||(p[0]=l=>n.value=l)},null,8,["label","modelValue"])}}}),Z=S({__name:"user-role-select",props:{label:{},modelValue:{}},emits:["update:modelValue"],setup(i,{emit:m}){var d;const r=i,o=m,e=[{label:"Администратор",value:"admin"},{label:"Преподаватель",value:"teacher"},{label:"Куратор",value:"mentor"},{label:"Ученик",value:"student"},{label:"Ассистент",value:"assistant"}],a=f(((d=r.modelValue)==null?void 0:d.value)||e[0].value);return g(()=>a.value,()=>o("update:modelValue",e.find(n=>n.value===a.value)||e[0]),{immediate:!0}),(n,c)=>{const p=U;return v(),C(p,{label:n.label,options:e,modelValue:a.value,"onUpdate:modelValue":c[0]||(c[0]=_=>a.value=_)},null,8,["label","modelValue"])}}}),ee=i=>(P("data-v-e83b61e3"),i=i(),Q(),i),oe={class:"create-notification-form"},le={class:"row"},te={class:"col-lg-6"},se={class:"form-group"},ae={class:"col-lg-6"},ne={class:"row"},ue={class:"col-lg-6"},ie={class:"form-group"},ce={class:"col-lg-6"},re={class:"form-group"},de={class:"row"},_e={class:"col-12"},me=ee(()=>s("h4",null,"Кому отправить",-1)),pe={class:"row"},ve={class:"col-lg-6"},fe={class:"form-group"},Ve={class:"col-lg-6"},ge={key:0,class:"form-group"},be={key:1,class:"form-group"},he={key:0,class:"form-errors"},Se={class:"form-actions"},ye=S({__name:"create-notification-form",emits:["create"],setup(i,{emit:m}){const r=m,o=f({title:"",message:"",type:"other",link:"",isBanner:!1}),e=f({selector:"all",value:null}),a=f(null);g(a,()=>{var _;return e.value.value=((_=a.value)==null?void 0:_.value)||null});const d=f(null),n=f([]);g(d,()=>{var _;return e.value.value=((_=d.value)==null?void 0:_.id)||null}),g(()=>e.value.selector,()=>e.value.value=null);function c(){if(n.value=[],!o.value.title){n.value.push("Заголовок обязателен");return}if(e.value.selector==="role"&&!a.value){n.value.push("Выберите роль");return}if(e.value.selector==="course"&&!d.value){n.value.push("Выберите курс");return}r("create",o.value,e.value)}const p=[{value:"all",label:"Всем"},{value:"role",label:"По роли"},{value:"course",label:"По курсу"}];return(_,l)=>{const k=T,M=z,B=A,I=H,$=U,D=Z,E=Y,O=J,j=K,w=G("auto-animate");return x((v(),V("div",oe,[s("div",le,[s("div",te,[s("div",se,[u(k,{type:"text",modelValue:o.value.title,"onUpdate:modelValue":l[0]||(l[0]=t=>o.value.title=t),label:"Заголовок",validators:[t=>!!t||"Заголовок обязателен"]},null,8,["modelValue","validators"])])]),s("div",ae,[u(M,{label:"Тип",modelValue:o.value.type,"onUpdate:modelValue":l[1]||(l[1]=t=>o.value.type=t)},null,8,["modelValue"])])]),s("div",ne,[s("div",ue,[s("div",ie,[u(B,{modelValue:o.value.message,"onUpdate:modelValue":l[2]||(l[2]=t=>o.value.message=t),label:"Сообщение (необязательно)"},null,8,["modelValue"])])]),s("div",ce,[s("div",re,[u(k,{label:"Ссылка (необязательно)",type:"url",modelValue:o.value.link,"onUpdate:modelValue":l[3]||(l[3]=t=>o.value.link=t)},null,8,["modelValue"])])])]),s("div",de,[s("div",_e,[u(I,{label:"Создать как баннер",modelValue:o.value.isBanner,"onUpdate:modelValue":l[4]||(l[4]=t=>o.value.isBanner=t)},null,8,["modelValue"])])]),me,s("div",pe,[s("div",ve,[s("div",fe,[u($,{label:"Селектор",modelValue:e.value.selector,"onUpdate:modelValue":l[5]||(l[5]=t=>e.value.selector=t),options:p},null,8,["modelValue"])])]),x((v(),V("div",Ve,[e.value.selector==="role"?(v(),V("div",ge,[u(D,{label:"Выберите роль",modelValue:a.value,"onUpdate:modelValue":l[6]||(l[6]=t=>a.value=t)},null,8,["modelValue"])])):y("",!0),e.value.selector==="course"?(v(),V("div",be,[u(E,{label:"Выберите курс",modelValue:d.value,"onUpdate:modelValue":l[7]||(l[7]=t=>d.value=t),expectId:""},null,8,["modelValue"])])):y("",!0)])),[[w]])]),n.value.length?(v(),V("div",he,[u(O,null,{default:h(()=>[N(L(n.value.join(", ")),1)]),_:1})])):y("",!0),s("div",Se,[u(j,{alignment:"right",onClick:l[8]||(l[8]=t=>c())},{default:h(()=>[N(" Создать и отправить ")]),_:1})])])),[[w]])}}});const Ne=R(ye,[["__scopeId","data-v-e83b61e3"]]),ke=W("settings-module:notifications",()=>{const i=b.Services.Notification,m=b.Services.UI;async function r(o,e){try{await i.createNotification(o,e,{showLoader:!0})}catch(a){m.openErrorModal("Не удалось создать уведомление",a.message)}}return{createNotification:r}}),we={class:"notifications-view"},Ue=S({__name:"notifications-view",setup(i){const m=ke();function r(o,e){m.createNotification(o,e)}return(o,e)=>(v(),V("div",we,[u(X,null,{title:h(()=>[N("Отправить уведомление")]),content:h(()=>[u(Ne,{onCreate:r})]),_:1})]))}});export{Ue as default};
