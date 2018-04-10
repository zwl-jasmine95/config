import '../scss/hello.scss'

import $ from 'jquery'

$.ajax({
    url:'/api/menu/hearing/list',
    type:'GET',
    dataType: 'json',
    contentType: 'application/json'
}).then(res => {
    console.log(res)
},err => {

})
