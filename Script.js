document.addEventListener('DOMContentLoaded', () => {
    const podcastItems = document.querySelectorAll('.podcast-item');

    podcastItems.forEach(item => {
        const video = item.querySelector('.podcast-video');
        const playBtn = item.querySelector('.play-button');
        const progressFill = item.querySelector('.progress-fill');
        const progressBar = item.querySelector('.progress-bar');
        const timeDisplay = item.querySelector('.video-time');

        // --- 1. ЛОГІКА ВІДТВОРЕННЯ / ПАУЗИ ---
        const togglePlay = () => {
            if (video.paused) {
                // Паузимо інші відео перед запуском нового (опційно)
                pauseAllVideos();
                video.play();
                item.classList.add('is-playing');
            } else {
                video.pause();
                item.classList.remove('is-playing');
            }
        };

        playBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Щоб клік по кнопці не дублювався кліком по картці
            togglePlay();
        });

        // Дозволяємо клікати по всій картці для паузи, коли відео вже грає
        item.addEventListener('click', () => {
            if (!video.paused) togglePlay();
        });

        // --- 2. ОНОВЛЕННЯ ЧАСУ ТА ПРОГРЕСУ ---
        
        // Функція форматування секунд у 0:00
        const formatTime = (time) => {
            if (isNaN(time)) return "0:00";
            const mins = Math.floor(time / 60);
            const secs = Math.floor(time % 60);
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        };

        // Оновлення тексту часу (Поточний / Загальний)
        const updateTimeUI = () => {
            const current = formatTime(video.currentTime);
            const duration = formatTime(video.duration);
            timeDisplay.textContent = `${current} / ${duration}`;
        };

        // Спрацьовує, коли браузер підтягнув довжину відео
        video.addEventListener('loadedmetadata', updateTimeUI);

        // Спрацьовує щоразу при зміні часу відтворення
        video.addEventListener('timeupdate', () => {
            if (video.duration) {
                const progress = (video.currentTime / video.duration) * 100;
                progressFill.style.width = `${progress}%`;
                updateTimeUI();
            }
        });

        // --- 3. ПЕРЕМОТКА (Scrubbing) ---
        progressBar.addEventListener('click', (e) => {
            e.stopPropagation(); // Щоб не спрацювала пауза при кліку на бар
            const rect = progressBar.getBoundingClientRect();
            const pos = (e.clientX - rect.left) / rect.width;
            video.currentTime = pos * video.duration;
        });

        // Коли відео закінчується — повертаємо початковий стан
        video.addEventListener('ended', () => {
            item.classList.remove('is-playing');
            video.currentTime = 0;
        });
    });

    // Функція для зупинки всіх відео на сторінці
    function pauseAllVideos() {
        const allVideos = document.querySelectorAll('.podcast-video');
        allVideos.forEach(v => {
            v.pause();
            v.closest('.podcast-item').classList.remove('is-playing');
        });
    }
});