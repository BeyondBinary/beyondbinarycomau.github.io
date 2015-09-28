/**
 * Hero SVG morph
 */
(function(hero){

if (!hero) {
    return;
}

$('#morph').css('background', 'none');
var snap = Snap($('#morph svg')[0]);

hero.morph = {
    init: function(){
        //inner circle changing colors
        this.figures.innerCirle = snap.circle(0, 0, 15).attr(this.styles).attr('stroke', hero.config.colors.pink);

        //outer circle (at the end)
        this.figures.outerCircle = snap.circle(0, 0, 15).attr(this.styles).attr({opacity: 0, strokeWidth: 2});

        this.figures.hexagon = '012345'.split('').map(function(i){ 
            return snap.path("M-21,-79L21,-79").attr({transform: 'rotate('+i*60+')'});
        });
        this.figures.hexagon = snap.group.apply(snap, this.figures.hexagon).attr(this.styles);

        //squares in the middle
        this.figures.squares = '012'.split('').map(function(){ 
            return snap.rect(-10,-10,20,20);
        });
        this.figures.squares = snap.group.apply(snap, this.figures.squares).attr(this.styles).attr('opacity', 0);


        this.figures.hexagonTriangles = '0 1 2 3 4 5 6 7 8 9 10 11'.split(' ').map(function(i){ 
            var even = i%2 === 0;
            i = Math.floor(i/2);
            return snap.path(even ? "M-20.5,-79L.5,-79" : "M-.5,-79L20.5,-79").attr({transform: 'rotate('+(i*60)+')'});
        });
        this.figures.hexagonTriangles = snap.group.apply(snap, this.figures.hexagonTriangles).attr(this.styles);


        this.figures.midTriangles = '012'.split('').map(function(i){ 
            var g = snap.group(
                snap.path("M-39,-39L39,-39"),
                snap.path("M39,-39L39,39"),
                snap.path("M-39,39L39,39"),
                snap.path("M-39,-39L-39,39")
            ).attr({transform: 'r'+i*60});
            g.each = hero.morph.each;
            return g;
        });
        
        this.figures.midTriangles = snap.group.apply(snap, this.figures.midTriangles).attr(this.styles).attr('opacity', 0);

        for (var fig in this.figures){
            this.figures[fig].each = this.each;
        }
    },

    random: function(min, max){
        return Math.random() * (max - min) + min;
    },

    //default styles
    styles: {
        strokeWidth: 1,
        fill: 'none',
        stroke: hero.config.colors.grey
    },

    figures: {},

    each: function (callback){
        var i = 0;
        while (this[i]){
            callback.call(this[i], i++);
        }
    },

    resume: function(){
        // in continious motion morph should be one step ahead
        hero.morph.changeState(hero.getNextState());
    },

    stop: function(){

        var timer;
        while (timer = this.states.timers.shift()){
            clearTimeout(timer);
        }

        var reverse_stop = function(){
            this.stop();
            if (this.each) {
                this.each(reverse_stop);
            }
        }

        var figure, name;
        for (var name in hero.morph.figures){
            figure = hero.morph.figures[name];
            figure.stop();
            figure.each(reverse_stop);
        }
    },

    changeColor: function(color, index){
        var last = index+1 == this.states.animations.length;
        
        this.figures.innerCirle.animate({
            stroke: color,
            strokeWidth: last ? 3 : 1
        }, 250);
    },

    changeState: function(state_index, duration){

        var delta = state_index - this.states.current;
        var forward = delta > 0;

        var states_to_pass = Math.sqrt(delta*delta);

        duration = duration || hero.config.changeInterval;
        duration /= states_to_pass;

        var index = this.states.current;
        var delay = 0;

        while (states_to_pass--){
            (function(delay, state){
                hero.morph.states.current = state;
                hero.morph.states.timers.push(setTimeout(function(){
                    hero.morph.states.animations[state].call(hero.morph, forward, duration);
                }, delay));
            })(duration * delay++, forward ? ++index : --index);
        }

    },

    states: {

        current: 0,

        timers: [],

        animations: [

            function state0(forward, duration){
                if (!forward) {
                    this.figures.squares.animate({
                        opacity: 0,
                        transform: ''
                    }, duration);
                    this.figures.squares.each(function(){
                        this.animate({x: -10, y: -10, width: 20, height: 20}, duration);
                    });

                    this.figures.hexagon.animate({ transform: "rotate(180)" }, duration);
                    this.figures.hexagonTriangles.animate({
                        transform: "rotate(180)"
                    }, duration, function (){
                        //reset back
                        hero.morph.figures.hexagon.transform('');
                        hero.morph.figures.hexagonTriangles.transform('');
                    });
                }
            },
            
            function state1(forward, duration){

                if (forward) {
                    this.figures.squares.animate({
                        opacity: 1,
                        transform: 'rotate(315)'
                    }, duration);

                    this.figures.squares.each(function(){
                        this.animate({x: -39, y: -39, width: 78, height: 78}, duration);
                    });

                    this.figures.hexagon.animate({ transform: "rotate(-180)" }, duration);

                    this.figures.hexagonTriangles.animate({
                        transform: "rotate(-180)"
                    }, duration, function (){
                        //reset back
                        hero.morph.figures.hexagon.transform('');
                        hero.morph.figures.hexagonTriangles.transform('');
                    });
                } else {
                    this.figures.squares.each(function(i){
                        this.animate({transform: ''} , duration);
                    });

                    hero.morph.figures.hexagonTriangles.each(function(i){
                        var self = this;
                        var interval = duration / 6;
                        var timer = setTimeout(function(){
                            var even = i%2 === 0;
                            self.animate({
                                d: even ? "M-20.5,-79L.5,-79" : "M-.5,-79L20.5,-79"
                            }, interval, mina.bounce);
                        }, Math.floor(i/2)*interval);

                        hero.morph.states.timers.push(timer);
                    });
                }


                
            },
            
            function state2(forward, duration){
                if (forward) {
                    this.figures.squares.each(function(i){
                        this.animate({transform: 'rotate('+(15+60*i)+')'} , duration);
                    });

                    hero.morph.figures.hexagonTriangles.each(function(i){
                        var self = this;
                        var interval = duration / 6;
                        var timer = setTimeout(function(){
                            var even = i%2 === 0;
                            self.animate({
                                d: even ? "M-20.5,-79L.5,-90" : "M-.5,-90L20.5,-79"
                            }, interval, mina.bounce);
                        }, Math.floor(i/2)*interval);
                        hero.morph.states.timers.push(timer);
                    });

                } else {
                    for (var i = 0; i < 3; i++){
                        // this.figures.squares[i].animate({transform: ''} , duration);
                    }

                    // shorten triangles
                    hero.morph.figures.hexagonTriangles.each(function(i){
                        var even = i%2 === 0;
                        this.animate({
                            d: even ? "M-20.5,-79L.5,-90" : "M-.5,-90L20.5,-79"
                        }, duration*hero.morph.random(.33, 1));
                    });

                    // shorten base of triangles
                    hero.morph.figures.hexagon.each(function(){
                        this.animate({d: "M-21,-79L21,-79"}, duration*hero.morph.random(.33, 1));
                    });


                    var ds = ["M-39,-39L39,-39", "M39,-39L39,39", "M-39,39L39,39", "M-39,-39L-39,39"];
                    this.figures.midTriangles.animate({opacity: 0}, duration);
                    this.figures.midTriangles.each(function(){
                        this.each(function(j){
                            this.animate({d: ds[j]}, duration*hero.morph.random(.33, 1));
                        });
                    });
                }
            },

            function state3(forward, duration){
                if (forward) {

                    //extend base of triangles
                    this.figures.hexagon.each(function(){
                        this.animate({d: "M-46,-79L46,-79"}, duration * hero.morph.random(.33, 1));
                    });

                    //extend triangles
                    this.figures.hexagonTriangles.each(function(i){
                        var even = i%2 === 0;
                        this.animate({d: even ? "M-40.8,-66.4L.5,-90" : "M-.5,-90L40.8,-66.4"}, duration * hero.morph.random(.33, 1));
                    });

                    var ds = ["M-67.6,-39L67.6,-39", "M39,-67.6L39,67.6", "M-67.6,39L67.6,39", "M-39,-67.6L-39,67.6"];
                    this.figures.midTriangles.attr({opacity: 1});
                    this.figures.midTriangles.each(function(){
                        this.each(function(j){
                            this.animate({d: ds[j]}, duration * hero.morph.random(.33, 1));
                        });
                    });

                } else {
                    this.figures.outerCircle.animate({
                        'r': 25,
                        'opacity': 0
                    }, duration);
                }

            },
            
            function state4(forward, duration){

                hero.morph.states.timers.push(setTimeout(function(){
                    hero.morph.figures.innerCirle.animate({
                        stroke: '#20aae1',
                        strokeWidth: 3
                    }, duration*.1);
                }, duration*.9));


                this.figures.outerCircle.animate({
                    'r': 97,
                    'opacity': 1
                }, duration);
            }
        ]
    }

}





})(window.hero);


