import{d as T,a as c,i as g,V as I,b as x,W as N,C as b,g as u,y as m,v as V,j as d,e as v,E as A,p as k,l as E,_ as y,c as B,X as C,Y as M,G as z,r as S,u as f,A as F}from"./index-959d0ab5.js";import{_ as L}from"./info-block-5a76f416.js";import{S as w}from"./settings-section-d2e035cc.js";const j={class:"telegram-auth-button"},D=T({__name:"telegram-auth-button",props:{size:{default:"medium"}},emits:["authenticated"],setup(a,{emit:t}){const o=t;return window.onAuthenticated=e=>{o("authenticated",e)},(e,s)=>(c(),g("div",j,[s[0]||(I(-1),(s[0]=(c(),x(N("script"),{async:"",src:"https://telegram.org/js/telegram-widget.js?22","data-telegram-login":"noo_platforma_bot","data-size":e.size,"data-onauth":"onAuthenticated(user)","data-request-access":"write"},null,8,["data-size"]))).cacheIndex=0,I(1),s[0])]))}}),h=a=>(k("data-v-65115025"),a=a(),E(),a),q={key:0,class:"unbind-telegram-form"},G={class:"unbind-telegram-form__hint"},W={key:0},X={key:1},Y=h(()=>u("br",null,null,-1)),H=h(()=>u("br",null,null,-1)),J=h(()=>u("br",null,null,-1)),K=h(()=>u("br",null,null,-1)),O={class:"unbind-telegram-form__unbind-button"},P={key:1,class:"bind-telegram-form"},Q=h(()=>u("p",{class:"bind-telegram-form__hint"}," После привязки Telegram платформа будет использовать Ваше фото из Telegram (это можно поменять при смене аватара), Ваш Telegram ID для уведомлений. Кураторы и преподаватели смогут видеть ваш Telegram аккаунт в Вашем профиле. ",-1)),R={class:"bind-telegram-form__bind-button"},Z=T({__name:"bind-telegram-form",props:{telegramUsername:{},telegramId:{}},emits:["bind","unbind"],setup(a,{emit:t}){const o=a,e=t,s=b.Services.UI;function r(i){if(!i.id){s.openErrorModal("Не удалось привязать Telegram","Попробуйте еще раз");return}setTimeout(()=>{e("bind",{telegramId:String(i.id),telegramUsername:i.username,telegramAvatarUrl:i.photo_url})},100)}function l(){e("unbind")}return(i,p)=>{const n=A,_=D,$=L;return o.telegramUsername||o.telegramId?(c(),g("div",q,[u("p",G,[o.telegramUsername?(c(),g("span",W,[m(" К Вашему аккаунту привязан Telegram аккаунт "),u("b",null,"@"+V(o.telegramUsername),1)])):(c(),g("span",X,[m(" К Вашему аккаунту привязан Telegram аккаунт, "),Y,m(" но настройки конфиденциальности Telegram не позволяют "),H,m(" получить информацию о пользователе. "),J,m(" Вам доступна функция уведомлений, "),K,m(" но ваши данные не будут отображены в профиле. ")]))]),u("div",O,[d(n,{onClick:p[0]||(p[0]=U=>l()),design:"danger",alignment:"left"},{default:v(()=>[m(" Отвязать Telegram ")]),_:1})])])):(c(),g("div",P,[Q,u("div",R,[d(_,{onAuthenticated:p[1]||(p[1]=U=>r(U))})]),d($,null,{default:v(()=>[m(" Платформа получит доступ только к тем данным, которые доступны всем пользователям Telegram. ")]),_:1})]))}}});const ee=y(Z,[["__scopeId","data-v-65115025"]]),te=a=>(k("data-v-750f7570"),a=a(),E(),a),ne={key:0,class:"telegram-notifications-form"},ae={key:1,class:"telegram-notifications-form__telegram-not-bound"},oe=te(()=>u("br",null,null,-1)),se=T({__name:"telegram-notifications-form",props:{telegramId:{},notificationsEnabled:{type:Boolean}},emits:["notifications-enabled-toggled"],setup(a,{emit:t}){const o=a,e=t,s=B({get:()=>o.notificationsEnabled,set:r=>e("notifications-enabled-toggled",r)});return(r,l)=>{const i=C,p=M;return r.telegramId?(c(),g("div",ne,[d(i,{modelValue:s.value,"onUpdate:modelValue":l[0]||(l[0]=n=>s.value=n),values:[{value:!1,label:"Уведомления выключены"},{value:!0,label:"Уведомления включены"}]},null,8,["modelValue"])])):(c(),g("div",ae,[d(p,null,{default:v(()=>[m(" Telegram не привязан. "),oe,m(" Для использования уведомлений в Telegram необходимо привязать аккаунт. ")]),_:1})]))}}});const re=y(se,[["__scopeId","data-v-750f7570"]]),le=z("settings-module:telegram",()=>{const a=b.Services.Auth,t=b.Services.User,o=b.Services.UI,e=S(),s=S(!1);async function r(){var n;if((n=b.Context.User)!=null&&n.username){s.value=!0;try{const _=await t.getUser(b.Context.User.username);e.value=_.data}catch(_){o.openErrorModal("Произошла ошибка при загрузке данных пользователя","Возможно, Вам поможет перезайти. Ошибка: "+_.message,[{label:"Перезайти",design:"warning",handler:()=>a.logout()}])}finally{s.value=!1}}}async function l(n){if(!(!e.value||!n))try{await t.updateTelegram(e.value.id,n,{showLoader:!0}),e.value.telegramUsername=n.telegramUsername||void 0,e.value.telegramId=n.telegramId||void 0,o.openSuccessModal(n.telegramId?"Telegram успешно привязан":"Telegram успешно отвязан")}catch(_){o.openErrorModal("Произошла ошибка при обновлении Telegram",_.message)}}async function i(){await l({telegramId:null,telegramUsername:null,telegramAvatarUrl:null})}async function p(){if(!e.value)return;const n=e.value.telegramNotificationsEnabled;try{await t.updateUser(e.value.id,{id:e.value.id,telegramNotificationsEnabled:!n},{showLoader:!0}),o.openSuccessModal(n?"Уведомления в Telegram отключены":"Уведомления в Telegram включены"),e.value.telegramNotificationsEnabled=!n}catch(_){o.openErrorModal("Произошла ошибка при обновлении настроек",_.message)}}return{moduleLoading:s,user:e,fetchUser:r,bindTelegram:l,unbindTelegram:i,toggleNotificationsEnabled:p}}),ie={key:0,class:"telegram-view"},me={key:1,class:"telegram-view__loading"},de=T({__name:"telegram-view",setup(a){const t=le();return t.fetchUser(),(o,e)=>{const s=F;return f(t).moduleLoading?(c(),g("div",me,[d(s,{contrast:""})])):(c(),g("div",ie,[d(w,null,{title:v(()=>[m(" Привязка Telegram ")]),content:v(()=>{var r,l;return[d(ee,{"telegram-username":(r=f(t).user)==null?void 0:r.telegramUsername,"telegram-id":(l=f(t).user)==null?void 0:l.telegramId,onBind:e[0]||(e[0]=i=>f(t).bindTelegram(i)),onUnbind:e[1]||(e[1]=i=>f(t).unbindTelegram())},null,8,["telegram-username","telegram-id"])]}),_:1}),d(w,null,{title:v(()=>[m(" Уведомления в Telegram ")]),content:v(()=>{var r,l;return[d(re,{"telegram-id":(r=f(t).user)==null?void 0:r.telegramId,"notifications-enabled":(l=f(t).user)==null?void 0:l.telegramNotificationsEnabled,onNotificationsEnabledToggled:e[2]||(e[2]=i=>f(t).toggleNotificationsEnabled())},null,8,["telegram-id","notifications-enabled"])]}),_:1})]))}}});const ge=y(de,[["__scopeId","data-v-64d9a5d9"]]);export{ge as default};