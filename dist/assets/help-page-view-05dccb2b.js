import{d as k,c as F,C as V,a as u,b as D,a5 as G,r as E,i as v,g as c,j as _,e as b,y as C,O as B,E as Q,_ as N,w as O,ac as H,af as R,ad as J,ag as K,x as A,v as L,P as M,a8 as X,ah as W,ai as z,T,t as x,aj as Y,f as S,u as h,ak as Z,al as j,W as ee,am as te,an as oe,A as ne,N as ae,p as le,l as se,D as ie,a7 as re,G as ce,a9 as de,aa as _e,ab as ue}from"./index-7b41356c.js";import{S as U}from"./settings-section-dc3f9d56.js";const P=k({__name:"category-select",props:{category:{}},emits:["update:category"],setup(g,{emit:l}){const y=g,s=l,o=F({get:()=>y.category?[y.category]:[],set:r=>s("update:category",r.at(0)||null)}),p=V.Services.FAQ,e=V.Services.UI;async function m(r){try{return p.searchCategories(r)}catch(a){e.openErrorModal("Не удалось загрузить категории",a.message)}}return(r,a)=>{const d=G;return u(),D(d,{modelValue:o.value,"onUpdate:modelValue":a[0]||(a[0]=i=>o.value=i),"fetch-function":m,label:"Выберите категорию","label-keys":["name"],"max-count":1},null,8,["modelValue"])}}}),pe={class:"create-category-form"},me={class:"row"},ge={class:"col-lg-6"},ve={class:"form-field"},ye={class:"col-lg-3"},fe={class:"form-field"},he={class:"col-lg-3"},be={class:"form-action"},Ce=k({__name:"create-category-form",emits:["create-category"],setup(g,{emit:l}){const y=l,s=V.Services.UI,o=E(p());function p(){return{name:"",order:0,parentCategory:null}}function e(){var m;if(o.value.name.length===0){s.openErrorModal("Введите название категории");return}if(o.value.name.length>254){s.openErrorModal("Название категории не должно превышать 254 символа");return}o.value.parentCategoryId=((m=o.value.parentCategory)==null?void 0:m.id)||null,y("create-category",o.value),setTimeout(()=>{o.value=p()},25)}return(m,r)=>{const a=B,d=Q;return u(),v("div",pe,[c("div",me,[c("div",ge,[c("div",ve,[_(a,{label:"Название категории",modelValue:o.value.name,"onUpdate:modelValue":r[0]||(r[0]=i=>o.value.name=i),type:"text"},null,8,["modelValue"])])]),c("div",ye,[c("div",fe,[_(P,{category:o.value.parentCategory,"onUpdate:category":r[1]||(r[1]=i=>o.value.parentCategory=i)},null,8,["category"])])]),c("div",he,[c("div",be,[_(d,{alignment:"stretch",onClick:r[2]||(r[2]=i=>e())},{default:b(()=>[C(" Создать ")]),_:1})])])])])}}});const $e=N(Ce,[["__scopeId","data-v-6feb553e"]]),ke={class:"create-article-form"},Se={class:"row"},we={class:"col-lg-6"},Me={class:"create-article-form__form-field"},Ve={class:"col-lg-6"},Ee={class:"create-article-form__form-field"},Ae={class:"create-article-form__form-field"},Te={class:"create-article-form__form-field"},xe=c("p",null,"Для кого видна статья?",-1),Ue={class:"create-article-form__form-actions"},De=k({__name:"create-article-form",emits:["create-article"],setup(g,{emit:l}){const y=l,s=V.Services.UI,o=E(p());O(o,()=>{const r=o.value.for;r.at(-1)==="all"&&r.length>1?o.value.for=["all"]:r.at(0)==="all"&&r.length>1&&(o.value.for=r.filter(a=>a!=="all"))},{deep:!0});function p(){return{order:0,title:"",content:H(),for:["all"],category:null}}const e=[{value:"all",label:"Все"},{value:"student",label:"Ученик"},{value:"mentor",label:"Куратор"},{value:"teacher",label:"Преподаватель"}];function m(){if(o.value.title.length<1){s.openErrorModal("Заголовок не может быть пустым");return}if(R(o.value.content)){s.openErrorModal("Содержание статьи не может быть пустым");return}if(o.value.for.length===0){s.openErrorModal("Необходимо выбрать хотя бы одну группу пользователей");return}if(!o.value.category){s.openErrorModal("Необходимо выбрать категорию");return}o.value.for.includes("all")&&(o.value.for=["all"]),y("create-article",o.value),setTimeout(()=>{o.value=p()},25)}return(r,a)=>{const d=B,i=J,n=K,t=Q;return u(),v("div",ke,[c("div",Se,[c("div",we,[c("div",Me,[_(d,{label:"Заголовок",modelValue:o.value.title,"onUpdate:modelValue":a[0]||(a[0]=f=>o.value.title=f),type:"text"},null,8,["modelValue"])])]),c("div",Ve,[c("div",Ee,[_(P,{category:o.value.category,"onUpdate:category":a[1]||(a[1]=f=>o.value.category=f)},null,8,["category"])])])]),c("div",Ae,[_(i,{label:"Содержание статьи",modelValue:o.value.content,"onUpdate:modelValue":a[2]||(a[2]=f=>o.value.content=f)},null,8,["modelValue"])]),c("div",Te,[xe,_(n,{"item-key":"value","item-label-key":"label",modelValue:o.value.for,"onUpdate:modelValue":a[3]||(a[3]=f=>o.value.for=f),items:e,multiple:""},null,8,["modelValue"])]),c("div",Ue,[_(t,{alignment:"right",onClick:a[4]||(a[4]=f=>m())},{default:b(()=>[C(" Создать ")]),_:1})])])}}}),Le=k({__name:"articles-table",props:{articles:{}},emits:["edit","delete"],setup(g,{emit:l}){const y=l,s=[{title:"Название",type:"text",value:d=>d.title},{title:"Категория",type:"text",value:d=>{var i;return((i=d.category)==null?void 0:i.name)||"-"}},{title:"Для",type:"text",value:d=>(d.for||[]).map(i=>{switch(i){case"admin":return"Администраторов";case"teacher":return"Преподавателей";case"student":return"Учеников";case"mentor":return"Кураторов";case"all":default:return"Всех"}}).join(", ")}];function o(d){return[{title:"Редактировать",icon:"edit",action:()=>{m(d)}},{title:"Удалить",icon:"delete",action:()=>{r(d)}}]}const p=A({visible:!1,article:null}),e=A({visible:!1,article:null});function m(d){p.article=d,p.visible=!0}function r(d){e.article=d,e.visible=!0}function a(){e.article&&y("delete",e.article),e.visible=!1}return(d,i)=>{const n=X,t=W;return u(),v(M,null,[_(n,{cols:s,data:d.articles,actions:o},null,8,["data"]),_(t,{visible:e.visible,"onUpdate:visible":i[0]||(i[0]=f=>e.visible=f),onConfirm:i[1]||(i[1]=f=>a())},{title:b(()=>[C(" Удаление статьи ")]),text:b(()=>{var f;return[C(' Вы уверены, что хотите удалить статью "'+L((f=e.article)==null?void 0:f.title)+'"? ',1)]}),_:1},8,["visible"])],64)}}}),I=g=>(le("data-v-9e3191c6"),g=g(),se(),g),Ie={class:"entity-table-container"},Fe={class:"entity-table"},Be=I(()=>c("th",null,null,-1)),Ne={key:0},Oe=["onClick"],Pe={key:0},qe=I(()=>c("b",null,"›",-1)),ze=[qe],Qe={key:0},We={key:1},Ge={key:2},He={key:0,class:"entity-table__actions"},Re={key:0,class:"entity-table__loading"},Je={class:"entity-table__loading__icon"},Ke={key:1,class:"entity-table__empty-text"},Xe=I(()=>c("b",null,"Контент не найден.",-1)),Ye=I(()=>c("br",null,null,-1)),Ze=k({__name:"tree-entity-table",props:{children:{type:Function},cols:{},data:{},isLoading:{type:Boolean},actions:{type:Function}},setup(g){const l=g,y=F(()=>s.value.filter(e=>!e.collapsed)),s=E(z(l.data,l.children));O(()=>l.data,()=>{s.value=z(l.data,l.children)});const o=A(l.cols.map(()=>Math.random().toString()));function p(e){var r;const m=(r=s.value.find(a=>a.parentId===e.id))==null?void 0:r.collapsed;s.value=s.value.map(a=>{var d;if(m){if(a.parentId===e.id)return{...a,collapsed:!1}}else if((d=a.parentIdChain)!=null&&d.includes(e.id))return{...a,collapsed:!0};return a})}return(e,m)=>{const r=oe,a=ne,d=ae;return u(),v("div",Ie,[c("table",Fe,[c("thead",null,[c("tr",null,[Be,(u(!0),v(M,null,T(e.cols,(i,n)=>(u(),v("th",{class:x(`col-type-${i.type}`),key:n,style:Y({width:i.width})},L(i.title),7))),128))])]),e.isLoading?S("",!0):(u(),v("tbody",Ne,[(u(!0),v(M,null,T(y.value,(i,n)=>(u(),v("tr",{onClick:t=>p(i),key:i.id},[c("td",{class:x(["coll-expander",`nesting-level-${i.nestingLevel}`])},[e.children(i)&&e.children(i).length?(u(),v("span",Pe,ze)):S("",!0)],2),(u(!0),v(M,null,T(e.cols,(t,f)=>(u(),v("td",{key:f,class:x([`col-type-${t.type}`,{"is-link":t.linkTo}])},[(u(!0),v(M,null,T(h(Z)(t,i,n),(w,$)=>{var q;return u(),v("span",{class:x(["table-cell",f===0?"table-cell--first":""]),key:o[$]},[(u(),D(ee(h(te)(t.type)),{value:w.value,alignment:t.alignment,design:typeof t.design=="function"?t.design(i):t.design,"is-loading":(q=t.isLoading)==null?void 0:q.call(t,i),"link-to":typeof t.linkTo=="function"?t.linkTo(i):t.linkTo,onAction:gt=>h(j)(t,i,f,o)},null,40,["value","alignment","design","is-loading","link-to","onAction"])),w.joinType==="br"?(u(),v("br",Qe)):w.joinType==="/"?(u(),v("span",We,"/")):w.joinType===","?(u(),v("span",Ge,",")):S("",!0)],2)}),128))],2))),128)),e.actions?(u(),v("td",He,[_(r,{items:e.actions(i)},null,8,["items"])])):S("",!0)],8,Oe))),128))]))]),e.isLoading?(u(),v("div",Re,[c("div",Je,[_(a,{contrast:""})])])):!s.value||!s.value.length?(u(),v("div",Ke,[_(d,{class:"entity-table__empty-text__img"}),Xe,C(),Ye,C(" Попробуйте изменить параметры поиска или перезагрузить страницу. ")])):S("",!0)])}}});const je=N(Ze,[["__scopeId","data-v-9e3191c6"]]),et={class:"edit-category-modal"},tt={class:"edit-category-modal__form"},ot={class:"edit-category-modal__form__field"},nt={class:"edit-category-modal__form__field"},at={key:0,class:"edit-category-modal__form__error"},lt=k({__name:"edit-category-modal",props:{visible:{type:Boolean},category:{}},emits:["update:visible","confirm"],setup(g,{emit:l}){const y=g,s=l,o=F({get:()=>y.visible,set:r=>s("update:visible",r)}),p=E(y.category);O(()=>y.category,r=>{p.value=r});const e=E("");function m(){if(p.value.parentCategory)e.value="";else{e.value="Выберите категорию";return}s("confirm",p.value)}return(r,a)=>{const d=B,i=ie,n=re;return u(),D(n,{type:"info",visible:o.value,"onUpdate:visible":a[2]||(a[2]=t=>o.value=t),title:"Редактирование категории",actions:[{label:"Сохранить",design:"primary",handler:m}]},{default:b(()=>[c("div",et,[c("div",tt,[c("div",ot,[_(d,{modelValue:p.value.name,"onUpdate:modelValue":a[0]||(a[0]=t=>p.value.name=t),label:"Название",type:"text"},null,8,["modelValue"])]),c("div",nt,[_(P,{category:p.value.parentCategory,"onUpdate:category":a[1]||(a[1]=t=>p.value.parentCategory=t)},null,8,["category"])]),e.value?(u(),v("div",at,[_(i,null,{default:b(()=>[C(L(e.value),1)]),_:1})])):S("",!0)])])]),_:1},8,["visible","actions"])}}});const st=N(lt,[["__scopeId","data-v-d0319fdc"]]),it={class:"categories-table"},rt=k({__name:"categories-table",props:{categories:{}},emits:["edit","delete"],setup(g,{emit:l}){const y=l,s=[{title:"Название",type:"text",value:n=>n.name},{title:"Дата создания/изменения",type:"date",value:n=>[n.createdAt,n.updatedAt],joinType:"/"}];function o(n){return n.childCategories}function p(n){return[{title:"Редактировать",icon:"edit",action:()=>r(n)},{title:"Удалить",icon:"delete",action:()=>a(n)}]}const e=A({visible:!1,item:null}),m=A({visible:!1,item:null});function r(n){e.visible=!0,e.item=n}function a(n){m.visible=!0,m.item=n}function d(){m.item&&y("delete",m.item)}function i(n){e.item&&y("edit",n)}return(n,t)=>{const f=je,w=W;return u(),v(M,null,[c("div",it,[_(f,{data:n.categories,cols:s,actions:p,children:o},null,8,["data"])]),_(w,{visible:m.visible,"onUpdate:visible":t[0]||(t[0]=$=>m.visible=$),onConfirm:t[1]||(t[1]=$=>d())},{title:b(()=>[C("Удаление категории")]),text:b(()=>{var $;return[C(' Вы уверены, что хотите удалить категорию "'+L(($=m.item)==null?void 0:$.name)+'" ? ',1)]}),_:1},8,["visible"]),e.item?(u(),D(st,{key:0,visible:e.visible,"onUpdate:visible":t[2]||(t[2]=$=>e.visible=$),category:e.item,onConfirm:t[3]||(t[3]=$=>i($))},null,8,["visible","category"])):S("",!0)],64)}}}),ct=ce("settings-module:help-page",()=>{const g=V.Services.FAQ,l=V.Services.UI,y=E([]),s=de(o);async function o(n){try{return g.getArticles(n)}catch(t){l.openErrorModal("Не удалось загрузить статьи",t.message)}}async function p(n){try{return g.getArticle(n,{showLoader:!0})}catch(t){l.openErrorModal("Не удалось загрузить статью",t.message)}}async function e(n){try{await g.createArticle(n,{showLoader:!0}),s.trigger()}catch(t){l.openErrorModal("Не удалось создать статью",t.message)}}async function m(n){try{await g.createCategory(n,{showLoader:!0}),a()}catch(t){l.openErrorModal("Не удалось создать категорию",t.message)}}async function r(n){try{await g.updateCategory(n.id,n,{showLoader:!0}),await a()}catch(t){l.openErrorModal("Не удалось обновить категорию",t.message)}}async function a(){try{const n=await g.getCategoryTree({showLoader:!0});y.value=n.data}catch(n){l.openErrorModal("Не удалось загрузить список категорий",n.message)}}async function d(n){try{await g.deleteArticle(n,{showLoader:!0}),s.trigger()}catch(t){l.openErrorModal("Не удалось удалить статью",t.message)}}async function i(n){try{await g.deleteCategory(n,{showLoader:!0}),await a()}catch(t){l.openErrorModal("Не удалось удалить категорию",t.message)}}return{articleSearch:s,fetchArticle:p,createArticle:e,deleteArticle:d,categoryTree:y,fetchCategoryTree:a,createCategory:m,updateCategory:r,deleteCategory:i}}),dt={class:"help-page-view"},_t={class:"help-page-view__articles"},ut={class:"help-page-view__articles__search"},pt={class:"help-page-view__articles__list"},mt={class:"help-page-view__articles__pagination"},ft=k({__name:"help-page-view",setup(g){const l=ct();return l.fetchCategoryTree(),(y,s)=>{const o=_e,p=ue;return u(),v("div",dt,[_(U,null,{title:b(()=>[C("Статьи")]),content:b(()=>[c("div",_t,[c("div",ut,[_(o,{modelValue:h(l).articleSearch.pagination.search,"onUpdate:modelValue":s[0]||(s[0]=e=>h(l).articleSearch.pagination.search=e),"is-loading":h(l).articleSearch.isListLoading},null,8,["modelValue","is-loading"])]),c("div",pt,[_(Le,{articles:h(l).articleSearch.results,onDelete:s[1]||(s[1]=e=>h(l).deleteArticle(e.id))},null,8,["articles"])]),c("div",mt,[_(p,{page:h(l).articleSearch.pagination.page,"onUpdate:page":s[2]||(s[2]=e=>h(l).articleSearch.pagination.page=e),total:h(l).articleSearch.resultsMeta.total,limit:h(l).articleSearch.pagination.limit},null,8,["page","total","limit"])])])]),_:1}),_(U,null,{title:b(()=>[C("Создать статью")]),content:b(()=>[_(De,{onCreateArticle:s[3]||(s[3]=e=>h(l).createArticle(e))})]),_:1}),_(U,null,{title:b(()=>[C("Категории")]),content:b(()=>[_(rt,{categories:h(l).categoryTree,onEdit:s[4]||(s[4]=e=>h(l).updateCategory(e)),onDelete:s[5]||(s[5]=e=>h(l).deleteCategory(e.id))},null,8,["categories"])]),_:1}),_(U,null,{title:b(()=>[C("Добавить категорию")]),content:b(()=>[_($e,{onCreateCategory:s[6]||(s[6]=e=>h(l).createCategory(e))})]),_:1})])}}});export{ft as default};