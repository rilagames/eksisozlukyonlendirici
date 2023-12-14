
chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    // Extract the domain from the URL

    const url = new URL(details.url);
    const domain = url.hostname;

    // Get the last domain and old domains from storage
    chrome.storage.local.get(['lastDomain', 'oldDomains'], function(data) {
      
      const lastDomain = data.lastDomain;
      const oldDomains = data.oldDomains || [];

      //alert(JSON.stringify({url,domain,domains:oldDomains}))

      // Check if the current domain is in the list of old domains
      if (oldDomains.includes(domain.toString())) {
        
      
        // Replace the domain with the last domain
        const newUrl = details.url.replace(domain, lastDomain);
        //alert(newUrl)
        // Redirect the request to the new URL
        chrome.tabs.update(details.tabId, { url: newUrl }, function() {
          // Display an alert after the redirection
          chrome.tabs.get(details.tabId, function(tab) {
            alert("You will be redirected to latest Eksi Sozluk domain you have choosen in extension!");
          });
        });

        // Cancel the original request
        return { cancel: true };

        }
    });
  },
  {
    urls: ["<all_urls>"],
    types: ["main_frame"]
  },
  ["blocking"]
);
