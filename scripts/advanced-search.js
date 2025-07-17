// Advanced Search and Filtering System
class AdvancedSearch {
    constructor() {
        this.searchData = this.loadSearchData();
        this.currentFilters = {};
        this.searchHistory = [];
        this.suggestions = [];
        this.init();
    }

    init() {
        this.createSearchInterface();
        this.initEventListeners();
        this.loadSearchHistory();
    }

    loadSearchData() {
        return {
            stations: [
                {
                    id: 'transportation',
                    name: 'Transportation Station',
                    category: 'infrastructure',
                    difficulty: 'medium',
                    duration: '30-45 min',
                    location: 'Central Singapore',
                    tags: ['MRT', 'cycling', 'smart mobility', 'sustainability'],
                    description: 'Learn about Singapore\'s transport system and design sustainable mobility solutions.',
                    features: ['Interactive MRT map', 'Cycling infrastructure design', 'Smart mobility solutions']
                },
                {
                    id: 'housing',
                    name: 'Housing Station',
                    category: 'community',
                    difficulty: 'easy',
                    duration: '20-30 min',
                    location: 'Various neighborhoods',
                    tags: ['green buildings', 'community spaces', 'smart homes', 'affordable housing'],
                    description: 'Explore innovative housing solutions and community design.',
                    features: ['Green building simulator', 'Community space planner', 'Smart home demo']
                },
                {
                    id: 'environment',
                    name: 'Environment Station',
                    category: 'sustainability',
                    difficulty: 'hard',
                    duration: '45-60 min',
                    location: 'Parks and green spaces',
                    tags: ['urban farming', 'renewable energy', 'climate resilience', 'biodiversity'],
                    description: 'Design sustainable environmental solutions for Singapore.',
                    features: ['Urban farming simulator', 'Renewable energy planner', 'Climate impact calculator']
                },
                {
                    id: 'community',
                    name: 'Community Station',
                    category: 'social',
                    difficulty: 'medium',
                    duration: '25-35 min',
                    location: 'Community centers',
                    tags: ['social spaces', 'inclusive design', 'cultural heritage', 'community engagement'],
                    description: 'Build stronger, more connected neighborhoods.',
                    features: ['Community space designer', 'Cultural heritage explorer', 'Social impact calculator']
                },
                {
                    id: 'technology',
                    name: 'Technology Station',
                    category: 'innovation',
                    difficulty: 'hard',
                    duration: '40-50 min',
                    location: 'Tech hubs',
                    tags: ['IoT', 'AI', 'smart city', 'digital innovation'],
                    description: 'Explore smart city technologies and digital solutions.',
                    features: ['IoT sensor simulator', 'AI-powered services', 'Smart city dashboard']
                }
            ],
            activities: [
                {
                    id: 'minecraft_build',
                    name: 'Minecraft Building Challenge',
                    category: 'creative',
                    difficulty: 'medium',
                    duration: '60-90 min',
                    tags: ['3D design', 'sustainable architecture', 'city planning'],
                    description: 'Build sustainable Singapore in Minecraft.'
                },
                {
                    id: 'feedback_survey',
                    name: 'DMP2025 Feedback Survey',
                    category: 'research',
                    difficulty: 'easy',
                    duration: '15-20 min',
                    tags: ['survey', 'feedback', 'policy input'],
                    description: 'Share your ideas for Singapore\'s future.'
                },
                {
                    id: 'social_share',
                    name: 'Social Media Campaign',
                    category: 'outreach',
                    difficulty: 'easy',
                    duration: '10-15 min',
                    tags: ['social media', 'awareness', 'community'],
                    description: 'Spread awareness about urban planning.'
                }
            ],
            rewards: [
                {
                    id: 'certificate',
                    name: 'Urban Planning Certificate',
                    category: 'recognition',
                    points: 500,
                    tags: ['certificate', 'achievement', 'learning'],
                    description: 'Official recognition of your urban planning knowledge.'
                },
                {
                    id: 'mentorship',
                    name: 'Professional Mentorship',
                    category: 'development',
                    points: 1000,
                    tags: ['mentorship', 'career', 'networking'],
                    description: 'Connect with urban planning professionals.'
                },
                {
                    id: 'workshop',
                    name: 'Exclusive Workshop',
                    category: 'learning',
                    points: 750,
                    tags: ['workshop', 'hands-on', 'skills'],
                    description: 'Participate in exclusive urban planning workshops.'
                }
            ]
        };
    }

    createSearchInterface() {
        const searchHTML = `
            <div class="advanced-search" id="advanced-search">
                <div class="search-header">
                    <h3>🔍 Advanced Search</h3>
                    <p>Find quest stations, activities, and rewards</p>
                </div>
                <div class="search-container">
                    <div class="search-input-group">
                        <input type="text" id="search-input" placeholder="Search for stations, activities, or rewards..." />
                        <button id="search-btn" class="search-btn">🔍</button>
                        <button id="filter-toggle" class="filter-toggle">⚙️ Filters</button>
                    </div>
                    <div class="search-suggestions" id="search-suggestions"></div>
                </div>
                <div class="filter-panel" id="filter-panel">
                    <div class="filter-section">
                        <h4>Category</h4>
                        <div class="filter-options">
                            <label class="filter-option">
                                <input type="checkbox" data-filter="category" data-value="infrastructure" />
                                <span>Infrastructure</span>
                            </label>
                            <label class="filter-option">
                                <input type="checkbox" data-filter="category" data-value="community" />
                                <span>Community</span>
                            </label>
                            <label class="filter-option">
                                <input type="checkbox" data-filter="category" data-value="sustainability" />
                                <span>Sustainability</span>
                            </label>
                            <label class="filter-option">
                                <input type="checkbox" data-filter="category" data-value="innovation" />
                                <span>Innovation</span>
                            </label>
                            <label class="filter-option">
                                <input type="checkbox" data-filter="category" data-value="social" />
                                <span>Social</span>
                            </label>
                        </div>
                    </div>
                    <div class="filter-section">
                        <h4>Difficulty</h4>
                        <div class="filter-options">
                            <label class="filter-option">
                                <input type="checkbox" data-filter="difficulty" data-value="easy" />
                                <span>Easy</span>
                            </label>
                            <label class="filter-option">
                                <input type="checkbox" data-filter="difficulty" data-value="medium" />
                                <span>Medium</span>
                            </label>
                            <label class="filter-option">
                                <input type="checkbox" data-filter="difficulty" data-value="hard" />
                                <span>Hard</span>
                            </label>
                        </div>
                    </div>
                    <div class="filter-section">
                        <h4>Duration</h4>
                        <div class="filter-options">
                            <label class="filter-option">
                                <input type="checkbox" data-filter="duration" data-value="short" />
                                <span>Short (10-20 min)</span>
                            </label>
                            <label class="filter-option">
                                <input type="checkbox" data-filter="duration" data-value="medium" />
                                <span>Medium (20-45 min)</span>
                            </label>
                            <label class="filter-option">
                                <input type="checkbox" data-filter="duration" data-value="long" />
                                <span>Long (45+ min)</span>
                            </label>
                        </div>
                    </div>
                    <div class="filter-actions">
                        <button id="clear-filters" class="clear-filters-btn">Clear Filters</button>
                        <button id="apply-filters" class="apply-filters-btn">Apply Filters</button>
                    </div>
                </div>
                <div class="search-results" id="search-results">
                    <div class="results-header">
                        <h4>Search Results</h4>
                        <span class="results-count" id="results-count">0 results</span>
                    </div>
                    <div class="results-grid" id="results-grid"></div>
                </div>
                <div class="search-history" id="search-history">
                    <h4>Recent Searches</h4>
                    <div class="history-list" id="history-list"></div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', searchHTML);
    }

    initEventListeners() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const filterToggle = document.getElementById('filter-toggle');
        const filterPanel = document.getElementById('filter-panel');
        const clearFiltersBtn = document.getElementById('clear-filters');
        const applyFiltersBtn = document.getElementById('apply-filters');

        // Search input events
        searchInput.addEventListener('input', (e) => {
            this.handleSearchInput(e.target.value);
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch();
            }
        });

        searchBtn.addEventListener('click', () => {
            this.performSearch();
        });

        // Filter toggle
        filterToggle.addEventListener('click', () => {
            filterPanel.classList.toggle('active');
        });

        // Filter events
        document.querySelectorAll('input[data-filter]').forEach(input => {
            input.addEventListener('change', () => {
                this.updateFilters();
            });
        });

        clearFiltersBtn.addEventListener('click', () => {
            this.clearFilters();
        });

        applyFiltersBtn.addEventListener('click', () => {
            this.applyFilters();
        });
    }

    handleSearchInput(query) {
        if (query.length < 2) {
            this.hideSuggestions();
            return;
        }

        this.suggestions = this.generateSuggestions(query);
        this.showSuggestions();
    }

    generateSuggestions(query) {
        const allItems = [
            ...this.searchData.stations,
            ...this.searchData.activities,
            ...this.searchData.rewards
        ];

        const suggestions = allItems.filter(item => {
            const searchText = `${item.name} ${item.description} ${item.tags.join(' ')}`.toLowerCase();
            return searchText.includes(query.toLowerCase());
        });

        return suggestions.slice(0, 5);
    }

    showSuggestions() {
        const suggestionsContainer = document.getElementById('search-suggestions');
        
        if (this.suggestions.length === 0) {
            suggestionsContainer.innerHTML = '';
            return;
        }

        suggestionsContainer.innerHTML = this.suggestions.map(item => `
            <div class="suggestion-item" data-item-id="${item.id}">
                <div class="suggestion-icon">${this.getItemIcon(item)}</div>
                <div class="suggestion-content">
                    <div class="suggestion-name">${item.name}</div>
                    <div class="suggestion-category">${item.category}</div>
                </div>
            </div>
        `).join('');

        // Add click events to suggestions
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                const itemId = item.dataset.itemId;
                this.selectSuggestion(itemId);
            });
        });
    }

    hideSuggestions() {
        const suggestionsContainer = document.getElementById('search-suggestions');
        suggestionsContainer.innerHTML = '';
    }

    selectSuggestion(itemId) {
        const searchInput = document.getElementById('search-input');
        const item = this.findItemById(itemId);
        
        if (item) {
            searchInput.value = item.name;
            this.hideSuggestions();
            this.performSearch();
        }
    }

    findItemById(itemId) {
        const allItems = [
            ...this.searchData.stations,
            ...this.searchData.activities,
            ...this.searchData.rewards
        ];
        
        return allItems.find(item => item.id === itemId);
    }

    getItemIcon(item) {
        const icons = {
            'transportation': '🚇',
            'housing': '🏠',
            'environment': '🌱',
            'community': '🤝',
            'technology': '💻',
            'minecraft_build': '🏗️',
            'feedback_survey': '📝',
            'social_share': '📤',
            'certificate': '🏆',
            'mentorship': '👨‍🏫',
            'workshop': '🎓'
        };
        
        return icons[item.id] || '📋';
    }

    performSearch() {
        const query = document.getElementById('search-input').value.trim();
        
        if (!query) {
            this.showAllResults();
            return;
        }

        this.addToSearchHistory(query);
        const results = this.searchItems(query);
        this.displayResults(results);
    }

    searchItems(query) {
        const allItems = [
            ...this.searchData.stations,
            ...this.searchData.activities,
            ...this.searchData.rewards
        ];

        return allItems.filter(item => {
            const searchText = `${item.name} ${item.description} ${item.tags.join(' ')}`.toLowerCase();
            const queryLower = query.toLowerCase();
            
            // Check if item matches current filters
            if (!this.matchesFilters(item)) {
                return false;
            }
            
            return searchText.includes(queryLower);
        });
    }

    matchesFilters(item) {
        for (const [filterType, filterValues] of Object.entries(this.currentFilters)) {
            if (filterValues.length === 0) continue;
            
            let itemValue = item[filterType];
            
            // Handle duration filtering
            if (filterType === 'duration') {
                itemValue = this.getDurationCategory(item.duration);
            }
            
            if (!filterValues.includes(itemValue)) {
                return false;
            }
        }
        
        return true;
    }

    getDurationCategory(duration) {
        if (duration.includes('10-20') || duration.includes('15-20')) return 'short';
        if (duration.includes('20-45') || duration.includes('30-45') || duration.includes('25-35')) return 'medium';
        if (duration.includes('45+') || duration.includes('60-90') || duration.includes('40-50')) return 'long';
        return 'medium';
    }

    displayResults(results) {
        const resultsGrid = document.getElementById('results-grid');
        const resultsCount = document.getElementById('results-count');
        
        resultsCount.textContent = `${results.length} result${results.length !== 1 ? 's' : ''}`;
        
        if (results.length === 0) {
            resultsGrid.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">🔍</div>
                    <h4>No results found</h4>
                    <p>Try adjusting your search terms or filters</p>
                </div>
            `;
            return;
        }

        resultsGrid.innerHTML = results.map(item => `
            <div class="result-card" data-item-id="${item.id}">
                <div class="result-icon">${this.getItemIcon(item)}</div>
                <div class="result-content">
                    <h4 class="result-name">${item.name}</h4>
                    <p class="result-description">${item.description}</p>
                    <div class="result-tags">
                        ${item.tags.map(tag => `<span class="result-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="result-meta">
                        ${item.category ? `<span class="result-category">${item.category}</span>` : ''}
                        ${item.difficulty ? `<span class="result-difficulty">${item.difficulty}</span>` : ''}
                        ${item.duration ? `<span class="result-duration">${item.duration}</span>` : ''}
                        ${item.points ? `<span class="result-points">${item.points} pts</span>` : ''}
                    </div>
                </div>
                <button class="result-action-btn">View Details</button>
            </div>
        `).join('');

        // Add click events to result cards
        resultsGrid.querySelectorAll('.result-card').forEach(card => {
            card.addEventListener('click', () => {
                const itemId = card.dataset.itemId;
                this.showItemDetails(itemId);
            });
        });
    }

    showAllResults() {
        const allItems = [
            ...this.searchData.stations,
            ...this.searchData.activities,
            ...this.searchData.rewards
        ];
        
        const filteredResults = allItems.filter(item => this.matchesFilters(item));
        this.displayResults(filteredResults);
    }

    updateFilters() {
        this.currentFilters = {};
        
        document.querySelectorAll('input[data-filter]:checked').forEach(input => {
            const filterType = input.dataset.filter;
            const filterValue = input.dataset.value;
            
            if (!this.currentFilters[filterType]) {
                this.currentFilters[filterType] = [];
            }
            
            this.currentFilters[filterType].push(filterValue);
        });
    }

    applyFilters() {
        this.updateFilters();
        this.performSearch();
    }

    clearFilters() {
        document.querySelectorAll('input[data-filter]').forEach(input => {
            input.checked = false;
        });
        
        this.currentFilters = {};
        this.performSearch();
    }

    addToSearchHistory(query) {
        if (!this.searchHistory.includes(query)) {
            this.searchHistory.unshift(query);
            this.searchHistory = this.searchHistory.slice(0, 10); // Keep only last 10
            this.saveSearchHistory();
            this.updateSearchHistory();
        }
    }

    updateSearchHistory() {
        const historyList = document.getElementById('history-list');
        
        historyList.innerHTML = this.searchHistory.map(query => `
            <div class="history-item" data-query="${query}">
                <span class="history-icon">🔍</span>
                <span class="history-query">${query}</span>
                <button class="history-remove">×</button>
            </div>
        `).join('');

        // Add click events to history items
        historyList.querySelectorAll('.history-item').forEach(item => {
            const query = item.dataset.query;
            
            item.addEventListener('click', () => {
                document.getElementById('search-input').value = query;
                this.performSearch();
            });
            
            item.querySelector('.history-remove').addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeFromHistory(query);
            });
        });
    }

    removeFromHistory(query) {
        this.searchHistory = this.searchHistory.filter(q => q !== query);
        this.saveSearchHistory();
        this.updateSearchHistory();
    }

    saveSearchHistory() {
        localStorage.setItem('urbanQuestSearchHistory', JSON.stringify(this.searchHistory));
    }

    loadSearchHistory() {
        const saved = localStorage.getItem('urbanQuestSearchHistory');
        if (saved) {
            this.searchHistory = JSON.parse(saved);
            this.updateSearchHistory();
        }
    }

    showItemDetails(itemId) {
        const item = this.findItemById(itemId);
        if (!item) return;

        // Create a modal or navigate to the item details
        const modal = document.createElement('div');
        modal.className = 'item-details-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${item.name}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="item-icon">${this.getItemIcon(item)}</div>
                    <p class="item-description">${item.description}</p>
                    <div class="item-tags">
                        ${item.tags.map(tag => `<span class="item-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="item-meta">
                        ${item.category ? `<div><strong>Category:</strong> ${item.category}</div>` : ''}
                        ${item.difficulty ? `<div><strong>Difficulty:</strong> ${item.difficulty}</div>` : ''}
                        ${item.duration ? `<div><strong>Duration:</strong> ${item.duration}</div>` : ''}
                        ${item.points ? `<div><strong>Points:</strong> ${item.points}</div>` : ''}
                        ${item.location ? `<div><strong>Location:</strong> ${item.location}</div>` : ''}
                    </div>
                    ${item.features ? `
                        <div class="item-features">
                            <h4>Features:</h4>
                            <ul>
                                ${item.features.map(feature => `<li>${feature}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary">Start Activity</button>
                    <button class="btn btn-secondary">Learn More</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// Initialize advanced search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.advancedSearch = new AdvancedSearch();
}); 