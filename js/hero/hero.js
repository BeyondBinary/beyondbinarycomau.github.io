/**
 * Hero section on the main page. This is the main object.
 */
(function(){

var hero = $('.hero');
if (!hero.length) {
    return;
}

$(function(){ hero.init() });

window.hero = hero.extend({
    config: {
        animationDuration: 1000,
        changeInterval: 7500,
        colors: {
            sequence: 'pink orange yellow green blue'.split(' '),
            
            pink:   '#ee4136',
            orange: '#f7931e',
            yellow: '#f8ec31',
            green:  '#8dc53e',
            blue:   '#20aae1',
            grey:   '#929497'
        }
    },

    init: function(){
        this.texts.init();
        this.morph.init();
        this.changeColor(0);
        this.resume();

        $('.hero .text-large, .hero-texts, .hero svg').on('mouseenter', function(){
            hero.stop();
        }).on('mouseleave', function(){
            hero.resume();
        });

    },

    states: {
        current: 0,
        length: 5
    },

    resume: function(){
        this.states.changeTimer = setTimeout(this.nextState, this.config.changeInterval);
        this.morph.resume();
    },

    stop: function(){
        clearTimeout(this.states.changeTimer);

        this.morph.stop();
        this.morph.changeState(this.states.current, 500); 
    },

    nextState: function(){
        hero.changeState(hero.getNextState());
        hero.resume();
    },

    getNextState: function(){
        var next = hero.states.current + 1;
        if (hero.states.length == next) {
            next = 0;
        }
        return next;
    },

    changeState: function(state_index){
        if (this.states.current == state_index) {
            return;
        }

        if (this.states.lock) {
            this.states.queued = state_index;
            return;
        }
        
        this.states.lock = true;

        hero.states.current = state_index;
        
        hero.texts.changeState(state_index);
        hero.bar.changeState(state_index);
        hero.morph.changeState(state_index, 500);
        
        setTimeout(this.stateChanged, this.config.animationDuration);
    },

    stateChanged: function(){
        delete hero.states.lock;

        if (hero.states.queued !== undefined) {
            hero.changeState(hero.states.queued);
            delete hero.states.queued;
        }
    },

    changeColor: function(index){
        var sequence = this.config.colors.sequence;
        var color = sequence[index];
        color = this.config.colors[color];
        $('.ui-slider-handle').css('border-color', color);
        $('.hero mark').css('color', color);
        this.morph.changeColor(color, index);
    }
});








})();


