// Advanced Progress Tracking System
class ProgressTracker {
    constructor() {
        this.progress = this.loadProgress();
        this.achievements = this.loadAchievements();
        this.leaderboard = this.loadLeaderboard();
        this.init();
    }

    init() {
        this.renderProgressBar();
        this.renderAchievements();
        this.renderLeaderboard();
        this.initEventListeners();
        this.startRealTimeUpdates();
    }

    loadProgress() {
        const saved = localStorage.getItem('urbanQuestProgress');
        return saved ? JSON.parse(saved) : {
            totalStations: 5,
            completedStations: 0,
            totalPoints: 0,
            currentLevel: 1,
            experience: 0,
            questsCompleted: 0,
            minecraftBuilds: 0,
            feedbackSubmitted: 0,
            lastUpdated: Date.now()
        };
    }

    loadAchievements() {
        const saved = localStorage.getItem('urbanQuestAchievements');
        return saved ? JSON.parse(saved) : [
            {
                id: 'first_station',
                name: 'First Steps',
                description: 'Complete your first quest station',
                icon: '🎯',
                unlocked: false,
                points: 50
            },
            {
                id: 'minecraft_builder',
                name: 'Minecraft Master',
                description: 'Create 3 Minecraft builds',
                icon: '🏗️',
                unlocked: false,
                points: 100
            },
            {
                id: 'feedback_champion',
                name: 'Voice of the Future',
                description: 'Submit 5 feedback forms',
                icon: '📝',
                unlocked: false,
                points: 150
            },
            {
                id: 'social_butterfly',
                name: 'Community Builder',
                description: 'Share 3 posts on social media',
                icon: '🦋',
                unlocked: false,
                points: 75
            },
            {
                id: 'explorer',
                name: 'Urban Explorer',
                description: 'Visit all quest stations',
                icon: '🗺️',
                unlocked: false,
                points: 200
            }
        ];
    }

    loadLeaderboard() {
        const saved = localStorage.getItem('urbanQuestLeaderboard');
        return saved ? JSON.parse(saved) : [
            { name: 'Alex Chen', points: 850, level: 5, avatar: '👨‍🎓' },
            { name: 'Sarah Lim', points: 720, level: 4, avatar: '👩‍🎨' },
            { name: 'Marcus Tan', points: 680, level: 4, avatar: '👨‍💻' },
            { name: 'Emma Wong', points: 590, level: 3, avatar: '👩‍🔬' },
            { name: 'David Lee', points: 450, level: 3, avatar: '👨‍🏫' }
        ];
    }

    saveProgress() {
        localStorage.setItem('urbanQuestProgress', JSON.stringify(this.progress));
        localStorage.setItem('urbanQuestAchievements', JSON.stringify(this.achievements));
        localStorage.setItem('urbanQuestLeaderboard', JSON.stringify(this.leaderboard));
    }

    updateProgress(type, value = 1) {
        switch(type) {
            case 'station_completed':
                this.progress.completedStations += value;
                this.progress.totalPoints += 100;
                this.progress.experience += 50;
                this.checkAchievement('first_station');
                break;
            case 'minecraft_build':
                this.progress.minecraftBuilds += value;
                this.progress.totalPoints += 75;
                this.progress.experience += 30;
                this.checkAchievement('minecraft_builder');
                break;
            case 'feedback_submitted':
                this.progress.feedbackSubmitted += value;
                this.progress.totalPoints += 50;
                this.progress.experience += 25;
                this.checkAchievement('feedback_champion');
                break;
            case 'social_share':
                this.progress.totalPoints += 25;
                this.progress.experience += 15;
                this.checkAchievement('social_butterfly');
                break;
        }

        this.updateLevel();
        this.saveProgress();
        this.renderProgressBar();
        this.updateLeaderboard();
        this.showProgressNotification(type, value);
    }

    updateLevel() {
        const newLevel = Math.floor(this.progress.experience / 200) + 1;
        if (newLevel > this.progress.currentLevel) {
            this.progress.currentLevel = newLevel;
            this.showLevelUpNotification(newLevel);
        }
    }

    checkAchievement(achievementId) {
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement || achievement.unlocked) return;

        let shouldUnlock = false;
        switch(achievementId) {
            case 'first_station':
                shouldUnlock = this.progress.completedStations >= 1;
                break;
            case 'minecraft_builder':
                shouldUnlock = this.progress.minecraftBuilds >= 3;
                break;
            case 'feedback_champion':
                shouldUnlock = this.progress.feedbackSubmitted >= 5;
                break;
            case 'social_butterfly':
                shouldUnlock = this.progress.totalPoints >= 300;
                break;
            case 'explorer':
                shouldUnlock = this.progress.completedStations >= 5;
                break;
        }

        if (shouldUnlock) {
            achievement.unlocked = true;
            this.progress.totalPoints += achievement.points;
            this.showAchievementNotification(achievement);
        }
    }

    renderProgressBar() {
        const progressContainer = document.getElementById('progress-tracker');
        if (!progressContainer) return;

        const progressPercentage = (this.progress.completedStations / this.progress.totalStations) * 100;
        
        progressContainer.innerHTML = `
            <div class="progress-header">
                <h3>Your Quest Progress</h3>
                <div class="level-badge">Level ${this.progress.currentLevel}</div>
            </div>
            <div class="progress-stats">
                <div class="stat-item">
                    <span class="stat-number">${this.progress.completedStations}/${this.progress.totalStations}</span>
                    <span class="stat-label">Stations</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${this.progress.totalPoints}</span>
                    <span class="stat-label">Points</span>
                </div>
                <div class="stat-item">
                    <span class="stat-number">${this.progress.experience}</span>
                    <span class="stat-label">XP</span>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercentage}%"></div>
            </div>
            <div class="progress-percentage">${Math.round(progressPercentage)}% Complete</div>
        `;
    }

    renderAchievements() {
        const achievementsContainer = document.getElementById('achievements-grid');
        if (!achievementsContainer) return;

        achievementsContainer.innerHTML = this.achievements.map(achievement => `
            <div class="achievement ${achievement.unlocked ? 'unlocked' : 'locked'}" 
                 data-achievement-id="${achievement.id}">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <h4>${achievement.name}</h4>
                    <p>${achievement.description}</p>
                    <div class="achievement-status">
                        ${achievement.unlocked ? '✅ Unlocked' : '🔒 Locked'}
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderLeaderboard() {
        const leaderboardContainer = document.getElementById('leaderboard');
        if (!leaderboardContainer) return;

        leaderboardContainer.innerHTML = `
            <h3>🏆 Leaderboard</h3>
            <div class="leaderboard-list">
                ${this.leaderboard.map((player, index) => `
                    <div class="leaderboard-item ${index < 3 ? 'top-three' : ''}">
                        <div class="rank">${index + 1}</div>
                        <div class="player-avatar">${player.avatar}</div>
                        <div class="player-info">
                            <div class="player-name">${player.name}</div>
                            <div class="player-level">Level ${player.level}</div>
                        </div>
                        <div class="player-points">${player.points} pts</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    updateLeaderboard() {
        // Simulate real-time leaderboard updates
        this.leaderboard.forEach(player => {
            if (Math.random() > 0.7) {
                player.points += Math.floor(Math.random() * 50);
                player.level = Math.floor(player.points / 200) + 1;
            }
        });
        
        this.leaderboard.sort((a, b) => b.points - a.points);
        this.renderLeaderboard();
    }

    showProgressNotification(type, value) {
        const messages = {
            'station_completed': `🎉 Station completed! +100 points`,
            'minecraft_build': `🏗️ Minecraft build created! +75 points`,
            'feedback_submitted': `📝 Feedback submitted! +50 points`,
            'social_share': `📤 Shared on social media! +25 points`
        };

        this.showNotification(messages[type] || 'Progress updated!', 'success');
    }

    showLevelUpNotification(level) {
        this.showNotification(`🎊 Level Up! You're now level ${level}!`, 'success');
    }

    showAchievementNotification(achievement) {
        this.showNotification(`🏆 Achievement Unlocked: ${achievement.name}! +${achievement.points} points`, 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    startRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            this.updateLeaderboard();
        }, 30000);
    }

    initEventListeners() {
        // Add event listeners for interactive elements
        document.addEventListener('click', (e) => {
            if (e.target.matches('.station-card')) {
                this.updateProgress('station_completed');
            }
            if (e.target.matches('.minecraft-build-btn')) {
                this.updateProgress('minecraft_build');
            }
            if (e.target.matches('.feedback-submit-btn')) {
                this.updateProgress('feedback_submitted');
            }
            if (e.target.matches('.social-share-btn')) {
                this.updateProgress('social_share');
            }
        });
    }
}

// Initialize progress tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.progressTracker = new ProgressTracker();
}); 