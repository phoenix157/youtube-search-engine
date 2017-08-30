//Searchbar Handler
$(function(){
    var searchField = $('#query');
    var icon = $('#searchButton');

    //Focus event Handler
    $(searchField).on('focus',function(){
        $(this).animate({
            width: '100%'
        },400);
        $(icon).animate({
            right: '10px'
        },400);
    });

    //Blur event Handler
    $(searchField).on('blur',function(){
        if(searchField.val() == ''){
            $(searchField).animate({
                width: '45%'
            },400, function(){});
            $(icon).animate({
                right: '360px'
            },400, function(){});
        }
    });

    $('#search_form').submit(function(e){
        e.preventDefault();
    });
});

function search(){
    //Clear results
    $('#results').html('');
    $('#buttons').html('');

    //Get form input
    var q = $('#query').val();

    //Run Get request on API
    $.get(
        "https://www.googleapis.com/youtube/v3/search",{
            part: 'snippet, id',
            q: q,
            type: 'video',
            key: 'AIzaSyCbAFKbb-6kDgIYDHba0OOhLYo8cdteNhA'},
            function(data){
                var nextPageToken = data.nextPageToken;
                var prevPageToken = data.prevPageToken;

                console.log(data);

                $.each(data.items, function(i, item){
                    //Get output
                    var output = getOutput(item);

                    //Display results
                    $('#results').append(output);
                });

                var buttons = getButtons(prevPageToken,nextPageToken,q);

                //Display buttons
                $('#buttons').append(buttons);
            }
    )
}

//Next page
function nextPage(){
    //Next page token
    var token = $('#next-button').data('token');
    var q = $('#next-button').data('query');

    //Clear results
    $('#results').html('');
    $('#buttons').html('');

    //Run Get request on API
    $.get(
        "https://www.googleapis.com/youtube/v3/search",{
            part: 'snippet, id',
            q: q,
            pageToken: token,
            type: 'video',
            key: 'AIzaSyCbAFKbb-6kDgIYDHba0OOhLYo8cdteNhA'},
            function(data){
                var nextPageToken = data.nextPageToken;
                var prevPageToken = data.prevPageToken;

                console.log(data);

                $.each(data.items, function(i, item){
                    //Get output
                    var output = getOutput(item);

                    //Display results
                    $('#results').append(output);
                });

                var buttons = getButtons(prevPageToken,nextPageToken,q);

                //Display buttons
                $('#buttons').append(buttons);
            }
    );
}

//Prev page
function prevPage(){
    //Prev page token
    var token = $('#prev-button').data('token');
    var q = $('#prev-button').data('query');

    //Clear results
    $('#results').html('');
    $('#buttons').html('');

    //Run Get request on API
    $.get(
        "https://www.googleapis.com/youtube/v3/search",{
            part: 'snippet, id',
            q: q,
            pageToken: token,
            type: 'video',
            key: 'AIzaSyCbAFKbb-6kDgIYDHba0OOhLYo8cdteNhA'},
            function(data){
                var nextPageToken = data.nextPageToken;
                var prevPageToken = data.prevPageToken;

                console.log(data);

                $.each(data.items, function(i, item){
                    //Get output
                    var output = getOutput(item);

                    //Display results
                    $('#results').append(output);
                });

                var buttons = getButtons(prevPageToken,nextPageToken,q);

                //Display buttons
                $('#buttons').append(buttons);
            }
    );
}

//Build output
function getOutput(item){
    var videoId = item.id.videoId;
    var title = item.snippet.title;
    var description = item.snippet.description;
    var thumb = item.snippet.thumbnails.high.url;
    var channelTitle = item.snippet.channelTitle;
    var videoDate = item.snippet.publishedAt;

    //Build output string
    var output =
    '<li>'+
        '<div class="list-left">'+
            '<img src="'+thumb+'">'+
        '</div>'+
        '<div class="list-right">'+
            '<h3><a class="fancybox fancybox.iframe" href="http://www.youtube.com/embed/'+videoId+'">'+title+'</a></h3>'+
            '<small>By <span class="cTitle">'+channelTitle+'</span> on '+videoDate+'</small>'+
            '<p>'+description+'</p>'+
        '</div>'+
    '</li>'+
    '<div class="clearfix"></div>'+
    '';

    return output;
}

//Build buttons
function getButtons(prevPageToken,nextPageToken,q){
    if(!prevPageToken){
        var btnoutput =
        '<div class="button-container">'+
            '<button id="next-button" class="paging-button" data-token="'+nextPageToken+'" data-query="'+q+'" '+
            'onclick="return nextPage()">Next Page</button>'+
        '</div>';
    }else {
        var btnoutput =
        '<div class="button-container">'+
            '<button id="prev-button" class="paging-button" data-token="'+prevPageToken+'" data-query="'+q+'" '+
            'onclick="return prevPage()">Previous Page</button>'+
            '<button id="next-button" class="paging-button" data-token="'+nextPageToken+'" data-query="'+q+'" '+
            'onclick="return nextPage()">Next Page</button>'+
        '</div>';
    }

    return btnoutput;
}
