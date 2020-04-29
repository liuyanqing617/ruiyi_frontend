/**
 * 去除左右两边的空格
 * @param str
 * @returns {*|void|string}
 * @constructor
 */
export function Trim (str) {
  return (str || '').toString().replace(/(^\s*)|(\s*$)/g, '');
}

/**
 * string -> int
 * @param val
 * @returns {*}
 */
export function Int (val) {
  val = parseInt(Number(val), 10);
  return (isNaN(val)) ? 0 : val;
}

/**
 * string -> float
 * @param val
 * @param len
 * @param returnStr 是否返回字符串
 * @returns {*}
 */
export function Float (val, len = 2, returnStr = false) {
  val = parseFloat(Number(val));
  val = (isNaN(val)) ? 0 : val;
  if (!returnStr) {
    let tmp = Math.pow(10, len);
    return Math.round(val * tmp) / tmp;
  }
  return val.toFixed(len);
}

/**
 * 列表分隔成子数组
 * @param arr
 * @param cols
 */
export function arrayChunk (arr, cols = 1) {
  let chunks = []
  if (arr) {
    let count = Math.ceil(arr.length / cols)
    while (count > 0) {
      chunks.push(arr.slice((count - 1) * cols, count * cols))
      count--
    }
  }
  return chunks.reverse()
}

// 修改地址参数
export function changeURLParam (url, key, val) {
  if (!url) {
    url = typeof window != 'undefind' ? window.location.href : '';
  }
  let kv = key + '=' + val;
  if (url.indexOf('?') === -1) url += '?'
  if (url.match(key + '=([^&]*)')) {
    url = url.replace(eval('/[?](' + key + '=)([^&]*)/g'), '?' + kv)
      .replace(eval('/[&](' + key + '=)([^&]*)/g'), '&' + kv)
  } else {
    url += '&' + kv
  }
  return url
}

const checkRespData = (retData, success = true) => {
  if (retData && retData.okmsg) {
    let btnArr = Array.isArray(retData.okbtns) ? retData.okbtns : (retData.okbtns || '确定').split(',')
    let alertFunc = success ? Alert.success : Alert.warning
    alertFunc(retData.okmsg, null, btnArr, function (btnIndex) {
      if (btnArr.length > 1 && retData.okurls) {
        let urlArr = Array.isArray(retData.okurls) ? retData.okurls : (retData.okurls || '').split(',')
        if (urlArr[btnIndex]) {
          window.location.href = urlArr[btnIndex]
        }
      } else {
        if (retData.backurl) {
          window.location.href = retData.backurl
        } else if (retData.reload) {
          window.location.reload();
        }
      }
    });
  } else if (retData.backurl) {
    window.location.href = retData.backurl
  } else if (retData.reload) {
    window.location.reload();
  }
}

/**
 * 异步请求数据
 * @param method
 * @param url
 * @param data
 * @param onSuccess
 * @param onError
 * @param button    需要改变状态的按钮
 * @param ajaxOptions   参数列表{k->v}
 */
export function Ajax (method, url, data, onSuccess, onError, ajaxOptions = null, button = null) {
  method = method.toLowerCase();
  var dataType = 'json';
  if (ajaxOptions && ajaxOptions.dataType) {
    dataType = ajaxOptions.dataType.toLowerCase();
  }
  // 添加当前页地址，便于登录后返回
  const backurl = window.location.href
  if (!data) data = {};
  data.backurl = backurl
  Toast.info('<i class="weui-loading"></i> 正在请求数据', -1);
  setBtnDisabled(button, true, '正在提交数据');
  $('input').blur()
  var ajaxParams = {
    url: url,
    data: data,
    type: method,
    dataType: dataType,
    cache: false,
    timeout: 10000, // ms
    xhrFields: {
      withCredentials: true
    },
    beforeSend: (req) => {
      req.setRequestHeader('X-Token', $('meta[name=x-token]').attr('content'))
    },
    success (ret) {
      Toast.clear();
      var errno = 0;
      var errmsg = null;
      var retData = null;
      if (dataType == 'json') {
        errno = ret.errno || 0;
        errmsg = ret.errmsg;
        retData = ret.data;
        if (typeof errmsg == 'object') {
          // 数据验证结果
          if (ret.errno == 4) {
            var msgList = [];
            for (var k in errmsg) {
              msgList.push(errmsg[k]);
            }
            errmsg = msgList.join('<br>');
            return Alert.warning(errmsg, '数据验证失败');
          } else {
            // errmsg = JSON.stringify(errmsg);
          }
        }
      }
      if (!errmsg && typeof retData == 'string') {
        errmsg = retData;
      }
      if (errno == 0) {
        if (errmsg === 'modal' && showModal) {
          return showModal(retData.url, retData.html, retData.title, retData.btnArr, retData.modalOps);
        }
        if (errmsg && errmsg !== 'NOMSG') {
          Alert.success(errmsg);
        } else {
          checkRespData(retData)
        }
      } else {
        if (errmsg && errmsg.okmsg) {
          checkRespData(errmsg, false)
        } else {
          if (errmsg.indexOf('NO_ICON@') > -1) {
            Alert(errmsg.replace('NO_ICON@', ''));
          } else {
            Alert.warning(errmsg || '未知错误!');
          }
        }
      }
      if (onSuccess) {
        onSuccess(ret);
      }
    },
    error (res, error) {
      Toast.clear();
      var errno = 999;
      var errmsg = null;
      if (res.status === 404) {
        errmsg = res.statusText + '<br>' + url;
      } else if (res.responseJSON) {
        errno = res.responseJSON.errno;
        errmsg = res.responseJSON.errmsg;
      } else if (res.responseText) {
        errmsg = res.responseText;
      } else if (error) {
        errmsg = '请求错误：' + error;
      } else {
        errmsg = res.responseText || res.statusText;
      }
      if (res.status == 401) {
        Alert.error('权限不够，请先登录！', null, ['取消', '立即登录'], function (btnIndex) {
          if (btnIndex === 1) {
            window.location.href = changeURLParam(window.USER_LOGIN_URL || '/m/user/login', 'backurl', backurl)
          }
        });
        return;
      }
      if (errmsg == 'timeout') {
        errmsg = '请求超时!'
      }
      Alert.error(errmsg);
      if (onError) {
        onError(errmsg, errno);
      }
    },
    complete () {
      setBtnDisabled(button, false);
    },
  };
  if (ajaxOptions) {
    Object.assign(ajaxParams, ajaxOptions);
  }
  if (data && data.toString() == '[object FormData]') {
    ajaxParams = Object.assign(ajaxParams, {
      async: false,
      contentType: false,
      processData: false,
    });
  }
  $.ajax(ajaxParams);
}

Ajax.get = function (url, data, onSuccess, onError, dataType, options = null, button = null) {
  let args = Array.apply(this, arguments);
  args.unshift('get');
  Ajax.apply(this, args)
};
Ajax.post = function (url, data, onSuccess, onError, dataType, options = null, button = null) {
  let args = Array.apply(this, arguments);
  args.unshift('post');
  Ajax.apply(this, args)
};
Ajax.put = function (url, data, onSuccess, onError, dataType, options = null, button = null) {
  let args = Array.apply(this, arguments);
  args.unshift('put');
  Ajax.apply(this, args)
};
Ajax.delete = function (url, data, onSuccess, onError, dataType, options = null, button = null) {
  let args = Array.apply(this, arguments);
  args.unshift('delete');
  Ajax.apply(this, args)
};

/**
 * 操作选项列表
 * @param title
 * @param itemArr
 * @constructor
 */
export function Actionsheet (title, itemArr, callback) {
  var $sheet = $('.js_sctionsheet .weui-actionsheet');
  if (!$sheet || !$sheet.length) {
    let html = `<div class="js_sctionsheet">
        <div class="weui-mask" id="sheetMask" style="opacity: 1;"></div>
        <div class="weui-actionsheet weui-actionsheet_toggle" id="actsheet">
            <div class="weui-actionsheet__title">
                <p class="weui-actionsheet__title-text">${title}</p>
            </div>
            <div class="weui-actionsheet__menu">
            </div>
            <div class="weui-actionsheet__action">
                <div class="weui-actionsheet__cell" id="actsheetCancel">取消</div>
            </div>
        </div>
    </div>`
    $('body').append(html)
    $sheet = $('.js_sctionsheet .weui-actionsheet');
  }
  let itemHtmlArr = []
  for (let i = 0; i < itemArr.length; i++) {
    let item = itemArr[i]
    let label = typeof item === "object" ? (item.label ? item.label : '') : item + ''
    itemHtmlArr.push(`<div class="weui-actionsheet__cell" data-index="${i}">${label}</div>`)
  }
  $('.weui-actionsheet__title-text').html(title)
  $('.weui-actionsheet__menu').html(itemHtmlArr.join(''))
  var $sheetMask = $('.js_sctionsheet .weui-mask');
  function hideActionSheet() {
    $sheet.removeClass('weui-actionsheet_toggle');
    $sheetMask.fadeOut(200);
  }
  $sheetMask.on('click', hideActionSheet);
  $('.weui-actionsheet__menu .weui-actionsheet__cell').on('click', (e) => {
    let index = $(e.target).data('index')
    callback && callback(itemArr[index], index)
    hideActionSheet()
  });
  $('.weui-actionsheet__action .weui-actionsheet__cell').on('click', (e) => {
    hideActionSheet()
  });
  $sheet.addClass('weui-actionsheet_toggle');
  $sheetMask.fadeIn(200);
}


/**
 * 弹出提示信息
 * @param content     内容(支持HTML)
 * @param title       标题(支持HTML)
 * @param buttonArr   按钮列表['取消', '确定'] 或 [{label: '确定删除', css:'按钮样式', ...}]
 * @param callback    按钮回调函数(btnIndex, btnItem)
 */
export function Alert (content, title, buttonArr, callback, type, className, isCloseByMask = false, isCheckHandle = false) {
  let iconHtml = type ? `<div class="weui-alert__icon"><img src="/static/m/img/icon/msg_${type}.png" /></div>` : ''
  let ttHtml = title || ''
  if (title && title.indexOf('<') === -1) {
    title = `<strong class="weui-dialog__title">${ title }</strong>`
    ttHtml = title ? `<div class="weui-dialog__hd">${title}</div>` : ''
  }
  let btnHtml = '';
  let css = '';
  // 默认按钮样式
  // const btnClass = ['weui-alert__btn weui-dialog__btn', 'weui-alert__btn weui-dialog__btn weui-dialog__btn_primary']
  // 自定义样式
  const btnClass = ['weui-alert__btn weui-btn weui-btn_default', 'weui-alert__btn weui-btn weui-btn_primary']
  if (buttonArr && buttonArr.length > 0) {
    let btnCount = buttonArr.length;
    for (let i = 0; i < btnCount; i++) {
      let btn = buttonArr[i];
      if (typeof btn === 'object') {
        css = btn.css || '';
      } else {
        css = i === btnCount - 1 ? 'weui-dialog__btn_primary' : 'weui-dialog__btn_default';
      }
      btnHtml += `<a href="javascript:;" class="${btnClass[0]} ${css}" data-index="${i}">${btn.label || btn}</a>`
    }
  } else if (isCloseByMask) {
    // 可以直接点击背景
  } else {
    btnHtml = `<a href="javascript:;" class="${btnClass[1]} " data-index="0">确定</a>`
  }
  let id = 'dialog_' + Math.floor(Math.random() * 1000);
  let html = `<div class="js_dialog ${className || ''}" id="${ id }" style="display: none;">
      <div class="weui-mask"></div>
      <div class="weui-dialog">
          ${ iconHtml }
          ${ ttHtml }
          <div class="weui-dialog__bd">${ content || '' }</div>
          <div class="weui-dialog__ft ${ buttonArr && buttonArr.length > 1 ? '' : 'only-one-btn' }">${ btnHtml }</div>
      </div>
  </div>`;
  $('body').append(html);
  let $inst = $('#' + id);
  if (isCloseByMask) {
    $(`#${id} .weui-mask`).click(function () {
      $inst.remove();
    })
  }
  $inst.fadeIn(100);
  $inst.on('click', '.weui-alert__btn', function () {
    let btnIndex = parseInt($(this).data('index'));
    // $inst.fadeOut(50, function () {
      if (callback) {
        let cbRet = callback(btnIndex, buttonArr ? buttonArr[btnIndex] : null);
        if (!isCheckHandle || cbRet === true) {
          $inst.remove();
        }
      } else {
        $inst.remove();
      }
    // });
  });
}

Alert.info = (content, title, buttonArr, callback) => Alert(content, title, buttonArr, callback, 'info')
Alert.warning = (content, title, buttonArr, callback) => Alert(content, title, buttonArr, callback, 'warning')
Alert.error = (content, title, buttonArr, callback) => Alert(content, title, buttonArr, callback, 'error')
Alert.success = (content, title, buttonArr, callback) => Alert(content, title, buttonArr, callback, 'success')

Alert.close = function () {
  $('input').blur()
  $('.js_dialog').remove()
}

export function Modal (url, html, option) {
  let id = 'dialog_' + Math.floor(Math.random() * 1000)

  let bodyWidth = '100%'
  let bodyHeight = '100%'
  if (option && option.size) {
    let sizeArray = option.size.split(',')
    if (sizeArray[0] !== '0') {
      bodyWidth = sizeArray[0] + 'px'
    }
    if (sizeArray[1] !== '0') {
      bodyHeight = sizeArray[1] + 'px'
    }
  }
  
  let bodyStyle = `max-width: 100%; border-radius: 0; width: ${bodyWidth}; height: ${bodyHeight};
  transform: translate(0, ${bodyHeight});transition: transform linear 300ms;
  `
  let frameStyle = `width: 100%; height: 100%; max-height: ${bodyHeight};`
  let closeStyle = 'position: absolute; top: 10px; right: 10px; font-size: 10px; font-weight: bold; color: red;'
  let modalHTML = `
        <div id="${id}" class="js_dialog iframe-dialog" data-id="${id}" style="justify-content: flex-end;">
          <div class="weui-mask"></div>
          <div class="weui-dialog modal-body" style="${bodyStyle}">
            <div id="closeFrame" style="${closeStyle}">关闭</div>
          </div>
        </div>`
  $('body').append(modalHTML)
  // 内容
  if (html) {
    let htmlArgs = html.split('@')
    if (htmlArgs[0] === 'iframe') {
      html = `<iframe id="tmpModalIFrame" src="${url}" frameborder="0" style="${frameStyle}"></iframe>`
    }
    $('.modal-body').append(html)
  } else if (url) {
    $('.modal-body').append('loading...')
    Ajax.get(url, null, (ret) => {
      $('.modal-body').append(ret)
    }, function () {
      $('.modal-body').append(`<p style="color:red">服务器内容获取失败<br>${url}</p>`)
    }, 'html')
  }
  $("#tmpModalIFrame").on('load', function () {
    try {
      let ifr = $(this)
      let ifrBody = ifr.contents().find("body")
      setTimeout(function () {
        ifr.height(ifrBody[0].scrollHeight)
      }, 20)
    } catch (err) {
      console.warn(err)
    }
  })
  let $inst = $('#' + id)
  $inst.fadeIn(300)
  $inst.find('.modal-body').css('transform', 'translate(0, 0)')
  
  if (option && option.maskClickable) {
    $inst.on('click', '.weui-mask', closeFrame)
  }
  
  $inst.on('click', '#closeFrame', closeFrame)
  
  function closeFrame () {
    if (option && option.closeNOTip) {
      $inst.find('.modal-body').css('transform', `translate(0, ${bodyHeight})`)
      window.setTimeout(function () {
        $inst.fadeOut(50, function () {
          $inst.remove()
        })
      }, 250)
    } else {
      Alert.warning('确认放弃授权?', null, ['确认', '取消'], function (btnIndex) {
        if (btnIndex === 0) {
          $inst.find('.modal-body').css('transform', `translate(0, ${bodyHeight})`)
          window.setTimeout(function () {
            $inst.fadeOut(50, function () {
              $inst.remove()
            })
          }, 250)
        }
        if (btnIndex === 1) {
      
        }
      })
    }
  }
}

/**
 * 非按钮提示信息
 * @param message     内容(支持HTML)
 */
export function Toast (message, type, times = 1500) {
  const icons = {
    loading: '<i class="weui-loading weui-toast"></i>',
    success: '<i class="weui-success-no-circle weui-toast"></i>',
  }
  let iconHtml = icons[type];
  if (!iconHtml) {
    let colors = {warn: '#fff300', error: '#f43530',}
    iconHtml = `<style>
        .weui-toast { min-width: 100px; min-height: 0; width: auto; height: auto; padding: 20px; }
        .weui-toast__content { margin: 0; line-height: 1.6; max-width: 500px; color: ${ colors[type] || '#fff' } }
      </style>`;
  }
  if (!message) message = '';
  let bgClickAble = true
  if (times < 0) {
    bgClickAble = false
  }
  let bg = bgClickAble === true ? '' : `<div class="weui-mask_transparent"></div>`
  let id = 'toast_' + Math.floor(Math.random() * 1000);
  let html = `<div style="display: none;" id="${ id }">
        ${bg}
        <div class="weui-toast" style="left: 0; margin-left: 0;">
            ${ iconHtml || '' }
            <p class="weui-toast__content">${ message }</p>
        </div>
    </div>`;
  $('body').append(html);
  let $inst = $('#' + id);
  $inst.fadeIn(100);
  let toast = $('#' + id + ' .weui-toast');
  toast.css('margin-left', `-${ toast.width() / 2 + 20 }px`);
  toast.css('left', '50%');
  toast.css('top', `${ ($(window).height() - toast.height()) / 2.5 }px`);
  if (times > 0) {
    setTimeout(function () {
      $inst.fadeOut(50, function () {
        $inst.remove();
      });
    }, times);
  }
}

Toast.clear = () => {
  $('.weui-toast').parent().remove();
}
Toast.loading = (message, times = 1500) => Toast(message || '加载中...', 'loading', times);
Toast.info = (message, times = 1500) => Toast(message, 'info', times);
Toast.warning = (message, times = 1500) => Toast(message, 'warn', times);
Toast.error = (message, times = 1500) => Toast(message, 'error', times);
Toast.success = (message, times = 1500) => Toast(message || '操作成功', 'success', times);

/**
 * 显示模态窗口
 * @param url      地址
 * @param html     html
 * @param title    标题
 * @param btnArr   按钮列表 [[label, func, css, style]]
 * @param modalOps 模态参数
 */
export function showModal (url, html, title, btnArr, modalOps) {
  console.log('show..Modal..TODO..')
}

/**
 * 改变按钮启用状态
 * @param $btn
 * @param isDisabled
 * @param label
 */
export function setBtnDisabled ($btn, isDisabled, label) {
  if (!$btn) return;
  if (typeof $btn === 'string') $btn = $($btn);
  if (isDisabled) {
    $btn.attr('lab', $btn.html());
    $btn.attr('disabled', 'true');
    $btn.addClass('weui-btn_disabled');
  } else {
    $btn.removeAttr('disabled');
    $btn.removeClass('weui-btn_disabled');
    if (!label) {
      label = $btn.attr('lab');
    }
  }
  $btn.html(label);
}

// 判断是否为手机号
export function isMobileNo (pone) {
  const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
  return reg.test(pone)
}

// 判断是否为电话号码
export function isTelNo (tel) {
  const reg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
  return !!reg.test(tel)
}

export function isMobilePhone(mobile, evt) {
  if (!isMobileNo(mobile)) {
    if (!evt) {
      Toast.info('手机号码格式错误')
    } else {
      Toast.info('手机号码格式错误')
      evt.preventDefault()
    }
    return false;
  }
  return true;
}

/**
 * 发送短信验证码
 * @param mobile
 * @param type
 * @param callback
 */
export function sendSMSCode (mobile, type, callback) {
  if (!mobile || (!isMobileNo(mobile) && mobile.indexOf('HIDE@') === -1)) {
    return Toast('手机号码错误')
  }
  Ajax('POST', '/api/sms/send', {mobile, type}, ({errno, errmsg, data}) => {
    if (callback) {
      callback(data)
    } else if (errno === 0 && !data.smsid) {
      return Toast('短信发送失败')
    }
  })
}

/**
 * 初始短信验证码按钮
 * @param btnQName
 * @param mobileQName
 * @param smsType
 * @param ms
 * @param callback
 */
export function initSMSButton (btnQName = '#btnSMS', mobileQName = '#mobile', smsType, ms = 60, callback = null) {
  const $btn = $(btnQName)
  if ($btn.cding > 0) return
  if (!smsType) {
    smsType = Int($btn.data('type'))
  }
  $btn.click(function () {
    let mobile = Trim($(mobileQName).val())
    sendSMSCode(mobile, smsType, function (data) {
      if (!data || !data.smsid) return
      $btn.cding = ms || 60
      // $btn.addClass('weui-btn_disabled')
      setBtnDisabled($btn, true, `剩余 ${--$btn.cding} 秒`)
      const timeId = setInterval(function () {
        if ($btn.cding > 1) {
          $btn.html(`剩余 ${--$btn.cding} 秒`)
        } else {
          clearInterval(timeId)
          delete $btn.cding
          // $btn.html(oldLabel)
          // $btn.removeClass('weui-btn_disabled')
          setBtnDisabled($btn, false)
        }
      }, 1000)
      if (callback) callback(data)
    })
  })
}

//判断是否是微信环境
export let weChat  = (function () { return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1 })();

//判断是否是移动端环境
export let mobileTerminal = (function(){return /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)})();

/*
  获取url中的参数值
 */
export function getUrlParam(name){
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r!=null) return unescape(r[2]); return null;
}