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