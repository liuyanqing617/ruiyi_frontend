require('./index.less')
const {} = require('../js/common')

$(function () {
  
  //播放事件
  $('.voice-img img').click(function () {
    $('#wavFileId').attr('src', '/static/m/video/voice.wav');
    }
  )
  
  //播放停止切换
  $('.horn-icon').click(function () {
    let audio = document.getElementById('wavFileId');
    if (audio !== null) {
      //检测播放是否已暂停.audio.paused 在播放器播放时返回false.
      if (audio.paused) {
        audio.play();//audio.play();// 这个就是播放
        $('.horn-icon img').attr('src', '/static/m/img/index/laba.png');
      } else {
        audio.pause();// 这个就是暂停
        $('.horn-icon img').attr('src', '/static/m/img/index/Mute.png');
      }
    }
  })
  
  // 点击切换内容
  $('.smallclass').click(function () {
    let type = $(this).data('sort')
    let img = $(this).data('img')
    //改变按钮样式
    $('.smallclass').removeClass('active')
    $('.sort' + type).addClass('active')
  
    //显示对应图片
    $('.banner-div').hide()
    $('.menu-content' + type).show()
    
    $('.banner-img').attr('src',img)
  })
  
  
});