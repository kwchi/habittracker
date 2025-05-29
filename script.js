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
        id: Date.now().toString() + Math.random().toString(36).slice(2),
        name: habitName, 
        category: habitCategory, 
        color: habitColor, 
        completedDates: []
    };
    habits.push(habit);

    localStorage.setItem("habits", JSON.stringify(habits));
    renderHabits();

    habitInput.value = '';
    categoryInput.selectedIndex = 0;
    colorInput.value = '#0d6efd';
});

function renderHabits() {
    habitList.innerHTML = '';
    habits.forEach(habit => {
        const completedToday = habit.completedDates && habit.completedDates.includes(today);
        const btnClass = completedToday ? 'btn-secondary' : 'btn-success';
        const btnText = completedToday ? 'Done for today' : 'Done';
        const btnDisabled = completedToday ? true : false;

        const li = document.createElement('li');
        li.classList.add('mb-2');
        li.innerHTML = `
            <div class="bg-light border rounded">
            <span style="display:inline-block;width:16px;height:16px;background:${habit.color};border-radius:50%;margin-right:8px;"></span>
            <strong>${habit.name}</strong> <em>(${habit.category})</em>
            <button class="btn btn-sm ms-2 ${btnClass}" ${btnDisabled ? 'disabled' : ''}>${btnText}</button>
            <button class="btn btn-sm btn-warning ms-2">Edit</button>
            <button class="btn btn-sm btn-danger ms-2">Delete</button>
            </div>
        `;

        const buttons = li.querySelectorAll('button');
        buttons[0].onclick = () => markHabitDone(habit.id);
        buttons[1].onclick = () => openEditHabit(habit.id);
        buttons[2].onclick = () => deleteHabit(habit.id);

        habitList.appendChild(li);
    });

    renderCalendar();
    renderStats();
}

window.deleteHabit = function(id) {
    if (confirm('Are you sure you want to delete this habit?')) {
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
        localStorage.setItem("habits", JSON.stringify(habits));
        renderHabits();
    }
}

function getLast7Days() {
    const days = [];
    const todayDate = new Date();

    for (let i = 6; i >= 0; i--) {
        const date = new Date(todayDate);
        date.setDate(todayDate.getDate() - i);
        days.push(date.toISOString().split('T')[0]);
    }

    return days;
}

function renderCalendar() {
    const calendarDiv = document.getElementById('calendar-content');
    if (!calendarDiv) return;
    calendarDiv.innerHTML = '';

    const last7Days = getLast7Days();

    let html = `
      <div class="table-responsive">
        <table class="table table-bordered text-center align-middle" style="min-width: 700px;">
          <thead class="table-light">
            <tr>
              <th style="min-width: 140px; text-align: left;">Habit</th>
              ${last7Days.map(date => `<th style="width: 70px; font-size: 12px;">${date.slice(5)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
    `;

    habits.forEach(habit => {
        html += `
          <tr>
            <td class="text-start">
              <span style="display:inline-block;width:16px;height:16px;background:${habit.color};border-radius:50%;margin-right:8px;"></span>
              ${habit.name}
            </td>
            ${last7Days.map(date => {
                const done = habit.completedDates.includes(date);
                return `<td class="${done ? 'text-success' : 'text-danger'}">${done ? '✓' : '✗'}</td>`;
            }).join('')}
          </tr>
        `;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    calendarDiv.innerHTML = html;
}

function calculateStreak(habit) {
    let streak = 0;
    const todayDate = new Date();
    for (let i = 0; i < 100; i++) {
        const date = new Date(todayDate);
        date.setDate(todayDate.getDate() - i);
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
            <div class="mb-3 p-2 border rounded  bg-light">
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

window.openEditHabit = function(id) {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    document.getElementById('edit-habit-id').value = habit.id;
    document.getElementById('edit-habit-name').value = habit.name;
    document.getElementById('edit-habit-category').value = habit.category;
    document.getElementById('edit-habit-color').value = habit.color;

    const modal = new bootstrap.Modal(document.getElementById('editHabitModal'));
    modal.show();
};

document.getElementById('edit-habit-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('edit-habit-id').value;
    const name = document.getElementById('edit-habit-name').value.trim();
    const category = document.getElementById('edit-habit-category').value;
    const color = document.getElementById('edit-habit-color').value;

    const habit = habits.find(h => h.id === id);
    if (habit) {
        habit.name = name;
        habit.category = category;
        habit.color = color;
        localStorage.setItem("habits", JSON.stringify(habits));
        renderHabits();
    }
    const modal = bootstrap.Modal.getInstance(document.getElementById('editHabitModal'));
    modal.hide();
});
