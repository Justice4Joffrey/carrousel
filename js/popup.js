document.addEventListener('DOMContentLoaded', () => {
    const configureButton = document.getElementById('configure');
    const form = document.getElementById('personForm');
    const spinButton = document.getElementById('spin');
    const saveButton = document.getElementById('save');
    const statusElement = document.getElementById('status');

    const requiredFields = ['firstName', 'lastName', 'email', 'phoneRegion', 'phoneNumber', 'passportNumber'];

    let initialFormData = null;

    // Helper: Retrieve current form data
    const getFormData = () => {
        const data = {};
        requiredFields.forEach(id => {
            const field = document.getElementById(id);
            data[id] = field ? field.value.trim() : '';
        });
        return data;
    };

    // Helper: Compare two objects to check if form data is dirty
    const isFormDirty = (data1, data2) => {
        return requiredFields.some(key => data1[key] !== data2[key]);
    };

    // Helper: Validate if all required fields are filled
    const isFormComplete = () => {
        return requiredFields.every(id => {
            const field = document.getElementById(id);
            return field && field.value.trim() !== '';
        });
    };

    // Enable or disable the "Spin" button based on form state
    const updateSpinButtonState = () => {
        const currentFormData = getFormData();
        spinButton.disabled = !isFormComplete() || isFormDirty(currentFormData, initialFormData);
    };

    // Save form data and update initialFormData
    saveButton.addEventListener('click', () => {
        const personInfo = getFormData();

        // Save to chrome.storage.local
        chrome.storage.local.set({ personInfo }, () => {
            console.log("Person info saved:", personInfo);
        });

        // Update initial form state
        initialFormData = { ...personInfo };

        // Provide feedback to the user
        statusElement.textContent = 'Information saved successfully!';
        setTimeout(() => {
            statusElement.textContent = '';
        }, 3000);

        // Update "Spin" button state
        updateSpinButtonState();
    });

    // Load saved data when the popup is opened
    chrome.storage.local.get('personInfo', (result) => {
        if (result.personInfo) {
            initialFormData = { ...result.personInfo };

            // Populate form fields with saved data
            requiredFields.forEach(id => {
                const field = document.getElementById(id);
                if (field) {
                    field.value = result.personInfo[id] || '';
                }
            });
        } else {
            // No saved data, initialize an empty form state
            initialFormData = getFormData();
        }

        // Initial "Spin" button state
        updateSpinButtonState();
    });

    // Toggle the visibility of the form
    configureButton.addEventListener('click', () => {
        form.style.display = form.style.display === 'none' ? 'block' : 'none';
    });

    // Listen for input changes and update the "Spin" button state
    form.addEventListener('input', updateSpinButtonState);

    // Open the target URL when the "Spin" button is clicked
    spinButton.addEventListener('click', () => {
        chrome.tabs.create({ url: 'https://rendezvousparis.hermes.com/client/register' });
    });
});