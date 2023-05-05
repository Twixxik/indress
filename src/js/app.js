class Indress {

    handlers = [];
    timeouts = [];

    constructor() {
        document.addEventListener('DOMContentLoaded', (function () {
            this.initEvents();
            this.initSliders();
            this.calculateAppHeight()
        }).bind(this));
    }

    initEvents() {
        window.addEventListener('load', this.onLoad.bind(this));
        window.addEventListener('resize', this.onResize.bind(this), {passive: true});
        window.addEventListener('scroll', this.onScroll.bind(this), {passive: true});
        this.addEventListener('.header__nav-link', 'mouseover', this.headerNavHoverHandler, true, {passive: true});
        this.addEventListener('.header', 'mouseleave', this.headerCloseSubmenu, false, {passive: true});
        this.addEventListener('.header__mobile_menu-btn', 'click', this.openMobileMenu.bind(this));
        this.addEventListener('input, select, textarea', 'focusin', this.disableZoom.bind(this), true, {passive: true});
        this.addEventListener('input, select, textarea', 'focusout', this.enableZoom.bind(this), true, {passive: true});
    }

    disableZoom() {
        let meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
            meta.setAttribute('content', 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no');
        }
    }

    enableZoom() {
        let meta = document.querySelector('meta[name="viewport"]');
        if (meta) {
            meta.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no');
        }
    }

    initSliders() {
        let fullwidthBanners = document.querySelectorAll('.fullwidth-banner');
        if (fullwidthBanners.length > 0) {
            for (let banner of fullwidthBanners) {
                let swiper = banner.querySelector('.swiper'),
                    pagination = banner.querySelector('.swiper-pagination');

                new Swiper(swiper, {
                    loop: true,
                    pagination: {
                        el: pagination,
                        clickable: true,
                    },
                });

            }
        }
    }

    onLoad(event) {
        this.checkHeaderMenuSize();
        this.checkHeaderDark();
    }

    onResize(event) {
        this.checkHeaderMenuSize();
        this.calculateAppHeight();
    }

    onScroll() {
        this.checkHeaderDark();
    }

    checkHeaderDark() {
        try {
            window.observer = new IntersectionObserver((function (entries) {
                entries.forEach((function (entry) {
                    if (this.timeouts['headerDark'] > 0) {
                        window.cancelAnimationFrame(this.timeouts['headerDark']);
                        this.timeouts['headerDark'] = 0;
                    }
                    this.timeouts['headerDark'] = window.requestAnimationFrame((function () {
                        header.classList.toggle(
                            '_dark',
                            entry.isIntersecting
                            && entry.intersectionRect.top <= 5
                            && entry.intersectionRect.bottom >= header.clientHeight
                        );
                    }).bind(this));
                }).bind(this));
            }).bind(this), {
                root: document.querySelector('.wrapper'),
                rootMargin: '0px',
                threshold: 1.0
            });

            let header = document.querySelector('.header'),
                fullwidthBanners = document.querySelectorAll('.fullwidth-banner');
            if (fullwidthBanners.length > 0) {
                for (const fullwidthBanner of fullwidthBanners) {
                    observer.observe(fullwidthBanner);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    checkHeaderMenuSize() {
        try {
            if (this.timeouts['menuSize'] > 0) {
                window.cancelAnimationFrame(this.timeouts['menuSize']);
                this.timeouts['menuSize'] = 0;
            }
            this.timeouts['menuSize'] = window.requestAnimationFrame((function () {
                let header = document.querySelector('.header'),
                    menu = header.querySelector('.header__menu'),
                    nav = header.querySelector('.header__nav');
                header.classList.remove('_mobile');
                header.classList.toggle('_mobile', window.innerWidth < 768 || nav.clientWidth >= menu.clientWidth);
            }).bind(this));
        } catch (e) {
            console.error(e);
        }
    }

    openMobileMenu(event) {
        let mobileMenu = document.querySelector('.header__mobile_menu');
        event.currentTarget.classList.toggle('_active');
        this.disableScroll(mobileMenu.classList.toggle('_open'));
    }

    disableScroll(bool = true) {
        document.body.classList.toggle('scroll-disabled', bool)
    }

    headerNavHoverHandler(event) {
        let submenu;
        if ((submenu = this.parentElement.querySelector('.header__submenu-list'))) {
            document.querySelector('.header').classList.add('_sub-open');
            submenu.classList.add('_active');
        } else {
            document.querySelector('.header').classList.remove('_sub-open');
        }
        document.querySelectorAll('.header__submenu-list._active').forEach(function (el) {
            if (submenu && el !== submenu) {
                el.classList.remove('_active');
            }
        });
    }

    headerCloseSubmenu(event) {
        this.classList.remove('_sub-open');
    }

    addEventListener(selector, event, handler, root = false, options) {
        try {
            if (root && typeof selector === 'string') {
                if (!(this.handlers[event] instanceof Map)) {
                    this.handlers[event] = new Map();
                    document.addEventListener(event, this.rootEventHandler.bind(this), options);
                }
                if (this.handlers[event].has(selector)) {
                    this.handlers[event].get(selector).push(handler)
                } else {
                    this.handlers[event].set(selector, [handler]);
                }
            } else {
                let arr;
                if (typeof selector === 'string') {
                    arr = document.querySelectorAll(selector);
                } else {
                    arr = [selector];
                }
                arr.forEach(function (el) {
                    el.addEventListener(event, handler, options);
                });
            }
        } catch (e) {
            console.error(e);
        }
    }

    rootEventHandler(event) {
        if (this.handlers[event.type]) {
            let el;
            try {
                for (let [selector, handlers] of this.handlers[event.type]) {
                    el = event.target.closest(selector);
                    if (el) {
                        handlers.forEach(function (handler) {
                            handler.call(el, event);
                        });
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    calculateAppHeight() {
        document.documentElement.style.setProperty('--app-height', (window.innerHeight / 100) + 'px');
    }
}


window.Indress = new Indress();