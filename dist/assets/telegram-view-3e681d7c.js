import{d as h,a as i,j as c,R as y,b as k,S as $,C as p,g as m,y as s,v as x,k as _,e as f,E as A,p as C,l as B,_ as I,T as E,G as V,r as S,u as b,A as z}from"./index-eed45b92.js";import{S as U}from"./settings-section-4293c894.js";const M={class:"telegram-auth-button"},j=h({__name:"telegram-auth-button",props:{size:{default:"medium"}},emits:["authenticated"],setup(o,{emit:t}){const n=t;return window.onAuthenticated=e=>{n("authenticated",e)},(e,a)=>(i(),c("div",M,[a[0]||(y(-1),(a[0]=(i(),k($("script"),{async:"",src:"https://telegram.org/js/telegram-widget.js?22","data-telegram-login":"noo_platforma_bot","data-size":e.size,"data-onauth":"onAuthenticated(user)","data-request-access":"write"},null,8,["data-size"]))).cacheIndex=0,y(1),a[0])]))}}),v=o=>(C("data-v-fdb27769"),o=o(),B(),o),D={key:0,class:"unbind-telegram-form"},L={class:"unbind-telegram-form__hint"},N={key:0},F={key:1},q=v(()=>m("br",null,null,-1)),G=v(()=>m("br",null,null,-1)),R=v(()=>m("br",null,null,-1)),H=v(()=>m("br",null,null,-1)),J={class:"unbind-telegram-form__unbind-button"},K={key:1,class:"bind-telegram-form"},O=v(()=>m("p",{class:"bind-telegram-form__hint"}," После привязки Telegram платформа будет использовать Ваше фото из Telegram (это можно поменять при смене аватара), Ваш Telegram ID для уведомлений. Кураторы и преподаватели смогут видеть ваш Telegram аккаунт в Вашем профиле. ",-1)),P={class:"bind-telegram-form__bind-button"},Q=h({__name:"bind-telegram-form",props:{telegramUsername:{},telegramId:{}},emits:["bind","unbind"],setup(o,{emit:t}){const n=o,e=t,a=p.Services.UI;function g(l){if(!l.id){a.openErrorModal("Не удалось привязать Telegram","Попробуйте еще раз");return}setTimeout(()=>{e("bind",{telegramId:String(l.id),telegramUsername:l.username,telegramAvatarUrl:l.photo_url})},100)}function d(){e("unbind")}return(l,r)=>{const u=A,w=j;return n.telegramUsername||n.telegramId?(i(),c("div",D,[m("p",L,[n.telegramUsername?(i(),c("span",N,[s(" К Вашему аккаунту привязан Telegram аккаунт "),m("b",null,"@"+x(n.telegramUsername),1)])):(i(),c("span",F,[s(" К Вашему аккаунту привязан Telegram аккаунт, "),q,s(" но настройки конфиденциальности Telegram не позволяют "),G,s(" получить информацию о пользователе. "),R,s(" Вам доступна функция уведомлений, "),H,s(" но ваши данные не будут отображены в профиле. ")]))]),m("div",J,[_(u,{onClick:r[0]||(r[0]=T=>d()),design:"danger",alignment:"left"},{default:f(()=>[s(" Отвязать Telegram ")]),_:1})])])):(i(),c("div",K,[O,m("div",P,[_(w,{onAuthenticated:r[1]||(r[1]=T=>g(T))})])]))}}});const W=I(Q,[["__scopeId","data-v-fdb27769"]]),X={key:0,class:"telegram-notifications-form"},Y={key:1,class:"telegram-notifications-form__telegram-not-bound"},Z=m("br",null,null,-1),ee=h({__name:"telegram-notifications-form",props:{telegramId:{}},setup(o){return(t,n)=>{const e=E;return t.telegramId?(i(),c("div",X," Telegram binding form ")):(i(),c("div",Y,[_(e,null,{default:f(()=>[s(" Telegram не привязан. "),Z,s(" Для использования уведомлений в Telegram необходимо привязать аккаунт. ")]),_:1})]))}}}),te=V("settings-module:telegram",()=>{const o=p.Services.Auth,t=p.Services.User,n=p.Services.UI,e=S(),a=S(!1);async function g(){var r;if((r=p.Context.User)!=null&&r.username){a.value=!0;try{const u=await t.getUser(p.Context.User.username);e.value=u.data}catch(u){n.openErrorModal("Произошла ошибка при загрузке данных пользователя","Возможно, Вам поможет перезайти. Ошибка: "+u.message,[{label:"Перезайти",design:"warning",handler:()=>o.logout()}])}finally{a.value=!1}}}async function d(r){if(!(!e.value||!r))try{await t.updateTelegram(e.value.id,r,{showLoader:!0}),e.value.telegramUsername=r.telegramUsername||void 0,e.value.telegramId=r.telegramId||void 0,n.openSuccessModal("Telegram успешно привязан")}catch(u){n.openErrorModal("Произошла ошибка при обновлении Telegram",u.message)}}async function l(){await d({telegramId:null,telegramUsername:null,telegramAvatarUrl:null})}return{moduleLoading:a,user:e,fetchUser:g,bindTelegram:d,unbindTelegram:l}}),ne={key:0,class:"telegram-view"},re={key:1,class:"telegram-view__loading"},ae=h({__name:"telegram-view",setup(o){const t=te();return t.fetchUser(),(n,e)=>{const a=z;return b(t).moduleLoading?(i(),c("div",re,[_(a,{contrast:""})])):(i(),c("div",ne,[_(U,null,{title:f(()=>[s(" Привязка Telegram ")]),content:f(()=>{var g,d;return[_(W,{"telegram-username":(g=b(t).user)==null?void 0:g.telegramUsername,"telegram-id":(d=b(t).user)==null?void 0:d.telegramId,onBind:e[0]||(e[0]=l=>b(t).bindTelegram(l)),onUnbind:e[1]||(e[1]=l=>b(t).unbindTelegram())},null,8,["telegram-username","telegram-id"])]}),_:1}),_(U,null,{title:f(()=>[s(" Уведомления в Telegram ")]),content:f(()=>[_(ee)]),_:1})]))}}});const le=I(ae,[["__scopeId","data-v-37c9b0ef"]]);export{le as default};
