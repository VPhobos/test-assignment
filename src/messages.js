(function () {
  'use strict';

  const mainContainer = document.querySelector('.hidden-dots-lg');

  if (!mainContainer) {
    console.warn("Container with class 'hidden-dots-lg' not found");
    return;
  }

  const CONFIG = {
    MESSAGE_DELAY: 3000,
    HIDE_DELAY: 8000,
    MESSAGE_HEIGHT: 60,
    ANIMATION_DURATION: 300,
    REPLAY_DELAY: 500,
  };

  let stylesAdded = false;
  let activeMessages = 0;
  let replayButton = null;

  const messageQueue = [
    {
      text: '33 people viewed this in the past hour.',
      title: 'Super hot!',
      icon: '🔥',
      autoHide: true,
    },
    {
      text: 'Another text sample...................',
      title: 'Some Text!',
      icon: '🔥',
      autoHide: true,
    },
    {
      text: '5 people just added this to cart.',
      title: 'Popular!',
      icon: '🛒',
      autoHide: true,
    },
  ];

  function addStyles() {
    if (stylesAdded) return;

    const style = document.createElement('style');
    style.textContent = `
      #social-message-container {
        position: relative;
        z-index: 9999;
        flex-direction: column;
        gap: 10px;
        max-width: 450px;
        margin: 10px;
        margin-top: 200px;
      }

      .social-message {
        position: absolute;
        background: #e8e8e8;
        border-radius: 8px;
        padding: 12px 16px;
        height: 24px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        overflow: hidden;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.3s ease-out;
        pointer-events: none;
      }
      
      .social-message.show {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }

      .social-message-icon {
        font-size: 20px; 
        flex-shrink: 0;
      }
  
      .social-message-title {
        font-weight: 700;
      }
      
      .social-message-content {
        flex: 1; 
        color: #323232; 
        font-size: 14px; 
        font-weight: 500;
      }
      
      .social-message-close-btn {
        background: none; 
        border: none; 
        cursor: pointer; 
        padding: 4px; 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        color: #646464; 
        font-size: 18px; 
        line-height: 1; 
        flex-shrink: 0; 
        transition: color 0.2s;
      }
      
      .social-message-close-btn:hover {
        color: #333;
      }

       #replay-messages-btn {
        border: none;
        color: #656565;
        font-weight: 500;
        background-color: transparent;
        cursor: pointer;
        opacity: 0;
        pointer-events: none;
        text-decoration: underline;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }

      #replay-messages-btn.show {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto;
      }
    `;

    document.head.appendChild(style);
    stylesAdded = true;
  }

  function createSocialMessage(options = {}) {
     const {
        text = 'Text is not defined',
        title = 'Unknown Title',
        icon = '🔥',
        autoHide = true,
        hideDelay = CONFIG.HIDE_DELAY,
        index = 0,
      } = options;

    addStyles();

    const messageElement = document.createElement('div');
    messageElement.classList.add('social-message');

    messageElement.innerHTML = `
      <span class="social-message-icon">${icon}</span>
      <div class="social-message-content">
        <span class="social-message-title">${title}</span> ${text}
      </div>
      <button class="social-message-close-btn">✕</button>
    `;

    messageElement.style.bottom = `${index * CONFIG.MESSAGE_HEIGHT}px`;

    mainContainer.appendChild(messageElement);

    function showModule() {
      messageElement.classList.add('show');
      activeMessages++;
      hideReplayButton();
    }

    function hideModule() {
      messageElement.classList.remove('show');
      activeMessages--;

      setTimeout(() => {
        if (messageElement.parentNode) {
          messageElement.parentNode.removeChild(messageElement);
        }

        if (activeMessages === 0) {
          showReplayButton();
        }
      }, CONFIG.ANIMATION_DURATION);
    }

    const closeBtn = messageElement.querySelector('.social-message-close-btn');

    if (closeBtn) {
      closeBtn.addEventListener('click', hideModule);
    }

    setTimeout(showModule, 100);

    if (autoHide) {
      setTimeout(hideModule, 100 + hideDelay);
    }

    return messageElement;
  }

  function createReplayButton() {
    if (replayButton) return replayButton;

    replayButton = document.createElement('button');
    replayButton.id = 'replay-messages-btn';
    replayButton.textContent = 'Show product messages again';

    replayButton.addEventListener('click', () => {
      hideReplayButton();
      showMessagesSequentially(messageQueue, CONFIG.MESSAGE_DELAY);
    });

    mainContainer.appendChild(replayButton);
    return replayButton;
  }

  function showReplayButton() {
    if (!replayButton) {
      createReplayButton();
    }

    if (replayButton) {
      setTimeout(() => {
        replayButton.classList.add('show');
      }, CONFIG.REPLAY_DELAY);
    }
  }

  function hideReplayButton() {
    if (replayButton) {
      replayButton.classList.remove('show');
    }
  }

  function showMessagesSequentially(messages, delay = 3000) {
    messages.forEach((messageOptions, index) => {
      setTimeout(() => {
          createSocialMessage({ 
          ...messageOptions, 
          index,
          hideDelay: CONFIG.HIDE_DELAY 
        });
      }, index * delay);
    });
  }

  function initSocialMessage() {
    showMessagesSequentially(messageQueue, CONFIG.MESSAGE_DELAY);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSocialMessage);
  } else {
    initSocialMessage();
  }
})();
