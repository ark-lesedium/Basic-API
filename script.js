document.getElementById("loadButton").addEventListener("click", fetchUsers);

async function fetchUsers() {
  const errorDiv = document.getElementById("error");
  const table = document.getElementById("userTable");
  const tbody = table.querySelector("tbody");
  errorDiv.textContent = "";
  tbody.innerHTML = "";

  try {
    const response = await fetch("http://localhost:4000/users");

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }

    const users = await response.json();

    if (!Array.isArray(users)) {
      throw new Error("Unexpected API response format");
    }

    if (users.length === 0) {
      errorDiv.textContent = "No users found.";
      table.style.display = "none";
      return;
    }

    users.forEach(user => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${user.name}</td><td>${user.email}</td>`;
      tbody.appendChild(row);
    });

    table.style.display = "table";

  } catch (err) {
    console.error("Fetch error:", err);
    errorDiv.textContent = `Failed to load users: ${err.message}`;
    table.style.display = "none";
  }
}

