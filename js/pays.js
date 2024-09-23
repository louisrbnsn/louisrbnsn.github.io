const obtenirListePays = async () => {
    try {
        const reponseApi = await fetch('https://restcountries.com/v3.1/all');
        const donneesPays = await reponseApi.json();
        return donneesPays;
    } catch (erreur) {
        console.error('Problème lors de la récupération des pays :', erreur);
        return [];
    }
};

const trierPaysParNomFrancais = (listePays) => {
    listePays.sort((paysA, paysB) => {
        const nomA = paysA.translations?.fra?.common || paysA.name.common;
        const nomB = paysB.translations?.fra?.common || paysB.name.common;
        return nomA.localeCompare(nomB);
    });
};

const stockerPaysDansLocalStorage = (listePays) => {
    const tempsActuel = new Date().getTime();
    localStorage.setItem('donneesPays', JSON.stringify({ listePays, dateRecuperation: tempsActuel }));
};

const afficherListePays = (listePays) => {
    const listeElement = document.getElementById('listePays');
    listeElement.innerHTML = '';

    listePays.forEach(pays => {
        const nomPays = pays.translations?.fra?.common || pays.name.common;

        const boitePays = document.createElement('div');
        boitePays.classList.add('pays-boite');

        const imageDrapeau = document.createElement('img');
        imageDrapeau.classList.add('pays-drapeau');
        imageDrapeau.src = pays.flags.svg;
        imageDrapeau.alt = `Drapeau de ${nomPays}`;
        boitePays.appendChild(imageDrapeau);

        const texteNomPays = document.createElement('div');
        texteNomPays.classList.add('pays-nom');
        texteNomPays.textContent = nomPays;
        boitePays.appendChild(texteNomPays);

        listeElement.appendChild(boitePays);
    });
};

const chargerPays = async () => {
    let { listePays, dateRecuperation } = JSON.parse(localStorage.getItem('donneesPays')) || { listePays: [], dateRecuperation: null };

    const tempsActuel = new Date().getTime();
    const unMoisEnMs = 30 * 24 * 60 * 60 * 1000;

    if (!dateRecuperation || (tempsActuel - dateRecuperation) > unMoisEnMs) {
        if (listePays.length > 0) {
            afficherListePays(listePays);
        }

        const nouvelleListePays = await obtenirListePays();
        trierPaysParNomFrancais(nouvelleListePays);
        stockerPaysDansLocalStorage(nouvelleListePays);
        afficherListePays(nouvelleListePays);
    } else {
        afficherListePays(listePays);
    }
};

chargerPays();