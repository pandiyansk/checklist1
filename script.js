// Enhanced Electrical Checklist App JavaScript

// Default tasks data
const defaultTasks = {
    hall: [
        { id: 'fan-2', name: 'Fan – 2' },
        { id: 'design-light-2', name: 'Design Light – 2' },
        { id: 'spot-light-6', name: 'Spot Light – 6' },
        { id: 'strip-light', name: 'Strip Light' },
        { id: 'tube-light-2', name: 'Tube Light – 2' },
        { id: 'tv-cable', name: 'TV Cable' },
        { id: 'wifi-cable', name: 'WiFi Cable' },
        { id: 'home-theatre', name: 'Home Theatre' }
    ],
    portico: [
        { id: 'light-2', name: 'Light – 2' },
        { id: 'spot-lamp', name: 'Spot Lamp' },
        { id: 'centre-light', name: 'Centre Light' },
        { id: 'calling-bell', name: 'Calling Bell with Switch' },
        { id: 'gate-lamp-2', name: 'Gate Lamp – 2' },
        { id: 'sump-motor', name: 'Sump Motor' },
        { id: 'ev-charger', name: 'EV Charger Line' },
        { id: 'eb-service', name: 'EB Service' }
    ],
    kitchen: [
        { id: 'mixie', name: 'Mixie' },
        { id: 'grinder', name: 'Grinder' },
        { id: 'fridge-point', name: 'Fridge Point' },
        { id: 'oven-20a', name: 'Oven – 20A' },
        { id: 'dishwasher', name: 'Dishwasher' },
        { id: 'chimney', name: 'Chimney' },
        { id: 'ro', name: 'RO' },
        { id: 'lighter', name: 'Lighter' }
    ],
    'guest-room': [
        { id: 'fan', name: 'Fan' },
        { id: 'tube-light', name: 'Tube Light' },
        { id: 'ac-point', name: 'AC Point' },
        { id: 'charger-plug', name: 'Charger Plug' }
    ],
    bathroom: [
        { id: 'exhaust-fan', name: 'Exhaust Fan' },
        { id: 'water-heater', name: 'Water Heater Line' }
    ],
    staircase: [
        { id: 'light-2', name: 'Light – 2' },
        { id: 'ots-light', name: 'OTS Light' },
        { id: 'wall-point', name: 'Wall Point' }
    ],
    'master-bedroom': [
        { id: 'ac-point', name: 'AC Point' },
        { id: 'fan', name: 'Fan' },
        { id: 'tube-light-2', name: 'Tube Light – 2' },
        { id: 'mirror-lamp', name: 'Mirror Lamp' },
        { id: 'study-table-light', name: 'Study Table Light' },
        { id: 'wifi-connection', name: 'WiFi Connection' },
        { id: 'tv-point', name: 'TV Point' }
    ],
    balcony: [
        { id: 'elevation-lamp', name: 'Elevation Lamp' },
        { id: 'tube-light', name: 'Tube Light' },
        { id: 'spot-light-4', name: 'Spot Light – 4' }
    ],
    terrace: [
        { id: 'light', name: 'Light' }
    ]
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        initializeHomePage();
    } else if (window.location.pathname.includes('dashboard.html')) {
        initializeDashboard();
    }
});

// Home Page Functions
function initializeHomePage() {
    loadHouses();
    
    const addHouseBtn = document.getElementById('addHouseBtn');
    const newHouseInput = document.getElementById('newHouseNumber');
    
    addHouseBtn.addEventListener('click', addHouse);
    newHouseInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addHouse();
        }
    });
}

function loadHouses() {
    const houses = getHouses();
    const housesContainer = document.getElementById('housesContainer');
    const noHousesMessage = document.getElementById('noHousesMessage');
    
    if (houses.length === 0) {
        housesContainer.style.display = 'none';
        noHousesMessage.style.display = 'block';
    } else {
        housesContainer.style.display = 'grid';
        noHousesMessage.style.display = 'none';
        
        housesContainer.innerHTML = '';
        houses.forEach(house => {
            const houseCard = createHouseCard(house);
            housesContainer.appendChild(houseCard);
        });
    }
}

function createHouseCard(house) {
    const card = document.createElement('div');
    card.className = 'house-card';
    card.innerHTML = `
        <button class="delete-house" onclick="deleteHouse('${house.id}')">×</button>
        <h3>${house.name}</h3>
        <div class="house-stats">
            <span>📋 ${house.totalTasks} tasks</span>
            <span>✅ ${house.completedTasks} done</span>
        </div>
        <div class="house-progress">
            <div style="background: rgba(255,255,255,0.3); height: 4px; border-radius: 2px; margin-top: 10px;">
                <div style="background: white; height: 100%; width: ${house.progress}%; border-radius: 2px;"></div>
            </div>
            <small>${house.progress}% complete</small>
        </div>
    `;
    
    card.addEventListener('click', function(e) {
        if (!e.target.classList.contains('delete-house')) {
            openHouseDashboard(house.id);
        }
    });
    
    return card;
}

function addHouse() {
    const input = document.getElementById('newHouseNumber');
    const houseName = input.value.trim();
    
    if (!houseName) {
        showNotification('Please enter a house name', 'error');
        return;
    }
    
    const houses = getHouses();
    const houseId = houseName.toLowerCase().replace(/\s+/g, '-');
    
    if (houses.find(h => h.id === houseId)) {
        showNotification('House already exists', 'error');
        return;
    }
    
    const newHouse = {
        id: houseId,
        name: houseName,
        createdAt: new Date().toISOString(),
        tasks: JSON.parse(JSON.stringify(defaultTasks)),
        completedTasks: 0,
        totalTasks: getTotalTasksCount(defaultTasks),
        progress: 0
    };
    
    houses.push(newHouse);
    saveHouses(houses);
    
    input.value = '';
    loadHouses();
    showNotification('House added successfully!', 'success');
}

function deleteHouse(houseId) {
    if (confirm('Are you sure you want to delete this house?')) {
        let houses = getHouses();
        houses = houses.filter(h => h.id !== houseId);
        saveHouses(houses);
        
        // Also delete the checklist data
        localStorage.removeItem(`checklist_${houseId}`);
        
        loadHouses();
        showNotification('House deleted successfully', 'success');
    }
}

function openHouseDashboard(houseId) {
    localStorage.setItem('currentHouseId', houseId);
    window.location.href = 'dashboard.html';
}

// Dashboard Functions
function initializeDashboard() {
    const houseId = localStorage.getItem('currentHouseId');
    if (!houseId) {
        window.location.href = 'index.html';
        return;
    }
    
    const houses = getHouses();
    const house = houses.find(h => h.id === houseId);
    if (!house) {
        window.location.href = 'index.html';
        return;
    }
    
    setupDashboard(house);
    setupEventListeners();
    loadChecklistState(houseId);
    updateProgress(houseId);
}

function setupDashboard(house) {
    document.getElementById('houseTitle').textContent = `Dashboard for House: ${house.name}`;
    
    // Update last updated time
    const lastUpdated = localStorage.getItem(`lastUpdated_${house.id}`);
    if (lastUpdated) {
        document.getElementById('lastUpdated').textContent = `Last updated: ${new Date(lastUpdated).toLocaleString()}`;
    }
}

function setupEventListeners() {
    const houseId = localStorage.getItem('currentHouseId');
    
    // Back button
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // Add task button
    document.getElementById('addTaskBtn').addEventListener('click', function() {
        document.getElementById('addTaskModal').style.display = 'block';
    });
    
    // Modal close button
    document.querySelector('.close').addEventListener('click', function() {
        document.getElementById('addTaskModal').style.display = 'none';
    });
    
    // Save task button
    document.getElementById('saveTaskBtn').addEventListener('click', function() {
        addNewTask(houseId);
    });
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterTasks(this.dataset.filter);
        });
    });
    
    // Clear completed button
    document.getElementById('clearCompleted').addEventListener('click', function() {
        if (confirm('Clear all completed tasks?')) {
            clearCompletedTasks(houseId);
        }
    });
    
    // Download PDF button
    document.getElementById('downloadPDF').addEventListener('click', function() {
        downloadPDF(houseId);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('addTaskModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function loadChecklistState(houseId) {
    const houses = getHouses();
    const house = houses.find(h => h.id === houseId);
    
    if (!house) return;
    
    const checklistContainer = document.getElementById('checklistSections');
    checklistContainer.innerHTML = '';
    
    Object.keys(house.tasks).forEach(section => {
        const sectionCard = createSectionCard(section, house.tasks[section]);
        checklistContainer.appendChild(sectionCard);
    });
    
    // Add event listeners to checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            saveChecklistState(houseId);
            updateProgress(houseId);
        });
    });
    
    // Add delete task event listeners
    document.querySelectorAll('.delete-task').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            deleteTask(houseId, this.dataset.section, this.dataset.taskId);
        });
    });
}

function createSectionCard(section, tasks) {
    const sectionNames = {
        hall: 'HALL',
        portico: 'PORTICO',
        kitchen: 'KITCHEN',
        'guest-room': 'GUEST ROOM',
        bathroom: 'BATHROOM',
        staircase: 'STAIRCASE',
        'master-bedroom': 'MASTER BEDROOM',
        balcony: 'BALCONY',
        terrace: 'TERRACE'
    };
    
    const card = document.createElement('div');
    card.className = 'section-card';
    card.innerHTML = `
        <h2>
            ${sectionNames[section]}
            <button class="delete-section" onclick="deleteSection('${section}')">Delete Section</button>
        </h2>
        <div class="checklist-items">
            ${tasks.map(task => `
                <label class="checkbox-item">
                    <input type="checkbox" data-section="${section}" data-item="${task.id}" ${task.completed ? 'checked' : ''}>
                    <span class="checkmark"></span>
                    <span>${task.name}</span>
                    <button class="delete-task" data-section="${section}" data-task-id="${task.id}">×</button>
                </label>
            `).join('')}
        </div>
    `;
    
    return card;
}

function saveChecklistState(houseId) {
    const houses = getHouses();
    const house = houses.find(h => h.id === houseId);
    
    if (!house) return;
    
    // Update task completion status
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        const section = checkbox.dataset.section;
        const taskId = checkbox.dataset.item;
        
        if (house.tasks[section]) {
            const task = house.tasks[section].find(t => t.id === taskId);
            if (task) {
                task.completed = checkbox.checked;
            }
        }
    });
    
    // Update house statistics
    let completedCount = 0;
    let totalCount = 0;
    
    Object.values(house.tasks).forEach(sectionTasks => {
        sectionTasks.forEach(task => {
            totalCount++;
            if (task.completed) completedCount++;
        });
    });
    
    house.completedTasks = completedCount;
    house.totalTasks = totalCount;
    house.progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    
    saveHouses(houses);
    localStorage.setItem(`lastUpdated_${houseId}`, new Date().toISOString());
}

function updateProgress(houseId) {
    const houses = getHouses();
    const house = houses.find(h => h.id === houseId);
    
    if (!house) return;
    
    // Update statistics cards
    document.getElementById('totalTasks').textContent = house.totalTasks;
    document.getElementById('completedTasks').textContent = house.completedTasks;
    document.getElementById('pendingTasks').textContent = house.totalTasks - house.completedTasks;
    document.getElementById('progressPercentage').textContent = `${house.progress}%`;
    
    // Update circular progress
    updateCircularProgress(house.progress);
    
    // Update section progress bars
    updateSectionProgress(house.tasks);
    
    // Update last updated time
    const lastUpdated = localStorage.getItem(`lastUpdated_${houseId}`);
    if (lastUpdated) {
        document.getElementById('lastUpdated').textContent = `Last updated: ${new Date(lastUpdated).toLocaleString()}`;
    }
}

function updateCircularProgress(percentage) {
    const circle = document.getElementById('progressCircle');
    const text = document.getElementById('circularProgressText');
    
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = offset;
    text.textContent = `${percentage}%`;
}

function updateSectionProgress(tasks) {
    const container = document.getElementById('sectionProgressBars');
    container.innerHTML = '';
    
    const sectionNames = {
        hall: 'HALL',
        portico: 'PORTICO',
        kitchen: 'KITCHEN',
        'guest-room': 'GUEST ROOM',
        bathroom: 'BATHROOM',
        staircase: 'STAIRCASE',
        'master-bedroom': 'MASTER BEDROOM',
        balcony: 'BALCONY',
        terrace: 'TERRACE'
    };
    
    Object.keys(tasks).forEach(section => {
        const sectionTasks = tasks[section];
        const completed = sectionTasks.filter(t => t.completed).length;
        const total = sectionTasks.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        const progressItem = document.createElement('div');
        progressItem.className = 'section-progress-item';
        progressItem.innerHTML = `
            <div class="section-name">${sectionNames[section]}</div>
            <div class="section-bar">
                <div class="section-fill" style="width: ${percentage}%"></div>
            </div>
            <div class="section-percentage">${percentage}%</div>
        `;
        
        container.appendChild(progressItem);
    });
}

function addNewTask(houseId) {
    const section = document.getElementById('taskSection').value;
    const taskName = document.getElementById('taskName').value.trim();
    
    if (!taskName) {
        showNotification('Please enter a task name', 'error');
        return;
    }
    
    const houses = getHouses();
    const house = houses.find(h => h.id === houseId);
    
    if (!house || !house.tasks[section]) {
        showNotification('Invalid section', 'error');
        return;
    }
    
    const newTask = {
        id: `custom-${Date.now()}`,
        name: taskName,
        completed: false
    };
    
    house.tasks[section].push(newTask);
    saveHouses(houses);
    
    // Reload checklist
    loadChecklistState(houseId);
    updateProgress(houseId);
    
    // Close modal and reset form
    document.getElementById('addTaskModal').style.display = 'none';
    document.getElementById('taskName').value = '';
    
    showNotification('Task added successfully!', 'success');
}

function deleteTask(houseId, section, taskId) {
    if (confirm('Delete this task?')) {
        const houses = getHouses();
        const house = houses.find(h => h.id === houseId);
        
        if (house && house.tasks[section]) {
            house.tasks[section] = house.tasks[section].filter(t => t.id !== taskId);
            saveHouses(houses);
            
            loadChecklistState(houseId);
            updateProgress(houseId);
            
            showNotification('Task deleted', 'success');
        }
    }
}

function deleteSection(section) {
    const houseId = localStorage.getItem('currentHouseId');
    
    if (confirm(`Delete entire ${section.toUpperCase()} section?`)) {
        const houses = getHouses();
        const house = houses.find(h => h.id === houseId);
        
        if (house && house.tasks[section]) {
            delete house.tasks[section];
            saveHouses(houses);
            
            loadChecklistState(houseId);
            updateProgress(houseId);
            
            showNotification('Section deleted', 'success');
        }
    }
}

function clearCompletedTasks(houseId) {
    const houses = getHouses();
    const house = houses.find(h => h.id === houseId);
    
    if (!house) return;
    
    Object.keys(house.tasks).forEach(section => {
        house.tasks[section] = house.tasks[section].filter(task => !task.completed);
    });
    
    saveHouses(houses);
    loadChecklistState(houseId);
    updateProgress(houseId);
    
    showNotification('Completed tasks cleared', 'success');
}

function filterTasks(filter) {
    const allItems = document.querySelectorAll('.checkbox-item');
    
    allItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        const isChecked = checkbox.checked;
        
        if (filter === 'all') {
            item.style.display = 'flex';
        } else if (filter === 'completed' && isChecked) {
            item.style.display = 'flex';
        } else if (filter === 'pending' && !isChecked) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function downloadPDF(houseId) {
    const houses = getHouses();
    const house = houses.find(h => h.id === houseId);
    
    if (!house) return;
    
    // Create content for PDF
    let content = `
        <html>
        <head>
            <title>Electrical Checklist - ${house.name}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #2c3e50; text-align: center; }
                h2 { color: #34495e; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
                .summary { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
                .item { margin: 5px 0; }
                .checked { color: #27ae60; text-decoration: line-through; }
                .unchecked { color: #7f8c8d; }
                .section { margin-bottom: 25px; }
                .stats { display: flex; justify-content: space-around; margin: 20px 0; }
                .stat { text-align: center; }
                @media print { body { margin: 10px; } }
            </style>
        </head>
        <body>
            <h1>House Electrical Inspection Report</h1>
            <div class="summary">
                <strong>House:</strong> ${house.name}<br>
                <strong>Date:</strong> ${new Date().toLocaleDateString()}<br>
                <strong>Progress:</strong> ${house.completedTasks}/${house.totalTasks} items completed (${house.progress}%)
            </div>
            <div class="stats">
                <div class="stat">
                    <h3>${house.totalTasks}</h3>
                    <p>Total Tasks</p>
                </div>
                <div class="stat">
                    <h3>${house.completedTasks}</h3>
                    <p>Completed</p>
                </div>
                <div class="stat">
                    <h3>${house.totalTasks - house.completedTasks}</h3>
                    <p>Pending</p>
                </div>
            </div>
    `;
    
    // Add sections to content
    const sectionNames = {
        hall: 'HALL',
        portico: 'PORTICO',
        kitchen: 'KITCHEN',
        'guest-room': 'GUEST ROOM',
        bathroom: 'BATHROOM',
        staircase: 'STAIRCASE',
        'master-bedroom': 'MASTER BEDROOM',
        balcony: 'BALCONY',
        terrace: 'TERRACE'
    };
    
    Object.keys(house.tasks).forEach(section => {
        if (house.tasks[section].length > 0) {
            content += `<div class="section"><h2>${sectionNames[section]}</h2>`;
            house.tasks[section].forEach(task => {
                const className = task.completed ? 'checked' : 'unchecked';
                const status = task.completed ? '✓' : '○';
                content += `<div class="item ${className}">${status} ${task.name}</div>`;
            });
            content += '</div>';
        }
    });
    
    content += `
        </body>
        </html>
    `;
    
    // Create a temporary blob and download
    const blob = new Blob([content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Electrical_Report_${house.name}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Report downloaded successfully!', 'success');
}

// Utility Functions
function getHouses() {
    const houses = localStorage.getItem('houses');
    return houses ? JSON.parse(houses) : [];
}

function saveHouses(houses) {
    localStorage.setItem('houses', JSON.stringify(houses));
}

function getTotalTasksCount(tasks) {
    let count = 0;
    Object.values(tasks).forEach(sectionTasks => {
        count += sectionTasks.length;
    });
    return count;
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    
    if (type === 'error') {
        notification.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    } else if (type === 'success') {
        notification.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
    }
    
    notification.textContent = message;
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
