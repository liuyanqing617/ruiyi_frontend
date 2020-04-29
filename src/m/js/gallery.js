const Gallery = {
  
  swiper: null,
  $swiper: null,
  
  init: () => {
    if (this.swiper) {
      return
    }
    this.$swiper = `
<style>
  .swiper-gallery {
    position: fixed;
    top: 0;
    background: #000;
    width: 100%;
    height: 100%;
    z-index: 1001;
    display: flex;
    align-items: center;
  }
  .swiper-gallery .swiper-slide {
    display: flex;
    align-items: center;
    align-self: center;
  }
  .swiper-gallery img {
    width: 100%;
    height: auto;
  }
  .swiper-gallery .swiper-pagination-bullet {
    background-color: #fff;
    border: 1px solid #000;
  }
</style>
<div class="swiper-container swiper-gallery">
  <div class="swiper-wrapper"></div>
  <div class="swiper-pagination swiper-pagination-white"></div>
</div>`
    $("body").append(this.$swiper);
    this.$swiper = $('.swiper-gallery')
    this.$swiperList = $('.swiper-gallery .swiper-wrapper')
    
    this.swiper = new Swiper('.swiper-gallery', {
      observer: true,
      observeParents: true,
      slidesPerView: 1,
      zoom: true,
      initialSlide: 0,
      pagination: {
        el: '.swiper-gallery .swiper-pagination',
      },
    });
  },
  
  show: (imgList, index = 0) => {
    if (index < 0) index = 0
    Gallery.init()
    let slideList = []
    for (let item of imgList) {
      slideList.push(`<div class="swiper-slide"><img src="${item.src || item.img || item}"></div>`)
    }
    this.$swiperList.html(slideList.join(''))
    $('body').append(this.$swiper);
    this.swiper.slideTo(index)
    this.$swiper.find('img').click(Gallery.hide)
  },
  
  // 隐藏
  hide: () => {
    this.$swiper.remove()
  },
  
  // 销毁
  destroy: () => {
    this.$swiper.remove()
    this.$swiper = null
    this.swiper.destroy(true, true);
    this.swiper = null
  }
  
}

module.exports = Gallery