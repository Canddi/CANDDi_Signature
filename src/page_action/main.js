/* Document ready */
document.addEventListener("DOMContentLoaded", function(event) {
  /* On signature change, commit the value to localstorage */
  var sig = document.getElementById('signature');
  sig.addEventListener('input', function() {
    chrome.storage.local.set({signature: sig.value});
  }, false);

  /* Get the current values from localstorage and set up view */
  chrome.storage.local.get(['signature'], function(val) {
    var sigVal = val.signature;
    sig.value = sigVal !== undefined ? sigVal : '';
    bodyChange();
  });
});
