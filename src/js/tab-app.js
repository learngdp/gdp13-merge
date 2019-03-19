function globalReport(jsonData) {
    var dataFromCSV = d3.csvParseRows(Papa.unparse(jsonData));

    var data = dataFromCSV.map(row => commaToPoint(row));

    var headersReportSpe = [data[0].slice(17, 32)];

    var rangeSpe = data.slice(1, data.length).map((row) => row.slice(17, 32).map((el) => (isNaN(parseFloat(el))) ? 0 : parseFloat(el)));

    data[0].splice(6, 0, 'Attestation PC');
    data[0].splice(7, 0, 'Attestation PA');
    data[0].splice(8, 0, 'Certificat Auth');
    data[0].splice(10, 0, '1ère SPE');
    data[0].splice(11, 0, '2ème SPE');
    data[0].splice(12, 0, 'SPE validées'); // pour ajouter la colonne avant de pousser le nombre de spé validées

    var pass70 = 0.695,
        row, countSpe;

    var pass70 = 0.695,
        absences = 0,
        row, countSpe;

    for (var i = 0, lgi = data.slice(1, data.length).length; i < lgi; i++) {
        row = data.slice(1, data.length)[i];

        if (row[3] === "Absent sur profile_info")
            absences++;

        countSpe = rangeSpe[i].filter(el => el > pass70).length;

        // 2 meilleures spécialisations
        var max1 = Math.max.apply(null, rangeSpe[i]);
        var cellHeader1 = (max1 > pass70 && rangeSpe[i].indexOf(max1) !== -1) ? headersReportSpe[0][
            rangeSpe[i].indexOf(max1)
        ] : "";
        if (rangeSpe[i].length > 1 && rangeSpe[i].indexOf(max1) !== -1) rangeSpe[i].splice(
            rangeSpe[i].indexOf(max1), 1, 0);

        var max2 = Math.max.apply(null, rangeSpe[i]);
        var cellHeader2 = (max2 > pass70 && rangeSpe[i].indexOf(max2) !== -1) ? headersReportSpe[0][
            rangeSpe[i].indexOf(max2)
        ] : "";
        if (cellHeader2 === cellHeader1) cellHeader2 = "";

        row.splice(6, 0, "");
        row.splice(7, 0, "");
        row.splice(8, 0, "");

        row.splice(10, 0, regexHeadersSPE.test(cellHeader1) ? cellHeader1.match(regexHeadersSPE)[0].replace(/\s\-/, "") : cellHeader1);
        row.splice(11, 0, regexHeadersSPE.test(cellHeader2) ? cellHeader2.match(regexHeadersSPE)[0].replace(/\s\-/, "") : cellHeader2);
        row.splice(12, 0, countSpe);
    }

    setTimeout(() => {
        launchTab(d3.csvParse(Papa.unparse(data)), absences); // dataToTable(data, cohortes, cohortTitle);
    }, 100);

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
    $("#filter-clear").click(function() {
        $("#filter-field").val("Student ID");
        $("#filter-type").val("like");
        $("#filter-value").val("");

        table.clearFilter();
    });

    document.getElementById('groupBy-btn').onclick = function (e) {
        var groupValues = document.getElementById('groupBy-input').value;
        var fields = [];
        if (groupValues) {
            var fields = _.compact(groupValues.split(/[\;\,]+/));
            // console.log(fields, headers.indexOf(fields.join('')));
            fields = fields.map(header => _.trim(header)).filter(header => headers.indexOf(header) != -1);
            if (fields.length > 0) {
                table.setGroupBy(fields);
                this.innerHTML = '<i class="fas fa-lock"></i>'
            }
        }
    }

    document.getElementById('degroupBy-btn').onclick = function (e) {
        document.getElementById('groupBy-input').value = "";
        table.setGroupBy("");
        document.getElementById('groupBy-btn').innerHTML = '<i class="fas fa-lock-open"></i>'
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

    $("#deselectAll-rows").click(function () {
        table.deselectRow();
    });

    document.getElementById('exportCSV-btn').onclick = function (e) {
        document.getElementById('spinnerLoad-span').classList.replace("hidden", "inline");
        console.time("export");
        setTimeout(() => {
            // console.log(merged);
            exportCSVDefault(dataFiltered(), "global_report");
            document.getElementById('spinnerLoad-span').classList.replace("inline", "hidden");
            console.timeEnd("export");
        }, 100);
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