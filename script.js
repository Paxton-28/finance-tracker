// Get references to HTML elements
const balance = document.getElementById('balance');
const income = document.getElementById('income');
const expense = document.getElementById('expense');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

// Load transactions from localStorage or set as empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Function to add a transaction
function addTransaction(e) {
  e.preventDefault(); // Prevent form from submitting

  const transaction = {
    id: Date.now(), // Unique ID based on timestamp
    text: text.value,
    amount: +amount.value // Convert to number
  };

  transactions.push(transaction); // Add to array
  addTransactionDOM(transaction); // Add to UI
  updateValues(); // Recalculate totals
  updateLocalStorage(); // Save to local storage

  // Clear input fields
  text.value = '';
  amount.value = '';
}

// Function to add transaction to DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';

  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text} 
    <span>${sign}₹${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

// Function to update totals (balance, income, expense)
function updateValues() {
  const amounts = transactions.map(t => t.amount);

  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const incomeTotal = amounts
    .filter(a => a > 0)
    .reduce((acc, item) => acc + item, 0)
    .toFixed(2);

  const expenseTotal = (
    amounts
      .filter(a => a < 0)
      .reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  balance.innerText = `₹${total}`;
  income.innerText = `₹${incomeTotal}`;
  expense.innerText = `₹${expenseTotal}`;
}

// Function to remove a transaction
function removeTransaction(id) {
  transactions = transactions.filter(t => t.id !== id); // Filter out deleted item
  updateLocalStorage();
  init(); // Re-initialize to refresh UI
}

// Save to localStorage
function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Initialize app: clear UI and re-render
function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// Event listener for form submit
form.addEventListener('submit', addTransaction);

// Run on page load
init();
