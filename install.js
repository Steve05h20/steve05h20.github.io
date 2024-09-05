document.addEventListener('DOMContentLoaded', () => {
    let deferredInstallPrompt = null;
    const installButton = document.getElementById('butInstall');

    // Masquer le bouton par défaut au cas où
    if (installButton) {
        installButton.style.display = 'none';

        // Ajouter un écouteur d'événement pour 'beforeinstallprompt'
        window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);

        /**
         * Sauvegarde l'événement et affiche le bouton d'installation.
         *
         * @param {Event} evt
         */
        function saveBeforeInstallPromptEvent(evt) {
            // Empêcher l'affichage automatique de la bannière d'installation
            evt.preventDefault();

            // Sauvegarde l'événement et affiche le bouton
            deferredInstallPrompt = evt;
            installButton.style.display = 'block';  // Afficher le bouton
        }

        /**
         * Gère l'événement 'click' pour l'installation du PWA.
         *
         * @param {Event} evt
         */
        function installPWA(evt) {
            // Vérifie si l'événement 'beforeinstallprompt' a bien été déclenché
            if (deferredInstallPrompt) {
                // Affiche la boîte de dialogue d'installation
                deferredInstallPrompt.prompt();

                // Cache le bouton d'installation après le clic
                installButton.style.display = 'none';

                // Gère le choix de l'utilisateur
                deferredInstallPrompt.userChoice.then((choice) => {
                    if (choice.outcome === 'accepted') {
                        console.log('L\'utilisateur a accepté l\'installation', choice);
                    } else {
                        console.log('L\'utilisateur a rejeté l\'installation', choice);
                    }
                    deferredInstallPrompt = null;
                });
            }
        }

        // Ajoute l'écouteur d'événement au bouton d'installation
        installButton.addEventListener('click', installPWA);

        // Écoute l'événement 'appinstalled'
        window.addEventListener('appinstalled', logAppInstalled);

        /**
         * Gère l'événement 'appinstalled'.
         *
         * @param {Event} evt
         */
        function logAppInstalled(evt) {
            console.log('L\'application a été installée avec succès.', evt);
        }
    } else {
        console.error('Le bouton d\'installation n\'a pas été trouvé');
    }
});