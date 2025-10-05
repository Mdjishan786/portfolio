// ===== CONTACT FORM HANDLER =====
class ContactForm {
  constructor(formSelector) {
    this.form = document.querySelector(formSelector);
    if (!this.form) {
      console.error('Contact form not found');
      return;
    }
    
    this.nameInput = this.form.querySelector('#name');
    this.emailInput = this.form.querySelector('#email');
    this.messageInput = this.form.querySelector('#message');
    this.submitBtn = this.form.querySelector('.submit-btn');
    this.originalBtnText = this.submitBtn.textContent;
    
    this.init();
  }
  
  init() {
    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Real-time validation
    this.nameInput.addEventListener('blur', () => this.validateName());
    this.emailInput.addEventListener('blur', () => this.validateEmail());
    this.messageInput.addEventListener('blur', () => this.validateMessage());
    
    // Remove error on input
    [this.nameInput, this.emailInput, this.messageInput].forEach(input => {
      input.addEventListener('input', () => this.clearError(input));
    });
    
    // Character counter for message
    this.addCharacterCounter();
    
    // Auto-resize textarea
    this.autoResizeTextarea();
  }
  
  // ===== VALIDATION METHODS =====
  validateName() {
    const name = this.nameInput.value.trim();
    
    if (!name) {
      this.showError(this.nameInput, 'Name is required');
      return false;
    }
    
    if (name.length < 2) {
      this.showError(this.nameInput, 'Name must be at least 2 characters');
      return false;
    }
    
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      this.showError(this.nameInput, 'Name can only contain letters');
      return false;
    }
    
    this.clearError(this.nameInput);
    return true;
  }
  
  validateEmail() {
    const email = this.emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      this.showError(this.emailInput, 'Email is required');
      return false;
    }
    
    if (!emailRegex.test(email)) {
      this.showError(this.emailInput, 'Please enter a valid email address');
      return false;
    }
    
    this.clearError(this.emailInput);
    return true;
  }
  
  validateMessage() {
    const message = this.messageInput.value.trim();
    
    if (!message) {
      this.showError(this.messageInput, 'Message is required');
      return false;
    }
    
    if (message.length < 10) {
      this.showError(this.messageInput, 'Message must be at least 10 characters');
      return false;
    }
    
    if (message.length > 1000) {
      this.showError(this.messageInput, 'Message must not exceed 1000 characters');
      return false;
    }
    
    this.clearError(this.messageInput);
    return true;
  }
  
  validateForm() {
    const isNameValid = this.validateName();
    const isEmailValid = this.validateEmail();
    const isMessageValid = this.validateMessage();
    
    return isNameValid && isEmailValid && isMessageValid;
  }
  
  // ===== ERROR HANDLING =====
  showError(input, message) {
    this.clearError(input);
    
    input.classList.add('error');
    
    const errorDiv = document.createElement('span');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    input.parentElement.insertBefore(errorDiv, input.nextSibling);
    
    // Add shake animation
    input.style.animation = 'none';
    setTimeout(() => {
      input.style.animation = '';
    }, 10);
  }
  
  clearError(input) {
    input.classList.remove('error');
    
    const errorMessage = input.parentElement.querySelector('.error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }
  
  // ===== FORM SUBMISSION =====
  async handleSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!this.validateForm()) {
      this.showNotification('Please fix the errors before submitting', 'error');
      return;
    }
    
    // Disable button and show loading
    this.setLoadingState(true);
    
    try {
      // Get form data
      const formData = new FormData(this.form);
      
      // Submit to Formspree
      const response = await fetch(this.form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        this.handleSuccess();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Submission failed');
      }
    } catch (error) {
      this.handleError(error);
    } finally {
      this.setLoadingState(false);
    }
  }
  
  handleSuccess() {
    // Clear form
    this.form.reset();
    
    // Clear any existing errors
    [this.nameInput, this.emailInput, this.messageInput].forEach(input => {
      this.clearError(input);
    });
    
    // Show success message
    this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
    
    // Analytics tracking (if you have Google Analytics)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'form_submission', {
        'event_category': 'Contact',
        'event_label': 'Contact Form'
      });
    }
    
    // Confetti effect (optional)
    this.celebrateSubmission();
  }
  
  handleError(error) {
    console.error('Form submission error:', error);
    this.showNotification(
      'Oops! Something went wrong. Please try again or email me directly.',
      'error'
    );
  }
  
  // ===== UI HELPERS =====
  setLoadingState(isLoading) {
    if (isLoading) {
      this.submitBtn.disabled = true;
      this.submitBtn.classList.add('loading');
      this.submitBtn.textContent = 'Sending...';
    } else {
      this.submitBtn.disabled = false;
      this.submitBtn.classList.remove('loading');
      this.submitBtn.textContent = this.originalBtnText;
    }
  }
  
  showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotif = this.form.querySelector('.success-message, .error-notification');
    if (existingNotif) {
      existingNotif.remove();
    }
    
    const notifDiv = document.createElement('div');
    notifDiv.className = type === 'success' ? 'success-message' : 'error-notification';
    notifDiv.textContent = message;
    
    if (type === 'error') {
      notifDiv.style.background = 'rgba(255, 68, 68, 0.1)';
      notifDiv.style.borderColor = '#ff4444';
      notifDiv.style.color = '#ff4444';
    }
    
    this.form.appendChild(notifDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      notifDiv.classList.add('hide');
      setTimeout(() => notifDiv.remove(), 500);
    }, 5000);
  }
  
  // ===== ENHANCED FEATURES =====
  addCharacterCounter() {
    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.style.cssText = `
      font-size: 0.85rem;
      color: #888;
      text-align: right;
      margin-top: -15px;
    `;
    
    this.messageInput.parentElement.appendChild(counter);
    
    const updateCounter = () => {
      const length = this.messageInput.value.length;
      const maxLength = 1000;
      counter.textContent = `${length} / ${maxLength} characters`;
      
      if (length > maxLength) {
        counter.style.color = '#ff4444';
      } else if (length > maxLength * 0.9) {
        counter.style.color = '#ffaa00';
      } else {
        counter.style.color = '#888';
      }
    };
    
    this.messageInput.addEventListener('input', updateCounter);
    updateCounter();
  }
  
  autoResizeTextarea() {
    this.messageInput.addEventListener('input', () => {
      this.messageInput.style.height = 'auto';
      this.messageInput.style.height = this.messageInput.scrollHeight + 'px';
    });
  }
  
  celebrateSubmission() {
    // Simple confetti effect using DOM elements
    const colors = ['#00fff0', '#ff61d2', '#fff'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        left: ${Math.random() * 100}%;
        top: -10px;
        opacity: 1;
        pointer-events: none;
        z-index: 10000;
        border-radius: 50%;
      `;
      
      document.body.appendChild(confetti);
      
      const angle = Math.random() * Math.PI * 2;
      const velocity = 2 + Math.random() * 4;
      const duration = 1000 + Math.random() * 1000;
      
      confetti.animate([
        { 
          transform: 'translate(0, 0) rotate(0deg)',
          opacity: 1
        },
        { 
          transform: `translate(${Math.cos(angle) * 100}px, ${window.innerHeight}px) rotate(${360 * (Math.random() * 2 - 1)}deg)`,
          opacity: 0
        }
      ], {
        duration: duration,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      }).onfinish = () => confetti.remove();
    }
  }
}

// ===== INITIALIZE =====
// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactForm);
} else {
  initContactForm();
}

function initContactForm() {
  const contactForm = new ContactForm('.contact-form');
}

// ===== SMOOTH SCROLL TO CONTACT (OPTIONAL) =====
// Add this if you have a navigation link to the contact section
document.querySelectorAll('a[href="#contact"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector('#contact').scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  });
});
