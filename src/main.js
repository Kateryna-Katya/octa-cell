/**
 * PROJECT: Octa-Cell (2025)
 * DESCRIPTION: Full Interactive Logic for AI-Blog & Bot Development Platform
 */

// 1. Регистрация плагинов GSAP
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    // --- 2. ИНИЦИАЛИЗАЦИЯ ИКОНОК (LUCIDE) ---
    const initIcons = () => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };
    initIcons();

    // --- 3. ПЛАВНЫЙ СКРОЛЛ (LENIS) ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Интеграция ScrollTrigger с Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // --- 4. МОБИЛЬНОЕ МЕНЮ ---
    const burger = document.querySelector('.burger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav__link');

    const toggleMenu = () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    };

    if (burger) {
        burger.addEventListener('click', toggleMenu);
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) toggleMenu();
        });
    });

    // --- 5. АНИМАЦИЯ HERO (GSAP + SPLITTYPE) ---
    const titleElement = document.querySelector('#hero-title');
    if (titleElement) {
        // Настройка SplitType: используем и слова, и символы
        const text = new SplitType(titleElement, {
            types: 'words, chars',
            tagName: 'span'
        });

        // Анимация появления букв
        gsap.from(text.chars, {
            opacity: 0,
            y: 40,
            rotateX: -60,
            stagger: 0.02,
            duration: 1.2,
            ease: 'power4.out',
            delay: 0.5
        });

        // Анимация подзаголовка и кнопок
        gsap.from('.hero__subtitle, .hero__actions', {
            opacity: 0,
            y: 20,
            stagger: 0.2,
            duration: 1,
            ease: 'power3.out',
            delay: 1.3
        });
    }

    // --- 6. УНИВЕРСАЛЬНАЯ АНИМАЦИЯ ПОЯВЛЕНИЯ СЕКЦИЙ ---
    // Ищем все секции кроме Hero
    const animatedSections = gsap.utils.toArray('section:not(#hero)');

    animatedSections.forEach(section => {
        // Элементы для анимации внутри каждой секции
        const targets = section.querySelectorAll(
            '.section-title, .feature-card, .post-card, .section-text, .contact__form-container, .feature-list li, .innovations__wrapper'
        );

        if (targets.length > 0) {
            gsap.from(targets, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 82%', // Порог срабатывания
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 40,
                duration: 0.8,
                stagger: 0.12,
                ease: 'power2.out',
                clearProps: 'all' // Удаляет инлайновые стили после завершения (фиксит баги верстки)
            });
        }
    });

    // --- 7. КОНТАКТНАЯ ФОРМА И ВАЛИДАЦИЯ ---
    const contactForm = document.getElementById('ai-form');
    const phoneInput = document.getElementById('phone');
    const captchaLabel = document.getElementById('captcha-question');
    const captchaInput = document.getElementById('captcha-input');
    const formStatus = document.getElementById('form-status');

    let captchaAnswer = 0;

    const generateCaptcha = () => {
        if (!captchaLabel) return;
        const n1 = Math.floor(Math.random() * 9) + 1;
        const n2 = Math.floor(Math.random() * 9) + 1;
        captchaAnswer = n1 + n2;
        captchaLabel.innerText = `${n1} + ${n2} =`;
    };

    generateCaptcha();

    // Валидация телефона (только цифры)
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Проверка капчи
            if (parseInt(captchaInput.value) !== captchaAnswer) {
                alert('Ошибка: Решите математический пример правильно!');
                generateCaptcha();
                captchaInput.value = '';
                return;
            }

            // Имитация AJAX-отправки
            const submitBtn = contactForm.querySelector('button');
            const originalText = submitBtn.innerText;

            submitBtn.disabled = true;
            submitBtn.innerText = 'Отправка данных...';

            setTimeout(() => {
                contactForm.reset();
                generateCaptcha();

                submitBtn.disabled = false;
                submitBtn.innerText = originalText;

                formStatus.innerText = 'Заявка успешно отправлена! Мы свяжемся с вами скоро.';
                formStatus.classList.add('success');
                formStatus.style.display = 'block';

                // Скрыть сообщение через 6 секунд
                setTimeout(() => {
                    gsap.to(formStatus, {
                        opacity: 0,
                        duration: 0.5,
                        onComplete: () => {
                            formStatus.style.display = 'none';
                            formStatus.style.opacity = '1';
                            formStatus.classList.remove('success');
                        }
                    });
                }, 6000);
            }, 1800);
        });
    }

    // --- 8. COOKIE POPUP ---
    const cookiePopup = document.getElementById('cookie-popup');
    const cookieAccept = document.getElementById('cookie-accept');

    if (cookiePopup && !localStorage.getItem('octa_cookies_accepted')) {
        setTimeout(() => {
            cookiePopup.classList.add('active');
        }, 3000); // Показываем через 3 секунды после загрузки
    }

    if (cookieAccept) {
        cookieAccept.addEventListener('click', () => {
            cookiePopup.classList.remove('active');
            localStorage.setItem('octa_cookies_accepted', 'true');
        });
    }

    // --- 9. ЭФФЕКТ ХЕДЕРА ПРИ СКРОЛЛЕ ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.padding = '5px 0';
            header.style.background = 'rgba(15, 23, 42, 0.9)';
        } else {
            header.style.padding = '0';
            header.style.background = 'rgba(15, 23, 42, 0.7)';
        }
    });

});