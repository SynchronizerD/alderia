document.querySelectorAll('.accordion-title').forEach(title => {

    title.addEventListener('click', () => {

        const currentGroup = title.closest('.accordion-group');
        const isOpen = currentGroup.classList.contains('active');

        // Fermer tous les groupes
        document.querySelectorAll('.accordion-group').forEach(group => {
            group.classList.remove('active');
        });

        // Ouvrir le groupe cliqué s'il était fermé
        if (!isOpen) {
            currentGroup.classList.add('active');
        }

    });

});