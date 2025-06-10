const addBtn = document.getElementById('addBtn');
const input = document.getElementById('todoInput');
const dateInput = document.getElementById('dateInput');
const praiseBox = document.getElementById('praiseBox');

//랜덤 메시지 입력
const praiseMessages = [
  '오늘도 열심히 살았다',
  '수고했어',
  '다해냈다!',
  '앞으로도 열심히하자',
  '최고의 복수는 성공',
  '하루를 잘 마무리했네요 🌟'
];

addBtn.addEventListener('click', () => {
  const text = input.value.trim();
  const selectedDate = new Date(dateInput.value);

  if (!text || isNaN(selectedDate)) {
    alert('날짜와 할 일을 모두 입력해주세요.');
    return;
  }

  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = days[selectedDate.getDay()];
  const dayColumn = document.querySelector(`.day[data-day="${dayName}"] .todo-list`);

  if (!dayColumn) {
    alert(`${dayName}요일 섹션을 찾을 수 없습니다.`);
    return;
  }

  const li = document.createElement('li');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';

  const span = document.createElement('span');
  span.textContent = text;

  // 삭제 버튼
  const delBtn = document.createElement('button');
  delBtn.textContent = '삭제';
  delBtn.style.marginLeft = '10px';
  delBtn.addEventListener('click', () => {
    li.remove();
    checkAllCompleted();
  });

  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      span.classList.add('completed');
    } else {
      span.classList.remove('completed');
    }
    checkAllCompleted();
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(delBtn);
  dayColumn.appendChild(li);

  input.value = '';
});

function checkAllCompleted() {
  const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
  const allChecked = Array.from(allCheckboxes).length > 0 &&
                     Array.from(allCheckboxes).every(cb => cb.checked);

  if (allChecked) {
    const randomMessage = praiseMessages[Math.floor(Math.random() * praiseMessages.length)];
    praiseBox.textContent = randomMessage;
  } else {
    praiseBox.textContent = '';
  }
}