(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{163:function(e,t,n){"use strict";n.r(t),function(e){n(165),n(167),n(168),n(170);var t=n(158),a=n.n(t),i=n(12),o=n.n(i),l=(n(411),n(93)),s=n(159),r=n(160);console.log(lang,locale),document.addEventListener("touchstart",function e(t){document.documentElement.classList.add("can-touch"),document.removeEventListener("touchstart",e,!1)},!1);var u=n(179),d=(n(180),n(294)),c=n(363);const m=Object.assign({},n(20),n(417),n(2),n(416),n(5),n(65),n(415),n(414));var h;l.b.add(s.a,r.a),l.a.watch(),window.addEventListener("load",function(){document.getElementById("main_div").style.display="block"}),console.log(lang,locale);function f(e){return new Promise(function(t,n){var a=new FileReader;a.onload=(a=>{var i=a.target.result;let l,s={};o.a.parse(i,{header:!0,dynamicTyping:!0,skipEmptyLines:!0,chunk:function(a,i){(l=function(e,t){var n;return e.forEach(function(e,a){if(v[v.indexOf(e.trim())],-1===v.indexOf(e.trim())){var i=document.createElement("div"),o=document.createElement("p");e=e&&" "!==e?e:"au moins une colonne ou un entête vide",o.innerHTML="<h4 Fichier concerné:<br><b>"+t.name+"</b><br><br>Entête concerné:<br><b>"+e+"</b></h4><hr>",o.innerHTML+='<h4 style="color:red"> <i class="fa fa-warning"></i><br>entêtes en cours au '+(new Date).toLocaleDateString()+"</h4><br><br>",o.innerHTML+=JSON.stringify(v.map(e=>"["+e+"]").join(", ")),i.appendChild(o),function(e,t,n,a){swal({title:e,text:t,content:n,icon:a,className:"sweetalert-lg"}).then(e=>{setTimeout(()=>window.location.href=window.location.href,10)})}("Contrôle entête de colonnes","Oups! Apparemment, un entête de colonne n'est pas conforme au modèle attendu... ",i,"warning"),n=!1}else n=!0}),n}(a.meta.fields,e))?(s[e.name]=a.data,s.headers=a.meta.fields,t(s)):n("erreur entêtes de colonnes")},complete:function(t){console.log("done! ",e.name,new Date-h+"ms")}})}),a.onprogress=(e=>{}),a.readAsText(e,"UTF-8"),0})}function g(e,t){for(var n,a=[],i=0,o=e.length;i<o;i++)n=e[i][t],a.push(n);return D(a)}fileInput.onchange=function(t){h=new Date,document.getElementById("spinnerLoad-span").classList.replace("hidden","inline"),this.disabled=!0;var n=[...fileInput.files];(n=n.sort(function(e,t){return e=N.test(e.name)?e.name.match(N)[0]:e.name,t=N.test(t.name)?t.name.match(N)[0]:t.name,y[e]-y[t]})).map(e=>e.size).reduce((e,t)=>e+=t);let a=[];for(var i=0,l=n.length;i<l;i++)a.push(f(n[i]));Promise.all(a).then(function(t){let n=[...new Set([].concat(...t.map(e=>e.headers)))];setTimeout(()=>{!function(t,n){document.getElementById("grade_report-div").classList.replace("inline","hidden"),document.getElementById("profil_info-div").classList.replace("hidden","inline"),document.getElementById("spinnerLoad-span").classList.replace("inline","hidden"),function(t,n){return console.log("flatData: "+(new Date-h)+"ms"),new Promise(function(a){var i=[],l=[];t.length>1?t.forEach(e=>{i.push(e[Object.keys(e)[0]].map(t=>(E.test(Object.keys(e)[0])&&(t["filename imported"]=Object.keys(e)[0].match(E)[0].replace(/[\d+_]/g,"").replace(/SPE\-/,"")),t)))}):i.push(t[0][Object.keys(t[0])[0]].map(e=>(E.test(Object.keys(t[0])[0])&&(e["filename imported"]=Object.keys(t[0])[0].match(E)[0].replace(/[\d+_]/g,"").replace(/SPE\-/,"")),e)));var s=[].concat(...i),r={};n.forEach((e,t)=>{r[e]=""});for(var p=0,u=s.length;p<u;p++)l.push(Object.assign({},r,s[p]));var d,c,h,f=function(e,t){document.getElementById("filter-field").value,e.push("fichiers fusionnés");var n=m.csvParse(o.a.unparse(t)),a={};e.forEach((e,t)=>{a[e]=""});for(var i=[],l=m.nest().key(e=>e["Student ID"]).rollup(t=>{var n=t.map(e=>[].concat.call([],Object.values(e)));return n.unshift(e),{arr:n}}).entries(n),s=0,r=l.length;s<r;s++){var p=l[s],u=p.value.arr,d={};e.forEach((e,t)=>{d[e]="Grade"==e||"Enrollment Track"==e||"Enrollment Status"==e||"fichiers fusionnés"==e?g(u.slice(1,u.length),t):[...new Set(g(u.slice(1,u.length),t))]}),i.push(Object.assign({},a,d))}return m.csvParseRows(o.a.unparse(i))}(n,l).sort((e,t)=>e[0]-t[0]);c=(d=f)[0].map(e=>e.trim()),h=[],d.forEach((e,t)=>{0===t||void 0===e[0]||""===e[0]||e[0].match(/^(\r\n|\r|\n)$/)||(e[0]=e[0].trim(),h.push(e))}),h.unshift(c),f=h;var v=function(t){var n=o.a.parse(t).meta.delimiter,i=m.dsvFormat(n).parseRows(t,function(e){if(e&&void 0!==e&&0!==e[0].length)return e}).sort((e,t)=>e[0]-t[0]),l=m.csvParse(o.a.unparse(i));void 0!==i&&function(t){console.time("import");var n=!0;return t[0].slice(0,4).forEach(e=>{-1===F.indexOf(e)&&(n=!1)}),n||swal({title:"Fichier profile_info",text:"Un des champs en entête des 4 premières colonnes ne correspond pas au champs attendus dans l'ordre suivant:\n[id] [username] [name] [email]",icon:"warning"}).then(t=>{document.getElementById("profil_info-div").firstElementChild.classList.replace("normal","labelProfile"),e(".fa-arrow-alt-circle-right").addClass("blink"),document.getElementById("spinnerLoad-span").classList.replace("inline","hidden"),document.getElementById("fileInputMappage").disabled=!1}),n}(i)&&a({flat:f,dataMappage:l})};document.getElementById("fileInputMappage").onchange=function(e){this.disabled=!0,document.getElementById("spinnerLoad-span").classList.replace("hidden","inline"),document.getElementById("profil_info-div").classList.replace("inline","hidden");var t=this.files[0],n=new FileReader;n.onprogress=function(e){},n.onloadend=function(e){},n.onload=function(e){v(n.result)},n.readAsText(t)}})}(t,n).then(function(t){var n=m.csvParse(o.a.unparse(t.flat)),a=t.dataMappage,i=n.map(function(e,t){var n;e.Username&&void 0!==e.Username&&(n=isNaN(e.Username)?e.Username:e.Username.toString());var i=a.find(e=>e.username===n),o=a.find(t=>t.email===e.Email);e.Name=void 0===i||void 0===o?"":i.name;var l=a.find(t=>t.id===e["Student ID"]);return void 0===l?e.Name="Absent sur profile_info":(e.Name=l.name,e.year_of_birth=l.year_of_birth?l.year_of_birth:""),function(e,t){return t.reduce((n,a)=>{t.indexOf(a);return n[a]=e[a],n},{})}(e,v)});setTimeout(()=>{(function(t,n){var a=m.csvParseRows(o.a.unparse(t)),i=a.map(e=>(function(e){for(var t=/(<([^>]+)>)/gi,n=/^[0-9]+([,][0-9]+)?%?$/,a=/^[0-9]+([.][0-9]+)?%?$/,i=[],o=0,l=e.length;o<l;o++)isNaN(Number(e[o]))&&n.test(e[o])&&!a.test(e[o])?e[o]=parseFloat(e[o].replace(/\,/,".")).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2}):"0"===e[o]||" "===e[o]?e[o]="":"Not Attempted"===e[o]||"Not Available"===e[o]?e[o]="":e[o]=e[o].replace(t,""),i.push(e[o]);return i})(e)),l=e("#selectCohortes-btn");l.find("option").remove();for(var s=0,r=b.length;s<r;s++)l.append('<option value="'+b[s]+'">'+b[s]+"</option>");var p=[...new Set(i.map(e=>e[5]))],f=p[0];p=p.slice(1,p.length);var g=document.getElementById("cohortes-btn");g.innerHTML=p.length+' cohortes <i class="fas fa-download"></i>';var F=[i[0].slice(17,32)],v=i.slice(1,i.length).map(e=>e.slice(17,32).map(e=>isNaN(parseFloat(e))?0:parseFloat(e)));i[0].splice(6,0,"Attestation PC"),i[0].splice(7,0,"Attestation PA"),i[0].splice(8,0,"Grade TC"),i[0].splice(10,0,"1ère SPE"),i[0].splice(11,0,"2ème SPE"),i[0].splice(12,0,"SPE validées");for(var x,y,E=0,s=0,r=i.slice(1,i.length).length;s<r;s++){var N=(x=i.slice(1,i.length)[s])[5],w=null!=x[6]?x[6].split(","):"",I=x[16],S=null!=x[33]?x[33].split(","):"",L=null!=x[39]?x[39].split(","):"",T={};S.forEach((e,t)=>{T[L[t]]=e}),"Absent sur profile_info"===x[3]&&E++,y=v[s].filter(e=>e>.695).length;var k=Math.max.apply(null,v[s]),O=k>.695&&-1!==v[s].indexOf(k)?F[0][v[s].indexOf(k)]:"";v[s].length>1&&-1!==v[s].indexOf(k)&&v[s].splice(v[s].indexOf(k),1,0);var j,R,H=Math.max.apply(null,v[s]),G=H>.695&&-1!==v[s].indexOf(H)?F[0][v[s].indexOf(H)]:"";G===O&&(G=""),O=P.test(O)?O.match(P)[0].replace(/\s\-/,""):O,G=P.test(G)?G.match(P)[0].replace(/\s\-/,""):G;var q=""!=w&&+w[0]>=.7&&y>=2,V=""!=w&&+w[0]>=.7&&y>=2&&I>=.7,U="verified"==T.TC&&"verified"==T[O]&&"verified"==T[G],z="verified"!=T.TC||"verified"!=T[O]||"verified"!=T[G];j=q&&U?"OUI":q&&""!=N?"OUI":q&&z?"en attente":"NON",R=V&&U?"OUI":V&&""!=N?"OUI":V&&z?"en attente":"NON",x.splice(6,0,j),x.splice(7,0,R),x.splice(8,0,w[0]),x.splice(10,0,O),x.splice(11,0,G),x.splice(12,0,y)}return setTimeout(()=>{!function(t,n){console.log("start "+(new Date-h)+"ms");var a=t.length>1e3?t.slice(0,1e3):t.slice(0,t.length),i=t.slice(0,t.length).length-a.length,l=t.columns;!function(t){t.forEach(t=>{e("#filter-field").append('<option value="'+t+'" style="max-width:100px;">'+M(t)+"</option>")}),["like","=","<","<=",">",">=","!="].forEach(t=>{e("#filter-type").append('<option value="'+t+'" style="max-width:100px;">'+t+"</option>")})}(l);var s=function(t){var n,a=[];return t.forEach((i,o)=>{n=M(i),i==t[0]?a.push({id:o,title:n,field:i,frozen:!0,headerFilter:"input",cellContext:function(t,n){var a,i,o,l,s,r=Object.entries(n.getRow().getData());a=["entête","valeur"],i=r,o="pvtTable",l=document.createElement("div"),document.createElement("p"),s='<table class="'+o+' tableForSweet" style="margin:5px auto">',s+="<thead><tr>",a.forEach(e=>{s+="<th>"+e+"</th>"}),s+="</tr></thead>",s+="<tbody>",i.forEach(e=>{s+="<tr>",s+="<td>"+e[0]+"</td>",s+="<td>"+e[1]+"</td>",s+="</tr>"}),s+="</tbody></table>",l.appendChild(e.parseHTML(s)[0]),swal({title:"Info participant",text:"",content:l,className:"sweetalert-auto",buttons:{export:"export CSV",annuler:!0}}).then(e=>{switch(e){case"export":i.unshift(a),A(i,"participant_info")}}),t.preventDefault()},headerContext:function(e,t){e.preventDefault(),C(t.getField())}}):i==t[1]?a.push({id:o,title:n,field:i,frozen:!0,width:150,headerFilter:"input",headerContext:function(e,t){e.preventDefault(),C(t.getField())}}):i==t[2]?a.push({id:o,title:n,field:i,visible:!1,headerFilter:"input",headerContext:function(e,t){e.preventDefault(),C(t.getField())}}):i==t[3]||i==t[4]?a.push({id:o,title:n,field:i,width:150,headerFilter:"input",headerContext:function(e,t){e.preventDefault(),C(t.getField())}}):o>12&&o<18?a.push({id:o,title:n,field:i,formatter:"numberfmt",visible:!1,headerFilter:"input",headerContext:function(e,t){e.preventDefault(),C(t.getField())}}):9==o||18==o||8===o?a.push({id:o,title:n,field:i,formatter:"numberfmt",headerFilter:"input",headerContext:function(e,t){e.preventDefault(),C(t.getField())}}):o>18&&o<39?a.push({id:o,title:n,field:i,formatter:"numberfmt",visible:!1,headerFilter:"input",headerContext:function(e,t){e.preventDefault(),C(t.getField())}}):o>39&&o<44?a.push({id:o,title:n,field:i,visible:!1,headerFilter:"input",headerContext:function(e,t){e.preventDefault(),C(t.getField())}}):a.push({id:o,title:n,field:i,headerFilter:"input",headerContext:function(e,t){e.preventDefault(),C(t.getField())}})}),a}(l),r=s.filter(e=>null!=e.visible&&!e.visible).map(e=>e.field),p=new u("#table-app",function(e,t){var n='<div class="footerInfo"> ';return n+='<a type="button" href="https://github.com/olifolkerd/tabulator" target="_blank" style="margin-right: 3em; padding: 2px 5px; font-weight: 900">Tabulator</a>',n+='lignes: <span id="rowsTotal" style="font-weight: 900">'+e.length+"</span>",n+='<span style="margin-left: 1em">colonnes: </span><span id="columnsTotal" style="font-weight: 900">'+t.length+"</span>",n+='<div style="margin-left: 4em;" class="inline">',n+='<span>lignes: </span><span id="rowsCount" style="font-weight: 900"></span> (filtrée.s)',n+='<span style="margin-left: 2em">sélection: </span><span id="rowSelected" style="font-weight: 900"></span> (ligne.s)',n+='<span style="margin-left: 2em">total absence.s: </span><span id="absences" style="font-weight: 900; color:red"></span>',n+='</div><div style="margin-left: 4em;" class="inline">',n+='<span style="margin-left: 2em">groupe.s: </span><span id="groupsNumber" style="font-weight: 900"></span>',n+="</div></div>",{selectable:!0,height:Math.round(window.innerHeight)-50,data:e,reactiveData:!0,tooltipsHeader:!0,columns:t,pagination:"local",paginationSize:50,movableColumns:!0,headerFilterPlaceholder:"...",footerElement:n,history:!0,tooltips:!0,initialSort:[{column:"Student ID",dir:"asc"}],rowClick:function(e,t){},rowSelectionChanged:function(e,t){document.getElementById("rowSelected").innerHTML=e.length},dataFiltered:function(e,t){document.getElementById("rowsCount").innerHTML=t.length},groupStartOpen:function(e,t,n,a){return!1},groupHeader:function(e,t,n,a){var i=document.getElementById("groupBy-input").value;return 0==a.getSubGroups().length?"<span style='color:#0000FFFF; margin-right: 5px;' title='clic droit pour export'>"+i+"</span> : "+e+"<span style='color:#d00; margin-left:10px;'>("+t+" item)</span>":"<span style='color:#0000FFFF; margin-right: 5px;'>"+i+"</span> : "+e+"<span style='color:#d00; margin-left:10px;'>("+t+" item)</span>"},groupContext:function(e,t){e.preventDefault();var n=document.getElementById("groupBy-input").value;n=n.split(">").map(e=>e.trim());var a=[],i=t.getSubGroups(),l=t.getElement();if(0==i.length){t.getRows().forEach(e=>{a.push(e.getData())});var s=t.getKey();A(a=m.csvParseRows(o.a.unparse(a)),n.join("_")+"_"+s)}else l.classList.add("shaker"),setTimeout(()=>{l.classList.remove("shaker")},400)}}}(a,s));function f(){var t=e("#filter-field").val();"function"==e("#filter-field").val()?(e("#filter-type").prop("disabled",!0),e("#filter-value").prop("disabled",!0)):(e("#filter-type").prop("disabled",!1),e("#filter-value").prop("disabled",!1)),p.setFilter(t,e("#filter-type").val(),e("#filter-value").val())}console.log("tabulator "+(new Date-h)+"ms"),function(e,t,n,a){n>1e3?setTimeout(()=>{e.replaceData(t).then(function(){document.getElementById("rowsTotal").innerHTML=t.length,console.log("replaceData done!"),console.log("replaceData "+(new Date-h)+"ms"),document.getElementById("spinnerLoad-span").classList.replace("inline","hidden"),document.getElementById("profil_info-div").classList.replace("inline","hidden")}).catch(function(e){console.log(e)})},a):(console.log("replaceData "+(new Date-h)+"ms"),document.getElementById("spinnerLoad-span").classList.replace("inline","hidden"),document.getElementById("profil_info-div").classList.replace("inline","hidden"))}(p,t,i,1e3),e("#filter-field, #filter-type").change(f),e("#filter-value").keyup(f),e("#filter-clear").click(function(){e("#filter-field").val("Student ID"),e("#filter-type").val("like"),e("#filter-value").val(""),p.clearFilter()}),document.getElementById("groupBy-btn").onclick=function(e){var t=document.getElementById("groupBy-input").value,n=[];if(t){var n=d.compact(t.split(/[\;\,\>]+/));(n=n.map(e=>c.trim(e)).filter(e=>-1!=l.indexOf(e))).length>0&&(p.setGroupBy(n),this.innerHTML='<i class="fas fa-lock"></i>')}},document.getElementById("groupBy-btn").onmouseover=function(e){var t=document.getElementById("groupBy-input").value?"grouper par: "+document.getElementById("groupBy-input").value:"grouper par entête";e.target.title=t},document.getElementById("degroupBy-btn").onclick=function(e){document.getElementById("groupBy-input").value="",p.setGroupBy(""),document.getElementById("groupBy-btn").innerHTML='<i class="fas fa-lock-open"></i>',document.getElementById("groupBy-btn").title="grouper par entête"},document.getElementById("hide-col").onclick=function(){let e=document.getElementById("filter-field").value;p.hideColumn(e)},document.getElementById("show-col").onclick=function(){let e=document.getElementById("filter-field").value;p.showColumn(e)},document.getElementById("showAll-coll").onclick=function(){document.getElementById("spinnerLoad-span").classList.replace("hidden","inline"),setTimeout(()=>{l.forEach(e=>{p.showColumn(e)}),document.getElementById("spinnerLoad-span").classList.replace("inline","hidden")},10)},document.getElementById("hideAll-coll").onclick=function(){document.getElementById("spinnerLoad-span").classList.replace("hidden","inline"),setTimeout(()=>{r.forEach(e=>{p.hideColumn(e)}),document.getElementById("spinnerLoad-span").classList.replace("inline","hidden")},10)},e("#deselectAll-rows").click(function(){p.deselectRow()}),document.getElementById("exportCSV-btn").onclick=function(e){p.download("csv","export-grades.csv",{delimiter:","})},setTimeout(()=>{n>0&&(document.getElementById("absences").innerHTML=n)},10)}(m.csvParse(o.a.unparse(i)),E)},100),document.getElementById("finalStandard-btn").onclick=function(e){!function(e,t){document.getElementById("spinnerLoad-span").classList.replace("hidden","inline");for(var n,a,i,o=[e[0].slice(17,32)],l=e.slice(1,e.length).sort(function(e,t){return e[0]-t[0]}),s=/^[0-9]+([.][0-9]+)?%?$/,r=([].concat.apply([],l.map(function(e){return e.filter(function(e){return s.test(e)&&(t=e.valueOf())-Math.floor(t)!=0&&Number.isInteger(parseInt(e));var t})})),l.map(e=>e.slice(17,32).map(e=>isNaN(parseFloat(e))?0:parseFloat(e)))),p=l.map(e=>e.slice(7,11).map(e=>isNaN(parseFloat(e))?0:parseFloat(e))),u=l.map(e=>e.slice(12,13).map(e=>isNaN(parseFloat(e))?0:parseFloat(e))),d=l.map(e=>e.slice(13,16).map(e=>isNaN(parseFloat(e))?0:parseFloat(e))),c=0,h=l.length;c<h;c++){n=l[c][3],a=l[c][5],i=r[c].filter(e=>e>.695).length;var f=Math.max.apply(null,r[c]),g=f>.695&&-1!==r[c].indexOf(f)?o[0][r[c].indexOf(f)]:"";r[c].length>1&&-1!==r[c].indexOf(f)&&r[c].splice(r[c].indexOf(f),1,0);var F=Math.max.apply(null,r[c]),v=F>.695&&-1!==r[c].indexOf(F)?o[0][r[c].indexOf(F)]:"";v===g&&(v=""),g=P.test(g)?g.match(P)[0].replace(/\s\-/,""):g,v=P.test(v)?v.match(P)[0].replace(/\s\-/,""):v;var b=t.find(e=>e.id===l[c][0]);b=b&&void 0!==b?b.email:"",l[c].splice(2,1,n),l[c].splice(3,1,b),l[c].splice(4,1,a),m.sum(p[c])/4>.695&&u[c][0]>.695&&i>=2?l[c].splice(5,1,"OUI"):l[c].splice(5,1,"NON"),(m.sum(p[c])+m.sum(d[c]))/7>.695&&u[c][0]>.695&&i>=2?l[c].splice(6,1,"OUI"):l[c].splice(6,1,"NON"),isNaN(parseFloat(l[c][7]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][7]).toFixed(2))),isNaN(parseFloat(l[c][7]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][7]/5).toFixed(2))),isNaN(parseFloat(l[c][8]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][7]).toFixed(2))),isNaN(parseFloat(l[c][8]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][8]/5).toFixed(2))),isNaN(parseFloat(l[c][9]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][9]).toFixed(2))),isNaN(parseFloat(l[c][9]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][9]/5).toFixed(2))),isNaN(parseFloat(l[c][10]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][10]).toFixed(2))),isNaN(parseFloat(l[c][10]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][10]/5).toFixed(2))),isNaN(parseFloat(l[c][12]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][12]).toFixed(2))),isNaN(parseFloat(l[c][12]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][12]/5).toFixed(2))),isNaN(parseFloat(l[c][13]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][13]).toFixed(2))),isNaN(parseFloat(l[c][13]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][13]/5).toFixed(2))),isNaN(parseFloat(l[c][14]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][14]).toFixed(2))),isNaN(parseFloat(l[c][14]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][14]/5).toFixed(2))),isNaN(parseFloat(l[c][15]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][15]).toFixed(2))),isNaN(parseFloat(l[c][15]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][15]/5).toFixed(2))),isNaN(parseFloat(l[c][17]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][17]).toFixed(2))),isNaN(parseFloat(l[c][17]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][17]/5).toFixed(2))),isNaN(parseFloat(l[c][18]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][18]).toFixed(2))),isNaN(parseFloat(l[c][18]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][18]/5).toFixed(2))),isNaN(parseFloat(l[c][19]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][19]).toFixed(2))),isNaN(parseFloat(l[c][19]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][19]/5).toFixed(2))),isNaN(parseFloat(l[c][20]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][20]).toFixed(2))),isNaN(parseFloat(l[c][20]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][20]/5).toFixed(2))),isNaN(parseFloat(l[c][21]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][21]).toFixed(2))),isNaN(parseFloat(l[c][21]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][21]/5).toFixed(2))),isNaN(parseFloat(l[c][22]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][22]).toFixed(2))),isNaN(parseFloat(l[c][22]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][22]/5).toFixed(2))),isNaN(parseFloat(l[c][23]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][23]).toFixed(2))),isNaN(parseFloat(l[c][23]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][23]/5).toFixed(2))),isNaN(parseFloat(l[c][24]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][24]).toFixed(2))),isNaN(parseFloat(l[c][24]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][24]/5).toFixed(2))),isNaN(parseFloat(l[c][25]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][25]).toFixed(2))),isNaN(parseFloat(l[c][25]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][25]/5).toFixed(2))),isNaN(parseFloat(l[c][26]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][26]).toFixed(2))),isNaN(parseFloat(l[c][26]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][26]/5).toFixed(2))),isNaN(parseFloat(l[c][27]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][27]).toFixed(2))),isNaN(parseFloat(l[c][27]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][27]/5).toFixed(2))),isNaN(parseFloat(l[c][28]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][28]).toFixed(2))),isNaN(parseFloat(l[c][28]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][28]/5).toFixed(2))),isNaN(parseFloat(l[c][29]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][29]).toFixed(2))),isNaN(parseFloat(l[c][29]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][29]/5).toFixed(2))),isNaN(parseFloat(l[c][30]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][30]).toFixed(2))),isNaN(parseFloat(l[c][30]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][30]/5).toFixed(2))),isNaN(parseFloat(l[c][31]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][31]).toFixed(2))),isNaN(parseFloat(l[c][31]))?l[c].push(""):l[c].push(B(parseFloat(100*l[c][31]/5).toFixed(2))),l[c].splice(7,33),i?l[c].push(i.toFixed(0)):l[c].push(""),l[c].push(g),l[c].push(v),i&&i>=2?l[c].push(""):l[c].push("< 2"),m.sum(p[c])/4>.695?l[c].push(""):l[c].push("< 70%"),u[c][0]>.695?l[c].push(""):l[c].push("< 70%"),(m.sum(p[c])+m.sum(d[c]))/7>.695?l[c].push(""):l[c].push("< 70%"),3===d[c].filter(e=>0!==e).length?l[c].push(""):l[c].push("< 3")}e.splice(0,1);var x=e;x.unshift(["Student ID","Email","Étudiant","Mail d'inscription","Cohorte","Classique","Avancé","S1 (%)","S1 (/20)","S2 (%)","S2 (/20)","S3 (%)","S3 (/20)","S4 (%)","S4 (/20)","Examen Final (%)"," Examen Final (/20)","Devoir 1 (%)","Devoir 1 (/20)","Devoir 2 (%)","Devoir 2 (/20)","Devoir 3 (%)","Devoir 3 (/20)","Diagnostic de Fonctionnement Système\n01 - DFS (%)","Diagnostic de Fonctionnement Système\n01 - DFS (/20)","Management Créativité & Brainstorming\n02 - MCB (%)","Management Créativité & Brainstorming\n02 - MCB (/20)","Management d'Équipe-Projet\n03 - MEP (%)","Management d'Équipe-Projet\n03 - MEP (/20)","Outils Informatiques & Évaluation Financière\n04 - IEF (%)","Outils Informatiques & Évaluation Financière\n04 - IEF (/20)","Certification professionnelle PMI®\n05 - PMI (%)","Certification professionnelle PMI®\n05 - PMI (/20)","Analyse Fonctionnelle\n06 - AF (%)","Analyse Fonctionnelle\n06 - AF (/20)","Analyse Stratégique\n07 - AS (%)","Analyse Stratégique\n07 - AS (/20)","Évaluation d'Impact des Projets\n08 - EIP (%)","Évaluation d'Impact des Projets\n08 - EIP (/20)","Planification Avancée\n09 - PAV (%)","Planification Avancée\n09 - PAV (/20)","Management Visuel de Projet\n10 - MVP (%)","Management Visuel de Projet\n10 - MVP (/20)","Gestion de Projet Agile avec Scrum\n11 - GPAS (%)","Gestion de Projet Agile avec Scrum\n11 - GPAS (/20)","Méthode de Résolution de Problèmes\n12 - MRP (%)","Méthode de Résolution de Problèmes\n12 - MRP (/20)","Résolution Créative de Problèmes : TRIZ\n13 - TRIZ (%)","Résolution Créative de Problèmes : TRIZ\n13 - TRIZ (/20)","Gestion De Crise\n14 - G2C (%)","Gestion De Crise\n14 - G2C (/20)","Action Entrepreneuriale\n15 - PAE (%)","Action Entrepreneuriale\n15 - PAE (/20)","Nombre\nmodules réussis","Meilleur\nmodule réussi 1","Meilleur\nmodule réussi 2","Causes Échec\n(PC & PA) Modules","Causes Échec\n(PC ) Moyenne Quiz","Causes Échec\n(PC & PA) Examen final","Causes Échec\n(PA) Moyenne Quiz & Devoirs","Causes Échec\n(PA) Devoirs"]),setTimeout(()=>{A(x,"final-standard"),document.getElementById("spinnerLoad-span").classList.replace("inline","hidden")},100)}(a,n)},g.onclick=function(e){var t=document.getElementById("selectCohortes-btn").value,n=function(e,t,n){var a=m.nest().key(e=>e[n]).rollup(e=>{var n=e.map(e=>isNaN(parseFloat(e[t]))?0:Math.round(100*parseFloat(e[t]))/100);n.sort();var a=D(n),i=a.length>=1?parseFloat(m.median(a)):0,o=a.length>=1?parseFloat(m.min(a)):0,l=a.length>=1?parseFloat(m.max(a)):0,s=a.length>=1?parseFloat(m.mean(a)):0,r=a.length>1?parseFloat(m.quantile(a,.25)):0,p=a.length>1?parseFloat(m.quantile(a,.75)):0,u=a.length>1?parseFloat(m.quantile(a,.1)):0,d=a.length>1?parseFloat(m.quantile(a,.9)):0,c=a.length>1?parseFloat(m.variance(a)):0,h=a.length>1?parseFloat(m.deviation(a)):0;return{gradesFull:n.length,grades:a.length,min:0!==o?o.toFixed(2):"",max:0!==l?l.toFixed(2):"",avg:0!==s?s.toFixed(2):"",median:0!==i?i.toFixed(2):"",quartileFirst:0!==r?r.toFixed(2):"",quartileThird:0!==p?p.toFixed(2):"",decileFirst:0!==u?u.toFixed(2):"",decileLast:0!==d?d.toFixed(2):"",variance:0!==c?c.toFixed(2):"",deviation:0!==h?h.toFixed(2):""}}).entries(e),i=[["cohorte","participants","actifs","min","max","moyenne","médiane","1er quartile","3ème quartile","1er décile","9ème décile","variance","écart-type"]];return a.forEach(e=>{var t=e.key,n=e.value;n.grades,i.push([t,n.gradesFull,n.grades,n.min,n.max,n.avg,n.median,n.quartileFirst,n.quartileThird,n.decileFirst,n.decileLast,n.variance,n.deviation])}),i}(m.csvParse(o.a.unparse(i)),t,f);console.log(n),setTimeout(()=>{_("cohortes (détails)",n,this,t)},100)},console.log("globalReport end "+(new Date-h)+"ms"),!0})(i,a)&&console.log("tabulator launch !"+(new Date-h)+"ms")},10)}).catch(function(e){console.log(e),swal({title:"Information error",text:e.toString(),icon:"warning"})})}(t,n)},10)}).catch(function(e){console.log(e),swal({title:"Information erreur",text:"Oups! "+e,icon:"warning"}).then(e=>{setTimeout(()=>window.location.href=window.location.href,10)})}),console.log("timeProcess: "+(new Date-h)+"ms")};const F=["id","username","name","email"],v=["Student ID","Email","year_of_birth","Name","Username","Cohort Name","Grade","Évaluation Hebdo 1: Évaluation (notée)","Évaluation Hebdo 2: Évaluation (notée)","Évaluation Hebdo 3: Évaluation (notée)","Évaluation Hebdo 4: Évaluation (notée)","Évaluation Hebdo (Avg)","Examen Final","Livrables 1: Carte Conceptuelle - (Semaine 1)","Livrables 2: Compte-rendu - (Semaine 2)","Livrables 3: Planification - (Semaine 3)","Livrables (Avg)","DFS - Diagnostic de Fonctionnement d'un Système","MCB - Management de la Créativité et Brainstorming","MEP - Management d'Équipe Projet","IEF - Les outils informatiques & Évaluer financièrement les projets","PMI - Certifications professionnelles PMI®","AF - Analyse Fonctionnelle","AS - Analyse Stratégique dans les Projets","EIP - Évaluation d'Impact des Projets","PAV - Planification Avancée","MVP - Management Visuel de Projet","GPAS - Gestion de projet agile avec Scrum","MRP - Outils et Méthodologie de Résolution de Problème","TRIZ - Introduction aux principaux outils de TRIZ","G2C - Gestion de crise","PAE - Du Projet à l'Action Entrepreneuriale","Pre MOOC","Enrollment Track","Verification Status","Certificate Eligible","Certificate Delivered","Certificate Type","Enrollment Status","fichiers fusionnés"],b=["Grade","Évaluation Hebdo 1: Évaluation (notée)","Évaluation Hebdo 2: Évaluation (notée)","Évaluation Hebdo 3: Évaluation (notée)","Évaluation Hebdo 4: Évaluation (notée)","Évaluation Hebdo (Avg)","Examen Final","Livrables 1: Carte Conceptuelle - (Semaine 1)","Livrables 2: Compte-rendu - (Semaine 2)","Livrables 3: Planification - (Semaine 3)","Livrables (Avg)","DFS - Diagnostic de Fonctionnement d'un Système","MCB - Management de la Créativité et Brainstorming","MEP - Management d'Équipe Projet","IEF - Les outils informatiques & Évaluer financièrement les projets","PMI - Certifications professionnelles PMI®","AF - Analyse Fonctionnelle","AS - Analyse Stratégique dans les Projets","EIP - Évaluation d'Impact des Projets","PAV - Planification Avancée","MVP - Management Visuel de Projet","GPAS - Gestion de projet agile avec Scrum","MRP - Outils et Méthodologie de Résolution de Problème","TRIZ - Introduction aux principaux outils de TRIZ","G2C - Gestion de crise","PAE - Du Projet à l'Action Entrepreneuriale","Pre MOOC"],x={};v.forEach(e=>{x[e]=""});const y={"-TC_":1,"_SPE-DFS_":2,"_SPE-MCB_":3,"_SPE-MEP_":4,"_SPE-IEF_":5,"_SPE-PMI_":6,"_SPE-AF_":7,"_SPE-AS_":8,"_SPE-EIP_":9,"_SPE-PAV_":10,"_SPE-MVP_":11,"_SPE-GPAS_":12,"_SPE-MRP_":13,"_SPE-TRIZ_":14,"_SPE-G2C_":15,"_SPE-PAE_":16,"-PA_":17},E=/(SPE-\w{2,4}|PA_\d{2}|TC_\d{2})_/,N=/(_SPE-\w{2,4}|\-PA|\-TC)_/,P=/\b[A-Z0-9]{2,4}\b\s\-/,w=/^Évaluation Hebdo [1|2|3|4]\:/,I=/^Livrables [1|2|3]\:/,S=(m.format(".2f"),m.format(".0%"));function C(e){var t=document.getElementById("groupBy-input").value?document.getElementById("groupBy-input").value+" > "+e:e;document.getElementById("groupBy-input").value=t.replace(/^[\s\>]/,"")}function M(e){return P.test(e)?e.match(P)[0].replace(/\s\-/,""):w.test(e)?e.match(w)[0].replace(/\:/,""):I.test(e)?e.match(I)[0].replace(/\:/,""):e}function B(e){return isNaN(parseFloat(e))?e:parseFloat(e).toLocaleString("fr-FR")}function D(e){for(var t=-1,n=e?e.length:0,a=-1,i=[];++t<n;){var o=e[t];o&&(i[++a]=o)}return i}function A(e,t){var n=o.a.unparse(e),i=new Blob(["\ufeff"+n],{type:"text/csv;charset=utf-8"});a()(i,t+".csv")}function L(e,t,n,a,i){swal({title:e,text:t,content:n,icon:a,className:i}).then(e=>{})}function T(t,n,a,i){var o,l=document.createElement("div"),s=(document.createElement("p"),i),r='<table class="'+a+' tableForSweet" style="margin:5px auto">';return r+="<thead><tr>",n.forEach(e=>{r+="<th>"+e+"</th>"}),r+="</tr></thead>",r+="<tbody>",t.forEach(e=>{r+="<tr>",e.forEach(e=>{r+="<td>"+e+"</td>"}),r+="</tr>"}),r+="</tbody></table>",l.appendChild(e.parseHTML(r)[0]),swal({title:s,text:void 0,content:l,className:"sweetalert-auto",buttons:{export:"export CSV",annuler:!0}}).then(e=>{switch(e){case"export":(o=t.map(e=>e.map(e=>B(e)))).unshift(n),A(o,s)}}),!0}u.prototype.extendModule("format","formatters",{numberfmt:function(e,t){return/\,/g.test(e.getValue())?e.getValue().split(",").map(e=>isNaN(parseFloat(e))?"":S(parseFloat(e))).join(", "):isNaN(parseFloat(e.getValue()))?e.getValue():S(parseFloat(e.getValue()))}});var _=function(e,t,n,a){var i;if(t.length>1&&2===t[0].length){i=t.length-1+" "+e;T(t.slice(1,t.length),t[0],"pvtTable",i)}else if(t.length>1&&t[0].length>=9){i=t.length-1+" "+e+" => "+a;T(t.slice(1,t.length),t[0],"pvtTable",i)}else p.innerHTML="",html.appendChild(p),i="0 "+e+' trouvé (recherche par "Student ID")',L(title,i,html,"success",i)}}.call(this,n(164))},168:function(e,t,n){var a=n(69);"string"==typeof a&&(a=[[e.i,a,""]]);var i={hmr:!0,transform:void 0,insertInto:void 0},o=n(50)(a,i);a.locals&&(e.exports=a.locals),e.hot.accept(69,function(){var t=n(69);if("string"==typeof t&&(t=[[e.i,t,""]]),!function(e,t){var n,a=0;for(n in e){if(!t||e[n]!==t[n])return!1;a++}for(n in t)a--;return 0===a}(a.locals,t.locals))throw new Error("Aborting CSS HMR due to changed css-modules locals.");o(t)}),e.hot.dispose(function(){o()})},69:function(e,t,n){(t=e.exports=n(42)(!1)).i(n(169),""),t.push([e.i,"body {\n  padding: 5px;\n}\n\n.footerInfo {\n  float: left;\n  color: #555;\n  font-weight: normal;\n}\n\n.mainButton {\n  background: linear-gradient(to bottom, rgb(128,128,128)0%, rgb(16,16,16) 100%);\n}\n\n.tabulator-page {\n  color: #555 !important;\n}\n\n.large {\n  font-size: 1.5em;\n}\n\n.medium {\n  font-size: 1em;\n}\n\n.small {\n  font-size: .70em;\n}\n\n.labelFileInput {\n  cursor: pointer;\n}\n\n#fileInput,\n#fileInputMappage {\n  opacity: 0;\n  position: absolute;\n  z-index: -1;\n}\n\n.inline {\n  display: inline-block;\n}\n\n.hidden {\n  display: none;\n}\n\nlabel {\n  white-space: nowrap;\n  margin-right: .5em;\n  padding: 2px\n}\n\n.labelProfile {\n  color: red;\n  font-weight: 900;\n}\n\n.normal {\n  color: #222;\n  font-weight: normal;\n}\n\n.blink {\n  animation-duration: 1s;\n  animation-name: blinker;\n  animation-direction: linear;\n  animation-iteration-count: infinite;\n}\n\n@keyframes blinker {\n  50% {\n      opacity: 0;\n  }\n}\n\n@keyframes spin {\n  0% {\n      transform: rotate(0deg);\n  }\n\n  100% {\n      transform: rotate(360deg);\n  }\n}\n\n.shaker {\n  animation: shake 0.75s cubic-bezier(.36, .07, .19, .97) both;\n  background-color: #FFE5E4;\n}\n\n@keyframes shake {\n\n  10%,\n  90% {\n      transform: translate3d(-1px, 0, 0);\n  }\n\n  20%,\n  80% {\n      transform: translate3d(2px, 0, 0);\n  }\n\n  30%,\n  50%,\n  70% {\n      transform: translate3d(-4px, 0, 0);\n  }\n\n  40%,\n  60% {\n      transform: translate3d(4px, 0, 0);\n  }\n}\n\n/* table pvt et sweetAlert */\n\n.swal-content {\n  background-color: #E6F5F5;\n  padding: 2px;\n  border: #BED7F5 solid 1px;\n  border-radius: 5px;\n  display: block;\n  margin: 5px;\n  text-align: justify;\n  color: #61534e;\n}\n\n.swal-content h4 {\n  text-align: center;\n}\n\n.swal-button {\n  padding: 2px 5px;\n}\n\n.sweetalert-lg {\n  width: 800px;\n}\n\n.sweetalert-auto {\n  width: auto;\n}\n\n.sweetalert-img {\n  text-align: center;\n  width: 1024px;\n}\n\n.sweetalert-table {\n  text-align: center;\n  width: 1366px;\n}\n\n/*  for create table */\n\ntable.pvtTable {\n  font-size: 8pt;\n  text-align: left;\n  border-collapse: collapse;\n}\n\ntable.pvtTable thead tr th {\n  background-color: #F0F5FE;\n  color: #555;\n  border: 1px solid #CDCDCD;\n  padding: 2px;\n}\n\ntable.pvtTable thead tr th:first-child {\n  width: auto;\n}\n\ntable.pvtTable tbody tr th {\n  background-color: #F0F5FE;\n  color: #555;\n  border: 1px solid #CDCDCD;\n  padding: 2px;\n  text-align: left;\n}\n\ntable.pvtTable tbody tr td {\n  color: #3D3D3D;\n  padding: 2px;\n  background-color: #FFF;\n  border: 1px solid #CDCDCD;\n  vertical-align: top;\n}\n\ntable.pvtTable tbody tr td:first-child {\n  width: auto;\n}\n",""])}},[[163,33,21,12,11,2,16,9,10,13,8,7,20,3,4,6,14,15,18,29,22,1,5,27,31,24,17,19,23,25,26,28,30,32]]]);