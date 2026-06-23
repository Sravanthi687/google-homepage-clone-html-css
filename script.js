// ==========================================================================
// Google Homepage Clone Scripting
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Theme Swapping System ---
  const htmlElement = document.documentElement;
  const themeHubTrigger = document.getElementById('themeHubTrigger');
  const themeOptions = document.getElementById('themeOptions');
  const themeOptButtons = document.querySelectorAll('.theme-opt-btn');

  // Toggle Theme Hub Options Menu
  themeHubTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    document.querySelector('.theme-hub').classList.toggle('active');
  });

  // Switch Themes
  themeOptButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedTheme = btn.getAttribute('data-theme-val');
      
      // Update data attribute & save state
      htmlElement.setAttribute('data-theme', selectedTheme);
      localStorage.setItem('google-clone-theme', selectedTheme);

      // Active state class toggle
      themeOptButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Setup gradient definitions for Glass logo if switching to glass theme
      if (selectedTheme === 'glass') {
        injectGlassGradient();
      } else {
        removeGlassGradient();
      }

      // Close Hub
      document.querySelector('.theme-hub').classList.remove('active');
    });
  });

  // Load Saved Theme
  const savedTheme = localStorage.getItem('google-clone-theme') || 'light';
  htmlElement.setAttribute('data-theme', savedTheme);
  const activeBtn = document.querySelector(`.theme-opt-btn[data-theme-val="${savedTheme}"]`);
  if (activeBtn) {
    themeOptButtons.forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');
  }

  if (savedTheme === 'glass') {
    injectGlassGradient();
  }

  // Inject SVG Gradient for glass logo animations
  function injectGlassGradient() {
    const svg = document.querySelector('.google-logo');
    if (svg && !document.getElementById('glassGradient')) {
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defs.innerHTML = `
        <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#a78bfa" />
          <stop offset="50%" stop-color="#60a5fa" />
          <stop offset="100%" stop-color="#22d3ee" />
        </linearGradient>
      `;
      svg.prepend(defs);
    }
  }

  function removeGlassGradient() {
    const defs = document.querySelector('.google-logo defs');
    if (defs) defs.remove();
  }

  // --- Popovers (Apps Drawer & Profile Menu) ---
  const appsBtn = document.getElementById('appsBtn');
  const appsDrawer = document.getElementById('appsDrawer');
  const profileBtn = document.getElementById('profileBtn');
  const profileMenu = document.getElementById('profileMenu');

  // Toggle Apps Drawer
  appsBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    appsDrawer.classList.toggle('active');
    profileMenu.classList.remove('active');
    document.querySelector('.theme-hub').classList.remove('active');
  });

  // Toggle Profile Menu
  profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileMenu.classList.toggle('active');
    appsDrawer.classList.remove('active');
    document.querySelector('.theme-hub').classList.remove('active');
  });

  // --- Search Bar Autocomplete Dropdown ---
  const searchInput = document.getElementById('searchInput');
  const searchBarContainer = document.getElementById('searchBarContainer');
  const suggestionsList = document.getElementById('suggestionsList');

  // Focus Styles and Suggestions display
  searchInput.addEventListener('focus', () => {
    searchBarContainer.classList.add('focus');
  });

  // Soft blur implementation to register item clicks
  document.addEventListener('click', (e) => {
    // If clicking outside search bar container, remove focus styles
    if (!searchBarContainer.contains(e.target)) {
      searchBarContainer.classList.remove('focus');
    }
    
    // Close App/Profile popovers if clicking outside
    if (!appsBtn.contains(e.target) && !appsDrawer.contains(e.target)) {
      appsDrawer.classList.remove('active');
    }
    if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
      profileMenu.classList.remove('active');
    }
    if (!document.querySelector('.theme-hub').contains(e.target)) {
      document.querySelector('.theme-hub').classList.remove('active');
    }
  });

  // Delete suggestions history items
  const deleteBtn = document.querySelectorAll('.delete-suggestion');
  deleteBtn.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Avoid triggering suggestion search click
      const item = btn.closest('.suggestion-item');
      item.style.opacity = '0';
      item.style.transform = 'translateX(20px)';
      setTimeout(() => {
        item.remove();
      }, 200);
    });
  });

  // Suggestion Item Clicks
  const suggestionItems = document.querySelectorAll('.suggestion-item');
  suggestionItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (e.target.closest('.delete-suggestion')) return;
      const text = item.querySelector('.suggestion-text').textContent;
      searchInput.value = text;
      searchBarContainer.classList.remove('focus');
      simulateSearch(text);
    });
  });

  // Submit Search simulation
  const searchSubmitBtn = document.getElementById('searchSubmitBtn');
  searchSubmitBtn.addEventListener('click', () => {
    if (searchInput.value.trim() !== '') {
      simulateSearch(searchInput.value);
    }
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && searchInput.value.trim() !== '') {
      simulateSearch(searchInput.value);
    }
  });

  function simulateSearch(query) {
    alert(`Searching Google for: "${query}" (Simulated redirection)`);
  }

  // --- Voice Search Simulator ---
  const voiceSearchBtn = document.getElementById('voiceSearchBtn');
  const voiceSearchModal = document.getElementById('voiceSearchModal');
  const closeVoiceModal = document.getElementById('closeVoiceModal');
  let voiceTimer;

  voiceSearchBtn.addEventListener('click', () => {
    voiceSearchModal.classList.add('active');
    
    // Simulate speech detection
    voiceTimer = setTimeout(() => {
      document.querySelector('.voice-status').textContent = '"CSS layout cheatsheet"';
      setTimeout(() => {
        searchInput.value = 'CSS layout cheatsheet';
        voiceSearchModal.classList.remove('active');
        document.querySelector('.voice-status').textContent = 'Listening...';
        simulateSearch('CSS layout cheatsheet');
      }, 1200);
    }, 2500);
  });

  closeVoiceModal.addEventListener('click', () => {
    clearTimeout(voiceTimer);
    voiceSearchModal.classList.remove('active');
    document.querySelector('.voice-status').textContent = 'Listening...';
  });

  // --- Google Lens Image Search Simulator ---
  const lensSearchBtn = document.getElementById('lensSearchBtn');
  const lensModal = document.getElementById('lensModal');
  const closeLensModal = document.getElementById('closeLensModal');
  const lensDropzone = document.getElementById('lensDropzone');
  const lensFileInput = document.getElementById('lensFileInput');

  lensSearchBtn.addEventListener('click', () => {
    lensModal.classList.add('active');
  });

  closeLensModal.addEventListener('click', () => {
    lensModal.classList.remove('active');
  });

  // Drag and drop events
  lensDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    lensDropzone.classList.add('dragover');
  });

  lensDropzone.addEventListener('dragleave', () => {
    lensDropzone.classList.remove('dragover');
  });

  lensDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    lensDropzone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      simulateImageUpload(files[0].name);
    }
  });

  lensDropzone.addEventListener('click', () => {
    lensFileInput.click();
  });

  lensFileInput.addEventListener('change', () => {
    if (lensFileInput.files.length > 0) {
      simulateImageUpload(lensFileInput.files[0].name);
    }
  });

  function simulateImageUpload(filename) {
    const dropzoneContent = lensDropzone.innerHTML;
    lensDropzone.innerHTML = `
      <div class="voice-wave-container" style="height: 40px;">
        <span class="wave-bar bar-1"></span>
        <span class="wave-bar bar-2"></span>
        <span class="wave-bar bar-3"></span>
      </div>
      <p style="margin-top: 10px;">Scanning image: <strong>${filename}</strong>...</p>
    `;
    
    setTimeout(() => {
      lensModal.classList.remove('active');
      searchInput.value = `matches for visual search: ${filename}`;
      lensDropzone.innerHTML = dropzoneContent;
      simulateSearch(`visual search matches for ${filename}`);
    }, 2000);
  }

  // --- I'm Feeling Lucky Button Behavior ---
  const luckyBtn = document.getElementById('luckyBtn');
  const luckyPhrases = [
    "I'm Feeling Doodly",
    "I'm Feeling Playful",
    "I'm Feeling Artistic",
    "I'm Feeling Hungry",
    "I'm Feeling Trendy",
    "I'm Feeling Curious",
    "I'm Feeling Quantum",
    "I'm Feeling Stellar"
  ];

  luckyBtn.addEventListener('click', () => {
    // Pick random feeling
    const randomIndex = Math.floor(Math.random() * luckyPhrases.length);
    const selectedPhrase = luckyPhrases[randomIndex];
    luckyBtn.textContent = selectedPhrase;

    // Trigger visual effect in Glass mode
    if (htmlElement.getAttribute('data-theme') === 'glass') {
      triggerConfetti();
    }
    
    setTimeout(() => {
      // Revert text
      luckyBtn.textContent = "I'm Feeling Lucky";
    }, 3000);
  });

  function triggerConfetti() {
    // Create floating glowing particles for a brief animation
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'glow-particle';
      particle.style.cssText = `
        position: fixed;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background: linear-gradient(135deg, #a78bfa, #22d3ee);
        border-radius: 50%;
        top: 50%;
        left: 50%;
        box-shadow: 0 0 10px rgba(99, 102, 241, 0.8);
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 3000;
        animation: burstParticle ${Math.random() * 1.5 + 0.8}s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
      `;
      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 2500);
    }

    // Add particle keyframe styles dynamically if not existing
    if (!document.getElementById('burstKeyframes')) {
      const style = document.createElement('style');
      style.id = 'burstKeyframes';
      style.innerHTML = `
        @keyframes burstParticle {
          to {
            transform: translate(
              calc(-50% + ${Math.random() * 400 - 200}px),
              calc(-50% + ${Math.random() * 400 - 200}px)
            ) scale(0);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
});
