function getWIBTime() {
  const jam = new Date().toLocaleTimeString("id", { timeZone: 'Asia/Jakarta' });
  return jam;
}

function typeWriter(element, text, speed = 30) {
  element.textContent = "";
  let i = 0;
  const interval = setInterval(() => {
    element.textContent += text.charAt(i);
    i++;
    if (i >= text.length) {
      clearInterval(interval);
    }
  }, speed);
}

(() => {
  const chatContainer = document.getElementById('chat-container');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');

  userInput.addEventListener('input', () => {
    sendButton.disabled = userInput.value.trim().length === 0;
  });

  function addMessage(content, type) {
    const welcome = chatContainer.querySelector('p');
    if (welcome) welcome.remove();

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    messageDiv.setAttribute('role', 'article');
    messageDiv.setAttribute('aria-label', type === 'user' ? 'User message' : type === 'ai' ? 'AI message' : 'System message');

    const bubble = document.createElement('div');
    bubble.classList.add('bubble');

    if (type === 'user') {
      bubble.appendChild(document.createTextNode(content));
    } else if (type === 'ai') {
      const icon = document.createElement('img');
      icon.src = 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/refs/heads/master/Emojis/Symbols/Bubbles.png';
      icon.alt = 'AI robot icon';
      icon.style.width = '20px';
      icon.style.height = '20px';
      icon.style.flexShrink = '0';
      bubble.appendChild(icon);

      const textSpan = document.createElement('span');
      bubble.appendChild(textSpan);

      const metaLogo = document.createElement('div');
      metaLogo.className = 'meta-ai-logo';
      metaLogo.innerHTML = `
        <img src="https://raw.githubusercontent.com/akiizryzz/s/main/img/stars.png" alt="Meta AI" />
        <span>AI</span>
      `;
      bubble.appendChild(metaLogo);

      typeWriter(textSpan, content, 30);
    } else {
      bubble.textContent = content;
    }

    const timeDiv = document.createElement('div');
    timeDiv.className = 'chat-time';
    timeDiv.textContent = getWIBTime();

    messageDiv.appendChild(bubble);
    messageDiv.appendChild(timeDiv);
    chatContainer.appendChild(messageDiv);
    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
  }

  async function sendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    userInput.value = '';
    sendButton.disabled = true;
    userInput.focus();
    addMessage('Furina sedang mengetik...', 'loading');

    try {
      const apiUrl = `https://www.furinnteam.web.id/ai/furina?content=${encodeURIComponent(message)}&user=user`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      const loadingElements = chatContainer.querySelectorAll('.message.loading');
      if (loadingElements.length) loadingElements[loadingElements.length - 1].remove();

      if (data.status || data.code === 200) {
        addMessage(data.result.message, 'ai');
      } else {
        addMessage(`Sorry, I couldn't process your request. (Status: ${data.code || 'unknown'})`, 'error');
      }
    } catch (error) {
      const loadingElements = chatContainer.querySelectorAll('.message.loading');
      if (loadingElements.length) loadingElements[loadingElements.length - 1].remove();

      addMessage(`Connection error: ${error.message}`, 'error');

      setTimeout(() => {
        addMessage(
          "Hello! I'm having trouble connecting to my AI service right now, but I'm here and ready to chat when the connection is restored. How can I help you today?",
          'ai'
        );
      }, 500);
    } finally {
      sendButton.disabled = true;
      userInput.focus();
    }
  }

  sendButton.addEventListener('click', sendMessage);
  userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !sendButton.disabled) {
      e.preventDefault();
      sendMessage();
    }
  });

  userInput.focus();
})();
