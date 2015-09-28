(function(){

var duration = 5000;

$.notification = function(options){
    //hide current notifications if any
    $('.notification').fadeOut(250);

    if (typeof options == 'string') {
        options = {
            text: options
        };
    }

    var n = $('<div>', {
        'class': 'notification '.concat(options.type || ''),
        'appendTo': 'body',
        'html': '<div class="container">'+options.text+'</div>'
    });
    n.hide().slideDown(250);

    var close = function(){
        clearTimeout(timer);
        n.slideUp(250, function(){
            n.remove();
        });
    };

    $('<span>', {
        'class': 'close',
        'html': '&times;',
        'click': close,
        'appendTo': n.find('.container')
    });

    var timer = setTimeout(close, duration);

    return n;
}

    
})();