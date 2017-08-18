function log(obj) {
  var str = JSON.stringify( obj );
  chrome.devtools.inspectedWindow.eval('console.log(' + str + ');');
}

function getCode() {
// function generateCode(eventName, contentType, contentIdsElement, valueElement, currencyElement, mode, buttonElement = 0) {
// var eventName = document.getElementById();
// generateCode();
  show('code-snippet');
  // alert('a');
  // log(JSON.stringify({a:5}));
}

function show(id) {
  var element = document.getElementById(id);
  console.log("show..");
  if (element.style.display === 'none') {
    element.style.display = 'block';
  }
  else{
    //do nothing
  }
}

function initOnClick() {
  document.getElementById('get-code').addEventListener('click', getCode, false);
}
document.addEventListener('DOMContentLoaded', initOnClick);
