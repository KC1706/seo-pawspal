  fetch('/components/navbar.html')
    .then(res => res.text())
    .then(data => {
      // Inject navbar
      document.getElementById('navbar').innerHTML = data;

      // 🔥 NOW elements exist → attach logic
      const toggle = document.querySelector('.nav-toggle');
      const navLinks = document.querySelector('.nav-links');
      const navBtn = document.getElementById('nav-btn');

      if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
          navLinks.classList.toggle('active');

          const isOpen = navLinks.classList.contains('active');

          // Toggle icon
          toggle.innerHTML = isOpen
            ? '<i class="fa-solid fa-x"></i>'
            : '<i class="fa-solid fa-bars"></i>';

          // Safe button handling
          if (navBtn) {
            navBtn.style.opacity = isOpen ? 0 : 1;
          }
        });
      }
    })
    .catch(err => console.error('Navbar load failed:', err));