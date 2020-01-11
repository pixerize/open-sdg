var urlParams = new URLSearchParams(window.location.search);
var searchTerms = urlParams.get('q');
document.getElementById('search-bar-on-page').value = searchTerms;
document.getElementById('search-term').innerHTML = searchTerms;
if (searchTerms) {
  var searchIndex = lunr(function () {
    this.ref('url');
    this.field('title', { boost: 10 });
    this.field('content');
    this.field('hidden');

    for (var ref in opensdg.searchItems) {
      this.add(opensdg.searchItems[ref]);
    };
  });

  var searchTermsToUse = searchTerms;
  // This is to allow for searching by indicator with dashes.
  if (searchTerms.split('-').length == 3 && searchTerms.length < 15) {
    // Just a best-guess check to see if the user intended to search for an
    // indicator ID.
    searchTermsToUse = searchTerms.replace(/-/g, '.');
  }
  // Perform the search.
  var results = searchIndex.search(searchTermsToUse);
  var resultItems = [];
  results.forEach(function(result) {
    var doc = opensdg.searchItems[result.ref]
    // Truncate the contents.
    if (doc.content.length > 400) {
      doc.content = doc.content.substring(0, 400) + '...';
    }
    resultItems.push(doc);
  });

  // Print the results using a template.
  var template = _.template(
    $("script.results-template").html()
  );

  $('div.results').html(template({
    searchResults: resultItems,
    resultsCount: resultItems.length
  }));
}