let expenses = [];
let category = [];
let currentPageExpense = 1;
let itemsPerPageExpense = 10;
let currentPageCategory = 1;
let itemsPerPageCategory = 10;

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
  updateCategoryDropdowns();
  saveExpenses();
};

const updateTableCategory = (filteredCategory = category) => {
  const categoryTable = document.querySelector('#categoryList');
  categoryTable.innerHTML = '';

  const totalPages = Math.ceil(filteredCategory.length / itemsPerPageCategory);
  const start = (currentPageCategory - 1) * itemsPerPageCategory;
  const end = Math.min(start + itemsPerPageCategory, filteredCategory.length);
  const pageData = filteredCategory.slice(start, end);

  pageData.forEach((category, index) => {
    const newRowCat = document.createElement('tr');
    newRowCat.classList.add('body-row');
    newRowCat.innerHTML = `
      <td class="cat-index">${start + index + 1}</td>
      <td class="cat-name-td">${category.name}</td>
      <td class="action-del cat-action">
        <button class="delete-btn action-btn" data-index="${
          start + index
        }"><i class="fa-solid fa-trash"></i></button>
        <button class="edit-btn action-btn" data-index="${
          start + index
        }"><i class="fa-regular fa-pen-to-square"></i></button>
      </td>
    `;

    document.getElementById(
      'category-page-info'
    ).textContent = `Page ${currentPageExpense} of ${totalPages}`;

    document
      .getElementById('prev-expense-page')
      .addEventListener('click', () => {
        if (currentPageExpense > 1) {
          currentPageExpense--;
          updateTable();
        }
      });

    document
      .getElementById('next-expense-page')
      .addEventListener('click', () => {
        const totalPages = Math.ceil(expenses.length / itemsPerPageExpense);
        if (currentPageExpense < totalPages) {
          currentPageExpense++;
          updateTable();
        }
      });

    categoryTable.appendChild(newRowCat);
  });
};

const deleteCategory = index => {
  category.splice(index, 1);
  updateTableCategory();
  updateCategoryDropdowns();
  saveExpenses();
};

const editCategory = index => {
  const oldCategory = category[index].name;
  const catName = document.getElementsByClassName('cat-name-td')[index];
  catName.innerHTML = `<form id="catInputUpdate">
    <input type="text" class="edit-input" value="${oldCategory}">
    <button type='submit' class='submit-btn'><i class="fa-solid fa-check"></i></button>
  </form>`;
  const catNameForm = document.querySelector('#catInputUpdate');
  catNameForm.addEventListener('submit', e => {
    e.preventDefault();
    const newName = document.querySelector('.edit-input').value;
    editCategoryName(index, newName, oldCategory);
    catNameForm.reset();
  });
};

const editCategoryName = (index, newName, oldCategory) => {
  category[index].name = newName;
  expenses.forEach(expense => {
    if (expense.category === oldCategory) {
      expense.category = newName;
    }
  });
  updateTableCategory();
  updateCategoryDropdowns();
  updateTable();
  saveExpenses();
};

const categoryTable = document.querySelector('#categoryList');
categoryTable.addEventListener('click', e => {
  if (e.target.classList.contains('delete-btn')) {
    const index = e.target.getAttribute('data-index');
    deleteCategory(index);
  }
  if (e.target.classList.contains('edit-btn')) {
    const index = e.target.getAttribute('data-index');
    editCategory(index);
  }
});

//--- for expense form category dynamically---//

const updateCategoryDropdowns = () => {
  const expCatSelect = document.querySelector('.expenseCategorySelect');
  const filterDropdown = document.querySelector('#filterExpence');

  expCatSelect.innerHTML =
    '<option value="" disabled selected>Select Category</option>';
  filterDropdown.innerHTML = `<option value="" disabled selected>Select Expense Category</option>
                <option value="all">All</option>`;

  category.forEach(category => {
    const newOption = document.createElement('option');
    newOption.value = category.name;
    newOption.textContent = category.name;
    expCatSelect.appendChild(newOption);

    const newFilterOption = document.createElement('option');
    newFilterOption.value = category.name;
    newFilterOption.textContent = category.name;
    filterDropdown.appendChild(newFilterOption);
  });
};
document.addEventListener('DOMContentLoaded', () => {
  updateCategoryDropdowns();
});

//--- for expense ---//
const updateTable = (filteredExpenses = expenses) => {
  const expenseTable = document.querySelector('#expenseList');
  expenseTable.innerHTML = '';

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPageExpense);
  const start = (currentPageExpense - 1) * itemsPerPageExpense;
  const end = Math.min(start + itemsPerPageExpense, filteredExpenses.length);
  const pageData = filteredExpenses.slice(start, end);

  pageData.forEach((expense, index) => {
    const newRow = document.createElement('tr');
    newRow.classList.add('body-row');
    newRow.innerHTML = `
      <td>${start + index + 1}</td>
      <td class='exp-td-name'>${expense.name}</td>
      <td class='exp-td-amount'>${expense.amount.toLocaleString('en-IN', {
        style: 'currency',
        currency: 'INR',
      })}</td>
      <td class='exp-td-date'>${expense.date}</td>
      <td class='exp-td-category'>${expense.category}</td>
      <td class="action-del"><button class="delete-btn action-btn" data-index="${
        start + index
      }"><i class="fa-solid fa-trash"></i></button><button class="edit-btn action-btn" data-index="${
      start + index
    }"><i class="fa-regular fa-pen-to-square"></i></button></td>
    `;
    expenseTable.appendChild(newRow);
  });

  document.getElementById(
    'expense-page-info'
  ).textContent = `Page ${currentPageExpense} of ${totalPages}`;

  document.getElementById('prev-expense-page').disabled =
    currentPageExpense === 1;
  document.getElementById('next-expense-page').disabled =
    currentPageExpense === totalPages;

  const totalAmount = filteredExpenses.reduce(
    (total, exp) => total + exp.amount,
    0
  );
  document.getElementById('totalAmount').textContent =
    totalAmount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
};

const filterDropdown = document.querySelector('#filterExpence');
document.addEventListener('DOMContentLoaded', () => {
  category.forEach(category => {
    const newOption = document.createElement('option');
    newOption.value = category.name;
    newOption.textContent = category.name;
    filterDropdown.appendChild(newOption);
  });
  updateCategoryDropdowns();
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
  if (e.target.classList.contains('edit-btn')) {
    const index = e.target.getAttribute('data-index');
    editExpense(index);
  }
});
function openModal(index) {
  const btn = document.querySelectorAll('.edit-btn')[index];
  const overlay = document.querySelector('.overlay');
  const modal = document.querySelector('.modal');
  const updateBtn = document.querySelector('#update-expense-btn');

  const openModal = function () {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  btn.addEventListener('click', openModal);
  overlay.addEventListener('click', closeModal);
  updateBtn.addEventListener('click', closeModal);
}

const editExpense = index => {
  openModal(index);
  const expenseNameUpdate = document.querySelector('#expenseNameUpdate');
  const expenseAmountUpdate = document.querySelector('#expenseAmountUpdate');
  const expenseDateUpdate = document.querySelector('#expenseDateUpdate');
  const expenseCategoryUpdate = document.querySelector(
    '.formUpdate #expenseCategory'
  );
  const expenseFormUpdate = document.querySelector('#expenseFormUpdate');

  expenseCategoryUpdate.innerHTML = '';
  category.forEach(category => {
    const newOption = document.createElement('option');
    newOption.value = category.name;
    newOption.textContent = category.name;
    expenseCategoryUpdate.appendChild(newOption);
  });

  expenseNameUpdate.value = expenses[index].name;
  expenseAmountUpdate.value = expenses[index].amount;
  expenseDateUpdate.value = expenses[index].date;
  expenseCategoryUpdate.value = expenses[index].category;

  expenseFormUpdate.addEventListener('submit', e => {
    e.preventDefault();
    const newName = expenseNameUpdate.value;
    const newAmount = expenseAmountUpdate.value;
    const newDate = expenseDateUpdate.value;
    const newCategory = expenseCategoryUpdate.value;

    editExpenseName(index, newName, newAmount, newDate, newCategory);
    closeModal();
  });
};

const editExpenseName = (index, newName, newAmount, newDate, newCategory) => {
  expenses[index].name = newName;
  expenses[index].amount = parseFloat(newAmount);
  expenses[index].date = newDate;
  expenses[index].category = newCategory;
  updateTable();
  saveExpenses();
};

//--------- Searching ------------
const filterCategoryInput = document.getElementById('filterCategory');
filterCategoryInput.addEventListener('input', handleCategoryFilter);

const searchExpense = document.getElementById('searchExpense');
searchExpense.addEventListener('input', handleCategoryFilter);

function handleCategoryFilter() {
  const filterText = filterCategoryInput.value.toLowerCase();
  const filteredCategories = category.filter(cat =>
    cat.name.toLowerCase().includes(filterText)
  );
  updateTableCategory(filteredCategories);

  const searchText = searchExpense.value.toLowerCase();
  const filteredExpenses = expenses.filter(exp =>
    exp.name.toLowerCase().includes(searchText)
  );
  updateTable(filteredExpenses);
}

handleCategoryFilter();

// --------- sorting table each column in assending and decending order ----------------
function dynamicSort(prop, sortOrder) {
  return function (a, b) {
    for (let i = 0; i < prop.length; i++) {
      if (sortOrder === 'asc') {
        if (a[prop] < b[prop]) return -1;
        if (a[prop] > b[prop]) return 1;
      } else if (sortOrder === 'desc') {
        if (a[prop] < b[prop]) return 1;
        if (a[prop] > b[prop]) return -1;
      }
    }
    return 0;
  };
}

document.addEventListener('DOMContentLoaded', () => {
  var sortOrder = 'asc';
  const sortExp = document.querySelectorAll('.sort-exp');
  const sortCat = document.querySelector('.sort-cat');

  sortExp.forEach(function (sort) {
    sort.addEventListener('click', () => {
      sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      const columnIndex = sort.dataset.column;
      expenses.sort(dynamicSort(columnIndex, sortOrder));
      updateTable(expenses);
      updateArrows(sort);
    });
  });

  sortCat.addEventListener('click', () => {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    const columnIndexCat = sortCat.dataset.column;
    category.sort(dynamicSort(columnIndexCat, sortOrder));
    sortCat.classList.remove('asc', 'desc');
    sortCat.classList.add(sortOrder);
    updateTableCategory(category);
  });

  function updateArrows(activeHeader) {
    sortExp.forEach(header => {
      header.classList.remove('asc', 'desc');
    });
    activeHeader.classList.add(sortOrder);
  }
});

//--------- sorting between two dates ----------------
const sortDate = document.getElementById('SeachExpenseDateEnd');
const filterExpensesByDate = () => {
  const startDateInput = document.getElementById('SeachExpenseDateStart').value;
  const endDateInput = document.getElementById('SeachExpenseDateEnd').value;
  if (startDateInput == '') {
    alert('Please enter start dates');
    return;
  }
  const startDate = new Date(startDateInput);
  const endDate = new Date(endDateInput);
  if (startDate.getDate() < endDate.getDate()) {
    const filteredExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });
    updateTable(filteredExpenses);
  } else {
    alert('Start date should be less than end date');
    return;
  }
};

sortDate.addEventListener('change', event => {
  event.preventDefault();
  filterExpensesByDate();
});

//-------------- pagination--------------
document.getElementById('prev-expense-page').addEventListener('click', () => {
  if (currentPageExpense > 1) {
    currentPageExpense--;
    updateTable();
  }
});

document.getElementById('next-expense-page').addEventListener('click', () => {
  const totalPages = Math.ceil(expenses.length / itemsPerPageExpense);
  if (currentPageExpense < totalPages) {
    currentPageExpense++;
    updateTable();
  }
});
document.getElementById('prev-cat-page').addEventListener('click', () => {
  if (currentPageCategory > 1) {
    currentPageCategory--;
    updateTableCategory();
  }
});

document.getElementById('next-cat-page').addEventListener('click', () => {
  const totalPages = Math.ceil(category.length / itemsPerPageCategory);
  if (currentPageCategory < totalPages) {
    currentPageCategory++;
    updateTableCategory();
  }
});

loadExpenses();
