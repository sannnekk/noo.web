import{a as b,c as j,o as r,b as l,t as S,n as C,e as R,F as B,B as L,q as P,z as w,f as h,X as E,m as M,d as D,C as v,u as x,r as $}from"./index-227761f5.js";const z=b({__name:"inline-emoji",props:{name:{}},setup(n){const t=n,c=j(()=>{var s;return(s=_.find(e=>e.name===t.name))==null?void 0:s.emoji}),_=[{emoji:"👍",name:"like",unicode:"1f44d",html:"&#128077;"},{emoji:"👎",name:"dislike",unicode:"1f44e",html:"&#128078;"},{emoji:"😢",name:"sad",unicode:"1f622",html:"&#128546;"},{emoji:"🤯",name:"mindblowing",unicode:"1f92f",html:"&#129327;"},{emoji:"😀",name:"happy",unicode:"1f600",html:"&#128512;"}];return(s,e)=>(r(),l("span",null,S(c.value),1))}}),F={class:"blogpost-reactions"},N={class:"blogpost-reactions__list"},T=["onClick"],U={key:0,class:"blogpost-reactions__list__item__value"},V={key:1,class:"blogpost-reactions__list__item__value"},q=b({__name:"blogpost-reactions",props:{reactions:{},myReaction:{},loading:{type:Boolean}},emits:["react"],setup(n,{emit:t}){const c=n,_=j(()=>Object.entries(c.reactions).map(([f,m])=>({reaction:f,count:m})));function s(e){c.loading||t("react",e)}return(e,f)=>{const m=z,g=E,d=C("auto-animate");return r(),l("div",F,[R("div",N,[(r(!0),l(B,null,L(_.value,a=>P((r(),l("div",{class:w(["blogpost-reactions__list__item",{"blogpost-reactions__list__item--active":a.reaction===e.myReaction}]),key:a.reaction,onClick:o=>s(a.reaction)},[h(m,{name:a.reaction},null,8,["name"]),e.loading?(r(),l("span",V,[h(g,{contrast:""})])):(r(),l("span",U,S(a.count),1))],10,T)),[[d]])),128))])])}}});const X=M(q,[["__scopeId","data-v-e7ff2e2f"]]),G=D("blog-module:blog",()=>{const n=v.Services.Blog,t=v.Services.UI;v.Services.User;const{pagination:c,isListLoading:_,results:s,resultsMeta:e,trigger:f}=x(m,{debounceTime:1e3,immediate:!0,initialPagination:{page:1,limit:5,sort:"createdAt",order:"DESC"}});async function m(o){try{return await n.getPosts(o)}catch(i){t.openErrorModal("Произошла ошибка при получении постов",i.message)}}async function g(o){t.setLoading(!0);try{await n.deletePost(o),f()}catch(i){t.openErrorModal("Ошибка при удалении поста",i.message)}finally{t.setLoading(!1)}}const d=$(!1);async function a(o,i){d.value=!0;try{let u=o,p=o;typeof o!="string"?u=o.id:p=s.value.find(k=>k.id===u);const y=await n.toggleReaction(u,i);p&&y.data&&(p.reactionCounts=y.data,p.myReaction=p.myReaction===i?void 0:i)}catch(u){t.openErrorModal("Ошибка при реакции на пост",u.message)}finally{d.value=!1}}return{results:s,resultsMeta:e,isListLoading:_,pagination:c,deletePost:g,isReactionLoading:d,reactToPost:a}});export{X as b,G as u};
