
(function($, win) {
    $.fn.inViewport = function(cb) {
       return this.each(function(i,el){
         function visPx(){
           var H = $(this).height(),
               r = el.getBoundingClientRect(), t=r.top, b=r.bottom;
           return cb.call(el, Math.max(0, t>0? H-t : (b<H?b:H)));  
         } visPx();
         $(win).on("resize scroll", visPx);
       });
    };
  }(jQuery, window));

$(document).ready(function() {

    $("#aboutme").inViewport(function(px){
        if(px) {
            $("#aboutMeImage").addClass("fadeInLeft") ;
            $("#aboutMeText").addClass("fadeInRight");
            $("#aboutMeImage").css("opacity", "1");
            $("#aboutMeText").css("opacity", "1");
        }
    });

    $("#misceallous").inViewport(function(px){
        if(px) {
            $("#misceallousYoutube").addClass("rotateInDownLeft") ;
            $("#misceallousSoundcloud").addClass("bounceInDown");
            $("#misceallousYoutube").css("opacity", "1");
            $("#misceallousSoundcloud").css("opacity", "1");
        }
    });

    $("#contact").inViewport(function(px){
        if(px) {
            $("#contactAnimation").addClass("fadeInUp") ;
            $("#contactAnimation").css("opacity", "1");
        }
    });

    
    $("#sidebarmenu").inViewport(function(px){
        var viewportWidth = $(window).width();
        //if (viewportWidth > 768 ) {
            if(px) {
                $("#sidebarmenu").addClass("fadeInLeftSpeed") ;
                $("#sidebarmenu").css("opacity", "1");
            }
        //} 
    });
    

    /* click event sur le bouton du navbar */
    $('.nav-button').click(function() {
        $('.nav-button').toggleClass('change');
    });

    $('.connected-nav-button').click(function() {
        $('.connected-nav-button').toggleClass('change');
    });

    $('.rss-nav-button').click(function() {
        $('.rss-nav-button').toggleClass('change');
    });


    /* permet le scroll vers la section lors click sur navigation */
    $(document).ready(function() {
        $("a").on("click", function(event) {
            if (this.hash !== "") {
                event.preventDefault();
                var hash = this.hash;
                $("html, body").animate({
                    scrollTop: $(hash).offset().top
                }, 500, function() {
                    window.location.hash = hash;
                    $('.navbar-collapse').collapse('hide');
                    $('.nav-button').removeClass('change');
                }
            );
            }
        });
    });

    /* ajoute la class active sur le lien cliqué, enlève sur les autres */
    $(document).ready(function(){
        $('a').click(function(){
            $('a').removeClass("active");
            $(this).addClass("active");
        });
    });

    $(document).ready(function(){
        $('a').click(function(){
            $('a').removeClass("current");
            $(this).addClass("current");
        });
    });



    /*$(window).resize(function () {
        var viewportWidth = $(window).width();
        if (viewportWidth > 768 ) {
            $('#sidebar').addClass("fixed-top");
        } else {
            $('#sidebar').removeClass("fixed-top");
        }
    });*/


    /*$(window).scroll(function() {
        let position = $(this).scrollTop();
        if (position >= 200) {
            $('.nav-menu').addClass('custom-navbar');
        } else {
            $('.nav-menu').removeClass('custom-navbar');
        }
    });*/

    /*$(window).scroll(function() {
        let position = $(this).scrollTop();
        let windowWidth = $(this).width();
        //console.log(windowWidth);
        if (position >= 100) {
            $('.about-img').addClass('fromLeft');
            $('.about-text').addClass('fromRight');
        } else {
            $('.about-img').removeClass('fromLeft');
            $('.about-text').removeClass('fromRight');            
        }

    });*/


    $(document).ready(function() {
        $("#projects-slider").owlCarousel({
            animateOut: 'fadeOut',
            animateIn: 'fadeIn',
            items: 2,
            autoplay: false,
            smartSpeed: 700,
            loop: true,
            autoplayHoverPause: true,
            mouseDrag: true,
            touchDrag: false,
            responsive: {
                0: {
                    items: 1,
                    mouseDrag: false,
                    touchDrag: true
                },
                450: {
                    items: 1,
                    mouseDrag: false,
                    touchDrag: true
                },
                576: {
                    items: 2,
                    mouseDrag: false,
                    touchDrag: true
                },
                768: {
                    items: 3,
                    mouseDrag: false,
                    touchDrag: true
                },
                1150: {
                    items: 3,
                    mouseDrag: false,
                    touchDrag: true
                }
            }
        });
    });
    
    var owl = $('.owl-carousel');
    $('.owl-carousel').on('mouseenter',function(){ //Kiedy myszka najedzie na element slidera
        owl.trigger('stop.owl.autoplay'); // Rozpocznij przewijanie
     })
     $('.owl-carousel').on('mouseleave',function(){ //Kiedy kursor wyjedzie z slidera
         owl.trigger('stop.owl.autoplay'); // Zatrzymaj przewijanie slidera
     });

});

