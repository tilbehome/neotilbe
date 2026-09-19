function updateQuantity(quantity, element) {
    // Birinci fonksiyonun işlevini devam ettir
    updateQuantityForDiscount(quantity, element);

    // İkinci fonksiyonun işlevini burada çağır
    updateQuantityAndPrice(quantity);
}

function updateQuantityForDiscount(quantity, element) {
    // Tüm discount-box'larda selected sınıfını kaldır
    const boxes = document.querySelectorAll('.discount-box');
    boxes.forEach(box => box.classList.remove('selected'));
    
    // Tıklanan kutuya selected sınıfını ekle
    element.classList.add('selected');
    
    // Seçilen miktarı güncellemek için burada ek işlemler yapabilirsiniz
    console.log(`Seçilen miktar: ${quantity}`);
}

function updateQuantityAndPrice(quantity) {
    $('div[data-product-id="{{ sayfaBilgileri('ID') }}"] input[name="quantity"]').val(quantity);
    updateDiscountAndPrice();
}

function updateDiscountAndPrice() {
    let quantity = parseInt($('div[data-product-id="{{ sayfaBilgileri('ID') }}"] input[name=quantity]').val());
    let basePrice = parseFloat('{{ sayfaBilgileri('fiyat') }}');
    let discount = 0;
    const discountTiers = [
        { amount: 3, discount: 2.601 },
        { amount: 6, discount: 5.729 },
        { amount: 9, discount: 8.909 }
    ];
    
    for (let tier of discountTiers) {
        if (quantity >= tier.amount) {
            discount = tier.discount;
        }
    }
    if (quantity === 1) discount = 0;
    
    let discountedPrice = basePrice * (1 - discount / 100);
    let totalPrice = discountedPrice * quantity;
    
    const formatPrice = (price) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'decimal',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price).replace('.', ',');
    };
    
    discountedPrice = formatPrice(discountedPrice);
    if (quantity > 1) totalPrice = Math.round(totalPrice * 100) / 100;
    totalPrice = formatPrice(totalPrice);
    
    $('div[data-product-id="{{ sayfaBilgileri('ID') }}"] #discount-percentage').text(discount + "%");
    $('div[data-product-id="{{ sayfaBilgileri('ID') }}"] #total-price').text(totalPrice + " TL");
    document.getElementById('price').innerText = (quantity === 1) ? formatPrice(basePrice) + " TL" : discountedPrice + " TL";
}