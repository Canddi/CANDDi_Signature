/**
 * Script to run in background. Adds the page action when in gmail
 *
 * @license    MIT
 * @copyright  2015 Campaign and Digital Intelligence
 * @author     Mark Hemmings
 **/

chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {hostEquals: 'mail.google.com'},
          })
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});
