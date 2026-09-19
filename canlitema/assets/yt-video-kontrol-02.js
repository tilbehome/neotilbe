<script>
    document.addEventListener("DOMContentLoaded", function() {
        const youtubeIframe = document.querySelector("iframe[src*='youtube.com']");
        if (youtubeIframe) {
            document.getElementById("video-button-container-987").style.display = "block";
        } else {
            document.getElementById("video-button-container-988").style.display = "block";
        }
    });

    function openVideoPopup() {
        const youtubeIframe = document.querySelector("iframe[src*='youtube.com']");
        if (youtubeIframe) {
            const videoContainer = document.getElementById("video-container-987");
            videoContainer.innerHTML = "";
            const newIframe = youtubeIframe.cloneNode(true);
            newIframe.style.width = "100%";
            newIframe.style.height = "100%";
            videoContainer.appendChild(newIframe);
            document.getElementById("video-popup-987").style.display = "flex";
        }
    }
    
    function closeVideoPopup(event) {
        if (event.target.id === "video-popup-987" || event.target.id === "close-popup-987") {
            document.getElementById("video-popup-987").style.display = "none";
            
            // Videoyu durdurmak için iframe'in src değerini sıfırla
            const videoContainer = document.getElementById("video-container-987");
            const iframe = videoContainer.querySelector("iframe");
            if (iframe) {
                iframe.src = ""; // Videonun çalmaya devam etmesini engelle
                videoContainer.innerHTML = ""; // DOM'u temizle
            }
        }
    }
</script>