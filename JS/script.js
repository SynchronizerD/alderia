
/* ========================================
   ALDERIA — NAVIGATION DYNAMIQUE
======================================== */

(() => {

    /* ========================================
       ELEMENTS
    ======================================== */

    const mainContent = document.querySelector('#main-content');

    const navLinks = document.querySelectorAll('[data-page]');


    /* ========================================
       CHARGEMENT D'UNE PAGE
    ======================================== */

    const loadPage = async (page) => {

        if (!page || !mainContent) return;

        // État de chargement
        mainContent.classList.add('is-loading');

        try {

            // Récupération du fichier HTML
            const response = await fetch(`PAGES/${page}.html`);

            if (!response.ok) {
                throw new Error(`Page introuvable : ${page}`);
            }

            // Lecture du contenu
            const html = await response.text();

            // Injection dans main-content
            mainContent.innerHTML = html;

            // Mise à jour des liens actifs
            updateActiveLink(page);

            // Retour en haut du contenu
            mainContent.scrollTop = 0;
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

        } catch (error) {

            console.error(error);

            mainContent.innerHTML = `
                <div class="page-error">
                    <h2>Page introuvable</h2>
                    <p>Impossible de charger cette page.</p>
                </div>
            `;

        } finally {

            mainContent.classList.remove('is-loading');

        }

    };


    /* ========================================
       MISE À JOUR DU LIEN ACTIF
    ======================================== */

    const updateActiveLink = (page) => {

        navLinks.forEach(link => {

            const linkPage = link.dataset.page;

            link.classList.remove('active');

            if (linkPage === page) {
                link.classList.add('active');
            }

            // Active également le parent
            // lorsqu'une sous-page est sélectionnée
            if (page.startsWith(linkPage + '/')) {
                link.classList.add('active');
            }

        });

    };


    /* ========================================
       GESTION DE LA NAVIGATION
    ======================================== */

    const navigate = () => {

        // Récupération de la page dans l'URL
        let page = decodeURIComponent(
            window.location.hash.substring(1)
        );

        // Page par défaut
        if (!page) {
            page = 'accueil';
        }

        loadPage(page);

    };


    /* ========================================
       CLIC SUR LES LIENS
    ======================================== */

    navLinks.forEach(link => {

        link.addEventListener('click', (event) => {

            const page = link.dataset.page;

            if (!page) return;

            event.preventDefault();

            // Mise à jour de l'URL
            window.location.hash = page;

        });

    });


    /* ========================================
       HISTORIQUE DU NAVIGATEUR
    ======================================== */

    window.addEventListener('hashchange', navigate);


    /* ========================================
       INITIALISATION
    ======================================== */

    navigate();

})();
