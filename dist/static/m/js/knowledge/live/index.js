!function(e){function t(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return e[i].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var n={};t.m=e,t.c=n,t.i=function(e){return e},t.d=function(e,n,i){t.o(e,n)||Object.defineProperty(e,n,{configurable:!1,enumerable:!0,get:i})},t.n=function(e){var n=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(n,"a",n),n},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="/",t(t.s=31)}({0:function(module,__webpack_exports__,__webpack_require__){"use strict";function Trim(e){return(e||"").toString().replace(/(^\s*)|(\s*$)/g,"")}function Int(e){return e=parseInt(Number(e),10),isNaN(e)?0:e}function Float(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:2,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(e=parseFloat(Number(e)),e=isNaN(e)?0:e,!n){var i=Math.pow(10,t);return Math.round(e*i)/i}return e.toFixed(t)}function arrayChunk(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1,n=[];if(e)for(var i=Math.ceil(e.length/t);i>0;)n.push(e.slice((i-1)*t,i*t)),i--;return n.reverse()}function changeURLParam(url,key,val){url||(url="undefind"!=typeof window?window.location.href:"");var kv=key+"="+val;return-1===url.indexOf("?")&&(url+="?"),url.match(key+"=([^&]*)")?url=url.replace(eval("/[?]("+key+"=)([^&]*)/g"),"?"+kv).replace(eval("/[&]("+key+"=)([^&]*)/g"),"&"+kv):url+="&"+kv,url}function Ajax(e,t,n,i,o){var a=arguments.length>5&&void 0!==arguments[5]?arguments[5]:null,r=arguments.length>6&&void 0!==arguments[6]?arguments[6]:null;e=e.toLowerCase();var s="json";a&&a.dataType&&(s=a.dataType.toLowerCase());var l=window.location.href;n||(n={}),n.backurl=l,Toast.info('<i class="weui-loading"></i> 正在请求数据',-1),setBtnDisabled(r,!0,"正在提交数据"),$("input").blur();var c={url:t,data:n,type:e,dataType:s,cache:!1,timeout:1e4,xhrFields:{withCredentials:!0},beforeSend:function(e){e.setRequestHeader("X-Token",$("meta[name=x-token]").attr("content"))},success:function(e){Toast.clear();var t=0,n=null,o=null;if("json"==s&&(t=e.errno||0,n=e.errmsg,o=e.data,"object"==(void 0===n?"undefined":_typeof(n))&&4==e.errno)){var a=[];for(var r in n)a.push(n[r]);return n=a.join("<br>"),Alert.warning(n,"数据验证失败")}if(n||"string"!=typeof o||(n=o),0==t){if("modal"===n&&showModal)return showModal(o.url,o.html,o.title,o.btnArr,o.modalOps);n&&"NOMSG"!==n?Alert.success(n):checkRespData(o)}else n&&n.okmsg?checkRespData(n,!1):n.indexOf("NO_ICON@")>-1?Alert(n.replace("NO_ICON@","")):Alert.warning(n||"未知错误!");i&&i(e)},error:function(e,n){Toast.clear();var i=999,a=null;if(404===e.status?a=e.statusText+"<br>"+t:e.responseJSON?(i=e.responseJSON.errno,a=e.responseJSON.errmsg):a=e.responseText?e.responseText:n?"请求错误："+n:e.responseText||e.statusText,401==e.status)return void Alert.error("权限不够，请先登录！",null,["取消","立即登录"],function(e){1===e&&(window.location.href=changeURLParam(window.USER_LOGIN_URL||"/m/user/login","backurl",l))});"timeout"==a&&(a="请求超时!"),Alert.error(a),o&&o(a,i)},complete:function(){setBtnDisabled(r,!1)}};a&&Object.assign(c,a),n&&"[object FormData]"==n.toString()&&(c=Object.assign(c,{async:!1,contentType:!1,processData:!1})),$.ajax(c)}function Actionsheet(e,t,n){function i(){o.removeClass("weui-actionsheet_toggle"),d.fadeOut(200)}var o=$(".js_sctionsheet .weui-actionsheet");if(!o||!o.length){var a='<div class="js_sctionsheet">\n        <div class="weui-mask" id="sheetMask" style="opacity: 1;"></div>\n        <div class="weui-actionsheet weui-actionsheet_toggle" id="actsheet">\n            <div class="weui-actionsheet__title">\n                <p class="weui-actionsheet__title-text">'+e+'</p>\n            </div>\n            <div class="weui-actionsheet__menu">\n            </div>\n            <div class="weui-actionsheet__action">\n                <div class="weui-actionsheet__cell" id="actsheetCancel">取消</div>\n            </div>\n        </div>\n    </div>';$("body").append(a),o=$(".js_sctionsheet .weui-actionsheet")}for(var r=[],s=0;s<t.length;s++){var l=t[s],c="object"===(void 0===l?"undefined":_typeof(l))?l.label?l.label:"":l+"";r.push('<div class="weui-actionsheet__cell" data-index="'+s+'">'+c+"</div>")}$(".weui-actionsheet__title-text").html(e),$(".weui-actionsheet__menu").html(r.join(""));var d=$(".js_sctionsheet .weui-mask");d.on("click",i),$(".weui-actionsheet__menu .weui-actionsheet__cell").on("click",function(e){var o=$(e.target).data("index");n&&n(t[o],o),i()}),$(".weui-actionsheet__action .weui-actionsheet__cell").on("click",function(e){i()}),o.addClass("weui-actionsheet_toggle"),d.fadeIn(200)}function Alert(e,t,n,i,o,a){var r=arguments.length>6&&void 0!==arguments[6]&&arguments[6],s=arguments.length>7&&void 0!==arguments[7]&&arguments[7],l=o?'<div class="weui-alert__icon"><img src="/static/m/img/icon/msg_'+o+'.png" /></div>':"",c=t||"";t&&-1===t.indexOf("<")&&(t='<strong class="weui-dialog__title">'+t+"</strong>",c=t?'<div class="weui-dialog__hd">'+t+"</div>":"");var d="",u="",f=["weui-alert__btn weui-btn weui-btn_default","weui-alert__btn weui-btn weui-btn_primary"];if(n&&n.length>0)for(var _=n.length,p=0;p<_;p++){var v=n[p];u="object"===(void 0===v?"undefined":_typeof(v))?v.css||"":p===_-1?"weui-dialog__btn_primary":"weui-dialog__btn_default",d+='<a href="javascript:;" class="'+f[0]+" "+u+'" data-index="'+p+'">'+(v.label||v)+"</a>"}else r||(d='<a href="javascript:;" class="'+f[1]+' " data-index="0">确定</a>');var h="dialog_"+Math.floor(1e3*Math.random()),w='<div class="js_dialog '+(a||"")+'" id="'+h+'" style="display: none;">\n      <div class="weui-mask"></div>\n      <div class="weui-dialog">\n          '+l+"\n          "+c+'\n          <div class="weui-dialog__bd">'+(e||"")+'</div>\n          <div class="weui-dialog__ft '+(n&&n.length>1?"":"only-one-btn")+'">'+d+"</div>\n      </div>\n  </div>";$("body").append(w);var g=$("#"+h);r&&$("#"+h+" .weui-mask").click(function(){g.remove()}),g.fadeIn(100),g.on("click",".weui-alert__btn",function(){var e=parseInt($(this).data("index"));if(i){var t=i(e,n?n[e]:null);s&&!0!==t||g.remove()}else g.remove()})}function Modal(e,t,n){function i(){n&&n.closeNOTip?(u.find(".modal-body").css("transform","translate(0, "+r+")"),window.setTimeout(function(){u.fadeOut(50,function(){u.remove()})},250)):Alert.warning("确认放弃授权?",null,["确认","取消"],function(e){0===e&&(u.find(".modal-body").css("transform","translate(0, "+r+")"),window.setTimeout(function(){u.fadeOut(50,function(){u.remove()})},250))})}var o="dialog_"+Math.floor(1e3*Math.random()),a="100%",r="100%";if(n&&n.size){var s=n.size.split(",");"0"!==s[0]&&(a=s[0]+"px"),"0"!==s[1]&&(r=s[1]+"px")}var l="max-width: 100%; border-radius: 0; width: "+a+"; height: "+r+";\n  transform: translate(0, "+r+");transition: transform linear 300ms;\n  ",c="width: 100%; height: 100%; max-height: "+r+";",d='\n        <div id="'+o+'" class="js_dialog iframe-dialog" data-id="'+o+'" style="justify-content: flex-end;">\n          <div class="weui-mask"></div>\n          <div class="weui-dialog modal-body" style="'+l+'">\n            <div id="closeFrame" style="position: absolute; top: 10px; right: 10px; font-size: 10px; font-weight: bold; color: red;">关闭</div>\n          </div>\n        </div>';if($("body").append(d),t){"iframe"===t.split("@")[0]&&(t='<iframe id="tmpModalIFrame" src="'+e+'" frameborder="0" style="'+c+'"></iframe>'),$(".modal-body").append(t)}else e&&($(".modal-body").append("loading..."),Ajax.get(e,null,function(e){$(".modal-body").append(e)},function(){$(".modal-body").append('<p style="color:red">服务器内容获取失败<br>'+e+"</p>")},"html"));$("#tmpModalIFrame").on("load",function(){try{var e=$(this),t=e.contents().find("body");setTimeout(function(){e.height(t[0].scrollHeight)},20)}catch(e){console.warn(e)}});var u=$("#"+o);u.fadeIn(300),u.find(".modal-body").css("transform","translate(0, 0)"),n&&n.maskClickable&&u.on("click",".weui-mask",i),u.on("click","#closeFrame",i)}function Toast(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1500,i={loading:'<i class="weui-loading weui-toast"></i>',success:'<i class="weui-success-no-circle weui-toast"></i>'},o=i[t];if(!o){o="<style>\n        .weui-toast { min-width: 100px; min-height: 0; width: auto; height: auto; padding: 20px; }\n        .weui-toast__content { margin: 0; line-height: 1.6; max-width: 500px; color: "+({warn:"#fff300",error:"#f43530"}[t]||"#fff")+" }\n      </style>"}e||(e="");var a=!0;n<0&&(a=!1);var r=!0===a?"":'<div class="weui-mask_transparent"></div>',s="toast_"+Math.floor(1e3*Math.random()),l='<div style="display: none;" id="'+s+'">\n        '+r+'\n        <div class="weui-toast" style="left: 0; margin-left: 0;">\n            '+(o||"")+'\n            <p class="weui-toast__content">'+e+"</p>\n        </div>\n    </div>";$("body").append(l);var c=$("#"+s);c.fadeIn(100);var d=$("#"+s+" .weui-toast");d.css("margin-left","-"+(d.width()/2+20)+"px"),d.css("left","50%"),d.css("top",($(window).height()-d.height())/2.5+"px"),n>0&&setTimeout(function(){c.fadeOut(50,function(){c.remove()})},n)}function showModal(e,t,n,i,o){console.log("show..Modal..TODO..")}function setBtnDisabled(e,t,n){e&&("string"==typeof e&&(e=$(e)),t?(e.attr("lab",e.html()),e.attr("disabled","true"),e.addClass("weui-btn_disabled")):(e.removeAttr("disabled"),e.removeClass("weui-btn_disabled"),n||(n=e.attr("lab"))),e.html(n))}function isMobileNo(e){return/^[1][3,4,5,7,8][0-9]{9}$/.test(e)}function isTelNo(e){return!!/^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/.test(e)}function isMobilePhone(e,t){return!!isMobileNo(e)||(t?(Toast.info("手机号码格式错误"),t.preventDefault()):Toast.info("手机号码格式错误"),!1)}function sendSMSCode(e,t,n){if(!e||!isMobileNo(e)&&-1===e.indexOf("HIDE@"))return Toast("手机号码错误");Ajax("POST","/api/sms/send",{mobile:e,type:t},function(e){var t=e.errno,i=(e.errmsg,e.data);if(n)n(i);else if(0===t&&!i.smsid)return Toast("短信发送失败")})}function initSMSButton(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"#btnSMS",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"#mobile",n=arguments[2],i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:60,o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:null,a=$(e);a.cding>0||(n||(n=Int(a.data("type"))),a.click(function(){sendSMSCode(Trim($(t).val()),n,function(e){if(e&&e.smsid){a.cding=i||60,setBtnDisabled(a,!0,"剩余 "+--a.cding+" 秒");var t=setInterval(function(){a.cding>1?a.html("剩余 "+--a.cding+" 秒"):(clearInterval(t),delete a.cding,setBtnDisabled(a,!1))},1e3);o&&o(e)}})}))}function getUrlParam(e){var t=new RegExp("(^|&)"+e+"=([^&]*)(&|$)"),n=window.location.search.substr(1).match(t);return null!=n?unescape(n[2]):null}Object.defineProperty(__webpack_exports__,"__esModule",{value:!0}),__webpack_exports__.Trim=Trim,__webpack_exports__.Int=Int,__webpack_exports__.Float=Float,__webpack_exports__.arrayChunk=arrayChunk,__webpack_exports__.changeURLParam=changeURLParam,__webpack_exports__.Ajax=Ajax,__webpack_exports__.Actionsheet=Actionsheet,__webpack_exports__.Alert=Alert,__webpack_exports__.Modal=Modal,__webpack_exports__.Toast=Toast,__webpack_exports__.showModal=showModal,__webpack_exports__.setBtnDisabled=setBtnDisabled,__webpack_exports__.isMobileNo=isMobileNo,__webpack_exports__.isTelNo=isTelNo,__webpack_exports__.isMobilePhone=isMobilePhone,__webpack_exports__.sendSMSCode=sendSMSCode,__webpack_exports__.initSMSButton=initSMSButton,__webpack_require__.d(__webpack_exports__,"weChat",function(){return weChat}),__webpack_require__.d(__webpack_exports__,"mobileTerminal",function(){return mobileTerminal}),__webpack_exports__.getUrlParam=getUrlParam;var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},checkRespData=function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];if(e&&e.okmsg){var n=Array.isArray(e.okbtns)?e.okbtns:(e.okbtns||"确定").split(",");(t?Alert.success:Alert.warning)(e.okmsg,null,n,function(t){if(n.length>1&&e.okurls){var i=Array.isArray(e.okurls)?e.okurls:(e.okurls||"").split(",");i[t]&&(window.location.href=i[t])}else e.backurl?window.location.href=e.backurl:e.reload&&window.location.reload()})}else e.backurl?window.location.href=e.backurl:e.reload&&window.location.reload()};Ajax.get=function(e,t,n,i,o){var a=(arguments.length>5&&void 0!==arguments[5]&&arguments[5],arguments.length>6&&void 0!==arguments[6]&&arguments[6],Array.apply(this,arguments));a.unshift("get"),Ajax.apply(this,a)},Ajax.post=function(e,t,n,i,o){var a=(arguments.length>5&&void 0!==arguments[5]&&arguments[5],arguments.length>6&&void 0!==arguments[6]&&arguments[6],Array.apply(this,arguments));a.unshift("post"),Ajax.apply(this,a)},Ajax.put=function(e,t,n,i,o){var a=(arguments.length>5&&void 0!==arguments[5]&&arguments[5],arguments.length>6&&void 0!==arguments[6]&&arguments[6],Array.apply(this,arguments));a.unshift("put"),Ajax.apply(this,a)},Ajax.delete=function(e,t,n,i,o){var a=(arguments.length>5&&void 0!==arguments[5]&&arguments[5],arguments.length>6&&void 0!==arguments[6]&&arguments[6],Array.apply(this,arguments));a.unshift("delete"),Ajax.apply(this,a)},Alert.info=function(e,t,n,i){return Alert(e,t,n,i,"info")},Alert.warning=function(e,t,n,i){return Alert(e,t,n,i,"warning")},Alert.error=function(e,t,n,i){return Alert(e,t,n,i,"error")},Alert.success=function(e,t,n,i){return Alert(e,t,n,i,"success")},Alert.close=function(){$("input").blur(),$(".js_dialog").remove()},Toast.clear=function(){$(".weui-toast").parent().remove()},Toast.loading=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1500;return Toast(e||"加载中...","loading",t)},Toast.info=function(e){return Toast(e,"info",arguments.length>1&&void 0!==arguments[1]?arguments[1]:1500)},Toast.warning=function(e){return Toast(e,"warn",arguments.length>1&&void 0!==arguments[1]?arguments[1]:1500)},Toast.error=function(e){return Toast(e,"error",arguments.length>1&&void 0!==arguments[1]?arguments[1]:1500)},Toast.success=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1500;return Toast(e||"操作成功","success",t)};var weChat=function(){return-1!==navigator.userAgent.toLowerCase().indexOf("micromessenger")}(),mobileTerminal=function(){return/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)}()},19:function(e,t){},31:function(e,t,n){e.exports=n(7)},7:function(e,t,n){n(19);var i=n(0);!function(e){if(null==e)throw new TypeError("Cannot destructure undefined")}(i),$(function(){new Swiper(".swiper-container",{effect:"coverflow",grabCursor:!0,centeredSlides:!0,slidesPerView:"auto",coverflowEffect:{rotate:50,stretch:0,depth:100,modifier:1,slideShadows:!0},pagination:{el:".swiper-pagination"}});$(".swiper-slide").click=function(e){$(".video-list .swiper-slide .text").css("font-size","14px"),$(e).find(".text").css("font-size","16px");var t=document.getElementById("videoId");t.src=$(e).data("url"),$(".video-play video").append(t),$(".video-play").show(),$(".video-play video")[0].play(),$(".swiper-slide").removeClass("play"),$(e).addClass("play")}})}});