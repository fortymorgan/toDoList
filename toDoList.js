const inputField = document.getElementById('input-field');
const addListItemButton = document.getElementById('add-listitem-button');
const listItemContainer = document.getElementById('li-container');
const selectAllCheckbox = document.getElementById('select-all');
const footerContainer = document.getElementById('footer');
const filterContainer = document.getElementById('filter-container');
const itemsLeft = document.getElementById('items-left');

const storage = JSON.parse(window.localStorage.getItem('todo-list'));

const toLocalStorage = () => {
  const jsonString = JSON.stringify(storage);
  window.localStorage.setItem('todo-list', jsonString);
}

const addItemToList = id => {
  const newListItem = {
    id,
    value: inputField.value,
    checked: false,
  };
  
  storage.push(newListItem);
  inputField.value = '';
  toLocalWithRender();
};

const removeItemFromList = id => {
  const indexOf = storage.findIndex(item => item.id === id);
  storage.splice(indexOf, 1);
  toLocalWithRender();
};

const checkItemList = id => {
  const indexOf = storage.findIndex(item => item.id === id);
  storage[indexOf].checked = !storage[indexOf].checked;
  toLocalWithRender();
};

const checkAllItems = state => {
  storage.forEach(item => item.checked = state);
  toLocalWithRender();
}

const renderFiltered = state => {
  const filtered = storage.filter(item => item.checked === state);
  renderList(filtered);
}

const toLocalWithRender = () => {
  renderList(storage);
  toLocalStorage();
}

const clearCompleted = () => {
  const idToClear = storage.reduce((acc, item) => item.checked ? acc.concat(item.id) : acc, []);
  idToClear.forEach(item => removeItemFromList(item));
}

const activeItemsLeft = () => storage.reduce((acc, item) => item.checked ? acc : acc + 1, 0)

const footerRender = () => {
  itemsLeft.innerText = `${activeItemsLeft()} items left`;

  if (!filterContainer.innerHTML) {
    filterContainer.innerHTML = `<input type="radio" id="filter-all" name="filter" value="all">
    <label for="filter-all">All</label>
    <input type="radio" id="filter-active" name="filter" value="active">
    <label for="filter-active">Active</label>
    <input type="radio" id="filter-completed" name="filter" value="completed">
    <label for="filter-completed">Completed</label>
    <button class="clear-comleted" id="clear-completed">Clear completed</button>`

    const getFilter = prefix => document.getElementById(`filter-${prefix}`);

    const filterAll = getFilter('all');
    filterAll.addEventListener('click', () => renderList(storage));

    const filterActive = getFilter('active');
    filterActive.addEventListener('click', () => renderFiltered(false));
    
    const filterCompleted = getFilter('completed');
    filterCompleted.addEventListener('click', () => renderFiltered(true));

    const clearCompletedButton = document.getElementById('clear-completed');
    clearCompletedButton.addEventListener('click', () => clearCompleted());
  } else {
    return;
  }
};

const renderList = list => {
  listItemContainer.innerHTML = '';
  list.forEach(item => {
    const listItem = document.createElement('div');
    listItem.classList.add('list-item');

    listItem.innerHTML = `<input type="checkbox" id="checkbox-${item.id}"${item.checked ? ' checked' : ''}>
    <label for="checkbox-${item.id}" id="list-item-${item.id}">${item.value}</label>
    <button class="del-button" id="del-item-${item.id}">✕</button>`;

    listItemContainer.appendChild(listItem);

    const getElement = prefix => document.getElementById(`${prefix}-${item.id}`);

    const delButton = getElement('del-item');
    delButton.addEventListener('click', () => {
      removeItemFromList(item.id);
    });

    const checkDone = getElement('checkbox');
    checkDone.addEventListener('click', () => {
      checkItemList(item.id);
    });
  });

  if (storage.length > 0) {
    footerRender()
   } else {
     filterContainer.innerHTML = '';
     itemsLeft.innerText = '';
   }
};

let nextItemId = 0;

const addIfNotEmpty = () => {
  if (inputField.value) {
    addItemToList(nextItemId++);
  }
};

inputField.addEventListener('keydown', event => {
  if (event.keyCode === 13) {
    addIfNotEmpty();
  }
});

selectAllCheckbox.addEventListener('change', event => {
  if (event.target.checked) {
    checkAllItems(true);
  } else {
    checkAllItems(false);
  }
});

renderList(storage);
