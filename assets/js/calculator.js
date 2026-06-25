/* ==========================================================================
   BuildCon Premium Construction Company Javascript - Calculators
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Material Estimation Calculator
  const calcForm = document.getElementById("material-calc-form");
  if (calcForm) {
    calcForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const area = parseFloat(document.getElementById("calc-area").value);
      const grade = document.getElementById("calc-grade").value;
      
      if (isNaN(area) || area <= 0) return;
      
      // Structural Material Multipliers per square foot
      let multipliers = {
        cement: 0.4,     // bags
        steel: 4.2,      // kg
        sand: 1.8,       // cft
        aggregate: 1.35, // cft
        bricks: 12.0,    // pieces
        cost: 1600       // $ base per sq ft
      };
      
      if (grade === "standard") {
        multipliers.cost = 2200;
        multipliers.cement = 0.45;
        multipliers.steel = 4.8;
      } else if (grade === "premium") {
        multipliers.cost = 3200;
        multipliers.cement = 0.52;
        multipliers.steel = 5.5;
        multipliers.bricks = 12.5;
      }
      
      // Calculate final units
      const cementVal = Math.round(area * multipliers.cement);
      const steelVal = Math.round(area * multipliers.steel);
      const sandVal = Math.round(area * multipliers.sand);
      const aggVal = Math.round(area * multipliers.aggregate);
      const bricksVal = Math.round(area * multipliers.bricks);
      const costVal = area * multipliers.cost;
      
      // Update DOM
      document.getElementById("res-cement").innerText = cementVal.toLocaleString();
      document.getElementById("res-steel").innerText = steelVal.toLocaleString() + " kg";
      document.getElementById("res-sand").innerText = sandVal.toLocaleString() + " cft";
      document.getElementById("res-aggregate").innerText = aggVal.toLocaleString() + " cft";
      document.getElementById("res-bricks").innerText = bricksVal.toLocaleString();
      document.getElementById("res-cost").innerText = "$" + costVal.toLocaleString();
    });
  }

  // 2. Loan EMI Calculator
  const emiForm = document.getElementById("loan-emi-form");
  if (emiForm) {
    emiForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const amount = parseFloat(document.getElementById("emi-amount").value);
      const rate = parseFloat(document.getElementById("emi-rate").value);
      const termYears = parseFloat(document.getElementById("emi-term").value);
      
      if (isNaN(amount) || isNaN(rate) || isNaN(termYears) || amount <= 0) return;
      
      // Formulas
      const monthlyRate = (rate / 12) / 100;
      const termMonths = termYears * 12;
      
      // EMI = [P x R x (1+R)^N]/[((1+R)^N)-1]
      const emi = (amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) / (Math.pow(1 + monthlyRate, termMonths) - 1);
      const totalPayment = emi * termMonths;
      const totalInterest = totalPayment - amount;
      
      // Update basic cards
      document.getElementById("res-emi").innerText = "$" + Math.round(emi).toLocaleString();
      document.getElementById("res-interest").innerText = "$" + Math.round(totalInterest).toLocaleString();
      document.getElementById("res-total").innerText = "$" + Math.round(totalPayment).toLocaleString();
      
      // Generate amortization table schedule
      const tableBody = document.getElementById("emi-table-body");
      if (tableBody) {
        tableBody.innerHTML = ""; // Clear
        
        let balance = amount;
        
        // Show first 12 months for brevity and clean structure
        const monthsToShow = Math.min(termMonths, 12);
        
        for (let i = 1; i <= monthsToShow; i++) {
          const interestPayable = balance * monthlyRate;
          const principalPayable = emi - interestPayable;
          balance -= principalPayable;
          
          if (balance < 0) balance = 0;
          
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>Month ${i}</td>
            <td>$${Math.round(emi).toLocaleString()}</td>
            <td>$${Math.round(principalPayable).toLocaleString()}</td>
            <td>$${Math.round(interestPayable).toLocaleString()}</td>
            <td>$${Math.round(balance).toLocaleString()}</td>
          `;
          tableBody.appendChild(row);
        }
        
        if (termMonths > 12) {
          const summaryRow = document.createElement("tr");
          summaryRow.innerHTML = `
            <td colspan="5" style="text-align:center; font-style:italic; color:var(--text-muted);">Showing first 12 months of amortization schedule</td>
          `;
          tableBody.appendChild(summaryRow);
        }
      }
    });
  }
});
