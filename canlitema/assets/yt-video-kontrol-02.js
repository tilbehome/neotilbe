(function () {
    function getVideo() {
        return document.querySelector("iframe[src*='youtube.com']");
    }
    function updateVideoButtons() {
        var button = document.getElementById(getVideo() ? 'video-button-container-987' : 'video-button-container-988');
        if (button) button.style.display = 'block';
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateVideoButtons, { once: true });
    } else {
        updateVideoButtons();
    }
    // Keep an existing product-module implementation; do not overwrite its globals.
    if (typeof window.openVideoPopup !== 'function') {
        window.openVideoPopup = function () {
            var video = getVideo();
            var container = document.getElementById('video-container-987');
            var popup = document.getElementById('video-popup-987');
            if (!video || !container || !popup) return;
            var iframe = video.cloneNode(true);
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            container.replaceChildren(iframe);
            popup.style.display = 'flex';
        };
    }
    if (typeof window.closeVideoPopup !== 'function') {
        window.closeVideoPopup = function (event) {
            if (!event || !event.target ||
                (event.target.id !== 'video-popup-987' && event.target.id !== 'close-popup-987')) return;
            var popup = document.getElementById('video-popup-987');
            var container = document.getElementById('video-container-987');
            if (popup) popup.style.display = 'none';
            if (container) container.replaceChildren();
        };
    }
})();
