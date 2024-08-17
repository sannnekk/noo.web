import{d as k,c as F,C as V,a as _,b as D,a1 as H,r as E,j as g,g as r,k as u,e as h,y as $,O as N,E as O,_ as L,w as q,a8 as R,ab as Z,a9 as J,ac as K,q as X,s as Y,ad as j,Z as Q,f as S,t as T,ae as ee,x as A,v as I,P as M,a4 as te,af as W,T as U,ag as oe,u as b,ah as ne,ai as ae,W as le,aj as se,ak as ie,A as re,N as ce,p as de,l as _e,D as ue,a3 as pe,G as me,a5 as ve,a6 as ge,a7 as ye}from"./index-8bafb379.js";import{S as x}from"./settings-section-33eb9412.js";const P=k({__name:"category-select",props:{category:{}},emits:["update:category"],setup(m,{emit:s}){const y=m,o=s,t=F({get:()=>y.category?[y.category]:[],set:c=>o("update:category",c.at(0)||null)}),p=V.Services.FAQ,e=V.Services.UI;async function v(c){try{return p.searchCategories(c)}catch(a){e.openErrorModal("Не удалось загрузить категории",a.message)}}return(c,a)=>{const d=H;return _(),D(d,{modelValue:t.value,"onUpdate:modelValue":a[0]||(a[0]=i=>t.value=i),"fetch-function":v,label:"Выберите категорию","label-keys":["name"],"max-count":1},null,8,["modelValue"])}}}),fe={class:"create-category-form"},he={class:"row"},be={class:"col-lg-6"},$e={class:"form-field"},Ce={class:"col-lg-3"},ke={class:"form-field"},Se={class:"col-lg-3"},we={class:"form-action"},Me=k({__name:"create-category-form",emits:["create-category"],setup(m,{emit:s}){const y=s,o=V.Services.UI,t=E(p());function p(){return{name:"",order:0,parentCategory:null}}function e(){var v;if(t.value.name.length===0){o.openErrorModal("Введите название категории");return}if(t.value.name.length>254){o.openErrorModal("Название категории не должно превышать 254 символа");return}t.value.parentCategoryId=((v=t.value.parentCategory)==null?void 0:v.id)||null,y("create-category",t.value),setTimeout(()=>{t.value=p()},25)}return(v,c)=>{const a=N,d=O;return _(),g("div",fe,[r("div",he,[r("div",be,[r("div",$e,[u(a,{label:"Название категории",modelValue:t.value.name,"onUpdate:modelValue":c[0]||(c[0]=i=>t.value.name=i),type:"text"},null,8,["modelValue"])])]),r("div",Ce,[r("div",ke,[u(P,{category:t.value.parentCategory,"onUpdate:category":c[1]||(c[1]=i=>t.value.parentCategory=i)},null,8,["category"])])]),r("div",Se,[r("div",we,[u(d,{alignment:"stretch",onClick:c[2]||(c[2]=i=>e())},{default:h(()=>[$(" Создать ")]),_:1})])])])])}}});const Ve=L(Me,[["__scopeId","data-v-6feb553e"]]),Ee={class:"create-article-form"},Te={class:"row"},Ae={class:"col-lg-6"},De={class:"create-article-form__form-field"},Ue={class:"col-lg-6"},xe={class:"create-article-form__form-field"},Le={class:"create-article-form__form-field"},Ie={class:"create-article-form__form-field"},Be=r("p",null,"Для кого видна статья?",-1),Fe={class:"create-article-form__form-actions"},Ne=k({__name:"create-article-form",emits:["create-article"],setup(m,{emit:s}){const y=s,o=V.Services.UI,t=E(p());q(t,()=>{const c=t.value.for;c.at(-1)==="all"&&c.length>1?t.value.for=["all"]:c.at(0)==="all"&&c.length>1&&(t.value.for=c.filter(a=>a!=="all"))},{deep:!0});function p(){return{order:0,title:"",content:R(),for:["all"],category:null}}const e=[{value:"all",label:"Все"},{value:"student",label:"Ученик"},{value:"mentor",label:"Куратор"},{value:"teacher",label:"Преподаватель"}];function v(){if(t.value.title.length<1){o.openErrorModal("Заголовок не может быть пустым");return}if(Z(t.value.content)){o.openErrorModal("Содержание статьи не может быть пустым");return}if(t.value.for.length===0){o.openErrorModal("Необходимо выбрать хотя бы одну группу пользователей");return}if(!t.value.category){o.openErrorModal("Необходимо выбрать категорию");return}t.value.for.includes("all")&&(t.value.for=["all"]),y("create-article",t.value),setTimeout(()=>{t.value=p()},25)}return(c,a)=>{const d=N,i=J,l=K,n=O;return _(),g("div",Ee,[r("div",Te,[r("div",Ae,[r("div",De,[u(d,{label:"Заголовок",modelValue:t.value.title,"onUpdate:modelValue":a[0]||(a[0]=f=>t.value.title=f),type:"text"},null,8,["modelValue"])])]),r("div",Ue,[r("div",xe,[u(P,{category:t.value.category,"onUpdate:category":a[1]||(a[1]=f=>t.value.category=f)},null,8,["category"])])])]),r("div",Le,[u(i,{label:"Содержание статьи",modelValue:t.value.content,"onUpdate:modelValue":a[2]||(a[2]=f=>t.value.content=f)},null,8,["modelValue"])]),r("div",Ie,[Be,u(l,{"item-key":"value","item-label-key":"label",modelValue:t.value.for,"onUpdate:modelValue":a[3]||(a[3]=f=>t.value.for=f),items:e,multiple:""},null,8,["modelValue"])]),r("div",Fe,[u(n,{alignment:"right",onClick:a[4]||(a[4]=f=>v())},{default:h(()=>[$(" Создать ")]),_:1})])])}}}),Oe={class:"sure-delete-modal__container"},qe={class:"sure-delete-modal__title"},Pe={class:"sure-delete-modal__text"},ze={class:"sure-delete-modal__buttons"},Qe=k({__name:"sure-delete-modal",props:{visible:{type:Boolean},actionsDisabled:{type:Boolean},stayOpen:{type:Boolean}},emits:["update:visible","confirm","cancel"],setup(m,{emit:s}){const y=m,o=s,t=()=>{o("update:visible",!1),o("cancel")},p=()=>{o("confirm"),y.stayOpen||o("update:visible",!1)};return(e,v)=>{const c=O,a=X("auto-animate");return _(),D(ee,{to:"body"},[Y((_(),g("div",{class:T(["sure-delete-modal",{"sure-delete-modal--visible":e.visible}])},[e.visible?(_(),g("div",{key:0,class:"sure-delete-modal__inner",onClick:j(t,["self"])},[r("div",Oe,[r("div",qe,[Q(e.$slots,"title",{},void 0,!0)]),r("div",Pe,[Q(e.$slots,"text",{},void 0,!0)]),r("div",ze,[u(c,{alignment:"stretch",onClick:t,design:"secondary",class:"sure-delete-modal__buttons__cancel",disabled:e.actionsDisabled},{default:h(()=>[$(" Отмена ")]),_:1},8,["disabled"]),u(c,{alignment:"stretch",onClick:p,design:"danger",class:"sure-delete-modal__buttons__confirm",disabled:e.actionsDisabled},{default:h(()=>[$(" Удалить ")]),_:1},8,["disabled"])])])])):S("",!0)],2)),[[a]])])}}});const G=L(Qe,[["__scopeId","data-v-c201b4b0"]]),We=k({__name:"articles-table",props:{articles:{}},emits:["edit","delete"],setup(m,{emit:s}){const y=s,o=[{title:"Название",type:"text",value:d=>d.title},{title:"Категория",type:"text",value:d=>{var i;return((i=d.category)==null?void 0:i.name)||"-"}},{title:"Для",type:"text",value:d=>(d.for||[]).map(i=>{switch(i){case"admin":return"Администраторов";case"teacher":return"Преподавателей";case"student":return"Учеников";case"mentor":return"Кураторов";case"all":default:return"Всех"}}).join(", ")}];function t(d){return[{title:"Редактировать",icon:"edit",action:()=>{v(d)}},{title:"Удалить",icon:"delete",action:()=>{c(d)}}]}const p=A({visible:!1,article:null}),e=A({visible:!1,article:null});function v(d){p.article=d,p.visible=!0}function c(d){e.article=d,e.visible=!0}function a(){e.article&&y("delete",e.article),e.visible=!1}return(d,i)=>{const l=te,n=G;return _(),g(M,null,[u(l,{cols:o,data:d.articles,actions:t},null,8,["data"]),u(n,{visible:e.visible,"onUpdate:visible":i[0]||(i[0]=f=>e.visible=f),onConfirm:i[1]||(i[1]=f=>a())},{title:h(()=>[$(" Удаление статьи ")]),text:h(()=>{var f;return[$(' Вы уверены, что хотите удалить статью "'+I((f=e.article)==null?void 0:f.title)+'"? ',1)]}),_:1},8,["visible"])],64)}}}),B=m=>(de("data-v-5122f41c"),m=m(),_e(),m),Ge={class:"entity-table-container"},He={class:"entity-table"},Re=B(()=>r("th",null,null,-1)),Ze={key:0},Je=["onClick"],Ke={key:0},Xe=B(()=>r("b",null,"›",-1)),Ye=[Xe],je={key:0},et={key:1},tt={key:2},ot={key:0,class:"entity-table__actions"},nt={key:0,class:"entity-table__loading"},at={class:"entity-table__loading__icon"},lt={key:1,class:"entity-table__empty-text"},st=B(()=>r("b",null,"Контент не найден.",-1)),it=B(()=>r("br",null,null,-1)),rt=k({__name:"tree-entity-table",props:{children:{type:Function},cols:{},data:{},isLoading:{type:Boolean},actions:{type:Function}},setup(m){const s=m,y=F(()=>(console.log(o.value),o.value.filter(e=>!e.collapsed))),o=E(W(s.data,s.children));q(()=>s.data,()=>{o.value=W(s.data,s.children)});const t=A(s.cols.map(()=>Math.random().toString()));function p(e){var c;const v=(c=o.value.find(a=>a.parentId===e.id))==null?void 0:c.collapsed;o.value=o.value.map(a=>{var d;if(v){if(a.parentId===e.id)return{...a,collapsed:!1}}else if((d=a.parentIdChain)!=null&&d.includes(e.id))return{...a,collapsed:!0};return a})}return(e,v)=>{const c=ie,a=re,d=ce;return _(),g("div",Ge,[r("table",He,[r("thead",null,[r("tr",null,[Re,(_(!0),g(M,null,U(e.cols,(i,l)=>(_(),g("th",{class:T(`col-type-${i.type}`),key:l,style:oe({width:i.width})},I(i.title),7))),128))])]),e.isLoading?S("",!0):(_(),g("tbody",Ze,[(_(!0),g(M,null,U(y.value,(i,l)=>(_(),g("tr",{onClick:n=>p(i),key:i.id},[r("td",{class:T(["coll-expander",`nesting-level-${i.nestingLevel}`])},[e.children(i)&&e.children(i).length?(_(),g("span",Ke,Ye)):S("",!0)],2),(_(!0),g(M,null,U(e.cols,(n,f)=>(_(),g("td",{key:f,class:T([`col-type-${n.type}`,{"is-link":n.linkTo}])},[(_(!0),g(M,null,U(b(ne)(n,i,l),(w,C)=>{var z;return _(),g("span",{class:T(["table-cell",f===0?"table-cell--first":""]),key:t[C]},[(_(),D(le(b(se)(n.type)),{value:w.value,alignment:n.alignment,design:typeof n.design=="function"?n.design(i):n.design,"is-loading":(z=n.isLoading)==null?void 0:z.call(n,i),"link-to":typeof n.linkTo=="function"?n.linkTo(i):n.linkTo,onAction:wt=>b(ae)(n,i,f,t)},null,40,["value","alignment","design","is-loading","link-to","onAction"])),w.joinType==="br"?(_(),g("br",je)):w.joinType==="/"?(_(),g("span",et,"/")):w.joinType===","?(_(),g("span",tt,",")):S("",!0)],2)}),128))],2))),128)),e.actions?(_(),g("td",ot,[u(c,{items:e.actions(i)},null,8,["items"])])):S("",!0)],8,Je))),128))]))]),e.isLoading?(_(),g("div",nt,[r("div",at,[u(a,{contrast:""})])])):!o.value||!o.value.length?(_(),g("div",lt,[u(d,{class:"entity-table__empty-text__img"}),st,$(),it,$(" Попробуйте изменить параметры поиска или перезагрузить страницу. ")])):S("",!0)])}}});const ct=L(rt,[["__scopeId","data-v-5122f41c"]]),dt={class:"edit-category-modal"},_t={class:"edit-category-modal__form"},ut={class:"edit-category-modal__form__field"},pt={class:"edit-category-modal__form__field"},mt={key:0,class:"edit-category-modal__form__error"},vt=k({__name:"edit-category-modal",props:{visible:{type:Boolean},category:{}},emits:["update:visible","confirm"],setup(m,{emit:s}){const y=m,o=s,t=F({get:()=>y.visible,set:c=>o("update:visible",c)}),p=E(y.category);q(()=>y.category,c=>{p.value=c});const e=E("");function v(){if(p.value.parentCategory)e.value="";else{e.value="Выберите категорию";return}o("confirm",p.value)}return(c,a)=>{const d=N,i=ue,l=pe;return _(),D(l,{type:"info",visible:t.value,"onUpdate:visible":a[2]||(a[2]=n=>t.value=n),title:"Редактирование категории",actions:[{label:"Сохранить",design:"primary",handler:v}]},{default:h(()=>[r("div",dt,[r("div",_t,[r("div",ut,[u(d,{modelValue:p.value.name,"onUpdate:modelValue":a[0]||(a[0]=n=>p.value.name=n),label:"Название",type:"text"},null,8,["modelValue"])]),r("div",pt,[u(P,{category:p.value.parentCategory,"onUpdate:category":a[1]||(a[1]=n=>p.value.parentCategory=n)},null,8,["category"])]),e.value?(_(),g("div",mt,[u(i,null,{default:h(()=>[$(I(e.value),1)]),_:1})])):S("",!0)])])]),_:1},8,["visible","actions"])}}});const gt=L(vt,[["__scopeId","data-v-d0319fdc"]]),yt={class:"categories-table"},ft=k({__name:"categories-table",props:{categories:{}},emits:["edit","delete"],setup(m,{emit:s}){const y=s,o=[{title:"Название",type:"text",value:l=>l.name},{title:"Дата создания/изменения",type:"date",value:l=>[l.createdAt,l.updatedAt],joinType:"/"}];function t(l){return l.childCategories}function p(l){return[{title:"Редактировать",icon:"edit",action:()=>c(l)},{title:"Удалить",icon:"delete",action:()=>a(l)}]}const e=A({visible:!1,item:null}),v=A({visible:!1,item:null});function c(l){e.visible=!0,e.item=l}function a(l){v.visible=!0,v.item=l}function d(){v.item&&y("delete",v.item)}function i(l){e.item&&y("edit",l)}return(l,n)=>{const f=ct,w=G;return _(),g(M,null,[r("div",yt,[u(f,{data:l.categories,cols:o,actions:p,children:t},null,8,["data"])]),u(w,{visible:v.visible,"onUpdate:visible":n[0]||(n[0]=C=>v.visible=C),onConfirm:n[1]||(n[1]=C=>d())},{title:h(()=>[$("Удаление категории")]),text:h(()=>{var C;return[$(' Вы уверены, что хотите удалить категорию "'+I((C=v.item)==null?void 0:C.name)+'" ? ',1)]}),_:1},8,["visible"]),e.item?(_(),D(gt,{key:0,visible:e.visible,"onUpdate:visible":n[2]||(n[2]=C=>e.visible=C),category:e.item,onConfirm:n[3]||(n[3]=C=>i(C))},null,8,["visible","category"])):S("",!0)],64)}}}),ht=me("settings-module:help-page",()=>{const m=V.Services.FAQ,s=V.Services.UI,y=E([]),o=ve(t);async function t(l){try{return m.getArticles(l)}catch(n){s.openErrorModal("Не удалось загрузить статьи",n.message)}}async function p(l){try{return m.getArticle(l,{showLoader:!0})}catch(n){s.openErrorModal("Не удалось загрузить статью",n.message)}}async function e(l){try{await m.createArticle(l,{showLoader:!0}),o.trigger()}catch(n){s.openErrorModal("Не удалось создать статью",n.message)}}async function v(l){try{await m.createCategory(l,{showLoader:!0}),a()}catch(n){s.openErrorModal("Не удалось создать категорию",n.message)}}async function c(l){try{await m.updateCategory(l.id,l,{showLoader:!0}),await a()}catch(n){s.openErrorModal("Не удалось обновить категорию",n.message)}}async function a(){try{const l=await m.getCategoryTree({showLoader:!0});y.value=l.data}catch(l){s.openErrorModal("Не удалось загрузить список категорий",l.message)}}async function d(l){try{await m.deleteArticle(l,{showLoader:!0}),o.trigger()}catch(n){s.openErrorModal("Не удалось удалить статью",n.message)}}async function i(l){try{await m.deleteCategory(l,{showLoader:!0}),await a()}catch(n){s.openErrorModal("Не удалось удалить категорию",n.message)}}return{articleSearch:o,fetchArticle:p,createArticle:e,deleteArticle:d,categoryTree:y,fetchCategoryTree:a,createCategory:v,updateCategory:c,deleteCategory:i}}),bt={class:"help-page-view"},$t={class:"help-page-view__articles"},Ct={class:"help-page-view__articles__search"},kt={class:"help-page-view__articles__list"},St={class:"help-page-view__articles__pagination"},Et=k({__name:"help-page-view",setup(m){const s=ht();return s.fetchCategoryTree(),(y,o)=>{const t=ge,p=ye;return _(),g("div",bt,[u(x,null,{title:h(()=>[$("Статьи")]),content:h(()=>[r("div",$t,[r("div",Ct,[u(t,{modelValue:b(s).articleSearch.pagination.search,"onUpdate:modelValue":o[0]||(o[0]=e=>b(s).articleSearch.pagination.search=e),"is-loading":b(s).articleSearch.isListLoading},null,8,["modelValue","is-loading"])]),r("div",kt,[u(We,{articles:b(s).articleSearch.results,onDelete:o[1]||(o[1]=e=>b(s).deleteArticle(e.id))},null,8,["articles"])]),r("div",St,[u(p,{page:b(s).articleSearch.pagination.page,"onUpdate:page":o[2]||(o[2]=e=>b(s).articleSearch.pagination.page=e),total:b(s).articleSearch.resultsMeta.total,limit:b(s).articleSearch.pagination.limit},null,8,["page","total","limit"])])])]),_:1}),u(x,null,{title:h(()=>[$("Создать статью")]),content:h(()=>[u(Ne,{onCreateArticle:o[3]||(o[3]=e=>b(s).createArticle(e))})]),_:1}),u(x,null,{title:h(()=>[$("Категории")]),content:h(()=>[u(ft,{categories:b(s).categoryTree,onEdit:o[4]||(o[4]=e=>b(s).updateCategory(e)),onDelete:o[5]||(o[5]=e=>b(s).deleteCategory(e.id))},null,8,["categories"])]),_:1}),u(x,null,{title:h(()=>[$("Добавить категорию")]),content:h(()=>[u(Ve,{onCreateCategory:o[6]||(o[6]=e=>b(s).createCategory(e))})]),_:1})])}}});export{Et as default};
