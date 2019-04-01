function getDetailsCohortes(data, selected, cohortTitle) {
    // console.log(selected, cohortTitle);
    var patternPoint = /^[0-9]+([.][0-9]+)?%?$/;
    var testPoint = function (d) {
        return patternPoint.test(d) ? d.replace(/\./, ",") : d;
    }
    var nestedCohortes = d3.nest()
        .key(d => d[cohortTitle])
        .rollup(v => {
            var gradesFull = v.map(d => (isNaN(parseFloat(d[selected]))) ? 0 : Math.round(parseFloat(d[selected]) * 100) / 100);
            gradesFull.sort();
            var grades = filter_array(gradesFull);
            // if (grades.length >= 1) console.log(grades);
            var median = grades.length >= 1 ? parseFloat(d3.median(grades)) : 0,
                min = grades.length >= 1 ? parseFloat(d3.min(grades)) : 0,
                max = grades.length >= 1 ? parseFloat(d3.max(grades)) : 0,
                avg = grades.length >= 1 ? parseFloat(d3.mean(grades)) : 0,
                quartileFirst = grades.length > 1 ? parseFloat(d3.quantile(grades, 0.25)) : 0,
                quartileThird = grades.length > 1 ? parseFloat(d3.quantile(grades, 0.75)) : 0,
                decileFirst = grades.length > 1 ? parseFloat(d3.quantile(grades, 0.1)) : 0,
                decileLast = grades.length > 1 ? parseFloat(d3.quantile(grades, 0.9)) : 0,
                // rapportD9D1 = (decileFirst !== 0 && decileLast !== 0) ? (decileLast / decileFirst) : 0,
                variance = grades.length > 1 ? parseFloat(d3.variance(grades)) : 0,
                deviation = grades.length > 1 ? parseFloat(d3.deviation(grades)) : 0;
            return {
                gradesFull: gradesFull.length,
                grades: grades.length,
                min: min !== 0 ? min.toFixed(2) : "",
                max: max !== 0 ? max.toFixed(2) : "",
                avg: avg !== 0 ? avg.toFixed(2) : "",
                median: median !== 0 ? median.toFixed(2) : "",
                quartileFirst: quartileFirst !== 0 ? quartileFirst.toFixed(2) : "",
                quartileThird: quartileThird !== 0 ? quartileThird.toFixed(2) : "",
                decileFirst: decileFirst !== 0 ? decileFirst.toFixed(2) : "",
                decileLast: decileLast !== 0 ? decileLast.toFixed(2) : "",
                // rapportD9D1: rapportD9D1 !== 0 ? rapportD9D1.toFixed(2) : "",
                variance: variance !== 0 ? variance.toFixed(2) : "",
                deviation: deviation !== 0 ? deviation.toFixed(2) : ""
            };
        })
        .entries(data);
    // console.log(nestedCohortes);

    var cohortesHtml = [
        ["cohorte", "participants", "actifs", "min", "max", "moyenne", "médiane", "1er quartile", "3ème quartile", "1er décile",
            "9ème décile", "variance", "écart-type"
        ] // , "rapport (D9/D1)"
    ];

    nestedCohortes.forEach(obj => {
        var k = obj.key;
        var v = obj.value;
        var grades = v.grades;
        cohortesHtml.push([k, v.gradesFull, v.grades, v.min, v.max, v.avg, v.median, v.quartileFirst, v.quartileThird,
            v.decileFirst, v.decileLast, v.variance, v.deviation
        ]);
    })
    // console.log(cohortesHtml);
    return cohortesHtml;
}

// for extra data
var getExtraData = function (extraTitle, extraDataHtml, button, selected) {
    var text;
    if (extraDataHtml.length > 1 && extraDataHtml[0].length === 2) { // p.innerHTML = extraDataHtml.map(arr => arr.join(" | ")).join(", ");
        text = (extraDataHtml.length - 1) + ' ' + extraTitle;
        var extraTable = createTableExtra(extraDataHtml.slice(1, extraDataHtml.length), extraDataHtml[0], "pvtTable", text, extraTitle);
    } else if (extraDataHtml.length > 1 && extraDataHtml[0].length >= 9) {
        // p.innerHTML = extraDataHtml.map(arr => arr.join(" | ")).join(", ");
        text = (extraDataHtml.length - 1) + ' ' + extraTitle + ' => ' + selected;
        var extraTable = createTableExtra(extraDataHtml.slice(1, extraDataHtml.length), extraDataHtml[0], "pvtTable", text, extraTitle);
    } else {
        p.innerHTML = "";
        html.appendChild(p);
        text = 0 + ' ' + extraTitle + ' trouvé (recherche par "Student ID")';
        prettyDefault(title, text, html, "success", text, extraTitle);
    }
}

function number_test(n) {
    return ((n - Math.floor(n)) !== 0) ? true : false;
}

function tableauFinalStandard(data, dataMappage) {
    document.getElementById('spinnerLoad-span').classList.replace("hidden", "inline");
    // IMPORTANT : BIEN CONSERVER L'ORDRE DANS "headersStandard" qui est ensuite repris dans l
    var headersStandard = [
        "Student ID", // 0
        "Email", // 1
        "Étudiant",
        "Mail d'inscription",
        "Cohorte", 
        "Classique",
        "Avancé",
        "S1 (%)", "S1 (/20)",
        "S2 (%)", "S2 (/20)",
        "S3 (%)", "S3 (/20)",
        "S4 (%)", "S4 (/20)",
        "Examen Final (%)", " Examen Final (/20)",
        "Devoir 1 (%)", "Devoir 1 (/20)",
        "Devoir 2 (%)", "Devoir 2 (/20)",
        "Devoir 3 (%)", "Devoir 3 (/20)",
        "Diagnostic de Fonctionnement Système\n01 - DFS (%)",
        "Diagnostic de Fonctionnement Système\n01 - DFS (/20)",
        "Management Créativité & Brainstorming\n02 - MCB (%)",
        "Management Créativité & Brainstorming\n02 - MCB (/20)",
        "Management d'Équipe-Projet\n03 - MEP (%)",
        "Management d'Équipe-Projet\n03 - MEP (/20)",
        "Outils Informatiques & Évaluation Financière\n04 - IEF (%)",
        "Outils Informatiques & Évaluation Financière\n04 - IEF (/20)",
        "Certification professionnelle PMI®\n05 - PMI (%)",
        "Certification professionnelle PMI®\n05 - PMI (/20)",
        "Analyse Fonctionnelle\n06 - AF (%)",
        "Analyse Fonctionnelle\n06 - AF (/20)",
        "Analyse Stratégique\n07 - AS (%)",
        "Analyse Stratégique\n07 - AS (/20)",
        "Évaluation d'Impact des Projets\n08 - EIP (%)",
        "Évaluation d'Impact des Projets\n08 - EIP (/20)",
        "Planification Avancée\n09 - PAV (%)",
        "Planification Avancée\n09 - PAV (/20)",
        "Management Visuel de Projet\n10 - MVP (%)",
        "Management Visuel de Projet\n10 - MVP (/20)",
        "Gestion de Projet Agile avec Scrum\n11 - GPAS (%)",
        "Gestion de Projet Agile avec Scrum\n11 - GPAS (/20)",
        "Méthode de Résolution de Problèmes\n12 - MRP (%)",
        "Méthode de Résolution de Problèmes\n12 - MRP (/20)",
        "Résolution Créative de Problèmes : TRIZ\n13 - TRIZ (%)",
        "Résolution Créative de Problèmes : TRIZ\n13 - TRIZ (/20)",
        "Gestion De Crise\n14 - G2C (%)",
        "Gestion De Crise\n14 - G2C (/20)",
        "Action Entrepreneuriale\n15 - PAE (%)",
        "Action Entrepreneuriale\n15 - PAE (/20)",
        "Nombre\nmodules réussis",
        "Meilleur\nmodule réussi 1",
        "Meilleur\nmodule réussi 2",
        "Causes Échec\n(PC & PA) Modules",
        "Causes Échec\n(PC ) Moyenne Quiz",
        "Causes Échec\n(PC & PA) Examen final",
        "Causes Échec\n(PA) Moyenne Quiz & Devoirs",
        "Causes Échec\n(PA) Devoirs"
    ];

    var headersSpe = [data[0].slice(17, 32)];
    var dataSpec = data.slice(1, data.length).sort(function (a, b) {
        return a[0] - b[0];
    });

    // Test pour vérifier le format décimal dans le jeu de données... à optimiser
    var patternPoint = /^[0-9]+([.][0-9]+)?%?$/;
    var patternComma = /^[0-9]+([,][0-9]+)?%?$/;
    var testComma = [].concat.apply([], dataSpec.map(function (el) {
        return el.filter(function (el) {
            return patternPoint.test(el) && number_test(el.valueOf()) && Number.isInteger(parseInt(el));
        });
    }));

    var rangeSpe = dataSpec.map((row) => row.slice(17, 32).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el)));
    var rangeClassic = dataSpec.map((row) => row.slice(7, 11).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el)));
    var examenFinal = dataSpec.map((row) => row.slice(12, 13).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el)));
    var rangeDevoirs = dataSpec.map((row) => row.slice(13, 16).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el)));

    var name, cohorte, countSpe, classic2Modules, classic3devoirs;
    // var patternSpe = /\d+\:\s{1}\[\w+\]/gi;
    var pass70 = 0.695;

    // if (testComma.length > 0) {
    for (var i = 0, lgi = dataSpec.length; i < lgi; i++) {
        // valeurs avant splice
        name = dataSpec[i][3];
        cohorte = dataSpec[i][5];

        // nombre spr réussies
        countSpe = rangeSpe[i].filter(el => el > pass70).length;

        // 2 meilleures spécialisations
        var max1 = Math.max.apply(null, rangeSpe[i]);
        var cellHeader1 = (max1 > pass70 && rangeSpe[i].indexOf(max1) !== -1) ? headersSpe[0][rangeSpe[i].indexOf(max1)] : "";
        if (rangeSpe[i].length > 1 && rangeSpe[i].indexOf(max1) !== -1)
            rangeSpe[i].splice(rangeSpe[i].indexOf(max1), 1, 0);

        var max2 = Math.max.apply(null, rangeSpe[i]);
        var cellHeader2 = (max2 > pass70 && rangeSpe[i].indexOf(max2) !== -1) ? headersSpe[0][rangeSpe[i].indexOf(max2)] : "";
        if (cellHeader2 === cellHeader1)
            cellHeader2 = "";

        cellHeader1 = regexHeadersSPE.test(cellHeader1) ? cellHeader1.match(regexHeadersSPE)[0].replace(/\s\-/, "") : cellHeader1;
        cellHeader2 = regexHeadersSPE.test(cellHeader2) ? cellHeader2.match(regexHeadersSPE)[0].replace(/\s\-/, "") : cellHeader2;

        // Ajout colonne vide pour mappage nom
        var checkEmail = dataMappage.find(item => {
            return item.id === dataSpec[i][0];
        });
        (checkEmail && checkEmail !== undefined) ? checkEmail = checkEmail.email: checkEmail = "";

        // ajout colonnes email pour mappage mail inscription
        dataSpec[i].splice(2, 1, name);
        dataSpec[i].splice(3, 1, checkEmail);
        dataSpec[i].splice(4, 1, cohorte);

        // réussite classique et avancée
        classic2Modules = ((d3.sum(rangeClassic[i]) / 4) > pass70 && examenFinal[i][0] > pass70 && countSpe >= 2) ?
            dataSpec[i].splice(5, 1, "OUI") : dataSpec[i].splice(5, 1, "NON");
        classic3devoirs = ((d3.sum(rangeClassic[i]) + d3.sum(rangeDevoirs[i])) / 7 > pass70 && examenFinal[i][0] > pass70 && countSpe >= 2) ?
            dataSpec[i].splice(6, 1, "OUI") : dataSpec[i].splice(6, 1, "NON");

        // Quiz 1 à 4 : note sur 100 (%) et note sur (/20)
        (isNaN(parseFloat(dataSpec[i][7]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][7] * 100).toFixed(2))); // 100 (%)
        (isNaN(parseFloat(dataSpec[i][7]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][7] * 100) / 5).toFixed(2))); // (/20)

        (isNaN(parseFloat(dataSpec[i][8]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][7] * 100).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][8]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][8] * 100) / 5).toFixed(2)));

        (isNaN(parseFloat(dataSpec[i][9]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][9] * 100).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][9]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][9] * 100) / 5).toFixed(2)));

        (isNaN(parseFloat(dataSpec[i][10]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][10] * 100).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][10]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][10] * 100) / 5).toFixed(2)));

        // examen final
        (isNaN(parseFloat(dataSpec[i][12]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][12] * 100).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][12]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][12] * 100) / 5).toFixed(2)));

        // devoirs de 1 à 3
        (isNaN(parseFloat(dataSpec[i][13]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][13] * 100).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][13]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][13] * 100) / 5).toFixed(2)));

        (isNaN(parseFloat(dataSpec[i][14]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][14] * 100).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][14]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][14] * 100) / 5).toFixed(2)));

        (isNaN(parseFloat(dataSpec[i][15]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][15] * 100).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][15]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][15] * 100) / 5).toFixed(2)));

        // specialisations
        (isNaN(parseFloat(dataSpec[i][17]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][17] * 100).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][17]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][17] * 100) / 5).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][18]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][18] * 100).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][18]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][18] * 100) / 5).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][19]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][19] * 100).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][19]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][19] * 100) / 5).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][20]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][20] * 100).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][20]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][20] * 100) / 5).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][21]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][21] * 100).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][21]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][21] * 100) / 5).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][22]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][22] * 100).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][22]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][22] * 100) / 5).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][23]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][23] * 100).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][23]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][23] * 100) / 5).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][24]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][24] * 100).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][24]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][24] * 100) / 5).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][25]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][25] * 100).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][25]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][25] * 100) / 5).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][26]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][26] * 100).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][26]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][26] * 100) / 5).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][27]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][27] * 100).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][27]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][27] * 100) / 5).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][28]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][28] * 100).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][28]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][28] * 100) / 5).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][29]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][29] * 100).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][29]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][29] * 100) / 5).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][30]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][30] * 100).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][30]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][30] * 100) / 5).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][31]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat(dataSpec[i][31] * 100).toFixed(2)));
        (isNaN(parseFloat(dataSpec[i][31]))) ? dataSpec[i].push(""): dataSpec[i].push(pointToComma_FR(parseFloat((dataSpec[i][31] * 100) / 5).toFixed(2)));

        // // suppression des colonnes
        dataSpec[i].splice(7, 33);

        // nombre spe réussi
        (countSpe) ? dataSpec[i].push(countSpe.toFixed(0)): dataSpec[i].push("");

        // 2 meilleures spécialisations
        dataSpec[i].push(cellHeader1);
        dataSpec[i].push(cellHeader2);

        // cause échec
        (countSpe && countSpe >= 2) ? dataSpec[i].push(""): dataSpec[i].push("< 2");
        ((d3.sum(rangeClassic[i]) / 4) > 0.695) ? dataSpec[i].push(""): dataSpec[i].push("< 70%");
        (examenFinal[i][0] > pass70) ? dataSpec[i].push(""): dataSpec[i].push("< 70%");
        ((d3.sum(rangeClassic[i]) + d3.sum(rangeDevoirs[i])) / 7 > pass70) ? dataSpec[i].push(""): dataSpec[i].push("< 70%");
        (rangeDevoirs[i].filter(el => el !== 0).length === 3) ? dataSpec[i].push(""): dataSpec[i].push("< 3");
    }
    // suppression de la 1ère lignes de titres
    data.splice(0, 1);

    var dataExport = data; //.map(row => row.map(d => pointToComma_FR(d)));
    dataExport.unshift(headersStandard);

    setTimeout(() => {
        exportCSVDefault(dataExport, "final-standard");
        document.getElementById('spinnerLoad-span').classList.replace("inline", "hidden");
    }, 100);
}