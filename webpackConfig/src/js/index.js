import '../scss/index.scss'

import img from '../images/horn.png'

$(function(){
    //js背景图
    $('.img .three').css('background-image','url(' + img + ')')

    // js改变img元素
    $('.img .four').attr('src','https://image.bonday.cn/images/1522746932079-QHyRkYa5QP.png')

})

