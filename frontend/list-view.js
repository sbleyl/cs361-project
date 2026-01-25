// DOM elements
const params = new URLSearchParams(window.location.search);
const listName = params.get("list") || "Trip Name";

const tripTitle = document.getElementById("trip-title");
const backBtn = document.getElementById("back-btn");
const addItemsBtn = document.getElementById("add-items-btn");

const modal = document.getElementById("exit-modal");
const closeModal = document.getElementById("close-modal");
const modalNo = document.getElementById("modal-no");
const modalYes = document.getElementById("modal-yes");

const unpackedBtn = document.getElementById("unpacked-btn");
const packedBtn = document.getElementById("packed-btn");
const itemContainer = document.getElementById("item-list-container");

tripTitle.textContent = listName;   // Set page title to trip name

let showPacked = false; // Track if showng pack or unpacked items

// Modal Logic
backBtn.addEventListener("click", () => modal.classList.remove("hidden"));
closeModal.addEventListener("click", () => modal.classList.add("hidden"));
modalNo.addEventListener("click", () => modal.classList.add("hidden"));
modalYes.addEventListener("click", () => window.location.href = "lists.html");
modal.addEventListener("click", e => { if(e.target === modal) modal.classList.add("hidden"); });

// Navigate to Add Items page
addItemsBtn.addEventListener("click", () => {
    window.location.href = `add-items.html?list=${encodeURIComponent(listName)}`;
});

// Toggle unpacked/packed view
unpackedBtn.addEventListener("click", () => { showPacked = false; updateToggleStyles(); renderItems(); });
packedBtn.addEventListener("click", () => { showPacked = true; updateToggleStyles(); renderItems(); });

function updateToggleStyles() {
    unpackedBtn.classList.toggle("selected", !showPacked);  // Highlight selected toggle
    packedBtn.classList.toggle("selected", showPacked);
}

// Load Lists from local storage
let allLists = JSON.parse(localStorage.getItem("packingLists") || "[]");
let currentList = allLists.find(l => l.name === listName);

// Default items if list is missing or empty
const defaultItems = [
    { name: "Hat", type: "Clothing", packed: false },
    { name: "T-Shirt", type: "Clothing", packed: false },
    { name: "Jeans", type: "Clothing", packed: false },
    { name: "Sandals", type: "Clothing", packed: false },
    { name: "Socks", type: "Clothing", packed: false },
    { name: "Laptop", type: "Electronics", packed: false },
    { name: "Phone", type: "Electronics", packed: false },
    { name: "Headphones", type: "Electronics", packed: false },
    { name: "Charger", type: "Electronics", packed: false },
    { name: "Power Bank", type: "Electronics", packed: false },
    { name: "Passport", type: "Documents", packed: false },
    { name: "Tickets", type: "Documents", packed: false },
    { name: "Toothbrush", type: "Toiletries", packed: false },
    { name: "Soap", type: "Toiletries", packed: false },
    { name: "Medication", type: "Medical", packed: false }
];

// Initialize if list missing or empty
if (!currentList) {
    currentList = { name: listName, items: defaultItems };  // Create new list
    allLists.push(currentList);
    localStorage.setItem("packingLists", JSON.stringify(allLists));
} else if (!currentList.items || currentList.items.length === 0) {
    currentList.items = defaultItems;   // Fill empty list with defaults. May change later
    localStorage.setItem("packingLists", JSON.stringify(allLists));
}

// Render items in list
function renderItems() {
    itemContainer.innerHTML = "";   // Clear current list

    const itemsToShow = currentList.items.filter(i => i.packed === showPacked);
    const types = [...new Set(itemsToShow.map(i => i.type))];

    types.forEach(type => {
        const categoryDiv = document.createElement("div");
        categoryDiv.className = "category";
        categoryDiv.textContent = type;
        itemContainer.appendChild(categoryDiv);

        itemsToShow.filter(i => i.type === type).forEach(item => {
            const itemDiv = document.createElement("div");
            itemDiv.className = "item";
            itemDiv.textContent = item.name;
            if (!showPacked && item.packed) itemDiv.classList.add("checked");   // Show packed if needed
            itemContainer.appendChild(itemDiv);
        });
    });
}

// Toggle unpacked/packed
itemContainer.addEventListener("click", e => {
    if (!e.target.classList.contains("item")) return;
    const itemName = e.target.textContent;
    const itemObj = currentList.items.find(i => i.name === itemName);   // Find clicked item
    itemObj.packed = !itemObj.packed;
    localStorage.setItem("packingLists", JSON.stringify(allLists)); // Save changes
    renderItems();
});

// Initial render
updateToggleStyles();
renderItems();
