(function($){
     $(function(){
           if($('#sidebar > p').length == 0){
               $('#main article').css('marginTop', 0);
           }

           var cname = function(name) {
               return name.replace(/[ \/<>]/g, '-');
           };

           var list;
           if ( $("#toc").length ) {
               list = $("<ul />");
               $("#toc").append(list);
           }


           // Anchor all headers
           $(":header:not(h1)").each(
               function(i) {
                   var current = $(this);
                   var text = current.text();
                   var id = cname(text);
                   current.attr("id", id);
                   current.append(' <a class=\"toc-anchor\" href=\"#' + encodeURIComponent(id) + '\">#</a>');
                   if(current.is("h2") && list){
                       list.append("<li><a href=\"#" + encodeURIComponent(id) + "\">" + text + "</a></li>");
                   }
               });

           $('.iframe-video').each(
               function() {
                   var self = $(this);
                   self.after($("<iframe>").attr('src', self.attr('id')).attr("width", "400").attr("height", "225"));
               });
       });
 })(jQuery);
