/* ==========================================================================
   BuildCon Premium Construction Company Javascript - Admin Panel
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. DYNAMIC DOM PREPROCESSING FOR UNIFIED CRUD
  const tables = document.querySelectorAll(".admin-table");
  
  tables.forEach(table => {
    const theadTr = table.querySelector("thead tr");
    if (!theadTr) return;
    
    // Check if Controls/Actions column exists
    const ths = Array.from(theadTr.querySelectorAll("th"));
    const hasControls = ths.some(th => {
      const txt = th.innerText.toLowerCase();
      return txt === "controls" || txt === "actions";
    });
    
    if (!hasControls) {
      // Add Controls header
      const th = document.createElement("th");
      th.innerText = "Controls";
      th.style.width = "130px";
      theadTr.appendChild(th);
      
      // Add action button cells to existing rows
      const rows = table.querySelectorAll("tbody tr");
      rows.forEach(row => {
        const td = document.createElement("td");
        td.innerHTML = `
          <div class="actions-btn-group">
            <button class="action-btn action-btn-edit" title="Edit Record"><i class="fas fa-edit"></i></button>
            <button class="action-btn action-btn-delete" title="Delete Record"><i class="fas fa-trash-alt"></i></button>
          </div>
        `;
        row.appendChild(td);
      });
    }
  });

  // Automatically wrap search bar and inject a "Launch New" button if missing
  const existingAddBtn = document.getElementById("open-add-modal") || document.querySelector(".btn-primary[id*='add']") || document.querySelector(".btn-primary[id*='project']");
  if (!existingAddBtn && tables.length > 0) {
    const searchInputEl = document.getElementById("admin-search-input") || document.querySelector("input[placeholder*='Search']");
    const searchDiv = searchInputEl?.closest(".panel-search");
    
    if (searchDiv) {
      const parent = searchDiv.parentElement;
      const flexWrapper = document.createElement("div");
      flexWrapper.className = "panel-actions";
      flexWrapper.style.display = "flex";
      flexWrapper.style.justifyContent = "space-between";
      flexWrapper.style.alignItems = "center";
      flexWrapper.style.marginBottom = "1.5rem";
      flexWrapper.style.flexWrap = "wrap";
      flexWrapper.style.gap = "1rem";
      flexWrapper.style.width = "100%";
      
      parent.replaceChild(flexWrapper, searchDiv);
      flexWrapper.appendChild(searchDiv);
      searchDiv.style.marginBottom = "0";
      
      const newAddBtn = document.createElement("button");
      newAddBtn.className = "btn btn-primary btn-sm";
      newAddBtn.id = "open-add-modal";
      newAddBtn.innerHTML = `<i class="fas fa-plus"></i> Launch New Entry`;
      flexWrapper.appendChild(newAddBtn);
    }
  }

  // Inject Dynamic CRUD Modal into the body if it doesn't exist
  if (!document.getElementById("dynamic-crud-modal")) {
    const modalHTML = `
      <div class="modal" id="dynamic-crud-modal">
        <div class="modal-content" style="max-width: 500px; padding: 2.5rem;">
          <span class="modal-close" id="dynamic-crud-close"><i class="fas fa-times"></i></span>
          <h3 id="dynamic-crud-title" style="font-family: var(--font-ui); font-weight: 800; color: var(--text-primary); margin-bottom: 1.5rem;">Edit Record</h3>
          <form id="dynamic-crud-form" style="display: flex; flex-direction: column; gap: 1.25rem;">
            <div id="dynamic-crud-fields" style="display: flex; flex-direction: column; gap: 1.25rem;"></div>
            <button type="submit" class="btn btn-primary w-full" style="margin-top: 0.5rem;">Save Changes</button>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
  }

  const crudModal = document.getElementById("dynamic-crud-modal");
  const crudClose = document.getElementById("dynamic-crud-close");
  const crudTitle = document.getElementById("dynamic-crud-title");
  const crudForm = document.getElementById("dynamic-crud-form");
  const crudFields = document.getElementById("dynamic-crud-fields");
  
  let activeTable = null;
  let activeRow = null; // null if adding new row
  
  // Helper to open modal
  const openCrudModal = (title, row = null, table = null) => {
    activeRow = row;
    activeTable = table;
    crudTitle.innerText = title;
    crudFields.innerHTML = "";
    
    // Get table headers
    const ths = Array.from(table.querySelectorAll("thead th"));
    const cells = row ? Array.from(row.querySelectorAll("td")) : [];
    
    ths.forEach((th, idx) => {
      const headerText = th.innerText.trim();
      const lowerHeader = headerText.toLowerCase();
      
      // Skip controls/actions
      if (lowerHeader === "controls" || lowerHeader === "actions") return;
      
      const formGroup = document.createElement("div");
      formGroup.className = "form-group";
      
      const label = document.createElement("label");
      label.className = "form-label";
      label.innerText = headerText;
      
      let inputElement;
      const initialValue = row ? cells[idx].innerText.trim() : "";
      
      // If status column, show select dropdown
      if (lowerHeader.includes("status")) {
        inputElement = document.createElement("select");
        inputElement.className = "form-input";
        inputElement.style.height = "48px";
        
        const statuses = ["Active", "Pending", "Completed", "Reviewing", "On Hold", "Approved", "Rejected"];
        let matched = false;
        statuses.forEach(status => {
          const opt = document.createElement("option");
          opt.value = status;
          opt.innerText = status;
          if (initialValue.toLowerCase().includes(status.toLowerCase())) {
            opt.selected = true;
            matched = true;
          }
          inputElement.appendChild(opt);
        });
        
        if (!matched && initialValue) {
          const opt = document.createElement("option");
          opt.value = initialValue;
          opt.innerText = initialValue;
          opt.selected = true;
          inputElement.appendChild(opt);
        }
      } else {
        // Normal input or textarea
        if (lowerHeader.includes("details") || lowerHeader.includes("message") || lowerHeader.includes("desc")) {
          inputElement = document.createElement("textarea");
          inputElement.className = "form-input";
          inputElement.rows = 4;
        } else {
          inputElement = document.createElement("input");
          inputElement.className = "form-input";
          inputElement.type = "text";
        }
        inputElement.value = initialValue;
      }
      
      inputElement.required = true;
      inputElement.dataset.colIndex = idx;
      
      formGroup.appendChild(label);
      formGroup.appendChild(inputElement);
      crudFields.appendChild(formGroup);
    });
    
    crudModal.classList.add("active");
  };

  const closeCrudModal = () => {
    crudModal.classList.remove("active");
  };

  if (crudClose) {
    crudClose.addEventListener("click", closeCrudModal);
  }
  crudModal.addEventListener("click", (e) => {
    if (e.target === crudModal) closeCrudModal();
  });

  // Handle Form Submission (Add or Edit)
  crudForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputs = Array.from(crudFields.querySelectorAll(".form-input, select"));
    
    if (activeRow) {
      // EDIT MODE: Update existing row cells
      const cells = Array.from(activeRow.querySelectorAll("td"));
      inputs.forEach(input => {
        const colIdx = parseInt(input.dataset.colIndex);
        const headerText = Array.from(activeTable.querySelectorAll("thead th"))[colIdx].innerText.toLowerCase();
        
        if (headerText.includes("status")) {
          const statusText = input.value;
          let badgeClass = "status-pending";
          if (statusText.toLowerCase() === "active" || statusText.toLowerCase() === "approved") badgeClass = "status-active";
          else if (statusText.toLowerCase() === "completed") badgeClass = "status-completed";
          
          cells[colIdx].innerHTML = `<span class="milestone-status-badge ${badgeClass}">${statusText}</span>`;
        } else {
          cells[colIdx].innerText = input.value;
        }
      });
      showNotification("Record updated successfully!");
    } else if (activeTable) {
      // ADD MODE: Create new row
      const tbody = activeTable.querySelector("tbody");
      const ths = Array.from(activeTable.querySelectorAll("thead th"));
      const tr = document.createElement("tr");
      
      ths.forEach((th, idx) => {
        const td = document.createElement("td");
        const headerText = th.innerText.trim().toLowerCase();
        
        if (headerText === "controls" || headerText === "actions") {
          td.innerHTML = `
            <div class="actions-btn-group">
              <button class="action-btn action-btn-edit" title="Edit Record"><i class="fas fa-edit"></i></button>
              <button class="action-btn action-btn-delete" title="Delete Record"><i class="fas fa-trash-alt"></i></button>
            </div>
          `;
        } else {
          const matchingInput = inputs.find(inp => parseInt(inp.dataset.colIndex) === idx);
          const value = matchingInput ? matchingInput.value : "";
          
          if (headerText.includes("status")) {
            let badgeClass = "status-pending";
            if (value.toLowerCase() === "active" || value.toLowerCase() === "approved") badgeClass = "status-active";
            else if (value.toLowerCase() === "completed") badgeClass = "status-completed";
            td.innerHTML = `<span class="milestone-status-badge ${badgeClass}">${value}</span>`;
          } else {
            td.innerText = value;
          }
        }
        tr.appendChild(td);
      });
      
      tbody.appendChild(tr);
      bindRowEvents(tr, activeTable);
      showNotification("New record added successfully!");
    }
    
    closeCrudModal();
  });

  // Helper to show modern floating notifications
  const showNotification = (message) => {
    let container = document.getElementById("admin-notification-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "admin-notification-container";
      container.style.position = "fixed";
      container.style.bottom = "2rem";
      container.style.right = "2rem";
      container.style.zIndex = "9999";
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "0.75rem";
      document.body.appendChild(container);
    }
    
    const notification = document.createElement("div");
    notification.className = "glass-panel";
    notification.style.padding = "1rem 1.5rem";
    notification.style.borderRadius = "var(--br-sm)";
    notification.style.borderLeft = "4px solid var(--gold)";
    notification.style.boxShadow = "var(--shadow-lg)";
    notification.style.display = "flex";
    notification.style.alignItems = "center";
    notification.style.gap = "0.75rem";
    notification.style.transform = "translateX(100px)";
    notification.style.opacity = "0";
    notification.style.transition = "all 0.4s cubic-bezier(0.23, 1, 0.32, 1)";
    notification.innerHTML = `<i class="fas fa-check-circle" style="color: var(--gold);"></i> <span style="font-weight:600; font-size:0.9rem;">${message}</span>`;
    
    container.appendChild(notification);
    
    notification.offsetHeight; // Reflow
    notification.style.transform = "translateX(0)";
    notification.style.opacity = "1";
    
    setTimeout(() => {
      notification.style.transform = "translateX(100px)";
      notification.style.opacity = "0";
      setTimeout(() => notification.remove(), 400);
    }, 3000);
  };

  // Helper to bind events to row buttons
  const bindRowEvents = (row, table) => {
    // Edit button click
    const editBtn = row.querySelector(".action-btn-edit");
    if (editBtn) {
      editBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openCrudModal("Edit Record Details", row, table);
      });
    }
    
    // Delete button click
    const deleteBtn = row.querySelector(".action-btn-delete");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (confirm("Are you sure you want to remove this ledger record from the operations database?")) {
          row.style.transition = "all 0.4s ease";
          row.style.opacity = "0";
          row.style.transform = "translateX(20px)";
          setTimeout(() => {
            row.remove();
            showNotification("Record deleted successfully.");
          }, 400);
        }
      });
    }
  };

  // Initialize all existing tables
  tables.forEach(table => {
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach(row => {
      let actionGroup = row.querySelector(".actions-btn-group");
      
      if (actionGroup) {
        if (!actionGroup.querySelector(".action-btn-edit")) {
          const editBtnHTML = `<button class="action-btn action-btn-edit" title="Edit Record"><i class="fas fa-edit"></i></button>`;
          const deleteBtn = actionGroup.querySelector(".action-btn-delete");
          if (deleteBtn) {
            deleteBtn.insertAdjacentHTML("beforebegin", editBtnHTML);
          } else {
            actionGroup.insertAdjacentHTML("beforeend", editBtnHTML);
          }
        }
      }
      
      bindRowEvents(row, table);
    });
  });

  // Intercept the Add New Button
  const addBtn = document.getElementById("open-add-modal") || document.querySelector(".btn-primary[id*='add']") || document.querySelector(".btn-primary[id*='project']");
  if (addBtn && tables.length > 0) {
    addBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openCrudModal("Launch New Operations Entry", null, tables[0]);
    });
  } else {
    // Dynamically register clicks on any buttons created via preprocessing
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("#open-add-modal");
      if (btn && tables.length > 0) {
        e.preventDefault();
        openCrudModal("Launch New Operations Entry", null, tables[0]);
      }
    });
  }

  // 2. Table Row Search Filter
  const searchInput = document.getElementById("admin-search-input") || document.querySelector("input[placeholder*='Search']");
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

  // 3. Dynamic SVG Chart Drawing Path recalculator
  const chartPath = document.querySelector(".chart-line");
  if (chartPath) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          chartPath.style.animation = "none";
          chartPath.offsetHeight; // Trigger reflow
          chartPath.style.animation = "drawLine 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards";
        }
      });
    }, { threshold: 0.2 });
    
    const chartCard = chartPath.closest(".admin-chart-card");
    if (chartCard) observer.observe(chartCard);
  }

  // 5. Monthly / Yearly Dashboard Filter
  const filterButtons = document.querySelectorAll(".filter-btn");
  const chartLine = document.getElementById("chart-growth-line");
  const growthPercentage = document.getElementById("chart-growth-percentage");
  const statRevenue = document.getElementById("stat-revenue");
  const statSites = document.getElementById("stat-sites");
  const statLeads = document.getElementById("stat-leads");
  const statEmployees = document.getElementById("stat-employees");

  if (filterButtons.length > 0 && chartLine) {
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        // Toggle active button style
        filterButtons.forEach(b => {
          b.classList.remove("active");
          b.style.background = "transparent";
          b.style.color = "var(--text-muted)";
        });
        
        btn.classList.add("active");
        btn.style.background = "var(--primary)";
        btn.style.color = "var(--secondary)";

        const filterType = btn.dataset.filter;

        if (filterType === "monthly") {
          // Update Chart path and stats for Monthly view
          chartLine.setAttribute("d", "M 0,180 Q 200,160 400,120 T 800,60 T 1000,40");
          if (growthPercentage) growthPercentage.innerText = "+14.2% Monthly Increase";
          if (statRevenue) statRevenue.innerText = "$4,520,000";
          if (statSites) statSites.innerText = "12 Projects";
          if (statLeads) statLeads.innerText = "28 Incoming";
          if (statEmployees) statEmployees.innerText = "124 Personnel";
        } else if (filterType === "yearly") {
          // Update Chart path and stats for Yearly view
          chartLine.setAttribute("d", "M 0,220 Q 250,170 500,130 T 750,70 T 1000,15");
          if (growthPercentage) growthPercentage.innerText = "+168.4% Cumulative Annual Growth";
          if (statRevenue) statRevenue.innerText = "$54,240,000";
          if (statSites) statSites.innerText = "144 Completed/Active";
          if (statLeads) statLeads.innerText = "336 Total Bids";
          if (statEmployees) statEmployees.innerText = "1,488 Total Logged";
        }

        // Re-trigger draw line animation
        chartLine.style.animation = "none";
        chartLine.offsetHeight; // force reflow
        chartLine.style.animation = "drawLine 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards";
      });
    });
  }

  // 6. Calendar Day Highlighting and Event simulator
  const calendarDays = document.querySelectorAll(".calendar-day");
  calendarDays.forEach(day => {
    day.addEventListener("click", () => {
      if (!day.innerText) return;
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
