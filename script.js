const form = document.querySelector('#add-habit-form');
const habitInput = document.querySelector('#habit-name');
const categoryInput = document.querySelector('#habit-category');
const colorInput = document.querySelector('#habit-color');
const habitList = document.querySelector('#habit-list');

let habits = JSON.parse(localStorage.getItem("habits")) || [];

const today = new Date().toISOString().split('T')[0];

renderHabits();

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const habitName = habitInput.value.trim();
    const habitCategory = categoryInput.value;
    const habitColor = colorInput.value;

    if (!habitName || !habitCategory) return;

    const habit = { 
        id: Date.now().toString() + Math.random().toString(36).slice(2), // унікальний id
        name: habitName, 
        category: habitCategory, 
        color: habitColor, 
        completedDates: []
    };
    habits.push(habit);

    renderHabits();

    localStorage.setItem("habits", JSON.stringify(habits));

    habitInput.value = '';
    categoryInput.selectedIndex = 0;
    colorInput.value = '#0d6efd';
});

function renderHabits() {
    habitList.innerHTML = '';
    habits.forEach((habit, index) => {
        const completedToday = habit.completedDates && habit.completedDates.includes(today);
        const btnClass = completedToday ? 'btn-secondary' : 'btn-success';
        const btnText = completedToday ? 'Виконано сьогодні' : 'Виконано';
        const btnDisabled = completedToday ? 'disabled' : '';
        const li = document.createElement('li');
        li.innerHTML = `
            <span style="display:inline-block;width:16px;height:16px;background:${habit.color};border-radius:50%;margin-right:8px;"></span>
            <strong>${habit.name}</strong> <em>(${habit.category})</em>
            <button class="btn btn-sm ms-2 ${btnClass}" ${btnDisabled} onclick="markHabitDone('${habit.id}')">${btnText}</button>
            <button class="btn btn-sm btn-danger ms-2" onclick="deleteHabit('${habit.id}')">Видалити</button>
        `;
        habitList.appendChild(li);
    });

    renderCalendar();
    renderStats();
}

window.deleteHabit = function(id) {
    if (confirm('Ви дійсно хочете видалити цю звичку?')) {
        habits = habits.filter(h => h.id !== id);
        localStorage.setItem("habits", JSON.stringify(habits));
        renderHabits();
    }
}

window.markHabitDone = function(id) {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    if (!habit.completedDates.includes(today)) {
        habit.completedDates.push(today);
        renderHabits();
        localStorage.setItem("habits", JSON.stringify(habits));
    }
}

function getLast7Days() {
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    days.push(date.toISOString().split('T')[0]);
  }

  return days;
}

const last7Days = getLast7Days();

last7Days.forEach(date => {
  const done = habit.completedDates.includes(date);
    const cell = document.createElement('span');
    cell.textContent = done ? '✓' : '✗';
    cell.style.margin = '0 2px';
    cell.style.color = done ? 'green' : 'red';
});

function renderCalendar() {
    const calendarDiv = document.getElementById('calendar-content');
    if (!calendarDiv) return;
    calendarDiv.innerHTML = '';

    const last7Days = getLast7Days();
    let html = '<table class="table table-bordered"><thead><tr><th>Звичка</th>';
    last7Days.forEach(date => {
        html += `<th style="font-size:12px">${date.slice(5)}</th>`;
    });
    html += '</tr></thead><tbody>';

    habits.forEach(habit => {
        html += `<tr><td><span style="display:inline-block;width:16px;height:16px;background:${habit.color};border-radius:50%;margin-right:8px;"></span>${habit.name}</td>`;
        last7Days.forEach(date => {
            const done = habit.completedDates.includes(date);
            html += `<td style="text-align:center;color:${done ? 'green' : 'red'}">${done ? '✓' : '✗'}</td>`;
        });
        html += '</tr>';
    });

    html += '</tbody></table>';
    calendarDiv.innerHTML = html;
}

function calculateStreak(habit) {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 100; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const formatted = date.toISOString().split('T')[0];
        if (habit.completedDates.includes(formatted)) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}

function calculatePercent(habit) {
    const last7Days = getLast7Days();
    const completedDays = last7Days.filter(date => habit.completedDates.includes(date));
    return Math.round((completedDays.length / last7Days.length) * 100);
}

function renderStats() {
    const statsDiv = document.getElementById('habit-stats-list');
    if (!statsDiv) return;
    statsDiv.innerHTML = '';
    habits.forEach(habit => {
        const percent = calculatePercent(habit);
        const streak = calculateStreak(habit);
        const progressColor = percent === 100 ? '#198754' : percent >= 50 ? '#ffc107' : '#dc3545';
        statsDiv.innerHTML += `
            <div class="mb-3 p-2 border rounded">
                <div>
                    <span style="display:inline-block;width:16px;height:16px;background:${habit.color};border-radius:50%;margin-right:8px;"></span>
                    <strong>${habit.name}</strong> <em>(${habit.category})</em>
                </div>
                <div class="progress my-2" style="height: 20px;">
                    <div class="progress-bar" role="progressbar" style="width: ${percent}%; background:${progressColor};" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100">${percent}%</div>
                </div>
                <div>Streak: <span style="font-weight:bold">${streak}</span> 🔥</div>
            </div>
        `;
    });
}
