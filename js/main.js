jQuery(function($) {
  // console message 
  console.log('%c Breathe In, Breathe Out, Move On', 'font-weight: bold; font-size: 16px;color: #fff; text-shadow: 3px 3px 0 rgb(128, 53, 0) , 6px 6px 0 rgb(0, 32, 128)');

  // slider full size image
  $('.carousel button').on('click', function() {
    
    // get img info 
    var imageUrl = $(this).find('img').attr('src'); 
    var imageAlt = $(this).find('img').attr('alt'); 
  
    // set dialog
    $('#dialog figure img').attr('src', imageUrl).attr('alt', imageAlt);

  });

});