/* ============================================================
   KCHORST.COM — Main JS with Multi-Image Carousel & Lightbox
   ============================================================ */

// Category definitions with descriptions
const categories = {
  'browser-extensions': {
    name: 'Browser Extensions',
    description: 'Chrome and browser extensions that enhance productivity, manage AI conversations, and provide creative tools. Built with Manifest V3, service workers, and modern browser APIs.',
    icon: '🌐'
  },
  'standalone-apps': {
    name: 'Standalone Apps',
    description: 'React Native and Expo applications for language learning, education, and utilities. Deployed as mobile apps and PWAs serving users across multiple platforms.',
    icon: '📱'
  },
  'llm-related': {
    name: 'LLM Related',
    description: 'Tools for working with local Large Language Models including parameter exploration, benchmarking, testing, and optimization. Privacy-focused solutions that keep AI capabilities local.',
    icon: '🤖'
  },
  'audio-video': {
    name: 'Audio/Video Related',
    description: 'Python toolkits for audio processing, video automation, and content creation pipelines. Practical solutions for musicians, content creators, and media professionals.',
    icon: '🎵'
  },
  'midi-related': {
    name: 'MIDI Related',
    description: 'Specialized tools for MIDI file processing, score alignment, and musical performance enhancement. Bridge the gap between digital notation and expressive performance.',
    icon: '🎹'
  }
};

// Complete Repository Category Mapping
const repoCategories = {
  'Ai-Chat-Navigator': ['browser-extensions', 'llm-related'],
  'LLM-Tester': ['browser-extensions', 'llm-related'],
  'LLM-Radar': ['llm-related'],
  'LLM-Parametizer': ['llm-related'],
  'tps-meter': ['browser-extensions', 'llm-related'],
  'Sentinel-Plus': ['browser-extensions'],
  'Textify': ['browser-extensions'],
  'Web-Time-Machine': ['browser-extensions'],
  'alphabets': ['standalone-apps'],
  'kanji': ['standalone-apps'],
  'kanji-web': ['standalone-apps'],
  'mylangapp': ['standalone-apps'],
  'mylangapp-web': ['standalone-apps'],
  'SLPR-The-Sleep-App': ['standalone-apps'],
  'audio-prep-suite': ['audio-video'],
  'youtube-movie-creator-toolkit': ['audio-video'],
  'MIDI-Performer': ['midi-related'],
  'MIDI-Remixer': ['midi-related'],
  'MIDI-Library-Manager': ['midi-related']
};

// Asset Mappings (Supports single URL strings OR Arrays for Multi-Image Carousels)
const repoImages = {
  'Ai-Chat-Navigator': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/AI-Chat-Navigator.png',
  'LLM-Radar': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/LLM%20Radar%201.jpg',
  'LLM-Tester': [
    'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/LLM%20Tester%201.jpg',
    'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/LLM%20Tester%202.jpg'
  ],
  'LLM-Parametizer': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/LLM-Parametizer.png',
  'alphabets': [
    'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/Alphabets%201.png',
    'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/Alphabets%202.png',
    'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/Alphabets%203.png',
    'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/Alphabets%204.png'
  ],
  'SLPR-The-Sleep-App': [
    'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/SLPR%201.png',
    'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/SLPR%202.png',
    'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/SLPR%203.png'
  ],
  'audio-prep-suite': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/Audio%20Prep%20Suite%201.jpg',
  'MIDI-Library-Manager': [
    'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/MIDI%20Library%20Manager%201.jpg',
    'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/MIDI%20Library%20Manager%202.jpg'
  ],
  'MIDI-Remixer': [
    'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/MIDI%20Remixer%201.jpg',
    'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/MIDI%20Remixer%202.jpg',
    'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/MIDI%20Remixer%203.jpg',
    'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/MIDI%20Remixer%204.jpg'
  ],
  'MIDI-Performer': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/MIDI-Performer.png',
  'Sentinel-Plus': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/Sentinel-Plus.png',
  'Textify': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/textify.png',
  'Web-Time-Machine': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/web-time-machine.png',
  'youtube-movie-creator-toolkit': [
    'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/youtube%20movie%20creator%20toolkit%201.jpg',
    'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/youtube%20movie%20creator%20toolkit%202.jpg'
  ]
};

// Global Store for Lightbox State
let currentLightboxImages = [];
let currentLightboxIndex = 0;
let currentLightboxTitle = '';

const excludedRepos = ['kchorst', 'kchorst.github.io'];

// Fetch GitHub repositories
async function fetchGitHubRepos() {
  var username = 'kchorst';
  try {
    var response = await fetch('https://api.github.com/users/' + username + '/repos?per_page=100', {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!response.ok) throw new Error('Failed to fetch repositories');
    var repos = await response.json();
    return repos
      .filter(function(repo) { return !excludedRepos.includes(repo.name); })
      .sort(function(a, b) { return new Date(b.updated_at) - new Date(a.updated_at); });
  } catch (error) {
    console.error('Error fetching repos:', error);
    return [];
  }
}

function groupReposByCategory(repos) {
  var grouped = {};
  Object.keys(categories).forEach(function(key) { grouped[key] = []; });
  repos.forEach(function(repo) {
    var assignedCategories = repoCategories[repo.name] || [];
    assignedCategories.forEach(function(category) {
      if (grouped[category]) grouped[category].push(repo);
    });
  });
  return grouped;
}

// Render Repository Card with Carousel Support
function renderRepoCard(repo, categoryKey) {
  var description = repo.description || 'No description available.';
  var language = repo.language || 'Various';
  var stars = repo.stargazers_count;
  var forks = repo.forks_count;
  var updated = new Date(repo.updated_at).toLocaleDateString();
  
  var imageData = repoImages[repo.name] || null;
  var images = Array.isArray(imageData) ? imageData : (imageData ? [imageData] : []);
  
  var imageHtml = '';
  if (images.length > 0) {
    const cardId = 'carousel-' + categoryKey + '-' + repo.name.replace(/[^a-zA-Z0-9]/g, '-');
    const encodedImages = encodeURIComponent(JSON.stringify(images));
    
    var slidesHtml = images.map(function(url, idx) {
      var activeClass = idx === 0 ? ' active' : '';
      return '<img src="' + url + '" class="carousel-slide' + activeClass + '" alt="' + repo.name + ' screenshot ' + (idx + 1) + '" loading="lazy" onclick="openLightbox(\'' + repo.name + '\', ' + idx + ', \'' + encodedImages + '\')" />';
    }).join('');

    var controlsHtml = '';
    if (images.length > 1) {
      var dotsHtml = images.map(function(_, idx) {
        var activeDot = idx === 0 ? ' active' : '';
        return '<span class="carousel-dot' + activeDot + '" onclick="event.stopPropagation(); setCarouselSlide(\'' + cardId + '\', ' + idx + ')"></span>';
      }).join('');

      controlsHtml = '<button class="carousel-btn prev" onclick="event.stopPropagation(); prevCarouselSlide(\'' + cardId + '\')">&#10094;</button>' +
                     '<button class="carousel-btn next" onclick="event.stopPropagation(); nextCarouselSlide(\'' + cardId + '\')">&#10095;</button>' +
                     '<div class="carousel-dots">' + dotsHtml + '</div>';
    }

    imageHtml = '<div class="repo-image-container" id="' + cardId + '" data-current="0" data-total="' + images.length + '">' +
                  slidesHtml + controlsHtml +
                '</div>';
  }

  return '<div class="repo-card">' + imageHtml + 
    '<div class="repo-header">' +
    '<h3 class="repo-name">' + repo.name + '</h3>' +
    '<a href="' + repo.html_url + '" class="repo-link" target="_blank" rel="noopener">' +
    '<span class="repo-arrow">→</span></a></div>' +
    '<p class="repo-description">' + description + '</p>' +
    '<div class="repo-meta">' +
    '<span class="repo-language">' + language + '</span>' +
    '<span class="repo-stats">★ ' + stars + '</span>' +
    '<span class="repo-stats">🍴 ' + forks + '</span>' +
    '<span class="repo-updated">Updated ' + updated + '</span></div></div>';
}

// Carousel Interactions
function setCarouselSlide(cardId, targetIndex) {
  const container = document.getElementById(cardId);
  if (!container) return;
  const total = parseInt(container.getAttribute('data-total'), 10);
  const index = (targetIndex + total) % total;
  
  container.setAttribute('data-current', index);
  const slides = container.querySelectorAll('.carousel-slide');
  const dots = container.querySelectorAll('.carousel-dot');
  
  slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
}

function nextCarouselSlide(cardId) {
  const container = document.getElementById(cardId);
  if (!container) return;
  const current = parseInt(container.getAttribute('data-current'), 10);
  setCarouselSlide(cardId, current + 1);
}

function prevCarouselSlide(cardId) {
  const container = document.getElementById(cardId);
  if (!container) return;
  const current = parseInt(container.getAttribute('data-current'), 10);
  setCarouselSlide(cardId, current - 1);
}

// Fullscreen Lightbox Functions
function openLightbox(title, index, encodedImages) {
  currentLightboxTitle = title;
  currentLightboxImages = JSON.parse(decodeURIComponent(encodedImages));
  currentLightboxIndex = index;
  
  updateLightbox();
  const modal = document.getElementById('lightbox-modal');
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function updateLightbox() {
  const img = document.getElementById('lightbox-img');
  const caption = document.getElementById('lightbox-caption');
  
  img.src = currentLightboxImages[currentLightboxIndex];
  caption.textContent = currentLightboxTitle + ' (' + (currentLightboxIndex + 1) + ' / ' + currentLightboxImages.length + ')';
}

function nextLightboxImage() {
  if (currentLightboxImages.length <= 1) return;
  currentLightboxIndex = (currentLightboxIndex + 1) % currentLightboxImages.length;
  updateLightbox();
}

function prevLightboxImage() {
  if (currentLightboxImages.length <= 1) return;
  currentLightboxIndex = (currentLightboxIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length;
  updateLightbox();
}

function renderCategorizedRepos(groupedRepos) {
  const container = document.getElementById('github-repos-container');
  if (!container) return;
  
  if (Object.keys(groupedRepos).every(key => groupedRepos[key].length === 0)) {
    container.innerHTML = '<p>No repositories found.</p>';
    return;
  }
  
  var html = '';
  Object.keys(categories).forEach(function(categoryKey) {
    var category = categories[categoryKey];
    var repos = groupedRepos[categoryKey];
    
    if (repos.length > 0) {
      var reposHtml = repos.map(repo => renderRepoCard(repo, categoryKey)).join('');
      html += '<div class="repo-category">' +
        '<div class="category-header">' +
        '<span class="category-icon">' + category.icon + '</span>' +
        '<h2 class="category-title">' + category.name + '</h2></div>' +
        '<p class="category-description">' + category.description + '</p>' +
        '<div class="repo-grid">' + reposHtml + '</div></div>';
    }
  });
  container.innerHTML = html;
}

async function initGitHubRepos() {
  var container = document.getElementById('github-repos-container');
  if (!container) return;
  
  container.innerHTML = '<p class="loading-text">Loading repositories...</p>';
  var repos = await fetchGitHubRepos();
  var groupedRepos = groupReposByCategory(repos);
  renderCategorizedRepos(groupedRepos);
  setupLightboxListeners();
}

function setupLightboxListeners() {
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-overlay').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', prevLightboxImage);
  document.getElementById('lightbox-next').addEventListener('click', nextLightboxImage);
  
  document.addEventListener('keydown', function(e) {
    const modal = document.getElementById('lightbox-modal');
    if (modal.classList.contains('hidden')) return;
    
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextLightboxImage();
    if (e.key === 'ArrowLeft') prevLightboxImage();
  });
}

document.addEventListener('DOMContentLoaded', function() {
  initGitHubRepos();
});