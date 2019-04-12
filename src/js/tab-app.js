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
        checkFiles = [], row, countSpe;

    for (var i = 0, lgi = data.slice(1, data.length).length; i < lgi; i++) {
        row = data.slice(1, data.length)[i];

        var cohortName = row[5];
        var grades = row[6] != undefined ? row[6].split(',') : "";
        var livrableAvg = row[16];
        var enrollmentTrack = row[33] != undefined ? row[33].split(',') : "";
        var fusionnes = row[39] != undefined ? row[39].split(',') : "";
        var gradeTC = row[40];

        var verifieldTuples = {};
        enrollmentTrack.forEach((track, i) => {
            verifieldTuples[fusionnes[i]] = track;
        });

        if (row[3] === "Absent sur profile_info")
            absences++;

            if (row[39] && row[39].split(',').indexOf('TC') !== -1 && row[39].split(',')[0] !== 'TC') {
                checkFiles.push([row[0], row[39]]);
            } else if (row[39] && row[39].split(',').indexOf('PA') !== -1 && row[39].split(',')[row[39].split(',').length - 1] !== 'PA') {
                checkFiles.push([row[0], row[39]]);
            }

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

        var enrollment_oui = (verifieldTuples["TC"] === "verified" && verifieldTuples[cellHeader1] === "verified" && verifieldTuples[cellHeader2] === "verified");

        var enrollment_non = (verifieldTuples["TC"] != "verified" || verifieldTuples[cellHeader1] != "verified" || verifieldTuples[cellHeader2] != "verified");

        // validation attestation PC
        (PC_oui && enrollment_oui) ? attestationPC = "OUI": (PC_oui && cohortName != "") ? attestationPC = "OUI" : (PC_oui && enrollment_non) ? attestationPC = "en attente" : attestationPC = "NON";

        // validation attestion PA
        (PA_oui && enrollment_oui) ? attestationPA = "OUI": (PA_oui && cohortName != "") ? attestationPA = "OUI" : (PA_oui && enrollment_non) ? attestationPA = "en attente" : attestationPA = "NON";

        row.splice(6, 0, attestationPC);
        row.splice(7, 0, attestationPA);
        row.splice(8, 0, gradeTC);
        row.splice(10, 0, cellHeader1);
        row.splice(11, 0, cellHeader2);
        row.splice(12, 0, countSpe);

        row.splice(46, 1);
    }
    data[0].splice(46, 1);

    if (checkFiles.length > 0) {
        document.getElementById('checkFiles-btn').classList.replace('hidden', 'inline')
        document.getElementById('checkFiles-btn').classList.add('blink');
    }

    document.getElementById('checkFiles-btn').onclick = function() {
        checkFiles.unshift([data[0][0], data[0][40]]);
        exportCSVDefault(checkFiles, "erreur-fusion-fichiers");
    }

    document.getElementById('finalStandard-btn').onclick = function(e) {
        // console.log(e);
        tableauFinalStandard(dataFromCSV, dataMappage);
    }

    document.getElementById('exportCSVComma-btn').onclick = function(e) {
        var dataExport = [];
        console.log(data);
        data.forEach((row, i) => {
            var row = row.slice(0, 38);
            if ( i !== 0)
                row = row.map(d => pointToComma_FR(d));
            dataExport.push(row);
        });
        exportCSVDefault(dataExport, "global_reportTC");
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

    launchTab(d3.csvParse(Papa.unparse(data)), absences); // dataToTable(data, cohortes, cohortTitle);

    return true;
}

function launchTab(jsonFromCSV, absences) {
    // console.log(jsonFromCSV);

    var data = jsonFromCSV.length > 1000 ? jsonFromCSV.slice(0, 1000) : jsonFromCSV.slice(0, jsonFromCSV.length);
    var diff = jsonFromCSV.slice(0, jsonFromCSV.length).length - data.length;
    var headers = jsonFromCSV.columns;

    // fill select element after load
    fillOptionsSelect(headers);

    // set columns with formatters and others options
    var columns = setDataColumns(headers);

    var headersHidden = columns.filter(column => column.visible != undefined && !column.visible).map(column => column.field);

    //create Tabulator on DOM element with id "table-app"
    var table = new Tabulator("#table-app", tableOptions(data, columns));

    // for large data
    replaceDataAfterLoaded(table, jsonFromCSV, diff, 1000);

    //Trigger setFilter function with correct parameters
    function updateFilter() {
        var filter = $("#filter-field").val();
        if ($("#filter-field").val() === "function") {
            $("#filter-type").prop("disabled", true);
            $("#filter-value").prop("disabled", true);
        } else {
            $("#filter-type").prop("disabled", false);
            $("#filter-value").prop("disabled", false);
        }
        console.log(filter, $("#filter-type").val(), $("#filter-value").val());
        table.setFilter(filter, $("#filter-type").val(), $("#filter-value").val());
    }
    //Update filters on value change
    $("#filter-field, #filter-type").change(updateFilter);
    $("#filter-value").keyup(updateFilter);
    //Clear filters on "Clear Filters" button click
    $("#filter-clear").click(function() {
        $("#filter-field").val("Student ID");
        $("#filter-type").val("like");
        $("#filter-value").val("");

        table.clearFilter();
    });

    document.getElementById('filtersHeader-clear').onclick = function(e) {
        table.clearHeaderFilter();
    }

    document.getElementById('groupBy-btn').onclick = function(e) {
        var groupValues = document.getElementById('groupBy-input').value;
        var fields = [],
            groupsNumber = [];
        if (groupValues) {
            var fields = Array.compact(groupValues.split(/[\;\,\>]+/));
            fields = fields.map(header => String.trim(header)).filter(header => headers.indexOf(header) != -1);
            if (fields.length > 0) {
                table.setGroupBy(fields);
                this.innerHTML = '<i class="fas fa-lock"></i>'
            }
        }
    }

    document.getElementById('groupBy-btn').onmouseover = function(e) {
        var title = document.getElementById('groupBy-input').value ? "grouper par: " + document.getElementById('groupBy-input').value :
            "grouper par entête"
        e.target.title = title;
    };

    document.getElementById('degroupBy-btn').onclick = function(e) {
        document.getElementById('groupBy-input').value = "";
        table.setGroupBy("");
        document.getElementById('groupsNumber').innerHTML = "";
        document.getElementById('groupBy-btn').innerHTML = '<i class="fas fa-lock-open"></i>'
        document.getElementById('groupBy-btn').title = "grouper par entête"
    }

    document.getElementById('hide-col').onclick = function() {
        let columnName = document.getElementById('filter-field').value;
        table.hideColumn(columnName);
    }

    document.getElementById('show-col').onclick = function() {
        let columnName = document.getElementById('filter-field').value;
        table.showColumn(columnName);
    }

    document.getElementById('showAll-coll').onclick = function() {
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
            document.getElementById('showConcat-col').firstChild.classList.replace("fa-grip-lines", "fa-grip-lines-vertical");
            table.redraw();
        }, 10)
    }

    document.getElementById('showConcat-col').onclick = function() {
        document.getElementById('spinnerLoad-span').classList.replace("hidden", "inline");
        var headersColumnsConcat = ["Grade", "Enrollment Track", "Verification Status", "Enrollment Status"];
        setTimeout(() => {
            headersColumnsConcat.forEach(header => {
                table.showColumn(header);
            });
            document.getElementById('spinnerLoad-span').classList.replace("inline", "hidden");
            this.firstChild.classList.replace("fa-grip-lines-vertical", "fa-grip-lines");
            table.redraw();
        }, 10)
    }

    $("#deselectAll-rows").click(function() {
        table.deselectRow();
    });

    document.getElementById('exportCSV-btn').onclick = function(e) {
        table.download("csv", "export-grades.csv", {delimiter:","});
    }

    var dataFiltered = function() {
        var filteredData = table.getData(true);
        var selectedData = table.getSelectedData();
        var filterSelectedData = filteredData.filter(value => -1 !== selectedData.indexOf(value))
        console.log(table.getData());

        var columnsVisible = columns.map(column => column.field);
        var dataFiltered = filteredData.map(item => {
            return Object.keys(item)
                .filter(key => columnsVisible.includes(key))
                .reduce((obj, key) => {
                    obj[key] = item[key];
                    return obj;
                }, {})
        });
        var dataExport = d3.csvParseRows(Papa.unparse(dataFiltered));
        return dataExport;
    };

    setTimeout(() => {
        console.log(absences);
        if (absences > 0)
            document.getElementById('absences').innerHTML = absences;
    }, 10);

    return true;
} // FIN DE LAUNCHtAB

