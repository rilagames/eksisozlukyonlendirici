document.addEventListener('DOMContentLoaded', function() {
  // Get the necessary DOM elements
  var lastDomain = document.getElementById('last-domain');
  var newDomain = document.getElementById('new-domain');
  var saveButton = document.getElementById('save-domain');
  var oldDomainsList = document.getElementById('old-domains');
  var resetButton = document.getElementById('reset-button');

  // Load the last domain and old domains from storage
  chrome.storage.local.get(['lastDomain', 'oldDomains'], function(data) {
    lastDomain.textContent = data.lastDomain || 'No domain saved';
    updateOldDomainsList(oldDomainsList, data.oldDomains);
  });

  // Save the new domain and update the UI
  saveButton.addEventListener('click', function() {
    var domain = newDomain.value;
    if (domain) {
      chrome.storage.local.get('oldDomains', function(data) {
        var oldDomains = data.oldDomains || [];
        oldDomains.push(lastDomain.textContent);
        chrome.storage.local.set({
          lastDomain: domain,
          oldDomains: oldDomains
        }, function() {
          lastDomain.textContent = domain;
          newDomain.value = '';
          updateOldDomainsList(oldDomainsList, oldDomains);
        });
      });
    }
  });

  // Reset the old domains list and update the UI
  resetButton.addEventListener('click', function() {
    chrome.storage.local.set({ oldDomains: [] }, function() {
      updateOldDomainsList(oldDomainsList, []);
    });
  });

  // Update the UI with the list of old domains
  function updateOldDomainsList(list, domains) {
    list.innerHTML = '';
    domains.forEach(function(domain, index) {
      var li = document.createElement('li');
      li.textContent = domain;
      var removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', function() {
        domains.splice(index, 1);
        chrome.storage.local.set({ oldDomains: domains }, function() {
          updateOldDomainsList(list, domains);
        });
      });
      li.appendChild(removeButton);
      list.appendChild(li);
    });
  }
});
