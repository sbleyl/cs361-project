// DOM elements
const listContainer = document.getElementById("list-container");
const sortBtn = document.getElementById("sort-btn");
const createBtn = document.getElementById("create-list-btn");
const sortModal = document.getElementById("sort-modal");
const closeSortModal = document.getElementById("close-sort-modal");
const settingsBtn = document.getElementById("settings-btn");
const settingsModal = document.getElementById("settings-modal");
const closeSettingsModal = document.getElementById("close-settings-modal");

// Default lists and items to seed
const defaultLists = ["Vacation","Business","Road Trip","Camping","Cruise","Conference","Tailgate","Italy","France","Disneyland","Switzerland","Japan"];
const defaultItems = [
    { item_name: "Hat", type: "Clothing" },
    { item_name: "T-Shirt", type: "Clothing" },
    { item_name: "Jeans", type: "Clothing" },
    { item_name: "Sandals", type: "Clothing" },
    { item_name: "Socks", type: "Clothing" },
    { item_name: "Laptop", type: "Electronics" },
    { item_name: "Phone", type: "Electronics" },
    { item_name: "Headphones", type: "Electronics" },
    { item_name: "Charger", type: "Electronics" },
    { item_name: "Power Bank", type: "Electronics" },
    { item_name: "Passport", type: "Documents" },
    { item_name: "Tickets", type: "Documents" },
    { item_name: "Toothbrush", type: "Toiletries" },
    { item_name: "Soap", type: "Toiletries" },
    { item_name: "Medication", type: "Medical" }
];

let allLists = [];

// Render lists
function renderLists() {
    listContainer.innerHTML = "";   // Clear
    allLists.forEach(list => {
        const div = document.createElement("div");
        div.className = "packing-list";
        div.dataset.name = list;

        // List name span
        const nameSpan = document.createElement("span");
        nameSpan.textContent = list;
        div.appendChild(nameSpan);

        // Trash icon button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-list";
        deleteBtn.textContent = "🗑︎";
        div.appendChild(deleteBtn);

        listContainer.appendChild(div);
    });
}

// Get lists from microservice
async function getLists() {
    const res = await fetch('/lists-data');
    return await res.json();
}

// Create list using microservice
async function createList(list_name) {
    const res = await fetch('/lists-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ list_name })
    });
    return await res.json();
}

// Seed default items into list via microservice
async function seedDefaultItems(listId) {
    for (const item of defaultItems) {
        await fetch(`/lists-data/${listId}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ item_name: item.item_name, type: item.type })
        });
    }
}

// Delete list using microservice
async function deleteList(list_name) {
    const lists = await getLists();
    const list = lists.lists.find(l => l.list_name === list_name);
    if (!list) return;
    await fetch(`/lists-data/${list.id}`, { method: 'DELETE' });
}

// Load lists from microservice
async function loadLists() {
    const savedLists = await getLists();  // Microservice call
    allLists = savedLists.lists.map(l => l.list_name);

    // Add any default lists not already in microservice
    defaultLists.forEach(name => {
        if (!allLists.includes(name)) allLists.push(name);
    });

    renderLists();
}

loadLists();  // Initial load

// Click a list to view
listContainer.addEventListener("click", async (e) => {
    const div = e.target.closest(".packing-list");
    if (!div) return;

    const listName = div.dataset.name;

    // Delete list if trash clicked
    if (e.target.classList.contains("delete-list")) {
        if (!confirm(`Delete "${listName}"?`)) return;

        await deleteList(listName); // Microservice call to delete
        loadLists(); // Reload lists
        return;
    }

    // Check if list exists in microservice before navigating
    const lists = await getLists();
    const existing = lists.lists.find(l => l.list_name === listName);

    if (!existing) {
        // Create list in microservice with default items
        const newList = await createList(listName);
        await seedDefaultItems(newList.id);
    }

    // Navigate to list view if name clicked
    window.location.href = `list-view.html?list=${encodeURIComponent(listName)}`;
});

// Redirect to create list page
createBtn.addEventListener("click", () => {
    window.location.href = "create-list.html";
});

// Sort modal logic
sortBtn.addEventListener("click", () => sortModal.classList.remove("hidden"));
closeSortModal.addEventListener("click", () => sortModal.classList.add("hidden"));
sortModal.addEventListener("click", (e) => {
    if (e.target === sortModal) return sortModal.classList.add("hidden");
    const sortType = e.target.dataset.sort; // Get sort type
    if (!sortType) return;

    allLists.sort((a, b) => sortType === "az" ? a.localeCompare(b) : b.localeCompare(a)); // Sort
    renderLists(); // Update view
    sortModal.classList.add("hidden");  // Close Modal
});

// Settings modal logic
settingsBtn.addEventListener("click", () => settingsModal.classList.remove("hidden"));
closeSettingsModal.addEventListener("click", () => settingsModal.classList.add("hidden"));
settingsModal.addEventListener("click", (e) => { if (e.target === settingsModal) settingsModal.classList.add("hidden"); });