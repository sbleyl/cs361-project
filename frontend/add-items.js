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

// Back button with exit modal
backBtn.addEventListener("click", () => modal.classList.remove("hidden"));
closeModal.addEventListener("click", () => modal.classList.add("hidden"));
modalNo.addEventListener("click", () => modal.classList.add("hidden"));
modalYes.addEventListener("click", () => window.location.href = `list-view.html?list=${encodeURIComponent(listName)}`);
modal.addEventListener("click", e => { if (e.target === modal) modal.classList.add("hidden"); });

// Submit item
submitBtn.addEventListener("click", () => {
    const name = itemNameInput.value.trim();
    const type = itemTypeSelect.value;

    // If list name is empty
    if (!name) { alert("Please enter an item name."); return; }
    if (!type) { alert("Please select an item type."); return; }

    // Load existing lists
    const allLists = JSON.parse(localStorage.getItem("packingLists") || "[]");

    // Find or create current list
    let currentList = allLists.find(l => l.name === listName);
    if (!currentList) {
        currentList = { name: listName, items: [] };
        allLists.push(currentList);
    }
    currentList.items = currentList.items || [];

    // Prepare new item
    const newItem = { name, type: capitalize(type), packed: false };

    // Insert after last item of same type
    const sameTypeIndices = currentList.items.map((i, idx) => i.type === newItem.type ? idx : -1).filter(i => i !== -1);
    if (sameTypeIndices.length === 0) {
        currentList.items.push(newItem);
    } else {
        const lastIndex = sameTypeIndices[sameTypeIndices.length - 1];
        currentList.items.splice(lastIndex + 1, 0, newItem);
    }

    // Save and redirect
    localStorage.setItem("packingLists", JSON.stringify(allLists));
    window.location.href = `list-view.html?list=${encodeURIComponent(listName)}`;
});