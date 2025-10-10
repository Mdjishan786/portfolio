const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.navbar a');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.id;
    const link = document.querySelector(`.navbar a[href="#${id}"]`);

    if (entry.isIntersecting) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}, { threshold: 0.5 });

sections.forEach(section => {
  observer.observe(section);
});





document.getElementById('contact-form').addEventListener('submit', function(e) {
  const button = this.querySelector('.submit-btn');
  // Change UI to show loading state
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  button.disabled = true;

  // Allow the form to continue (for mailto), or if you intercept, you can fallback

  // After a delay (just for UI), restore the button if needed
  setTimeout(() => {
    button.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    button.disabled = false;
  }, 3000);
});

