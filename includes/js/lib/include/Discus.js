/**
 * Discus Comment Service Library
 *
 * @package    SiloWeb.JS.Common
 * @author     Jon Clausen <jon_clausen@silowebworks.com>
 * @copyright  (c) 2015 Silo Web LLC
 * @link       http://silowebworks.com/
 *
 */
DiscusService = function(){};
DiscusService.prototype.init = function(discus_shortname,target){
	if(typeof(angular) === 'undefined'){
		console.log('Oops! AngularJS is not available.');
		return false;
	}
	var $scope = angular.element('[ng-controller=cbDepsPrezi]').scope()
	if(typeof($scope) !== 'undefined' && typeof($scope.article_data) !== 'undefined'){
		$.getScript('//' + disqus_shortname + '.disqus.com/embed.js',function(){
			console.log('Discus Loaded!');
		});
	}
}

DiscusService.prototype.reset = function(article_id,permalink){
	DISQUS.reset({
      reload: true,
      config: function () {
      this.page.identifier = article_id;
      this.page.url = permalink;
      }
   });
}

DiscusService.prototype.loadComments = function(target,article_id,permalink){
	var self = this;
	if(!window.DISQUS){
		self.init(discus_shortname);
	} else {
		self.reset(article_id,permalink);
	}

}