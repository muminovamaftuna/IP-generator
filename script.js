// Функция для генерации случайного IP-адреса
function generateRandomIP() {
    const start = 10;
    const end = 74;
    const ip = `192.168.1.${Math.floor(Math.random() * (end - start + 1)) + start}`;
    return ip;
}

// Функция для обновления таблицы
function updateTable(employeeData) {
    const tbody = document.querySelector("#employeeTable tbody");
    tbody.innerHTML = ""; // Очищаем таблицу перед добавлением новых данных

    // Заполнение таблицы новыми данными
    employeeData.forEach(employee => {
        const row = document.createElement("tr");

        const cell1 = document.createElement("td");
        const cell2 = document.createElement("td");
        const cell3 = document.createElement("td");

        cell1.textContent = employee.fullName;
        cell2.textContent = employee.position;
        cell3.textContent = employee.ipAddress;

        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        tbody.appendChild(row);
    });
}

// Функция для сохранения данных в JSON
function saveToJSON(employeeData) {
    const jsonData = JSON.stringify(employeeData, null, 4);
    localStorage.setItem("employeeData", jsonData);
}

// Функция для загрузки данных из JSON
function loadFromJSON() {
    const jsonData = localStorage.getItem("employeeData");
    if (jsonData) {
        return JSON.parse(jsonData);
    }
    return [];
}

// Обработчик формы для добавления сотрудников
document.getElementById("employeeForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Предотвращаем отправку формы

    // Получаем данные из формы
    const fullName = document.getElementById("fullName").value;
    const position = document.getElementById("position").value;

    // Генерируем IP-адрес
    const ipAddress = generateRandomIP();

    // Создаем объект сотрудника
    const newEmployee = {
        fullName,
        position,
        ipAddress
    };

    // Загружаем текущие данные
    const employeeData = loadFromJSON();
    employeeData.push(newEmployee);

    // Обновляем таблицу и сохраняем в JSON
    updateTable(employeeData);
    saveToJSON(employeeData);

    // Очищаем форму
    document.getElementById("employeeForm").reset();
});

// Обработчик кнопки "Очистить данные"
document.getElementById("clearBtn").addEventListener("click", function() {
    localStorage.removeItem("employeeData"); // Удаляем данные из localStorage
    updateTable([]); // Очищаем таблицу
});

// Обработчик кнопки "Скачать в Excel"
document.getElementById("downloadBtn").addEventListener("click", function() {
    const employeeData = loadFromJSON();

    if (employeeData.length === 0) {
        alert("Нет данных для скачивания!");
        return;
    }

    // Преобразуем данные в формат Excel
    const ws = XLSX.utils.json_to_sheet(employeeData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Сотрудники");

    // Генерируем файл Excel
    XLSX.writeFile(wb, "employee_data.xlsx");
});
