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
  'MIDI-Performer': ['midi-related']
};

// Repository images from blog posts
const repoImages = {
  'Textify': 'https://kchorst.com/wp-content/uploads/2026/08/audrey2-glitch.png',
  'Web-Time-Machine': 'https://kchorst.com/wp-content/uploads/2026/07/Screenshot-2026-07-29-102912.png',
  'LLM-Parametizer': 'https://kchorst.com/wp-content/uploads/2026/07/Screenshot-2026-07-06-101545.png',
  'Sentinel-Plus': 'https://kchorst.com/wp-content/uploads/2026/06/Screenshot-2026-06-28-095152.png',
  'MIDI-Performer': 'https://kchorst.com/wp-content/uploads/2026/07/Screenshot-2026-07-19-150042.png'
};

// Repositories to exclude (portfolio/meta)
const excludedRepos = ['kchorst', 'kchorst.github.io'];

// Fetch GitHub repositories
async function fetchGitHubRepos() {
  const username = 'kchorst';
  
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch repositories');
    
    const repos = await response.json();
    
    // Filter out excluded repos and sort by updated date
    const filteredRepos = repos
      .filter(repo => !excludedRepos.includes(repo.name))
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    
    return filteredRepos;
  } catch (error) {
    console.error('Error fetching repos:', error);
    return [];
  }
}

// Group repositories by category
function groupReposByCategory(repos) {
  const grouped = {};
  
  // Initialize all categories
  Object.keys(categories).forEach(key => {
    grouped[key] = [];
  });
  
  // Assign repos to categories
  repos.forEach(repo => {
    const assignedCategories = repoCategories[repo.name] || [];
    assignedCategories.forEach(category => {
      if (grouped[category]) {
        grouped[category].push(repo);
      }
    });
  });
  
  return grouped;
}

// Render a single repository card
function renderRepoCard(repo) {
  const description = repo.description || 'No description available.';
  const language = repo.language || 'Various';
  const stars = repo.stargazers_count;
  const forks = repo.forks_count;
  const updated = new Date(repo.updated_at).toLocaleDateString();
  const imageUrl = repoImages[repo.name] || null;
  
  let imageHtml = '';
  if (imageUrl) {
    imageHtml = `
      <div class="repo-image">
        <img src="${imageUrl}" alt="${repo.name} screenshot" loading="lazy" />
      </div>
    `;
  }
  
  return `
    <div class="repo-card">
      ${imageHtml}
      <div class="repo-header">
        <h3 class="repo-name">${repo.name}</h3>
        <a href="${repo.html_url}" class="repo-link" target="_blank" rel="noopener">
          <span class="repo-arrow">→</span>
        </a>
      </div>
      <p class="repo-description">${description}</p>
      <div class="repo-meta">
        <span class="repo-language">${language}</span>
        <span class="repo-stats">★ ${stars}</span>
        <span class="repo-stats">🍴 ${forks}</span>
        <span class="repo-updated">Updated ${updated}</span>
      </div>
    </div>
  `;
}

// Render all categories and their repositories
function renderCategorizedRepos(groupedRepos) {
  const container = document.getElementById('github-repos-container');
  if (!container) return;
  
  if (Object.keys(groupedRepos).every(key => groupedRepos[key].length === 0)) {
    container.innerHTML = '<p>No repositories found.</p>';
    return;
  }
  
  let html = '';
  
  Object.keys(categories).forEach(categoryKey => {
    const category = categories[categoryKey];
    const repos = groupedRepos[categoryKey];
    
    if (repos.length > 0) {
      html += `
        <div class="repo-category">
          <div class="category-header">
            <span class="category-icon">${category.icon}</span>
            <h2 class="category-title">${category.name}</h2>
          </div>
          <p class="category-description">${category.description}</p>
          <div class="repo-grid">
            ${repos.map(renderRepoCard).join('')}
          </div>
        </div>
      `;
    }
  });
  
  container.innerHTML = html;
}

// Initialize GitHub repositories section
async function initGitHubRepos() {
  const container = document.getElementById('github-repos-container');
  if (!container) return;
  
  container.innerHTML = '<p class="loading-text">Loading repositories...</p>';
  
  const repos = await fetchGitHubRepos();
  const groupedRepos = groupReposByCategory(repos);
  renderCategorizedRepos(groupedRepos);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initGitHubRepos();
});
