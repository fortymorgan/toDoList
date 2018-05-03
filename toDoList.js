const inputField = document.getElementById('input-field');
const addListItemButton = document.getElementById('add-listitem-button');
const listItemContainer = document.getElementById('li-container');
const selectAllCheckbox = document.getElementById('select-all');
const footerContainer = document.getElementById('footer');
const filterContainer = document.getElementById('filter-container');
const itemsLeft = document.getElementById('items-left');

const state = window.localStorage.getItem('todo-list') ? 
  JSON.parse(window.localStorage.getItem('todo-list')) : {storage: [], filter: 'all',};

const toLocalStorage = () => {
  const jsonString = JSON.stringify(state);
  window.localStorage.setItem('todo-list', jsonString);
}

const addItemToList = id => {
  const newListItem = {
    id,
    value: inputField.value,
    checked: false,
  };
  
  state.storage.push(newListItem);
  inputField.value = '';
  toLocalWithRender();
};

const removeItemFromList = id => {
  const indexOf = state.storage.findIndex(item => item.id === id);
  state.storage.splice(indexOf, 1);
  toLocalWithRender();
};

const checkItemList = id => {
  const indexOf = state.storage.findIndex(item => item.id === id);
  state.storage[indexOf].checked = !state.storage[indexOf].checked;
  toLocalWithRender();
};

const checkAllItems = pred => {
  state.storage.forEach(item => item.checked = pred);
  toLocalWithRender();
}

const toLocalWithRender = () => {
  render();
  toLocalStorage();
}

const clearCompleted = () => {
  const idToClear = state.storage.reduce((acc, item) => item.checked ? acc.concat(item.id) : acc, []);
  idToClear.forEach(item => removeItemFromList(item));
}

const activeItemsLeft = () => state.storage.reduce((acc, item) => item.checked ? acc : acc + 1, 0)

const footerRender = () => {
  itemsLeft.innerText = `${activeItemsLeft()} items left`;

  filterContainer.innerHTML = `
  <input type="radio" id="filter-all" name="filter" value="all"${state.filter === 'all' ?
    ' checked' : ''}>
  <label for="filter-all">All</label>
  <input type="radio" id="filter-active" name="filter" value="active"${state.filter === 'active' ?
  ' checked' : ''}>
  <label for="filter-active">Active</label>
  <input type="radio" id="filter-completed" name="filter" value="completed"${state.filter === 'completed' ?
  ' checked' : ''}>
  <label for="filter-completed">Completed</label>
  <button class="clear-completed" id="clear-completed">Clear completed</button>`

  const filters = filterContainer.querySelectorAll('input');

  filters.forEach(item => item.addEventListener('click', event => {
    state.filter = event.target.value;
    toLocalWithRender();
  }));

  const clearCompletedButton = document.getElementById('clear-completed');
  clearCompletedButton.addEventListener('click', () => clearCompleted());
};

const render = () => {
  listItemContainer.innerHTML = '';

  let list;
  switch (state.filter) {
    case 'all':
      list = state.storage;
      break;
    case 'active':
      list = state.storage.filter(item => item.checked === false);
      break;
    case 'completed':
      list = state.storage.filter(item => item.checked === true);
      break;
  }

  list.forEach(item => {
    const listItem = document.createElement('div');
    listItem.classList.add('list-item');
    listItem.id = `item-${item.id}`;

    listItem.innerHTML = `<label class="li-checkbox-custom">
      <input type="checkbox" id="checkbox-${item.id}"${item.checked ? ' checked' : ''}>
      <span class="checkbox-custom"></span>
    </label>
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
  
  selectAllCheckbox.checked = state.storage.length > 0 ? 
    state.storage.every(item => item.checked === true) : false;

  if (state.storage.length > 0) {
    footerRender()
   } else {
     filterContainer.innerHTML = '';
     itemsLeft.innerText = '';
   }
};

let nextItemId = !state.storage.length ? 0 : state.storage[state.storage.length - 1].id + 1;

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

selectAllCheckbox.addEventListener('click', event => {
  if (event.target.checked) {
    checkAllItems(true);
  } else {
    checkAllItems(false);
  }
});

const extractPrevState = () => {
  const prevDom = [...listItemContainer.querySelectorAll('.list-item')];
  storage = prevDom.map(item => {
    const id = +item.id.substr(5);
    const value = item.querySelector(`#list-item-${id}`).innerText;
    const checked = item.querySelector(`#checkbox-${id}`).checked;

    return {id, value, checked};
  });
  const filters = [...filterContainer.querySelectorAll('input')];
  const [activeFilter] = filters.filter(item => item.checked);

  return {storage, filter: !activeFilter ? state.filter : activeFilter.value};
};

render();
