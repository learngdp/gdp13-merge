$(() => {
    // document.getElementById('deselectAll-rows').dataset.intro = "désélectionne toutes les lignes sélétionnées (surlignées en bleu)";
    // document.getElementById('showAll-coll').dataset.step = 1; //"Affiche toutes les colonnes masquées";
    // document.getElementById('hideAll-coll').dataset.step = 2; //"Masque toutes les colonnes telle qu'elles le sont au démarrage de l'application";

    document.getElementById('guide-btn').onclick = function(e) {

        var content_filterField = 'Liste déroulante à 2 fonctions:';
        content_filterField += '<ol><li>Permet de sélectionner une colonne pour l\'afficher ou la masquer (comme vu précédemment)</li>';
        content_filterField += '<li></li>Applique un filtre "général" sur le tableau en fonction de la colonne sélectionnée</li></ol>';
        var content_groupByInput = 'Case de saisie à 2 fonctions (regrouper les lignes du tableau par entête.s de colonnes):';
        content_groupByInput += '<ol><li>Saisie automatique "indirecte" par un CLIC DROIT successivement sur un ou plusieurs entêtes de colonne</li>';
        content_groupByInput += '<li>Saisie manuelle d\'un entête de colonne à la condition que le texte saisi soit identique y compris la casse</li></ol>'

        var intro = introJs();
        intro.setOptions({
            tooltipPosition: 'top',
            nextLabel: 'suivant',
            prevLabel: 'retour',
            skipLabel: 'sortir',
            doneLabel: 'ok',
            showProgress: true,
            showStepNumbers: false,
            steps: [{
                    intro: '<p>Bienvenue dans la visite guidée</p><p>Vous pouvez interrompre la visite à tout moment et y revenir quand vous voulez en cliquant sur "Guide"</p>'
                },
                {
                    element: '#deselectAll-rows',
                    intro: 'Désélectionne toutes les lignes sélectionnées (surlignées en bleu dans le tableau)',
                    position: 'top'
                }, {
                    element: '#showAll-coll',
                    intro: 'Affiche toutes les colonnes',
                    position: 'top'
                },
                {
                    element: '#hideAll-coll',
                    intro: 'Masque toutes les colonnes qui sont masquées au démarrage de l\'application',
                    position: 'top'
                },
                {
                    element: '#show-col',
                    intro: 'Affiche la colonne sélectionnnée dans la liste déroulante ci-contre (à droite)',
                    position: 'top'
                },
                {
                    element: '#hide-col',
                    intro: 'Masque la colonne sélectionnnée idem dans la liste déroulante ci-contre (à droite)',
                    position: 'top'
                },
                {
                    element: '#filter-field',
                    intro: content_filterField,
                    position: 'top'
                },
                {
                    element: '#filter-type',
                    intro: 'Choisir "like" pour filtrer du texte ou un opérateur pour filtrer des nombres',
                    position: 'top'
                },
                {
                    element: '#filter-value',
                    intro: 'Saisir du texte ou des nombres selon le type de filtre sélectionné',
                    position: 'top'
                },
                {
                    element: '#filter-clear',
                    intro: 'Efface le filtre et réinitialise la liste déroulante et le type de filtre sur les éléments ci-contre (à gauche)',
                    position: 'top'
                },
                {
                    element: '#groupBy-input',
                    intro: content_groupByInput,
                    position: 'top'
                },
                {
                    element: '#groupBy-btn',
                    intro: 'Groupe les lignes du tableau en fonction des entêtes saisis dans la case ci-contre (à gauche)',
                    position: 'top'
                },
                {
                    element: '#degroupBy-btn',
                    intro: 'Dégroupe toutes les lignes groupées du tableau et efface la sélection dans la case ci-contre (à gauche)',
                    position: 'top'
                },
                {
                    element: '#selectCohortes-btn',
                    intro: 'Sélectionne un entête de colonne pour avoir des indicateurs statistiques calculés sur les valeurs contenues dans la colonne',
                    position: 'top'
                },
                {
                    element: '#cohortes-btn',
                    intro: 'Permet de visualiser des indicateurs statistiques par cohorte calculés sur la colonne sélectionnée ci-contre (à gauche) et de les exporter en csv',
                    position: 'top'
                },
                {
                    element: '#finalStandard-btn',
                    intro: 'Export csv des données traitées au format "Final-standard" (Florence). Les données ne sont visualisables qu\'après export',
                    position: 'top'
                },
                {
                    element: '#exportCSV-btn',
                    intro: 'Export CSV des données filtrées. Seules les lignes et les colonnes visibles sont pris en compte dans le fichier de sortie',
                    position: 'top'
                },
                {
                    element: '.tabulator-header-filter',
                    intro: 'Filtre dynamique (sans opérateur)',
                    position: 'top'
                },
                {
                    element: '.tabulator-cell',
                    intro: 'Clic droit sur la cellule pour visualiser la fiche participant et l\'exporter en CSV le cas échéant',
                    position: 'top'
                },
                {
                    element: '.tabulator-footer',
                    intro: 'Divers indicateurs actualisés en temps réel',
                    position: 'top'
                }
            ],
            hints: [
                // {
                //     element: document.querySelector('#step1'),
                //     hint: "This is a tooltip.",
                //     hintPosition: 'top-middle'
                // },
                {
                    element: '.tabulator-header-filter',
                    hint: 'More features, more fun.',
                    position: 'left'
                }
            ]
        });
        intro.oncomplete(function() {
            // intro.addHints();
        });
        intro.onexit(function() {;
        });
        intro.onchange(function(targetElement) {; //add change bits here
        });
        intro.onafterchange(function(targetElement) {
            // console.log(targetElement.id);
            // switch (targetElement.id) {
            //     case "filter-value":
            //         intro.addHints();
            //         intro.exit();
            //         break;
            //     default:
            //         break;
            // }
        });
        intro.onbeforechange(function(targetElement) {; // add change bits here
        });

        intro.start();
    }
});
