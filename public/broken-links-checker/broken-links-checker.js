const urlTable = document.querySelector('table#url-table > tbody');
const spinnerContainer = document.getElementById('spinnerContainer');

document.getElementsByClassName('broken-links-submit')[0].addEventListener('click', async function (event) {
    event.preventDefault();
    reset();
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
            if(result.link.search("mailto") !== -1 || result.link.search("tel:") !== -1) {
                return;
            }
            if(result.link.search('files.clarkcountynv.gov') !== -1 || result.link.search('webfiles.clarkcountynv.gov') !== -1) {
                result.status = "BROKEN";
            }
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

function reset() {
    urlTable.innerHTML = '';
}

function sortTable(columnIndex) {
    const table = document.getElementById('url-table');
    const tbody = table.getElementsByTagName('tbody')[0];
    const rows = Array.from(tbody.getElementsByTagName('tr'));
    
    // Get current sort direction and toggle it
    const currentDir = tbody.getAttribute('data-sort-dir') || 'asc';
    const newDir = currentDir === 'asc' ? 'desc' : 'asc';
    tbody.setAttribute('data-sort-dir', newDir);

    // Sort the rows
    rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent;
        const bValue = b.cells[columnIndex].textContent;
        
        // For other columns, sort alphabetically
        return newDir === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
    });

    // Reorder the rows in the table
    rows.forEach(row => tbody.appendChild(row));
}

// Add click handlers to table headers
document.addEventListener('DOMContentLoaded', function() {
    const headers = document.querySelectorAll('#url-table th');
    headers.forEach((header, index) => {
        header.addEventListener('click', () => sortTable(index));
        header.style.cursor = 'pointer';
    });
});
