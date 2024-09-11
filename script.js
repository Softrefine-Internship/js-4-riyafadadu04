let expenses = [];
let category = [];

//--- for tab buttons ---//
const tabButtons = document.querySelectorAll('.tablinks');
const tabPanels = document.querySelectorAll('.tab-content');

showTab('Expense');

tabButtons.forEach(button => {
  button.addEventListener('click', () => {
    const tabId = button.innerHTML;
    showTab(tabId);
  });
});

function showTab(tabId) {
  tabPanels.forEach(panel => {
    panel.style.display = 'none';
    if (panel.classList.contains(`${tabId}-container`)) {
      panel.style.display = 'block';
      return;
    }
  });

  tabButtons.forEach(button => {
    button.classList.toggle('active-tab', button.innerHTML === tabId);
  });
}



//--- for category ---//
const categoryForm = document.querySelector('#categoryForm');

categoryForm.addEventListener('submit', e => {
  e.preventDefault();
  const categoryName = document.getElementById('categoryName').value;
  addCategory(categoryName);
  categoryForm.reset();
});

const addCategory = name => {
  const newCategory = { name };
  category.push(newCategory);
  updateTableCategory();
  saveExpenses();
};

const updateTableCategory = (filteredCategory = category) => {
  const categoryTable = document.querySelector('#categoryList');
  categoryTable.innerHTML = '';

  filteredCategory.forEach((category, index) => {
    const newRowCat = document.createElement('tr');
    newRowCat.classList.add('body-row');
    newRowCat.innerHTML = `
      <td class="cat-index">${index + 1}</td>
      <td>${category.name}</td>
      <td class="action-del cat-action"><button class="delete-btn action-btn" data-index="${index}"><i class="fa-solid fa-trash"></i></button><button class="edit-btn action-btn" data-index="${index}"><i class="fa-regular fa-pen-to-square"></i></button></td>
    `;
    categoryTable.appendChild(newRowCat);
  });
};

const deleteCategory = index => {
  category.splice(index, 1);
  updateTableCategory();
  saveExpenses();
};

const categoryTable = document.querySelector('#categoryList');
categoryTable.addEventListener('click', e => {
  if (e.target.classList.contains('delete-btn')) {
    const index = e.target.getAttribute('data-index');
    deleteCategory(index);
  }
});



//--- for expense form category dynamically---//
document.addEventListener('DOMContentLoaded', () => {
  const expCatSelect = document.querySelector('.expenseCategorySelect');
  category.forEach(category => {
    const newOption = document.createElement('option');
    newOption.value = category.name;
    newOption.textContent = category.name;
    expCatSelect.appendChild(newOption);
  });
});



//--- for expense ---//
const updateTable = (filteredExpenses = expenses) => {
  const expenseTable = document.querySelector('#expenseList');
  expenseTable.innerHTML = '';

  filteredExpenses.forEach((expense, index) => {
    const newRow = document.createElement('tr');
    newRow.classList.add('body-row');
    newRow.innerHTML = `
      <td>${index + 1}</td>
      <td>${expense.name}</td>
      <td>&#x20b9; ${expense.amount}</td>
      <td>${expense.date}</td>
      <td>${expense.category}</td>
      <td class="action-del"><button class="delete-btn action-btn" data-index="${index}"><i class="fa-solid fa-trash"></i></button><button class="edit-btn action-btn" data-index="${index}"><i class="fa-regular fa-pen-to-square"></i></button></td>
    `;
    expenseTable.appendChild(newRow);
  });

  const totalAmount = filteredExpenses.reduce(
    (total, exp) => total + exp.amount,
    0
  );
  document.getElementById('totalAmount').textContent = totalAmount.toFixed(2);
};

const filterDropdown = document.querySelector('#filterExpence');
document.addEventListener('DOMContentLoaded', () => {
  category.forEach(category => {
    const newOption = document.createElement('option');
    newOption.value = category.name;
    newOption.textContent = category.name;
    filterDropdown.appendChild(newOption);
  });
});
filterDropdown.addEventListener('change', () => {
  const selectedCategory = filterDropdown.value;
  filterExpenses(selectedCategory);
});

const filterExpenses = category => {
  const filteredExpenses =
    category === 'all'
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
  localStorage.setItem('category', JSON.stringify(category));
};

const loadExpenses = () => {
  const savedExpenses = JSON.parse(localStorage.getItem('expenses'));
  if (savedExpenses) {
    expenses = savedExpenses;
    updateTable();
  }
  const savedCategory = JSON.parse(localStorage.getItem('category'));
  if (savedCategory) {
    category = savedCategory;
    updateTableCategory();
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
