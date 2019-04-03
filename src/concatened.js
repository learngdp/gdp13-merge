// const lang = navigator.language; // "de_DE"; // "en_US"; //
// const locale = (lang && lang !== undefined) ? lang.match(/^\w{2}/)[0] : (lang === "de" || lang === "fr" || lang === "it" || lang === "nl") ? lang : "en";
console.log(lang, locale);

document.addEventListener('touchstart', function addtouchclass(e) { // first time user touches the screen
    document.documentElement.classList.add('can-touch') // add "can-touch" class to document root using classList API
    document.removeEventListener('touchstart', addtouchclass, false) // de-register touchstart event
}, false)

/********************************* */

// import 'webpack-jquery-ui/css';
import 'normalize.css';
import 'tabulator-tables/dist/css/tabulator.min.css';
import './style.css';
import 'intro.js/introjs.css';

import $ from 'jquery';

// import * as introJs from 'intro.js';
// console.log(introJs);

var Tabulator = require('tabulator-tables');

var Collection = require('lodash/collection');
var Array = require('lodash/array');
var String = require('lodash/string')

const d3 = Object.assign({},
    require("d3-format"),
    require("d3-dsv"),
    require("d3-array"),
    require("d3-scale"),
    require("d3-selection"),
    require("d3-collection"),
    require("d3-transition"),
    require("d3-scale-chromatic")
);

// import * as d3 from 'd3';
// import {
//     event as currentEvent
// } from 'd3';

import saveAs from 'file-saver';
import Papa from 'papaparse';

import 'sweetalert';

import {
    library,
    dom
} from "@fortawesome/fontawesome-svg-core";
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

library.add(fas, far)
dom.watch();

window.addEventListener('load', function () {
    document.getElementById('main_div').style.display = 'block';
})
console.log(lang, locale);
// moment.locale(locale);
var timeProcess;

var allHeaders = [];
var filesNb = 0;

fileInput.onchange = function (e) {
    timeProcess = new Date();
    document.getElementById('spinnerLoad-span').classList.replace("hidden", "inline");
    this.disabled = true;

    var files = [...fileInput.files];
    // files = files.sort((a, b) => b.size - a.size);
    files = files.sort(function (x, y) {
        x = regexFileNamesTemplate.test(x.name) ? x.name.match(regexFileNamesTemplate)[0] : x.name;
        y = regexFileNamesTemplate.test(y.name) ? y.name.match(regexFileNamesTemplate)[0] : y.name;
        return fileNamesTemplate[x] - fileNamesTemplate[y];
    });
    // var filesNames = files.map(file => file.name);
    // var testFiles = findFilesDuplicates(fileNames);
    // console.log(testFiles);
    // document.getElementById('dataTable-infos').innerHTML = menuColorHTML(files, [], 0);

    var totalSize = files.map(file => file.size).reduce((a, b) => a += b);

    let promises = [];
    for (var i = 0, lgi = files.length; i < lgi; i++) {
        promises.push(getDataFiles(files[i]));
    }
    // console.log(promises);

    Promise.all(promises)
        .then(function (data) {
            let uniqueHeaders = [...new Set([].concat(...data.map(obj => obj["headers"])))];
            setTimeout(() => {
                // console.log(data, uniqueHeaders, totalSize);
                tableForFiles(data, uniqueHeaders)
                // $('.fa-arrow-alt-circle-right').addClass('blink');
            }, 10);

        })
        .catch(function (error) {
            console.log(error);
            prettyDefaultReload("Information erreur", "Oups! " + error, "warning");
        });
    console.log("timeProcess: " + (new Date() - timeProcess) + "ms");
}

// *** voir pour mettre ici le typed js *** pour beaucoup de fichiers
function getDataFiles(file) {
    // var delimiter = document.getElementById('delimiter-input').value;
    // console.log(delimiter);
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = (event) => {
            // console.log(event);
            var textFromFileLoaded = event.target.result;
            let dataByFile = {},
                flag;
            Papa.parse(textFromFileLoaded, {
                header: true,
                dynamicTyping: true,
                // delimiter: delimiter ? delimiter[0] : "",
                skipEmptyLines: true, // 'greedy',
                chunk: function (results, parser) {
                    flag = checkHeaders(results.meta.fields, file);
                    if (flag) {
                        dataByFile[file.name] = results.data;
                        dataByFile["headers"] = results.meta.fields;
                        resolve(dataByFile);
                    } else {
                        reject("erreur entêtes de colonnes");
                    }
                },
                complete: function (results) {
                    console.log('done! ', file.name, (new Date() - timeProcess) + "ms")
                }
            });
        };
        reader.onprogress = (event) => {
            // updateIndicators(event.loaded, filesNb, 0, 0)
        };
        reader.readAsText(file, "UTF-8");
        filesNb++;
    });
    console.log("getDataFiles: " + (new Date() - timeProcess) + "ms");
}

function flatData(dataFiles, uniqueHeaders) {
    console.log("flatData: " + (new Date() - timeProcess) + "ms");
    return new Promise(function (resolve) {
        var dataSelected = [],
            flat = [];

        if (dataFiles.length > 1) {
            dataFiles.forEach(file => {
                dataSelected.push(file[Object.keys(file)[0]].map(obj => {
                    if (regexAllSPE.test(Object.keys(file)[0]))
                        obj["filename imported"] = Object.keys(file)[0].match(regexAllSPE)[0].replace(/[\d+_]/g, '').replace(/SPE\-/, "");
                    return obj;
                }));
            });
        } else {
            // console.log(Object.keys(dataFiles[0])[0]);
            dataSelected.push(dataFiles[0][Object.keys(dataFiles[0])[0]].map(obj => {
                if (regexAllSPE.test(Object.keys(dataFiles[0])[0]))
                    obj["filename imported"] = Object.keys(dataFiles[0])[0].match(regexAllSPE)[0].replace(/[\d+_]/g, '').replace(/SPE\-/, "");
                return obj;
            }));
        }

        var arrConcatened = [].concat(...dataSelected);
        // also allow to get unique headers
        var headersTemplate = {};
        uniqueHeaders.forEach((el, i) => {
            headersTemplate[el] = "";
        });
        for (var i = 0, lgi = arrConcatened.length; i < lgi; i++) {
            flat.push(Object.assign({}, headersTemplate, arrConcatened[i]));
        }

        var dataMerged = mergedDataTest(uniqueHeaders, flat).sort((a, b) => a[0] - b[0]);

        // *** traque et filtre les id vide, undefined, retour à la ligne
        var checkWrongID = function (array) {
            var headers = array[0].map(header => header.trim());
            var testCsv = [];
            array.forEach((el, i) => {
                if (i !== 0 && el[0] !== undefined && el[0] !== "" && !el[0].match(/^(\r\n|\r|\n)$/)) {
                    el[0] = el[0].trim();
                    testCsv.push(el);
                }
            })
            testCsv.unshift(headers);
            return testCsv;
        }

        dataMerged = checkWrongID(dataMerged);

        // console.log(dataMerged);

        var getDataMappage = function(result) {
            var delimiter = Papa.parse(result).meta.delimiter;
            var dataResult = d3.dsvFormat(delimiter).parseRows(result, function(d) {
                // ( d["Student ID"] != undefined && /^(\r\n|\r|\n)$/.test(d["Student ID"].toString()) )
                // console.log(d[0], /^(\r\n|\r|\n)$/.test(d[0]));
                if (d && d !== undefined && d[0].length !== 0) return d;
            }).sort((a, b) => a[0] - b[0]);
            var dataMappage = d3.csvParse(Papa.unparse(dataResult));
            // console.log(data.flat, dataMappage);
            if (dataResult !== undefined && checkProfile(dataResult)) {
                resolve({ flat: dataMerged , dataMappage: dataMappage });
                // setTimeout(() => launchDataMappage(data.flat, dataMappage), 500);
            }
        }

        document.getElementById('fileInputMappage').onchange = function(e) {
            this.disabled = true;
            // console.log(document.getElementById('profil_info-div').childNodes);
            // document.getElementById('profil_info-div').childNodes[3].classList.replace('labelProfile', 'normal');
            // $('.fa-arrow-alt-circle-right').removeClass('blink');
            document.getElementById('spinnerLoad-span').classList.replace("hidden", "inline");
            document.getElementById('profil_info-div').classList.replace("inline", "hidden");
            var file = this.files[0];
            var reader = new FileReader();
            reader.onprogress = function(event) {}
            reader.onloadend = function(event) {}
            reader.onload = function(event) {
                getDataMappage(reader.result);
            }
            reader.readAsText(file);
        }
    })
}

function tableForFiles(dataFiles, uniqueHeaders) {
    // console.log(data, uniqueHeaders);
    // *** check doublons avant de continuer
    // fin de check doublons***
    document.getElementById('grade_report-div').classList.replace("inline", "hidden");
    document.getElementById('profil_info-div').classList.replace("hidden", "inline");
    document.getElementById('spinnerLoad-span').classList.replace("inline", "hidden");

    flatData(dataFiles, uniqueHeaders)
        .then(function (data) {
            var flat = d3.csvParse(Papa.unparse(data.flat));
            var dataMappage = data.dataMappage;
            var jsonData = flat.map(function (obj, i) {
                var username;
                if (obj["Username"] && obj["Username"] !== undefined) {
                    username = (isNaN(obj["Username"])) ? obj["Username"] : (obj["Username"]).toString();
                }
                var resultName = dataMappage.find(item => item.username === username);
                var resultMail = dataMappage.find(item => item.email === obj["Email"]);
                (resultName === undefined || resultMail === undefined) ? obj["Name"] = "": obj["Name"] = resultName.name;
                var resultId = dataMappage.find(item => item.id === obj["Student ID"]);
                if (resultId === undefined) {
                    obj["Name"] = "Absent sur profile_info";
                } else {
                    // console.log(resultId.year_of_birth, resultId.gender);
                    obj["Name"] = resultId.name;
                    obj["year_of_birth"] = (resultId.year_of_birth) ? resultId.year_of_birth : "";
                    // obj["gender"] = (resultId.gender) ? resultId.gender : "";
                    // obj["level_of_education"] = (resultId.level_of_education) ? resultId.level_of_education : "";
                }
                return sortObjectKeys(obj, headersTemplate);
            });

            var flag = false;
            setTimeout(() => {
                flag = globalReport(jsonData, dataMappage); // launchTab(d3.csvParse(Papa.unparse(jsonData)));
                if (flag) {
                    console.log("tabulator launch !" + (new Date() - timeProcess) + "ms");
                }
            }, 10);
        }).catch(function (error) {
            console.log(error);
            swal({
                title: "Information error",
                text: error.toString(),
                icon: "warning"
            });
        });
}

/* HELPERS imported files */

function mergedDataTest(headers, data) {
    var selected = document.getElementById('filter-field').value;

    // headers.splice(headers.length-1, 1, "fichiers fusionnés");
    headers.push("fichiers fusionnés");

    // console.log(headers, data);

    var jsonData = d3.csvParse(Papa.unparse(data));
    // console.log(jsonData);

    // also allow to get unique headers
    var headersTemplate = {};
    headers.forEach((el, i) => {
        headersTemplate[el] = "";
    });

    var merged = [];
    var nestedData = d3.nest()
        .key(d => d["Student ID"])
        .rollup(v => {
            var arr = v.map(obj => [].concat.call([], Object.values(obj))); // v.map(obj => [].concat.apply([], Object.values(obj)));
            // voir pour remplacer les expresions nécessaires avec la ligne de dessous
            // [...new Set([].concat(...data.map(obj => obj["headers"])))]
            arr.unshift(headers);
            return {
                arr: arr
            };
        })
        .entries(jsonData);

    // console.log(nestedData);

    for (var i = 0, lgi = nestedData.length; i < lgi; i++) {
        var item = nestedData[i],
            // key = item.key,
            values = item.value.arr;
        // console.log(values);
        var obj = {};
        headers.forEach((key, i) => {
            if (key == "Grade" || key == "Enrollment Track" || key == "Enrollment Status" || key == "fichiers fusionnés") {
                obj[key] = dataByColumn(values.slice(1, values.length), i);
            } else {
                obj[key] = [...new Set(dataByColumn(values.slice(1, values.length), i))];
            }
        });
        merged.push(Object.assign({}, headersTemplate, obj));
    }

    var dataMerged = d3.csvParseRows(Papa.unparse(merged));
    // console.log(dataMerged);

    return dataMerged;
}

function dataByColumn(arr, col) {
    // console.log(arr, col);
    var column = [],
        value;
    for (var i = 0, lgi = arr.length; i < lgi; i++) {
        value = arr[i][col];
        column.push(value);
    }
    return filter_array(column); // voir avec _.compact
} 

// classe en fonction dans modèles ici headersTemplate
function sortObjectKeys(obj, keys) {
    return keys.reduce((acc, key) => {
        var index = keys.indexOf(key);
        acc[key] = obj[key];
        return acc;
    }, {});
}

function checkHeaders(headers, file) {
    var flag;
    headers.forEach(function (title, i) {
        var headersElement = headersTemplate[headersTemplate.indexOf(title.trim())];
        // console.log(title, title == title.trim(), headersElement, headersTemplate.indexOf(title.trim()));
        if (headersTemplate.indexOf(title.trim()) === -1) {
            var html = document.createElement("div");
            var p = document.createElement("p");
            title = (title && title !== (' ')) ?
                title :
                "au moins une colonne ou un entête vide";
            p.innerHTML = '<h4 Fichier concerné:<br><b>' + file.name + '</b><br><br>Entête concerné:<br><b>' + title + '</b></h4><hr>';
            p.innerHTML += '<h4 style="color:red"> <i class="fa fa-warning"></i><br>entêtes en cours au ' + new Date().toLocaleDateString() + '</h4><br><br>';
            p.innerHTML += JSON.stringify(headersTemplate.map(header => "[" + header + "]").join(", "));
            html.appendChild(p);
            prettyDefaultControl("Contrôle entête de colonnes", "Oups! Apparemment, un entête de colonne n'est pas conforme au modèle attendu... ",
                html, "warning");
            flag = false;
        } else {
            flag = true;
        }
    });
    return flag;
}

function checkProfile(data) {
    console.time("import");
    var flag = true;
    data[0].slice(0, 4).forEach(el => {
        if (headersProfile.indexOf(el) === -1) flag = false;
    });
    if (!flag)
        swal({
            title: "Fichier profile_info",
            text: "Un des champs en entête des 4 premières colonnes ne correspond pas au champs attendus dans l'ordre suivant:\n[id] [username] [name] [email]",
            icon: "warning"
        }).then(value => {
            document.getElementById('profil_info-div').firstElementChild.classList.replace('normal', 'labelProfile');
            $('.fa-arrow-alt-circle-right').addClass('blink');
            document.getElementById('spinnerLoad-span').classList.replace("inline", "hidden");
            document.getElementById('fileInputMappage').disabled = false;
        });
    return flag;
}

function findFilesDuplicates(fileNames) {
    return new Promise(function (resolve, reject) {
        var gradesImported = [];
        filesNames.map(name => {
            if (name.match(regexAll)) return name.match(regexAll);
        }).forEach(reg => {
            if (reg !== undefined) gradesImported.push(reg[1]);
        });
        var duplicates = find_duplicate_in_array(gradesImported);
        console.log(duplicates);
        var html = document.createElement("div"),
            p = document.createElement("p");
        p.innerHTML = duplicates.join();
        html.appendChild(p);
        if (duplicates.length > 0) {
            prettyDefault(
                "Information fichiers importés",
                "Oups ! Apparemment 1 ou plusieurs fichiers importés sont en doublons.\nVeuillez rafraichir la page de votre navigateur... ",
                html, "warning");
            document.getElementById('fileInputMappage').disabled = true;
            resolve(false);
        } else {
            resolve(true);
        }
    })
}
/* IMPORTANT: la position des titres dans le tableau (headers) est à respecter car repris dans les sorties analytics et standard */
/* par contre... aucune incidence sur l'emplacement des colonnes des fichiers csv import en entrée (en principe;) */
// MERGE
const ref_ID = "Student ID";
const headersProfile = ["id", "username", "name", "email"];

const headersTemplate = [
    ref_ID, //0
    "Email",
    "year_of_birth",
    "Name",
    "Username",
    "Cohort Name",
    "Grade",
    "Évaluation Hebdo 1: Évaluation (notée)", // 7
    "Évaluation Hebdo 2: Évaluation (notée)",
    "Évaluation Hebdo 3: Évaluation (notée)",
    "Évaluation Hebdo 4: Évaluation (notée)", // 10
    "Évaluation Hebdo (Avg)", // 11
    "Examen Final", // 12
    "Livrables 1: Carte Conceptuelle - (Semaine 1)", // 13
    "Livrables 2: Compte-rendu - (Semaine 2)", // 14
    "Livrables 3: Planification - (Semaine 3)", // 15
    "Livrables (Avg)", // 16
    "DFS - Diagnostic de Fonctionnement d'un Système", // 17 - SPE 1
    "MCB - Management de la Créativité et Brainstorming", // 18 - SPE 2
    "MEP - Management d'Équipe Projet", // 19 - SPE 3
    "IEF - Les outils informatiques & Évaluer financièrement les projets", // 20 - SPE 4
    "PMI - Certifications professionnelles PMI®", // 21 - SPE 5
    "AF - Analyse Fonctionnelle", // 22 - SPE 6
    "AS - Analyse Stratégique dans les Projets", // 23 - SPE 7
    "EIP - Évaluation d'Impact des Projets", // 24 - SPE 8
    "PAV - Planification Avancée", // 25 - SPE 9
    "MVP - Management Visuel de Projet", // 26 - SPE 10
    "GPAS - Gestion de projet agile avec Scrum", // 27 - SPE 11
    "MRP - Outils et Méthodologie de Résolution de Problème", // 28 - SPE 12
    "TRIZ - Introduction aux principaux outils de TRIZ", // 29 -SPE 13
    "G2C - Gestion de crise", // 30 - SPE 14
    "PAE - Du Projet à l'Action Entrepreneuriale", // 31 - SPE 15
    "Pre MOOC", // 32
    // "Cohort Name",
    "Enrollment Track", // 33
    "Verification Status",
    "Certificate Eligible",
    "Certificate Delivered",
    "Certificate Type",
    "Enrollment Status",
    "fichiers fusionnés"// 39
];

const cohortesOptions = [
    "Grade",
    "Évaluation Hebdo 1: Évaluation (notée)", // 5
    "Évaluation Hebdo 2: Évaluation (notée)",
    "Évaluation Hebdo 3: Évaluation (notée)",
    "Évaluation Hebdo 4: Évaluation (notée)", // 8
    "Évaluation Hebdo (Avg)", // 9
    "Examen Final", // 10
    "Livrables 1: Carte Conceptuelle - (Semaine 1)", // 11
    "Livrables 2: Compte-rendu - (Semaine 2)", // 12
    "Livrables 3: Planification - (Semaine 3)", // 13
    "Livrables (Avg)", // 14
    "DFS - Diagnostic de Fonctionnement d'un Système", // SPE 1
    "MCB - Management de la Créativité et Brainstorming", // SPE 2
    "MEP - Management d'Équipe Projet", // SPE 3
    "IEF - Les outils informatiques & Évaluer financièrement les projets", // SPE 4
    "PMI - Certifications professionnelles PMI®", // SPE 5
    "AF - Analyse Fonctionnelle", // SPE 6
    "AS - Analyse Stratégique dans les Projets", // SPE 7
    "EIP - Évaluation d'Impact des Projets", // SPE 8
    "PAV - Planification Avancée", // SPE 9
    "MVP - Management Visuel de Projet", // SPE 10
    "GPAS - Gestion de projet agile avec Scrum", // SPE 11
    "MRP - Outils et Méthodologie de Résolution de Problème", // old "MRP - Méthode de Résolution de Problèmes", // SPE 12
    "TRIZ - Introduction aux principaux outils de TRIZ", // SPE 13
    "G2C - Gestion de crise", // SPE 14
    "PAE - Du Projet à l'Action Entrepreneuriale", // SPE 15
    "Pre MOOC", // 30
];

const objTemplate = {};
headersTemplate.forEach((el) => {
    objTemplate[el] = "";
});

const headersByCategories = {
    required: [
        ref_ID,
        "Email",
        "Username",
        "Grade",
        "Cohort Name",
        "Enrollment Track",
        "Verification Status",
        "year_of_birth",
        "gender",
        "level_of_education",
        "Certificate Eligible",
        "Certificate Delivered",
        "Certificate Type",
        "Enrollment Status"
    ],
    tc: [
        "Pre MOOC",
        "Évaluation Hebdo 1: Évaluation (notée)",
        "Évaluation Hebdo 2: Évaluation (notée)",
        "Évaluation Hebdo 3: Évaluation (notée)",
        "Évaluation Hebdo 4: Évaluation (notée)",
        "Évaluation Hebdo (Avg)",
        "Examen Final"
    ],
    livrables: [
        "Livrables 1: Carte Conceptuelle - (Semaine 1)",
        "Livrables 2: Compte-rendu - (Semaine 2)",
        "Livrables 3: Planification - (Semaine 3)",
        "Livrables (Avg)"
    ],
    spe: [
        "DFS - Diagnostic de Fonctionnement d'un Système", // 1
        "MCB - Management de la Créativité et Brainstorming", // 2
        "MEP - Management d'Équipe Projet", // 3
        "IEF - Les outils informatiques & Évaluer financièrement les projets", // 4
        "PMI - Certifications professionnelles PMI®", // 5
        "AF - Analyse Fonctionnelle", // 6
        "AS - Analyse Stratégique dans les Projets", // 7
        "EIP - Évaluation d'Impact des Projets", // 8
        "PAV - Planification Avancée", // 9
        "MVP - Management Visuel de Projet", // 10
        "GPAS - Gestion de projet agile avec Scrum", // 11
        "MRP - Outils et Méthodologie de Résolution de Problème", // 12
        "TRIZ - Introduction aux principaux outils de TRIZ", // 13
        "G2C - Gestion de crise", // 15
        "PAE - Du Projet à l'Action Entrepreneuriale" // 15
    ]
};

const fileNamesTemplate = {
    "-TC_": 1,
    "_SPE-DFS_": 2,
    "_SPE-MCB_": 3,
    "_SPE-MEP_": 4,
    "_SPE-IEF_": 5,
    "_SPE-PMI_": 6,
    "_SPE-AF_": 7,
    "_SPE-AS_": 8,
    "_SPE-EIP_": 9,
    "_SPE-PAV_": 10,
    "_SPE-MVP_": 11,
    "_SPE-GPAS_": 12,
    "_SPE-MRP_": 13,
    "_SPE-TRIZ_": 14,
    "_SPE-G2C_": 15,
    "_SPE-PAE_": 16,
    "-PA_": 17,
};

// const patternMail =
//     /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// const regexTC = /_TC_\d{2}_/;
// const regexPA = /_PA_\d{2}_/
// const regexSPE = /_SPE-\w{2,4}_/;

// const regexAllSPE = /_(SPE-\w{2,4}|PA_\d{2}|TC_\d{2})_/;

// const regexFileNamesTemplate = /_(SPE-\w{2,4}|PA|TC)_/;

// // pattern for short name column
// const regexHeadersSPE = /\b[A-Z0-9]{2,4}\b\s\-/;
// const regexEvalHebdo = /^Évaluation Hebdo [1|2|3|4]\:/;
// const regexLivrable = /^Livrables [1|2|3]\:/;

const patternMail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const regexTC = /TC_\d{2}_/;
const regexPA = /PA_\d{2}_/
const regexSPE = /SPE-\w{2,4}_/;

const regexAllSPE = /(SPE-\w{2,4}|PA_\d{2}|TC_\d{2})_/;

const regexFileNamesTemplate = /(_SPE-\w{2,4}|\-PA|\-TC)_/;

// pattern for short name column
const regexHeadersSPE = /\b[A-Z0-9]{2,4}\b\s\-/;
const regexEvalHebdo = /^Évaluation Hebdo [1|2|3|4]\:/;
const regexLivrable = /^Livrables [1|2|3]\:/;


const format2dec = d3.format(".2f");
const formatPercent = d3.format(".0%");

/* tabulator */
// créer un nouveau format pour les colonnes
Tabulator.prototype.extendModule("format", "formatters", {
    numberfmt: function (cell, formatterParams) {
        var cellFormatted;
        if ((/\,/g).test(cell.getValue())) {
            cellFormatted = cell.getValue().split(",").map(val => isNaN(parseFloat(val)) ? "" : formatPercent(parseFloat(val))).join(", ");
        } else {
            cellFormatted = isNaN(parseFloat(cell.getValue())) ? cell.getValue() : formatPercent(parseFloat(cell.getValue()))
        }
        return cellFormatted;
    },
});

// options for table
function tableOptions(data, columns) {
    var footerContent = '<div class="footerInfo"> ';
    footerContent += '<a type="button" href="https://github.com/olifolkerd/tabulator" target="_blank" style="margin-right: 3em; padding: 2px 5px; font-weight: 900">Tabulator</a>'
    footerContent += 'lignes: <span id="rowsTotal" style="font-weight: 900">' + data.length + '</span>';
    footerContent += '<span style="margin-left: 1em">colonnes: </span><span id="columnsTotal" style="font-weight: 900">' + columns.length + '</span>';
    footerContent += '<div style="margin-left: 4em;" class="inline">';
    footerContent += '<span>lignes: </span><span id="rowsCount" style="font-weight: 900"></span> (filtrée.s)';
    footerContent += '<span style="margin-left: 2em">sélection: </span><span id="rowSelected" style="font-weight: 900"></span> (ligne.s)';
    footerContent += '<span style="margin-left: 2em">total absence.s: </span><span id="absences" style="font-weight: 900; color:red"></span>';
    footerContent += '</div><div style="margin-left: 4em;" class="inline">';
    footerContent += '<span style="margin-left: 2em">groupe.s: </span><span id="groupsNumber" style="font-weight: 900"></span>'
    footerContent += '</div></div>';
    return {
        selectable: true,
        height: Math.round(window.innerHeight)-50,
        data: data,
        reactiveData: true,
        tooltipsHeader: true,
        columns: columns,
        pagination: "local",
        paginationSize: 50,
        movableColumns: true,
        headerFilterPlaceholder: "...",
        footerElement: footerContent,
        history: true,
        tooltips: true,
        initialSort: [{
            column: "Student ID",
            dir: "asc"
        }, ],
        rowClick: function (e, row) {},
        rowSelectionChanged: function (data, rows) {
            document.getElementById('rowSelected').innerHTML = data.length;
        },
        dataFiltered: function (filters, rows) {
            document.getElementById('rowsCount').innerHTML = rows.length;
        },
        groupStartOpen: function (value, count, data, group) {
            return false;
        },
        groupHeader: function (value, count, data, group) {
            var groupByHeader = document.getElementById('groupBy-input').value;
            var groupTitle;
            var subGroups = group.getSubGroups();
            if (subGroups.length == 0) {
                groupTitle = "<span style='color:#0000FFFF; margin-right: 5px;' title='clic droit pour export'>" + groupByHeader + "</span> : " + value +
                    "<span style='color:#d00; margin-left:10px;'>(" + count + " item)</span>";
            } else {
                groupTitle = "<span style='color:#0000FFFF; margin-right: 5px;'>" + groupByHeader + "</span> : " + value +
                    "<span style='color:#d00; margin-left:10px;'>(" + count + " item)</span>";
            }
            return groupTitle;
        },
        groupContext: function (e, group) {
            e.preventDefault();
            var inputGroup = document.getElementById('groupBy-input').value;
            inputGroup = inputGroup.split('>').map(el => el.trim());
            var rowsData = [];
            var subGroups = group.getSubGroups();
            var groupElement = group.getElement();
            if (subGroups.length == 0) {
                var rows = group.getRows().forEach(row => {
                    rowsData.push(row.getData());
                });
                var parentGroup = inputGroup;
                var key = group.getKey();
                rowsData = d3.csvParseRows(Papa.unparse(rowsData));
                exportCSVDefault(rowsData, inputGroup.join('_') + "_" + key);
            } else {
                groupElement.classList.add("shaker");
                setTimeout(() => {
                    groupElement.classList.remove("shaker");
                }, 400);
            }
        }
    }
}

function setDataColumns(headersColumns) {
    var columns = [],
        name;
    headersColumns.forEach((column, i) => {
        name = columnName(column);
        if (column == headersColumns[0]) {
            columns.push({
                id: i,
                title: name,
                field: column,
                frozen: true,
                headerFilter: "input",
                cellContext: function (e, cell) {
                    var rowData = Object.entries(cell.getRow().getData());
                    // console.log(["entête", "valeur"], rowData, "pvtTable");
                    createTable(["entête", "valeur"], rowData, "pvtTable");
                    e.preventDefault();
                },
                headerContext: function (e, column) {
                    e.preventDefault();
                    groupByField(column.getField());
                }
            });
        } else if (column == headersColumns[1]) {
            columns.push({
                id: i,
                title: name,
                field: column,
                frozen: true,
                width: 150,
                headerFilter: "input",
                headerContext: function (e, column) {
                    e.preventDefault();
                    groupByField(column.getField());
                }
            }); //, formatter: "link", formatterParams: { urlPrefix: "mailto:" } });
        } else if (column == headersColumns[2]) {
            columns.push({
                id: i,
                title: name,
                field: column,
                visible: false,
                headerFilter: "input",
                headerContext: function (e, column) {
                    e.preventDefault();
                    groupByField(column.getField());
                }
            });
        } else if (column == headersColumns[3] || column == headersColumns[4]) {
            columns.push({
                id: i,
                title: name,
                field: column,
                width: 150,
                headerFilter: "input",
                headerContext: function (e, column) {
                    e.preventDefault();
                    groupByField(column.getField());
                }
            }); //, formatter: "link", formatterParams: { urlPrefix: "mailto:" } });
        } else if (i > 12 && i < 18) {
            columns.push({
                id: i,
                title: name,
                field: column,
                formatter: "numberfmt",
                visible: false,
                headerFilter: "input",
                headerContext: function (e, column) {
                    e.preventDefault();
                    groupByField(column.getField());
                }
            });
        } else if (i == 9 || i == 18 || i === 8) {
            columns.push({
                id: i,
                title: name,
                field: column,
                formatter: "numberfmt",
                headerFilter: "input",
                headerContext: function (e, column) {
                    e.preventDefault();
                    groupByField(column.getField());
                }
            });
        } else if (i > 18 && i < 39) {
            columns.push({
                id: i,
                title: name,
                field: column,
                formatter: "numberfmt",
                visible: false,
                headerFilter: "input",
                headerContext: function (e, column) {
                    e.preventDefault();
                    groupByField(column.getField());
                }
            });
        } else if (i > 39 && i < 44) {
            columns.push({
                id: i,
                title: name,
                field: column,
                visible: false,
                headerFilter: "input",
                headerContext: function (e, column) {
                    e.preventDefault();
                    groupByField(column.getField());
                }
            });
        } else {
            columns.push({
                id: i,
                title: name,
                field: column,
                headerFilter: "input",
                headerContext: function (e, column) {
                    e.preventDefault();
                    groupByField(column.getField());
                }
            });
        }
    })
    return columns;
}

function groupByField(field) {
    var fieldValues = (document.getElementById('groupBy-input').value) ? (document.getElementById('groupBy-input').value + ' > ' + field) : field;
    document.getElementById('groupBy-input').value = fieldValues.replace(/^[\s\>]/, "");
}

function replaceDataAfterLoaded(table, data, diff, timer) {
    if (diff > 1000) {
        setTimeout(() => {
            table.replaceData(data)
                .then(function() {
                    document.getElementById('rowsTotal').innerHTML = data.length;
                    console.log('replaceData done!');
                    console.log("replaceData " + (new Date() - timeProcess) + "ms");
                    document.getElementById('spinnerLoad-span').classList.replace("inline", "hidden");
                    document.getElementById('guide-btn').classList.remove('hidden');
                })
                .catch(function(error) {
                    console.log(error);
                });
        }, timer);
    } else {
        console.log("replaceData " + (new Date() - timeProcess) + "ms");
        document.getElementById('spinnerLoad-span').classList.replace("inline", "hidden");
        document.getElementById('guide-btn').classList.remove('hidden');
    }
}

/* HELPERS */
function columnName(name) {
    regexEvalHebdo
    if (regexHeadersSPE.test(name)) {
        return name.match(regexHeadersSPE)[0].replace(/\s\-/, "");
    } else if (regexEvalHebdo.test(name)) {
        return name.match(regexEvalHebdo)[0].replace(/\:/, "");
    } else if (regexLivrable.test(name)) {
        return name.match(regexLivrable)[0].replace(/\:/, "");
    } else {
        return name;
    }
}

function fillOptionsSelect(columns) {
    columns.forEach(option => {
        $('#filter-field').append('<option value="' + option + '" style="max-width:100px;">' + columnName(option) + '</option>');
    });

    ["like", "=", "<", "<=", ">", ">=", "!="].forEach(option => {
        $('#filter-type').append('<option value="' + option + '" style="max-width:100px;">' + option + '</option>');
    });
}

function replaceNotAttempted(data) {
    var pattern = /Not Attempted|Not Available/g;
    data.forEach(obj => {
        for (var key in obj) {
            if (pattern.test(obj[key]))
                obj[key] = obj[key].replace(pattern, '');
        }
    })
}

function commaToPoint(row) {
    var regexTags = /(<([^>]+)>)/ig;
    var patternComma = /^[0-9]+([,][0-9]+)?%?$/;
    var patternPoint = /^[0-9]+([.][0-9]+)?%?$/;
    var newRow = [];
    for (var j = 0, lgj = row.length; j < lgj; j++) {
        if (isNaN(Number(row[j])) && patternComma.test(row[j]) && !patternPoint.test(row[j])) {
            row[j] = parseFloat(row[j].replace(/\,/, ".")).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        } else if (row[j] === "0" || row[j] === " ") {
            row[j] = "";
        } else if (row[j] === "Not Attempted" || row[j] === "Not Available") {
            row[j] = "";
        } else {
            row[j] = row[j].replace(regexTags, "");
        }
        newRow.push(row[j]);
    }
    return newRow;
}

function pointToComma_FR(d) {
    return (isNaN(parseFloat(d))) ? d : parseFloat(d).toLocaleString("fr-FR");
}

function filter_array(test_array) {
    var index = -1,
        arr_length = test_array ? test_array.length : 0,
        resIndex = -1,
        result = [];
    while (++index < arr_length) {
        var value = test_array[index];

        if (value) {
            result[++resIndex] = value;
        }
    }
    return result;
}

// export du fichier csv avec fileSaver.js
function exportCSVDefault(data, filename) {
    var dataPointToCSV = Papa.unparse(data);
    var BOM = "\uFEFF";
    var csvDataPoint = BOM + dataPointToCSV;
    var blob = new Blob([csvDataPoint], {
        type: "text/csv;charset=utf-8"
    });
    saveAs(blob, filename + ".csv");
}

/* SWEET ALERT and CREATE TABLE */

function prettyDefault(title, text, html, icon, className) {
    swal({
        title: title,
        text: text,
        content: html,
        icon: icon,
        className: className
    }).then(value => {
        // console.log(value);
    });
}

function prettyDefaultReload(title, text, icon) {
    swal({
        title: title,
        text: text,
        icon: icon
    }).then(value => {
        setTimeout(() => window.location.href = window.location.href, 10);
    });
}

function prettyDefaultControl(title, text, html, icon) {
    swal({
        title: title,
        text: text,
        content: html,
        icon: icon,
        className: "sweetalert-lg"
    }).then(value => {
        setTimeout(() => window.location.href = window.location.href, 10);
    });
}

// création simple de table html pour sweetALert pvtTable
function createTable(headers, data, className) {
    var html = document.createElement("div"),
        p = document.createElement("p"),
        title = "Info participant",
        text = "";
    var table = '<table class="' + className + ' tableForSweet" style="margin:5px auto">';
    table += '<thead><tr>';
    headers.forEach(header => {
        table += '<th>' + header + '</th>';
    });
    table += '</tr></thead>';
    table += '<tbody>';
    data.forEach(row => {
        table += '<tr>';
        table += '<td>' + row[0] + '</td>';
        table += '<td>' + row[1] + '</td>';
        table += '</tr>';
    });
    table += '</tbody></table>';

    html.appendChild($.parseHTML(table)[0]);
    swal({
            title: title,
            text: text,
            content: html,
            className: "sweetalert-auto",
            buttons: {
                export: "export CSV",
                annuler: true,
            },
        })
        .then((value) => {
            switch (value) {
                case "export":
                    data.unshift(headers)
                    exportCSVDefault(data, "participant_info")
                    break;

                default:
                    break;
            }
        });
    // prettyDefault(title, text, html, "sweetalert-auto");
    return true;
}

// création simple de table html pour sweetALert pvtTable
function createTableExtra(data, headers, className, extraTitle) {
    // console.log(data, headers);
    var html = document.createElement("div"),
    p = document.createElement("p"),
    title = extraTitle,
    text,
    dataExport;

    var table = '<table class="' + className + ' tableForSweet" style="margin:5px auto">';
    table += '<thead><tr>';
    headers.forEach(header => {
        // console.log(header);
        table += '<th>' + header + '</th>';
    });
    table += '</tr></thead>';
    table += '<tbody>';
    data.forEach(row => {
        // console.log(row.length);
        table += '<tr>';
        row.forEach(cell => {
            table += '<td>' + cell + '</td>';
        })
        table += '</tr>';
    });
    table += '</tbody></table>';
    // console.log($.parseHTML(extraTable)[0])
    html.appendChild($.parseHTML(table)[0]);

    swal({
            title: title,
            text: text,
            content: html,
            className: "sweetalert-auto",
            buttons: {
                export: "export CSV",
                annuler: true,
            },
        })
        .then((value) => {
            switch (value) {
                case "export":
                    dataExport = data.map(row => row.map(d => pointToComma_FR(d)));
                    dataExport.unshift(headers)
                    exportCSVDefault(dataExport, title)
                    break;

                default:
                    break;
            }
        });

    // prettyDefault(title, text, html, "", "sweetalert-auto");
    return true;
}
function globalReport(jsonData, dataMappage) {
    var dataFromCSV = d3.csvParseRows(Papa.unparse(jsonData));

    var data = dataFromCSV.map(row => commaToPoint(row));

    // *** COHORTES
    var select = $('#selectCohortes-btn');
    // suppression des options existantes
    select.find('option').remove();
    // implémentation liste options complète
    for (var i = 0, lgi = cohortesOptions.length; i < lgi; i++) {
        select.append('<option value="' + cohortesOptions[i] + '">' + cohortesOptions[i] + '</option>')
    }
    var cohortes = [...new Set(data.map(el => el[5]))];
    var cohortTitle = cohortes[0];

    cohortes = cohortes.slice(1, cohortes.length);

    var buttonCohortes = document.getElementById('cohortes-btn');
    buttonCohortes.innerHTML = cohortes.length + ' cohortes <i class="fas fa-download"></i>';
    // ***

    var headersSpe = [data[0].slice(17, 32)];
    var rangeSpe = data.slice(1, data.length).map((row) => row.slice(17, 32).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el)));
    data[0].splice(6, 0, 'Attestation PC');
    data[0].splice(7, 0, 'Attestation PA');
    data[0].splice(8, 0, 'Grade TC');
    data[0].splice(10, 0, '1ère SPE');
    data[0].splice(11, 0, '2ème SPE');
    data[0].splice(12, 0, 'SPE validées');

    var pass70 = 0.695,
        absences = 0,
        row, countSpe;

    for (var i = 0, lgi = data.slice(1, data.length).length; i < lgi; i++) {
        row = data.slice(1, data.length)[i];

        var cohortName = row[5];
        var grades = row[6] != undefined ? row[6].split(',') : "";
        var livrableAvg = row[16];
        var enrollmentTrack = row[33] != undefined ? row[33].split(',') : "";
        var fusionnes = row[39] != undefined ? row[39].split(',') : "";

        var verifieldTuples = {};
        enrollmentTrack.forEach((track, i) => {
            verifieldTuples[fusionnes[i]] = track;
        });

        if (row[3] === "Absent sur profile_info")
            absences++;

        countSpe = rangeSpe[i].filter(el => el > pass70).length;

        // 2 meilleures spécialisations
        var max1 = Math.max.apply(null, rangeSpe[i]);
        var cellHeader1 = (max1 > pass70 && rangeSpe[i].indexOf(max1) !== -1) ? headersSpe[0][
            rangeSpe[i].indexOf(max1)
        ] : "";
        if (rangeSpe[i].length > 1 && rangeSpe[i].indexOf(max1) !== -1) rangeSpe[i].splice(
            rangeSpe[i].indexOf(max1), 1, 0);

        var max2 = Math.max.apply(null, rangeSpe[i]);
        var cellHeader2 = (max2 > pass70 && rangeSpe[i].indexOf(max2) !== -1) ? headersSpe[0][
            rangeSpe[i].indexOf(max2)
        ] : "";
        if (cellHeader2 === cellHeader1)
            cellHeader2 = "";

        cellHeader1 = regexHeadersSPE.test(cellHeader1) ? cellHeader1.match(regexHeadersSPE)[0].replace(/\s\-/, "") : cellHeader1;
        cellHeader2 = regexHeadersSPE.test(cellHeader2) ? cellHeader2.match(regexHeadersSPE)[0].replace(/\s\-/, "") : cellHeader2;

        var attestationPC,
            attestationPA;

        var PC_oui = (grades != "" && +grades[0] >= 0.7 && countSpe >= 2);
        var PA_oui = (grades != "" && +grades[0] >= 0.7 && countSpe >= 2 && livrableAvg >= 0.7);

        var enrollment_oui = (verifieldTuples["TC"] == "verified" && verifieldTuples[cellHeader1] == "verified" && verifieldTuples[cellHeader2] == "verified");
        var enrollment_non = (verifieldTuples["TC"] != "verified" || verifieldTuples[cellHeader1] != "verified" || verifieldTuples[cellHeader2] != "verified");

        // validation attestation PC
        (PC_oui && enrollment_oui) ? attestationPC = "OUI": (PC_oui && cohortName != "") ? attestationPC = "OUI" : (PC_oui && enrollment_non) ? attestationPC = "en attente" : attestationPC = "NON";

        // validation attestion PA
        (PA_oui && enrollment_oui) ? attestationPA = "OUI" : (PA_oui && cohortName != "") ? attestationPA = "OUI" : (PA_oui && enrollment_non) ? attestationPA = "en attente" : attestationPA = "NON";

        // Attestation PC
        row.splice(6, 0, attestationPC);

        // Attestation PA
        row.splice(7, 0, attestationPA);

        row.splice(8, 0, grades[0]);

        row.splice(10, 0, cellHeader1);
        row.splice(11, 0, cellHeader2);
        row.splice(12, 0, countSpe);
    }
    setTimeout(() => {
        launchTab(d3.csvParse(Papa.unparse(data)), absences); // dataToTable(data, cohortes, cohortTitle);
    }, 100);

    document.getElementById('finalStandard-btn').onclick = function(e) {
        // console.log(e);
        tableauFinalStandard(dataFromCSV, dataMappage);
    }

    // *** EXTRA COHORTES
    buttonCohortes.onclick = function(e) {
        var selected = document.getElementById('selectCohortes-btn').value;
        var cohortesHtml = getDetailsCohortes(d3.csvParse(Papa.unparse(data)), selected, cohortTitle);
        console.log(cohortesHtml);
        setTimeout(() => {
            getExtraData("cohortes (détails)", cohortesHtml, this, selected);
        }, 100);
    }

    // ***

    console.log("globalReport end " + (new Date() - timeProcess) + "ms");
    return true;
}

function launchTab(jsonFromCSV, absences) {
    console.log("start " + (new Date() - timeProcess) + "ms");
    // console.log(jsonFromCSV);

    var data = jsonFromCSV.length > 1000 ? jsonFromCSV.slice(0, 1000) : jsonFromCSV.slice(0, jsonFromCSV.length);
    var diff = jsonFromCSV.slice(0, jsonFromCSV.length).length - data.length;

    // *** voir pour raccourcir les titres des SPE surtout
    var headers = jsonFromCSV.columns; //.map(header => regexAllSPE.test(header) ? header.match(regexAllSPE)[0].replace(/\_/g, '') : header);
    // console.log(headers);

    // fill select element after load
    fillOptionsSelect(headers);

    // set columns with formatters and others options
    var columns = setDataColumns(headers);

    var headersHidden = columns.filter(column => column.visible != undefined && !column.visible).map(column => column.field);

    //create Tabulator on DOM element with id "table-app"
    var table = new Tabulator("#table-app", tableOptions(data, columns));
    // table.setLocale("fr"); // *** à revoir ***

    // just for dev
    console.log("tabulator " + (new Date() - timeProcess) + "ms");

    // for large data
    replaceDataAfterLoaded(table, jsonFromCSV, diff, 1000);

    // interaction

    //Trigger setFilter function with correct parameters
    function updateFilter() {
        var filter = $("#filter-field").val(); //$("#filter-field").val() == "function" ? customFilter : $("#filter-field").val();
        if ($("#filter-field").val() == "function") {
            $("#filter-type").prop("disabled", true);
            $("#filter-value").prop("disabled", true);
        } else {
            $("#filter-type").prop("disabled", false);
            $("#filter-value").prop("disabled", false);
        }
        table.setFilter(filter, $("#filter-type").val(), $("#filter-value").val());
    }
    //Update filters on value change
    $("#filter-field, #filter-type").change(updateFilter);
    $("#filter-value").keyup(updateFilter);
    //Clear filters on "Clear Filters" button click
    $("#filter-clear").click(function () {
        $("#filter-field").val("Student ID");
        $("#filter-type").val("like");
        $("#filter-value").val("");

        table.clearFilter();
    });

    document.getElementById('groupBy-btn').onclick = function (e) {
        var groupValues = document.getElementById('groupBy-input').value;
        var fields = [];
        if (groupValues) {
            var fields = Array.compact(groupValues.split(/[\;\,\>]+/));
            // console.log(fields, headers.indexOf(fields.join('')));
            fields = fields.map(header => String.trim(header)).filter(header => headers.indexOf(header) != -1);
            if (fields.length > 0) {
                table.setGroupBy(fields);
                this.innerHTML = '<i class="fas fa-lock"></i>'
            }
        }
    }

    document.getElementById('groupBy-btn').onmouseover = function (e) {
        var title = document.getElementById('groupBy-input').value ? "grouper par: " + document.getElementById('groupBy-input').value :
            "grouper par entête"
        e.target.title = title;
    };

    document.getElementById('degroupBy-btn').onclick = function (e) {
        document.getElementById('groupBy-input').value = "";
        table.setGroupBy("");
        document.getElementById('groupBy-btn').innerHTML = '<i class="fas fa-lock-open"></i>'
        document.getElementById('groupBy-btn').title = "grouper par entête"
    }

    document.getElementById('hide-col').onclick = function () {
        let columnName = document.getElementById('filter-field').value;
        table.hideColumn(columnName);
    }

    document.getElementById('show-col').onclick = function () {
        let columnName = document.getElementById('filter-field').value;
        table.showColumn(columnName);
    }

    document.getElementById('showAll-coll').onclick = function () {
        document.getElementById('spinnerLoad-span').classList.replace("hidden", "inline");
        setTimeout(() => {
            headers.forEach(header => {
                table.showColumn(header);
            });
            document.getElementById('spinnerLoad-span').classList.replace("inline", "hidden");
        }, 10)
    }

    document.getElementById('hideAll-coll').onclick = function() {
        document.getElementById('spinnerLoad-span').classList.replace("hidden", "inline");
        setTimeout(() => {
            headersHidden.forEach(header => {
                table.hideColumn(header);
            });
            document.getElementById('spinnerLoad-span').classList.replace("inline", "hidden");
        }, 10)
    }

    $("#deselectAll-rows").click(function () {
        table.deselectRow();
    });

    document.getElementById('exportCSV-btn').onclick = function (e) {
        table.download("csv", "export-grades.csv", {delimiter:","});
        // document.getElementById('spinnerLoad-span').classList.replace("hidden", "inline");
        // console.time("export");
        // setTimeout(() => {
        //     // console.log(merged);
        //     exportCSVDefault(dataFiltered(), "global_report");
        //     document.getElementById('spinnerLoad-span').classList.replace("inline", "hidden");
        //     console.timeEnd("export");
        // }, 100);
    }

    var dataFiltered = function () {
        var filteredData = table.getData(true);
        var selectedData = table.getSelectedData();
        var filterSelectedData = filteredData.filter(value => -1 !== selectedData.indexOf(value))
        console.log(table.getData());

        var columnsVisible = columns.map(column => column.field);
        // console.log(columnsVisible);
        // solution https://stackoverflow.com/questions/38750705/filter-object-properties-by-key-in-es6
        var dataFiltered = filteredData.map(item => {
            return Object.keys(item)
                .filter(key => columnsVisible.includes(key))
                .reduce((obj, key) => {
                    obj[key] = item[key];
                    return obj;
                }, {})
        });
        var dataExport = d3.csvParseRows(Papa.unparse(dataFiltered));
        // dataExport = dataExport.map(el => el.slice(0, el.length-1)); // initialement pour enliver l'id par row
        return dataExport;
    };

    setTimeout(() => {
        if (absences > 0)
            document.getElementById('absences').innerHTML = absences;
    }, 10);
    return true;
} // FIN DE LAUNCHtAB
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
