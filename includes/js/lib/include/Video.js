/**
 * Video Service Library
 *
 * @package    SiloWeb.JS.Common
 * @author     Jon Clausen <jon_clausen@silowebworks.com>
 * @copyright  (c) 2015 Silo Web LLC
 * @link       http://silowebworks.com/
 *
 */
VideoService = function(){
    this.video_directory = '/media/video';
    this.flowplayer_path = '/includes/js/vendor/flowplayer/';
    this.scripts_loaded = false;
    this.default_video = {
        file : null,
        type : null,
        url : null,
        width : '100%',
        height : 'inherit',
        path : null
    };
    this.current=this.default_video;
    //providers
    this.vimeo={
        image_base_url:'//i.vimeocdn.com/video/'
    };
    this.youtube={
        image_base_url:'//img.youtube.com/vi/'
    };
};


VideoService.prototype.reset = function(){
    this.current=this.default_video;
    return this;
};


/**
* Set our dimensions
* @chainable
**/
VideoService.prototype.dimensions = function(d){
    var self = this;
    if(typeof(d.width) !== 'undefined'){
        self.current.width=d.width;   
    }
    if(typeof(d.height) !== 'undefined'){
        self.current.height=d.height;   
    }
    return self;
}

/**
* Set our video URI
* @chainable
**/
VideoService.prototype.uri = function(url,type,cb){
    var self=this;
    if(typeof(type) === 'undefined'){
        type = 'YouTube';
    }
    /*
     * Sets URI and returns this service
    */
    self.current.url = url;
    self.current.type=type;
    if(cb){
        cb(self);
    } else{
        return self;   
    }

}

/*
* Sets directory variable for video file
*/
VideoService.prototype.directory = function(dir){
    this.directory=dir;
    return this;
}

/*
* Sets Directory Variables and Returns the service
*/
VideoService.prototype.path = function(path){
    this.set_from_path(path);
    return this;   
}

/**** Rendering Methods ****/
/*
* Returns HTML from a provided video file or URL
*/
VideoService.prototype.get_html = function(){
    var self = this;    
    if(!self.current.path && !self.current.url) {
        throw 'No file or uri provided A file path or URL must be set in order for the correct video paths to be provided';
    } else if(!self.current.type) {
        throw 'No type could be found The file type in the properties set for this class could not be determined (see path() & uri() methods)';
    }
    switch(self.current.type){
        case "YouTube":
            return self.get_youtube_embed(self.current.url);
        case "Vimeo":
            return self.get_vimeo_embed(self.current.url);
        case "SWF":
            return self.SWF(self.current.path);
        case "FLV":
            return self.FLV();
        case "MPEG4|WebM|OOG":
            return self.html5_video();
    }
}

VideoService.prototype.get_video_image = function(url,size,html,cb){
    var self = this;
    switch(self.current.type){
        case "Vimeo":
            self.get_vimeo_image(url,size,html,cb);
            break;
        case "YouTube":
            self.get_youtube_image(url,size,html,cb);
            break;
        default:
            cb(null);
    }
}

/** YouTube **/
VideoService.prototype.get_youtube_embed = function(url){
    var self = this;
    video_id = self.get_youtube_id(url);
    if (video_id != NULL){
        return ' \
        <div class="video youtube"> \
        <iframe width="'+((self.width != NULL) ? self.width : '520')+'" height="'+((self.height != NULL) ? self.height : '310')+'" src="//www.youtube.com/embed/'+video_id+'?showinfo=0&color=white" frameborder="0" allowfullscreen></iframe> \
        </div> \
        ';
    } else {
        return '<!-- The Requested URL '+url+' could not be parsed to determine the correct YouTube video id -->';
    }


}

/** Vimeo **/
VideoService.prototype.get_vimeo_embed = function(url){
    var self = this;
    video_id = self.get_vimeo_id(url);
    if(video_id != NULL){
    return '
    <div class="video vimeo"> \
    <iframe src="//player.vimeo.com/video/'+video_id+'" width="'+((self.width != NULL) ? self.width : '520')+'" height="'+((self.height != NULL) ? self.height : '310')+'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> \
    </div> \
    ';
    } else {
        return '<!-- The Requested URL '+url+' could not be parsed to determine the correct Vimeo video id -->';
    }
    
    
}

VideoService.prototype.get_vimeo_image = function(url,size,html,cb){
    var self = this;
    if(!size){
        size=1280;
    }
    if(!html){
        html=true;
    }
    self.current.url = url;
    if(!self.current.provider_id){
        var video_id = self.get_vimeo_id(self.current.url);
    } else{
        var video_id = self.current.provider_id;
    }
    $.get('http://vimeo.com/api/v2/video/'+video_id+'.json',function(data){
        //we're just returning the large thumbnail for now, unless OAuth is set up. // TODO //
        if(data.length){
            var image_url = data[0].thumbnail_large;
            if(html){
                var image='<img src="'+image_url+'" alt="Video Thumbmnail Image" class="video-thumbnail"/>';
            } else {
                var image=image_url;
            }
            if(cb){
                cb(image);
            } else{
                return image;
            }
        } else{
            if(cb){
                cb(null);   
            } else{
                return null;
            }
        }
    },'json');
   
}

VideoService.prototype.get_youtube_image = function(url,size,html,cb){
    var self = this;
    //<insert-youtube-video-id-here>/maxresdefault.jpg
    if(!size){
        size='maxresdefault';
    }
    if(!html){
        html=true;
    }
    self.current.url = url;
    var video_id = self.get_youtube_id(self.current.url);
    if(html){
        var img = '<img src="'+self.youtube.image_base_url+video_id+'/'+size+'.jpg" alt="Video Thumbmnail Image" class="video-thumbnail"/>';
    } else {
        var img = self.vimeo.image_base_url+video_id+'/'+size+'.jpg';
    }  
    if(cb){
        cb(img);
    } else{
        return img;
    }
}

VideoService.prototype.SWF = function(){
    var self = this;
    unique_id = 'video_'+uniqid();
    return '
            <div id="'+unique_id+'" class="swf_video">This video requires Adobe Flash version 9.0.0 or greater.</div> \
            <script type="text/javascript"> \
                    (document).ready(function(){ \
                    ("#'+unique_id+'").flash({ \
                            hasVersion: "9.0.0", \
                            allowfullscreen: "false",  \
                            allowscriptaccess: "sameDomain",  \
                            quality: "high",  \
                            wmode: "transparent", \
                            swf: "'+self.path+'",'+
                            ((self.height != NULL) ?
                            'height: '+self.height+',' : 'height: 330,')
                                    +
                                    ((self.width != NULL) ?
                                    'width: '+self.width+',' : 'width: 520,')
                                            +'
                        }); \
                    }); \
              </script>';


}

VideoService.prototype.FLV = function(){
    var self = this;
    unique_id = 'video_'+uniqid();
    self.flowplayer_path = '/behavior/jquery/flowplayer_flash/';
    if(!self.scripts_loaded){
        echo '
    <script type="text/javascript" src="'+self.flowplayer_path+'flowplayer-3.2.12.min.js'+'"></script>
    ';
        self.scripts_loaded = TRUE;
    }
    return '
            <a  
         href="'+self.path+'"
         style="display:block;'+((self.width != NULL) ? 'width:'+self.width+'px;' : 'width:520px;')+((self.height != NULL) ? 'height: '+self.height+'px;' : 'height:330px')+'" \ 
         id="'+unique_id+'"> \
            </a> \
         <script type="text/javascript"> \
        flowplayer("'+unique_id+'", "'+self.flowplayer_path+'flowplayer-3.2.16.swf",{ \
                clip:  { \
                autoPlay: false \
                } \
                } \
                ); \
        </script>  \
        ';

}

VideoService.prototype.MPEG4 = function(){
    return this.html5_video();
}

VideoService.prototype.OOG = function(){
    return this.html5_video();
}

VideoService.prototype.WebM = function(path){
    return this.html5_video(self.current.path,self.current.type);
}



/**
* Render HTML5 Video from Path
**/
VideoService.prototype.html5_video = function(){
    var self = this;
    if(!self.scripts_loaded){
    document.write('
    <style type="text/css">
    @import url('+self.flowplayer_path+'skin/functional.css'+');
    @import url('+self.flowplayer_path+'skin/custom.css'+');
    </style>
    <script type="text/javascript" src="'+self.flowplayer_path+'flowplayer.min.js'+'"></script>       
    ');
    self.scripts_loaded = TRUE;       
    }   
    return ' \
    <div data-swf="'+self.flowplayer_path+'flowplayer.swf" \
    class="flowplayer no-toggle aside-time no-volume color-light" \
    data-ratio="0.416"> \
    <video> \
    <source type="video/'+self.type.toLowerCase()+'" src="'+self.path+'"/> \
    </video> \
    ';

}

VideoService.prototype.get_provider_id = function(url,type,cb){
    var self = this;
    id = null;
    switch(type){
        case 'YouTube':
            id = self.get_youtube_id(url);
            break;
        case 'Vimeo':
            id = self.get_vimeo_id(url);
            break;
    }
    if(cb){
        cb(id)
    } else{
        return id;
    }
}


VideoService.prototype.get_youtube_id = function(url){
    var self = this;
    parsed = self.parse_url(url);
    //set our initial path assumption
    var aPath = parsed.path.split('/');
    var id = aPath[aPath.length - 1];
    if(typeof(parsed.query) !== 'undefined'){
        var aQ=parsed.query.split('&');
        for(var q in aQ){
            if(aQ[q].indexOf('v=') > -1){
                var v = aQ[q].split('=');
                v = v[v.length-1];
                return v;
            }
        }
    }
    return id;
};

VideoService.prototype.get_vimeo_id = function(url){
    var self = this;
    //parse the url to remove any query strings
    parsed = self.parse_url(url);
    //vimeo currently uses the last item in the path variable
    vid_id = parsed.path.split('/');
    vid_id = vid_id[vid_id.length - 1]; 
    if(typeof(parseInt(vid_id)) === 'number'){
        return vid_id;
    } else {
        return null;
    }  
};


/**
*  Javascript Equivalent of PHP's parse_str() function
*  @hattip http://phpjs.org/functions/parse_str/
**/
VideoService.prototype.parse_str = function(str, array) {
  var strArr = String(str)
    .replace(/^&/, '')
    .replace(/&/, '')
    .split('&'),
    sal = strArr.length,
    i, j, ct, p, lastObj, obj, lastIter, undef, chr, tmp, key, value,
    postLeftBracketPos, keys, keysLen,
    fixStr = function(str) {
      return decodeURIComponent(str.replace(/\+/g, '%20'));
    };

  if (!array) {
    array = this.window;
  }

  for (i = 0; i < sal; i++) {
    tmp = strArr[i].split('=');
    key = fixStr(tmp[0]);
    value = (tmp.length < 2) ? '' : fixStr(tmp[1]);

    while (key.charAt(0) === ' ') {
      key = key.slice(1);
    }
    if (key.indexOf('\x00') > -1) {
      key = key.slice(0, key.indexOf('\x00'));
    }
    if (key && key.charAt(0) !== '[') {
      keys = [];
      postLeftBracketPos = 0;
      for (j = 0; j < key.length; j++) {
        if (key.charAt(j) === '[' && !postLeftBracketPos) {
          postLeftBracketPos = j + 1;
        } else if (key.charAt(j) === ']') {
          if (postLeftBracketPos) {
            if (!keys.length) {
              keys.push(key.slice(0, postLeftBracketPos - 1));
            }
            keys.push(key.substr(postLeftBracketPos, j - postLeftBracketPos));
            postLeftBracketPos = 0;
            if (key.charAt(j + 1) !== '[') {
              break;
            }
          }
        }
      }
      if (!keys.length) {
        keys = [key];
      }
      for (j = 0; j < keys[0].length; j++) {
        chr = keys[0].charAt(j);
        if (chr === ' ' || chr === '+' || chr === '[') {
          keys[0] = keys[0].substr(0, j) + '_' + keys[0].substr(j + 1);
        }
        if (chr === '[') {
          break;
        }
      }

      obj = array;
      for (j = 0, keysLen = keys.length; j < keysLen; j++) {
        key = keys[j].replace(/^['"]/, '')
          .replace(/['"]/, '');
        lastIter = j !== keys.length - 1;
        lastObj = obj;
        if ((key !== '' && key !== ' ') || j === 0) {
          if (obj[key] === undef) {
            obj[key] = {};
          }
          obj = obj[key];
        } else { // To insert new dimension
          ct = -1;
          for (p in obj) {
            if (obj.hasOwnProperty(p)) {
              if (+p > ct && p.match(/^\d+/g)) {
                ct = +p;
              }
            }
          }
          key = ct + 1;
        }
      }
      lastObj[key] = value;
    }
  }
};

/**
*  Javascript Equivalent of PHP's parse_url() function
*  @hattip http://phpjs.org/functions/parse_url/
**/
VideoService.prototype.parse_url = function(str, component) {

  var query, key = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port',
      'relative', 'path', 'directory', 'file', 'query', 'fragment'
    ],
    ini = (this.php_js && this.php_js.ini) || {},
    mode = (ini['phpjs.parse_url.mode'] &&
      ini['phpjs.parse_url.mode'].local_value) || 'php',
    parser = {
      php: /^(?:([^:\/?#]+):)?(?:\/\/()(?:(?:()(?:([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?()(?:(()(?:(?:[^?#\/]*\/)*)()(?:[^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
      loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/\/?)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // Added one optional slash to post-scheme to catch file:/// (should restrict this)
    };

  var m = parser[mode].exec(str),
    uri = {},
    i = 14;
  while (i--) {
    if (m[i]) {
      uri[key[i]] = m[i];
    }
  }

  if (component) {
    return uri[component.replace('PHP_URL_', '')
      .toLowerCase()];
  }
  if (mode !== 'php') {
    var name = (ini['phpjs.parse_url.queryKey'] &&
      ini['phpjs.parse_url.queryKey'].local_value) || 'queryKey';
    parser = /(?:^|&)([^&=]*)=?([^&]*)/g;
    uri[name] = {};
    query = uri[key[12]] || '';
    query.replace(parser, function(i, ii, iii) {
      if (i) {
        uri[name][i] = ii;
      }
    });
  }
  delete uri.source;
  return uri;
}

/**
* Sets the Path Variables and MIME type when provided a url or path
**/
VideoService.prototype.set_from_path = function(path,cb){
    var self = this;
    self.current=self.default_video;
    exp_path = path.split('/');
    if((path.indexOf('http'||'https') === 0) || (path.indexOf('//') === 0)){
        self.current.url = path;
        if(path.indexOf('youtube') > -1){
            self.current.type = 'YouTube';
        } else if(path.indexOf('vimeo') > -1) {
            self.current.type = 'Vimeo';
        }
    } else {
        self.current.file = exp_path[exp_path.length - 1];
        exp_path.pop();
        self.current.directory = exp_path.join('/')+'/';
        self.current.path = self.current.director+self.current.file;
        var type = self.current.file.split('+');
        type = type[type.length - 1];
        self.current.type = type.toUpperCase();
    }
    if(cb){
        cb(self);
    }
}