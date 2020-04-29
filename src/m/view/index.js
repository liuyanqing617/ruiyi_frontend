require('./index.less')
const {} = require('../js/common')

$(function () {
  
  //播放事件
  $('.gg-img').click(function () {
      $('#wavFileId').src = '/static/m/video/voice.wav'
    }
  )
  
  //播放停止切换
  $('.isStop').click(function () {
    let audio = document.getElementById('wavFileId');
    if (audio !== null) {
      //检测播放是否已暂停.audio.paused 在播放器播放时返回false.
      if (audio.paused) {
        audio.play();//audio.play();// 这个就是播放
        $('.laba-img').attr('src', '/static/m/img/index/laba.png');
      } else {
        audio.pause();// 这个就是暂停
        $('.laba-img').attr('src', '/static/m/img/index/Mute.png');
      }
    }
  })
  
  // 专属科室切换
  $('.department').click(function () {
    let type = $(this).data('menu')
    let img = $(this).data('img')
    $('.department').removeClass('menucheck')
    $('.menu' + type).addClass('menucheck')
    
    $('.banner-img').attr('src',img)
  })
  
});

// $('.message-model').click(function () {
//     $(this).location.href = "../department/index.html"; 
//     console.log('a')
// })

function noticeLink (item) {
  let noticStr = JSON.stringify(item);
  switch (item.mtype) {
    case '1':
      location.href = "../pediatric/pediatric.html";
      break;
    case '2':
      location.href = "../futie/futie.html";
      break;
    case '3':
      location.href = "../rectumBranch/rectumBranch.html";
      break;
    case '4':
      location.href = "../gaofang/gaofang.html";
      break;
  }
}