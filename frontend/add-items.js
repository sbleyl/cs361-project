// DOM elements
const backBtn = document.getElementById("back-btn");
const submitBtn = document.getElementById("submit-item-btn");
const modal = document.getElementById("exit-modal");
const closeModal = document.getElementById("close-modal");
const modalNo = document.getElementById("modal-no");
const modalYes = document.getElementById("modal-yes");

const suggested = document.getElementById("suggested-items");
const itemNameInput = document.getElementById("item-name");
const itemTypeSelect = document.getElementById("item-type");

// Get list name from query
const params = new URLSearchParams(window.location.search);
const listName = params.get("list") || "Default List";

// Capitalize helper for item type
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

// Suggested items autofill
suggested.addEventListener("change", () => {
    const value = suggested.value;
    if (!value) return;
    const [name, type] = value.split("|");
    itemNameInput.value = name;
    itemTypeSelect.value = type;
});

// Auto-suggest category when item name is typed
itemNameInput.addEventListener("input", async () => {
    const name = itemNameInput.value.trim();
    if (!name) return;

    const res = await fetch('/categorization-data/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service: 'packing', text: name })
    });
    const data = await res.json();

    if (data.category && data.category !== 'Uncategorized') {
        itemTypeSelect.value = data.category.toLowerCase();
    }
});

// Back button with exit modal
backBtn.addEventListener("click", () => modal.classList.remove("hidden"));
closeModal.addEventListener("click", () => modal.classList.add("hidden"));
modalNo.addEventListener("click", () => modal.classList.add("hidden"));
modalYes.addEventListener("click", () => window.location.href = `list-view.html?list=${encodeURIComponent(listName)}`);
modal.addEventListener("click", e => { if (e.target === modal) modal.classList.add("hidden"); });

// Submit item to microservice
submitBtn.addEventListener("click", async () => {
    const name = itemNameInput.value.trim();
    const type = itemTypeSelect.value;

    // If list name is empty
    if (!name) { alert("Please enter an item name."); return; }
    if (!type) { alert("Please select an item type."); return; }

    // Get list from microservice
    const res = await fetch('/lists-data');
    const allLists = await res.json();
    const currentList = allLists.lists.find(l => l.list_name === listName);

    if (!currentList) { alert("List not found."); return; }

    // Post new item to microservice
    await fetch(`/lists-data/${currentList.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_name: name, type: capitalize(type) })
    });

    // Redirect back to list
    window.location.href = `list-view.html?list=${encodeURIComponent(listName)}`;
});