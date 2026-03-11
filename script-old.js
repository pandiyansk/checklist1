// Electrical Checklist App JavaScript

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the home page or dashboard
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        initializeHomePage();
    } else if (window.location.pathname.includes('dashboard.html')) {
        initializeDashboard();
    }
});

// Home Page Functions
function initializeHomePage() {
    const openChecklistBtn = document.getElementById('openChecklist');
    const houseNumberInput = document.getElementById('houseNumber');
    
    // Add enter key support for input
    houseNumberInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            openChecklist();
        }
    });
    
    openChecklistBtn.addEventListener('click', openChecklist);
    
    // Load any previously entered house number
    const savedHouseNumber = localStorage.getItem('currentHouseNumber');
    if (savedHouseNumber) {
        houseNumberInput.value = savedHouseNumber;
    }
}

function openChecklist() {
    const houseNumber = document.getElementById('houseNumber').value.trim();
    
    if (!houseNumber) {
        showNotification('Please enter a house number', 'error');
        return;
    }
    
    // Save house number to localStorage
    localStorage.setItem('currentHouseNumber', houseNumber);
    
    // Navigate to dashboard
    window.location.href = 'dashboard.html';
}

// Dashboard Functions
function initializeDashboard() {
    const houseTitle = document.getElementById('houseTitle');
    const backBtn = document.getElementById('backBtn');
    const downloadPDFBtn = document.getElementById('downloadPDF');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    // Load house number
    const houseNumber = localStorage.getItem('currentHouseNumber') || 'Unknown';
    houseTitle.textContent = `Checklist for House No: ${houseNumber}`;
    
    // Load saved checklist state
    loadChecklistState();
    
    // Update progress
    updateProgress();
    
    // Add event listeners
    backBtn.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    downloadPDFBtn.addEventListener('click', downloadPDF);
    
    // Add change event listeners to all checkboxes
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            saveChecklistState();
            updateProgress();
        });
    });
}

function loadChecklistState() {
    const houseNumber = localStorage.getItem('currentHouseNumber') || 'default';
    const savedState = localStorage.getItem(`checklist_${houseNumber}`);
    
    if (savedState) {
        const state = JSON.parse(savedState);
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            const key = `${checkbox.dataset.section}_${checkbox.dataset.item}`;
            if (state[key]) {
                checkbox.checked = true;
            }
        });
    }
}

function saveChecklistState() {
    const houseNumber = localStorage.getItem('currentHouseNumber') || 'default';
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const state = {};
    
    checkboxes.forEach(checkbox => {
        const key = `${checkbox.dataset.section}_${checkbox.dataset.item}`;
        state[key] = checkbox.checked;
    });
    
    localStorage.setItem(`checklist_${houseNumber}`, JSON.stringify(state));
}

function updateProgress() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const total = checkboxes.length;
    const checked = checkedBoxes.length;
    const percentage = total > 0 ? Math.round((checked / total) * 100) : 0;
    
    // Update progress bar
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}% Complete`;
    
    // Change progress bar color based on percentage
    if (percentage < 33) {
        progressFill.style.background = 'linear-gradient(90deg, #e74c3c, #c0392b)';
    } else if (percentage < 66) {
        progressFill.style.background = 'linear-gradient(90deg, #f39c12, #e67e22)';
    } else {
        progressFill.style.background = 'linear-gradient(90deg, #27ae60, #2ecc71)';
    }
}

function downloadPDF() {
    const houseNumber = localStorage.getItem('currentHouseNumber') || 'Unknown';
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
    
    // Create content for PDF
    let content = `
        <html>
        <head>
            <title>Electrical Checklist - House ${houseNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #2c3e50; text-align: center; }
                h2 { color: #34495e; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
                .summary { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
                .item { margin: 5px 0; }
                .checked { color: #27ae60; text-decoration: line-through; }
                .unchecked { color: #7f8c8d; }
                .section { margin-bottom: 25px; }
                @media print { body { margin: 10px; } }
            </style>
        </head>
        <body>
            <h1>House Electrical Inspection Checklist</h1>
            <div class="summary">
                <strong>House Number:</strong> ${houseNumber}<br>
                <strong>Date:</strong> ${new Date().toLocaleDateString()}<br>
                <strong>Progress:</strong> ${checkedBoxes.length}/${checkboxes.length} items completed (${Math.round((checkedBoxes.length / checkboxes.length) * 100)}%)
            </div>
    `;
    
    // Group items by section
    const sections = {};
    checkboxes.forEach(checkbox => {
        const section = checkbox.dataset.section;
        const item = checkbox.nextElementSibling.nextElementSibling.textContent;
        const checked = checkbox.checked;
        
        if (!sections[section]) {
            sections[section] = [];
        }
        sections[section].push({ item, checked });
    });
    
    // Add sections to content
    for (const [sectionName, items] of Object.entries(sections)) {
        content += `<div class="section"><h2>${sectionName.toUpperCase()}</h2>`;
        items.forEach(({ item, checked }) => {
            const className = checked ? 'checked' : 'unchecked';
            const status = checked ? '✓' : '○';
            content += `<div class="item ${className}">${status} ${item}</div>`;
        });
        content += '</div>';
    }
    
    content += `
        </body>
        </html>
    `;
    
    // Create a temporary blob and download
    const blob = new Blob([content], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Electrical_Checklist_House_${houseNumber}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Checklist downloaded successfully!', 'success');
}

function showNotification(message, type) {
    // Create notification element
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
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
