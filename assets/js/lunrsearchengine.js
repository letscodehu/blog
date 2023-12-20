---
    layout: null
sitemap: false
---
// Service Worker registration
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
            console.error('Service Worker registration failed:', error);
        });
    // Handle messages from the Service Worker
    navigator.serviceWorker.addEventListener('message', event => {
        const data = event.data;
        console.log(event)
        if (data.action === 'searchResults') {
            // Update the UI with search results
            updateResults(data.term, data.results);
        }
    });
}
function lunr_search(query) {
    if (query) {
        navigator.serviceWorker.controller.postMessage({
            action: 'search',
            query: query,
        });
    }
    // Communicate with the Service Worker to perform search
    return false;
}

function updateResults(term, results) {
    $('#lunrsearchresults').show(400);
    $("body").addClass("modal-open");

    document.getElementById('lunrsearchresults').innerHTML = '<div id="resultsmodal" class="modal fade show d-block"  tabindex="-1" role="dialog" aria-labelledby="resultsmodal"> <div class="modal-dialog shadow-lg" role="document"> <div class="modal-content"> <div class="modal-header" id="modtit"> <button type="button" class="close" id="btnx" data-dismiss="modal" aria-label="Close"> &times; </button> </div> <div class="modal-body"> <ul class="mb-0"> </ul>    </div> <div class="modal-footer"><button id="btnx" type="button" class="btn btn-danger btn-sm" data-dismiss="modal">Close</button></div></div> </div></div>';
    document.getElementById('modtit').innerHTML = "<h5 class='modal-title'>Search results for '" + term + "'</h5>" + document.getElementById('modtit').innerHTML;
    //put results on the screen.
    if (results.length > 0) {
        for (var i = 0; i < results.length; i++) {
            // more statements
            var url = results[i]['url'];
            var title = results[i]['title'];
            var body = results[i]['body'];
            document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML + "<li class='lunrsearchresult'><a href='" + url + "'><span class='title'>" + title + "</span><br /><small><span class='body'>" + body + "</span><br /><span class='url'>" + url + "</span></small></a></li>";
        }
    } else {
        document.querySelectorAll('#lunrsearchresults ul')[0].innerHTML = "<li class='lunrsearchresult'>Sorry, no results found. Close & try a different search!</li>";
    }
    return false;
}
$('.bd-search').on('submit', function(e) {
    e.preventDefault()
    lunr_search($('#lunrsearch')[0].value)
    return false
})

$(function() {
    $("#lunrsearchresults").on('click', '#btnx', function() {
        $('#lunrsearchresults').hide(5);
        $("body").removeClass("modal-open");
    });
});

