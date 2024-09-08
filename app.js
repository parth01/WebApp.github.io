// DOM Elements
const profileInput = document.getElementById('nameInput');
const saveButton = document.getElementById('saveButton');
const deleteButton = document.getElementById('deleteButton');
const profileDropdown = document.getElementById('nameDropdown');
const toast = document.getElementById('toast');
const calculateButton = document.getElementById('calculateButton');
const totalLabel = document.getElementById('totalLabel');
const addItemButton = document.getElementById('addItemButton');
const stockTableBody = document.querySelector('#stockTable tbody');
const printButton = document.getElementById('printButton');
const medicineButton = document.getElementById('medicine');
const pageTitle = document.getElementById('pageTitle');
const vaccinationButton = document.getElementById('vaccination');
const disinfectButton = document.getElementById('disinfect');
const batchNumberInput = document.getElementById('batchNumberInput');
const datePicker = document.getElementById('datePicker');
// Load profiles from localStorage
let profiles = JSON.parse(localStorage.getItem('profiles') || '[]');
// Dummy profiles to add if no profiles exist
const dummyProfiles = ['Default Profile', 'Guest Profile', 'Sample Profile'];
// Sample items to add to the table
const medicineItems = [
    { name: 'Tylocin', quantity: 0, rate: 3436 },
    { name: 'Neodox', quantity: 0, rate: 573 },
    { name: 'vimeral', quantity: 0, rate: 988 },
    { name: 'Groviplex', quantity: 0, rate: 570 },
    { name: 'E-Sol', quantity: 0, rate: 511 },
    { name: 'Nutrigrow', quantity: 0, rate: 802 },
    { name: 'Amnovel', quantity: 0, rate: 725 },
    { name: 'Amprolium', quantity: 0, rate: 1250 },
    { name: 'Meriflox', quantity: 0, rate: 1080 },
    { name: 'Fit-5', quantity: 0, rate: 700 },
    { name: 'Tetracycline', quantity: 0, rate: 58 },
    { name: 'Success', quantity: 0, rate: 52 },
    { name: 'Brotane', quantity: 0, rate: 1340 },
    { name: 'Bayrocin', quantity: 0, rate: 3444 },
    { name: 'U.T.Mint', quantity: 0, rate: 1200 },
    { name: 'Chicktonite', quantity: 0, rate: 675 },
    { name: 'VEGUT', quantity: 0, rate: 830 },
    { name: 'Hapeto Care', quantity: 0, rate: 1068 },
    { name: 'Milliunum', quantity: 0, rate: 360 },
    { name: 'ESB3', quantity: 0, rate: 382 },
    { name: 'Protexin', quantity: 0, rate: 182 },
    { name: 'Trapin', quantity: 0, rate: 130 },
    { name: 'Futres-c', quantity: 0, rate: 210 },
    { name: 'Gpromine', quantity: 0, rate: 1250 },
    { name: 'Caritrol', quantity: 0, rate: 2071 },
    { name: 'Harbalc', quantity: 0, rate: 805 },
    { name: 'Liuoliv', quantity: 0, rate: 304 },
    { name: 'Liuotox', quantity: 0, rate: 802 },
];
// New dummy data set to replace when the new button is clicked
const vaccineItems = [
    { name: 'F1 - 500', quantity: 0, rate: 26 },
    { name: 'F1 - 1000', quantity: 0, rate: 52 },
    { name: 'F1 - 2000', quantity: 0, rate: 104 },
    { name: 'B₂K - 500', quantity: 0, rate: 147 },
    { name: 'B₂K - 1000', quantity: 0, rate: 294 },
    { name: 'B₂K - 2000', quantity: 0, rate: 588 },
    { name: 'Lasota - 500', quantity: 0, rate: 26 },
    { name: 'Lasota - 1000', quantity: 0, rate: 52 },
    { name: 'Lasota - 2000', quantity: 0, rate: 104 },
];
// New dummy data set to replace when the new button is clicked
const disinfectItems = [
    { name: 'Korsholine', quantity: 0, rate: 5706 },
    { name: 'Sokrena', quantity: 0, rate: 3616 },
    { name: 'H-plus', quantity: 0, rate: 932 },
    { name: 'Valkun', quantity: 0, rate: 1100 },
];
// State Variables
let isOriginalState = true; // To track the current state
// State Variables
let isOriginalState2 = true; // To track the current state
// Function to initialize dummy profiles
function initializeDummyProfiles() {
    // Only add dummy profiles if no profiles exist
    if (profiles.length === 0) {
        profiles = [...dummyProfiles];
        localStorage.setItem('profiles', JSON.stringify(profiles));
    }
}
// Function to update dropdown with profiles
function updateDropdown() {
    profileDropdown.innerHTML = `<option value="" disabled selected>Select a Name</option>`;
    profiles.forEach((profile) => {
        const option = document.createElement('option');
        option.value = profile;
        option.textContent = profile;
        profileDropdown.appendChild(option);
    });
}
// Function to show toast notifications
function showToast(message) {
    toast.textContent = message;
    toast.className = 'toast show';
    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
    }, 3000);
}
// Save a new profile
function saveProfile() {
    const profileName = profileInput.value.trim();
    const batchNumber = batchNumberInput.value.trim();
    const date = datePicker.value;
    if (profileName && !profiles.includes(profileName)) {
        profiles.push(profileName);
        localStorage.setItem('profiles', JSON.stringify(profiles));
        updateDropdown();
        profileInput.value = '';
        showToast(`Profile "${profileName}" saved successfully!`);
    }
    else if (profiles.includes(profileName)) {
        showToast('Profile already exists!');
    }
    else {
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
    }
    else {
        showToast('Please select a profile to delete.');
    }
}
// Add an item to the table
function addItem(name, quantity = 1, rate = 0) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${name}</td>
        <td><input type="number" value="${rate}" class="rate"></td>
        <td><input type="number" value="${quantity}" class="quantity"></td>
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
    }
    else {
        showToast('Invalid item name or rate.');
    }
}
// Function to clear the existing table
function clearTable() {
    stockTableBody.innerHTML = '';
}
// Calculate amounts and display total
function calculateAmounts() {
    const rows = document.querySelectorAll('#stockTable tbody tr');
    let total = 0;
    rows.forEach((row) => {
        const quantityInput = row.querySelector('.quantity');
        const rateInput = row.querySelector('.rate');
        const amountCell = row.querySelector('.amount');
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
    // Optional: Trigger layout recalculation if needed
    totalLabel.offsetHeight; // Accessing this property can trigger a reflow
}
// Initialize original items
function initializeItems(items) {
    clearTable();
    items.forEach(item => addItem(item.name, item.quantity, item.rate));
}
// Toggle between original and new title/items
function changeToMedicine() {
    pageTitle.textContent = 'Details of Medicine';
    initializeItems(medicineItems);
    showToast('Title changed to "Details of Medicine" and items restored!');
}
// Toggle between original and new title/items
function changeToVaccine() {
    pageTitle.textContent = 'Details of Vaccination';
    initializeItems(vaccineItems);
    showToast('Title changed to "Details of Vaccination" and items restored!');
}
// Toggle between original and new title/items
function changeToDisinfect() {
    pageTitle.textContent = 'Details of Disinfect';
    totalLabel.textContent = ``;
    initializeItems(disinfectItems);
    showToast('Title changed to "Details of Disinfect" and items restored!');
}
// Print the entire page
function printPage() {
    // Ensure the layout updates before printing
    setTimeout(() => {
        window.print();
    }, 100); // Delay print to ensure content is updated
}
// Event listeners
saveButton.addEventListener('click', saveProfile);
deleteButton.addEventListener('click', deleteProfile);
calculateButton.addEventListener('click', calculateAmounts);
addItemButton.addEventListener('click', promptAddItem);
printButton.addEventListener('click', printPage);
medicineButton.addEventListener('click', changeToMedicine); // Event for new button
vaccinationButton.addEventListener('click', changeToVaccine); // Event for new button
disinfectButton.addEventListener('click', changeToDisinfect); // Event for new button
// Initial setup
initializeDummyProfiles(); // Initialize dummy profiles if none exist
updateDropdown(); // Update the dropdown to reflect the profiles
initializeItems(medicineItems); // Initialize dummy stock items in the table
