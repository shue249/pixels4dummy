function getCode() {
	log('1');
 //  var eventName = $('#event-selection').value;
 //  var contentType = 'product';
 //  var contentIdsElement = {id: 'product_id'};
 //  var valueElement = {id: 'price'};
 //  var currencyElement = {id: 'USD'};
 //  var mode = 'pageload';
  
 //  generatedCode = generateCode(eventName, contentType, contentIdsElement, valueElement, currencyElement, mode);
 //  log(generatedCode);
 //  $('#codeSnippet').innerHTML = generatedCode;
}

function init() {
  function log(obj) {
    var str = JSON.stringify( obj );
    chrome.devtools.inspectedWindow.eval('console.log(' + str + ');');
  }
  $('#getcode').on('click') = getCode;

  log("hi");
  log({a:4});
}
document.addEventListener('DOMContentLoaded', init);

