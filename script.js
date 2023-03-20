const inputText = document.getElementById('input-text');
const hashButton = document.getElementById('hash-button');

const hashTableBody = document.querySelector('#hash-table tbody');

const copyAllButton = document.getElementById('copy-all-button');
const copyHashesButton = document.getElementById('copy-hashes-button');

hashButton.addEventListener('click', hashInputText);
inputText.addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
        hashInputText();
    }
});

copyAllButton.addEventListener('click', () => {
    copyAll();
});
copyHashesButton.addEventListener('click', () => {
    copyHashes();
});

//Hash input text and add it to table
function hashInputText() {
    const input = inputText.value;
    if (input === '') {
        return;
    }

    const strength = Math.round(zxcvbn(input).guesses_log10 * 100) / 100;
    const cracktime = zxcvbn(input).crack_times_display.offline_slow_hashing_1e4_per_second;
    sha1(input).then(hashValue => {
        inputText.value = '';

        var newRow = hashTableBody.insertRow();
        newRow.innerHTML = `<tr> <td>${input}</td> <td>${hashValue}</td> <td>${strength}</td> <td>${cracktime}</td> </tr>`;

        //Sort table by strength (descending)
        [...hashTableBody.rows].sort((a, b) => parseFloat(b.cells[2].innerHTML) - parseFloat(a.cells[2].innerHTML))
            .forEach((row) => hashTableBody.insertBefore(row, null));
    });
}

//Get SHA-1 hash value
async function sha1(str) {
    const buffer = new TextEncoder('utf-8').encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hexString = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
    return hexString;
}

//Copy hashes to clipboard
function copyHashes() {
    const hashValues = Array.from(hashTableBody.querySelectorAll('tr td:nth-child(2)')).map(td => td.textContent);
    const hashText = hashValues.join('\n');
    navigator.clipboard.writeText(hashText)
}

//Copy full table to clipboard
function copyAll() {
    const tableText = hashTableBody.innerText;
    navigator.clipboard.writeText(tableText);
}