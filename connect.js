document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const connectSection = document.getElementById('contact');
  const cards = document.querySelectorAll('.connect-card-gravity');
  const tooltip = document.getElementById('connect-tooltip');
  const toastContainer = document.getElementById('connect-toast-container');
  const waBtn = document.querySelector('.whatsapp-floating-btn');

  // --- 1. AMBIENT ENVIRONMENT (ORBS & PARTICLES) ---
  const orbsContainer = document.getElementById('connect-orbs-container');
  const particlesContainer = document.getElementById('connect-particles-container');

  if (orbsContainer && !prefersReducedMotion) {
    // Generate floating orbs
    for (let i = 0; i < 3; i++) {
      const orb = document.createElement('div');
      orb.className = 'connect-orb';
      orb.style.left = `${Math.random() * 80 + 10}%`;
      orb.style.top = `${Math.random() * 80 + 10}%`;
      orbsContainer.appendChild(orb);

      // Animate orb floating
      gsap.to(orb, {
        x: () => Math.random() * 100 - 50,
        y: () => Math.random() * 100 - 50,
        duration: () => 15 + Math.random() * 10,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }

  if (particlesContainer && !prefersReducedMotion) {
    // Generate fine particles
    for (let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      p.className = 'connect-particle';
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.opacity = Math.random() * 0.5 + 0.2;
      particlesContainer.appendChild(p);

      // Float particle
      gsap.to(p, {
        y: () => `-=${50 + Math.random() * 100}`,
        x: () => `+=${Math.random() * 40 - 20}`,
        duration: () => 6 + Math.random() * 6,
        repeat: -1,
        ease: "none",
        onRepeat: () => {
          p.style.top = '100%';
          p.style.left = `${Math.random() * 100}%`;
        }
      });
    }
  }

  // --- 2. ANTI-GRAVITY DRIFTING ON CARDS ---
  const cardFloatTimelines = [];

  if (!prefersReducedMotion) {
    cards.forEach((card, idx) => {
      // Create independent drifting timelines for each card
      const tl = gsap.timeline({ repeat: -1, yoyo: true });
      const delay = idx * 0.4;
      
      tl.to(card, {
        y: "random(-12, 12)",
        rotationZ: "random(-1.5, 1.5)",
        rotationY: "random(-2, 2)",
        rotationX: "random(-2, 2)",
        duration: () => 5 + Math.random() * 3,
        ease: "sine.inOut"
      }, delay);
      
      cardFloatTimelines.push(tl);
    });
  }

  // --- 3. CURSOR CARD INTERACTIONS (tilt, spotlight, magnet) ---
  if (!prefersReducedMotion && window.innerWidth > 1024) {
    cards.forEach(card => {
      const content = card.querySelector('.connect-card-content');
      const icon = card.querySelector('.connect-brand-icon');
      const button = card.querySelector('.btn-connect-gravity');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Update spotlight position CSS variables
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // Calculate normalized tilt offsets (-0.5 to 0.5)
        const tiltX = (y / rect.height - 0.5) * 2;
        const tiltY = (x / rect.width - 0.5) * 2;

        // Apply 3D tilt & dynamic translation towards cursor (attraction)
        gsap.to(card, {
          rotateX: -tiltX * 12,
          rotateY: tiltY * 12,
          x: tiltY * 15,
          y: tiltX * 15,
          transformPerspective: 1000,
          boxShadow: `0 45px 90px rgba(37, 99, 235, 0.25)`,
          duration: 0.3,
          ease: "power2.out"
        });

        // Lift child content
        if (content) {
          gsap.to(content, {
            z: 40,
            duration: 0.3
          });
        }

        // Scale and spin icon slightly
        if (icon) {
          gsap.to(icon, {
            scale: 1.15,
            rotate: 15,
            duration: 0.4,
            ease: "back.out(1.7)"
          });
        }

        // Magnetically attract button
        if (button) {
          const btnRect = button.getBoundingClientRect();
          const btnX = e.clientX - (btnRect.left + btnRect.width / 2);
          const btnY = e.clientY - (btnRect.top + btnRect.height / 2);
          gsap.to(button, {
            x: btnX * 0.25,
            y: btnY * 0.25,
            duration: 0.3,
            ease: "power2.out"
          });
        }
      });

      card.addEventListener('mouseleave', () => {
        // Reset card elements smoothly back to normal values
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          x: 0,
          y: 0,
          boxShadow: "0 30px 70px rgba(0, 0, 0, 0.6)",
          duration: 0.8,
          ease: "elastic.out(1, 0.6)"
        });

        if (content) {
          gsap.to(content, {
            z: 30,
            duration: 0.6
          });
        }

        if (icon) {
          gsap.to(icon, {
            scale: 1,
            rotate: 0,
            duration: 0.6,
            ease: "power2.out"
          });
        }

        if (button) {
          gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.6)"
          });
        }
      });
    });
  }

  // --- 4. MAGNETIC WHATSAPP BUTTON ---
  if (waBtn && !prefersReducedMotion && window.innerWidth > 768) {
    waBtn.addEventListener('mousemove', (e) => {
      const rect = waBtn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      
      gsap.to(waBtn, {
        x: x * 0.4,
        y: y * 0.4,
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out"
      });
    });

    waBtn.addEventListener('mouseleave', () => {
      gsap.to(waBtn, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: "elastic.out(1, 0.6)"
      });
    });
  }

  // --- 5. CLIPBOARD COPY LOGIC & CUSTOM SLIDE-UP TOASTS ---
  const copyEmailBtnAction = document.getElementById('copy-email-action-btn');
  const copyPhoneBtnAction = document.getElementById('copy-phone-action-btn');

  const triggerToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'connect-toast-item';
    toast.innerHTML = `<span>✓</span><span>${message}</span>`;
    toastContainer.appendChild(toast);

    // Fade and slide out after 2 seconds
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 2000);
  };

  if (copyEmailBtnAction) {
    copyEmailBtnAction.addEventListener('click', (e) => {
      e.preventDefault();
      const emailText = document.getElementById('email-value').innerText;
      navigator.clipboard.writeText(emailText).then(() => {
        triggerToast("Email Copied");
      });
    });
  }

  if (copyPhoneBtnAction) {
    copyPhoneBtnAction.addEventListener('click', (e) => {
      e.preventDefault();
      const phoneText = document.getElementById('phone-value').innerText.replace(/\s+/g, '');
      navigator.clipboard.writeText(phoneText).then(() => {
        triggerToast("Phone Number Copied");
      });
    });
  }

  // --- 6. PREMIUM TOOLTIP HANDLER ---
  const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
  
  if (tooltip && window.innerWidth > 768) {
    tooltipTriggers.forEach(trigger => {
      trigger.addEventListener('mouseenter', () => {
        const text = trigger.getAttribute('data-tooltip');
        tooltip.innerText = text;
        tooltip.classList.add('visible');
      });

      trigger.addEventListener('mousemove', (e) => {
        const tooltipWidth = tooltip.offsetWidth;
        let left = e.clientX;
        let top = e.clientY - 15;

        // Keep tooltip inside screen boundaries
        if (left + tooltipWidth / 2 > window.innerWidth) {
          left = window.innerWidth - tooltipWidth / 2 - 10;
        } else if (left - tooltipWidth / 2 < 0) {
          left = tooltipWidth / 2 + 10;
        }

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;
      });

      trigger.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
      });
    });
  }

  // --- 7. VIEWPORT ENTRANCE SCROLL ANIMATION ---
  if (connectSection) {
    gsap.fromTo('#contact .section-title, #contact .section-subtitle', {
      opacity: 0,
      y: 50,
      filter: "blur(10px)"
    }, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 1,
      stagger: 0.2,
      scrollTrigger: {
        trigger: connectSection,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    cards.forEach((card, idx) => {
      const content = card.querySelector('.connect-card-content');
      const border = card.querySelector('.connect-card-border-glow');

      // Initial card reveal
      gsap.fromTo(card, {
        opacity: 0,
        y: 80,
        scale: 0.9,
        filter: "blur(8px)"
      }, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "back.out(1.2)",
        delay: idx * 0.15,
        scrollTrigger: {
          trigger: connectSection,
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      });
    });
  }
});
