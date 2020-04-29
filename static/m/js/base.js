//导航的点击事件
$(document).on('click','.menu-icon-id', function(e){
    if(!e.isPropagationStopped()){
        if($('.head-menu-box').hasClass('hide-class')){
            $('.head-menu-box').removeClass('hide-class');
        }else{
            $('.head-menu-box').addClass('hide-class');
        }
    }
    e.stopPropagation();
    return false;
});

//js点击空白处关闭弹窗
$(document).mouseup(function(e){
    var _con = $('.head-menu-box,.menu-icon-id');   // 设置目标区域
    if(!_con.is(e.target) && _con.has(e.target).length === 0){ // Mark 1
        if($('.head-menu-box').hasClass('hide-class') == false){
            $('.head-menu-box').addClass('hide-class');
        }
    }
});


$('.backUpPage').click(function(){
    history.go(-1)
})