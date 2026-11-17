
/* ========================================
   ALDERIA — NAVIGATION DYNAMIQUE
   Fetch + URL personnalisées
======================================== */

(() => {


    /* ========================================
       01 — CONFIGURATION
    ======================================== */

    const mainContent = document.querySelector('#main-content');

    const navLinks = document.querySelectorAll('[data-page]');

    // URL principale
    const basePath = '/index.html';

    // Dossier des pages HTML
    const pagesDirectory = '/PAGES/';


    /* ========================================
       02 — RÉCUPÉRER LA PAGE DEPUIS L'URL
    ======================================== */

    const getCurrentPage = () => {

        const params = new URLSearchParams(window.location.search);

        return params.get('page') || 'accueil';

    };


    /* ========================================
       03 — CHARGER UNE PAGE
    ======================================== */

    const loadPage = async (page) => {

        if (!page || !mainContent) return;

        // État de chargement
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

            // Vérification du fichier
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

            // Fin du chargement
            mainContent.classList.remove('is-loading');

        }

    };


    /* ========================================
       04 — LIENS ACTIFS
    ======================================== */

    const updateActiveLink = (page) => {

        navLinks.forEach(link => {

            const linkPage = link.dataset.page;

            // Lien actif et parent des sous-pages
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

        // Construction de la nouvelle URL
        const newUrl = `${basePath}?page=${encodeURIComponent(page)}`;

        // Évite de recharger la même page
        if (getCurrentPage() === page) return;

        // Modification de l'URL sans rechargement
        history.pushState(null, '', newUrl);

        // Chargement du contenu
        loadPage(page);

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

    window.addEventListener('popstate', () => {

        // Récupération de la page précédente
        const page = getCurrentPage();

        // Chargement de son contenu
        loadPage(page);

    });


    /* ========================================
       08 — INITIALISATION
    ======================================== */

    const init = () => {

        // Récupération de la page actuelle
        const initialPage = getCurrentPage();

        // Chargement initial
        loadPage(initialPage);

    };


    // Démarrage
    init();


})();
