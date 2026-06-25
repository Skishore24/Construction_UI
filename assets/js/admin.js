/* ==========================================================================
   BuildCon Premium Construction Company Javascript - Admin Panel
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Interactive Modals (Add Project)
  const openModalBtn = document.getElementById("open-add-modal");
  const modal = document.getElementById("admin-add-modal");
  const closeModalBtn = document.querySelector(".modal-close");

  if (openModalBtn && modal) {
    openModalBtn.addEventListener("click", () => {
      modal.classList.add("active");
    });

    const closeModal = () => {
      modal.classList.remove("active");
    };

    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", closeModal);
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // 2. Table Row Search Filter
  const searchInput = document.getElementById("admin-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const filter = searchInput.value.toLowerCase();
      const rows = document.querySelectorAll(".admin-table tbody tr");
      
      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(filter)) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    });
  }

  // 3. Row Deletion Simulator Trigger
  const deleteButtons = document.querySelectorAll(".action-btn-delete");
  deleteButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const row = btn.closest("tr");
      if (row) {
        if (confirm("Are you sure you want to remove this ledger record from operations database?")) {
          row.style.transition = "all 0.4s ease";
          row.style.opacity = "0";
          row.style.transform = "translateX(20px)";
          setTimeout(() => {
            row.remove();
          }, 400);
        }
      }
    });
  });

  // 4. Dynamic SVG Chart Drawing Path recalculator
  const chartPath = document.querySelector(".chart-line");
  if (chartPath) {
    // Reset path animation on viewport interaction
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          chartPath.style.animation = "none";
          chartPath.offsetHeight; // Trigger reflow
          chartPath.style.animation = "drawLine 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards";
        }
      });
    }, { threshold: 0.2 });
    
    observer.observe(chartPath.closest(".admin-chart-card"));
  }

  // 5. Calendar Day Highlighting and Event simulator
  const calendarDays = document.querySelectorAll(".calendar-day");
  calendarDays.forEach(day => {
    day.addEventListener("click", () => {
      if (!day.innerText) return;
      
      // Remove selected focus from others
      calendarDays.forEach(d => d.style.borderColor = "transparent");
      
      day.style.borderColor = "var(--primary)";
      
      if (day.classList.contains("event")) {
        alert(`Inspection Scheduled: Site supervisor status logs scheduled for Day ${day.innerText}.`);
      } else {
        const createEvent = confirm(`No site inspections scheduled on Day ${day.innerText}. Add new coordinate inspection?`);
        if (createEvent) {
          day.classList.add("event");
        }
      }
    });
  });
});
