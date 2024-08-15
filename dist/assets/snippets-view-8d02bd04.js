import{d as V,r as k,a4 as E,C as x,a as u,j as v,g as l,k as _,e as m,y as f,L,a5 as I,E as N,_ as w,x as h,M,P as B,v as $,b as F,f as j,W as A,N as G,p as P,l as T,G as W,u as y,A as q}from"./index-eed45b92.js";import{S as U}from"./settings-section-4293c894.js";const z={class:"create-snippet-form"},H={class:"create-snippet-form__name"},J={class:"create-snippet-form__content"},K={class:"create-snippet-form__actions"},Q=V({__name:"create-snippet-form",emits:["create-snippet"],setup(r){const t=k({name:"",content:E(),userId:x.Context.User.id});return(i,e)=>{const n=L,c=I,S=N;return u(),v("div",z,[l("div",H,[_(n,{modelValue:t.value.name,"onUpdate:modelValue":e[0]||(e[0]=o=>t.value.name=o),label:"Название сниппета",type:"text",validators:[o=>o.length>0||"Название сниппета должно содержать хотя бы 1 символ",o=>o.length<=50||"Название сниппета не должно превышать 50 символов"]},null,8,["modelValue","validators"])]),l("div",J,[_(c,{label:"Сниппет",modelValue:t.value.content,"onUpdate:modelValue":e[1]||(e[1]=o=>t.value.content=o)},null,8,["modelValue"])]),l("div",K,[_(S,{onClick:e[2]||(e[2]=o=>i.$emit("create-snippet",t.value)),alignment:"right",design:"primary"},{default:m(()=>[f(" Создать сниппет ")]),_:1})])])}}});const R=w(Q,[["__scopeId","data-v-71f78365"]]),X=r=>(P("data-v-f34dfc17"),r=r(),T(),r),Y={key:0,class:"snippet-list"},Z={class:"snippet-list__item__index"},ee={class:"snippet-list__item__name"},te={class:"snippet-list__item__actions"},ne=["onClick"],se=["onClick"],ie={key:1,class:"snippet-list__no-snippets"},oe=X(()=>l("p",null,[f(" Сниппеты позволяют сохранить и использовать часто используемые фрагменты текста. "),l("br"),f(" Создайте свой первый сниппет! ")],-1)),pe=[oe],ae=V({__name:"snippet-list",props:{snippets:{}},emits:["update","delete"],setup(r,{emit:t}){const i=t,e=h({isOpen:!1,snippet:null}),n=h({isOpen:!1,snippet:null});function c(a){e.snippet=a,e.isOpen=!0}function S(a){n.snippet=a,n.isOpen=!0}function o(){n.snippet&&i("delete",n.snippet)}function p(){e.snippet&&i("update",e.snippet)}return(a,d)=>{const C=A,O=I,b=G;return u(),v(M,null,[a.snippets.length!==0?(u(),v("div",Y,[(u(!0),v(M,null,B(a.snippets,(s,g)=>(u(),v("div",{class:"snippet-list__item",key:s.id},[l("div",Z,[l("span",null,$(g+1),1)]),l("div",ee,[l("span",null,$(s.name),1)]),l("div",te,[l("div",{class:"snippet-list__item__actions__edit",onClick:D=>c(s)},[_(C,{name:"edit"})],8,ne),l("div",{class:"snippet-list__item__actions__delete",onClick:D=>S(s)},[_(C,{name:"delete"})],8,se)])]))),128))])):(u(),v("div",ie,pe)),_(b,{visible:e.isOpen,"onUpdate:visible":d[1]||(d[1]=s=>e.isOpen=s),onConfirm:d[2]||(d[2]=s=>p())},{title:m(()=>[f("Редактировать сниппет")]),text:m(()=>{var s;return[(s=e.snippet)!=null&&s.content?(u(),F(O,{key:0,label:"Сниппет",modelValue:e.snippet.content,"onUpdate:modelValue":d[0]||(d[0]=g=>e.snippet.content=g)},null,8,["modelValue"])):j("",!0)]}),_:1},8,["visible"]),_(b,{visible:n.isOpen,"onUpdate:visible":d[3]||(d[3]=s=>n.isOpen=s),onConfirm:d[4]||(d[4]=s=>o())},{title:m(()=>{var s;return[f('Удалить сниппет "'+$((s=n.snippet)==null?void 0:s.name)+'"',1)]}),text:m(()=>[f(" Вы уверены, что хотите удалить этот сниппет? ")]),_:1},8,["visible"])],64)}}});const le=w(ae,[["__scopeId","data-v-f34dfc17"]]),_e=W("settings-module:snippets",()=>{const r=x.Services.Snippet,t=x.Services.UI,i=k(!1),e=k([]);async function n(){i.value=!0;try{const p=await r.getSnippets();e.value=p.data}catch(p){t.openErrorModal("Ошибка при загрузке сниппетов",p.message)}finally{i.value=!1}}async function c(p){i.value=!0;try{await r.createSnippet(p),await n()}catch(a){t.openErrorModal("Ошибка при создании сниппета",a.message)}finally{i.value=!1}}async function S(p){i.value=!0;try{await r.updateSnippet(p.id,p),await n()}catch(a){t.openErrorModal("Ошибка при обновлении сниппета",a.message)}finally{i.value=!1}}async function o(p){i.value=!0;try{await r.deleteSnippet(p.id),await n()}catch(a){t.openErrorModal("Ошибка при удалении сниппета",a.message)}finally{i.value=!1}}return{moduleLoading:i,snippets:e,fetchSnippets:n,createSnippet:c,updateSnippet:S,deleteSnippet:o}}),re={key:0,class:"snippets-view"},ce={key:1,class:"snippets-view__loading"},de=V({__name:"snippets-view",setup(r){const t=_e();return t.fetchSnippets(),(i,e)=>{const n=q;return y(t).moduleLoading?(u(),v("div",ce,[_(n,{contrast:""})])):(u(),v("div",re,[_(U,null,{title:m(()=>[f(" Мои сниппеты ")]),content:m(()=>[_(le,{snippets:y(t).snippets,onUpdate:e[0]||(e[0]=c=>y(t).updateSnippet(c)),onDelete:e[1]||(e[1]=c=>y(t).deleteSnippet(c))},null,8,["snippets"])]),_:1}),_(U,null,{title:m(()=>[f(" Создать сниппет ")]),content:m(()=>[_(R,{onCreateSnippet:e[2]||(e[2]=c=>y(t).createSnippet(c))})]),_:1})]))}}});const ve=w(de,[["__scopeId","data-v-40727319"]]);export{ve as default};
