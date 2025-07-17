// Quest Stations JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initStationModals();
    initProgressTracking();
    initAchievementSystem();
});

// Station modal functionality
function initStationModals() {
    const modal = document.getElementById('stationModal');
    const modalClose = modal.querySelector('.modal-close');
    const stationButtons = document.querySelectorAll('.station-btn');

    // Station data
    const stationData = {
        'urban-planning': {
            title: 'Urban Planning Hub',
            icon: '🏙️',
            description: 'Discover the fundamentals of urban planning through interactive simulations and real-world case studies.',
            activities: [
                'Interactive city planning simulation',
                'Traffic flow analysis',
                'Zoning and land use planning',
                'Public space design challenges'
            ],
            learningOutcomes: [
                'Understand basic urban planning principles',
                'Learn about sustainable development',
                'Explore community engagement strategies',
                'Analyze urban challenges and solutions'
            ],
            requirements: 'No prior experience needed. Suitable for all ages.',
            tips: 'Take your time exploring the simulation. Try different approaches to see how they affect the city.'
        },
        'active-living': {
            title: 'Active Living Station',
            icon: '🏃‍♀️',
            description: 'Experience how physical activity and sports contribute to healthy, vibrant communities.',
            activities: [
                'Movement-based learning games',
                'Sports facility planning',
                'Community fitness challenges',
                'Active transportation design'
            ],
            learningOutcomes: [
                'Understand the importance of physical activity in urban design',
                'Learn about sports facility planning',
                'Explore active transportation options',
                'Design inclusive fitness spaces'
            ],
            requirements: 'Comfortable clothing recommended. All fitness levels welcome.',
            tips: 'Don\'t worry about being athletic - focus on having fun and learning!'
        },
        'creative-arts': {
            title: 'Creative Arts Corner',
            icon: '🎨',
            description: 'Express your vision for the perfect city through artistic and creative activities.',
            activities: [
                'Digital city sketching',
                '3D model building',
                'Community art projects',
                'Design thinking workshops'
            ],
            learningOutcomes: [
                'Develop creative problem-solving skills',
                'Learn visual communication techniques',
                'Understand the role of art in urban spaces',
                'Collaborate on community art projects'
            ],
            requirements: 'No artistic experience needed. Creativity comes in many forms!',
            tips: 'There are no wrong answers in art. Express yourself freely!'
        },
        'innovation-lab': {
            title: 'Innovation Lab',
            icon: '💡',
            description: 'Explore cutting-edge technology solutions for urban challenges.',
            activities: [
                'Smart city technology demonstrations',
                'IoT sensor experiments',
                'AI-powered urban planning tools',
                'Innovation prototyping workshops'
            ],
            learningOutcomes: [
                'Understand smart city technologies',
                'Learn about IoT and data collection',
                'Explore AI applications in urban planning',
                'Prototype innovative solutions'
            ],
            requirements: 'Basic computer skills helpful. Curiosity and creativity essential.',
            tips: 'Don\'t be afraid to experiment with new technologies!'
        },
        'sustainability': {
            title: 'Sustainability Center',
            icon: '🌱',
            description: 'Learn about environmental challenges and sustainable urban solutions.',
            activities: [
                'Green building design challenges',
                'Renewable energy planning',
                'Waste management simulations',
                'Climate adaptation strategies'
            ],
            learningOutcomes: [
                'Understand environmental challenges in cities',
                'Learn about sustainable building practices',
                'Explore renewable energy solutions',
                'Design climate-resilient communities'
            ],
            requirements: 'Environmental awareness helpful but not required.',
            tips: 'Think about long-term impacts of your design choices.'
        }
    };

    // Open modal
    stationButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const stationCard = this.closest('.station-card');
            const stationId = stationCard.dataset.station;
            const data = stationData[stationId];
            
            if (data) {
                openStationModal(data);
            }
        });
    });

    // Close modal
    modalClose.addEventListener('click', closeStationModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeStationModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeStationModal();
        }
    });

    function openStationModal(data) {
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');

        modalTitle.innerHTML = `${data.icon} ${data.title}`;
        modalContent.innerHTML = `
            <div class="modal-section">
                <h3>Description</h3>
                <p>${data.description}</p>
            </div>
            
            <div class="modal-section">
                <h3>Activities</h3>
                <ul>
                    ${data.activities.map(activity => `<li>${activity}</li>`).join('')}
                </ul>
            </div>
            
            <div class="modal-section">
                <h3>Learning Outcomes</h3>
                <ul>
                    ${data.learningOutcomes.map(outcome => `<li>${outcome}</li>`).join('')}
                </ul>
            </div>
            
            <div class="modal-section">
                <h3>Requirements</h3>
                <p>${data.requirements}</p>
            </div>
            
            <div class="modal-section">
                <h3>Pro Tips</h3>
                <p>${data.tips}</p>
            </div>
            
            <div class="modal-actions">
                <button class="btn btn-primary start-station-btn" data-station="${data.title.toLowerCase().replace(/\s+/g, '-')}">
                    Start Station
                </button>
                <button class="btn btn-secondary close-modal-btn">Close</button>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Ensure modal-content is fully visible
        setTimeout(() => {
            const modalContentEl = modal.querySelector('.modal-content');
            if (modalContentEl) {
                const rect = modalContentEl.getBoundingClientRect();
                let needsAdjust = false;
                let top = '';
                let left = '';
                let transform = '';
                // Check right overflow
                if (rect.right > window.innerWidth) {
                    needsAdjust = true;
                    left = '50%';
                    transform = 'translate(-50%, 0)';
                }
                // Check bottom overflow
                if (rect.bottom > window.innerHeight) {
                    needsAdjust = true;
                    top = '50%';
                    transform = 'translate(-50%, -50%)';
                }
                if (needsAdjust) {
                    modalContentEl.style.position = 'fixed';
                    if (top) modalContentEl.style.top = top;
                    if (left) modalContentEl.style.left = left;
                    modalContentEl.style.transform = transform;
                    modalContentEl.style.margin = '0 auto';
                    modalContentEl.style.maxWidth = '95vw';
                    modalContentEl.style.maxHeight = '90vh';
                } else {
                    // Reset to default if not needed
                    modalContentEl.style.position = '';
                    modalContentEl.style.top = '';
                    modalContentEl.style.left = '';
                    modalContentEl.style.transform = '';
                    modalContentEl.style.margin = '';
                    modalContentEl.style.maxWidth = '';
                    modalContentEl.style.maxHeight = '';
                }
            }
        }, 10);

        // Add event listeners to new buttons
        const startBtn = modalContent.querySelector('.start-station-btn');
        const closeBtn = modalContent.querySelector('.close-modal-btn');

        startBtn.addEventListener('click', function() {
            startStation(this.dataset.station);
        });

        closeBtn.addEventListener('click', closeStationModal);
    }

    function closeStationModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function startStation(stationId) {
        // Simulate starting a station
        showNotification(`Starting ${stationId.replace(/-/g, ' ')} station...`, 'info');
        closeStationModal();
        
        // Update progress
        updateProgress(stationId);
    }
}

// Progress tracking
function initProgressTracking() {
    // Load progress from localStorage
    const progress = JSON.parse(localStorage.getItem('questProgress')) || {
        completed: [],
        total: 5
    };

    updateProgressDisplay(progress);
}

function updateProgress(stationId) {
    const progress = JSON.parse(localStorage.getItem('questProgress')) || {
        completed: [],
        total: 5
    };

    if (!progress.completed.includes(stationId)) {
        progress.completed.push(stationId);
        localStorage.setItem('questProgress', JSON.stringify(progress));
        
        updateProgressDisplay(progress);
        unlockAchievement(stationId);
        
        showNotification(`Station completed! Progress: ${progress.completed.length}/${progress.total}`, 'success');
    }
}

function updateProgressDisplay(progress) {
    const progressFill = document.querySelector('.progress-fill');
    const completedStations = document.querySelector('.completed-stations');
    const progressPercentage = document.querySelector('.progress-percentage');

    if (progressFill && completedStations && progressPercentage) {
        const percentage = (progress.completed.length / progress.total) * 100;
        
        progressFill.style.width = `${percentage}%`;
        completedStations.textContent = `${progress.completed.length}/${progress.total}`;
        progressPercentage.textContent = `${Math.round(percentage)}%`;
    }
}

// Achievement system
function initAchievementSystem() {
    const achievements = document.querySelectorAll('.achievement');
    
    achievements.forEach(achievement => {
        achievement.addEventListener('click', function() {
            const achievementId = this.dataset.achievement;
            showAchievementDetails(achievementId);
        });
    });
}

function unlockAchievement(stationId) {
    const achievement = document.querySelector(`[data-achievement="${stationId}"]`);
    if (achievement) {
        const status = achievement.querySelector('.achievement-status');
        status.textContent = '✅';
        status.style.color = '#4CAF50';
        
        // Add celebration animation
        achievement.classList.add('achievement-unlocked');
        
        // Show achievement notification
        const achievementName = achievement.querySelector('h4').textContent;
        showNotification(`Achievement Unlocked: ${achievementName}!`, 'success');
        
        // Check if all achievements are unlocked
        checkAllAchievements();
    }
}

function checkAllAchievements() {
    const achievements = document.querySelectorAll('.achievement');
    const unlocked = document.querySelectorAll('.achievement-status');
    
    if (unlocked.length === achievements.length) {
        setTimeout(() => {
            showNotification('🎉 Congratulations! You\'ve completed all stations!', 'success');
            showCompletionRewards();
        }, 1000);
    }
}

function showAchievementDetails(achievementId) {
    const achievementData = {
        'urban-planning': {
            title: 'Urban Planner',
            description: 'You\'ve mastered the fundamentals of urban planning and can now design sustainable, livable communities.',
            reward: 'Planning Badge + 100 points'
        },
        'active-living': {
            title: 'Active Citizen',
            description: 'You understand the importance of physical activity in urban design and can create healthy, active communities.',
            reward: 'ActiveSG Credits + 100 points'
        },
        'creative-arts': {
            title: 'Creative Designer',
            description: 'Your artistic vision and creative problem-solving skills can transform urban spaces into beautiful, functional environments.',
            reward: 'Art Gallery Display + 100 points'
        },
        'innovation-lab': {
            title: 'Innovation Pioneer',
            description: 'You\'ve explored cutting-edge technologies and can implement smart city solutions for the future.',
            reward: 'Innovation Certificate + 100 points'
        },
        'sustainability': {
            title: 'Green Champion',
            description: 'You\'re committed to environmental sustainability and can design eco-friendly urban solutions.',
            reward: 'Green Champion Badge + 100 points'
        }
    };

    const data = achievementData[achievementId];
    if (data) {
        showNotification(`${data.title}: ${data.description}`, 'info');
    }
}

function showCompletionRewards() {
    const rewards = [
        '🎁 Exclusive Urban Quest Certificate',
        '🏆 Master City Builder Badge',
        '💰 500 Bonus Points',
        '🎮 Special Minecraft World Access',
        '🤝 Community Recognition'
    ];

    const rewardsList = rewards.map(reward => `<li>${reward}</li>`).join('');
    
    const modal = document.createElement('div');
    modal.className = 'completion-modal';
    modal.innerHTML = `
        <div class="completion-content">
            <h2>🎉 Quest Complete!</h2>
            <p>Congratulations on completing all stations! Here are your rewards:</p>
            <ul>${rewardsList}</ul>
            <div class="completion-actions">
                <button class="btn btn-primary" onclick="claimRewards()">Claim Rewards</button>
                <button class="btn btn-secondary" onclick="closeCompletionModal()">Close</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 100);
}

function claimRewards() {
    showNotification('Rewards claimed! Check your email for details.', 'success');
    closeCompletionModal();
}

function closeCompletionModal() {
    const modal = document.querySelector('.completion-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// Notification system (if not already defined)
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
} 