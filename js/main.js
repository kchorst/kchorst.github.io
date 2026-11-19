/* ============================================================
   KCHORST.COM — Main JS
   ============================================================ */

// ============================================================
// GITHUB REPOSITORIES
// ============================================================

// Category definitions with descriptions
const categories = {
  'travel-tools': {
    name: 'Travel Tools',
    description: 'Browser-based tools for researching entry requirements and preparing trips, with offline access on mobile and desktop.',
    icon: '🌍'
  },
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

// Repository category mapping (repos can appear in multiple categories)
const repoCategories = {
  'VisaBrowser': ['travel-tools'],
  'Travel-Prep': ['travel-tools'],
  'Ai-Chat-Navigator': ['browser-extensions', 'llm-related'],
  'LLM-Tester': ['browser-extensions', 'llm-related'],
  'LLM-Radar': ['llm-related'],
  'Sentinel-Plus': ['browser-extensions'],
  'Textify': ['browser-extensions'],
  'tps-meter': ['browser-extensions', 'llm-related'],
  'Web-Time-Machine': ['browser-extensions'],
  'alphabets': ['standalone-apps'],
  'kanji': ['standalone-apps'],
  'kanji-web': ['standalone-apps'],
  'mylangapp': ['standalone-apps'],
  'mylangapp-web': ['standalone-apps'],
  'SLPR-The-Sleep-App': ['standalone-apps'],
  'LLM-Parametizer': ['llm-related'],
  'audio-prep-suite': ['audio-video'],
  'youtube-movie-creator-toolkit': ['audio-video'],
  'MIDI-Performer': ['midi-related'],
  'MIDI-Remixer': ['midi-related'],
  'MIDI-Library-Manager': ['midi-related']
};

// Repository images from kchorst repository assets
const repoImages = {
  'VisaBrowser': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/VisaBrowser.jpg',
  'Travel-Prep': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/Travel-Prep.jpg',
  'alphabets': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/Alphabets%201.png',
  'kanji': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/kanji1.png',
  'kanji-web': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/kanji1.png',
  'mylangapp': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/Mylangapp1.png',
  'mylangapp-web': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/Mylangapp1.png',
  'audio-prep-suite': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/Audio%20Prep%20Suite%201.jpg',
  'LLM-Radar': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/LLM%20Radar%201.jpg',
  'LLM-Tester': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/LLM%20Tester%201.jpg',
  'MIDI-Library-Manager': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/MIDI%20Library%20Manager%201.jpg',
  'MIDI-Remixer': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/MIDI%20Remixer%201.jpg',
  'SLPR-The-Sleep-App': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/SLPR%201.png',
  'youtube-movie-creator-toolkit': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/youtube-movie-creator-toolkit%201.jpg',

  'Textify': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/textify.png',
  'Web-Time-Machine': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/web-time-machine.png',
  'LLM-Parametizer': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/LLM-Parametizer.png',
  'Sentinel-Plus': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/Sentinel-Plus.png',
  'MIDI-Performer': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/MIDI-Performer.png',
  'Ai-Chat-Navigator': 'https://raw.githubusercontent.com/kchorst/kchorst/main/assets/AI-Chat-Navigator.png'
};

// Repositories to exclude (portfolio/meta)
const excludedRepos = ['kchorst', 'kchorst.github.io'];

// Fetch GitHub repositories
async function fetchGitHubRepos() {
  var username = 'kchorst';
  
  try {
    var response = await fetch('https://api.github.com/users/' + username + '/repos?per_page=100', {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch repositories');
    
    var repos = await response.json();
    
    // Filter out excluded repos and sort by updated date
    var filteredRepos = repos
      .filter(function(repo) { return !excludedRepos.includes(repo.name); })
      .sort(function(a, b) { return new Date(b.updated_at) - new Date(a.updated_at); });
    
    return filteredRepos;
  } catch (error) {
    console.error('Error fetching repos:', error);
    return Object.keys(repoCategories).map(function(name) {
      return {name: name, html_url: 'https://github.com/kchorst/' + name,
        description: repoDescriptions[name], snapshot: true};
    });
  }
}

// Group repositories by category
function groupReposByCategory(repos) {
  var grouped = {};
  
  // Initialize all categories
  Object.keys(categories).forEach(function(key) {
    grouped[key] = [];
  });
  
  // Assign repos to categories
  repos.forEach(function(repo) {
    var assignedCategories = repoCategories[repo.name] || [];
    assignedCategories.forEach(function(category) {
      if (grouped[category]) {
        grouped[category].push(repo);
      }
    });
  });
  
  return grouped;
}

const repoDescriptions = {
  "LLM-Radar": "A phone-first local AI proofing tool that instantly connects mobile devices and workstations to a shared local LLM server via QR code scan for private local testing.",
  "LLM-Parametizer": "Comprehensive local LLM management suite for selecting, downloading, chatting, RAG setup, autotuning, benchmarking, and reporting.",
  "LLM-Tester": "Browser extension designed to discover locally running LLM endpoints and test chat functionality.",
  "Ai-Chat-Navigator": "Browser extension to view, search, and distill all your AI chat histories.",
  "tps-meter": "Super simple Chrome extension for real-time tokens-per-second measurement against local LLM endpoints.",
  "Textify": "Browser extension to convert images from any webpage into ASCII art directly in your browser.",
  "Web-Time-Machine": "Edge/Chromium browser extension providing a quick look at early eras of website design (CERN, AOL/Prodigy, Web 2.0).",
  "Sentinel-Plus": "Productivity and web utility extension.",
  "alphabets": "React Native / Expo application for exploring world writing systems.",
  "kanji": "React Native app and PWA for learning Japanese Kanji.",
  "kanji-web": "React Native app and PWA for learning Japanese Kanji.",
  "mylangapp": "React Native app and PWA for learning everyday vocabulary across multiple languages.",
  "mylangapp-web": "React Native app and PWA for learning everyday vocabulary across multiple languages.",
  "SLPR-The-Sleep-App": "Interval-based auditory word visualization application designed for sleep aid.",
  "MIDI-Remixer": "Public MIDI mashup and arrangement workstation with Guided Mash, Version Fusion, and assisted workflows.",
  "MIDI-Library-Manager": "Windows MIDI library manager for scanning, analyzing, organizing, reviewing, playing, and maintaining large MIDI collections.",
  "MIDI-Performer": "Helps musicians turn rigid MIDI files into expressive performances using instrument libraries, musical interpretation, and score guidance.",
  "audio-prep-suite": "Modular Python toolkit for BPM detection, key finding, silence trimming, normalization, and audio conversion.",
  "youtube-movie-creator-toolkit": "Python pipeline for automatically producing and publishing videos to YouTube."
,
  'VisaBrowser': 'Mobile-friendly visa and entry-requirements browser with passport-specific destination guidance and offline access.',
  'Travel-Prep': 'Offline-capable travel reference and trip planner with sourced destination profiles, preparation guidance, and country itineraries.'
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, function(character) {
    return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[character];
  });
}

// Render a single repository card
function renderRepoCard(repo) {
  var description = escapeHtml(repoDescriptions[repo.name] || repo.description || 'No description available.');
  var language = repo.language || 'Various';
  var stars = repo.stargazers_count;
  var forks = repo.forks_count;
  var updated = new Date(repo.updated_at).toLocaleDateString();
  var imageUrl = repoImages[repo.name] || null;
  
  var imageHtml = '';
  if (imageUrl) {
    imageHtml = '<div class="repo-image"><img src="' + imageUrl + '" alt="' + escapeHtml(repo.name) + ' screenshot" loading="lazy" /></div>';
  }
  
  var cardHtml = '<div class="repo-card">' + imageHtml + 
    '<div class="repo-header">' +
    '<h3 class="repo-name">' + escapeHtml(repo.name) + '</h3>' +
    '<a aria-label="View ' + escapeHtml(repo.name) + ' on GitHub" href="' + escapeHtml(repo.html_url) + '" class="repo-link" target="_blank" rel="noopener">' +
    '<span class="repo-arrow">→</span></a></div>' +
    '<p class="repo-description">' + description + '</p>' +
    (repo.snapshot ? '' : '<div class="repo-meta">' +
    '<span class="repo-language">' + language + '</span>' +
    '<span class="repo-stats">★ ' + stars + '</span>' +
    '<span class="repo-stats">🍴 ' + forks + '</span>' +
    '<span class="repo-updated">Updated ' + updated + '</span></div>') + '</div>';
  
  return cardHtml;
}

// Render all categories and their repositories
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
      var reposHtml = repos.map(renderRepoCard).join('');
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

// Initialize GitHub repositories section
async function initGitHubRepos() {
  var container = document.getElementById('github-repos-container');
  if (!container) return;
  
  container.innerHTML = '<p class="loading-text">Loading repositories...</p>';
  
  var repos = await fetchGitHubRepos();
  var groupedRepos = groupReposByCategory(repos);
  renderCategorizedRepos(groupedRepos);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  initGitHubRepos();
});