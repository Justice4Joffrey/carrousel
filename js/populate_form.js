(function () {
    const MAX_RETRIES = 240; // 2 minutes (240 retries every 500ms)
    const RETRY_INTERVAL = 500; // 500ms interval
    let retries = 0;

    const populateForm = (savedInfo) => {
        try {
            console.log("Attempting to populate the form...");

            // Helper function to set values for input fields
            const setValue = (id, value) => {
                const field = document.getElementById(id);
                if (field) {
                    field.value = value || '';
                    field.dispatchEvent(new Event('input', { bubbles: true })); // Trigger input event
                    return true;
                }
                return false;
            };

            // Helper function to check a checkbox
            const setCheckbox = (id, checked = true) => {
                const checkbox = document.getElementById(id);
                if (checkbox) {
                    checkbox.checked = checked;
                    checkbox.dispatchEvent(new Event('change', { bubbles: true })); // Trigger change event
                    return true;
                }
                return false;
            };

            // Populate form fields
            const formFilled = [
                setValue('surname', savedInfo.lastName),
                setValue('name', savedInfo.firstName),
                setValue('phone_country', savedInfo.phoneRegion),
                setValue('phone_number', savedInfo.phoneNumber),
                setValue('email', savedInfo.email),
                setValue('passport_id', savedInfo.passportNumber),
                setCheckbox('cgu'), // Terms and Conditions
                setCheckbox('processing') // Data Processing Consent
            ].every(Boolean);

            if (formFilled) {
                console.log("Form populated successfully!");
                return true;
            }

            console.log("Form elements not yet available.");
            return false;
        } catch (error) {
            console.error("Error populating form:", error);
            return false;
        }
    };

    const startPolling = (savedInfo) => {
        const interval = setInterval(() => {
            if (populateForm(savedInfo)) {
                clearInterval(interval); // Stop polling on success
            } else if (++retries >= MAX_RETRIES) {
                console.error("Failed to populate the form within the timeout period.");
                clearInterval(interval);
            }
        }, RETRY_INTERVAL);
    };

    // Fetch `personInfo` from chrome.storage.local
    chrome.storage.local.get('personInfo', (result) => {
        if (result.personInfo) {
            console.log("Retrieved personInfo:", result.personInfo);
            startPolling(result.personInfo);
        } else {
            console.error("No personInfo found in chrome.storage.local.");
        }
    });
})();