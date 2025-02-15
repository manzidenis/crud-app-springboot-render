const apiUrl = "http://localhost:8080/items"; // Adjust API URL if needed

document.addEventListener("DOMContentLoaded", () => {
  fetchItems();
  document.getElementById("itemForm").addEventListener("submit", saveItem);
});


document.addEventListener("DOMContentLoaded", () => {
    const itemForm = document.getElementById("itemForm");
    const itemsTableBody = document.getElementById("itemsTableBody");
    const popup = document.getElementById("popup");
    const popupMessage = document.getElementById("popup-message");
    let itemIdCounter = 1;
    let items = [];

    itemForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const id = document.getElementById("itemId").value;
        const name = document.getElementById("itemName").value.trim();
        const price = parseFloat(document.getElementById("itemPrice").value).toFixed(2);
        const quantity = parseInt(document.getElementById("itemQuantity").value);

        if (!name || isNaN(price) || isNaN(quantity)) {
            showPopup("Please fill out all fields correctly!", "red");
            return;
        }

        if (id) {
            // Edit existing item
            const item = items.find(item => item.id === parseInt(id));
            item.name = name;
            item.price = `$${price}`;
            item.quantity = quantity;
        } else {
            // Add new item
            const newItem = {
                id: itemIdCounter++,
                name: name,
                price: `$${price}`,
                quantity: quantity
            };
            items.push(newItem);
        }

        updateTable();
        resetForm();
        showPopup("Item saved successfully!", "green");
    });

    function updateTable() {
        itemsTableBody.innerHTML = "";
        items.forEach((item) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.name}</td>
                <td>${item.price}</td>
                <td>${item.quantity}</td>
                <td class="actions">
                    <button class="edit" onclick="editItem(${item.id})">Edit</button>
                    <button class="delete" onclick="deleteItem(${item.id})">Delete</button>
                </td>
            `;
            itemsTableBody.appendChild(row);
        });
    }

    window.editItem = (id) => {
        const item = items.find(item => item.id === id);
        document.getElementById("itemId").value = item.id;
        document.getElementById("itemName").value = item.name;
        document.getElementById("itemPrice").value = parseFloat(item.price.replace("$", ""));
        document.getElementById("itemQuantity").value = item.quantity;
    };

    window.deleteItem = (id) => {
        items = items.filter(item => item.id !== id);
        updateTable();
        showPopup("Item deleted successfully!", "red");
    };

    function resetForm() {
        itemForm.reset();
        document.getElementById("itemId").value = "";
    }

    function showPopup(message, color) {
        popupMessage.innerText = message;
        popup.style.backgroundColor = color;
        popup.style.display = "block";
        setTimeout(() => popup.style.display = "none", 2000);
    }
});



// Fetch Items from API
async function fetchItems() {
  try {
    const response = await fetch(apiUrl);
    const items = await response.json();
    const tableBody = document.getElementById("itemsTableBody");
    tableBody.innerHTML = "";

    items.forEach((item) => {
      const row = `
        <tr>
          <td>${item.id}</td>
          <td>${item.name}</td>
          <td>${item.price}</td>
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
  }
}

// Save or Update Item
async function saveItem(event) {
  event.preventDefault();
  const itemId = document.getElementById("itemId").value;
  const name = document.getElementById("itemName").value;
  const price = document.getElementById("itemPrice").value;
  const quantity = document.getElementById("itemQuantity").value;

  const itemData = { name, price, quantity };

  try {
    let response;
    if (itemId) {
      response = await fetch(`${apiUrl}/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });
    } else {
      response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      });
    }

    if (response.ok) {
      fetchItems();
      document.getElementById("itemForm").reset();
      document.getElementById("itemId").value = "";
    }
  } catch (error) {
    console.error("Error saving item:", error);
  }
}

// Edit Item (Prefill form)
function editItem(id, name, price, quantity) {
  document.getElementById("itemId").value = id;
  document.getElementById("itemName").value = name;
  document.getElementById("itemPrice").value = price;
  document.getElementById("itemQuantity").value = quantity;
}

// Delete Item
async function deleteItem(id) {
  if (confirm("Are you sure you want to delete this item?")) {
    try {
      const response = await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
      if (response.ok) {
        fetchItems();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }
}
