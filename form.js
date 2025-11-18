document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('contact-form');
    if (!form) return;

    const errorOutput = document.getElementById('error-output');
    const infoOutput = document.getElementById('info-output');
    const errorsField = document.querySelector('#form-errors');
    const botField = form.querySelector('input[name="possible_bot"]');
    const messageField = document.querySelector('#message');
    const remainingEl = document.querySelector('#chars-remaining');

    const formErrors = [];

    function showError(msg) {
        if (errorOutput) {
            errorOutput.textContent = msg;
            
        }
    }

    function clearError() {
        if (errorOutput) {
            errorOutput.textContent = '';
        }
    }

    function showInfo(msg) {
        if (infoOutput) {
            infoOutput.textContent = msg;
        }
    }

    const patternFields = form.querySelectorAll('[data-allowed-pattern]');

    function triggerFlash(field) {
        field.classList.remove('flash');
        void field.offsetWidth;
        field.classList.add('flash');
    }

    patternFields.forEach((field) => {
        let previousValue = field.value;

        field.addEventListener('input', () => {
            const pattern = field.getAttribute('data-allowed-pattern');
            if (!pattern) return;

            const allowedRegex = new RegExp(pattern);
            const value = field.value;

            if (!allowedRegex.test(value)) {
                field.value = previousValue;

                triggerFlash(field);
                showError(`Invalid character entered in ${field.name}.`);

                setTimeout(() => {
                    field.classList.remove('flash');
                    clearError();
                }, 2000);
            } else {
                previousValue = value;
            }
        });
    });

    if (messageField && remainingEl) {
        const maxChars = Number(messageField.getAttribute('maxlength')) || 500;

        function updateCharCount() {
            const currentLength = messageField.value.length;
            const remaining = maxChars - currentLength;

            remainingEl.textContent = `${remaining} characters remaining`;
            remainingEl.classList.toggle('under-limit', remaining <= 250 && remaining >= 0);
            remainingEl.classList.toggle('near-limit', remaining < 100);
        }

        updateCharCount();
        messageField.addEventListener('input', updateCharCount);
    }

    if (messageField) {
        messageField.addEventListener('input', () => {
        const trimmedLength = messageField.value.trim().length;

        if (trimmedLength >= 10) {
        messageField.setCustomValidity('');
        }
    });
}


form.addEventListener('submit', (event) => {
    clearError();
    showInfo('');

    let hasErrors = false;
    const timestamp = new Date().toISOString();

    Array.from(form.elements).forEach((el) => {
        if (
            !(el instanceof HTMLInputElement ||
              el instanceof HTMLTextAreaElement ||
              el instanceof HTMLSelectElement)
        ) {
            return;
        }
        if (el.type === 'hidden' || el.disabled) return;

        el.setCustomValidity('');
    });


    Array.from(form.elements).forEach((el) => {
        if (
            !(el instanceof HTMLInputElement ||
              el instanceof HTMLTextAreaElement ||
              el instanceof HTMLSelectElement)
        ) {
            return;
        }
        if (el.type === 'hidden' || el.disabled) return;

        // Name rules
        if (el.name === 'name') {
            const nameLen = el.value.trim().length;
            if (nameLen < 2) {
                el.setCustomValidity('Please enter at least 2 characters for your name.');
            }
        }

        // Email rules
        if (el.name === 'email') {
            if (!el.validity.valid) {
                el.setCustomValidity('Please enter a valid email address.');
            }
        }

        // Message rules
        if (el.name === 'message') {
            const trimmedLength = el.value.trim().length;
            console.log('Message value:', JSON.stringify(el.value), 'trimmed length:', trimmedLength);

            if (trimmedLength < 10) {
                el.setCustomValidity('Your message should be at least 10 characters long.');
            }
        }

        if (!el.checkValidity()) {
            hasErrors = true;
            formErrors.push({
                field: el.name,
                value: el.value,
                message: el.validationMessage,
                timestamp
            });
        }
    });

    if (hasErrors) {
        event.preventDefault();
        showError('Please fix the highlighted fields before submitting.');

        if (errorsField) {
            errorsField.value = JSON.stringify(formErrors);
        }
        return;
    }

    if (errorsField) {
        errorsField.value = JSON.stringify(formErrors);
    }

    showInfo('Submitting your message…');
});

});
