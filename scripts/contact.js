// Contact Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initMapButton();
    initFormValidation();
});

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = form.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Show loading state
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                // Reset form
                form.reset();
                
                // Hide loading state
                btnText.style.display = 'inline';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
                
                // Show success message
                showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
                
                // Track form submission (analytics)
                trackFormSubmission();
            }, 2000);
        }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Form validation
function validateForm() {
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    // Validate email format
    const emailField = form.querySelector('#email');
    if (emailField.value && !isValidEmail(emailField.value)) {
        showFieldError(emailField, 'Please enter a valid email address');
        isValid = false;
    }

    // Validate phone format (if provided)
    const phoneField = form.querySelector('#phone');
    if (phoneField.value && !isValidPhone(phoneField.value)) {
        showFieldError(phoneField, 'Please enter a valid phone number');
        isValid = false;
    }

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Clear any existing errors
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#e74c3c';
}

function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.style.borderColor = '';
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Map button functionality
function initMapButton() {
    const mapBtn = document.querySelector('.map-btn');
    if (mapBtn) {
        mapBtn.addEventListener('click', function() {
            // Open Google Maps with our location
            const address = '123 Innovation Drive, Singapore 123456';
            const encodedAddress = encodeURIComponent(address);
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
            
            window.open(mapsUrl, '_blank');
        });
    }
}

// Form validation initialization
function initFormValidation() {
    // Add custom validation for specific fields
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('input', function() {
            // Format phone number as user types
            let value = this.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = value;
                } else if (value.length <= 6) {
                    value = value.slice(0, 3) + '-' + value.slice(3);
                } else {
                    value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6, 10);
                }
            }
            this.value = value;
        });
    }

    // Character counter for message field
    const messageField = document.getElementById('message');
    if (messageField) {
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.fontSize = '0.75rem';
        counter.style.color = '#666';
        counter.style.textAlign = 'right';
        counter.style.marginTop = '0.25rem';
        
        messageField.parentNode.appendChild(counter);
        
        function updateCounter() {
            const count = messageField.value.length;
            const maxLength = 1000;
            counter.textContent = `${count}/${maxLength} characters`;
            
            if (count > maxLength * 0.9) {
                counter.style.color = '#e74c3c';
            } else if (count > maxLength * 0.7) {
                counter.style.color = '#f39c12';
            } else {
                counter.style.color = '#666';
            }
        }
        
        messageField.addEventListener('input', updateCounter);
        updateCounter();
    }
}

// Analytics tracking
function trackFormSubmission() {
    // Track form submission in analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
            'event_category': 'contact',
            'event_label': 'contact_form'
        });
    }
    
    // Track in localStorage for demo purposes
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    submissions.push({
        timestamp: new Date().toISOString(),
        source: 'contact_form'
    });
    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
}

// Auto-save form data
function initAutoSave() {
    const form = document.getElementById('contactForm');
    const formData = JSON.parse(localStorage.getItem('contactFormData') || '{}');
    
    // Load saved data
    Object.keys(formData).forEach(key => {
        const field = form.querySelector(`[name="${key}"]`);
        if (field && field.type !== 'submit') {
            field.value = formData[key];
        }
    });
    
    // Save data as user types
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const currentData = JSON.parse(localStorage.getItem('contactFormData') || '{}');
            currentData[this.name] = this.value;
            localStorage.setItem('contactFormData', JSON.stringify(currentData));
        });
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        localStorage.removeItem('contactFormData');
    });
}

// Initialize auto-save
initAutoSave();

// Accessibility improvements
function initAccessibility() {
    // Add ARIA labels and descriptions
    const form = document.getElementById('contactForm');
    const fields = form.querySelectorAll('input, textarea, select');
    
    fields.forEach(field => {
        const label = form.querySelector(`label[for="${field.id}"]`);
        if (label) {
            field.setAttribute('aria-labelledby', label.id);
        }
        
        // Add error message association
        field.addEventListener('invalid', function() {
            this.setAttribute('aria-invalid', 'true');
        });
        
        field.addEventListener('input', function() {
            this.setAttribute('aria-invalid', 'false');
        });
    });
}

// Initialize accessibility
initAccessibility();

// Form analytics and insights
function getFormAnalytics() {
    const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    const formData = JSON.parse(localStorage.getItem('contactFormData') || '{}');
    
    return {
        totalSubmissions: submissions.length,
        lastSubmission: submissions[submissions.length - 1]?.timestamp,
        savedFormData: Object.keys(formData).length > 0,
        popularSubjects: getPopularSubjects()
    };
}

function getPopularSubjects() {
    // This would typically come from a backend database
    // For demo purposes, we'll return mock data
    return [
        { subject: 'General Inquiry', count: 45 },
        { subject: 'Event Registration', count: 32 },
        { subject: 'Partnership Opportunities', count: 18 },
        { subject: 'Feedback & Suggestions', count: 15 },
        { subject: 'Technical Support', count: 12 }
    ];
}

// Export analytics for admin use
window.getFormAnalytics = getFormAnalytics; 