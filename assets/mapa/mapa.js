(async () => {

const response = await fetch('assets/mapa/locais.json');
if (!response.ok) throw new Error('Falha ao carregar os locais');
const DATA = await response.json();

const map = L.map("map", {zoomControl:true, minZoom:3}).setView([-14.2,-51.9],4);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom:19,
  attribution:'&copy; OpenStreetMap contributors'
}).addTo(map);

const cluster = L.markerClusterGroup({
  showCoverageOnHover:false,
  maxClusterRadius:50,
  spiderfyOnMaxZoom:true
});
map.addLayer(cluster);

const els = {
 search:document.getElementById("search"),
 uf:document.getElementById("uf"),
 regional:document.getElementById("regional"),
 results:document.getElementById("results"),
 resultCount:document.getElementById("resultCount"),
 sidebar:document.getElementById("sidebar"),
 mobileOpen:document.getElementById("mobileOpen"),
 mobileClose:document.getElementById("mobileClose"),
 mobileBackdrop:document.getElementById("mobileBackdrop")
};

function isMobileLayout() {
 return window.matchMedia("(max-width:850px)").matches;
}

function setMobileMenu(open) {
 els.sidebar.classList.toggle("open", open);
 document.querySelector(".national-map-app").classList.toggle("menu-open", open);
 els.mobileOpen.setAttribute("aria-expanded", String(open));
 if (isMobileLayout()) els.sidebar.inert = !open;
 if (!open && isMobileLayout()) els.mobileOpen.focus();
 setTimeout(()=>map.invalidateSize(), 220);
}

function esc(s) {
 return String(s??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
}

function pinIcon(tipo) {
 if(tipo==="QG" || tipo==="Regional" || tipo==="Divisão"){
   const cls = tipo==="QG" ? "map-pin-qg" : tipo==="Regional" ? "map-pin-regional" : "map-pin-divisao";
   const size = tipo==="Divisão" ? 20 : 24;
   return L.divIcon({
     className:"",
     html:`<div class="map-pin ${cls}"></div>`,
     iconSize:[size,size],
     iconAnchor:[size/2,size],
     popupAnchor:[0,-size]
   });
 }
 const bg = "#4a4a55";
 const size = 11;
 return L.divIcon({
   className:"",
   html:`<div class="custom-pin" style="width:${size}px;height:${size}px;background:${bg}"></div>`,
   iconSize:[size,size],
   iconAnchor:[size/2,size/2]
 });
}

const markerByIndex = new Map();

function populateFilters() {
 const ufs = [...new Set(DATA.map(x=>x.uf).filter(Boolean))].sort();
 ufs.forEach(u=>els.uf.insertAdjacentHTML("beforeend",`<option>${esc(u)}</option>`));
 populateRegionalOptions();
}

function populateRegionalOptions() {
 const selectedUf = els.uf.value;
 const currentRegional = els.regional.value;
 const regs = [...new Set(DATA.filter(x=>
   x.tipo==="Regional" &&
   (!selectedUf || x.uf===selectedUf)
 ).map(x=>x.nome).filter(Boolean))].sort((a,b)=>a.localeCompare(b,"pt-BR"));

 els.regional.innerHTML = `<option value="">Todas</option>`;
 regs.forEach(r=>els.regional.insertAdjacentHTML("beforeend",`<option value="${esc(r)}">${esc(r)}</option>`));

 if(regs.includes(currentRegional)){
   els.regional.value = currentRegional;
 } else {
   els.regional.value = "";
 }
}

function selectedTypes() {
 return new Set([...document.querySelectorAll(".typeCheck:checked")].map(x=>x.value));
}

function getFiltered() {
 const q=els.search.value.trim().toLocaleLowerCase("pt-BR");
 const uf=els.uf.value;
 const reg=els.regional.value;
 const types=selectedTypes();

 return DATA.map((x,i)=>({...x,_i:i})).filter(x=>{
   const hay=`${x.nome} ${x.uf} ${x.regional}`.toLocaleLowerCase("pt-BR");
   return (!q || hay.includes(q)) &&
          (!uf || x.uf===uf) &&
          (!reg || x.regional===reg || x.nome===reg) &&
          types.has(x.tipo);
 });
}

function markerPopup(x) {
 const inferred = x.uf_inferida ? " <small>(inferida)</small>" : "";
 const regional = x.regional && x.regional!==x.nome ? `<div class="popup-row"><b>Regional:</b> ${esc(x.regional)}</div>` : "";
 const routeUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${x.lat},${x.lng}`)}&travelmode=driving`;
 const shareText = [
   `${x.nome}`,
   `${x.tipo}${x.uf ? ` - ${x.uf}` : ""}`,
   x.regional && x.regional!==x.nome ? `Regional: ${x.regional}` : "",
   `Coordenadas: ${x.lat}, ${x.lng}`,
   `Rota no Google Maps: ${routeUrl}`
 ].filter(Boolean).join("\n");
 return `
   <div class="popup-title">${esc(x.nome)}</div>
   <div class="popup-type">${esc(x.tipo)}</div>
   <div class="popup-row"><b>UF:</b> ${esc(x.uf||"Não informada")}${inferred}</div>
   ${regional}
   <div class="popup-row"><b>Coordenadas:</b> ${x.lat}, ${x.lng}</div>
   <button class="popup-share" type="button" data-title="${esc(x.nome)}" data-text="${esc(shareText)}" data-url="${esc(routeUrl)}">Compartilhar</button>`;
}

function render(fit=false) {
 const filtered=getFiltered();
 cluster.clearLayers();
 markerByIndex.clear();

 const markers=[];
 filtered.forEach(x=>{
   if(!Number.isFinite(Number(x.lat)) || !Number.isFinite(Number(x.lng))) return;
   const m=L.marker([Number(x.lat),Number(x.lng)],{icon:pinIcon(x.tipo),title:x.nome});
   m.bindPopup(markerPopup(x),{maxWidth:330});
   cluster.addLayer(m);
   markerByIndex.set(x._i,m);
   markers.push(m);
 });

 els.resultCount.textContent=filtered.length;
 document.getElementById("sTotal").textContent=filtered.length;
 document.getElementById("sRegionais").textContent=filtered.filter(x=>x.tipo==="Regional").length;
 document.getElementById("sDivisoes").textContent=filtered.filter(x=>x.tipo==="Divisão").length;
 document.getElementById("sUFs").textContent=new Set(filtered.map(x=>x.uf).filter(Boolean)).size;

 const list=filtered.slice(0,250);
 els.results.innerHTML=list.map(x=>`
   <button type="button" class="map-card" data-i="${x._i}">
     <div class="name">${esc(x.nome)}</div>
     <div class="map-meta"><span>${esc(x.tipo)}</span><span>${esc(x.uf||"UF não informada")}</span></div>
   </button>`).join("") + (filtered.length>250 ? `<div class="map-meta" style="padding:10px">Exibindo os primeiros 250 resultados na lista. Todos os ${filtered.length} pontos continuam no mapa.</div>` : "");

 if (!filtered.length) els.results.innerHTML = '<p class="empty-results">Nenhum local encontrado.</p>';
 if(fit && markers.length){
   const g=L.featureGroup(markers);
   map.fitBounds(g.getBounds().pad(.05),{maxZoom:10});
 }
}

els.results.addEventListener("click",e=>{
 const card=e.target.closest(".map-card");
 if(!card)return;
 const idx=Number(card.dataset.i);
 const marker=markerByIndex.get(idx);
 if(marker){
   const latlng=marker.getLatLng();
   map.setView(latlng,Math.max(map.getZoom(),13),{animate:true});
   cluster.zoomToShowLayer(marker,()=>marker.openPopup());
 }
 if(isMobileLayout()) setMobileMenu(false);
});

document.addEventListener("click",async e=>{
 const button=e.target.closest(".popup-share");
 if(!button)return;

 const title=button.dataset.title || "Insanos MC - Mapa Nacional";
 const text=button.dataset.text || "";
 const url=button.dataset.url || "";
 const payload={title,text,url};

 if(isMobileLayout() && navigator.share){
   try{
     await navigator.share(payload);
     return;
   }catch(err){
     if(err && err.name==="AbortError") return;
   }
 }

 const fallbackText=text || url;
 try{
   await navigator.clipboard.writeText(fallbackText);
   const original=button.textContent;
   button.textContent="Informativo copiado";
   setTimeout(()=>button.textContent=original,1800);
 }catch(err){
   window.open(`https://wa.me/?text=${encodeURIComponent(fallbackText)}`,"_blank","noopener");
 }
});

els.search.addEventListener("input",()=>render(false));
els.uf.addEventListener("change",()=>{
 populateRegionalOptions();
 render(false);
});
els.regional.addEventListener("change",()=>render(false));
document.querySelectorAll(".typeCheck").forEach(el=>el.addEventListener("change",()=>render(false)));

document.getElementById("reset").addEventListener("click",()=>{
 els.search.value=""; els.uf.value=""; els.regional.value="";
 populateRegionalOptions();
 document.querySelectorAll(".typeCheck").forEach(x=>x.checked=true);
 render(true);
});
document.getElementById("fit").addEventListener("click",()=>render(true));
els.mobileOpen.addEventListener("click",()=>setMobileMenu(true));
els.mobileClose.addEventListener("click",()=>setMobileMenu(false));
els.mobileBackdrop.addEventListener("click",()=>setMobileMenu(false));
document.addEventListener("keydown",e=>{
 if(e.key==="Escape" && els.sidebar.classList.contains("open")) setMobileMenu(false);
});
window.addEventListener("resize",()=>{
 if(!isMobileLayout()) { setMobileMenu(false); els.sidebar.inert = false; }
 else els.sidebar.inert = !els.sidebar.classList.contains("open");
 map.invalidateSize();
});

populateFilters();
render(true);
if (isMobileLayout()) els.sidebar.inert = true;
new ResizeObserver(() => map.invalidateSize()).observe(document.getElementById("map"));


})().catch(error => {
 console.error(error);
 document.getElementById("map").textContent = "Não foi possível carregar o mapa. Atualize a página para tentar novamente.";
});
