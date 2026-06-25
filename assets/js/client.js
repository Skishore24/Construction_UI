/* ==========================================================================
   BuildCon Premium Construction Company Javascript - Client Portal
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Client Dashboard Progress Bar Animation
  const progressFills = document.querySelectorAll(".progress-bar-fill");
  setTimeout(() => {
    progressFills.forEach(fill => {
      const targetPercent = fill.getAttribute("data-value");
      if (targetPercent) {
        fill.style.width = targetPercent + "%";
      }
    });
  }, 300);

  // 2. Simulated Client-Supervisor Chat Logs
  const chatForm = document.getElementById("chat-send-form");
  const chatInput = document.getElementById("chat-message-input");
  const chatContainer = document.getElementById("chat-messages-container");

  if (chatForm && chatInput && chatContainer) {
    
    const supervisorReplies = [
      "I'm checking this with the site engineers now.",
      "The concrete core reports just passed. I will upload the documents shortly.",
      "Yes, we are on track for the drywall handover next Tuesday.",
      "I will take some drone footage of the roof deck layout and upload it today."
    ];
    
    let replyIndex = 0;

    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const messageText = chatInput.value.trim();
      if (!messageText) return;
      
      // Append Sent message
      appendMessage("sent", messageText);
      chatInput.value = "";
      
      // Auto-scroll
      chatContainer.scrollTop = chatContainer.scrollHeight;
      
      // Simulate Supervisor delay reply
      setTimeout(() => {
        const replyText = supervisorReplies[replyIndex];
        appendMessage("received", replyText);
        
        // Loop index
        replyIndex = (replyIndex + 1) % supervisorReplies.length;
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 1500);
    });

    const appendMessage = (type, text) => {
      const msgDiv = document.createElement("div");
      msgDiv.className = `chat-message ${type}`;
      
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const timeStr = `${hours}:${minutes} ${ampm}`;
      
      msgDiv.innerHTML = `
        <div class="message-text">${escapeHtml(text)}</div>
        <div class="message-meta">${timeStr}</div>
      `;
      chatContainer.appendChild(msgDiv);
    };

    const escapeHtml = (text) => {
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      };
      return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    };
  }
});
