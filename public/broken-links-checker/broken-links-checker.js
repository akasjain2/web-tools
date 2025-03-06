const urlTable = document.querySelector('table#url-table > tbody');
const spinnerContainer = document.getElementById('spinnerContainer');

document.getElementsByClassName('broken-links-submit')[0].addEventListener('click', async function (event) {
    event.preventDefault();
    const linkToTest = document.getElementById("linkInput").value;
    showSpinner();
    try {
        const response = await fetch("/check-links",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({url: linkToTest})
            });
        const data = await response.json();
        data.results.forEach(result => {
            addUrlToTable(result.link, result.status);
        });
    } catch (err) {
        console.error("Failed to fetch links. Please try again.");
    }
    hideSpinner();
    console.log('Broken links fetcher completed.');
});


function addUrlToTable(url, status) {
    const row = urlTable.insertRow();

    const urlCell = row.insertCell(0);
    urlCell.textContent = url;

    const parentCell = row.insertCell(1);
    parentCell.textContent = status;
}

function showSpinner() {
    spinnerContainer.style.display = 'block';
}

function hideSpinner() {
    spinnerContainer.style.display = 'none';
}