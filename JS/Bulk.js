const messagesData = [
    {
        id: 1,
        message: "We are delighted to extend my heartfelt congratulations on your recent promotion to Super Admin. Your dedication and hard work have truly paid off, and we are thrilled to see you take on this exciting new role with confidence and enthusiasm.",
        date: "NOV 26, 2024 | 4:55 AM",
        provider: "Test Test",
        reason: "Marketing",
        response: "Success"
    },
    {
        id: 2,
        message: "We are delighted to extend my heartfelt congratulations on your recent promotion to Super Admin. Your dedication and hard work have truly paid off, and we are thrilled to see you take on this exciting new role with confidence and enthusiasm.",
        date: "NOV 26, 2024 | 4:55 AM",
        provider: "Test Test",
        reason: "Marketing",
        response: "Failed"
    },
    {
        id: 3,
        message: "has requested to change their password for security purposes",
        date: "NOV 26, 2024 | 4:55 AM",
        provider: "Test Test",
        reason: "Marketing",
        response: "Success"
    },
    {
        id: 4,
        message: "has requested to change their email address in the system",
        date: "NOV 26, 2024 | 4:55 AM",
        provider: "Test Test",
        reason: "Marketing",
        response: "Success"
    },
    {
        id: 5,
        message: "We are delighted to extend my heartfelt congratulations on your recent promotion to Super Admin. Your dedication and hard work have truly paid off, and we are thrilled to see you take on this exciting new role with confidence and enthusiasm.",
        date: "NOV 26, 2024 | 4:55 AM",
        provider: "Test Test",
        reason: "Marketing",
        response: "Failed"
    },
    {
        id: 6,
        message: "has requested to change their profile information",
        date: "NOV 26, 2024 | 4:55 AM",
        provider: "Test Test",
        reason: "Marketing",
        response: "Success"
    }
];

let currentEditingId = null;

function truncateMessage(message, maxLength = 50) {
    if (message.length <= maxLength) {
        return message;
    }
    return message.substring(0, maxLength) + '...';
}

function renderTable() {
    const tableBody = document.getElementById('messagesTableBody');
    tableBody.innerHTML = '';

    messagesData.forEach(item => {
        const row = document.createElement('tr');
        
        const isLongMessage = item.message.length > 50;
        const displayMessage = truncateMessage(item.message);
        
        row.innerHTML = `
            <td>${item.id}</td>
            <td class="message-cell ${isLongMessage ? 'truncated-message' : ''}" 
                onclick="showMessage(${item.id})" 
                title="${isLongMessage ? 'Click to view full message' : ''}">
                ${displayMessage}
            </td>
            <td>${item.date}</td>
            <td>${item.provider}</td>
            <td>${item.reason}</td>
            <td>
                <span class="status-${item.response.toLowerCase()}">
                    ${item.response}
                </span>
            </td>
            <td>
                ${item.response === 'Failed' ? 
                    `<button class="action-btn" onclick="editMessage(${item.id})" title="Edit message">
                        <i class="fas fa-cog"></i>
                    </button>` : 
                    ''
                }
            </td>
        `;
        
        tableBody.appendChild(row);
    });
}

function showMessage(id) {
    const message = messagesData.find(item => item.id === id);
    if (message) {
        document.getElementById('messageContent').textContent = message.message;
        const messageModal = new bootstrap.Modal(document.getElementById('messageModal'));
        messageModal.show();
    }
}

function editMessage(id) {
    const message = messagesData.find(item => item.id === id);
    if (message) {
        currentEditingId = id;
        document.getElementById('editMessageText').value = message.message;
        const editModal = new bootstrap.Modal(document.getElementById('editMessageModal'));
        editModal.show();
    }
}

function handleResend() {
    const newMessage = document.getElementById('editMessageText').value.trim();
    
    if (newMessage && currentEditingId) {
        const messageIndex = messagesData.findIndex(item => item.id === currentEditingId);
        if (messageIndex !== -1) {
            messagesData[messageIndex].message = newMessage;
            messagesData[messageIndex].response = 'Success';
        }
        
        renderTable();
        
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editMessageModal'));
        editModal.hide();
        
        currentEditingId = null;
        
        alert('Message updated and resent successfully!');
    }
}

document.getElementById('resendBtn').addEventListener('click', handleResend);

renderTable();