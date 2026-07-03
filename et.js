// DOM Elements
const form = document.getElementById("transactionForm");
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const dateInput = document.getElementById("date");
const transactionList = document.getElementById("transactionList");

const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");

// Load transactions from localStorage
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Track editing
let editId = null;

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Render Transactions
function renderTransactions() {
    transactionList.innerHTML = "";

    transactions.forEach(transaction => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${transaction.title}</td>
            <td>₹${transaction.amount}</td>
            <td>${transaction.type}</td>
            <td>${transaction.date}</td>
            <td>
                <button class="edit-btn" onclick="editTransaction(${transaction.id})">
                    Edit
                </button>
                <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">
                    Delete
                </button>
            </td>
        `;

        transactionList.appendChild(row);
    });

    updateSummary();
}

// Update Summary Cards
function updateSummary() {
    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {
        if (transaction.type === "income") {
            income += transaction.amount;
        } else {
            expense += transaction.amount;
        }
    });

    const balance = income - expense;

    balanceEl.textContent = `₹${balance}`;
    incomeEl.textContent = `₹${income}`;
    expenseEl.textContent = `₹${expense}`;
}

// Add / Update Transaction
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const date = dateInput.value;

    if (!title || !amount || !type || !date) {
        alert("Please fill all fields");
        return;
    }

    if (editId !== null) {
        transactions = transactions.map(transaction =>
            transaction.id === editId
                ? { ...transaction, title, amount, type, date }
                : transaction
        );

        editId = null;
    } else {
        const newTransaction = {
            id: Date.now(),
            title,
            amount,
            type,
            date
        };

        transactions.push(newTransaction);
    }

    saveToLocalStorage();
    renderTransactions();
    form.reset();
});

// Edit Transaction
function editTransaction(id) {
    const transaction = transactions.find(item => item.id === id);

    titleInput.value = transaction.title;
    amountInput.value = transaction.amount;
    typeInput.value = transaction.type;
    dateInput.value = transaction.date;

    editId = id;
}

// Delete Transaction
function deleteTransaction(id) {
    const confirmDelete = confirm("Delete this transaction?");

    if (!confirmDelete) return;

    transactions = transactions.filter(transaction => transaction.id !== id);

    saveToLocalStorage();
    renderTransactions();
}

// Initial render
renderTransactions();