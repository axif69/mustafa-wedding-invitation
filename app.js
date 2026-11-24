/**
 * ========================================================
 * WEDDING INVITATION - MUSTAFA & ZAINAB
 * Core Interactive Logic: 3D Door Knocking, Audio Synthesis,
 * Floating Petals, Countdown, & Dynamic Guest Customization
 * ========================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  // DOM Elements
  const doorOverlay = document.getElementById('doorOverlay');
  const doorPortal = document.querySelector('.door-portal');
  const knockerWrapper = document.getElementById('knockerWrapper');
  const knockerRing = document.getElementById('knockerRing');
  const mainInvitation = document.getElementById('mainInvitation');
  const audioToggle = document.getElementById('audioToggle');
  const reopenDoorBtn = document.getElementById('reopenDoorBtn');
  const weddingAudio = document.getElementById('weddingAudio');

  // View Switchers
  const btnShowInteractive = document.getElementById('btnShowInteractive');
  const btnShowOriginal = document.getElementById('btnShowOriginal');
  const interactiveCardView = document.getElementById('interactiveCardView');
  const originalCardView = document.getElementById('originalCardView');

  // Personalization Modal
  const guestBanner = document.getElementById('guestBanner');
  const displayGuestName = document.getElementById('displayGuestName');
  const coverGuestName = document.getElementById('coverGuestName');
  const openPersonalizeModal = document.getElementById('openPersonalizeModal');
  const guestModal = document.getElementById('guestModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const customGuestInput = document.getElementById('customGuestInput');
  const modalPreviewName = document.getElementById('modalPreviewName');
  const copyCustomLinkBtn = document.getElementById('copyCustomLinkBtn');
  const sendDirectWhatsAppBtn = document.getElementById('sendDirectWhatsAppBtn');
  const shareInvitationBtn = document.getElementById('shareInvitationBtn');
  const toastNotification = document.getElementById('toastNotification');
  const addToCalendarBtn = document.getElementById('addToCalendarBtn');

  // Audio & State
  let audioCtx = null;
  let isMusicPlaying = false;
  let musicInterval = null;
  let isDoorOpen = false;

  // ========================================================
  // 1. WEB AUDIO SYNTHESIZER (Knock sound & Royal Drone)
  // ========================================================
  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Realistic Acoustic Door Knock (Heavy wood body + brass ring click)
  function playDoorKnockSound() {
    if (!audioCtx) initAudioContext();
    const now = audioCtx.currentTime;

    // Knock 1
    createSingleKnock(now);
    // Knock 2
    createSingleKnock(now + 0.16);
    // Knock 3
    createSingleKnock(now + 0.35);
  }

  function createSingleKnock(time) {
    if (!audioCtx) return;

    // Wood body resonance (low frequency thump)
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, time);
    osc.frequency.exponentialRampToValueAtTime(35, time + 0.12);

    gain.gain.setValueAtTime(0.8, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.16);

    // Brass knocker strike click (high frequency metallic clack)
    const clickOsc = audioCtx.createOscillator();
    const clickGain = audioCtx.createGain();
    clickOsc.type = 'square';
    clickOsc.frequency.setValueAtTime(950, time);
    clickOsc.frequency.exponentialRampToValueAtTime(300, time + 0.04);

    clickGain.gain.setValueAtTime(0.35, time);
    clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    clickOsc.connect(clickGain);
    clickGain.connect(audioCtx.destination);
    clickOsc.start(time);
    clickOsc.stop(time + 0.06);
  }

  // Authentic Islamic Wedding Background Music Player
  function startRoyalMelody() {
    isMusicPlaying = true;
    audioToggle.classList.add('playing');

    if (weddingAudio) {
      weddingAudio.volume = 0.65;
      const playPromise = weddingAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback to synthesized melody if browser requires separate gesture
          fallbackSynthesizer();
        });
      }
    } else {
      fallbackSynthesizer();
    }
  }

  function stopRoyalMelody() {
    isMusicPlaying = false;
    audioToggle.classList.remove('playing');
    if (weddingAudio) {
      weddingAudio.pause();
    }
    if (musicInterval) {
      clearInterval(musicInterval);
      musicInterval = null;
    }
  }

  function fallbackSynthesizer() {
    if (!audioCtx) initAudioContext();
    const droneRoot = 146.83;
    const droneFifth = 220.00;
    playDronePad(droneRoot);
    playDronePad(droneFifth);

    const notes = [293.66, 329.63, 369.99, 440.00, 493.88, 554.37, 587.33];
    let noteIdx = 0;
    if (!musicInterval) {
      musicInterval = setInterval(() => {
        if (!isMusicPlaying) return;
        const note = notes[noteIdx % notes.length];
        playShehnaiNote(note);
        noteIdx = (noteIdx + Math.floor(Math.random() * 3) + 1);
      }, 1800);
    }
  }

  function playDronePad(freq) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
  }

  function playShehnaiNote(freq) {
    if (!audioCtx || !isMusicPlaying) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    // Subtle vibrato
    osc.frequency.linearRampToValueAtTime(freq * 1.01, now + 0.6);
    osc.frequency.linearRampToValueAtTime(freq, now + 1.2);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.06, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 1.6);
  }

  audioToggle.addEventListener('click', () => {
    initAudioContext();
    if (isMusicPlaying) {
      stopRoyalMelody();
    } else {
      startRoyalMelody();
    }
  });

  // ========================================================
  // 2. THE KNOCKING & DOOR OPENING EXPERIENCE
  // ========================================================
  function triggerDoorKnock() {
    if (isDoorOpen) return;
    initAudioContext();

    // 1. Animate Knocker Ring
    knockerRing.classList.add('knocking');
    
    // 2. Play Sound
    playDoorKnockSound();

    // 3. Haptic feedback on mobile devices
    if ('vibrate' in navigator) {
      try { navigator.vibrate([70, 50, 70, 50, 100]); } catch (e) {}
    }

    // 4. Burst Particles
    createParticleBurst();

    // 5. Open Doors after knocking sequence
    setTimeout(() => {
      doorPortal.classList.add('open');
      isDoorOpen = true;

      // Start music as doors swing wide
      startRoyalMelody();

      // Fade out door overlay and reveal main invitation
      setTimeout(() => {
        doorOverlay.classList.add('doors-unlocked');
        doorOverlay.classList.add('fade-out');
        mainInvitation.classList.remove('hidden');

        // Scroll to top of invitation
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 1200);

    }, 1100);
  }

  // Knock on click/tap
  knockerWrapper.addEventListener('click', (e) => {
    e.stopPropagation();
    triggerDoorKnock();
  });

  doorPortal.addEventListener('click', () => {
    triggerDoorKnock();
  });

  // Re-open door button
  reopenDoorBtn.addEventListener('click', () => {
    isDoorOpen = false;
    knockerRing.classList.remove('knocking');
    doorPortal.classList.remove('open');
    doorOverlay.classList.remove('fade-out');
    doorOverlay.classList.remove('doors-unlocked');
    window.scrollTo({ top: 0 });
  });

  // ========================================================
  // 3. FLOATING PETALS & GOLD PARTICLES (CANVAS)
  // ========================================================
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor(x, y, isBurst = false) {
      this.isBurst = isBurst;
      this.x = x !== undefined ? x : Math.random() * canvas.width;
      this.y = y !== undefined ? y : (isBurst ? canvas.height / 2 : -20);
      
      // Type: 0 = gold sparkle, 1 = red/pink rose petal
      this.type = Math.random() > 0.45 ? 'petal' : 'gold';

      if (this.type === 'petal') {
        this.size = Math.random() * 12 + 8;
        this.speedY = isBurst ? (Math.random() - 0.5) * 8 : Math.random() * 1.5 + 0.8;
        this.speedX = isBurst ? (Math.random() - 0.5) * 8 : Math.random() * 1.2 - 0.6;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.04;
        this.color = Math.random() > 0.5 ? 'rgba(215, 60, 80, ' : 'rgba(235, 120, 140, ';
        this.opacity = Math.random() * 0.5 + 0.4;
      } else {
        this.size = Math.random() * 3 + 1.5;
        this.speedY = isBurst ? (Math.random() - 0.5) * 12 : Math.random() * 1.8 + 0.5;
        this.speedX = isBurst ? (Math.random() - 0.5) * 12 : Math.random() * 1 - 0.5;
        this.color = 'rgba(212, 175, 55, ';
        this.opacity = Math.random() * 0.7 + 0.3;
      }
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      if (this.type === 'petal') {
        this.rotation += this.rotSpeed;
      }

      if (this.isBurst) {
        this.speedX *= 0.96;
        this.speedY = this.speedY * 0.96 + 0.1;
      }

      // Reset when off-screen
      if (this.y > canvas.height + 30) {
        if (!this.isBurst) {
          this.y = -20;
          this.x = Math.random() * canvas.width;
        }
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);

      if (this.type === 'petal') {
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = this.color + this.opacity + ')';
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Initialize ambient gentle particles
  for (let i = 0; i < 35; i++) {
    particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
  }

  function createParticleBurst() {
    for (let i = 0; i < 60; i++) {
      particles.push(new Particle(canvas.width / 2, canvas.height / 2, true));
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, idx) => {
      p.update();
      p.draw();
      if (p.isBurst && p.y > canvas.height + 40) {
        particles.splice(idx, 1);
      }
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ========================================================
  // 4. COUNTDOWN TIMER (Tuesday 19th January 2027)
  // ========================================================
  const weddingDate = new Date('January 19, 2027 20:00:00 GMT+0530').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance > 0) {
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById('cdDays').textContent = String(days).padStart(2, '0');
      document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
      document.getElementById('cdMinutes').textContent = String(minutes).padStart(2, '0');
      document.getElementById('cdSeconds').textContent = String(seconds).padStart(2, '0');
    } else {
      document.getElementById('countdownGrid').innerHTML = '<div class="auspicious-date-pill" style="font-size: 16px;">✨ Mubarak! The Blessed Celebration is Here! ✨</div>';
    }
  }
  setInterval(updateCountdown, 1000);
  updateCountdown();

  // ========================================================
  // 5. URL PARAMETER GUEST NAME PERSONALIZATION
  // ========================================================
  function parseGuestFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const guestParam = params.get('to') || params.get('guest') || params.get('name');
    if (guestParam) {
      const decoded = decodeURIComponent(guestParam.replace(/\+/g, ' ')).trim();
      setGuestName(decoded);
    } else {
      setGuestName('Respected Guest & Family');
    }
  }

  function setGuestName(name) {
    displayGuestName.textContent = name;
    coverGuestName.textContent = name;
  }
  parseGuestFromUrl();

  // Modal handlers
  openPersonalizeModal.addEventListener('click', () => {
    guestModal.classList.remove('hidden');
    customGuestInput.value = '';
    modalPreviewName.textContent = 'Respected Guest & Family';
    customGuestInput.focus();
  });

  closeModalBtn.addEventListener('click', () => {
    guestModal.classList.add('hidden');
  });

  guestModal.addEventListener('click', (e) => {
    if (e.target === guestModal) guestModal.classList.add('hidden');
  });

  customGuestInput.addEventListener('input', () => {
    const val = customGuestInput.value.trim();
    modalPreviewName.textContent = val.length ? val : 'Respected Guest & Family';
  });

  function getPersonalizedUrl() {
    const name = customGuestInput.value.trim() || 'Respected Guest & Family';
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?to=${encodeURIComponent(name)}`;
  }

  function showToast(msg) {
    toastNotification.textContent = msg;
    toastNotification.classList.remove('hidden');
    setTimeout(() => {
      toastNotification.classList.add('hidden');
    }, 2800);
  }

  copyCustomLinkBtn.addEventListener('click', () => {
    const url = getPersonalizedUrl();
    navigator.clipboard.writeText(url).then(() => {
      showToast('Personalized invitation link copied!');
      setGuestName(customGuestInput.value.trim() || 'Respected Guest & Family');
      guestModal.classList.add('hidden');
    });
  });

  sendDirectWhatsAppBtn.addEventListener('click', () => {
    const name = customGuestInput.value.trim() || 'Respected Guest & Family';
    const url = getPersonalizedUrl();
    const msg = `*Wedding Invitation of Mustafa & Zainab* 💍\n\nDear *${name}*,\n\nWe cordially invite you and your family to celebrate the wedding ceremony of our beloved son *Mustafa* with *Zainab* on *Tuesday, 19th January 2027* at *Hussaini Masjid Sahen, Bhopal*.\n\nPlease tap the royal link below to open your invitation:\n👉 ${url}\n\nWarm regards,\n*Shabbir Husain Alotwala & Family*`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    setGuestName(name);
    guestModal.classList.add('hidden');
  });

  shareInvitationBtn.addEventListener('click', () => {
    const guest = displayGuestName.textContent;
    const url = window.location.href;
    const msg = `*Wedding Invitation: Mustafa & Zainab* 💍\n\nCordially inviting you on *Tuesday, 19th January 2027* at *Hussaini Masjid Sahen, Bhopal*.\n\nTap to open the interactive invitation:\n👉 ${url}`;

    if (navigator.share) {
      navigator.share({
        title: 'Wedding Invitation | Mustafa & Zainab',
        text: msg,
        url: url
      }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    }
  });

  // ========================================================
  // 6. CARD VIEW SWITCHER
  // ========================================================
  btnShowInteractive.addEventListener('click', () => {
    btnShowInteractive.classList.add('active');
    btnShowOriginal.classList.remove('active');
    interactiveCardView.classList.remove('hidden');
    originalCardView.classList.add('hidden');
  });

  btnShowOriginal.addEventListener('click', () => {
    btnShowOriginal.classList.add('active');
    btnShowInteractive.classList.remove('active');
    interactiveCardView.classList.add('hidden');
    originalCardView.classList.remove('hidden');
  });

  // ========================================================
  // 7. CALENDAR INTEGRATION (Google Calendar & iCal)
  // ========================================================
  function setupCalendarLink() {
    const title = encodeURIComponent('Wedding: Mustafa & Zainab');
    const details = encodeURIComponent('Cordially invited to the wedding celebration of Mustafa (S/o Shabbir Husain Alotwala) & Zainab (D/o Quresh Bhai Salumberwala). Gents: 8:00 PM.');
    const location = encodeURIComponent('Hussaini Masjid Sahen, Malipura, Peergate, Bhopal, Madhya Pradesh, India');
    // 19 January 2027 from 20:00 to 23:00 IST (UTC: 14:30 to 17:30)
    const dates = '20270119T143000Z/20270119T173000Z';
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    
    addToCalendarBtn.href = gCalUrl;
  }
  setupCalendarLink();

});
