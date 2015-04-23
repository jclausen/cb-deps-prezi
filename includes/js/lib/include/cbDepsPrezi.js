cbDepsPrezi = function(){}

/*** Video Modal Functions ***/
cbDepsPrezi.init=function(){
  VidService = new VideoService();
  console.log('Video Service Ready!');
  DiscusService = new DiscusService();
  DiscusService.init();
  console.log('Application Javascript Ready!');
};

$(document).ready(function(){
  cbDepsPrezi.init();
});