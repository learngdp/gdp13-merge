const format2dec = d3.format(".2f");
const formatPercent = d3.format(".0%");

/* tabulator */
// créer un nouveau format pour les colonnes
Tabulator.prototype.extendModule("format", "formatters", {
    numberfmt: function(cell, formatterParams) {
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
    var footerContent = '<div class="footerInfo">lignes: <span id="rowsTotal" style="font-weight: 900">'+ data.length +'</span>';
        footerContent += '<span style="margin-left: 1em">colonnes: </span><span id="columnsTotal" style="font-weight: 900">'+ columns.length +'</span>';
        footerContent += '<div style="margin-left: 10em;" class="inline">';
        footerContent += '<span>lignes: </span><span id="rowsCount" style="font-weight: 900"></span> (filtrée.s)';
        footerContent += '<span style="margin-left: 2em">sélection: </span><span id="rowSelected" style="font-weight: 900"></span> (ligne.s)';
        footerContent += '<span style="margin-left: 2em">total absence.s: </span><span id="absences" style="font-weight: 900; color:red"></span>'
        footerContent += '</div></div>';
    return {
        selectable: true,
        height: 800,
        data: data,
        reactiveData: true,
        tooltipsHeader: true,
        columns: columns,
        pagination: "local",
        paginationSize: 50,
        movableColumns: true,
        headerFilterPlaceholder: "filtre par mot-clé...",
        footerElement: footerContent,
        history: true,
        tooltips: true,
        initialSort: [
            { column: "Student ID", dir: "asc" },
        ],
        rowClick: function(e, row) {},
        rowSelectionChanged: function(data, rows) {
            document.getElementById('rowSelected').innerHTML = data.length;
        },
        dataFiltered: function(filters, rows) {
            document.getElementById('rowsCount').innerHTML = rows.length;
        },
    }
}

//
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
                cellClick: function(e, cell) {
                    var rowData = Object.entries(cell.getRow().getData());
                    createTable(["entête", "valeur"], rowData, "pvtTable")
                }
            });
        } else if (column == headersColumns[1]) {
            columns.push({ id: i, title: name, field: column, frozen: true, headerFilter: "input" }); //, formatter: "link", formatterParams: { urlPrefix: "mailto:" } });
        } else if (column == headersColumns[2]) {
            columns.push({ id: i, title: name, field: column, visible: false, headerFilter: "input" });
        } else if (i > 12 && i < 18) {
            columns.push({ id: i, title: name, field: column, formatter: "numberfmt", visible: false, headerFilter: "input" });
        } else if (i == 9 || i == 18) {
            columns.push({ id: i, title: name, field: column, formatter: "numberfmt", headerFilter: "input" });
        } else if (i > 18 && i < 39) {
            columns.push({ id: i, title: name, field: column, formatter: "numberfmt", visible: false, headerFilter: "input" });
        } else if (i > 39 && i < 44) {
            columns.push({ id: i, title: name, field: column, visible: false, headerFilter: "input" });
        } else {
            columns.push({ id: i, title: name, field: column, headerFilter: "input" });
        }
    })
    return columns;
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
    var blob = new Blob([csvDataPoint], { type: "text/csv;charset=utf-8" });
    saveAs(blob, filename + ".csv");
}

/* SWEET ALERT and CREATE TABLE */

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
    prettyDefault(title, text, html, "");
    return true;
}
