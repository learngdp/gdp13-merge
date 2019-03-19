// const lang = navigator.language; // "de_DE"; // "en_US"; //
// const locale = (lang && lang !== undefined) ? lang.match(/^\w{2}/)[0] : (lang === "de" || lang === "fr" || lang === "it" || lang === "nl") ? lang : "en";
console.log(lang, locale);

document.addEventListener('touchstart', function addtouchclass(e) { // first time user touches the screen
    document.documentElement.classList.add('can-touch') // add "can-touch" class to document root using classList API
    document.removeEventListener('touchstart', addtouchclass, false) // de-register touchstart event
}, false)

/********************************* */
import 'tabulator-tables/dist/css/tabulator.min.css';
import './style.css';

import 'webpack-jquery-ui/css';

var Tabulator = require('tabulator-tables');

var Collection = require('lodash/collection');
var Array = require('lodash/array');

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
import {
    faCog
} from '@fortawesome/free-solid-svg-icons/faCog';
import {
    faCheckSquare
} from '@fortawesome/free-solid-svg-icons/faCheckSquare';
import {
    faDownload
} from '@fortawesome/free-solid-svg-icons/faDownload';
import {
    faEraser
} from '@fortawesome/free-solid-svg-icons/faEraser';
import {
    faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import {
    faEye
} from '@fortawesome/free-solid-svg-icons/faEye';
import {
    faEyeSlash
} from '@fortawesome/free-solid-svg-icons/faEyeSlash';
import {
    faLock
} from '@fortawesome/free-solid-svg-icons/faLock';
import {
    faLockOpen
} from '@fortawesome/free-solid-svg-icons/faLockOpen';
import {
    faUndoAlt
} from '@fortawesome/free-solid-svg-icons/faUndoAlt';
import {
    faArrowAltCircleRight
} from '@fortawesome/free-solid-svg-icons/faArrowAltCircleRight';

library.add(
    faCog,
    faCheckSquare,
    faDownload,
    faEraser,
    faExternalLinkAlt,
    faEye,
    faEyeSlash,
    faLock,
    faLockOpen,
    faUndoAlt,
    faArrowAltCircleRight
);

dom.watch();

window.addEventListener('load', function () {
    document.getElementById('main_div').style.display = 'block';
})