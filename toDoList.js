const inputField = document.getElementById('input-field');
const addListItemButton = document.getElementById('add-listitem-button');
const listItemContainer = document.getElementById('li-container');

const addItemToList = id => {
  const listItem = document.createElement('div');
  listItem.classList.add('list-item');

  listItem.innerHTML = `<input type="checkbox" id="checkbox-${id}">
  <label for="checkbox-${id}" id="list-item-${id}">${inputField.value}</label>
  <button class="del-button" id="del-item-${id}">✕</button>`;

  listItemContainer.appendChild(listItem);
  inputField.value = '';

  const getElement = prefix => document.getElementById(`${prefix}-${id}`);
  
  const delButton = getElement('del-item');
  delButton.addEventListener('click', () => listItem.remove());
  
  listItem.addEventListener('mouseover', () => delButton.classList.add('active'));
  listItem.addEventListener('mouseleave', () => delButton.classList.remove('active'));
  
  const checkDone = getElement('checkbox');
  const listItemValue = getElement('list-item')
  checkDone.addEventListener('change', event => {
    if (event.target.checked) {
      listItemValue.classList.add('done');
    } else {
      listItemValue.classList.remove('done');
    }
  });
};

let nextItemId = 0;

const addIfNotEmpty = () => {
  if (inputField.value) {
    addItemToList(nextItemId++);
  }
};

addListItemButton.addEventListener('click', () => addIfNotEmpty());
inputField.addEventListener('keydown', event => {
  if (event.keyCode === 13) {
    addIfNotEmpty();
  }
});

const toggleAllCheckbox = toggle => {
  document.querySelectorAll('input[id^=checkbox]')
    .forEach(elem => elem.checked = toggle);
}

selectAllCheckbox.addEventListener('change', event => {
  if (event.target.checked) {
    toggleAllCheckbox(true);
  } else {
    toggleAllCheckbox(false);
  }
})