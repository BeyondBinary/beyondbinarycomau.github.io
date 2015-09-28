/**
 * Hero texts. These texts change with glitch effect.
 */
(function(hero){

if (!hero) {
    return;
}

hero.texts = $('.hero-texts').extend({

    init: function(){
        this.children().css('position', 'absolute').hide().first().show();
        var self = this;
        self.setupFixedHeight();
        $(window).resize(function(){ self.setupFixedHeight() });

        this.find('p').each(function(){
            //this is needed for the glitch effect
            this.setAttribute('data-text', $(this).text());
        });
    },

    glitch: function (enabled){
        this.find('p').toggleClass('glitch', enabled);
    },

    changeState: function(state_index){
        var current = this.children(':visible');
        var next = this.children().eq(state_index);

        this.glitch(true);

        var interval = .33333*hero.config.animationDuration;

        setTimeout(function(){ next.fadeIn(interval) }, 1*interval);
        setTimeout(function(){ current.fadeOut(interval); hero.changeColor(state_index); }, 2*interval);
        setTimeout(function(){ hero.texts.glitch(false); }, 3*interval);
    },

    setupFixedHeight: function(){
        var arr = this.children().map(function(){
            return $(this).height();
        });
        this.height(Math.max.apply(Math, arr));
    }
});



})(window.hero);

