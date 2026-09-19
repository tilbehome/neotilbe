$(function(){
    /* Sidebar Buttons */
    var menuSelector = '.sidebar-menu, .sidebar-menu-type-2';
    var panelSelector = menuSelector + ', .sidebar-user';
    var menuOpener;
    var userOpener;

    function modalOwnsFocus() {
        return !!document.querySelector('.modal.show, .swal-overlay--show-modal');
    }

    function panelControls() {
        return $(panelSelector).filter('.active').find('a[href], button, input, select, textarea, [tabindex]')
            .filter(function () {
                return !this.disabled && this.tabIndex >= 0 && $(this).is(':visible') &&
                    window.getComputedStyle(this).visibility !== 'hidden';
            });
    }

    function focusSidebar(opener) {
        if (modalOwnsFocus()) return;
        var controls = panelControls();
        var target = controls[0] || opener;
        if (target && target.isConnected && $(target).is(':visible')) target.focus();
    }

    function syncSidebarState() {
        var isOpen = $(panelSelector).is('.active');
        $(panelSelector).each(function () {
            var open = $(this).hasClass('active');
            this.toggleAttribute('inert', !open);
            this.setAttribute('aria-hidden', open ? 'false' : 'true');
        });
        $('.btn-sidebar-menu').attr('aria-expanded', $(menuSelector).is('.active') ? 'true' : 'false');
        $('.btn-sidebar-user').attr('aria-expanded', $('.sidebar-user').is('.active') ? 'true' : 'false');
        $('.op-black').toggleClass('show', isOpen).toggleClass('hide', !isOpen);
        // Own only this lock; platform panels and modals keep their own locks.
        $('body').toggleClass('tilbe-sidebar-open', isOpen);
    }

    $(".btn-sidebar-user").click(function () {
        if (!$(this).closest(panelSelector).length) userOpener = this;
        $('.sidebar-user').toggleClass("active");
        syncSidebarState();
        focusSidebar(userOpener);
    });
    $(".btn-sidebar-menu").click(function () {
        menuOpener = this;
        $(menuSelector).toggleClass('active', !$(menuSelector).is('.active'));
        syncSidebarState();
        focusSidebar(menuOpener);
    });
    $(".mobile-menu-close").click(function(){
        $(menuSelector).removeClass('active');
        syncSidebarState();
        focusSidebar(menuOpener);
    });
    $(".op-black").click(function () {
        var opener = $(menuSelector).is('.active') ? menuOpener : userOpener;
        if ($(menuSelector).is('.active')) {
            $(menuSelector).removeClass('active');
        } else {
            $('.sidebar-user').removeClass('active');
        }
        syncSidebarState();
        focusSidebar(opener);
    });
    $(document).on('keydown.tilbeSidebar', function (event) {
        if (!$(panelSelector).is('.active') || modalOwnsFocus()) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            $('.op-black').first().trigger('click');
        } else if (event.key === 'Tab') {
            var controls = panelControls();
            if (!controls.length) return;
            var current = controls.index(document.activeElement);
            if (current < 0 || (event.shiftKey && current === 0) || (!event.shiftKey && current === controls.length - 1)) {
                event.preventDefault();
                controls[event.shiftKey ? controls.length - 1 : 0].focus();
            }
        }
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
    var alertOpener = document.activeElement;
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
    }
    swal(config).then(function(value) {
        var active = document.activeElement;
        var alertHasFocus = active && active.closest && active.closest('.swal-modal');
        if (alertOpener && alertOpener.isConnected && alertOpener.getClientRects().length &&
            !document.querySelector('.swal-overlay--show-modal, .modal.show') &&
            (active === document.body || alertHasFocus)) {
            alertOpener.focus();
        }
        if (data.buttonList && typeof callback === 'function') callback(value);
    });
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
function mobileFooterToggle(cls1, trigger) {
    if (window.matchMedia('(max-width:991px)').matches) {
        var footer = trigger && trigger.closest('footer');
        var groups = footer ? $(footer).find('.f' + cls1) : $('footer .f' + cls1);
        groups.toggle();
        if (trigger) trigger.setAttribute('aria-expanded', groups.is(':visible') ? 'true' : 'false');
    }
}

$(function () {
    function syncFooterGroups() {
        var mobile = window.matchMedia('(max-width:991px)').matches;
        document.querySelectorAll('footer .footer-group-toggle').forEach(function (button) {
            var group = document.getElementById(button.getAttribute('aria-controls'));
            if (!group) return;
            if (!mobile) group.style.removeProperty('display');
            button.disabled = !mobile;
            button.setAttribute('aria-expanded', $(group).is(':visible') ? 'true' : 'false');
        });
    }
    syncFooterGroups();
    $(window).off('resize.tilbeFooter').on('resize.tilbeFooter', syncFooterGroups);
});

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

// Resolve the video from the clicked control, not a repeated index/global ID.
function tilbePlayProductVideo(button) {
    var holder = button.closest('.video');
    var video = holder && holder.querySelector('video');
    if (!video || button.disabled) return;
    button.disabled = true;
    function started() {
        button.disabled = false;
        video.controls = true;
        button.style.display = 'none';
    }
    function failed() { button.disabled = false; }
    try {
        var playing = video.play();
        if (playing && typeof playing.then === 'function') playing.then(started, failed);
        else started();
    } catch (error) { failed(); }
}

// Existing help links use legacy fragments; panel IDs are now instance-specific.
(function () {
    function scrollHelpEntry() {
        var match = /^#accordion-head-(\d+)$/.exec(window.location.hash);
        if (!match || document.getElementById(window.location.hash.slice(1))) return;
        var heading = document.querySelector('[data-help-entry-id="' + match[1] + '"]');
        if (heading) heading.scrollIntoView();
    }
    $(scrollHelpEntry);
    $(window).off('hashchange.tilbeHelp').on('hashchange.tilbeHelp', scrollHelpEntry);
})();
