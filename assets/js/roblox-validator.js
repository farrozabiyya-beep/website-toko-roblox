/**
 * Roblox Username Validator
 * Real-time validation dan avatar fetching dari Roblox API
 */

class RobloxUsernameValidator {
    constructor(inputSelector, outputSelector) {
        this.input = document.querySelector(inputSelector);
        this.outputContainer = document.querySelector(outputSelector);
        this.currentUsername = '';
        this.validateTimeout = null;
        this.init();
    }

    init() {
        if (!this.input) return;
        
        this.input.addEventListener('input', (e) => {
            this.handleInput(e.target.value);
        });
    }

    handleInput(value) {
        const trimmed = value.trim();
        
        // Clear previous timeout
        if (this.validateTimeout) clearTimeout(this.validateTimeout);

        // Clear output if empty
        if (!trimmed) {
            this.clearOutput();
            this.currentUsername = '';
            return;
        }

        // Debounce API call
        this.validateTimeout = setTimeout(() => {
            this.validateUsername(trimmed);
        }, 500);
    }

    async validateUsername(username) {
        try {
            // Show loading state
            this.showLoading();

            // Fetch user from Roblox API
            const response = await fetch(
                `https://users.roblox.com/v1/usernames/users`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        usernames: [username],
                        excludeBannedUsers: true
                    })
                }
            );

            if (!response.ok) throw new Error('API Error');

            const data = await response.json();
            
            if (data.data && data.data.length > 0) {
                const user = data.data[0];
                this.currentUsername = user.name;
                await this.fetchAndShowAvatar(user.id, user.name);
            } else {
                this.showError('Username tidak ditemukan');
            }
        } catch (error) {
            console.error('Validation error:', error);
            this.showError('Username tidak ditemukan');
        }
    }

    async fetchAndShowAvatar(userId, username) {
        try {
            // Fetch avatar
            const response = await fetch(
                `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=150x150&format=Png&isCircular=true`
            );

            if (!response.ok) throw new Error('Avatar fetch failed');

            const data = await response.json();
            
            if (data.data && data.data.length > 0) {
                const avatarUrl = data.data[0].imageUrl;
                this.showSuccess(username, avatarUrl);
            } else {
                this.showError('Tidak bisa memuat avatar');
            }
        } catch (error) {
            console.error('Avatar fetch error:', error);
            // Still show success even if avatar fails
            this.showSuccess(username, null);
        }
    }

    showLoading() {
        this.outputContainer.innerHTML = `
            <div class="roblox-validation-loading">
                <div class="spinner"></div>
                <p>Mencari username...</p>
            </div>
        `;
    }

    showSuccess(username, avatarUrl) {
        const avatarHtml = avatarUrl 
            ? `<img src="${avatarUrl}" alt="${username}" class="roblox-avatar">`
            : `<div class="roblox-avatar-placeholder"><i class="fas fa-user"></i></div>`;

        this.outputContainer.innerHTML = `
            <div class="roblox-validation-success">
                <div class="roblox-success-header">
                    <i class="fas fa-check-circle"></i>
                    <span>Profil Ditemukan ✓</span>
                </div>
                <div class="roblox-profile-display">
                    ${avatarHtml}
                    <div class="roblox-profile-info">
                        <p class="roblox-username">${username}</p>
                        <p class="roblox-verified">Username terverifikasi</p>
                    </div>
                </div>
            </div>
        `;
        this.outputContainer.style.display = 'block';
    }

    showError(message = 'Username tidak ditemukan') {
        this.outputContainer.innerHTML = `
            <div class="roblox-validation-error">
                <div class="roblox-error-header">
                    <i class="fas fa-times-circle"></i>
                    <span>${message}</span>
                </div>
            </div>
        `;
        this.outputContainer.style.display = 'block';
    }

    clearOutput() {
        this.outputContainer.innerHTML = '';
        this.outputContainer.style.display = 'none';
    }

    getValidatedUsername() {
        return this.currentUsername;
    }

    getValidatedUserId() {
        // This would need to be stored during validation
        return this.currentUserId || null;
    }
}

// Helper function untuk inisialisasi
function initRobloxValidator(inputSelector = '#robloxUsername', outputSelector = '#robloxValidationOutput') {
    return new RobloxUsernameValidator(inputSelector, outputSelector);
}

// Auto-initialize jika element ada
document.addEventListener('DOMContentLoaded', () => {
    const input = document.querySelector('#robloxUsername');
    const output = document.querySelector('#robloxValidationOutput');
    if (input && output) {
        window.robloxValidator = initRobloxValidator();
    }
});
