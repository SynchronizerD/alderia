
/* ========================================
   ALDERIA — NAVIGATION DYNAMIQUE
   Fetch + Hash URL
======================================== */

(() => {


    /* ========================================
       01 — CONFIGURATION
    ======================================== */

    const mainContent = document.querySelector('#main-content');

    const navLinks = document.querySelectorAll('[data-page]');

    // Dossier des pages HTML
    const pagesDirectory = './PAGES/';


    /* ========================================
       02 — RÉCUPÉRER LA PAGE DEPUIS L'URL
    ======================================== */

    const getCurrentPage = () => {

        return window.location.hash.replace(/^#/, '') || 'accueil';

    };


    /* ========================================
       03 — CHARGER UNE PAGE
    ======================================== */

    const loadPage = async (page) => {

        if (!page || !mainContent) return;

        mainContent.classList.add('is-loading');

        try {

            // Construction du chemin du fichier
            const filePath = page
                .split('/')
                .map(segment => encodeURIComponent(segment))
                .join('/');

            // Récupération du fichier HTML
            const response = await fetch(
                `${pagesDirectory}${filePath}.html`
            );

            if (!response.ok) {
                throw new Error(`Page introuvable : ${page}`);
            }

            // Lecture du contenu
            const html = await response.text();

            // Injection dans main-content
            mainContent.innerHTML = html;

            // Mise à jour des liens actifs
            updateActiveLink(page);

            // Retour en haut
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        } catch (error) {

            console.error('Erreur de chargement :', error);

            mainContent.innerHTML = `
                <div class="page-error">
                    <h2>Page introuvable</h2>
                    <p>Impossible de charger cette page.</p>
                </div>
            `;

            updateActiveLink('');

        } finally {

            mainContent.classList.remove('is-loading');

        }

    };


    /* ========================================
       04 — LIENS ACTIFS
    ======================================== */

    const updateActiveLink = (page) => {

        navLinks.forEach(link => {

            const linkPage = link.dataset.page;

            const isActive =
                linkPage === page ||
                page.startsWith(linkPage + '/');

            link.classList.toggle('active', isActive);

        });

    };


    /* ========================================
       05 — NAVIGATION
    ======================================== */

    const navigate = (page) => {

        if (!page) return;

        const newUrl = `#${page}`;

        // Évite de recharger la même page
        if (window.location.hash === newUrl) return;

        // Modification de l'URL
        window.location.hash = page;

    };


    /* ========================================
       06 — CLIC SUR LES LIENS
    ======================================== */

    navLinks.forEach(link => {

        link.addEventListener('click', (event) => {

            event.preventDefault();

            const page = link.dataset.page;

            navigate(page);

        });

    });


    /* ========================================
       07 — HISTORIQUE NAVIGATEUR
    ======================================== */

    window.addEventListener('hashchange', () => {

        const page = getCurrentPage();

        loadPage(page);

    });


    /* ========================================
       08 — INITIALISATION
    ======================================== */

    const init = () => {

        const initialPage = getCurrentPage();

        loadPage(initialPage);

    };


    // Démarrage
    init();


})();
