document.querySelector(".button-get-all").addEventListener("click", async () => {
  const res = await fetch("/contacts");
  const data = await res.json();
  displayContacts(data.data);
});


function displayContacts(contacts) {
  const container = document.getElementById("contacts-list");
  container.innerHTML = "";
  contacts.forEach((contact) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p><strong>${contact.name}</strong> (${contact.phoneNumber})</p>
      <button onclick="deleteContact('${contact._id}')">Delete</button>
    `;
    container.appendChild(div);
  });
}
