// Creates Scopes Element in UI 
function createScopeElement(scopes, data, callback) {
    // Create a new div element to contain the scopes
    const newElement = document.createElement('div');
    newElement.classList.add('Info-infoBadge3luOwOnjfNiR');
    newElement.setAttribute('role', '');

    // Create the heading for scopes
    const heading = document.createElement('div');
    heading.classList.add('APISectionHeader-heading4MUMLbp4_nLs');
    heading.textContent = 'SCOPES';
    heading.title = 'The scope signifies the level of access granted to the API endpoint. It is recommended to always choose the scope with the least access to minimize security risks.';
    newElement.appendChild(heading);

    // Create a container for badges
    const badgesContainer = document.createElement('div');
    badgesContainer.classList.add('badges-container');
    badgesContainer.style.paddingLeft = '3px';

    // Create and append badge elements for each scope
    for (const scope of Object.values(scopes)) {
        const badge = document.createElement('span');
        badge.classList.add('Badge', 'Badge_light', 'Badge_circular');
        badge.style.marginLeft = '3px';
        // name of the scope found in the OAS spec
        badge.textContent = scope;
        // displays the description of the scope if found in the OAS spec
        badge.title = data.components.securitySchemes.oauth2.flows.clientCredentials.scopes[scope];
        badgesContainer.appendChild(badge);
    }

    newElement.appendChild(badgesContainer);

    // Call the callback function with the created element
    callback(newElement);
}

// Gets the Scopes from the OAS spec
async function printScopes(oasUrl, operationIdToFind) {
    try {
        const response = await fetch(oasUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch OpenAPI spec');
        }
        const data = await response.json();
        const paths = data.paths;
        for (const [path, pathValue] of Object.entries(paths)) {
            for (const [method, methodValue] of Object.entries(pathValue)) {
                if (methodValue.operationId && methodValue.operationId.toLowerCase() === operationIdToFind.toLowerCase()) {
                    if (methodValue.security && methodValue.security.length > 0) {
                        for (const security of methodValue.security) {
                            for (const [securityKey, scopes] of Object.entries(security)) {
                                if (securityKey === 'oauth2' && scopes.length > 0) {
                                    //console.log("OAuth2 Scopes:");
                                    //console.log(scopes);
																		await new Promise(r => setTimeout(r, 200));
                                    // Create the new element using the function
                                    createScopeElement(scopes, data, function(newElement) {
                                        // Replace the existing element with the new one
                                        const elementToReplace = document.querySelector('.Info-infoBadge3luOwOnjfNiR');
                                        if (elementToReplace) {
                                            elementToReplace.parentNode.replaceChild(newElement, elementToReplace);
                                        }
                                    });
                                    return; // Stop looping once found
                                }
                            }
                        }
                    } else {
                        //console.log("No security defined for this operation.");
                    }
                    return; // Stop looping once found
                }
            }
        }
       // console.log("Operation ID not found in the OpenAPI spec.");
    } catch (error) {
        console.error('Error fetching or processing OpenAPI spec:', error);
    }
}

// Function to extract data-raycast-oas value from HTML
function extractOasValue() {
    const headerElement = document.querySelector('[data-raycast-oas]');
    if (headerElement) {
        const oasValue = headerElement.getAttribute('data-raycast-oas');
        // update with your hostname
        const oasUrl = `https://developer.onetrust.com/onetrust/openapi/${oasValue}`;
        const fullPath = window.location.pathname;
        const operationId = fullPath.substring(fullPath.lastIndexOf('/') + 1);
        //console.log("operationId:", operationId);
        printScopes(oasUrl,operationId);
    } else {
       // console.error('No element found with data-raycast-oas attribute.');
    }
}

// Function to periodically check the page path and invoke extractOasValue
function checkPageAndInvoke() {
    if (window.location.pathname.includes('/reference/')) {
        extractOasValue();
    } else {
        //console.log('This page does not contain /reference/ in the path. Script will not run.');
    }
}

// Invoke the function when the page is loaded
function redoElement() {
  const newElement = document.createElement('div');
  newElement.classList.add('Info-infoBadge3luOwOnjfNiR');
  newElement.setAttribute('role', '');
  newElement.innerHTML = '<div>OAuth2</div>'; // Set inner HTML

  const elementToReplace = document.querySelector('.Info-infoBadge3luOwOnjfNiR');
  if (elementToReplace) {
    elementToReplace.parentNode.replaceChild(newElement, elementToReplace);
  }
}

// Free feel to update the element, this forces a load when the user click in the sidebar
const contentElement = document.getElementById('reference-sidebar');
contentElement.addEventListener('click', function() {
    redoElement(); // reset the oauth element to wipe from last calls
    checkPageAndInvoke(); // Then run the checkPageAndInvoke function
});
// Invoke JS function on page load
window.addEventListener('load', function() {
    redoElement(); // reset the oauth element to wipe from last calls
    checkPageAndInvoke(); // Then run the checkPageAndInvoke function
});
