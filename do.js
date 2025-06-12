const addBtn = document.getElementById('addBtn');
const input = document.getElementById('todoInput');
const dateInput = document.getElementById('dateInput');

//랜덤 메시지 입력
const praiseMessages = [
  '오늘도 열심히 살았다',
  '수고했어',
  '꾸준히 하면 좋은일이 생길거야 :>',
  '앞으로도 열심히하자',
  '최고의 복수는 성공',
  '하루를 잘 마무리했네요 🌟',
  '행복해져라 (+^+)'
];

// LocalStorage에서 불러오기
function loadTodos() {
  const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
  storedTodos.forEach(({ text, dayName, completed, dateString }) => {
    addTodoToDay(text, dayName, completed, dateString);
  });
}

// 할 일을 특정 요일에 추가
function addTodoToDay(text, dayName, completed = false, dateString = '') {
  const dayColumn = document.querySelector(`.day[data-day="${dayName}"] .todo-list`);
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
    checkAllCompletedForDay(dayName);
  });

  checkbox.addEventListener('change', () => {
    textSpan.classList.toggle('completed', checkbox.checked);
    updateLocalStorage();
    checkAllCompletedForDay(dayName);
  });

  li.appendChild(checkbox);
  li.appendChild(textSpan);
  li.appendChild(dateSpan);
  li.appendChild(delBtn);
  dayColumn.appendChild(li);
}

// 모든 할 일 완료 체크 → 칭찬 메시지 표시
function checkAllCompletedForDay(dayName) {
  const daySection = document.querySelector(`.day[data-day="${dayName}"]`);
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

// LocalStorage 저장
function updateLocalStorage() {
  const allTodos = [];
  document.querySelectorAll('.day[data-day]').forEach(daySection => {
    const dayName = daySection.getAttribute('data-day');
    daySection.querySelectorAll('li').forEach(li => {
      const textSpan = li.querySelector('span:not(.todo-date)');
      const dateSpan = li.querySelector('.todo-date');
      const text = textSpan ? textSpan.textContent : '';
      const dateString = dateSpan ? dateSpan.textContent.replace(/[()]/g, '').trim() : '';
      const completed = li.querySelector('input[type="checkbox"]').checked;

      allTodos.push({ text, dayName, completed, dateString });
    });
  });

  localStorage.setItem('todos', JSON.stringify(allTodos));
}

// 버튼 클릭 시 할 일 추가
addBtn.addEventListener('click', () => {
  const text = input.value.trim();
  const selectedDate = new Date(dateInput.value);

  if (!text) {
    alert('할 일을 입력해주세요.');
    return;
  } else if (isNaN(selectedDate.getTime())) {
    alert('날짜를 입력해주세요.');
    return;
  }

  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = days[selectedDate.getDay()];
  const dateString = selectedDate.toLocaleDateString();

  addTodoToDay(text, dayName, false, dateString);
  updateLocalStorage();
  input.value = '';
  dateInput.value = '';
  checkAllCompletedForDay(dayName);
});

// 엔터 키로도 할 일 추가 가능
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addBtn.click();
});

document.addEventListener('DOMContentLoaded', loadTodos);