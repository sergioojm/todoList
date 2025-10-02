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

  const row1 = document.createElement('div');
  const row2 = document.createElement('div');
  const row3 = document.createElement('div');

  row1.className = 'chore-row-1';
  row2.className = 'chore-row-2';
  row3.className = 'chore-row-3';

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

  row1.appendChild(timestampt);
  row1.appendChild(finishedButton);
  row1.appendChild(deleteButton);
  row2.appendChild(title);
  row3.appendChild(input);

  div.appendChild(row1);
  div.appendChild(row2);
  div.appendChild(row3);

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
