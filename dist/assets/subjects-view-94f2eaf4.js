import{_ as g,a as m,j as b,g as l,k as c,Z as D,$ as O,d as k,x as C,P as M,T as N,u as j,C as S,f as y,e as d,y as p,v as F,aa as T,O as E,Q as A,X as G,p as P,l as Q,r as $,E as X,G as Z,b as q,A as z}from"./index-8bafb379.js";import{S as I}from"./settings-section-33eb9412.js";const H={},J={class:"info-block"},K={class:"info-block__icon"},R={class:"info-block__text"};function W(i,s){const r=O;return m(),b("div",J,[l("div",K,[c(r,{name:"info"})]),l("div",R,[D(i.$slots,"default",{},void 0,!0)])])}const Y=g(H,[["render",W],["__scopeId","data-v-18f8825e"]]),h=i=>(P("data-v-b784389f"),i=i(),Q(),i),ee={class:"subject-list"},te={class:"subject-list__item__name"},se={key:0,class:"subject-list__item__actions"},oe={class:"subject-list__item__actions__edit"},ne={class:"subject-list__item__actions__delete"},ce={key:0,class:"subject-list__no-items"},le=h(()=>l("p",null,"Пока нет предметов",-1)),_e=[le],ae=h(()=>l("br",null,null,-1)),ie=h(()=>l("br",null,null,-1)),ue=k({__name:"subject-list",props:{subjects:{}},emits:["update-subject","delete-subject"],setup(i,{emit:s}){const r=s,e=C({subject:null,isOpen:!1}),o=C({subject:null,isOpen:!1});function v(t){e.subject=t,e.isOpen=!0}function _(t){o.subject=t,o.isOpen=!0}function f(){e.subject&&r("update-subject",e.subject),e.subject=null}function a(){o.subject&&r("delete-subject",o.subject),o.subject=null}return(t,u)=>{const L=T,w=O,V=E,x=A,U=G;return m(),b(M,null,[l("div",ee,[(m(!0),b(M,null,N(t.subjects,n=>(m(),b("div",{class:"subject-list__item",key:n.id},[l("div",te,[c(L,{subject:n},null,8,["subject"])]),j(S).Context.roleIs(["admin"])?(m(),b("div",se,[l("div",oe,[c(w,{name:"edit",onClick:B=>v(n)},null,8,["onClick"])]),l("div",ne,[c(w,{name:"delete",onClick:B=>_(n)},null,8,["onClick"])])])):y("",!0)]))),128)),t.subjects.length===0?(m(),b("div",ce,_e)):y("",!0)]),c(x,{visible:e.isOpen,"onUpdate:visible":u[2]||(u[2]=n=>e.isOpen=n),onConfirm:u[3]||(u[3]=n=>f())},{title:d(()=>[p("Изменить предмет")]),text:d(()=>[c(V,{label:"Название предмета",modelValue:e.subject.name,"onUpdate:modelValue":u[0]||(u[0]=n=>e.subject.name=n),type:"text"},null,8,["modelValue"]),c(V,{label:"Цвет предмета",modelValue:e.subject.color,"onUpdate:modelValue":u[1]||(u[1]=n=>e.subject.color=n),type:"color"},null,8,["modelValue"])]),_:1},8,["visible"]),c(x,{visible:o.isOpen,"onUpdate:visible":u[4]||(u[4]=n=>o.isOpen=n),onConfirm:u[5]||(u[5]=n=>a())},{title:d(()=>{var n;return[p(' Удалить предмет "'+F((n=o.subject)==null?void 0:n.name)+'" ',1)]}),text:d(()=>[c(U,null,{default:d(()=>[p(" Вы уверены, что хотите удалить предмет?"),ae,p(" Это действие нельзя будет отменить. "),ie,p(" Перед удалением предмета нужно удалить все связанные с ним курсы и работы ")]),_:1})]),_:1},8,["visible"])],64)}}});const de=g(ue,[["__scopeId","data-v-b784389f"]]),re={class:"create-subject-form"},me={class:"row"},be={class:"col-md-6 col-12"},pe={class:"create-subject-form__form-field"},je={class:"col-md-3 col-6"},ve={class:"create-subject-form__form-field"},fe={class:"col-md-3 col-6"},Se={class:"create-subject-form__actions"},ge=k({__name:"create-subject-form",emits:["create-subject"],setup(i,{emit:s}){const r=s,e=$({name:"",color:""});function o(){r("create-subject",e.value)}return(v,_)=>{const f=E,a=X;return m(),b("div",re,[l("div",me,[l("div",be,[l("div",pe,[c(f,{modelValue:e.value.name,"onUpdate:modelValue":_[0]||(_[0]=t=>e.value.name=t),type:"text",label:"Название предмета",validators:[t=>t.length>2||"Название предмета должно содержать минимум 3 символа",t=>t.length<101||"Название предмета должно содержать максимум 100 символов"]},null,8,["modelValue","validators"])])]),l("div",je,[l("div",ve,[c(f,{type:"color",modelValue:e.value.color,"onUpdate:modelValue":_[1]||(_[1]=t=>e.value.color=t),label:"Цвет предмета"},null,8,["modelValue"])])]),l("div",fe,[l("div",Se,[c(a,{onClick:_[2]||(_[2]=t=>o()),alignment:"stretch",design:"primary"},{default:d(()=>[p(" Создать ")]),_:1})])])])])}}});const ye=g(ge,[["__scopeId","data-v-efa55358"]]),$e=Z("settings-module:subjects",()=>{const i=S.Services.Subject,s=S.Services.UI,r=$([]),e=$(!1);async function o(){e.value=!0;try{const a=await i.getSubjects();r.value=a.data,e.value=!1}catch(a){s.openErrorModal("Ошибка при загрузке списка предметов",a.message)}}async function v(a){try{await i.createSubject(a,{showLoader:!0}),s.openSuccessModal("Предмет успешно создан"),await o()}catch(t){s.openErrorModal("Ошибка при создании предмета",t.message)}}async function _(a){try{await i.updateSubject(a.id,a,{showLoader:!0}),s.openSuccessModal("Предмет успешно обновлен"),await o()}catch(t){s.openErrorModal("Ошибка при обновлении предмета",t.message)}}async function f(a){console.log("deleteSubject",a);try{await i.deleteSubject(a.id,{showLoader:!0}),s.openSuccessModal("Предмет успешно удален"),await o()}catch(t){s.openErrorModal("Ошибка при удалении предмета",t.message)}}return{moduleLoading:e,subjects:r,fetchSubjects:o,createSubject:v,updateSubject:_,deleteSubject:f}}),ke={key:0,class:"subjects-view"},he={class:"subjects-view__disclaimer"},we={key:1,class:"subjects-view__loading"},Ve=k({__name:"subjects-view",setup(i){const s=$e();return s.fetchSubjects(),(r,e)=>{const o=Y,v=z;return j(s).moduleLoading?(m(),b("div",we,[c(v,{contrast:""})])):(m(),b("div",ke,[l("div",he,[c(o,null,{default:d(()=>[p(" Добавлять, изменять и удалять предметы может только администратор ")]),_:1})]),c(I,null,{title:d(()=>[p("Предметы")]),content:d(()=>[c(de,{subjects:j(s).subjects,onUpdateSubject:e[0]||(e[0]=_=>j(s).updateSubject(_)),onDeleteSubject:e[1]||(e[1]=_=>j(s).deleteSubject(_))},null,8,["subjects"])]),_:1}),j(S).Context.roleIs(["admin"])?(m(),q(I,{key:0},{title:d(()=>[p("Добавить предмет")]),content:d(()=>[c(ye,{onCreateSubject:e[2]||(e[2]=_=>j(s).createSubject(_))})]),_:1})):y("",!0)]))}}});const Me=g(Ve,[["__scopeId","data-v-baac840d"]]);export{Me as default};
