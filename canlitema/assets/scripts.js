$(function(){
    /* Sidebar Buttons */
    var menuSelector = '.sidebar-menu, .sidebar-menu-type-2';
    var panelSelector = menuSelector + ', .sidebar-user';

    function syncSidebarState() {
        var isOpen = $(panelSelector).is('.active');
        $('.op-black').toggleClass('show', isOpen).toggleClass('hide', !isOpen);
        // Own only this lock; platform panels and modals keep their own locks.
        $('body').toggleClass('tilbe-sidebar-open', isOpen);
    }

    $(".btn-sidebar-user").click(function () {
        $('.sidebar-user').toggleClass("active");
        syncSidebarState();
    });
    $(".btn-sidebar-menu").click(function () {
        $(menuSelector).toggleClass('active', !$(menuSelector).is('.active'));
        syncSidebarState();
    });
    $(".mobile-menu-close").click(function(){
        $(menuSelector).removeClass('active');
        syncSidebarState();
    });
    $(".op-black").click(function () {
        if ($(menuSelector).is('.active')) {
            $(menuSelector).removeClass('active');
        } else {
            $('.sidebar-user').removeClass('active');
        }
        syncSidebarState();
    });
    syncSidebarState();

    /* Sidebar Categories */
    var show_sidebar_categories = false;
    $(".btn-sidebar-categories").click(function () {
        $('.sidebar-menu .categories').slideToggle("fast");
        if (show_sidebar_categories){
            $(this).find('i').removeClass("fa-angle-up").addClass("fa-angle-down");
        }else{
            $(this).find('i').removeClass("fa-angle-down").addClass("fa-angle-up");
        }
        show_sidebar_categories = !show_sidebar_categories;
    });
    $(".btn-categories-show").click(function () {
        var id = $(this).data('id');
        $('.sidebar-menu .categories .categories-list-'+id).slideToggle("fast");
        $('.sidebar-menu-type-2 .categories .categories-list-'+id).slideToggle("fast");
    });

    var header_hover = false;
    $('.header-cart-hover').hover(function(){
        if (!header_hover){
            showCartBox();
        }
        header_hover = true;
    }, function(){
        header_hover = false;
    });
});

function showLoader(){
    $('.overlay').removeClass('d-none');
}

function hideLoader(){
    $('.overlay').addClass('d-none');
}

function showAlert(data, callback){
    var config = {
        title: data.title ? data.title : '',
        text: data.text ? data.text : '',
        icon: data.status ? data.status : '',
        timer: swal_alert_timer * 1000
    };
    if (data.buttons){
        config.buttons = true;
    }
    if (data.buttonTitle){
        config.button = data.buttonTitle;
    }
    if (!data.buttons && !data.buttonTitle){
        config.buttons = false;
    }
    
    config.timerProgressBar = true;
    if (data.buttonList){
        config.buttons = data.buttonList;
        swal(config).then(callback);
    }else{
        swal(config);
    }
}


function showCartBox(){
     fetchCartAjax();
}

function addCartSuccessEvent(id, page, settings, data, result){
    showCartBox();
      showAlert({
        title: LANG_HELPER.success,
        text: result.message,
        status: result.status,
        buttonList: {
            confirm: {
                text: LANG_HELPER.keepShopping,
                value: 'confirm',
                visible: true,
                className: "btn-primary btn-theme-3",
                closeModal: true
            },
            cart: {
                text: LANG_HELPER.goCart,
                value: 'cart',
                visible: true,
                className: "btn-success btn-theme-4",
                closeModal: false
            }
        }
    }, function(value) {
        if (value == 'cart'){
            window.location = SITE_CONFIG.cartUrl;
        }
    });
}

// Shipment files are submitted by the platform completePaymentStep FormData path.

/* Footer Menü Toogle */
function mobileFooterToggle(cls1){
    if ($(document).width() < 991) {
          $('.f'+cls1).toggle()
    }
}

$(document).ready(function(){
    $(function () {
        $(".readmore a.more").on("click", function () {
            var $parent = $(this).parent();
            if ($parent.data("visible")) {
                $parent.data("visible", false).find(".ellipsis").show().end().find(".moreText").hide().end().find("a.more").text("Devamını Oku");
                $(".readmore").find(".readmore-text").removeClass("show");
                    
            } else {
                $parent.data("visible", true).find(".ellipsis").hide().end().find(".moreText").show().end().find("a.more").text("Devamını Gizle");
                    
                $(".readmore").find(".readmore-text").addClass("show");
            }
        });
    });
});
// Match the selected value as data, never as a CSS selector or JavaScript source.
function tilbeSelectProductVariant(select) {
    var group = select.closest(".variant");
    if (!group) return;
    var choices = group.querySelectorAll("a[data-variant-value]");
    for (var i = 0; i < choices.length; i++) {
        if (choices[i].getAttribute("data-variant-value") === select.value) {
            choices[i].click();
            return;
        }
    }
}
