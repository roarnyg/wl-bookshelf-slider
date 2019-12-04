(function () {
    function _appendBookToAuthor (element,data) {
        var bookSlideHtml = '';
        if(data && data.length>0){
            bookSlideHtml +="<h2>" + AuthorBookSliderSettings['slidertitle'] + "</h2>";

            bookSlideHtml +='<div class="flexslider carousel bookslider" itemscope="itemscope" itemtype="https://schema.org/Blog">';
            bookSlideHtml +='<ul class="slides">';
            for(var i=0;i<data.length;i++){
                bookSlideHtml +='<li class="book-slide-entry real-thumbnail" itemscope="itemscope" itemtype="https://schema.org/BlogPosting" itemprop="blogPost">';
                bookSlideHtml +='<a href="'+data[i].url+'" data-rel="slide-1" class="bookslider-image" title="" target="_blank"><img src="'+data[i].thumbnail+'" class="attachment-no scaling wp-post-image" alt="'+data[i].title+'" title="'+data[i].title+'"><span class="image-overlay overlay-type-extern" ><span class="image-overlay-inside"></span></span></a>';
                bookSlideHtml +='</li>';
            }
            for(var i=0;i<data.length;i++){
                bookSlideHtml +='<li class="book-slide-entry real-thumbnail" itemscope="itemscope" itemtype="https://schema.org/BlogPosting" itemprop="blogPost">';
                bookSlideHtml +='<a href="'+data[i].url+'" data-rel="slide-1" class="bookslider-image" title="" target="_blank"><img src="'+data[i].thumbnail+'" class="attachment-no scaling wp-post-image" alt="'+data[i].title+'" title="'+data[i].title+'"><span class="image-overlay overlay-type-extern" ><span class="image-overlay-inside"></span></span></a>';
                bookSlideHtml +='</li>';
            }
            for(var i=0;i<data.length;i++){
                bookSlideHtml +='<li class="book-slide-entry real-thumbnail" itemscope="itemscope" itemtype="https://schema.org/BlogPosting" itemprop="blogPost">';
                bookSlideHtml +='<a href="'+data[i].url+'" data-rel="slide-1" class="bookslider-image" title="" target="_blank"><img src="'+data[i].thumbnail+'" class="attachment-no scaling wp-post-image" alt="'+data[i].title+'" title="'+data[i].title+'"><span class="image-overlay overlay-type-extern" ><span class="image-overlay-inside"></span></span></a>';
                bookSlideHtml +='</li>';
            }
            bookSlideHtml +='</ul>';
            bookSlideHtml +='</div>';
        }
        element.html(bookSlideHtml);
        jQuery(element).find(".flexslider").flexslider({
                animation:'slide',
                animationLoop:true,
                minItems:4, 
                maxItems:4, 
                itemWidth:220, 
                itemMargin:5, 
                prevText: AuthorBookSliderSettings['previous'],
                nextText: AuthorBookSliderSettings['next'],               //String: Set the text for the "next" directionNav item
                pauseText: AuthorBookSliderSettings['pause'],             //String: Set the text for the "pause" pausePlay item
                playText:  AuthorBookSliderSettings['play']     
                });
    };

    // lastname firstname
    function _fetchBookFromAuthor (element,authorName, itemPerPage) {
        if(authorName === undefined || !authorName){
            return false;
        }
        if(itemPerPage === undefined){
            itemPerPage = 50;
        }

        jQueryfq = "contentClasses:bokhylla";
        var nb_book_url = "https://api.nb.no/catalog/v1/items?fq=" + jQueryfq + "&size=" + encodeURIComponent(itemPerPage)  + "&q=namecreators:%22" + encodeURIComponent(authorName) + "%22&digitalAccessibleOnly=true";
        // console.log(nb_book_url);
        jQuery.ajax({ type: "GET",
                dataType: "json",
                url: nb_book_url,
                success: function(response){
                var data = [];
                var teller = 0;
                jQuery(response._embedded.items).each(function(){
                        var obj = {};

                        var thumbnailNode = this._links.thumbnail_large;
                        if (thumbnailNode === undefined || thumbnailNode.length > 0) {
                        return true;
                        }

                        var urlNode = this.id;

                        var titleNode = this.metadata.title;

                        if(thumbnailNode.href !== undefined && thumbnailNode.href.length > 0){
                        var thumbnailUrl = thumbnailNode.href;
                        if(thumbnailUrl === undefined){
                        return true;
                        }
                        obj.thumbnail = thumbnailUrl;
                        }else{
                        return true;
                        }
                        if(urlNode !== undefined && urlNode.length > 0){
                            var url = urlNode;
                            if(url !== undefined){
                                obj.url = "https://urn.nb.no/" + this.metadata.identifiers.urn;
                                // her bør URN brukes (TODO)
                                // http://urn.nb.no/URN:NBN:no-nb_digibok_2017092648118

                                //https://www.nb.no/items/URN:NBN:no-nb_digibok_2013032005105
                            }
                        }
                        else{
                            return true;
                        }
                        if(titleNode !== undefined && titleNode.length > 0){
                            obj.title = this.metadata.title;
                        }
                        data.push(obj);
                });
                _appendBookToAuthor(element,data);

                }
        });
    };

    jQuery(document).ready(function () {

            jQuery('.wl-bookshelf-slider').each(function () {
                    var authorName  = jQuery(this).data('author');
                    _fetchBookFromAuthor(jQuery(this), authorName);
                    });
            });

})();
