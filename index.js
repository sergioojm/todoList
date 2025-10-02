function saveChoresToLocalStorage() {
  const chores = [];
  document.querySelectorAll('.chore').forEach(choreDiv => {
    const title = choreDiv.querySelector('.chore-title').value;
    const description = choreDiv.querySelector('.chore-input').value;
    const timestampt = choreDiv.querySelector('.chore-timestampt').textContent;
    const isFinished = choreDiv.querySelector('.chore-input').disabled;
    chores.push({ title, description, timestampt, isFinished });
  });
  localStorage.setItem('chores', JSON.stringify(chores));
}

function loadChoresFromLocalStorage() {
  const chores = JSON.parse(localStorage.getItem('chores')) || [];
  chores.forEach(chore => createChore(chore));
}

function createInput({ type = 'text', placeholder = '', value = '', className = '', disabled = false }) {
  const input = document.createElement('input');
  input.type = type;
  input.placeholder = placeholder;
  input.className = className;
  input.value = value;
  input.disabled = disabled;
  return input;
}

function createButton({ id = '', onClick }) {
  const btn = document.createElement('button');
  btn.className = 'chore-button';
  btn.id = id;
  btn.onclick = onClick;
  return btn;
}

function createChore(chore = {}) {
  const div = document.createElement('div');
  div.className = 'chore';

  const now = new Date();

  const timestampt = document.createElement('p');
  timestampt.className = 'chore-timestampt';
  timestampt.textContent = chore.timestampt || `Created on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;

  const title = createInput({
    className: 'chore-title',
    placeholder: 'Enter chore name...',
    value: chore.title || 'New Chore'
  });

  const input = createInput({
    className: 'chore-input',
    placeholder: 'Enter chore description...',
    value: chore.description || ''
  });

  const deleteButton = createButton({
    id: 'delete-button',
    onClick: () => {
      div.remove();
      saveChoresToLocalStorage();
    }
  });

  const finishedButton = createButton({
    id: 'finished-button',
    onClick: () => {
      const finished = new Date();
      input.disabled = !input.disabled;
      input.style.textDecoration = input.disabled ? 'line-through' : 'none';
      title.value = input.disabled
        ? title.value.replace(/ \(Finished\)/, '') + ' (Finished)'
        : title.value.replace(' (Finished)', '');
      timestampt.textContent = input.disabled
        ? `Finished on: ${finished.toLocaleDateString()} at ${finished.toLocaleTimeString()}`
        : chore.timestampt || `Created on: ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`;
      saveChoresToLocalStorage();
    }
  });

  if (chore.isFinished) {
    input.disabled = true;
    input.style.textDecoration = 'line-through';
  }

  [input, title].forEach(el => el.addEventListener('blur', saveChoresToLocalStorage));

  div.append(timestampt, deleteButton, finishedButton, title, input);
  document.getElementById('chores').appendChild(div);

  saveChoresToLocalStorage();
}

function newChore() {
  createChore();
}

window.onload = () => {
  loadChoresFromLocalStorage();
  document.getElementById('new-chore-button').onclick = newChore;
  window.onbeforeunload = saveChoresToLocalStorage;
};
