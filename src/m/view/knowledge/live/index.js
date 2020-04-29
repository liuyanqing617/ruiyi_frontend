require('./index.less')
const {} = require('../../../js/common')

$(function () {

    var swiper = new Swiper('.swiper-container', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        },
        pagination: {
          el: '.swiper-pagination',
        },
      });


    $('.swiper-slide').click=(function(obj){
        $('.video-list .swiper-slide .text').css('font-size', '14px')
        $(obj).find('.text').css('font-size', '16px')
        let box = document.getElementById('videoId')
        box.src = $(obj).data('url')
        $(".video-play video").append(box);
        $(".video-play").show();
        // 自动播放
        $(".video-play video")[0].play()
        $('.swiper-slide').removeClass("play")
        $(obj).addClass("play")
    })
});

