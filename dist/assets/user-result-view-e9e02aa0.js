import{a as S,c as m,o as p,h as E,w as y,f as w,c6 as V,b as f,e as c,F as I,B as C,v as h,d as T,C as b,O as N,r as v,A as Q,g as o,s as R,t as A,I as P,p as D,l as F,m as O}from"./index-227761f5.js";import{_ as j}from"./user-card-561c5601.js";import{p as L}from"./poll-question-7d87fe0d.js";import{u as z}from"./useDate-126c6fe0.js";const G=S({__name:"edit-answer-modal",props:{visible:{type:Boolean},question:{},answer:{}},emits:["update:visible","update:answer","submit"],setup(t,{emit:e}){const a=t,i=m({get:()=>a.answer,set:s=>e("update:answer",s)}),l=m({get:()=>a.visible,set:s=>e("update:visible",s)});return(s,r)=>{const _=V;return p(),E(_,{visible:l.value,"onUpdate:visible":r[1]||(r[1]=d=>l.value=d),title:"Редактирование ответа",type:"warning",actions:[{label:"Сохранить",design:"primary",handler:()=>e("submit")}]},{default:y(()=>[w(L,{answer:i.value,"onUpdate:answer":r[0]||(r[0]=d=>i.value=d),question:s.question,readonly:!1},null,8,["answer","question"])]),_:1},8,["visible","actions"])}}}),H={class:"answer-list"},J=c("div",{class:"answer-list__head"},[c("h2",null,"Ответы")],-1),K={class:"answer-list__list"},W=S({__name:"answer-list",props:{questions:{},answers:{}},emits:["edit"],setup(t,{emit:e}){const a=t;function i(l){return a.answers.find(s=>s.questionId===l)}return(l,s)=>(p(),f("div",H,[J,c("div",K,[(p(!0),f(I,null,C(a.questions,(r,_)=>(p(),f("div",{class:"answer-list__list__item",key:r.id},[i(r.id)?(p(),E(L,{key:0,readonly:"",question:r,answer:i(r.id),index:_,onEdit:d=>e("edit",i(r.id).id)},null,8,["question","answer","index","onEdit"])):h("",!0)]))),128))])]))}}),X=T("polls-module:user-result",()=>{const t=b.Services.UI,e=b.Services.Poll,a=b.Services.User,i=N(),l=v([]),s=v(),r=m(()=>{var n;return(n=u.value)==null?void 0:n.questions.find(B=>{var k;return B.id===((k=s.value)==null?void 0:k.questionId)})}),_=m(()=>i.params.username),d=m(()=>i.params.pollId),u=v(),g=v();async function M(){t.setLoading(!0);try{if(await U(),await $(),!g.value)throw new Error("Пользователь не найден");const n=await e.getAnswers(d.value,g.value.id);l.value=n.data}catch(n){t.openErrorModal("Не удалось загрузить ответы пользователя",n.message)}finally{t.setLoading(!1)}}async function U(){t.setLoading(!0);try{const n=await a.getUser(_.value);g.value=n.data}catch(n){t.openErrorModal("Не удалось загрузить пользователя",n.message)}finally{t.setLoading(!1)}}async function $(){t.setLoading(!0);try{const n=await e.getPoll(d.value);u.value=n.data}catch(n){t.openErrorModal("Не удалось загрузить опрос",n.message)}finally{t.setLoading(!1)}}async function x(){if(t.setLoading(!0),!s.value){t.openErrorModal("Ответ не выбран");return}try{await e.editAnswer(s.value.id,s.value),t.openSuccessModal("Ответы сохранены")}catch(n){t.openErrorModal("Не удалось сохранить ответы",n.message)}finally{t.setLoading(!1)}}return{user:g,poll:u,answers:l,fetchAnswers:M,submitAnswer:x,answerToEdit:s,currentQuestion:r}}),q=t=>(D("data-v-88c3d78e"),t=t(),F(),t),Y={key:0,class:"user-result-view"},Z={class:"user-result-view__sidebar"},ee=q(()=>c("h3",null,"Опрос:",-1)),se=q(()=>c("h3",null,"Дата голосования:",-1)),te=q(()=>c("h3",null,"Пользователь:",-1)),ne=S({__name:"user-result-view",setup(t){const e=X(),a=v(!1);e.fetchAnswers();function i(l){e.answerToEdit=e.answers.find(s=>s.id===l),a.value=!0}return(l,s)=>{const r=Q("router-link"),_=j,d=P;return p(),f(I,null,[o(e).user&&o(e).answers.length&&o(e).poll?(p(),f("div",Y,[w(d,null,{sidebar:y(()=>[c("div",Z,[w(r,{class:"user-result-view__back",to:`/poll/${o(e).poll.id}/results`},{default:y(()=>[R(" Назад ко всем результатам ")]),_:1},8,["to"]),ee,c("p",null,A(o(e).poll.title),1),se,c("p",null,A(o(z)(o(e).answers.at(0).createdAt,{precision:"day"}).toBeautiful()),1),te,w(_,{user:o(e).user},null,8,["user"])])]),content:y(()=>[w(W,{answers:o(e).answers,questions:o(e).poll.questions,onEdit:s[0]||(s[0]=u=>i(u))},null,8,["answers","questions"])]),_:1})])):h("",!0),o(e).currentQuestion?(p(),E(G,{key:1,answer:o(e).answerToEdit,"onUpdate:answer":s[1]||(s[1]=u=>o(e).answerToEdit=u),visible:a.value,"onUpdate:visible":s[2]||(s[2]=u=>a.value=u),question:o(e).currentQuestion,onSubmit:s[3]||(s[3]=u=>o(e).submitAnswer())},null,8,["answer","visible","question"])):h("",!0)],64)}}});const le=O(ne,[["__scopeId","data-v-88c3d78e"]]);export{le as default};
