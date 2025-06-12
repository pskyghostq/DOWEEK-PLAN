const addBtn = document.getElementById('addBtn');
const input = document.getElementById('todoInput');
const dateInput = document.getElementById('dateInput');

const praiseMessages = [
  '오늘도 열심히 살았다',
  '수고했어',
  '꾸준히 하면 좋은일이 생길거야 :>',
  '앞으로도 열심히하자',
  '최고의 복수는 성공',
  '하루를 잘 마무리했네요 🌟',
  '행복해져라 (+^+)'
];

const days = ['일', '월', '화', '수', '목', '금', '토'];

// 주차 블록을 삽입할 container 지정
const weekSheet = document.getElementById('week-container');

function createWeekBlock(weekNumber, dayName) {
  // 먼저 해당 주차의 블록이 있는지 확인
  let weekBlock = document.querySelector(`.week-block[data-week="${weekNumber}"]`);

  // 주차 블록이 없다면 새로 생성
  if (!weekBlock) {
    weekBlock = document.createElement('div');
    weekBlock.classList.add('week-block');
    weekBlock.setAttribute('data-week', weekNumber);

    const weekTitle = document.createElement('h3');
    weekTitle.textContent = `${weekNumber}주차`;
    weekBlock.appendChild(weekTitle);

    // 주차 블록의 올바른 위치 찾기 (오름차순 정렬)
    let inserted = false;
    const blocks = document.querySelectorAll('.week-block');
    blocks.forEach(block => {
      const currentWeek = parseInt(block.getAttribute('data-week'));
      if (!inserted && currentWeek > weekNumber) {
        weekSheet.insertBefore(weekBlock, block);
        inserted = true;
      }
    });
    if (!inserted) {
      weekSheet.appendChild(weekBlock);
    }
  }

  // 주차 블록 내에 해당 요일 박스가 없으면 생성
  let dayDiv = weekBlock.querySelector(`.day[data-day="${dayName}"]`);
  if (!dayDiv) {
    dayDiv = document.createElement('div');
    dayDiv.classList.add('day');
    dayDiv.setAttribute('data-day', dayName);

    const dayTitle = document.createElement('h4');
    dayTitle.textContent = `${dayName}요일`;
    dayDiv.appendChild(dayTitle);

    const ul = document.createElement('ul');
    ul.classList.add('todo-list');
    dayDiv.appendChild(ul);

    const praiseBox = document.createElement('div');
    praiseBox.classList.add('praiseBox');
    dayDiv.appendChild(praiseBox);

    weekBlock.appendChild(dayDiv);
  }

  return weekBlock;
}

function addTodoToWeekDay(text, weekNumber, dayName, completed = false, dateString = '') {
  const weekBlock = createWeekBlock(weekNumber, dayName);
  const dayColumn = weekBlock.querySelector(`.day[data-day="${dayName}"] .todo-list`);
  if (!dayColumn) return;

  const li = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = completed;

  const textSpan = document.createElement('span');
  textSpan.textContent = text;
  if (completed) textSpan.classList.add('completed');

  const dateSpan = document.createElement('span');
  dateSpan.classList.add('todo-date');
  if (dateString) dateSpan.textContent = ` (${dateString})`;

  const delBtn = document.createElement('button');
  delBtn.textContent = '삭제';
  delBtn.style.marginLeft = '10px';
  delBtn.addEventListener('click', () => {
    li.remove();
    updateLocalStorage();
    checkAllCompletedForDay(weekNumber, dayName);
    cleanupEmptyWeekBlock(weekNumber);
  });

  checkbox.addEventListener('change', () => {
    textSpan.classList.toggle('completed', checkbox.checked);
    updateLocalStorage();
    checkAllCompletedForDay(weekNumber, dayName);
  });

  li.appendChild(checkbox);
  li.appendChild(textSpan);
  li.appendChild(dateSpan);
  li.appendChild(delBtn);
  dayColumn.appendChild(li);
}

function checkAllCompletedForDay(weekNumber, dayName) {
  const weekBlock = document.querySelector(`.week-block[data-week="${weekNumber}"]`);
  if (!weekBlock) return;

  const daySection = weekBlock.querySelector(`.day[data-day="${dayName}"]`);
  if (!daySection) return;

  const praiseBox = daySection.querySelector('.praiseBox');
  const checkboxes = daySection.querySelectorAll('input[type="checkbox"]');
  const allChecked = checkboxes.length > 0 && Array.from(checkboxes).every(cb => cb.checked);

  if (praiseBox) {
    praiseBox.textContent = allChecked
      ? praiseMessages[Math.floor(Math.random() * praiseMessages.length)]
      : '';
  }
}

function cleanupEmptyWeekBlock(weekNumber) {
  const weekBlock = document.querySelector(`.week-block[data-week="${weekNumber}"]`);
  if (!weekBlock) return;

  const hasTodos = weekBlock.querySelectorAll('li').length > 0;
  if (!hasTodos) {
    weekBlock.remove();
  }
}

function updateLocalStorage() {
  const allTodos = [];
  document.querySelectorAll('.week-block').forEach(weekBlock => {
    const weekNumber = parseInt(weekBlock.getAttribute('data-week'));
    weekBlock.querySelectorAll('.day').forEach(daySection => {
      const dayName = daySection.getAttribute('data-day');
      daySection.querySelectorAll('li').forEach(li => {
        const textSpan = li.querySelector('span:not(.todo-date)');
        const dateSpan = li.querySelector('.todo-date');
        const text = textSpan ? textSpan.textContent : '';
        const dateString = dateSpan ? dateSpan.textContent.replace(/[()]/g, '').trim() : '';
        const completed = li.querySelector('input[type="checkbox"]').checked;

        allTodos.push({ text, weekNumber, dayName, completed, dateString });
      });
    });
  });

  localStorage.setItem('todos', JSON.stringify(allTodos));
}

function loadTodos() {
  const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
  storedTodos.forEach(({ text, weekNumber, dayName, completed, dateString }) => {
    addTodoToWeekDay(text, weekNumber, dayName, completed, dateString);
  });
}

function getWeekNumber(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const firstDayWeekday = firstDay.getDay();

  const currentDate = date.getDate();
  const daysInFirstWeek = 8 - firstDayWeekday;

  if (currentDate <= daysInFirstWeek) {
    return 1;
  } else {
    return 1 + Math.ceil((currentDate - daysInFirstWeek) / 7);
  }
}

addBtn.addEventListener('click', () => {
  const text = input.value.trim();
  const selectedDate = new Date(dateInput.value);

  if (!text) {
    alert('할 일을 입력해주세요.');
    return;
  }
  if (isNaN(selectedDate.getTime())) {
    alert('날짜를 입력해주세요.');
    return;
  }

  const dayName = days[selectedDate.getDay()];
  const dateString = selectedDate.toLocaleDateString();
  const weekNumber = getWeekNumber(selectedDate);

  addTodoToWeekDay(text, weekNumber, dayName, false, dateString);
  updateLocalStorage();
  input.value = '';
  dateInput.value = '';
  checkAllCompletedForDay(weekNumber, dayName);
});

input.addEventListener('keydown', e => {
  if (e.key === 'Enter') addBtn.click();
});

document.addEventListener('DOMContentLoaded', loadTodos);