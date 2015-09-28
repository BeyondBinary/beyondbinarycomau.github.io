/**
 * Hero bar/slider
 */
(function(hero){

if (!hero) {
    return;
}

hero.bar = $('.hero-bar').css('display', 'block').slider({
    max: hero.states.length-1,

    start: function(){
        hero.bar.dragging = true;
        hero.stop();
    },
    
    slide: function() {
        clearTimeout(hero.bar.changeTimer);
        hero.bar.changeTimer = setTimeout(hero.bar.changed, 100);
    },

    stop: function(){
        hero.bar.dragging = false;
        hero.resume();

    }
}).extend({

    changed: function(){
        var state_index = hero.bar.slider('value');
        hero.changeState(state_index);
        
    },

    changeState: function(state_index){
        if (!hero.bar.dragging) {
            setTimeout(function(){

            var left = state_index / hero.bar.slider('option', 'max') * 100 + '%';
            hero.bar.find('.ui-slider-handle').animate({'left': left}, .3333*hero.config.animationDuration);

            }, hero.config.animationDuration * .6666);
        }
    }

});


})(window.hero);

