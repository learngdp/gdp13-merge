(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{163:function(e,n,t){"use strict";t.r(n),function(e){t(165),t(167),t(168),t(169);var n=t(158),a=t.n(n),i=t(16),o=t.n(i),l=(t(410),t(93)),r=t(159),s=t(160);console.log(lang,locale),document.addEventListener("touchstart",function e(n){document.documentElement.classList.add("can-touch"),document.removeEventListener("touchstart",e,!1)},!1);var c=t(178),d=(t(179),t(293)),u=t(362);const p=Object.assign({},t(20),t(416),t(2),t(415),t(5),t(65),t(414),t(413));var m;l.b.add(r.a,s.a),l.a.watch(),window.addEventListener("load",function(){document.getElementById("main_div").style.display="block"}),console.log(lang,locale);function f(e){return new Promise(function(n,t){var a=new FileReader;a.onload=(a=>{var i=a.target.result;let l,r={};o.a.parse(i,{header:!0,dynamicTyping:!0,skipEmptyLines:!0,chunk:function(a,i){(l=function(e,n){var t;return e.forEach(function(e,a){if(v[v.indexOf(e.trim())],-1===v.indexOf(e.trim())){var i=document.createElement("div"),o=document.createElement("p");e=e&&" "!==e?e:"au moins une colonne ou un entête vide",o.innerHTML="<h4 Fichier concerné:<br><b>"+n.name+"</b><br><br>Entête concerné:<br><b>"+e+"</b></h4><hr>",o.innerHTML+='<h4 style="color:red"> <i class="fa fa-warning"></i><br>entêtes en cours au '+(new Date).toLocaleDateString()+"</h4><br><br>",o.innerHTML+=JSON.stringify(v.map(e=>"["+e+"]").join(", ")),i.appendChild(o),function(e,n,t,a){swal({title:e,text:n,content:t,icon:a,className:"sweetalert-lg"}).then(e=>{setTimeout(()=>window.location.href=window.location.href,10)})}("Contrôle entête de colonnes","Oups! Apparemment, un entête de colonne n'est pas conforme au modèle attendu... ",i,"warning"),t=!1}else t=!0}),t}(a.meta.fields,e))?(r[e.name]=a.data,r.headers=a.meta.fields,n(r)):t("erreur entêtes de colonnes")},complete:function(n){console.log("done! ",e.name,new Date-m+"ms")}})}),a.onprogress=(e=>{}),a.readAsText(e,"UTF-8"),0})}function g(e,n){for(var t,a=[],i=0,o=e.length;i<o;i++)t=e[i][n],a.push(t);return function(e){var n=-1,t=e?e.length:0,a=-1,i=[];for(;++n<t;){var o=e[n];o&&(i[++a]=o)}return i}(a)}fileInput.onchange=function(n){m=new Date,document.getElementById("spinnerLoad-span").classList.replace("hidden","inline"),this.disabled=!0;var t=[...fileInput.files];(t=t.sort(function(e,n){return e=w.test(e.name)?e.name.match(w)[0]:e.name,n=w.test(n.name)?n.name.match(w)[0]:n.name,y[e]-y[n]})).map(e=>e.size).reduce((e,n)=>e+=n);let a=[];for(var i=0,l=t.length;i<l;i++)a.push(f(t[i]));Promise.all(a).then(function(n){let t=[...new Set([].concat(...n.map(e=>e.headers)))];setTimeout(()=>{!function(n,t){document.getElementById("grade_report-div").classList.replace("inline","hidden"),document.getElementById("profil_info-div").classList.replace("hidden","inline"),document.getElementById("spinnerLoad-span").classList.replace("inline","hidden"),function(n,t){return console.log("flatData: "+(new Date-m)+"ms"),new Promise(function(a){var i=[],l=[];n.length>1?n.forEach(e=>{i.push(e[Object.keys(e)[0]].map(n=>(E.test(Object.keys(e)[0])&&(n["filename imported"]=Object.keys(e)[0].match(E)[0].replace(/\_/g,"")),n)))}):i.push(n[0][Object.keys(n[0])[0]].map(e=>(E.test(Object.keys(n[0])[0])&&(e["filename imported"]=Object.keys(n[0])[0].match(E)[0].replace(/\_/g,"")),e)));var r=[].concat(...i),s={};t.forEach((e,n)=>{s[e]=""});for(var c=0,d=r.length;c<d;c++)l.push(Object.assign({},s,r[c]));var u,m,f,v=function(e,n){document.getElementById("filter-field").value,e.push("fichiers fusionnés");var t=p.csvParse(o.a.unparse(n)),a={};e.forEach((e,n)=>{a[e]=""});for(var i=[],l=p.nest().key(e=>e["Student ID"]).rollup(n=>{var t=n.map(e=>[].concat.call([],Object.values(e)));return t.unshift(e),{arr:t}}).entries(t),r=0,s=l.length;r<s;r++){var c=l[r],d=c.value.arr,u={};e.forEach((e,n)=>{u[e]="Grade"==e||"Enrollment Track"==e||"Enrollment Status"==e||"fichiers fusionnés"==e?g(d.slice(1,d.length),n):[...new Set(g(d.slice(1,d.length),n))]}),i.push(Object.assign({},a,u))}return p.csvParseRows(o.a.unparse(i))}(t,l).sort((e,n)=>e[0]-n[0]);m=(u=v)[0].map(e=>e.trim()),f=[],u.forEach((e,n)=>{0===n||void 0===e[0]||""===e[0]||e[0].match(/^(\r\n|\r|\n)$/)||(e[0]=e[0].trim(),f.push(e))}),f.unshift(m),v=f;var b=function(e){var n=o.a.parse(e).meta.delimiter,t=p.dsvFormat(n).parseRows(e,function(e){if(e&&void 0!==e&&0!==e[0].length)return e}).sort((e,n)=>e[0]-n[0]),i=p.csvParse(o.a.unparse(t));void 0!==t&&function(e){console.time("import");var n=!0;return e[0].slice(0,4).forEach(e=>{-1===h.indexOf(e)&&(n=!1)}),n||swal({title:"Fichier profile_info",text:"Un des champs en entête des 4 premières colonnes ne correspond pas au champs attendus dans l'ordre suivant:\n[id] [username] [name] [email]",icon:"warning"}).then(e=>{}),n}(t)&&a({flat:v,dataMappage:i})};document.getElementById("fileInputMappage").onchange=function(n){this.disabled=!0,document.getElementById("profil_info-div").firstElementChild.classList.replace("labelProfile","normal"),e(".fa-arrow-alt-circle-right").removeClass("blink"),document.getElementById("spinnerLoad-span").classList.replace("hidden","inline");var t=this.files[0],a=new FileReader;a.onprogress=function(e){},a.onloadend=function(e){},a.onload=function(e){b(a.result)},a.readAsText(t)}})}(n,t).then(function(n){var t=p.csvParse(o.a.unparse(n.flat)),a=n.dataMappage,i=t.map(function(e,n){var t;e.Username&&void 0!==e.Username&&(t=isNaN(e.Username)?e.Username:e.Username.toString());var i=a.find(e=>e.username===t),o=a.find(n=>n.email===e.Email);e.Name=void 0===i||void 0===o?"":i.name;var l=a.find(n=>n.id===e["Student ID"]);return void 0===l?e.Name="Absent sur profile_info":(e.Name=l.name,e.year_of_birth=l.year_of_birth?l.year_of_birth:""),function(e,n){return n.reduce((t,a)=>{n.indexOf(a);return t[a]=e[a],t},{})}(e,v)});setTimeout(()=>{(function(n){var t=p.csvParseRows(o.a.unparse(n)).map(e=>(function(e){for(var n=/(<([^>]+)>)/gi,t=/^[0-9]+([,][0-9]+)?%?$/,a=/^[0-9]+([.][0-9]+)?%?$/,i=[],o=0,l=e.length;o<l;o++)isNaN(Number(e[o]))&&t.test(e[o])&&!a.test(e[o])?e[o]=parseFloat(e[o].replace(/\,/,".")).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"0"===e[o]||" "===e[o]?e[o]="":"Not Attempted"===e[o]||"Not Available"===e[o]?e[o]="":e[o]=e[o].replace(n,""),i.push(e[o]);return i})(e)),a=[t[0].slice(17,32)],i=t.slice(1,t.length).map(e=>e.slice(17,32).map(e=>isNaN(parseFloat(e))?0:parseFloat(e)));t[0].splice(6,0,"Attestation PC"),t[0].splice(7,0,"Attestation PA"),t[0].splice(8,0,"Certificat Auth"),t[0].splice(10,0,"1ère SPE"),t[0].splice(11,0,"2ème SPE"),t[0].splice(12,0,"SPE validées");for(var l,r,s=0,f=0,g=t.slice(1,t.length).length;f<g;f++){"Absent sur profile_info"===(l=t.slice(1,t.length)[f])[3]&&s++,r=i[f].filter(e=>e>.695).length;var h=Math.max.apply(null,i[f]),v=h>.695&&-1!==i[f].indexOf(h)?a[0][i[f].indexOf(h)]:"";i[f].length>1&&-1!==i[f].indexOf(h)&&i[f].splice(i[f].indexOf(h),1,0);var b=Math.max.apply(null,i[f]),y=b>.695&&-1!==i[f].indexOf(b)?a[0][i[f].indexOf(b)]:"";y===v&&(y=""),l.splice(6,0,""),l.splice(7,0,""),l.splice(8,0,""),l.splice(10,0,x.test(v)?v.match(x)[0].replace(/\s\-/,""):v),l.splice(11,0,x.test(y)?y.match(x)[0].replace(/\s\-/,""):y),l.splice(12,0,r)}return setTimeout(()=>{!function(n,t){console.log("start "+(new Date-m)+"ms");var a=n.length>1e3?n.slice(0,1e3):n.slice(0,n.length),i=n.slice(0,n.length).length-a.length,l=n.columns;!function(n){n.forEach(n=>{e("#filter-field").append('<option value="'+n+'" style="max-width:100px;">'+B(n)+"</option>")}),["like","=","<","<=",">",">=","!="].forEach(n=>{e("#filter-type").append('<option value="'+n+'" style="max-width:100px;">'+n+"</option>")})}(l);var r=function(n){var t,a=[];return n.forEach((i,o)=>{t=B(i),i==n[0]?a.push({id:o,title:t,field:i,frozen:!0,headerFilter:"input",cellClick:function(n,t){var a,i,o,l,r,s=Object.entries(t.getRow().getData());a=["entête","valeur"],i=s,o="pvtTable",l=document.createElement("div"),document.createElement("p"),r='<table class="'+o+' tableForSweet" style="margin:5px auto">',r+="<thead><tr>",a.forEach(e=>{r+="<th>"+e+"</th>"}),r+="</tr></thead>",r+="<tbody>",i.forEach(e=>{r+="<tr>",r+="<td>"+e[0]+"</td>",r+="<td>"+e[1]+"</td>",r+="</tr>"}),r+="</tbody></table>",l.appendChild(e.parseHTML(r)[0]),swal({title:"Info participant",text:"",content:l,className:"sweetalert-auto",buttons:{export:"export CSV",annuler:!0}}).then(e=>{switch(e){case"export":i.unshift(a),F(i,"participant_info")}})},headerContext:function(e,n){e.preventDefault(),S(n.getField())}}):i==n[1]?a.push({id:o,title:t,field:i,frozen:!0,headerFilter:"input",headerContext:function(e,n){e.preventDefault(),S(n.getField())}}):i==n[2]?a.push({id:o,title:t,field:i,visible:!1,headerFilter:"input",headerContext:function(e,n){e.preventDefault(),S(n.getField())}}):o>12&&o<18?a.push({id:o,title:t,field:i,formatter:"numberfmt",visible:!1,headerFilter:"input",headerContext:function(e,n){e.preventDefault(),S(n.getField())}}):9==o||18==o?a.push({id:o,title:t,field:i,formatter:"numberfmt",headerFilter:"input",headerContext:function(e,n){e.preventDefault(),S(n.getField())}}):o>18&&o<39?a.push({id:o,title:t,field:i,formatter:"numberfmt",visible:!1,headerFilter:"input",headerContext:function(e,n){e.preventDefault(),S(n.getField())}}):o>39&&o<44?a.push({id:o,title:t,field:i,visible:!1,headerFilter:"input",headerContext:function(e,n){e.preventDefault(),S(n.getField())}}):a.push({id:o,title:t,field:i,headerFilter:"input",headerContext:function(e,n){e.preventDefault(),S(n.getField())}})}),a}(l),s=new c("#table-app",function(e,n){var t='<div class="footerInfo">lignes: <span id="rowsTotal" style="font-weight: 900">'+e.length+"</span>";return t+='<span style="margin-left: 1em">colonnes: </span><span id="columnsTotal" style="font-weight: 900">'+n.length+"</span>",t+='<div style="margin-left: 10em;" class="inline">',t+='<span>lignes: </span><span id="rowsCount" style="font-weight: 900"></span> (filtrée.s)',t+='<span style="margin-left: 2em">sélection: </span><span id="rowSelected" style="font-weight: 900"></span> (ligne.s)',t+='<span style="margin-left: 2em">total absence.s: </span><span id="absences" style="font-weight: 900; color:red"></span>',{selectable:!0,height:800,data:e,reactiveData:!0,tooltipsHeader:!0,columns:n,pagination:"local",paginationSize:50,movableColumns:!0,headerFilterPlaceholder:"filtre par mot-clé...",groupStartOpen:!1,footerElement:t+="</div></div>",history:!0,tooltips:!0,initialSort:[{column:"Student ID",dir:"asc"}],rowClick:function(e,n){},rowSelectionChanged:function(e,n){document.getElementById("rowSelected").innerHTML=e.length},dataFiltered:function(e,n){document.getElementById("rowsCount").innerHTML=n.length}}}(a,r));function f(){var n=e("#filter-field").val();"function"==e("#filter-field").val()?(e("#filter-type").prop("disabled",!0),e("#filter-value").prop("disabled",!0)):(e("#filter-type").prop("disabled",!1),e("#filter-value").prop("disabled",!1)),s.setFilter(n,e("#filter-type").val(),e("#filter-value").val())}console.log("tabulator "+(new Date-m)+"ms"),function(e,n,t,a){t>1e3?setTimeout(()=>{e.replaceData(n).then(function(){document.getElementById("rowsTotal").innerHTML=n.length,console.log("replaceData done!"),console.log("replaceData "+(new Date-m)+"ms"),document.getElementById("spinnerLoad-span").classList.replace("inline","hidden"),document.getElementById("profil_info-div").classList.replace("inline","hidden")}).catch(function(e){console.log(e)})},a):(console.log("replaceData "+(new Date-m)+"ms"),document.getElementById("spinnerLoad-span").classList.replace("inline","hidden"),document.getElementById("profil_info-div").classList.replace("inline","hidden"))}(s,n,i,1e3),e("#filter-field, #filter-type").change(f),e("#filter-value").keyup(f),e("#filter-clear").click(function(){e("#filter-field").val("Student ID"),e("#filter-type").val("like"),e("#filter-value").val(""),s.clearFilter()}),document.getElementById("groupBy-btn").onclick=function(e){var n=document.getElementById("groupBy-input").value,t=[];if(n){var t=d.compact(n.split(/[\;\,\>]+/));(t=t.map(e=>u.trim(e)).filter(e=>-1!=l.indexOf(e))).length>0&&(s.setGroupBy(t),this.innerHTML='<i class="fas fa-lock"></i>')}},document.getElementById("groupBy-btn").onmouseover=function(e){var n=document.getElementById("groupBy-input").value?"grouper par: "+document.getElementById("groupBy-input").value:"grouper par entête";e.target.title=n},document.getElementById("degroupBy-btn").onclick=function(e){document.getElementById("groupBy-input").value="",s.setGroupBy(""),document.getElementById("groupBy-btn").innerHTML='<i class="fas fa-lock-open"></i>',document.getElementById("groupBy-btn").title="grouper par entête"},document.getElementById("hide-col").onclick=function(){let e=document.getElementById("filter-field").value;s.hideColumn(e)},document.getElementById("show-col").onclick=function(){let e=document.getElementById("filter-field").value;s.showColumn(e)},document.getElementById("showAll-coll").onclick=function(){document.getElementById("spinnerLoad-span").classList.replace("hidden","inline"),setTimeout(()=>{l.forEach(e=>{s.showColumn(e)}),document.getElementById("spinnerLoad-span").classList.replace("inline","hidden")},10)},e("#deselectAll-rows").click(function(){s.deselectRow()}),document.getElementById("exportCSV-btn").onclick=function(e){document.getElementById("spinnerLoad-span").classList.replace("hidden","inline"),console.time("export"),setTimeout(()=>{F(g(),"global_report"),document.getElementById("spinnerLoad-span").classList.replace("inline","hidden"),console.timeEnd("export")},100)};var g=function(){var e=s.getData(!0),n=s.getSelectedData();e.filter(e=>-1!==n.indexOf(e)),console.log(s.getData());var t=r.map(e=>e.field),a=e.map(e=>Object.keys(e).filter(e=>t.includes(e)).reduce((n,t)=>(n[t]=e[t],n),{})),i=p.csvParseRows(o.a.unparse(a));return i};setTimeout(()=>{t>0&&(document.getElementById("absences").innerHTML=t)},10)}(p.csvParse(o.a.unparse(t)),s)},100),console.log("globalReport end "+(new Date-m)+"ms"),!0})(i)&&console.log("tabulator launch !"+(new Date-m)+"ms")},10)}).catch(function(e){console.log(e),swal({title:"Information error",text:e.toString(),icon:"warning"})})}(n,t)},10)}).catch(function(e){console.log(e),swal({title:"Information error",text:"Oops! "+e,icon:"warning"})}),console.log("timeProcess: "+(new Date-m)+"ms")};const h=["id","username","name","email"],v=["Student ID","Email","year_of_birth","Name","Username","Cohort Name","Grade","Évaluation Hebdo 1: Évaluation (notée)","Évaluation Hebdo 2: Évaluation (notée)","Évaluation Hebdo 3: Évaluation (notée)","Évaluation Hebdo 4: Évaluation (notée)","Évaluation Hebdo (Avg)","Examen Final","Livrables 1: Carte Conceptuelle - (Semaine 1)","Livrables 2: Compte-rendu - (Semaine 2)","Livrables 3: Planification - (Semaine 3)","Livrables (Avg)","DFS - Diagnostic de Fonctionnement d'un Système","MCB - Management de la Créativité et Brainstorming","MEP - Management d'Équipe Projet","IEF - Les outils informatiques & Évaluer financièrement les projets","PMI - Certifications professionnelles PMI®","AF - Analyse Fonctionnelle","AS - Analyse Stratégique dans les Projets","EIP - Évaluation d'Impact des Projets","PAV - Planification Avancée","MVP - Management Visuel de Projet","GPAS - Gestion de projet agile avec Scrum","MRP - Outils et Méthodologie de Résolution de Problème","TRIZ - Introduction aux principaux outils de TRIZ","G2C - Gestion de crise","PAE - Du Projet à l'Action Entrepreneuriale","Pre MOOC","Enrollment Track","Verification Status","Certificate Eligible","Certificate Delivered","Certificate Type","Enrollment Status","fichiers fusionnés"],b={};v.forEach(e=>{b[e]=""});const y={_TC_:1,"_SPE-DFS_":2,"_SPE-MCB_":3,"_SPE-MEP_":4,"_SPE-IEF_":5,"_SPE-PMI_":6,"_SPE-AF_":7,"_SPE-AS_":8,"_SPE-EIP_":9,"_SPE-PAV_":10,"_SPE-MVP_":11,"_SPE-GPAS_":12,"_SPE-MRP_":13,"_SPE-TRIZ_":14,"_SPE-G2C_":15,"_SPE-PAE_":16,_PA_:17},E=/_(SPE-\w{2,4}|PA_\d{2}|TC_\d{2})_/,w=/_(SPE-\w{2,4}|PA|TC)_/,x=/\b[A-Z0-9]{2,4}\b\s\-/,I=/^Évaluation Hebdo [1|2|3|4]\:/,P=/^Livrables [1|2|3]\:/,_=(p.format(".2f"),p.format(".0%"));function S(e){var n=document.getElementById("groupBy-input").value?document.getElementById("groupBy-input").value+" > "+e:e;document.getElementById("groupBy-input").value=n.replace(/^[\s\>]/,"")}function B(e){return x.test(e)?e.match(x)[0].replace(/\s\-/,""):I.test(e)?e.match(I)[0].replace(/\:/,""):P.test(e)?e.match(P)[0].replace(/\:/,""):e}function F(e,n){var t=o.a.unparse(e),i=new Blob(["\ufeff"+t],{type:"text/csv;charset=utf-8"});a()(i,n+".csv")}c.prototype.extendModule("format","formatters",{numberfmt:function(e,n){return/\,/g.test(e.getValue())?e.getValue().split(",").map(e=>isNaN(parseFloat(e))?"":_(parseFloat(e))).join(", "):isNaN(parseFloat(e.getValue()))?e.getValue():_(parseFloat(e.getValue()))}})}.call(this,t(164))},168:function(e,n,t){var a=t(69);"string"==typeof a&&(a=[[e.i,a,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0},o=t(50)(a,i);a.locals&&(e.exports=a.locals),e.hot.accept(69,function(){var n=t(69);if("string"==typeof n&&(n=[[e.i,n,""]]),!function(e,n){var t,a=0;for(t in e){if(!n||e[t]!==n[t])return!1;a++}for(t in n)a--;return 0===a}(a.locals,n.locals))throw new Error("Aborting CSS HMR due to changed css-modules locals.");o(n)}),e.hot.dispose(function(){o()})},69:function(e,n,t){(e.exports=t(49)(!1)).push([e.i,'body {\n  padding: 5px;\n}\n\n.footerInfo {\n  float: left;\n  color: #555;\n  font-weight: normal;\n}\n\n.xsmall {\n  font-size: 70%;\n}\n\n.small {\n  font-size: 85%;\n}\n\n.large {\n  font-size: 110%;\n}\n\n.xlarge {\n  font-size: 125%;\n}\n\nbutton,\nselect {\n  font-size: 90%;\n  height: 24px;\n  cursor: pointer;\n}\n\ninput[type="text"] {\n  font-size: 90%;\n  height: 18px;\n}\n\n.inline {\n  display: inline-block;\n}\n\n.hidden {\n  display: none;\n}\n\n.labelProfile {\n  color: red;\n  font-weight: 900;\n}\n\n.normal {\n  color: #222;\n  font-weight: normal;\n}\n\n.blink {\n  animation-duration: 1s;\n  animation-name: blinker;\n  animation-direction: linear;\n  animation-iteration-count: infinite;\n}\n\n@keyframes blinker {\n  50% {\n    opacity: 0;\n  }\n}\n\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n\n  100% {\n    transform: rotate(360deg);\n  }\n}\n\n/* table pvt et sweetAlert */\n\n.swal-content {\n  background-color: #E6F5F5;\n  padding: 2px;\n  border: #BED7F5 solid 1px;\n  border-radius: 5px;\n  display: block;\n  margin: 5px;\n  text-align: justify;\n  color: #61534e;\n}\n\n.swal-content h4 {\n  text-align: center;\n}\n\n.swal-button {\n  padding: 2px 5px;\n}\n\n.sweetalert-lg {\n  width: 800px;\n}\n\n.sweetalert-auto {\n  width: auto;\n}\n\n.sweetalert-img {\n  text-align: center;\n  width: 1024px;\n}\n\n.sweetalert-table {\n  text-align: center;\n  width: 1366px;\n}\n\n/*  for create table */\n\ntable.pvtTable {\n  font-size: 8pt;\n  text-align: left;\n  border-collapse: collapse;\n}\n\ntable.pvtTable thead tr th {\n  background-color: #F0F5FE;\n  border: 1px solid #CDCDCD;\n  padding: 2px;\n}\n\ntable.pvtTable thead tr th:first-child {\n  width: auto;\n}\n\ntable.pvtTable tbody tr th {\n  background-color: #F0F5FE;\n  border: 1px solid #CDCDCD;\n  padding: 2px;\n  text-align: left;\n}\n\ntable.pvtTable tbody tr td {\n  color: #3D3D3D;\n  padding: 2px;\n  background-color: #FFF;\n  border: 1px solid #CDCDCD;\n  vertical-align: top;\n}\n\ntable.pvtTable tbody tr td:first-child {\n  width: auto;\n}',""])}},[[163,32,21,12,11,2,16,9,10,13,8,7,20,3,4,6,14,15,18,28,22,1,5,26,30,17,19,23,24,25,27,29,31]]]);