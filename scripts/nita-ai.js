/**
 * NITA AI PATIENT CONCIERGE & VOICE ENGINE
 * Connects to Backend /api/ai-chat + Real Web Speech & Web Audio APIs
 * Advance Dermatology & Laser Medical Center — Dr. Nita Patel, MD
 */

(function () {
  'use strict';

  const NitaState = window.NitaState = {
    isOpen: false,
    isVoiceMode: false,
    isListening: false,
    isSpeaking: false,
    soundEnabled: true,
    isSending: false,
    recognition: null,
    synth: window.speechSynthesis || null,
    audioCtx: null,
    analyser: null,
    micStream: null,
    canvasAnimId: null,
    history: []
  };

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const rec = new SpeechRecognition();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = function () {
      NitaState.isListening = true;
      updateVoiceUI();
    };

    rec.onresult = function (event) {
      const transcript = event.results[0][0].transcript;
      const statusEl = document.getElementById('voice-status-text');
      if (statusEl) statusEl.innerText = `Heard: "${transcript}"`;
      sendUserMessage(transcript);
    };

    rec.onerror = function (event) {
      NitaState.isListening = false;
      stopMicStream();
      updateVoiceUI();
      const statusEl = document.getElementById('voice-status-text');
      if (statusEl) {
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          statusEl.innerText = 'Microphone permission was denied. Please use text input below.';
        } else {
          statusEl.innerText = `Voice recognition error (${event.error}). Please try again or type below.`;
        }
      }
    };

    rec.onend = function () {
      NitaState.isListening = false;
      stopMicStream();
      updateVoiceUI();
    };

    NitaState.recognition = rec;
  }

  async function startMicAnalyser() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      NitaState.micStream = stream;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        src.connect(analyser);
        NitaState.audioCtx = ctx;
        NitaState.analyser = analyser;
        if (NitaState.startWaveLoop) NitaState.startWaveLoop();
      }
    } catch (err) {
      const statusEl = document.getElementById('voice-status-text');
      if (statusEl) {
        statusEl.innerText = 'Microphone access is blocked or unavailable. Please type your question below.';
      }
    }
  }

  function stopMicStream() {
    if (NitaState.micStream) {
      NitaState.micStream.getTracks().forEach(t => t.stop());
      NitaState.micStream = null;
    }
    if (NitaState.audioCtx) {
      try { NitaState.audioCtx.close(); } catch (e) {}
      NitaState.audioCtx = null;
      NitaState.analyser = null;
    }
  }

  function speakResponse(text) {
    if (!NitaState.synth || !NitaState.soundEnabled) return;
    try {
      NitaState.synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.98;
      utter.pitch = 1.02;
      utter.onstart = function () {
        NitaState.isSpeaking = true;
        updateVoiceUI();
      };
      utter.onend = function () {
        NitaState.isSpeaking = false;
        updateVoiceUI();
      };
      utter.onerror = function () {
        NitaState.isSpeaking = false;
        updateVoiceUI();
      };
      NitaState.synth.speak(utter);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
    }
  }

  function injectNitaUI() {
    const btn = document.createElement('button');
    btn.id = 'nita-float-btn';
    btn.className = 'nita-widget-btn';
    btn.setAttribute('aria-label', 'Open NITA AI Assistant');
    btn.innerHTML = `
      <div class="nita-avatar-pulse"></div>
      <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      <span>NITA AI Concierge</span>
    `;
    btn.onclick = toggleNitaChat;
    document.body.appendChild(btn);

    const modal = document.createElement('div');
    modal.id = 'nita-modal';
    modal.className = 'nita-chat-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'NITA AI Clinical Concierge');
    modal.innerHTML = `
      <div class="nita-chat-header">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: var(--gold-500); color: var(--navy-900); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8rem;">
            NA
          </div>
          <div>
            <strong style="display: block; font-size: 0.95rem;">NITA AI Assistant</strong>
            <span style="font-size: 0.72rem; color: #CBD5E1;">Clinical Navigation &bull; Non-Diagnostic</span>
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <button id="nita-reset-btn" title="Clear Conversation" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.2); border-radius: 999px; padding: 4px 10px; font-size: 0.7rem; color: #E2E8F0; cursor: pointer;">Clear</button>
          <button id="nita-voice-toggle-btn" title="Toggle Voice Assistant Mode" style="background: none; border: 1px solid rgba(255,255,255,0.25); border-radius: 50%; width: 32px; height: 32px; color: var(--gold-400); display: flex; align-items: center; justify-content: center; cursor: pointer;">
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>
          </button>
          <button id="nita-close-btn" title="Close" style="background: none; border: none; color: #CBD5E1; font-size: 1.25rem; cursor: pointer; padding: 4px;">&times;</button>
        </div>
      </div>

      <div id="nita-voice-pane" style="display: none; background: #0B1521; padding: 20px 16px; text-align: center; color: #FFF; border-bottom: 1px solid rgba(197,168,128,0.25);">
        <span class="badge badge-gold" style="margin-bottom: 8px;">Voice Interface</span>
        <h4 style="color: #FFF; font-size: 1.05rem; margin-bottom: 6px;">Voice Input (Web Speech API)</h4>
        <p style="font-size: 0.78rem; color: #94A3B8; margin-bottom: 12px;" id="voice-status-text">Tap the microphone to grant permission and speak...</p>
        <canvas id="voice-canvas" width="280" height="54" style="margin: 0 auto; display: block; border-radius: 8px; background: rgba(255,255,255,0.04);"></canvas>
        <div style="display: flex; justify-content: center; gap: 10px; align-items: center; margin-top: 12px; flex-wrap: wrap;">
          <button id="mic-trigger-btn" class="mic-active-btn" style="width: 48px; height: 48px;" aria-label="Start Voice Input">
            <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path></svg>
          </button>
          <button id="stop-speech-btn" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FFF; border-radius: var(--radius-full); padding: 6px 12px; font-size: 0.74rem; cursor: pointer;">
            Stop Speaking
          </button>
          <button id="mute-voice-btn" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #FFF; border-radius: var(--radius-full); padding: 6px 12px; font-size: 0.74rem; cursor: pointer;">
            Mute Voice
          </button>
        </div>
      </div>

      <div class="nita-chat-body" id="nita-chat-messages">
        <div class="nita-msg nita-msg-bot" id="nita-welcome-msg">
          <strong>Welcome to Advance Dermatology.</strong><br />
          I can assist with verified clinic services, consultation logistics, and website navigation.
          <div class="nita-quick-pills">
            <button class="quick-pill" onclick="window.sendNitaQuestion('What services does this clinic offer?')">Clinic Services</button>
            <button class="quick-pill" onclick="window.sendNitaQuestion('Help me explore laser treatments')">Laser Care</button>
            <button class="quick-pill" onclick="window.sendNitaQuestion('How do I schedule a consultation?')">Book Consult</button>
            <button class="quick-pill" onclick="window.sendNitaQuestion('Where is the clinic located?')">Location &amp; Hours</button>
          </div>
        </div>
      </div>

      <div style="background: #F1F5F9; padding: 6px 14px; font-size: 0.68rem; color: var(--text-muted); border-top: 1px solid var(--border-light); text-align: center;">
        Informational assistant &bull; Cannot diagnose, prescribe, or replace Dr. Nita Patel. Do not submit sensitive health details.
      </div>

      <div class="nita-chat-footer">
        <input type="text" id="nita-chat-input" class="nita-input" maxlength="600" placeholder="Ask about clinic services, hours, or navigation..." />
        <button id="nita-send-btn" class="btn btn-primary btn-sm" style="border-radius: var(--radius-full); width: 40px; height: 40px; padding: 0;" aria-label="Send message">
          <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('nita-close-btn').onclick = toggleNitaChat;
    document.getElementById('nita-reset-btn').onclick = resetNitaConversation;
    document.getElementById('nita-voice-toggle-btn').onclick = toggleVoiceMode;
    document.getElementById('mic-trigger-btn').onclick = triggerMicrophone;
    document.getElementById('stop-speech-btn').onclick = stopVoicePlayback;
    document.getElementById('mute-voice-btn').onclick = toggleMuteSpeech;

    const input = document.getElementById('nita-chat-input');
    const sendBtn = document.getElementById('nita-send-btn');

    sendBtn.onclick = function () {
      if (input.value.trim() && !NitaState.isSending) {
        sendUserMessage(input.value.trim());
        input.value = '';
      }
    };

    input.onkeydown = function (e) {
      if (e.key === 'Enter' && input.value.trim() && !NitaState.isSending) {
        sendUserMessage(input.value.trim());
        input.value = '';
      }
    };

    initSpeechRecognition();
    initVisualizerCanvas();
  }

  function toggleNitaChat() {
    const modal = document.getElementById('nita-modal');
    NitaState.isOpen = !NitaState.isOpen;
    if (NitaState.isOpen) {
      modal.classList.add('open');
      document.getElementById('nita-chat-input').focus();
      if (NitaState.isVoiceMode && NitaState.startWaveLoop) NitaState.startWaveLoop();
    } else {
      modal.classList.remove('open');
      stopVoicePlayback();
      stopMicStream();
    }
  }

  window.launchNitaAssistant = function (initialQuestion) {
    if (!NitaState.isOpen) toggleNitaChat();
    if (initialQuestion) {
      setTimeout(() => sendUserMessage(initialQuestion), 200);
    }
  };

  window.sendNitaQuestion = function (q) {
    if (!NitaState.isSending) sendUserMessage(q);
  };

  async function sendUserMessage(text) {
    const chatBody = document.getElementById('nita-chat-messages');
    const sendBtn = document.getElementById('nita-send-btn');
    if (!chatBody || NitaState.isSending) return;

    NitaState.isSending = true;
    if (sendBtn) sendBtn.disabled = true;

    const uMsg = document.createElement('div');
    uMsg.className = 'nita-msg nita-msg-user';
    uMsg.innerText = text;
    chatBody.appendChild(uMsg);
    chatBody.scrollTop = chatBody.scrollHeight;

    NitaState.history.push({ sender: 'user', text: text });

    const typing = document.createElement('div');
    typing.className = 'nita-msg nita-msg-bot';
    typing.id = 'nita-typing';
    typing.innerHTML = '<div style="display:flex;align-items:center;gap:8px;"><div class="typing-dots"><span></span><span></span><span></span></div><span style="color:var(--text-muted);font-size:0.8rem;">Connecting to NITA AI...</span></div>';
    chatBody.appendChild(typing);
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
      const resp = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          history: NitaState.history.slice(-6)
        })
      });

      const data = await resp.json();
      typing.remove();

      const bMsg = document.createElement('div');
      bMsg.className = 'nita-msg nita-msg-bot';

      if (!resp.ok) {
        bMsg.innerHTML = `<div style="color:#991B1B;">${escapeHtml(data.error || 'Unable to process request right now.')}</div>`;
      } else if (data.configured === false) {
        // Honest unconfigured state — never pretend static text is real AI
        bMsg.innerHTML = `
          <div>
            <strong>Live AI Not Yet Configured</strong><br />
            <span style="font-size:0.84rem; color:var(--text-secondary);">
              Real-time AI responses require configuring <code>GEMINI_API_KEY</code> or <code>OPENAI_API_KEY</code> on the server.
              Meanwhile, you can call the clinic directly at <strong>(310) 822-1200</strong> or jump directly to the relevant section:
            </span>
          </div>
          ${data.action ? `
            <div style="margin-top: 10px;">
              <a href="${data.action.href}" class="btn btn-sm btn-gold" onclick="document.getElementById('nita-modal').classList.remove('open'); NitaState.isOpen=false;">
                ${escapeHtml(data.action.text)} &rarr;
              </a>
            </div>
          ` : `
            <div style="margin-top: 10px; display:flex; gap:6px; flex-wrap:wrap;">
              <a href="#services" class="btn btn-sm btn-secondary" onclick="document.getElementById('nita-modal').classList.remove('open'); NitaState.isOpen=false;">Services</a>
              <a href="#booking" class="btn btn-sm btn-gold" onclick="document.getElementById('nita-modal').classList.remove('open'); NitaState.isOpen=false;">Request Visit</a>
            </div>
          `}
        `;
      } else {
        const replyText = data.response || '';
        bMsg.innerHTML = `
          <div>${escapeHtml(replyText).replace(/\n/g, '<br />')}</div>
          ${data.action ? `
            <div style="margin-top: 10px;">
              <a href="${data.action.href}" class="btn btn-sm btn-gold" onclick="document.getElementById('nita-modal').classList.remove('open'); NitaState.isOpen=false;">
                ${escapeHtml(data.action.text)} &rarr;
              </a>
            </div>
          ` : ''}
        `;
        NitaState.history.push({ sender: 'nita', text: replyText });
        if (NitaState.isVoiceMode && replyText) {
          speakResponse(replyText);
        }
      }

      chatBody.appendChild(bMsg);
      chatBody.scrollTop = chatBody.scrollHeight;
    } catch (err) {
      typing.remove();
      const errMsg = document.createElement('div');
      errMsg.className = 'nita-msg nita-msg-bot';
      errMsg.innerHTML = '<div style="color:#991B1B;">Could not reach the backend AI endpoint. Please ensure the clinic server is running or call (310) 822-1200.</div>';
      chatBody.appendChild(errMsg);
    } finally {
      NitaState.isSending = false;
      if (sendBtn) sendBtn.disabled = false;
    }
  }

  function resetNitaConversation() {
    stopVoicePlayback();
    NitaState.history = [];
    const chatBody = document.getElementById('nita-chat-messages');
    const welcome = document.getElementById('nita-welcome-msg');
    if (chatBody && welcome) {
      const clone = welcome.cloneNode(true);
      chatBody.innerHTML = '';
      chatBody.appendChild(clone);
    }
  }

  function toggleVoiceMode() {
    NitaState.isVoiceMode = !NitaState.isVoiceMode;
    const pane = document.getElementById('nita-voice-pane');
    pane.style.display = NitaState.isVoiceMode ? 'block' : 'none';
    const statusEl = document.getElementById('voice-status-text');

    if (NitaState.isVoiceMode) {
      if (!NitaState.recognition) {
        statusEl.innerText = 'Speech recognition is not supported by this browser. Please type your question below.';
      } else {
        statusEl.innerText = 'Voice assistant ready. Tap the microphone to speak.';
      }
      if (NitaState.startWaveLoop) NitaState.startWaveLoop();
    } else {
      stopVoicePlayback();
      stopMicStream();
    }
  }

  function triggerMicrophone() {
    const statusEl = document.getElementById('voice-status-text');
    if (!NitaState.recognition) {
      if (statusEl) statusEl.innerText = 'Speech recognition is unsupported in this browser. Please use text chat below.';
      return;
    }
    try {
      startMicAnalyser();
      NitaState.recognition.start();
      if (statusEl) statusEl.innerText = 'Listening... Speak clearly now.';
    } catch (e) {
      if (statusEl) statusEl.innerText = 'Microphone busy or unavailable. Please try again.';
    }
  }

  function stopVoicePlayback() {
    if (NitaState.synth) {
      NitaState.synth.cancel();
      NitaState.isSpeaking = false;
      updateVoiceUI();
    }
  }

  function toggleMuteSpeech() {
    NitaState.soundEnabled = !NitaState.soundEnabled;
    if (!NitaState.soundEnabled) stopVoicePlayback();
    const btn = document.getElementById('mute-voice-btn');
    if (btn) btn.innerText = NitaState.soundEnabled ? 'Mute Voice' : 'Unmute Voice';
  }

  function updateVoiceUI() {
    const statusText = document.getElementById('voice-status-text');
    const micBtn = document.getElementById('mic-trigger-btn');
    if (!statusText || !micBtn) return;

    if (NitaState.isListening) {
      statusText.innerText = 'Listening to microphone...';
      micBtn.style.background = '#10B981';
    } else if (NitaState.isSpeaking) {
      statusText.innerText = 'Speaking response...';
      micBtn.style.background = 'var(--gold-500)';
    } else {
      micBtn.style.background = 'var(--gold-500)';
    }
  }

  // Real Live Microphone Waveform Visualizer (draws zero fake waves when mic is inactive)
  function initVisualizerCanvas() {
    const canvas = document.getElementById('voice-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function renderWave() {
      if (!NitaState.isOpen || !NitaState.isVoiceMode) {
        NitaState.canvasAnimId = null;
        return;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (NitaState.analyser && NitaState.isListening) {
        const dataArray = new Uint8Array(NitaState.analyser.frequencyBinCount);
        NitaState.analyser.getByteFrequencyData(dataArray);
        const barW = canvas.width / dataArray.length;
        ctx.fillStyle = '#10B981';
        for (let i = 0; i < dataArray.length; i++) {
          const h = Math.max(2, (dataArray[i] / 255) * (canvas.height - 8));
          ctx.fillRect(i * barW, (canvas.height - h) / 2, Math.max(2, barW - 2), h);
        }
      } else {
        // Flat baseline line when not actively capturing microphone audio
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#475569';
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }

      NitaState.canvasAnimId = requestAnimationFrame(renderWave);
    }

    NitaState.startWaveLoop = function () {
      if (!NitaState.canvasAnimId) renderWave();
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNitaUI);
  } else {
    injectNitaUI();
  }

})();
