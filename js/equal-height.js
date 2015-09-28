/**
 * Find all elements that have equal-height-* in their class
 */
(function(){

$(window).resize(resize).trigger('resize');

function resize() {
    var groups = {};

    $('[class*="equal-height-"]').each(function(){
        this.style.height = '';
        var group_name = /equal-height-([\w-]*)/.exec(this.className).shift();
        groups[group_name] = groups[group_name] || [];
        groups[group_name].push(this.offsetHeight);
    });

    for (var group_name in groups){
        var max = Math.max.apply(Math, groups[group_name]);
        $('.'+group_name).each(function(){
            if (this.offsetWidth / get_window_width() < .8) {
                this.style.height = max+'px';
            } else {
                this.style.height = '';
            }
        });
    }
}

function get_window_width() {
    return window.innerWidth  || document.documentElement.clientWidth  || document.body.clientWidth;
}


})();


