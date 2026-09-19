// The existing product video popup; no platform library or request is replaced.
(function () {
    function initialize() {
        var popup = document.getElementById('video-popup-987');
        var button = document.getElementById('video-button-987');
        var holder = document.getElementById('video-container-987');
        var closeButton = document.getElementById('close-popup-987');
        if (!popup || !button || !holder || !closeButton || popup.dataset.ready) return;
        popup.dataset.ready = 'true';
        var scope = popup.closest('.product-body') || popup.closest('.product-profile-1');
        var source = scope && scope.querySelector('iframe[src*="youtube.com"]');
        var available = document.getElementById('video-button-container-987');
        var unavailable = document.getElementById('video-button-container-988');
        if (available) available.style.display = source ? 'block' : 'none';
        if (unavailable) unavailable.style.display = source ? 'none' : 'block';
        var observer = new MutationObserver(function () {
            if (!popup.isConnected) close(false);
        });
        function close(restoreFocus) {
            if (popup.hidden) return;
            popup.hidden = true;
            holder.replaceChildren();
            document.body.classList.remove('tilbe-product-video-open');
            document.removeEventListener('keydown', keydown);
            document.removeEventListener('focusin', focusin);
            observer.disconnect();
            if (restoreFocus && button.isConnected && !document.querySelector('.modal.show, .swal-overlay--show-modal')) button.focus();
        }
        function focusin(event) {
            if (document.querySelector('.modal.show, .swal-overlay--show-modal')) return;
            if (!popup.contains(event.target)) closeButton.focus();
        }
        function keydown(event) {
            if (document.querySelector('.modal.show, .swal-overlay--show-modal')) return;
            if (event.key === 'Escape') { event.preventDefault(); close(true); }
            if (event.key === 'Tab' && event.shiftKey && document.activeElement === closeButton) {
                event.preventDefault();
                var frame = holder.querySelector('iframe');
                if (frame) frame.focus();
            }
        }
        button.addEventListener('click', function () {
            if (!source || !popup.hidden) return;
            var frame = source.cloneNode(true);
            frame.removeAttribute('id');
            frame.title = frame.title || 'Ürün videosu oynatıcısı';
            // Cross-origin player key events do not bubble into this document.
            frame.tabIndex = 0;
            frame.style.width = '100%';
            frame.style.height = '100%';
            holder.replaceChildren(frame);
            popup.hidden = false;
            document.body.classList.add('tilbe-product-video-open');
            document.addEventListener('keydown', keydown);
            document.addEventListener('focusin', focusin);
            observer.observe(document.body, {childList:true,subtree:true});
            closeButton.focus();
        });
        closeButton.addEventListener('click', function () { close(true); });
        popup.addEventListener('click', function (event) { if (event.target === popup) close(true); });
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once:true});
    else initialize();
})();
