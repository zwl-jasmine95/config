$(function(){
    getData()
})

function getData() {
    $.ajax({
        url:'/api/users/571994c70cf28f1eb201f785/info',
        type: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function(res) {
            console.log(res)
        }
    })
}
console.log(111)