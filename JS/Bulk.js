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
    if (message && message.message.length > 50) {
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

function showSuccessModal() {
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    successModal.show();
    
    setTimeout(() => {
        successModal.hide();
    }, 3000);
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

        showSuccessModal();
    }
}

function showNewMessageModal() {
    document.getElementById('newMessageReason').value = '';
    document.getElementById('newMessageProvider').value = '';
    document.getElementById('emailAddress').value = '';
    document.getElementById('emailTo').value = '';
    document.getElementById('emailCC').value = '';
    document.getElementById('emailSubject').value = '';
    document.getElementById('emailMessage').value = '';
    document.getElementById('smsNumbers').value = '';
    document.getElementById('smsPersonalNumber').value = '';
    document.getElementById('smsMessage').value = '';

    document.getElementById('bulkSMS').checked = false;
    document.getElementById('personalSMS').checked = false;

    const modalDialog = document.getElementById('newMessageModalDialog');
    modalDialog.classList.remove('modal-expanded');

    const emailFields = document.getElementById('emailFields');
    const smsFields = document.getElementById('smsFields');
    const smsTypeFields = document.getElementById('smsTypeFields');
    const sendBtn = document.getElementById('sendNewMessageBtn');

    emailFields.classList.remove('show');
    smsFields.classList.remove('show');
    smsTypeFields.classList.remove('show');
    
    sendBtn.style.display = 'none';

    const newMessageModal = new bootstrap.Modal(document.getElementById('newMessageModal'));
    newMessageModal.show();
}

function checkSendButtonVisibility() {
    const provider = document.getElementById('newMessageProvider').value;
    const sendBtn = document.getElementById('sendNewMessageBtn');
    
    if (provider === '') {
        sendBtn.style.display = 'none';
        return;
    }
    
    if (provider === 'Email') {
        sendBtn.style.display = 'block';
    } else if (provider === 'SMS') {
        const bulkRadio = document.getElementById('bulkSMS');
        const personalRadio = document.getElementById('personalSMS');
        
        if (bulkRadio.checked || personalRadio.checked) {
            sendBtn.style.display = 'block';
        } else {
            sendBtn.style.display = 'none';
        }
    }
}

function handleProviderChange() {
    const provider = document.getElementById('newMessageProvider').value;
    const emailFields = document.getElementById('emailFields');
    const smsFields = document.getElementById('smsFields');
    const smsTypeFields = document.getElementById('smsTypeFields');
    const modalDialog = document.getElementById('newMessageModalDialog');

    emailFields.classList.remove('show');
    smsFields.classList.remove('show');
    smsTypeFields.classList.remove('show');

    if (provider === 'Email') {
        modalDialog.classList.add('modal-expanded');
        setTimeout(() => {
            emailFields.classList.add('show');
        }, 150);
    } else if (provider === 'SMS') {
        modalDialog.classList.add('modal-expanded');
        setTimeout(() => {
            smsTypeFields.classList.add('show');
        }, 150);
    } else {
        modalDialog.classList.remove('modal-expanded');
    }
    
    checkSendButtonVisibility();
}

function handleSMSTypeChange() {
    const smsFields = document.getElementById('smsFields');
    const numbersField = document.getElementById('numbersField');
    const personalNumberField = document.getElementById('personalNumberField');
    const bulkRadio = document.getElementById('bulkSMS');
    const personalRadio = document.getElementById('personalSMS');

    if (bulkRadio.checked || personalRadio.checked) {
        setTimeout(() => {
            smsFields.classList.add('show');
        }, 150);

        if (bulkRadio.checked) {
            numbersField.style.display = 'block';
            personalNumberField.style.display = 'none';
        } else if (personalRadio.checked) {
            numbersField.style.display = 'none';
            personalNumberField.style.display = 'block';
        }
    } else {
        smsFields.classList.remove('show');
    }
    
    checkSendButtonVisibility();
}

function isValidEmail(email) {
    return email.includes('@') && email.includes('.') && email.length > 5;
}

function isValidPhoneNumber(phone) {
    const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
    return /^\d+$/.test(cleanPhone) && cleanPhone.length >= 8;
}

function handleSendNewMessage() {
    const reason = document.getElementById('newMessageReason').value.trim();
    const provider = document.getElementById('newMessageProvider').value;

    if (!reason || !provider) {
        alert('Please fill in all required fields');
        return;
    }

    let messageData = {
        id: messagesData.length + 1,
        reason: reason,
        provider: provider,
        date: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        }) + ' | ' + new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }),
        response: 'Success'
    };

    if (provider === 'Email') {
        const emailTo = document.getElementById('emailTo').value.trim();
        const emailCC = document.getElementById('emailCC').value.trim();
        const emailSubject = document.getElementById('emailSubject').value.trim();
        const emailMessage = document.getElementById('emailMessage').value.trim();
        const emailAddress = document.getElementById('emailAddress').value;

        if (!emailTo || !emailSubject || !emailMessage || !emailAddress) {
            alert('Please fill in all email fields');
            return;
        }

        if (!isValidEmail(emailTo)) {
            alert('Please enter a valid email address in the "To" field (must contain @ and .)');
            return;
        }

        if (emailCC && !isValidEmail(emailCC)) {
            alert('Please enter a valid email address in the "CC" field (must contain @ and .)');
            return;
        }

        messageData.message = emailMessage;
        messageData.provider = emailAddress;

    } else if (provider === 'SMS') {
        const smsMessage = document.getElementById('smsMessage').value.trim();
        const bulkRadio = document.getElementById('bulkSMS');
        const personalRadio = document.getElementById('personalSMS');

        if (!smsMessage || (!bulkRadio.checked && !personalRadio.checked)) {
            alert('Please fill in all SMS fields and select SMS type');
            return;
        }

        if (bulkRadio.checked) {
            const smsNumbers = document.getElementById('smsNumbers').value.trim();
            if (!smsNumbers) {
                alert('Please enter phone numbers for bulk SMS');
                return;
            }

            const numbers = smsNumbers.split(/[\n,]/).map(num => num.trim()).filter(num => num);
            for (let number of numbers) {
                if (!isValidPhoneNumber(number)) {
                    alert(`Invalid phone number: "${number}". Please enter only numbers (minimum 8 digits).`);
                    return;
                }
            }

            messageData.message = smsMessage;
            messageData.provider = 'Bulk SMS Provider';
        } else if (personalRadio.checked) {
            const smsPersonalNumber = document.getElementById('smsPersonalNumber').value.trim();
            if (!smsPersonalNumber) {
                alert('Please enter phone number for personal SMS');
                return;
            }

            if (!isValidPhoneNumber(smsPersonalNumber)) {
                alert('Please enter a valid phone number (only numbers, minimum 8 digits)');
                return;
            }

            messageData.message = smsMessage;
            messageData.provider = 'Personal SMS Provider';
        }
    }

    messagesData.push(messageData);

    renderTable();

    const newMessageModal = bootstrap.Modal.getInstance(document.getElementById('newMessageModal'));
    newMessageModal.hide();

    showSuccessModal();
}

document.getElementById('resendBtn').addEventListener('click', handleResend);
document.getElementById('newMessageProvider').addEventListener('change', handleProviderChange);
document.getElementById('sendNewMessageBtn').addEventListener('click', handleSendNewMessage);
document.getElementById('bulkSMS').addEventListener('change', handleSMSTypeChange);
document.getElementById('personalSMS').addEventListener('change', handleSMSTypeChange);

document.getElementById('newMessageModal').addEventListener('hidden.bs.modal', function() {
    document.getElementById('newMessageProvider').value = '';
    document.getElementById('sendNewMessageBtn').style.display = 'none';
    document.getElementById('smsFields').style.display = 'none';
    document.getElementById('emailFields').style.display = 'none';
    document.getElementById('smsTypeFields').style.display = 'none';
});

renderTable();