console.log(lang, locale);
// moment.locale(locale);
var timeProcess;

var allHeaders = [];
var filesNb = 0;

fileInput.onchange = function(e) {
    timeProcess = new Date();
    document.getElementById('spinnerLoad-span').classList.replace("hidden", "inline");
    this.disabled = true;

    var files = [...fileInput.files];
    // files = files.sort((a, b) => b.size - a.size);
    files = files.sort( function(x, y) {
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
        .then(function(data) {
            let uniqueHeaders = [...new Set([].concat(...data.map(obj => obj["headers"])))];
            setTimeout(() => {
                // console.log(data, uniqueHeaders, totalSize);
                tableForFiles(data, uniqueHeaders)
                // $('.fa-arrow-alt-circle-right').addClass('blink');
            }, 10);

        })
        .catch(function(error) {
            console.log(error);
            swal({ title: "Information error", text: "Oops! " + error, icon: "warning" });
        });
    console.log("timeProcess: " + (new Date() - timeProcess) + "ms");
}

// *** voir pour mettre ici le typed js *** pour beaucoup de fichiers
function getDataFiles(file) {
    // var delimiter = document.getElementById('delimiter-input').value;
    // console.log(delimiter);
    return new Promise(function(resolve, reject) {
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
                chunk: function(results, parser) {
                    flag = checkHeaders(results.meta.fields, file);
                    if (flag) {
                        dataByFile[file.name] = results.data;
                        dataByFile["headers"] = results.meta.fields;
                        resolve(dataByFile);
                    } else {
                        reject("erreur entêtes de colonnes");
                    }
                },
                complete: function(results) {
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
    return new Promise(function(resolve) {
        var dataSelected = [],
            flat = [];

        if (dataFiles.length > 1) {
            dataFiles.forEach(file => {
                dataSelected.push(file[Object.keys(file)[0]].map(obj => {
                    if (regexAllSPE.test(Object.keys(file)[0]))
                        obj["filename imported"] = Object.keys(file)[0].match(regexAllSPE)[0].replace(/\_/g, '');
                    return obj;
                }));
            });
        } else {
            // console.log(Object.keys(dataFiles[0])[0]);
            dataSelected.push(dataFiles[0][Object.keys(dataFiles[0])[0]].map(obj => {
                    if (regexAllSPE.test(Object.keys(dataFiles[0])[0]))
                        obj["filename imported"] = Object.keys(dataFiles[0])[0].match(regexAllSPE)[0].replace(/\_/g, '');
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
        var checkWrongID = function(array) {
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
            document.getElementById('profil_info-div').firstElementChild.classList.replace('labelProfile', 'normal');
            $('.fa-arrow-alt-circle-right').removeClass('blink');
            document.getElementById('spinnerLoad-span').classList.replace("hidden", "inline");
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
        .then(function(data) {
            var flat = d3.csvParse(Papa.unparse(data.flat));
            var dataMappage = data.dataMappage;
            var jsonData = flat.map(function(obj, i) {
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
                flag = globalReport(jsonData); // launchTab(d3.csvParse(Papa.unparse(jsonData)));
                if (flag) {
                    console.log("tabulator launch !" + (new Date() - timeProcess) + "ms");
                }
            }, 10);
        }).catch(function(error) {
            console.log(error);
            swal({ title: "Information error", text: error.toString(), icon: "warning" });
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
    headers.forEach(function(title, i) {
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
        }).then(value => {});
    return flag;
}

function findFilesDuplicates(fileNames) {
    return new Promise(function(resolve, reject) {
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
