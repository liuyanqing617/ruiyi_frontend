require('./index.less')
const {getUrlParam} = require('../../js/common')

$(function () {
  let type = getUrlParam('type') || 1
  $('.menu' + type).addClass('menu-check')
  $('.hide-class').hide()
  $('.isshow' + type).show()
  
  $('.course-btn').click(function () {
    let sort = $(this).data('sort')
    $('.course-btn').removeClass('menu-check')
    $('.menu' + sort).addClass('menu-check')

    $('.hide-class').hide()
    $('.isshow' + sort).show()
  })
});