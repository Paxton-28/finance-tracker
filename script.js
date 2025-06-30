document.addEventListener('DOMContentLoaded', () => {
  const balance = document.getElementById('balance');
  const income = document.getElementById('income');
  const expense = document.getElementById('expense');
  const list = document.getElementById('list');
  const form = document.getElementById('form');
  const text = document.getElementById('text');
  const amount = document.getElementById('amount');
  const date = document.getElementById('date');
  const history = document.getElementById('history');
  const themeBtn = document.getElementById('toggle-theme');

  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

  // ✅ Apply saved theme on page load
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }

  // ✅ Toggle theme button
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const newTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
  });

  // ✅ Add new transaction
  function addTransaction(e) {
    e.preventDefault();

    const transaction = {
      id: Date.now(),
      text: text.value,
      amount: +amount.value,
      date: date.value,
    };

    transactions.push(transaction);
    updateLocalStorage();
    init();

    text.value = '';
    amount.value = '';
    date.value = '';
  }

  // ✅ Add transaction to DOM
  function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
      ${transaction.text} (${transaction.date})
      <span>${sign}₹${Math.abs(transaction.amount)}</span>
      <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
  }

  // ✅ Update total income, expenses, and balance
  function updateValues() {
    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
    const totalIncome = amounts.filter(val => val > 0).reduce((acc, val) => acc + val, 0).toFixed(2);
    const totalExpense = (
      amounts.filter(val => val < 0).reduce((acc, val) => acc + val, 0) * -1
    ).toFixed(2);

    balance.innerText = `₹${total}`;
    income.innerText = `₹${totalIncome}`;
    expense.innerText = `₹${totalExpense}`;
  }

  // ✅ Remove transaction
  function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    init();
  }

  // ✅ Save to localStorage
  function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }

  // ✅ Group transactions by month
  function generateMonthlyHistory() {
    history.innerHTML = '';
    const grouped = {};

    transactions.forEach(t => {
      const [year, month] = t.date.split('-');
      const key = `${year}-${month}`;

      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(t);
    });

    for (const key in grouped) {
      const monthData = grouped[key];
      const income = monthData.filter(t => t.amount > 0).reduce((a, b) => a + b.amount, 0);
      const expense = monthData.filter(t => t.amount < 0).reduce((a, b) => a + b.amount, 0);
      const balance = income + expense;

      const block = document.createElement('div');
      block.classList.add('history-block');
      block.innerHTML = `
        <h4>${formatMonth(key)}</h4>
        <p><strong>Income:</strong> ₹${income}</p>
        <p><strong>Expenses:</strong> ₹${Math.abs(expense)}</p>
        <p><strong>Balance:</strong> ₹${balance}</p>
      `;
      history.appendChild(block);
    } // ✅ This closing brace was missing
  }

  // ✅ Format "YYYY-MM" to "Month Year"
  function formatMonth(key) {
    const [year, month] = key.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }

  // ✅ Initialize app
  function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
    generateMonthlyHistory();
  }

  form.addEventListener('submit', addTransaction);

  init();
});
