import{d as g,a as i,i as u,g as _,j as o,v as k,Z as y,_ as m,p as h,l as b,G as $,C as p,r as f,w as x,$ as I,c as w,a0 as B,e as r,y as v}from"./index-959d0ab5.js";import{S}from"./settings-section-d2e035cc.js";const V={class:"feature-block"},z={class:"feature-block__icon"},C={class:"feature-block__text"},U=g({__name:"feature-block",props:{version:{}},setup(e){return(t,a)=>{const n=y;return i(),u("div",V,[_("div",z,[o(n,{name:"info"})]),_("div",C," Функционал будет доступен в версии "+k(t.version),1)])}}});const F=m(U,[["__scopeId","data-v-104ffa24"]]);const M={},N=e=>(h("data-v-02a13b7e"),e=e(),b(),e),j={class:"beta-tag"},E=N(()=>_("span",{class:"beta-tag__text"},"Beta",-1)),T=[E];function D(e,t){return i(),u("div",j,T)}const G=m(M,[["render",D],["__scopeId","data-v-02a13b7e"]]),L=$("settings-module:personalization",()=>{const e=p.Services.UI,t=p.Services.UserSettings,a=t.Store(),n=f(!1),s=f();x(()=>a.userSettings,d=>{s.value=d||l()},{immediate:!0,deep:!0});async function c(){if(s.value){n.value=!0;try{await t.update(s.value)}catch(d){e.openErrorModal("Ошибка при загрузке сниппетов",d.message)}finally{n.value=!1}}}function l(){return I("user-settings")}return{moduleLoading:n,settings:s,changeSettings:c}}),P=e=>(h("data-v-537a207f"),e=e(),b(),e),Z={class:"change-background-form"},q={class:"change-background-form__change"},A=P(()=>_("p",null,"Фоновое изображение отобразится после перезагрузки страницы",-1)),H=g({__name:"change-background-form",setup(e){const t=L(),a=w({get:()=>t.settings.backgroundImage?[t.settings.backgroundImage]:[],set:n=>{n.length?t.settings.backgroundImage=n[0]:t.settings.backgroundImage=null,t.changeSettings()}});return(n,s)=>{const c=B;return i(),u("div",Z,[_("div",q,[o(c,{label:"Выбрать фон",modelValue:a.value,"onUpdate:modelValue":s[0]||(s[0]=l=>a.value=l),"max-count":1,"allowed-mime-types":["image/png","image/jpeg"]},null,8,["modelValue"])]),A])}}});const J=m(H,[["__scopeId","data-v-537a207f"]]),K={class:"personalization-view"},R=g({__name:"personalization-view",setup(e){return p.Services.UserSettings.reload(),(a,n)=>{const s=G,c=F;return i(),u("div",K,[o(S,null,{title:r(()=>[v("Смена фона "),o(s)]),content:r(()=>[o(J)]),_:1}),o(S,null,{title:r(()=>[v("Размер шрифта")]),content:r(()=>[o(c,{version:"3.3"})]),_:1})])}}});export{R as default};