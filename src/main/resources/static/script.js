const apiUrl = "https://crud-app-springboot-render.onrender.com/items"; // API URL

document.addEventListener("DOMContentLoaded", () => {
  fetchItems();
  document.getElementById("itemForm").addEventListener("submit", saveItem);
});

// Fetch and display items from API
async function fetchItems() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Failed to fetch items");
    
    const items = await response.json();
    const tableBody = document.getElementById("itemsTableBody");
    tableBody.innerHTML = "";

    items.forEach((item) => {
      const row = `
        <tr>
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>$${parseFloat(item.price).toFixed(2)}</td>
          <td>${item.quantity}</td>
          <td class="actions">
            <button class="edit" onclick="editItem(${item.id}, '${item.name}', ${item.price}, ${item.quantity})">Edit</button>
            <button class="delete" onclick="deleteItem(${item.id})">Delete</button>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    console.error("Error fetching items:", error);
    showPopup("Error fetching items!", "red");
  }
}

// Save or Update Item
async function saveItem(event) {
  event.preventDefault();
  
  const itemId = document.getElementById("itemId").value;
  const name = document.getElementById("itemName").value.trim();
  const price = parseFloat(document.getElementById("itemPrice").value);
  const quantity = parseInt(document.getElementById("itemQuantity").value);

  if (!name || isNaN(price) || isNaN(quantity)) {
    showPopup("Please fill out all fields correctly!", "red");
    return;
  }

  const itemData = { name, price, quantity };

  try {
    let response;
    if (itemId) {
      // Update existing item
      response = await fetch(`${apiUrl}/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });
    } else {
      // Create new item
      response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });
    }

    if (response.ok) {
      fetchItems(); // Refresh table after save
      resetForm();
      showPopup(itemId ? "Item updated successfully!" : "Item added successfully!", "green");
    } else {
      throw new Error("Failed to save item");
    }
  } catch (error) {
    console.error("Error saving item:", error);
    showPopup("Error saving item!", "red");
  }
}

// Prefill form for editing
function editItem(id, name, price, quantity) {
  document.getElementById("itemId").value = id;
  document.getElementById("itemName").value = name;
  document.getElementById("itemPrice").value = parseFloat(price).toFixed(2);
  document.getElementById("itemQuantity").value = quantity;
}

// Delete an item from API
async function deleteItem(id) {
  if (!confirm("Are you sure you want to delete this item?")) return;

  try {
    const response = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
    if (response.ok) {
      fetchItems(); // Refresh table after delete
      showPopup("Item deleted successfully!", "red");
    } else {
      throw new Error("Failed to delete item");
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    showPopup("Error deleting item!", "red");
  }
}

// Reset form after save/edit
function resetForm() {
  document.getElementById("itemForm").reset();
  document.getElementById("itemId").value = "";
}

// Show popup message
function showPopup(message, color) {
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");

  popupMessage.innerText = message;
  popup.style.backgroundColor = color;
  popup.style.display = "block";

  setTimeout(() => (popup.style.display = "none"), 2000);
}
