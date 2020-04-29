require('./news.less')
const {} = require('../../js/common')

$(function () {
  $('.course-btn').click(function () {
    let sort = $(this).data('sort')
    $('.course-btn').removeClass('menu-check')
    $('.menu' + sort).addClass('menu-check')

    $('.course-switch').hide()
    $('.isshow' + sort).show()
  });
  $('.weike-list-box-a').click(function(){
    window.location.href='https://i.eqxiu.com/s/yLXKwJV9' ;
  });
  $('.weike-list-box-b').click(function(){
    window.location.href='' ;
  });
});