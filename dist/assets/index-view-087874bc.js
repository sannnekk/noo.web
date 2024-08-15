import{d as M,r as A,o as J,h as K,c as x,w as R,n as Y,a as w,b as L,e as E,u as k,f as O,g as i,_ as I,i as Z,j as P,k as g,p as q,l as N,m as Q,q as H,s as j,t as W,v as B,x as U,y as $,z as X,C as b,A as ee,B as te,D as se,E as oe,F as ne,G as re,H as ae,I as ie,J as D,K as ue}from"./index-eed45b92.js";var le=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function de(u){return u&&u.__esModule&&Object.prototype.hasOwnProperty.call(u,"default")?u.default:u}var F={},ce={get exports(){return F},set exports(u){F=u}};/*!
 * 
 *   typed.js - A JavaScript Typing Animation Library
 *   Author: Matt Boldt <me@mattboldt.com>
 *   Version: v2.0.12
 *   Url: https://github.com/mattboldt/typed.js
 *   License(s): MIT
 * 
 */(function(u,d){(function(f,o){u.exports=o()})(le,function(){return function(f){var o={};function n(_){if(o[_])return o[_].exports;var a=o[_]={exports:{},id:_,loaded:!1};return f[_].call(a.exports,a,a.exports,n),a.loaded=!0,a.exports}return n.m=f,n.c=o,n.p="",n(0)}([function(f,o,n){Object.defineProperty(o,"__esModule",{value:!0});var _=function(){function p(s,r){for(var t=0;t<r.length;t++){var e=r[t];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(s,e.key,e)}}return function(s,r,t){return r&&p(s.prototype,r),t&&p(s,t),s}}();function a(p,s){if(!(p instanceof s))throw new TypeError("Cannot call a class as a function")}var y=n(1),C=n(3),h=function(){function p(s,r){a(this,p),y.initializer.load(this,r,s),this.begin()}return _(p,[{key:"toggle",value:function(){this.pause.status?this.start():this.stop()}},{key:"stop",value:function(){this.typingComplete||this.pause.status||(this.toggleBlinking(!0),this.pause.status=!0,this.options.onStop(this.arrayPos,this))}},{key:"start",value:function(){this.typingComplete||this.pause.status&&(this.pause.status=!1,this.pause.typewrite?this.typewrite(this.pause.curString,this.pause.curStrPos):this.backspace(this.pause.curString,this.pause.curStrPos),this.options.onStart(this.arrayPos,this))}},{key:"destroy",value:function(){this.reset(!1),this.options.onDestroy(this)}},{key:"reset",value:function(){var s=arguments.length<=0||arguments[0]===void 0?!0:arguments[0];clearInterval(this.timeout),this.replaceText(""),this.cursor&&this.cursor.parentNode&&(this.cursor.parentNode.removeChild(this.cursor),this.cursor=null),this.strPos=0,this.arrayPos=0,this.curLoop=0,s&&(this.insertCursor(),this.options.onReset(this),this.begin())}},{key:"begin",value:function(){var s=this;this.options.onBegin(this),this.typingComplete=!1,this.shuffleStringsIfNeeded(this),this.insertCursor(),this.bindInputFocusEvents&&this.bindFocusEvents(),this.timeout=setTimeout(function(){!s.currentElContent||s.currentElContent.length===0?s.typewrite(s.strings[s.sequence[s.arrayPos]],s.strPos):s.backspace(s.currentElContent,s.currentElContent.length)},this.startDelay)}},{key:"typewrite",value:function(s,r){var t=this;this.fadeOut&&this.el.classList.contains(this.fadeOutClass)&&(this.el.classList.remove(this.fadeOutClass),this.cursor&&this.cursor.classList.remove(this.fadeOutClass));var e=this.humanizer(this.typeSpeed),c=1;if(this.pause.status===!0){this.setPauseStatus(s,r,!0);return}this.timeout=setTimeout(function(){r=C.htmlParser.typeHtmlChars(s,r,t);var v=0,m=s.substr(r);if(m.charAt(0)==="^"&&/^\^\d+/.test(m)){var V=1;m=/\d+/.exec(m)[0],V+=m.length,v=parseInt(m),t.temporaryPause=!0,t.options.onTypingPaused(t.arrayPos,t),s=s.substring(0,r)+s.substring(r+V),t.toggleBlinking(!0)}if(m.charAt(0)==="`"){for(;s.substr(r+c).charAt(0)!=="`"&&(c++,!(r+c>s.length)););var S=s.substring(0,r),T=s.substring(S.length+1,r+c),l=s.substring(r+c+1);s=S+T+l,c--}t.timeout=setTimeout(function(){t.toggleBlinking(!1),r>=s.length?t.doneTyping(s,r):t.keepTyping(s,r,c),t.temporaryPause&&(t.temporaryPause=!1,t.options.onTypingResumed(t.arrayPos,t))},v)},e)}},{key:"keepTyping",value:function(s,r,t){r===0&&(this.toggleBlinking(!1),this.options.preStringTyped(this.arrayPos,this)),r+=t;var e=s.substr(0,r);this.replaceText(e),this.typewrite(s,r)}},{key:"doneTyping",value:function(s,r){var t=this;this.options.onStringTyped(this.arrayPos,this),this.toggleBlinking(!0),!(this.arrayPos===this.strings.length-1&&(this.complete(),this.loop===!1||this.curLoop===this.loopCount))&&(this.timeout=setTimeout(function(){t.backspace(s,r)},this.backDelay))}},{key:"backspace",value:function(s,r){var t=this;if(this.pause.status===!0){this.setPauseStatus(s,r,!1);return}if(this.fadeOut)return this.initFadeOut();this.toggleBlinking(!1);var e=this.humanizer(this.backSpeed);this.timeout=setTimeout(function(){r=C.htmlParser.backSpaceHtmlChars(s,r,t);var c=s.substr(0,r);if(t.replaceText(c),t.smartBackspace){var v=t.strings[t.arrayPos+1];v&&c===v.substr(0,r)?t.stopNum=r:t.stopNum=0}r>t.stopNum?(r--,t.backspace(s,r)):r<=t.stopNum&&(t.arrayPos++,t.arrayPos===t.strings.length?(t.arrayPos=0,t.options.onLastStringBackspaced(),t.shuffleStringsIfNeeded(),t.begin()):t.typewrite(t.strings[t.sequence[t.arrayPos]],r))},e)}},{key:"complete",value:function(){this.options.onComplete(this),this.loop?this.curLoop++:this.typingComplete=!0}},{key:"setPauseStatus",value:function(s,r,t){this.pause.typewrite=t,this.pause.curString=s,this.pause.curStrPos=r}},{key:"toggleBlinking",value:function(s){this.cursor&&(this.pause.status||this.cursorBlinking!==s&&(this.cursorBlinking=s,s?this.cursor.classList.add("typed-cursor--blink"):this.cursor.classList.remove("typed-cursor--blink")))}},{key:"humanizer",value:function(s){return Math.round(Math.random()*s/2)+s}},{key:"shuffleStringsIfNeeded",value:function(){this.shuffle&&(this.sequence=this.sequence.sort(function(){return Math.random()-.5}))}},{key:"initFadeOut",value:function(){var s=this;return this.el.className+=" "+this.fadeOutClass,this.cursor&&(this.cursor.className+=" "+this.fadeOutClass),setTimeout(function(){s.arrayPos++,s.replaceText(""),s.strings.length>s.arrayPos?s.typewrite(s.strings[s.sequence[s.arrayPos]],0):(s.typewrite(s.strings[0],0),s.arrayPos=0)},this.fadeOutDelay)}},{key:"replaceText",value:function(s){this.attr?this.el.setAttribute(this.attr,s):this.isInput?this.el.value=s:this.contentType==="html"?this.el.innerHTML=s:this.el.textContent=s}},{key:"bindFocusEvents",value:function(){var s=this;this.isInput&&(this.el.addEventListener("focus",function(r){s.stop()}),this.el.addEventListener("blur",function(r){s.el.value&&s.el.value.length!==0||s.start()}))}},{key:"insertCursor",value:function(){this.showCursor&&(this.cursor||(this.cursor=document.createElement("span"),this.cursor.className="typed-cursor",this.cursor.setAttribute("aria-hidden",!0),this.cursor.innerHTML=this.cursorChar,this.el.parentNode&&this.el.parentNode.insertBefore(this.cursor,this.el.nextSibling)))}}]),p}();o.default=h,f.exports=o.default},function(f,o,n){Object.defineProperty(o,"__esModule",{value:!0});var _=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var c=arguments[e];for(var v in c)Object.prototype.hasOwnProperty.call(c,v)&&(t[v]=c[v])}return t},a=function(){function t(e,c){for(var v=0;v<c.length;v++){var m=c[v];m.enumerable=m.enumerable||!1,m.configurable=!0,"value"in m&&(m.writable=!0),Object.defineProperty(e,m.key,m)}}return function(e,c,v){return c&&t(e.prototype,c),v&&t(e,v),e}}();function y(t){return t&&t.__esModule?t:{default:t}}function C(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}var h=n(2),p=y(h),s=function(){function t(){C(this,t)}return a(t,[{key:"load",value:function(e,c,v){if(typeof v=="string"?e.el=document.querySelector(v):e.el=v,e.options=_({},p.default,c),e.isInput=e.el.tagName.toLowerCase()==="input",e.attr=e.options.attr,e.bindInputFocusEvents=e.options.bindInputFocusEvents,e.showCursor=e.isInput?!1:e.options.showCursor,e.cursorChar=e.options.cursorChar,e.cursorBlinking=!0,e.elContent=e.attr?e.el.getAttribute(e.attr):e.el.textContent,e.contentType=e.options.contentType,e.typeSpeed=e.options.typeSpeed,e.startDelay=e.options.startDelay,e.backSpeed=e.options.backSpeed,e.smartBackspace=e.options.smartBackspace,e.backDelay=e.options.backDelay,e.fadeOut=e.options.fadeOut,e.fadeOutClass=e.options.fadeOutClass,e.fadeOutDelay=e.options.fadeOutDelay,e.isPaused=!1,e.strings=e.options.strings.map(function(l){return l.trim()}),typeof e.options.stringsElement=="string"?e.stringsElement=document.querySelector(e.options.stringsElement):e.stringsElement=e.options.stringsElement,e.stringsElement){e.strings=[],e.stringsElement.style.display="none";var m=Array.prototype.slice.apply(e.stringsElement.children),V=m.length;if(V)for(var S=0;S<V;S+=1){var T=m[S];e.strings.push(T.innerHTML.trim())}}e.strPos=0,e.arrayPos=0,e.stopNum=0,e.loop=e.options.loop,e.loopCount=e.options.loopCount,e.curLoop=0,e.shuffle=e.options.shuffle,e.sequence=[],e.pause={status:!1,typewrite:!0,curString:"",curStrPos:0},e.typingComplete=!1;for(var S in e.strings)e.sequence[S]=S;e.currentElContent=this.getCurrentElContent(e),e.autoInsertCss=e.options.autoInsertCss,this.appendAnimationCss(e)}},{key:"getCurrentElContent",value:function(e){var c="";return e.attr?c=e.el.getAttribute(e.attr):e.isInput?c=e.el.value:e.contentType==="html"?c=e.el.innerHTML:c=e.el.textContent,c}},{key:"appendAnimationCss",value:function(e){var c="data-typed-js-css";if(e.autoInsertCss&&!(!e.showCursor&&!e.fadeOut)&&!document.querySelector("["+c+"]")){var v=document.createElement("style");v.type="text/css",v.setAttribute(c,!0);var m="";e.showCursor&&(m+=`
        .typed-cursor{
          opacity: 1;
        }
        .typed-cursor.typed-cursor--blink{
          animation: typedjsBlink 0.7s infinite;
          -webkit-animation: typedjsBlink 0.7s infinite;
                  animation: typedjsBlink 0.7s infinite;
        }
        @keyframes typedjsBlink{
          50% { opacity: 0.0; }
        }
        @-webkit-keyframes typedjsBlink{
          0% { opacity: 1; }
          50% { opacity: 0.0; }
          100% { opacity: 1; }
        }
      `),e.fadeOut&&(m+=`
        .typed-fade-out{
          opacity: 0;
          transition: opacity .25s;
        }
        .typed-cursor.typed-cursor--blink.typed-fade-out{
          -webkit-animation: 0;
          animation: 0;
        }
      `),v.length!==0&&(v.innerHTML=m,document.body.appendChild(v))}}}]),t}();o.default=s;var r=new s;o.initializer=r},function(f,o){Object.defineProperty(o,"__esModule",{value:!0});var n={strings:["These are the default values...","You know what you should do?","Use your own!","Have a great day!"],stringsElement:null,typeSpeed:0,startDelay:0,backSpeed:0,smartBackspace:!0,shuffle:!1,backDelay:700,fadeOut:!1,fadeOutClass:"typed-fade-out",fadeOutDelay:500,loop:!1,loopCount:1/0,showCursor:!0,cursorChar:"|",autoInsertCss:!0,attr:null,bindInputFocusEvents:!1,contentType:"html",onBegin:function(_){},onComplete:function(_){},preStringTyped:function(_,a){},onStringTyped:function(_,a){},onLastStringBackspaced:function(_){},onTypingPaused:function(_,a){},onTypingResumed:function(_,a){},onReset:function(_){},onStop:function(_,a){},onStart:function(_,a){},onDestroy:function(_){}};o.default=n,f.exports=o.default},function(f,o){Object.defineProperty(o,"__esModule",{value:!0});var n=function(){function C(h,p){for(var s=0;s<p.length;s++){var r=p[s];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(h,r.key,r)}}return function(h,p,s){return p&&C(h.prototype,p),s&&C(h,s),h}}();function _(C,h){if(!(C instanceof h))throw new TypeError("Cannot call a class as a function")}var a=function(){function C(){_(this,C)}return n(C,[{key:"typeHtmlChars",value:function(h,p,s){if(s.contentType!=="html")return p;var r=h.substr(p).charAt(0);if(r==="<"||r==="&"){var t="";for(r==="<"?t=">":t=";";h.substr(p+1).charAt(0)!==t&&(p++,!(p+1>h.length)););p++}return p}},{key:"backSpaceHtmlChars",value:function(h,p,s){if(s.contentType!=="html")return p;var r=h.substr(p).charAt(0);if(r===">"||r===";"){var t="";for(r===">"?t="<":t="&";h.substr(p-1).charAt(0)!==t&&(p--,!(p<0)););p--}return p}}]),C}();o.default=a;var y=new a;o.htmlParser=y}])})})(ce);const pe=de(F),fe=M({name:"Typed",props:{options:{type:Object,required:!0}},setup(u,d){const f=A();return J(()=>new pe(f.value.querySelector(".typing"),u.options)),()=>K("div",{ref:f,class:"typed-element"},d.slots.default())}}),_e=i("span",{class:"typing"},null,-1),ve=M({__name:"typing-text",props:{words:{},speed:{}},setup(u){const d=u,f=A(!0),o=x(()=>({strings:d.words,typeSpeed:d.speed,loop:!0,smartBackspace:!0}));return R(o,()=>{f.value=!1,Y(()=>{f.value=!0})}),(n,_)=>f.value?(w(),L(k(fe),{key:0,options:o.value},{default:E(()=>[_e]),_:1},8,["options"])):O("",!0)}}),me="/img/auth-icon-space.svg";const he={},ge=u=>(q("data-v-a42b0478"),u=u(),N(),u),ye={class:"auth-icon-space"},we={class:"auth-icon-space__logo"},Ce={class:"auth-icon-space__text"},ke=ge(()=>i("div",{class:"auth-icon-space__image"},[i("img",{src:me,alt:"Auth Icon Space"})],-1));function be(u,d){const f=Z("logo"),o=ve;return w(),P("div",ye,[i("div",we,[g(f)]),i("div",Ce,[g(o,{words:["Ты можешь поступить на бюджет туда, куда хочешь!","Здесь заканчиваются твои проблемы в подготовке!","Ты можешь больше! Ты можешь лучше!"],speed:50})]),ke])}const Pe=I(he,[["render",be],["__scopeId","data-v-a42b0478"]]);const Se={},$e=u=>(q("data-v-bce9a5d3"),u=u(),N(),u),Ee={class:"round-logo"},Ve=$e(()=>i("div",{class:"round-logo__circle"},[i("div",{class:"round-logo__circle--bordered"},[i("img",{src:Q,alt:"Логотип НОО",class:"round-logo__circle__img"})])],-1)),xe=[Ve];function Ie(u,d){return w(),P("div",Ee,xe)}const Te=I(Se,[["render",Ie],["__scopeId","data-v-bce9a5d3"]]),Oe={class:"auth-titles"},Me={class:"auth-titles__title"},Le=M({__name:"auth-titles",props:{mode:{}},setup(u){const d=u,f=x(()=>d.mode==="login"?"Вход в систему":d.mode==="register"?"Регистрация":d.mode==="forgot-password"?"Восстановление пароля":"Подтверждение почты");return(o,n)=>{const _=Te,a=H("auto-animate");return j((w(),P("div",Oe,[i("div",{class:W(["auth-titles__image",o.mode==="register"?"auth-titles__image--register":"auth-titles__image--login"])},[g(_)],2),i("h1",Me,B(f.value),1)])),[[a]])}}});const Be=I(Le,[["__scopeId","data-v-e8cc1cba"]]),Ue={key:0,class:"username-validation"},Ae={key:0,class:"username-validation__loading"},qe={key:1,class:"username-validation__not-available"},Ne={key:2,class:"username-validation__not-available"},De={key:3,class:"username-validation__available"},je=M({__name:"username-validation",props:{username:{},valid:{type:Boolean}},emits:["update:valid"],setup(u,{emit:d}){const f=u,o=d,n=U({exists:void 0,loading:!1,error:!1}),_=X(async()=>{if(!f.username){n.exists=!1,n.error=!0,n.loading=!1,o("update:valid",!1);return}if(f.username.length<3){n.exists=!1,n.error=!0,n.loading=!1,o("update:valid",!1);return}if(!f.username.match(/^[A-Za-z0-9_-]+$/i)){n.error=!0,n.exists=!1,n.loading=!1,o("update:valid",!1);return}n.error=!1;try{const a=await b.Services.Auth.checkUsername(f.username);n.exists=a,o("update:valid",!a)}catch{n.exists=!0,n.loading=!1,o("update:valid",!1)}finally{n.loading=!1}},500);return R(()=>f.username,async()=>{n.loading=!0,await _()}),(a,y)=>{const C=ee;return n.exists!==void 0&&a.username?(w(),P("p",Ue,[n.loading?(w(),P("span",Ae,[g(C,{contrast:""}),$(" Проверка... ")])):n.exists?(w(),P("span",qe," Никнейм занят ")):n.error?(w(),P("span",Ne," Никнейм должен быть хотя б 3 символа в длину и содержать только латинские буквы, цифры и символы _ и - ")):(w(),P("span",De," Никнейм свободен "))])):O("",!0)}}});const Fe=I(je,[["__scopeId","data-v-100b91f0"]]),z=u=>(q("data-v-add7f324"),u=u(),N(),u),Re={class:"auth-form"},He={key:0,class:"auth-form__inner"},ze={class:"auth-form__group"},Ge={class:"auth-form__group"},Je={class:"auth-form__group"},Ke={class:"auth-form__group"},Ye={class:"auth-form__group__login"},Ze={class:"auth-form__group__register"},Qe={key:1,class:"auth-form__inner"},We={class:"auth-form__group"},Xe={class:"auth-form__group"},et={class:"auth-form__group"},tt={class:"auth-form__group"},st={class:"auth-form__group"},ot={class:"auth-form__group"},nt={class:"auth-form__group"},rt={class:"auth-form__group__login"},at={class:"auth-form__group__register"},it=z(()=>i("br",null,null,-1)),ut={key:2,class:"auth-form__inner"},lt={class:"auth-form__group"},dt={class:"auth-form__group"},ct={class:"auth-form__group"},pt={class:"auth-form__group__login"},ft={class:"auth-form__group__register"},_t=z(()=>i("br",null,null,-1)),vt={key:3,class:"auth-form__inner"},mt={class:"auth-form__group"},ht={class:"auth-form__group"},gt={class:"auth-form__group"},yt={class:"auth-form__group__login"},wt={class:"auth-form__group__register"},Ct=M({__name:"auth-form",props:{authCredentials:{},registerCredentials:{},forgotPasswordCredentials:{},resendVerificationCredentials:{},mode:{},isLoading:{type:Boolean},error:{}},emits:["update:authCredentials","update:registerCredentials","update:forgotPasswordCredentials","update:resendVerificationCredentials","update:mode","login","register","forgot-password","resend-verification"],setup(u,{emit:d}){const f=u,o=d,n=x({get:()=>f.mode,set:t=>o("update:mode",t)}),_=x({get:()=>f.authCredentials,set:t=>o("update:authCredentials",t)}),a=x({get:()=>f.registerCredentials,set:t=>o("update:registerCredentials",t)}),y=x({get:()=>f.forgotPasswordCredentials,set:t=>o("update:forgotPasswordCredentials",t)}),C=x({get:()=>f.resendVerificationCredentials,set:t=>o("update:resendVerificationCredentials",t)});function h(){o("login")}function p(){o("register")}function s(){o("forgot-password")}function r(){o("resend-verification")}return(t,e)=>{const c=te,v=se,m=oe,V=Fe,S=ne,T=H("auto-animate");return j((w(),P("div",Re,[n.value==="login"?(w(),P("div",He,[i("div",ze,[g(c,{modelValue:_.value.usernameOrEmail,"onUpdate:modelValue":e[0]||(e[0]=l=>_.value.usernameOrEmail=l),modelModifiers:{trim:!0},placeholder:"Email или никнейм",onEnterPress:e[1]||(e[1]=l=>h())},null,8,["modelValue"])]),i("div",Ge,[g(c,{modelValue:_.value.password,"onUpdate:modelValue":e[2]||(e[2]=l=>_.value.password=l),placeholder:"Пароль",onEnterPress:e[3]||(e[3]=l=>h()),password:""},null,8,["modelValue"])]),i("div",Je,[t.error?(w(),L(v,{key:0},{default:E(()=>[$(B(t.error),1)]),_:1})):O("",!0)]),i("div",Ke,[i("div",Ye,[g(m,{contrast:"",alignment:"center",loading:t.isLoading,onClick:e[4]||(e[4]=l=>h())},{default:E(()=>[$(" Войти ")]),_:1},8,["loading"])]),i("div",Ze,[i("span",{onClick:e[5]||(e[5]=l=>n.value="register")}," Зарегистрироваться "),i("span",{onClick:e[6]||(e[6]=l=>n.value="forgot-password")}," Забыли пароль? ")])])])):n.value==="register"?(w(),P("div",Qe,[i("div",We,[g(c,{modelValue:a.value.name,"onUpdate:modelValue":e[7]||(e[7]=l=>a.value.name=l),modelModifiers:{trim:!0},placeholder:"Имя и фамилия",onEnterPress:e[8]||(e[8]=l=>p())},null,8,["modelValue"])]),i("div",Xe,[g(c,{modelValue:a.value.email,"onUpdate:modelValue":e[9]||(e[9]=l=>a.value.email=l),modelModifiers:{trim:!0},placeholder:"Email",onEnterPress:e[10]||(e[10]=l=>p())},null,8,["modelValue"])]),j((w(),P("div",et,[g(c,{modelValue:a.value.username,"onUpdate:modelValue":e[11]||(e[11]=l=>a.value.username=l),modelModifiers:{trim:!0},placeholder:"Никнейм",onEnterPress:e[12]||(e[12]=l=>p())},null,8,["modelValue"]),g(V,{username:a.value.username,valid:a.value.usernameIsValid,"onUpdate:valid":e[13]||(e[13]=l=>a.value.usernameIsValid=l)},null,8,["username","valid"])])),[[T]]),i("div",tt,[g(c,{modelValue:a.value.password,"onUpdate:modelValue":e[14]||(e[14]=l=>a.value.password=l),placeholder:"Пароль",onEnterPress:e[15]||(e[15]=l=>p()),password:""},null,8,["modelValue"]),g(S,{password:a.value.password,modelValue:a.value.passwordIsCorrect,"onUpdate:modelValue":e[16]||(e[16]=l=>a.value.passwordIsCorrect=l)},null,8,["password","modelValue"])]),i("div",st,[g(c,{modelValue:a.value.repeatPassword,"onUpdate:modelValue":e[17]||(e[17]=l=>a.value.repeatPassword=l),placeholder:"Повторите пароль",onEnterPress:e[18]||(e[18]=l=>p()),password:""},null,8,["modelValue"])]),i("div",ot,[t.error?(w(),L(v,{key:0},{default:E(()=>[$(B(t.error),1)]),_:1})):O("",!0)]),i("div",nt,[i("div",rt,[g(m,{contrast:"",alignment:"center",loading:t.isLoading,onClick:e[19]||(e[19]=l=>p())},{default:E(()=>[$(" Зарегистрироваться ")]),_:1},8,["loading"])]),i("div",at,[i("span",{onClick:e[20]||(e[20]=l=>n.value="login")}," Войти "),it,i("span",{onClick:e[21]||(e[21]=l=>n.value="resend-verification")}," Отправить подтверждение заново ")])])])):n.value==="forgot-password"?(w(),P("div",ut,[i("div",lt,[g(c,{modelValue:y.value.email,"onUpdate:modelValue":e[22]||(e[22]=l=>y.value.email=l),modelModifiers:{trim:!0},placeholder:"Почта",onEnterPress:e[23]||(e[23]=l=>s())},null,8,["modelValue"])]),i("div",dt,[t.error?(w(),L(v,{key:0},{default:E(()=>[$(B(t.error),1)]),_:1})):O("",!0)]),i("div",ct,[i("div",pt,[g(m,{contrast:"",alignment:"center",loading:t.isLoading,onClick:e[24]||(e[24]=l=>s())},{default:E(()=>[$(" Сбросить пароль ")]),_:1},8,["loading"])]),i("div",ft,[i("span",{onClick:e[25]||(e[25]=l=>n.value="login")}," Войти "),i("span",{onClick:e[26]||(e[26]=l=>n.value="register")}," Зарегистрироваться "),_t,i("span",{onClick:e[27]||(e[27]=l=>n.value="resend-verification")}," Отправить подтверждение заново ")])])])):(w(),P("div",vt,[i("div",mt,[g(c,{modelValue:C.value.email,"onUpdate:modelValue":e[28]||(e[28]=l=>C.value.email=l),modelModifiers:{trim:!0},placeholder:"Почта",onEnterPress:e[29]||(e[29]=l=>r())},null,8,["modelValue"])]),i("div",ht,[t.error?(w(),L(v,{key:0},{default:E(()=>[$(B(t.error),1)]),_:1})):O("",!0)]),i("div",gt,[i("div",yt,[g(m,{contrast:"",alignment:"center",loading:t.isLoading,onClick:e[30]||(e[30]=l=>r())},{default:E(()=>[$(" Отправить ")]),_:1},8,["loading"])]),i("div",wt,[i("span",{onClick:e[31]||(e[31]=l=>n.value="login")}," Войти "),i("span",{onClick:e[32]||(e[32]=l=>n.value="register")}," Зарегистрироваться "),i("span",{onClick:e[33]||(e[33]=l=>n.value="forgot-password")}," Забыли пароль? ")])])]))])),[[T]])}}});const kt=I(Ct,[["__scopeId","data-v-add7f324"]]);const bt={},G=u=>(q("data-v-432232e8"),u=u(),N(),u),Pt={class:"auth-rights"},St=G(()=>i("a",{href:"https://no-os.ru/confidentiality",target:"_blank"}," Политика конфиденциальности ",-1)),$t=G(()=>i("a",{href:"https://no-os.ru/oferta",target:"_blank"}," Договор публичной оферты ",-1));function Et(u,d){return w(),P("div",Pt,[St,$(" • "),$t])}const Vt=I(bt,[["render",Et],["__scopeId","data-v-432232e8"]]),xt=re("auth-module:auth",()=>{const u=ae(),d=A("login");R(d,()=>{a.value=void 0});const f=U({usernameOrEmail:"",password:""}),o=U({username:"",password:"",repeatPassword:"",email:"",name:"",passwordIsCorrect:!1,usernameIsValid:!1}),n=U({email:""}),_=U({email:""}),a=A(),y=A(!1);async function C(){y.value=!0;try{await b.Services.Auth.login(f)}catch(e){a.value=e.message}finally{y.value=!1,f.password=""}}async function h(){var c;const e=b.Services.User.passwordCriteria();if(y.value=!0,!o.password||!o.repeatPassword){a.value="Пароль не может быть пустым",y.value=!1;return}if(o.password!==o.repeatPassword){a.value="Пароли не совпадают",y.value=!1;return}if(!b.Services.User.validatePassword(o.password)){a.value=(c=e.find(v=>!v.isValid(o.password)))==null?void 0:c.errorText,y.value=!1;return}if(!o.username){a.value="Никнейм не может быть пустым",y.value=!1;return}if(!ie(o.username)){a.value="Никнейм может содержать только латинские буквы и цифры, а также символы _ и -",y.value=!1;return}if(!D(o.email)){a.value="Несуществующий имейл",y.value=!1;return}if(!ue(o.name)){a.value="Имя не может быть пустым и содержать цифры/спецсимволы",y.value=!1;return}try{await b.Services.Auth.register(o),b.Services.UI.openSuccessModal("Регистрация прошла успешно","Чтобы продолжить, подтвердите свой имейл. Письмо с инструкциями отправлено на вашу почту"),d.value="login"}catch(v){a.value=v.message}finally{y.value=!1,o.password="",o.repeatPassword=""}a.value||(d.value="login")}async function p(){if(!D(n.email)){a.value="Несуществующий имейл";return}try{await b.Services.Auth.forgotPassword(n.email,{showLoader:!0}),b.Services.UI.openSuccessModal("Письмо с инструкциями отправлено на вашу почту"),d.value="login"}catch(e){b.Services.UI.openErrorModal(e.message||"Что-то пошло не так")}}async function s(){if(!(!u.query.token||!u.query.username||u.query.verify===void 0))try{await b.Services.Auth.verify(u.query.username,u.query.token,{showLoader:!0}),b.Services.UI.openSuccessModal("Аккаунт подтвержден","Теперь вы можете войти в свой аккаунт")}catch(e){b.Services.UI.openErrorModal("Не удалось подтвердить аккаунт",e.message)}}async function r(){if(!(!u.query.token||!u.query.username||u.query["verify-email-change"]===void 0))try{await b.Services.Auth.verifyEmailChange(u.query.username,u.query.token,{showLoader:!0}),b.Services.UI.openSuccessModal("Email успешно изменен","Теперь вы можете войти в свой аккаунт")}catch(e){b.Services.UI.openErrorModal("Не удалось изменить email",e.message)}}async function t(){if(!D(_.email)){a.value="Несуществующий имейл";return}try{await b.Services.Auth.resendVerification(_.email,{showLoader:!0}),b.Services.UI.openSuccessModal("Письмо с инструкциями повторно отправлено на вашу почту"),d.value="login"}catch(e){b.Services.UI.openErrorModal(e.message||"Что-то пошло не так")}}return{loginCredentials:f,registerCredentials:o,forgotPasswordCredentials:n,resendVerificationCredentials:_,login:C,register:h,forgotPassword:p,resendVerification:t,isLoading:y,error:a,mode:d,verify:s,verifyEmailChange:r}}),It={class:"index-auth-view"},Tt={class:"container-fluid"},Ot={class:"row"},Mt={class:"col-md-8 col-12"},Lt={class:"index-auth-view__auth-icon-space"},Bt={class:"col-md-4 col-12"},Ut={class:"index-auth-view__auth-titles"},At={class:"index-auth-view__auth-form"},qt={class:"index-auth-view__auth-rights"},Nt=M({__name:"index-view",setup(u){const d=xt();return d.verify(),d.verifyEmailChange(),(f,o)=>(w(),P("div",It,[i("div",Tt,[i("div",Ot,[i("div",Mt,[i("div",Lt,[g(Pe)])]),i("div",Bt,[i("aside",null,[i("div",Ut,[g(Be,{mode:k(d).mode},null,8,["mode"])]),i("div",At,[g(kt,{"auth-credentials":k(d).loginCredentials,"onUpdate:authCredentials":o[0]||(o[0]=n=>k(d).loginCredentials=n),"register-credentials":k(d).registerCredentials,"onUpdate:registerCredentials":o[1]||(o[1]=n=>k(d).registerCredentials=n),"forgot-password-credentials":k(d).forgotPasswordCredentials,"onUpdate:forgotPasswordCredentials":o[2]||(o[2]=n=>k(d).forgotPasswordCredentials=n),"resend-verification-credentials":k(d).resendVerificationCredentials,"onUpdate:resendVerificationCredentials":o[3]||(o[3]=n=>k(d).resendVerificationCredentials=n),mode:k(d).mode,"onUpdate:mode":o[4]||(o[4]=n=>k(d).mode=n),error:k(d).error,"is-loading":k(d).isLoading,"username-exists":k(d).usernameExists,onLogin:o[5]||(o[5]=n=>k(d).login()),onRegister:o[6]||(o[6]=n=>k(d).register()),onForgotPassword:o[7]||(o[7]=n=>k(d).forgotPassword()),onResendVerification:o[8]||(o[8]=n=>k(d).resendVerification())},null,8,["auth-credentials","register-credentials","forgot-password-credentials","resend-verification-credentials","mode","error","is-loading","username-exists"])]),i("div",qt,[g(Vt)])])])])])]))}});const jt=I(Nt,[["__scopeId","data-v-e29cf4f2"]]);export{jt as default};
