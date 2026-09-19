function getRandomCount(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getCountWithCache(key, min, max) {
        var cachedData = localStorage.getItem(key);
        if (cachedData) {
            var parsedData = JSON.parse(cachedData);
            if (parsedData.timestamp && Date.now() - parsedData.timestamp < 24 * 60 * 60 * 1000) {
                return parsedData.count;
            }
        }
        var count = getRandomCount(min, max);
        var newData = {
            timestamp: Date.now(),
            count: count,
        };
        localStorage.setItem(key, JSON.stringify(newData));
        return count;
    }

    function updateProductInfo() {
        var productElements = document.querySelectorAll(".product-profile-1");

        productElements.forEach(function (productElement) {
            var productId = productElement.dataset.productId;

            var basketCount = getCountWithCache(`${productId}_basket`, 5, 38);
            var favoriteCount = getCountWithCache(`${productId}_favorite`, 2, 43);
            var viewCount = getCountWithCache(`${productId}_view`, 3, 85);
            var salesCount = getCountWithCache(`${productId}_sales`, 1, 17);

            productElement.querySelector(".basket-count").textContent = `Bu ürün ${basketCount} kişinin sepetinde, tükenmeden al!`;
            productElement.querySelector(".favorite-count").textContent = `Sevilen ürün! ${favoriteCount} kişi tarafından favorilendi!`;
            productElement.querySelector(".view-count").textContent = `Popüler ürün! ${viewCount} kişi görüntüledi!`;
            productElement.querySelector(".sales-count").textContent = `Bu hafta, Bu üründen ${salesCount} adet satıldı!`;
        });
    }

    document.addEventListener("DOMContentLoaded", updateProductInfo);