/* ============================================================
   KCHORST.COM — Main JS
   ============================================================ */

// ============================================================
// GITHUB REPOSITORIES
// ============================================================

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

// Repository category mapping (repos can appear in multiple categories)
const repoCategories = {
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
    return [];
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

// Render a single repository card
function renderRepoCard(repo) {
  var description = repo.description || 'No description available.';
  var language = repo.language || 'Various';
  var stars = repo.stargazers_count;
  var forks = repo.forks_count;
  var updated = new Date(repo.updated_at).toLocaleDateString();
  var imageUrl = repoImages[repo.name] || null;
  
  var imageHtml = '';
  if (imageUrl) {
    imageHtml = '<div class="repo-image"><img src="' + imageUrl + '" alt="' + repo.name + ' screenshot" loading="lazy" /></div>';
  }
  
  var cardHtml = '<div class="repo-card">' + imageHtml + 
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
