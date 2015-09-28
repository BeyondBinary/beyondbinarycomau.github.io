/**
 * Main navigation animation
 */

(function(){

var burger = $('#menu-burger').show();
var menu = $('.header-navigation').hide();

burger.extend({
    svg: Snap(burger[0]),
    toBurger: function(){
        this.svg.select('path:nth-child(1)').animate({
            path: 'm 5.0916789,20.818994 53.8166421,0"}',
            stroke: '#7b7b7b'
        }, 600, mina.elastic);
        this.svg.select('path:nth-child(2)').animate({
            opacity: 1
        }, 600, mina.elastic);
        this.svg.select('path:nth-child(3)').animate({
            path: 'm 5.0916788,42.95698 53.8166422,0"}',
            stroke: '#7b7b7b'
        }, 600, mina.elastic);
    },
    toX: function(){
        this.svg.select('path:nth-child(1)').animate({
            path: 'M 12.972944,50.936147 51.027056,12.882035',
            stroke: '#20aae1'
        }, 600, mina.elastic);
        this.svg.select('path:nth-child(2)').animate({
            opacity: 0
        }, 600, mina.elastic);
        this.svg.select('path:nth-child(3)').animate({
            path: 'M 12.972944,12.882035 51.027056,50.936147',
            stroke: '#20aae1'
        }, 600, mina.elastic);
    }
});
burger.click(toggle_menu);

function toggle_menu() {

    var visible = menu.is(':visible');
    var menu_width = menu.css('display', 'inline-block').outerWidth();

    //if the menu takes up all screen then it's mobile (vertical)
    var menu_mobile = menu_width >= $(window).width();
    var attribute_to_animate = menu_mobile ? 'height' : 'width';

    if (visible) {
        //hide
        var options = {opacity: 0};
        options[attribute_to_animate] = 0;
        menu.animate(options, 'fast', reset);
        burger.toBurger();
    } else {
        //show
        var init_options = {opacity: 0};
        var animate_options = {opacity: 1};
        init_options[attribute_to_animate] = 0;
        animate_options[attribute_to_animate] = menu.css('display', 'inline-block').css(attribute_to_animate);
        menu.css(init_options).animate(animate_options, 'fast', reset);
        burger.toX();
    }
}

function reset() {
    var visible = menu.css('opacity') == '1';
    menu.removeAttr('style');
    menu.css('display', visible ? 'inline-block' : 'none');
}

    
})();