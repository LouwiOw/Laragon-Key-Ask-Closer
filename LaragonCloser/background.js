const TARGET_URL = "https://laragon.org/key";

// --- NOUVELLE LOGIQUE OPTIMISÉE ---
// Cette fonction s'exécute AVANT même que la navigation ne commence.
browser.webNavigation.onBeforeNavigate.addListener((details) => {
  // 1. On vérifie que la navigation n'est pas dans un sous-cadre (frameId === 0 signifie l'onglet principal)
  if (details.frameId === 0) {
    
    // 2. On vérifie si l'URL de destination correspond
    if (details.url.includes(TARGET_URL)) {
      
      // 3. Ferme l'onglet INSTANTANÉMENT
      browser.tabs.remove(details.tabId)
        .then(() => {
          console.log(`[Instant Closer] Fermé via onBeforeNavigate : ${details.url}`);
        })
        .catch((error) => {
          console.error(`[Instant Closer] Erreur de fermeture : ${error}`);
        });
    }
  }
}, { url: [{ urlPrefix: TARGET_URL }] }); // <-- Filtre pour n'écouter que cette URL (optimisation)


// --- OPTIMISATION DU DÉMARRAGE ---
// Nous gardons la vérification au démarrage pour les onglets existants,
// même si l'impact sur la performance est minimal ici.
function closeLaragonTab(tab) {
  if (tab.url && tab.url.includes(TARGET_URL)) {
    browser.tabs.remove(tab.id)
      .then(() => {
        console.log(`[Instant Closer] Fermé au Démarrage : ${tab.url}`);
      })
      .catch((error) => {
        console.error(`[Instant Closer] Erreur de fermeture au Démarrage : ${error}`);
      });
  }
}

browser.tabs.query({})
  .then((tabs) => {
    for (let tab of tabs) {
      closeLaragonTab(tab);
    }
  });