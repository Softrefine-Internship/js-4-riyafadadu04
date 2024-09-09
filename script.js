let expenses = [];

const updateTable = (filteredExpenses = expenses) => {
  const expenseTable = document.querySelector('#expenseList');
  expenseTable.innerHTML = '';

  filteredExpenses.forEach((expense, index) => {
    const newRow = document.createElement('tr');
    newRow.classList.add('body-row');
    newRow.innerHTML = `
      <td>${index +1}</td>
      <td>${expense.name}</td>
      <td>&#x20b9; ${expense.amount}</td>
      <td>${expense.date}</td>
      <td>${expense.category}</td>
      <td class="action-del"><button class="delete-btn" data-index="${index}"><i class="fa-solid fa-trash"></i> <span class="delete-text"> Delete</span></button></td>
    `;
    expenseTable.appendChild(newRow);
  });

  const totalAmount = filteredExpenses.reduce((total, exp) => total + exp.amount, 0);
  document.getElementById('totalAmount').textContent = totalAmount.toFixed(2);
};

const filterDropdown = document.querySelector('#filterExpence');
filterDropdown.addEventListener('change', () => {
  const selectedCategory = filterDropdown.value;
  filterExpenses(selectedCategory);
});


const filterExpenses = category => {
  const filteredExpenses = category === 'all'
    ? expenses
    : expenses.filter(expense => expense.category === category);
  updateTable(filteredExpenses);
};

const addExpense = (name, amount, date, category) => {
  const newExpense = {
    name,
    amount: parseFloat(amount),
    date,
    category,
  };

  expenses.push(newExpense);
  updateTable();
  saveExpenses();
};

const deleteExpense = index => {
  expenses.splice(index, 1);
  updateTable();
  saveExpenses();
};

const saveExpenses = () => {
  localStorage.setItem('expenses', JSON.stringify(expenses));
};

const loadExpenses = () => {
  const savedExpenses = JSON.parse(localStorage.getItem('expenses'));
  if (savedExpenses) {
    expenses = savedExpenses;
    updateTable();
  }
};

const expenseForm = document.querySelector('#expenseForm');
expenseForm.addEventListener('submit', e => {
  e.preventDefault();
  const expenseName = document.getElementById('expenseName').value;
  const expenseAmount = document.getElementById('expenseAmount').value;
  const expenseDate = document.getElementById('expenseDate').value;
  const expenseCategory = document.getElementById('expenseCategory').value;
  addExpense(expenseName, expenseAmount, expenseDate, expenseCategory);
  expenseForm.reset();
});

const expenseTable = document.querySelector('#expenseList');
expenseTable.addEventListener('click', e => {
  if (e.target.classList.contains('delete-btn')) {
    const index = e.target.getAttribute('data-index');
    deleteExpense(index);
  }
});

loadExpenses();