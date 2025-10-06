// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ===== HIGHLIGHT ACTIVE NAV LINK =====
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.navbar a');

window.addEventListener('scroll', () => {
  let current = 'home'; // Default section

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    // We check if the scroll position is past the top of the section minus a buffer
    if (window.scrollY >= sectionTop - 100) { 
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// ===== CONTACT FORM INTERACTIVITY (New Code for glow effect) =====
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('.form-container input, .form-container textarea');
    
    inputs.forEach(input => {
        // Apply focus style on focus
        input.addEventListener('focus', () => {
            // Apply a subtle shadow/glow to match the theme
            input.style.borderColor = '#ff4081'; // Pink accent color
            input.style.boxShadow = '0 0 5px rgba(255, 64, 129, 0.5)';
        });
        
        // Remove style on blur
        input.addEventListener('blur', () => {
            // Revert to original style defined in CSS
            input.style.borderColor = '#444'; 
            input.style.boxShadow = 'none';
        });
    });
});
