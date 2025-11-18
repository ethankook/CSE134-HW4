document.addEventListener('DOMContentLoaded', () => {
    const projectsSection = document.querySelector('#projects');
    const projectArticles = projectsSection
        ? projectsSection.querySelectorAll('article')
        : [];

    const modal = document.getElementById('project-modal');
    const modalBody = modal ? modal.querySelector('.project-modal__body') : null;
    const modalClose = modal ? modal.querySelector('.project-modal__close') : null;
    const modalBackdrop = modal ? modal.querySelector('.project-modal__backdrop') : null;

    if (!projectsSection || projectArticles.length === 0 || !modal || !modalBody) return;

    const prefersReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;

    function toggleModal(show, contentArticle) {
        const updateDOM = () => {
            if (show && contentArticle) {
                // Copy the article's content into the modal body
                modalBody.innerHTML = contentArticle.innerHTML;
                modal.removeAttribute('hidden');
                document.body.classList.add('has-modal');
            } else {
                modal.setAttribute('hidden', 'hidden');
                document.body.classList.remove('has-modal');
                modalBody.innerHTML = '';
            }
        };

        if (!document.startViewTransition || prefersReducedMotion) {
            updateDOM();
        } else {
            document.startViewTransition(updateDOM);
        }
    }

    projectArticles.forEach((article) => {
        article.addEventListener('click', (event) => {
            const target = event.target;

            if (target.closest('a')) {
                return;
            }

            event.preventDefault();
            toggleModal(true, article);
        });
    });

    function closeModal(ev) {
        if (ev && ev.preventDefault) ev.preventDefault();
        if (modal.hasAttribute('hidden')) return;
        toggleModal(false);
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !modal.hasAttribute('hidden')) {
            closeModal(event);
        }
    });
});
