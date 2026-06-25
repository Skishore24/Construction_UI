/* ==========================================================================
   BuildCon Premium Construction Company Javascript - Main / Global
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Loading Screen Fade-out
  const loader = document.getElementById("loading-screen");
  if (loader) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        loader.classList.add("fade-out");
      }, 400); // Soft buffer to let font resources render
    });
  }

  // 2. Sticky Header Scroll Effect
  const header = document.querySelector(".main-nav");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        header.style.padding = "0.75rem 1.5rem";
      } else {
        header.style.padding = "1.25rem 1.5rem";
      }
    });
  }

  // 3. Theme Toggler (Dark / Light Modes)
  const themeToggleBtn = document.getElementById("theme-toggle");
  if (themeToggleBtn) {
    const currentTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-theme", currentTheme);

    themeToggleBtn.addEventListener("click", () => {
      let theme = document.documentElement.getAttribute("data-theme");
      let newTheme = theme === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }

  // 4. Mobile Hamburger Drawer
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close menu when clicking navigation links
    document.querySelectorAll(".nav-link").forEach(link => {
      link.addEventListener("click", () => {
        if (!link.nextElementSibling) {
          hamburger.classList.remove("active");
          navMenu.classList.remove("active");
        }
      });
    });
  }

  // 5. Scroll Reveal Intersection Observer
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target); // Trigger only once
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    reveals.forEach(el => revealObserver.observe(el));
  }

  // 6. Statistics Counter Increment Simulator
  const statsNum = document.querySelectorAll(".stat-number");
  if (statsNum.length > 0) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = +entry.target.getAttribute("data-target");
          let count = 0;
          const increment = Math.ceil(target / 60); // Ease counting speed
          
          const updateCount = () => {
            count += increment;
            if (count < target) {
              entry.target.innerText = count + "+";
              setTimeout(updateCount, 25);
            } else {
              entry.target.innerText = target + "+";
            }
          };
          updateCount();
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statsNum.forEach(el => countObserver.observe(el));
  }

  // 7. Accordion Toggle Logic
  const accordions = document.querySelectorAll(".accordion-header");
  accordions.forEach(header => {
    header.addEventListener("click", () => {
      const parent = header.parentElement;
      const body = header.nextElementSibling;
      
      if (parent.classList.contains("active")) {
        parent.classList.remove("active");
        body.style.maxHeight = null;
      } else {
        // Optional: close other accordions first
        document.querySelectorAll(".accordion").forEach(acc => {
          acc.classList.remove("active");
          acc.querySelector(".accordion-body").style.maxHeight = null;
        });
        
        parent.classList.add("active");
        body.style.maxHeight = body.scrollHeight + "px";
      }
    });
  });

  // 8. Lightbox Image Gallery
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const closeBtn = document.querySelector(".lightbox-close");
  const galleryTriggers = document.querySelectorAll(".gallery-item-trigger");

  if (lightbox && lightboxImg && galleryTriggers.length > 0) {
    galleryTriggers.forEach(trigger => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const fullImgUrl = trigger.getAttribute("href");
        lightboxImg.setAttribute("src", fullImgUrl);
        lightbox.classList.add("active");
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove("active");
      lightboxImg.setAttribute("src", "");
    };

    closeBtn.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // 9. Interactive Before-After Slider Drag
  const slider = document.querySelector(".before-after-slider");
  if (slider) {
    const handle = slider.querySelector(".slider-handle");
    const afterImg = slider.querySelector(".slider-img.after");
    
    let isDragging = false;
    
    const setSliderPos = (x) => {
      const rect = slider.getBoundingClientRect();
      let pos = ((x - rect.left) / rect.width) * 100;
      if (pos < 0) pos = 0;
      if (pos > 100) pos = 100;
      
      handle.style.left = pos + "%";
      afterImg.style.width = pos + "%";
    };

    slider.addEventListener("mousedown", () => isDragging = true);
    window.addEventListener("mouseup", () => isDragging = false);
    
    slider.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      setSliderPos(e.clientX);
    });

    // Touch support
    slider.addEventListener("touchstart", () => isDragging = true);
    window.addEventListener("touchend", () => isDragging = false);
    slider.addEventListener("touchmove", (e) => {
      if (!isDragging) return;
      setSliderPos(e.touches[0].clientX);
    });
  }
});
