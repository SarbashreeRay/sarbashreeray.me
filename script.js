document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Theme Toggle (Dark / Light Mode)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  // Retrieve saved theme preference, default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark-theme';
  body.className = savedTheme;

  themeToggleBtn.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
      body.className = 'light-theme';
      localStorage.setItem('portfolio-theme', 'light-theme');
    } else {
      body.className = 'dark-theme';
      localStorage.setItem('portfolio-theme', 'dark-theme');
    }
  });

  // ==========================================================================
  // 2. Mobile Menu Toggle
  // ==========================================================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navbar = document.getElementById('navbar');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  mobileToggle.addEventListener('click', () => {
    navbar.classList.toggle('menu-open');
    const icon = mobileToggle.querySelector('i');
    if (navbar.classList.contains('menu-open')) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navbar.classList.contains('menu-open')) {
        navbar.classList.remove('menu-open');
        mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
      }
    });
  });

  // ==========================================================================
  // 3. Active Link Tracking on Scroll (Intersection Observer)
  // ==========================================================================
  const sections = document.querySelectorAll('section[id]');
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Trigger when section occupies the sweet spot
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));

  // ==========================================================================
  // 4. Skills Section Tab Switching
  // ==========================================================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTabId = button.getAttribute('data-tab');

      // Update active button state
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      // Update visible tab pane state
      tabPanes.forEach(pane => {
        if (pane.getAttribute('id') === targetTabId) {
          pane.classList.add('active');
          
          // Re-trigger progress bar animations when tab opens
          const progressBars = pane.querySelectorAll('.progress-bar');
          progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
              bar.style.width = width;
            }, 50);
          });
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });

  // ==========================================================================
  // 5. Interactive SVG Neural Network Globe (Cursor Hover Effects)
  // ==========================================================================
  const aiCoreSvg = document.getElementById('ai-core');
  const nodes = document.querySelectorAll('.network-nodes .node');
  const lines = document.querySelectorAll('.network-lines line');

  // Interactive node shifting on mouse movement
  aiCoreSvg.addEventListener('mousemove', (e) => {
    const rect = aiCoreSvg.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2; // relative to center
    const y = e.clientY - rect.top - rect.height / 2;

    nodes.forEach((node, index) => {
      if (node.classList.contains('core-node')) return; // Keep core steady
      
      const factor = (index % 3 + 1) * 0.05; // Different wiggles per node index
      const dx = x * factor;
      const dy = y * factor;
      node.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    lines.forEach((line) => {
      line.style.opacity = '0.65'; // Brighten connections on hover
    });
  });

  aiCoreSvg.addEventListener('mouseleave', () => {
    // Reset positions
    nodes.forEach(node => {
      node.style.transform = 'translate(0px, 0px)';
    });
    lines.forEach(line => {
      line.style.opacity = '0.3';
    });
  });

  // ==========================================================================
  // 6. Contact Form Validation & Submission Feedback
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.className = 'form-status';
    formStatus.textContent = 'Sending message...';

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      formStatus.classList.add('error');
      formStatus.textContent = 'Please fill out all required fields.';
      return;
    }

    // Fake successful submission
    setTimeout(() => {
      formStatus.classList.add('success');
      formStatus.textContent = 'Thank you! Your message was sent successfully.';
      contactForm.reset();
    }, 1200);
  });
});
