(function ($) {
  // Image transition function
  Materialize.fadeInImage =  function(selectorOrEl) {
    var element;
    if (typeof(selectorOrEl) === 'string') {
      element = $(selectorOrEl);
    } else if (typeof(selectorOrEl) === 'object') {
      element = selectorOrEl;
    } else {
      return;
    }
    element.css({opacity: 0});
    $(element).velocity({opacity: 1}, {
        duration: 650,
        queue: false,
        easing: 'easeOutSine'
      });
    $(element).velocity({opacity: 1}, {
          duration: 1300,
          queue: false,
          easing: 'swing',
          step: function(now, fx) {
              fx.start = 100;
              var grayscale_setting = now/100;
              var brightness_setting = 150 - (100 - now)/1.75;

              if (brightness_setting < 100) {
                brightness_setting = 100;
              }
              if (now >= 0) {
                $(this).css({
                    "-webkit-filter": "grayscale("+grayscale_setting+")" + "brightness("+brightness_setting+"%)",
                    "filter": "grayscale("+grayscale_setting+")" + "brightness("+brightness_setting+"%)"
                });
              }
          }
      });
  };

  // Horizontal staggered list
  Materialize.showStaggeredList = function(selectorOrEl) {
    var element;
    if (typeof(selectorOrEl) === 'string') {
      element = $(selectorOrEl);
    } else if (typeof(selectorOrEl) === 'object') {
      element = selectorOrEl;
    } else {
      return;
    }
    var time = 0;
    element.find('li').velocity(
        { translateX: "-100px"},
        { duration: 0 });

    element.find('li').each(function() {
      $(this).velocity(
        { opacity: "1", translateX: "0"},
        { duration: 800, delay: time, easing: [60, 10] });
      time += 120;
    });
  };

  Materialize.initializeDismissable = function() {
      // Touch Event
      var swipeLeft = false;
      var swipeRight = false;


      // Dismissible Collections
      $('.dismissable').each(function() {
          $(this).hammer({
              prevent_default: false
          }).bind('pan', function(e) {
              if (e.gesture.pointerType === "touch") {
                  var $this = $(this);
                  var direction = e.gesture.direction;
                  var x = e.gesture.deltaX;
                  var velocityX = e.gesture.velocityX;

                  $this.velocity({
                      translateX: x
                  }, {
                      duration: 50,
                      queue: false,
                      easing: 'easeOutQuad'
                  });

                  // Swipe Left
                  if (direction === 4 && (x > ($this.innerWidth() / 2) || velocityX < -0.75)) {
                      swipeLeft = true;
                  }

                  // Swipe Right
                  if (direction === 2 && (x < (-1 * $this.innerWidth() / 2) || velocityX > 0.75)) {
                      swipeRight = true;
                  }
              }
          }).bind('panend', function(e) {
              // Reset if collection is moved back into original position
              if (Math.abs(e.gesture.deltaX) < ($(this).innerWidth() / 2)) {
                  swipeRight = false;
                  swipeLeft = false;
              }

              if (e.gesture.pointerType === "touch") {
                  var $this = $(this);
                  if (swipeLeft || swipeRight) {
                      var fullWidth;
                      if (swipeLeft) {
                          fullWidth = $this.innerWidth();
                      } else {
                          fullWidth = -1 * $this.innerWidth();
                      }
                      $this.velocity({
                          translateX: fullWidth,
                        },
                        {
                          duration: 100,
                          queue: false,
                          easing: 'easeOutQuad',
                          complete: function() {
                            $this.css('transform', 'translate(0,0)')
                            $this.trigger('removeItem');
                          }
                      });
                  } else {
                      $this.velocity({
                          translateX: 0,
                      }, {
                          duration: 100,
                          queue: false,
                          easing: 'easeOutQuad'
                      });
                  }
                  swipeLeft = false;
                  swipeRight = false;
              }
          });

      });
  };

  $(document).on('ready turbolinks:load', Materialize.initializeDismissable);
}(jQuery));
