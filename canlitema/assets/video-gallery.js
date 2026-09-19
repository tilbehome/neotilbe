(function () {
    function initialize() {
        document.querySelectorAll('[data-tilbe-video-gallery]').forEach(function (gallery) {
            if (gallery.dataset.videoReady) return;
            var dialog = gallery.querySelector('[data-tilbe-video-dialog]');
            var frame = dialog && dialog.querySelector('iframe');
            var closeButton = dialog && dialog.querySelector('[data-video-close]');
            if (!dialog || !frame || !closeButton) return;
            gallery.dataset.videoReady = 'true';
            var opener;
            var observer = new MutationObserver(function () { if (!gallery.isConnected) close(false); });
            function updateLock() {
                document.body.classList.toggle('tilbe-video-open', Boolean(document.querySelector('[data-tilbe-video-dialog]:not([hidden])')));
            }
            function close(restoreFocus) {
                if (dialog.hidden) return;
                dialog.hidden = true;
                observer.disconnect();
                document.removeEventListener('keydown', onKeydown);
                document.removeEventListener('focusin', onFocus);
                frame.removeAttribute('src');
                updateLock();
                if (restoreFocus && opener && opener.isConnected && !document.querySelector('.modal.show, .swal-overlay--show-modal')) opener.focus();
            }
            gallery.addEventListener('tilbe-video-close', function () { close(false); });
            function activate(target) {
                var source = target.getAttribute('data-video-src');
                if (!/^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]+$/.test(source || '')) return;
                document.querySelectorAll('[data-tilbe-video-gallery]').forEach(function (other) {
                    if (other !== gallery) other.dispatchEvent(new Event('tilbe-video-close'));
                });
                opener = target;
                frame.src = source;
                dialog.hidden = false;
                observer.observe(document.body, { childList: true, subtree: true });
                document.addEventListener('keydown', onKeydown);
                document.addEventListener('focusin', onFocus);
                updateLock();
                closeButton.focus();
            }
            gallery.addEventListener('click', function (event) {
                var target = event.target.closest('[data-video-src]');
                if (target && gallery.contains(target)) activate(target);
                if (event.target === dialog || event.target.closest('[data-video-close]')) close(true);
            });
            gallery.addEventListener('keydown', function (event) {
                var target = event.target.closest('[data-video-src]');
                if (target && (event.key === 'Enter' || event.key === ' ')) {
                    event.preventDefault(); activate(target);
                }
            });
            function onKeydown(event) {
                if (dialog.hidden || document.querySelector('.modal.show, .swal-overlay--show-modal')) return;
                if (event.key === 'Escape') { event.preventDefault(); close(true); }
                if (event.key === 'Tab') {
                    if (event.shiftKey && document.activeElement === closeButton) {
                        event.preventDefault(); frame.focus();
                    } else if (!event.shiftKey && document.activeElement === frame) {
                        event.preventDefault(); closeButton.focus();
                    }
                }
            }
            function onFocus(event) {
                if (!dialog.hidden && !dialog.contains(event.target) && !document.querySelector('.modal.show, .swal-overlay--show-modal')) closeButton.focus();
            }
        });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
    else initialize();
})();
