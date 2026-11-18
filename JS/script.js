/* ========================================
   ALDERIA — NAVIGATION DYNAMIQUE
   Fetch + Hash URL
======================================== */

(() => {

    /* ========================================
       01 — CONFIGURATION
    ======================================== */

    const mainContent = document.querySelector('#main-content');

    // Dossier des pages HTML (la casse doit correspondre au vrai dossier)
    const pagesDirectory = './PAGES/';

    // Page par défaut
    const defaultPage = 'accueil';


    /* ========================================
       02 — RÉCUPÉRER LA PAGE DEPUIS L'URL
    ======================================== */

    const getCurrentPage = () => {
        return decodeURIComponent(window.location.hash.replace(/^#/, '')) || defaultPage;
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
            const response = await fetch(`${pagesDirectory}${filePath}.html`);

            if (!response.ok) {
                throw new Error(`Page introuvable : ${page}`);
            }

            // Lecture et analyse du contenu (page complète ou fragment)
            const html = await response.text();
            const doc = new DOMParser().parseFromString(html, 'text/html');

            // Les scripts de la page sont déjà chargés par l'index
            doc.querySelectorAll('script').forEach(s => s.remove());

            // Les chemins "../Images/..." deviennent "Images/..."
            // (la page est affichée depuis la racine)
            const contenu = doc.body.innerHTML.replaceAll('../', '');

            // Injection dans main-content
            mainContent.innerHTML = contenu;

            // Relance le slider si la page en contient un
            if (typeof initSlider === 'function') initSlider();

            // Mise à jour des liens actifs
            updateActiveLink(page);

            // Retour en haut
            window.scrollTo({ top: 0, behavior: 'smooth' });

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

        document.querySelectorAll('[data-page]').forEach(link => {

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

        // Même page : on recharge directement (hashchange ne se déclencherait pas)
        if (window.location.hash === `#${page}`) {
            loadPage(page);
            return;
        }

        // Modification de l'URL (déclenche hashchange)
        window.location.hash = page;

    };


    /* ========================================
       06 — CLIC SUR LES LIENS (délégation)
       Fonctionne aussi pour les liens ajoutés dynamiquement
    ======================================== */

    document.addEventListener('click', (event) => {

        const link = event.target.closest('[data-page]');
        if (!link) return;

        event.preventDefault();
        navigate(link.dataset.page);

    });


    /* ========================================
       07 — HISTORIQUE NAVIGATEUR
    ======================================== */

    window.addEventListener('hashchange', () => {
        loadPage(getCurrentPage());
    });


    /* ========================================
       08 — INITIALISATION
    ======================================== */

    loadPage(getCurrentPage());

})();