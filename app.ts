// DOM Elements
const profileInput = document.getElementById('profileInput') as HTMLInputElement;
const saveButton = document.getElementById('saveButton') as HTMLButtonElement;
const deleteButton = document.getElementById('deleteButton') as HTMLButtonElement;
const profileDropdown = document.getElementById('profileDropdown') as HTMLSelectElement;
const toast = document.getElementById('toast') as HTMLDivElement;
const calculateButton = document.getElementById('calculateButton') as HTMLButtonElement;
const totalLabel = document.getElementById('totalLabel') as HTMLDivElement;
const addItemButton = document.getElementById('addItemButton') as HTMLButtonElement;
const stockTableBody = document.querySelector('#stockTable tbody') as HTMLTableSectionElement;

// Load profiles from localStorage
let profiles: string[] = JSON.parse(localStorage.getItem('profiles') || '[]');

// Sample items to add to the table
const items = [
    { name: 'Item 1', quantity: 2, rate: 50 },
    { name: 'Item 2', quantity: 3, rate: 30 },
    { name: 'Item 3', quantity: 5, rate: 20 }
];

// Function to update dropdown with profiles
function updateDropdown() {
    profileDropdown.innerHTML = `<option value="" disabled selected>Select a profile</option>`;
    profiles.forEach((profile) => {
        const option = document.createElement('option');
        option.value = profile;
        option.textContent = profile;
        profileDropdown.appendChild(option);
    });
}

// Function to show toast notifications
function showToast(message: string) {
    toast.textContent = message;
    toast.className = 'toast show';
    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
    }, 3000);
}

// Save a new profile
function saveProfile() {
    const profileName = profileInput.value.trim();
    if (profileName && !profiles.includes(profileName)) {
        profiles.push(profileName);
        localStorage.setItem('profiles', JSON.stringify(profiles));
        updateDropdown();
        profileInput.value = '';
        showToast(`Profile "${profileName}" saved successfully!`);
    } else if (profiles.includes(profileName)) {
        showToast('Profile already exists!');
    } else {
        showToast('Please enter a valid profile name.');
    }
}

// Delete a selected profile
function deleteProfile() {
    const selectedProfile = profileDropdown.value;
    if (selectedProfile) {
        const confirmation = confirm(`Are you sure you want to delete the profile "${selectedProfile}"?`);
        if (confirmation) {
            profiles = profiles.filter((profile) => profile !== selectedProfile);
            localStorage.setItem('profiles', JSON.stringify(profiles));
            updateDropdown();
            showToast(`Profile "${selectedProfile}" deleted successfully!`);
        }
    } else {
        showToast('Please select a profile to delete.');
    }
}

// Add an item to the table
function addItem(name: string, quantity: number = 1, rate: number = 0) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${name}</td>
        <td><input type="number" value="${quantity}" class="quantity"></td>
        <td><input type="number" value="${rate}" class="rate"></td>
        <td class="amount"></td>
    `;
    stockTableBody.appendChild(row);
}

// Prompt the user to add a new item
function promptAddItem() {
    const itemName = prompt('Enter item name:');
    const itemRate = parseFloat(prompt('Enter item rate:') || '0');

    if (itemName && !isNaN(itemRate)) {
        addItem(itemName, 1, itemRate);
        showToast(`Item "${itemName}" added successfully!`);
    } else {
        showToast('Invalid item name or rate.');
    }
}

// Calculate amounts and display total
function calculateAmounts() {
    const rows = document.querySelectorAll<HTMLTableRowElement>('#stockTable tbody tr');
    let total = 0;

    rows.forEach((row) => {
        const quantityInput = row.querySelector<HTMLInputElement>('.quantity');
        const rateInput = row.querySelector<HTMLInputElement>('.rate');
        const amountCell = row.querySelector<HTMLTableCellElement>('.amount');

        if (quantityInput && rateInput && amountCell) {
            const quantity = parseFloat(quantityInput.value) || 0;
            const rate = parseFloat(rateInput.value) || 0;
            const amount = quantity * rate;
            amountCell.textContent = amount.toFixed(2);
            total += amount;
        }
    });

    totalLabel.textContent = `Total: ${total.toFixed(2)}`;
    totalLabel.style.display = 'block';
}

// Initialize dummy items
function initializeDummyItems() {
    items.forEach(item => addItem(item.name, item.quantity, item.rate));
}

// Event listeners
saveButton.addEventListener('click', saveProfile);
deleteButton.addEventListener('click', deleteProfile);
calculateButton.addEventListener('click', calculateAmounts);
addItemButton.addEventListener('click', promptAddItem);

// Initial setup
updateDropdown();
initializeDummyItems();
