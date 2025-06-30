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

  // Apply saved theme on page load
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }

  // Toggle theme button
  themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const newTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
  });

  // Add new transaction
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
    date.value =
