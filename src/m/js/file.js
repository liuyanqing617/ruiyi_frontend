require('rjs-img-thumb')
const Gallery = require('./gallery')
const {Int, Alert, Toast} = require('./common')

// 字节格式化
export function bytes2Size (bytes, k = 1024) {
  if (bytes === 0) return '0 B';
  let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]
}

// 文件上传
export function Uploader (inputQName,
                          singleImgQName,
                          listQName,
                          listItemHtml,
                          listStatsQName,
                          resizeWidth = 0,
                          resizeHeight = 0,
                          onUploaded
                          ) {
  listItemHtml = listItemHtml || `<li class="weui-uploader__file"><img src="{SRC}"><b class="del">x</b></li>`
  listStatsQName = listStatsQName || '.weui-uploader__info'
  var fileList = []
  var $input = $(inputQName)
  var min = Int($input.data('min') || 0)
  var max = Int($input.data('max') || 100)
  var maxSize = Int($input.data('maxsize') || 1024)
  var isSquare = $input.data('square') == true
  var label = $input.data('label') || ''
  var isReadOnly = $input.data('readonly') == true
  var $singleImg = singleImgQName ? $(singleImgQName) : null
  var $list = listQName ? $(listQName) : null
  if ($list) {
    let children = $list.children()
    children.click(onImgClick)
    for (let i = 0; i < children.length; i++) {
      fileList.push($(children[i]).find('img').attr('src'))
    }
  }
  var $listStats = listStatsQName ? $(listStatsQName) : null
  if ($listStats && !$listStats.length) {
    $listStats = null
  }
  
  // 图片列表
  this.getFiles = function () {
    return fileList
  }
  
  // 只读写
  this.readOnly = function () {
    $input.parent().parent().find('.del').remove()
    $input.parent().remove()
  }
  
  // 重置
  this.reset = function () {
    fileList = []
    $list.children().remove();
    $input.parent().show()
  }
  
  if (isReadOnly) {
    this.readOnly()
  }
  
  updateStats()
  
  // 上传
  function onUpload (evt) {
    let files = event.target.files
    if (!files.length) {
      return null
    }
    let uploadCount = $list ? $list.children().length : 0
    if (uploadCount + files.length > max) {
      return resetListener(label + '最多上传' + max + '个文件')
    }
    if (files && files.length > 0) {
      for (let k in files) {
        let file = files[k]
        if (!file || !file.size) {
          continue
        }
        let size = Math.ceil(file.size / 1024, 0)
        if (size > maxSize) {
          return resetListener(label + '必须<=' + bytes2Size(maxSize) + '(' + bytes2Size(file.size) + ')<br>' + file.name)
        }
        resizeImage(file, resizeWidth, resizeHeight, isSquare, function (imgData) {
          let myFile = dataURLtoFile(imgData,file.name);
          // i++
          fileList.push(myFile)
          if (fileList.length >= max) {
            $input.parent().hide()
          }
          if ($singleImg) {
            $singleImg.attr('src', imgData)
            $singleImg.find('.del').click(deleteImg)
          } else if ($list) {
            let $item = $(listItemHtml.replace('{SRC}', imgData))
            $list.append($item)
            if(file.type.indexOf('image/') <= -1){
              $('.weui-uploader__file').html(file.name+'<b class="del">x</b>')
            }
            $item.click(onImgClick)
            updateStats()
            $item.find('img').imgThumb({
              width: '100%',
              height: '100%',
            });
          }
          if (onUploaded) {
            onUploaded(file, imgData)
          }
        });
      }
    }
  }
  
  function updateStats () {
    if ($listStats) {
      let uploadCount = $list ? $list.children().length : 0
      let limit = min !== max ? `${min}~${max}` : max
      $listStats.html(uploadCount ? `${uploadCount} / ${limit}` : limit)
      if (uploadCount >= max) {
        $input.parent().hide()
      }
    }
  }
  
  // 缩略图片
  function resizeImage (imgFile, resizeWidth, resizeHeight, isSquare, callback) {
    if (imgFile.type.indexOf('image/') > -1) {
      var image = null
      if (isSquare) {
        image = new Image();
        image.onload = function () {
          if (image.naturalWidth !== image.naturalHeight) {
            let msg = '必须上传正方形图片'
            Alert.info(msg)
            throw new Error(msg)
          }
        }
      }else{
        let resizeWidth = 750;
        image = new Image();
        let quality = 0.6;    //压缩系数0-1之间
        let oWidth, oHeight;
        image.onload = function () {
          oWidth = this.width;
          oHeight = this.height;
          let canvas = document.createElement("canvas");
          let context = canvas.getContext("2d");
          if (Math.max(oWidth, oHeight) > resizeWidth) {
            if (oWidth > oHeight) {
              canvas.width = resizeWidth;
              canvas.height = resizeWidth * oHeight / oWidth;
            } else {
              canvas.height = resizeWidth;
              canvas.width = resizeWidth * oWidth / oHeight;
            }
          } else {
            canvas.width = oWidth;
            canvas.height = oHeight;
            quality = 0.6;
          }
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(this, 0, 0, canvas.width, canvas.height);
          let imgdata = canvas.toDataURL(imgFile.type, quality); //压缩语句
          callback(imgdata);//必须通过回调函数返回，否则无法及时拿到该值
        }
      }
      
      const reader = new FileReader();
      reader.readAsDataURL(imgFile);
      reader.onload = function (e) {
        if (image) {
          image.src = reader.result;
        } else {
          callback && callback(reader.result);
        }
      }
    } else {
      // 非图片文件
      // callback && callback('/static/m/img/credits/icon_file.png');
      const reader = new FileReader();
      reader.readAsDataURL(imgFile);
      reader.onload = function (e) {
        callback && callback(reader.result);
      }

    }
  }
  
  // 重置监听(fix两次上传同一图片的BUG)
  function resetListener (msg) {
    var $upload = $($input.prop('outerHTML'))
    $input.replaceWith($upload);
    $upload.off('change').on('change', onUpload);
    $input = $upload
    if (msg) {
      Alert.info(msg, '系统提示')
    }
  }
  
  $input.on('change', onUpload)
  
  // 删除图片
  function deleteImg (evt, index) {
    if (evt) {
      let $item = $(this).parent()
      let list = $list.children()
      index = list.index($item)
    }
    if (index > -1) {
      $list.children().get(index).remove()
      fileList.splice(index, 1)
      $input.parent().show()
      updateStats()
    }
  }
  
  // 图片点击
  function onImgClick (evt) {
    let $item = $(this)
    let list = $list.children()
    let index = list.index($item)
    if (index === -1) {
      return
    }
    let $target = $(evt.target)
    if ($target.hasClass('del')) {
      return deleteImg(null, index)
    }
    let imgList = []
    $item.parent().find('img').each(function (idx, img) {
      imgList.push(img)
    })
    // Gallery.show(imgList, index)
  }
  
}

export function initUploaderView (domId) {
  let uploaderList = []
  $(domId).each(function () {
    let $this = $(this)
    let id = '#' + this.id
    let uploader = new Uploader(
      id + ' .uploader__input',
      null,
      id + ' .weui-uploader__files',
      `<li class="weui-uploader__file"><img src="{SRC}"><b class="del">x</b></li>`,
      id + ' .weui-uploader__info'
    )
    uploader.$input = $this.find('input')
    uploaderList.push(uploader)
  })
  return uploaderList
}

export function getUploaderImgs (uploaderList) {
  let uploaderImgs = []
  for (let uploader of uploaderList) {
    let datas = uploader.$input.data()
    let name = datas.name
    let label = datas.label
    let min = parseInt(datas.min)
    let max = parseInt(datas.max)
    let imgFiles = uploader.getFiles()
    if (imgFiles) {
      let count = imgFiles.length
      if (count < min) {
        return Toast.info('请上传：' + label)
      } else if (count > max) {
        return Toast.info(`最多允许上传${max}个文件(${label})`)
      } else {
        for (let i = 0, len = imgFiles.length; i < len; i++) {
          uploaderImgs.push({key: `${name}_${i}`, val: imgFiles[i]})
        }
      }
    } else if (min > 0) {
      return Toast.info('请上传：' + label)
    }
  }
  return uploaderImgs
}


function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(',');
  var mime = arr[0].match(/:(.*?);/)[1];
  var bstr = atob(arr[1]);
  var n = bstr.length; 
  var u8arr = new Uint8Array(n);
  while(n--){
      u8arr[n] = bstr.charCodeAt(n);
  }
  //转换成file对象
  return new File([u8arr], filename, {type:mime});
  //转换成成blob对象
  //return new Blob([u8arr],{type:mime});
}


