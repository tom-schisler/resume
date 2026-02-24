jQuery(function($) {
  // console message 
  console.log('%c Breathe In, Breathe Out, Move On', 'font-weight: bold; font-size: 16px;color: #fff; text-shadow: 3px 3px 0 rgb(128, 53, 0) , 6px 6px 0 rgb(0, 32, 128)');

  // slider full size image
  $('.carousel button').on('click', function() {
    // "this" refers to the specific image element that was clicked
    var imageUrl = $(this).find('img').attr('src'); 
    var imageAlt = $(this).find('img').attr('alt'); 
    
    // Log the URL to the console
    console.log(imageUrl); 
    
    $('#dialog figure img').attr('src', imageUrl).attr('alt', imageAlt);

  });

});

//      <dialog id="dialog">
//        <button commandfor="dialog" command="close">&times</button>
//        <figure>
//          <img src="img/portfolio/adeccousa-living-wage-tool-mobile.png" alt="" />
//        </figure>
//      </dialog>