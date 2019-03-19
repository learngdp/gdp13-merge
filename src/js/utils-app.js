const format2dec = d3.format(".2f");
const formatPercent = d3.format(".0%");

/* tabulator */
// créer un nouveau format pour les colonnes
Tabulator.prototype.extendModule("format", "formatters", {
    numberfmt: function(cell, formatterParams) {
        var cellFormatted;
        if ( (/\,/g).test(cell.getValue()) ) {
            cellFormatted = cell.getValue().split(",").map(val => isNaN(parseFloat(val)) ? "" : formatPercent(parseFloat(val))).join(", ");
        } else {
            cellFormatted = isNaN(parseFloat(cell.getValue())) ? cell.getValue() : formatPercent(parseFloat(cell.getValue()))
        }
        return cellFormatted;
    },
});

// options for table
function tableOptions(data, columns) {
    return {
        // locale: true, // not working
        height: 800,
        data: data,
        reactiveData: true,
        // layout: "fitColumns", //fit columns to width of table (optional)
        tooltipsHeader: true,
        columns: columns,
        pagination: "local",
        paginationSize: 50,
        movableColumns: true,
        headerFilterPlaceholder:"filtre par mot-clé...",
        // responsiveLayout: "hide", //hide columns that dont fit on the table
        history: true, //allow undo and redo actions on the table
        tooltips: true, //show tool tips on cells
        // groupBy: ["Pre MOOC", "Grade"],
        initialSort: [ //set the initial sort order of the data
            { column: "Student ID", dir: "asc" },
        ],
        rowClick: function(e, row) {
            console.log(e, row);
        },
    }
}

//
function setDataColumns(headersColumns) {
    var columns = [];
    headersColumns.forEach((column, i) => {
        if (column == headersColumns[0]) {
            columns.push({ title: column, field: column, frozen: true , headerFilter:"input"});
        } else if (column == headersColumns[1]) {
            columns.push({ title: column, field: column, frozen: true , headerFilter:"input"}); //, formatter: "link", formatterParams: { urlPrefix: "mailto:" } });
        } else if (column == headersColumns[2]) {
            columns.push({ title: column, field: column, visible: false, headerFilter:"input"});
        } else if (i > 12 && i < 18) {
            columns.push({ title: column, field: column, formatter: "numberfmt", visible: false, headerFilter:"input"});
        } else if (i == 9 ||i == 18) {
            columns.push({ title: column, field: column, formatter: "numberfmt", headerFilter:"input"});
        } else if (i > 18 && i < 39) {
            columns.push({ title: column, field: column, formatter: "numberfmt", visible: false, headerFilter:"input"});
        } else if (i > 39 && i < 44) {
            columns.push({ title: column, field: column, visible: false, headerFilter:"input"});
        } else {
            columns.push({ title: column, field: column , headerFilter:"input"});
        }
    })
    return columns;
}

function replaceDataAfterLoaded(table, data, diff, timer) {
    if (diff > 1000) {
        setTimeout(() => {
            table.replaceData(data)
                .then(function() {
                    console.log('replaceData done!');
                    console.log("replaceData " + (new Date() - timeProcess) + "ms");
                    document.getElementById('spinnerLoad-span').classList.replace("inline", "hidden");
                    document.getElementById('profil_info-div').classList.replace("inline", "hidden");
                })
                .catch(function(error) {
                    console.log(error);
                });
        }, timer);
    } else {
        console.log("replaceData " + (new Date() - timeProcess) + "ms");
        document.getElementById('spinnerLoad-span').classList.replace("inline", "hidden");
        document.getElementById('profil_info-div').classList.replace("inline", "hidden");
    }
}

/* HELPERS */

function fillOptionsSelect(columns) {
    // pour select fields
    columns.forEach(option => {
        $('#filter-field').append('<option value="' + option + '" style="max-width:100px;">' + option + '</option>');
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
            row[j] = parseFloat(row[j].replace(/\,/, ".")).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
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

// Remove null, 0, blank, false, undefined and NaN values from an array
// https://www.w3resource.com/javascript-exercises/javascript-array-exercise-24.php
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
    // var dataPoint = data.map(row => convertToLocale(row));
    // console.log(data, filename);
    var dataPointToCSV = Papa.unparse(data);
    var BOM = "\uFEFF"; // issue https://github.com/eligrey/FileSaver.js/issues/28
    var csvDataPoint = BOM + dataPointToCSV;
    var blob = new Blob([csvDataPoint], { type: "text/csv;charset=utf-8" });
    saveAs(blob, filename + ".csv");
}

/* SWEET ALERT and CREATE TABLE */


/* SweetAlert */

function prettyDefault(title, text, html, icon, className) {
    swal({ title: title, text: text, content: html, icon: icon, className: className }).then(value => {
        // console.log(value);
    });
}

function prettyDefaultReload(title, text, icon) {
    swal({ title: title, text: text, icon: icon }).then(value => {
        setTimeout(() => window.location.href = window.location.href, 10);
    });
}

function prettyDefaultControl(title, text, html, icon) {
    swal({ title: title, text: text, content: html, icon: icon, className: "sweetalert-lg" }).then(value => {
        setTimeout(() => window.location.href = window.location.href, 10);
    });
}

// création simple de table html pour sweetALert pvtTable
function createTable(data, headers, className) {
    // console.log(data, headers);
    table = '<table class="' + className + ' tableForSweet" style="margin:5px auto">';
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
    return table;
}
