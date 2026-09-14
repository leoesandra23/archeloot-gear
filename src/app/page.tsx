"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown, FileUp, Plus, Search, Shield, Sword, Wand2, HeartPulse, Save, X, Trash2, Copy, Sparkles, Gem, Crown, Shirt, Footprints, Music, Wind, Layers3, Target, Flame } from "lucide-react";

type Tab = "Core" | "Attack" | "Defense" | "Regen/Misc";
import type { Rarity, Group, Item } from "@/types/gear";
import { catalog } from "@/data/catalog";
import { setRules } from "@/data/sets";

type Slot = { id: string; name: string; icon: string; group: Group; allowed?: string[] };
type GemStone = { name: string; stat: string; value: number; color: string; gs: number };
type Equipped = Item & { grade: Rarity; temper: number; lunafrost: number; gems: GemStone[]; awakened: boolean };

const slots: Slot[] = [
  {id:"head",name:"Head",icon:"crown",group:"Armor"},{id:"neck",name:"Neck",icon:"gem",group:"Accessory"},{id:"chest",name:"Chest",icon:"shirt",group:"Armor"},{id:"waist",name:"Waist",icon:"layers",group:"Armor"},{id:"arms",name:"Arms",icon:"layers",group:"Armor"},{id:"hands",name:"Hands",icon:"layers",group:"Armor"},{id:"legs",name:"Legs",icon:"layers",group:"Armor"},{id:"feet",name:"Feet",icon:"feet",group:"Armor"},{id:"back",name:"Back",icon:"wind",group:"Utility"},
  {id:"ear1",name:"Ear",icon:"ring",group:"Accessory"},{id:"ear2",name:"Ear",icon:"ring",group:"Accessory"},{id:"brace1",name:"Bracelet",icon:"gem",group:"Accessory"},{id:"brace2",name:"Bracelet",icon:"gem",group:"Accessory"},{id:"ring1",name:"Ring",icon:"ring",group:"Accessory"},{id:"ring2",name:"Ring",icon:"ring",group:"Accessory"},
  {id:"main",name:"Main Hand",icon:"sword",group:"Weapon"},{id:"ranged",name:"Ranged",icon:"target",group:"Weapon"},{id:"off",name:"Off Hand",icon:"shield",group:"Weapon"},{id:"instrument",name:"Instrument",icon:"music",group:"Weapon"},{id:"glider",name:"Glider",icon:"wind",group:"Utility"},{id:"under",name:"Undergarment",icon:"layers",group:"Armor"}
];

const gems: GemStone[] = [
  {name:"Lunagem: Strength",stat:"str",value:12,color:"red",gs:24},{name:"Lunagem: Stamina",stat:"sta",value:12,color:"blue",gs:24},{name:"Lunagem: Intelligence",stat:"int",value:12,color:"violet",gs:24},{name:"Lunagem: Spirit",stat:"spirit",value:12,color:"cyan",gs:24},{name:"Lunagem: Agility",stat:"agi",value:12,color:"green",gs:24},
  {name:"Lunagem: Melee Crit",stat:"crit",value:1.4,color:"red",gs:22},{name:"Lunagem: Magic Attack",stat:"magic",value:2.2,color:"violet",gs:22},{name:"Lunagem: Ranged Attack",stat:"ranged",value:2.2,color:"green",gs:22},{name:"Lunagem: Resilience",stat:"resilience",value:300,color:"blue",gs:24}
];




const fullCatalog = catalog;

function accessoryType(item: Item): string | null {
  const n = item.name.toLowerCase();
  const m = n.match(/enlightened ayanad (meadow|earth|wave|flame|life|lightning|gale) (ring|earring)/);
  return m ? m[1] : null;
}
function accessoryRole(item: Item): "ring" | "ear" | "neck" | "other" {
  const n = item.name.toLowerCase();
  if (n.includes("earring")) return "ear";
  if (n.includes("ring")) return "ring";
  if (n.includes("necklace")) return "neck";
  return "other";
}
function evaluateSetRules(equipped: Record<string, Equipped | null>) {
  const items = Object.values(equipped).filter(Boolean) as Equipped[];
  const active: {id:string; name:string; pieces:number; effect:string; stats:Record<string,number>}[] = [];
  const obs = items.filter(i => i.set === "Obsidian");
  if (obs.length >= 4) active.push({id:"obsidian", name:"Obsidian", pieces:obs.length, effect:"Set detected. Exact tier/path bonus values are intentionally not invented.", stats:{}});
  const primal = items.filter(i => /Primal Kyrios/i.test(i.name));
  if (primal.length >= 7) active.push({id:"primal-kyrios-7", name:"Pure Destruction - Primal Kyrios", pieces:primal.length, effect:"+700 Toughness · -4.5% received damage · Anthalon/Absorb Mind triggers", stats:{toughness:700, receivedDamageReduction:4.5}});
  else if (primal.length >= 4) active.push({id:"primal-kyrios", name:"Pure Destruction - Primal Kyrios", pieces:primal.length, effect:"+700 Toughness · low chance for Anthalon's Necromantic Flame when receiving damage", stats:{toughness:700}});
  const groups = new Map<string, Equipped[]>();
  for (const i of items) { const t=accessoryType(i); if(t){ const arr=groups.get(t)||[]; arr.push(i); groups.set(t,arr); } }
  for (const [type,arr] of groups) {
    const rings=arr.filter(i=>accessoryRole(i)==="ring");
    const ears=arr.filter(i=>accessoryRole(i)==="ear");
    if(rings.length>=1 && ears.length>=1) active.push({id:`enlightened-${type}`,name:`Enlightened Ayanad - ${type}`,pieces:2,effect:`2-piece ${type} Enlightenment activated by matching ring + earring.`,stats:{}});
  }
  const shadow = items.filter(i=>/Enlightened Shadow (Ring|Earring|Necklace)/i.test(i.name));
  const shadowRoles = new Set(shadow.map(accessoryRole));
  if(shadowRoles.has("ring") && shadowRoles.has("ear") && shadowRoles.has("neck")) active.push({id:"enlightened-shadow",name:"Full Darkness - Shadow",pieces:3,effect:"Arcadian Sea Guardian +10s stealth · Stealth +30s",stats:{}});
  return active;
}

const starterBuilds = [
  ["Starter Melee","Darkrunner",4889,"⚔","melee"],["Starter Mage","Spellsong",4742,"✦","mage"],["Starter Healer","Hierophant",5007,"✚","healer"],["Starter Archer","Primeval",5195,"➶","archer"],["Starter Tank Mage","Skullknight",4733,"🛡","tank"],
  ["Burst Melee","Darkrunner",6641,"⚔","melee"],["Burst Staff Mage","Spellsong",6570,"✦","mage"],["General Healer","Hierophant",6955,"✚","healer"]
] as const;

const gradeOrder: Rarity[] = ["Basic","Crude","Grand","Rare","Arcane","Heroic","Unique","Celestial","Divine","Epic","Legendary","Mythic","Eternal"];
const temperMultiplier = (percent:number) => Math.max(1, Math.min(1.15, percent / 100));
const temperableStats = new Set(["melee","magic","healing","pdef","mdef"]);
function allowedInSlot(item: Item, slotId: string){
  if (item.allowed?.length) return item.allowed.includes(slotId);
  const n = `${item.name} ${item.description}`.toLowerCase();
  if (slotId === "glider") return item.groups.includes("Utility") && n.includes("glider");
  if (slotId === "under") return n.includes("undergarment");
  if (slotId === "back") return n.includes("cloak") || n.includes("cape") || n.includes("back");
  if (["ear1","ear2"].includes(slotId)) return item.groups.includes("Accessory") && (n.includes("ear") || n.includes("earring"));
  if (["ring1","ring2"].includes(slotId)) return item.groups.includes("Accessory") && n.includes("ring");
  if (["brace1","brace2"].includes(slotId)) return item.groups.includes("Accessory") && (n.includes("brace") || n.includes("bracelet"));
  if (slotId === "neck") return item.groups.includes("Accessory") && n.includes("necklace");
  if (slotId === "ranged") return item.groups.includes("Weapon") && (n.includes("bow") || n.includes("crossbow") || n.includes("ranged"));
  if (slotId === "instrument") return item.groups.includes("Weapon") && n.includes("instrument");
  if (slotId === "off") return item.groups.includes("Weapon") && (n.includes("shield") || n.includes("off-hand") || n.includes("off hand"));
  if (slotId === "main") return item.groups.includes("Weapon") && !n.includes("bow") && !n.includes("crossbow") && !n.includes("shield") && !n.includes("instrument");
  if (item.groups.includes("Armor")) {
    if (slotId === "head") return /helm|helmet|hood|goggle|head/.test(n);
    if (slotId === "chest") return /chest|robe|tunic|breastplate/.test(n);
    if (slotId === "waist") return /waist|belt|girdle/.test(n);
    if (slotId === "arms") return /arms|armguard|sleeve/.test(n);
    if (slotId === "hands") return /hands|glove|gauntlet/.test(n);
    if (slotId === "legs") return /legs|greave|pants|trouser/.test(n);
    if (slotId === "feet") return /feet|boot|shoe/.test(n);
  }
  return false;
}

function Icon({name}:{name:string}){const p={size:18,strokeWidth:1.6}; switch(name){case"sword":return <Sword {...p}/>;case"shield":return <Shield {...p}/>;case"gem":return <Gem {...p}/>;case"crown":return <Crown {...p}/>;case"shirt":return <Shirt {...p}/>;case"feet":return <Footprints {...p}/>;case"ring":return <Gem {...p}/>;case"music":return <Music {...p}/>;case"wind":return <Wind {...p}/>;case"target":return <Target {...p}/>;default:return <Layers3 {...p}/>}}

export default function Home({embedded=false}:{embedded?:boolean}){
  const [tab,setTab]=useState<Tab>("Core"); const [className,setClassName]=useState("Selecione a Classe..."); const [showImport,setShowImport]=useState(false); const [showCatalog,setShowCatalog]=useState<string|null>(null); const [selectedSlot,setSelectedSlot]=useState<string|null>(null); const [selectedItem,setSelectedItem]=useState<Item|null>(null);
  const [query,setQuery]=useState(""); const [itemQuery,setItemQuery]=useState(""); const [verifiedOnly,setVerifiedOnly]=useState(false); const [rarity,setRarity]=useState<"All"|Rarity>("All"); const [sourceFilter,setSourceFilter]=useState("All"); const [levelFilter,setLevelFilter]=useState("All"); const [sortMode,setSortMode]=useState("verified"); const [buildName,setBuildName]=useState("New Character"); const [title,setTitle]=useState(""); const [equipped,setEquipped]=useState<Record<string,Equipped|null>>({}); const [saved,setSaved]=useState<string[]>([]); const [buff,setBuff]=useState(false); const [message,setMessage]=useState(""); const [editorData,setEditorData]=useState<Equipped|null>(null);

  useEffect(()=>{try{const raw=localStorage.getItem("archeloot-build-v22"); if(raw){const x=JSON.parse(raw);setBuildName(x.name||"New Character");setClassName(x.className||"Selecione a Classe...");setTitle(x.title||"");setEquipped(x.equipped||{});setBuff(!!x.buff)}}catch{}},[]);
  useEffect(()=>{try{const hash=location.hash; if(!hash.startsWith("#build="))return; const encoded=hash.slice(7); const json=decodeURIComponent(escape(atob(encoded))); const d=JSON.parse(json); setBuildName(d.name||"Shared Build"); setClassName(d.className||"Selecione a Classe..."); setTitle(d.title||""); setEquipped(d.equipped||{}); setBuff(!!d.buff); setMessage("Build compartilhada carregada"); history.replaceState(null,"",location.pathname+location.search);}catch{}},[]);
  useEffect(()=>{if(!message)return;const t=setTimeout(()=>setMessage(""),2200);return()=>clearTimeout(t)},[message]);

  const totals=useMemo(()=>Object.values(equipped).reduce<Record<string,number>>((a,it)=>{if(!it)return a;const m=temperMultiplier(it.temper||100);Object.entries(it.stats).forEach(([k,v])=>a[k]=(a[k]||0)+v*(temperableStats.has(k)?m:1));(it.gems||[]).forEach(g=>a[g.stat]=(a[g.stat]||0)+g.value);a.gs=(a.gs||0)+it.gs+(it.lunafrost||0)+(it.awakened?35:0)+(it.gems||[]).reduce((n,g)=>n+g.gs,0);return a},{} as Record<string,number>),[equipped]);
  const setCounts=useMemo(()=>Object.values(equipped).filter(Boolean).reduce<Record<string,number>>((a,it)=>{if(it?.set)a[it.set]=(a[it.set]||0)+1;return a},{} as Record<string,number>),[equipped]);
  const activeSets=useMemo(()=>evaluateSetRules(equipped),[equipped]);
  const setBonus=useMemo(()=>activeSets.reduce<Record<string,number>>((a,s)=>{Object.entries(s.stats).forEach(([k,v])=>a[k]=(a[k]||0)+v);return a},{}),[activeSets]);
  const hp=10246+(totals.hp||0)+(setBonus.hp||0)+(buff?500:0); const mana=7496+(totals.mana||0); const str=158+(totals.str||0)+(setBonus.str||0); const sta=158+(totals.sta||0)+(setBonus.sta||0); const int=158+(totals.int||0); const spirit=158+(totals.spirit||0); const agi=158+(totals.agi||0);
  const melee=31.6+(totals.melee||0)+(str-158)*.2; const ranged=31.6+(totals.ranged||0)+(agi-158)*.2; const magic=31.6+(totals.magic||0)+(int-158)*.2; const healing=31.6+(spirit-158)*.2;
  const currentStats:Record<Tab,[string,string][]>={Core:[["Health",hp.toLocaleString()],["Mana",mana.toLocaleString()],["Equipment Points",Math.round(totals.gs||0).toLocaleString()],["Strength",str.toFixed(0)],["Spirit",spirit.toFixed(0)],["Intelligence",int.toFixed(0)],["Stamina",sta.toFixed(0)],["Agility",agi.toFixed(0)]],Attack:[["Melee Attack",melee.toFixed(1)],["Ranged Attack",ranged.toFixed(1)],["Magic Attack",magic.toFixed(1)],["Healing Power",healing.toFixed(1)],["Move Speed",`${(5.4+(totals.move||0)).toFixed(2)} m/s`],["Cast Time",`${Math.max(70,100-(totals.cast||0)).toFixed(1)} %`],["Attack Speed",`0 (${Math.max(50,100-(totals.aps||0)).toFixed(1)}%)`],["Accuracy",`${(totals.acc||0).toFixed(2)}%`],["Critical Rate",`${(totals.crit||0).toFixed(2)}%`]],Defense:[["Physical Defense",`${Math.round(totals.pdef||0)} (${((totals.pdef||0)/80).toFixed(2)}%)`],["Magic Defense",`${Math.round(158+(totals.mdef||0))}`],["Parry",`${(totals.parry||0).toFixed(2)}%`],["Block",`${(totals.block||0).toFixed(2)}%`],["Evasion",`${(totals.evasion||0).toFixed(2)}%`],["Resilience",Math.round(totals.resilience||0).toLocaleString()],["Toughness",Math.round(totals.toughness||0).toLocaleString()],["Melee Reduction",`${(totals.meleeRed||0).toFixed(2)}%`],["Magic Reduction",`${(totals.magicRed||0).toFixed(2)}%`]],"Regen/Misc":[["Health Regen",`${(totals.hpregen||0).toFixed(1)} /s`],["Combat Health Regen",`${((totals.hpregen||0)*.65).toFixed(1)} /s`],["Mana Regen",`${(totals.manaregen||0).toFixed(1)} /s`],["Post-cast Mana",`${((totals.manaregen||0)*.8).toFixed(1)} /s`],["Bonus Recovery",`${(totals.recovery||0).toFixed(1)}%`],["Gear Set Bonus",activeSets.length?activeSets.map(s=>`${s.name} (${s.pieces})`).join(" · "):"None"]]};

  const currentSlot=slots.find(s=>s.id===showCatalog); const sourceOptions=Array.from(new Set(fullCatalog.map(it=>it.source||"Starter / local"))).sort(); const levelOptions=Array.from(new Set(fullCatalog.map(it=>it.level).filter(Boolean))).sort((a,b)=>a-b); const filteredCatalog=fullCatalog.filter(it=>(rarity==="All"||it.rarity===rarity)&&(!verifiedOnly||!!it.verified)&&(sourceFilter==="All"||(it.source||"Starter / local")===sourceFilter)&&(levelFilter==="All"||String(it.level)===levelFilter)&&it.groups.includes(currentSlot?.group||"Armor")&&allowedInSlot(it,showCatalog||"")&&it.name.toLowerCase().includes(itemQuery.toLowerCase())).sort((a,b)=>sortMode==="name"?a.name.localeCompare(b.name):sortMode==="level"?b.level-a.level:sortMode==="gs"?b.gs-a.gs:Number(!!b.verified)-Number(!!a.verified)||b.level-a.level||b.gs-a.gs||a.name.localeCompare(b.name));
  const filtered=starterBuilds.filter(b=>b.join(" ").toLowerCase().includes(query.toLowerCase()));

  function equip(slotId:string,item:Item){setSelectedSlot(slotId);setSelectedItem(item);setShowCatalog(null);setEditorData({...item,grade:item.rarity,temper:100,lunafrost:0,gems:[],awakened:false});}
  function applyItem(data:{grade:Rarity;temper:number;lunafrost:number;awakened:boolean;gems:GemStone[]}){if(!selectedSlot||!selectedItem)return;setEquipped(e=>({...e,[selectedSlot]:{...selectedItem,...data}}));setSelectedItem(null);setEditorData(null);setSelectedSlot(null);setShowCatalog(null);setMessage("Item equipado e calculado")}
  function editEquipped(slotId:string){const it=equipped[slotId];if(!it)return;setSelectedSlot(slotId);setSelectedItem(it);setEditorData(it)}
  function removeGem(slotId:string,index:number){setEquipped(e=>{const item=e[slotId];if(!item)return e;return {...e,[slotId]:{...item,gems:item.gems.filter((_,i)=>i!==index)}}})}
  function addGem(slotId:string,gem:GemStone){setEquipped(e=>{const item=e[slotId];if(!item||item.gems.length>=(item.socket||0))return e;return {...e,[slotId]:{...item,gems:[...item.gems,gem]}}})}
  function save(){const data={name:buildName,className,title,equipped,buff};localStorage.setItem("archeloot-build-v22",JSON.stringify(data));setSaved(s=>[buildName,...s.filter(x=>x!==buildName)].slice(0,5));setMessage("Build salva no navegador")}
  function newBuild(){setBuildName("New Character");setClassName("Selecione a Classe...");setTitle("");setEquipped({});setBuff(false);localStorage.removeItem("archeloot-build-v22");setMessage("Nova build criada")}
  function share(){const data=btoa(unescape(encodeURIComponent(JSON.stringify({name:buildName,className,title,equipped,buff}))));navigator.clipboard?.writeText(`${location.origin}${location.pathname}#build=${data}`);setMessage("Link de build copiado")}
  function importJson(text:string){try{const d=JSON.parse(text);setBuildName(d.name||"Imported Build");setClassName(d.className||"Selecione a Classe...");setTitle(d.title||"");setEquipped(d.equipped||{});setBuff(!!d.buff);setShowImport(false);setMessage("Build importada")}catch{setMessage("JSON de build inválido")}}
  function applyRecommended(kind:string){const map:Record<string,string[]>={melee:["obs-head","obs-chest","obs-waist","obs-legs","obs-feet","signet","necklace","ring","greatsword","shield","instrument","under"],mage:["obs-leather-head","obs-cloth-chest","obs-waist","obs-legs","obs-feet","signet","necklace","ring","staff","instrument","under"],archer:["obs-leather-head","obs-chest","obs-waist","obs-legs","obs-feet","signet","necklace","ring","bow","instrument","under"],healer:["obs-leather-head","obs-cloth-chest","obs-waist","obs-legs","obs-feet","signet","necklace","ring","staff","instrument","under"],tank:["obs-head","obs-chest","obs-waist","obs-legs","obs-feet","signet","necklace","ring","staff","shield","instrument","under"]};const ids=map[kind]||map.melee;const next:Record<string,Equipped|null>={};ids.forEach((id,i)=>{const item=catalog.find(x=>x.id===id);const slot=slots[i];if(item&&slot)next[slot.id]={...item,grade:"Celestial",temper:100,lunafrost:0,gems:[],awakened:false}});setEquipped(next);setMessage("Build recomendada aplicada")}

  const renderGearSlot=(s:Slot, extra="")=>{const item=equipped[s.id];return <button className={`gear-slot ${extra} ${item?"filled":""}`} key={s.id} onClick={()=>item?editEquipped(s.id):(setShowCatalog(s.id),setItemQuery(""),setSourceFilter("All"),setLevelFilter("All"),setSortMode("verified"))}><span className="gear-slot-icon"><Icon name={s.icon}/></span><span className="gear-slot-label">{item?.name||s.name}</span>{item&&<span className="gear-slot-grade">{item.grade} · {Math.round(item.gs)} GS</span>}</button>}

  return <main className={`app ${embedded ? "embed-mode" : ""}`}>
    <div className="daru-shell">
      <aside className="character character-daru">
        <div className="daru-title"><strong>Informações do Personagem</strong> <span>- CONFIGURAÇÃO DO PERSONAGEM</span><b>Nível 50</b></div>
        <div className="daru-basic"><div><span>Saúde:</span><strong>{hp.toLocaleString()}</strong></div><div><span>Mana:</span><strong>{mana.toLocaleString()}</strong></div><button className="mini-plus" onClick={()=>setBuff(!buff)}>+</button></div>
        <div className="daru-gs"><span>Pontos de Equipamento:</span><strong>{Math.round(totals.gs||0).toLocaleString()}</strong></div>
        <div className="daru-tabs">{(["Core","Attack","Defense","Regen/Misc"] as Tab[]).map((t,i)=><button key={t} onClick={()=>setTab(t)} className={tab===t?"active":""}>{t}</button>)}</div>
        <div className="daru-form"><label>Classe:</label><select value={className} onChange={e=>setClassName(e.target.value)} className="daru-select"><option>Selecione a Classe...</option><option>Darkrunner</option><option>Spellsong</option><option>Hierophant</option><option>Primeval</option><option>Skullknight</option></select><label>Título:</label><input value={title} onChange={e=>setTitle(e.target.value)} className="daru-input"/></div>
        <div className="daru-stat-block">{currentStats[tab].slice(0,6).map(([l,v])=><div key={l}><span>{l}:</span><strong>{v}</strong></div>)}</div>
        <div className="daru-two-col">{currentStats[tab].slice(6,11).map(([l,v])=><div key={l}><span>{l}:</span><strong>{v}</strong></div>)}</div>
        <button className={`migration ${buff?"active":""}`} onClick={()=>setBuff(!buff)}>Migração de Estatísticas com Alternância</button>
        <div className="daru-actions"><button onClick={save}><Save size={14}/> Salvar</button><button onClick={share}><Copy size={14}/> Compartilhar</button><button onClick={()=>setShowImport(true)}><FileUp size={14}/> Importar</button><button onClick={newBuild}><Plus size={14}/> Novo</button></div>
      </aside>

      <section className="character-stage">
        <div className="stage-brand"><div className="archeloot-mark">ARCHELOOT</div><div className="for-line">for</div><div className="classic-mark">ARCHÉAGE <b>CLASSIC</b></div><small>Gear Calculator</small></div>
        <div className="equip-left">{["head","chest","waist","arms","hands","legs","feet"].map(id=>renderGearSlot(slots.find(s=>s.id===id)!))}</div>
        <div className="equip-right">{["neck","ear1","ear2","brace1","brace2","ring1","ring2"].map(id=>renderGearSlot(slots.find(s=>s.id===id)!))}</div>
        <div className="equip-bottom-left">{["back","under","glider"].map(id=>renderGearSlot(slots.find(s=>s.id===id)!))}</div>
        <div className="equip-bottom-right">{["main","off","ranged","instrument"].map(id=>renderGearSlot(slots.find(s=>s.id===id)!))}</div>
        <div className="stage-footer"><span>⚔</span><span>ARCHELOOT</span><span>⚔</span></div>
        <div className="stage-buttons"><button className="save-share" onClick={share}><Copy size={16}/> Código de Salvar/Compartilhar</button><button className="folder" onClick={()=>setShowImport(true)}><FileUp size={16}/></button></div>
      </section>
    </div>

    <section className="below-daru">
      <div className="stats-strip"><div className="strip-tabs">{(["Core","Attack","Defense","Regen/Misc"] as Tab[]).map(t=><button key={t} onClick={()=>setTab(t)} className={tab===t?"active":""}>{t}</button>)}</div><div className="strip-grid">{currentStats[tab].map(([l,v])=><div key={l}><span>{l}</span><strong>{v}</strong></div>)}</div></div>
      <aside className="recommended-daru"><div className="rec-head"><h2>Recommended Builds</h2><span>1.3 (3.5)</span></div><div className="search"><Search size={14}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search builds..."/></div><div className="build-list">{filtered.map(b=><button className="build" key={b[0]} onClick={()=>{setBuildName(b[0]);setClassName(b[1]);applyRecommended(b[4])}}><div className="build-icon">{b[3]}</div><div className="flex-1 text-left"><small>{b[0]}</small><strong>{b[1]}</strong><em>{b[2].toLocaleString()} GS</em></div></button>)}</div><div className="saved"><div className="saved-title">Recently Saved</div>{saved.length?saved.map(x=><div className="saved-row" key={x}>{x}<Trash2 size={13} onClick={()=>setSaved(s=>s.filter(y=>y!==x))}/></div>):<div className="empty">No saved builds</div>}</div></aside>
    </section>

    {showCatalog&&<div className="modal-wrap"><div className="modal catalog-modal"><div className="modal-title"><div><h2>Choose Equipment</h2><small>{currentSlot?.name} · {currentSlot?.group}</small></div><button onClick={()=>setShowCatalog(null)}><X/></button></div><div className="catalog-tools"><div className="search"><Search size={14}/><input value={itemQuery} onChange={e=>setItemQuery(e.target.value)} placeholder="Search item name or family..."/></div><select value={rarity} onChange={e=>setRarity(e.target.value as "All"|Rarity)} className="input"><option>All grades</option>{gradeOrder.map(x=><option key={x}>{x}</option>)}</select><select value={levelFilter} onChange={e=>setLevelFilter(e.target.value)} className="input"><option value="All">All levels</option>{levelOptions.map(x=><option key={x} value={String(x)}>Lv. {x}</option>)}</select><select value={sourceFilter} onChange={e=>setSourceFilter(e.target.value)} className="input"><option value="All">All sources</option>{sourceOptions.map(x=><option key={x} value={x}>{x.length>34?x.slice(0,34)+"…":x}</option>)}</select><select value={sortMode} onChange={e=>setSortMode(e.target.value)} className="input"><option value="verified">Verified first</option><option value="gs">Highest GS</option><option value="level">Highest level</option><option value="name">Name A–Z</option></select><label className="verified-toggle"><input type="checkbox" checked={verifiedOnly} onChange={e=>setVerifiedOnly(e.target.checked)}/> Verified only</label></div><div className="catalog-summary"><span>{filteredCatalog.length} matching records</span><span>{fullCatalog.length} total indexed</span><span>{fullCatalog.filter(it=>it.verified).length} source-backed records</span></div><div className="catalog-grid">{filteredCatalog.map(it=><button className="catalog-item" key={it.id} onClick={()=>equip(showCatalog!,it)}><div className="catalog-icon"><Icon name={it.groups[0]==="Weapon"?"sword":it.groups[0]==="Accessory"?"ring":"shirt"}/></div><div><strong>{it.name}</strong><small>{it.rarity} · Lv. {it.level} · {it.socket||0} sockets {it.verified?"· ✓ Verified":""}</small><em>{it.gs ? `${it.gs} GS` : "GS n/d"} · {Object.entries(it.stats).slice(0,3).map(([k,v])=>`${k}+${v}`).join(" · ") || "Stats assigned by enchantment"}</em><small className="source-line">{it.verified?"✓ Source-backed":"Local starter data"}{it.source?` · ${it.source}`:""}</small></div></button>)}</div>{!filteredCatalog.length&&<div className="empty">No equipment matches this slot.</div>}</div></div>}
    {editorData&&<ItemEditor item={editorData} onClose={()=>{setEditorData(null);setSelectedItem(null);setSelectedSlot(null)}} onEquip={applyItem}/>} 
    {showImport&&<ImportModal onClose={()=>setShowImport(false)} onImport={importJson}/>} 
    {message&&<div className="toast">{message}</div>}
  </main>
}

function MiniStat({label,value}:{label:string,value:string}){return <div className="mini-stat"><small>{label}</small><strong>{value}</strong></div>}
function Role({icon,title,value}:{icon:ReactNode,title:string,value:string}){return <div className="role"><span>{icon}</span><div><small>{title}</small><strong>{value}</strong></div></div>}
function ItemEditor({item,onClose,onEquip}:{item:Equipped,onClose:()=>void,onEquip:(data:{grade:Rarity;temper:number;lunafrost:number;awakened:boolean;gems:GemStone[]})=>void}){const [grade,setGrade]=useState<Rarity>(item.rarity);const [temper,setTemper]=useState(item.temper||100);const [lunafrost,setLunafrost]=useState(item.lunafrost||0);const [awakened,setAwakened]=useState(!!item.awakened);const [localGems,setLocalGems]=useState<GemStone[]>(item.gems||[]);const mult=temperMultiplier(temper);return <div className="modal-wrap"><div className="modal editor"><div className="modal-title"><div><h2>{item.name}</h2><small>{item.description} · Tempering afeta apenas stats temperáveis e não aumenta o Gear Score.{item.source?` · Source: ${item.source}`:""}{item.verified&&item.sourceUrl?<a className="source-link" href={item.sourceUrl} target="_blank" rel="noreferrer"> · Open source</a>:null}</small></div><button onClick={onClose}><X/></button></div><div className="editor-grid"><div><label className="field-label">Quality tier</label><select className="input" value={grade} onChange={e=>setGrade(e.target.value as Rarity)}>{gradeOrder.map(x=><option key={x} value={x}>{x}</option>)}</select></div><div><label className="field-label">Temper</label><input className="input" type="number" min="100" max="115" value={temper} onChange={e=>setTemper(Math.max(100,Math.min(115,Number(e.target.value)||100)))}/></div><div><label className="field-label">Lunafrost / slot bonus</label><input className="input" type="number" min="0" value={lunafrost} onChange={e=>setLunafrost(Math.max(0,Number(e.target.value)||0))}/></div><div><label className="field-label">Awakening</label><button className={`awaken large ${awakened?"on":""}`} onClick={()=>setAwakened(!awakened)}><Flame size={14}/> {awakened?"Awakened (+35 GS)":"Not awakened"}</button></div></div><div className="upgrade-summary"><span>Base GS <b>{item.gs}</b></span><span>Grade <b>{grade}</b></span><span>Temper <b>{temper}%</b> · GS unchanged</span><span>Frost <b>+{lunafrost}</b></span><span>Gems <b>{localGems.reduce((n,g)=>n+g.gs,0)}</b></span></div><div className="item-stats">{Object.entries(item.stats).map(([k,v])=>{const value=v*(temperableStats.has(k)?mult:1);return <span key={k}>{k.toUpperCase()} <b>+{value.toFixed(v%1?2:0)}</b></span>})}</div><div className="editor-gems"><div className="detail-head"><span>SOCKETS</span><small>{localGems.length}/{item.socket||0}</small></div><div className="gem-dots">{Array.from({length:item.socket||0}).map((_,i)=>localGems[i]?<button key={i} className={`gem-dot ${localGems[i].color}`} onClick={()=>setLocalGems(g=>g.filter((_,j)=>j!==i))}>{localGems[i].value}</button>:<button key={i} className="gem-dot empty" onClick={()=>localGems.length<(item.socket||0)&&setLocalGems(g=>[...g,gems[(g.length)%gems.length]])}>+</button>)}</div></div><div className="modal-actions"><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" onClick={()=>onEquip({grade,temper,lunafrost,awakened,gems:localGems})}>Apply Changes</button></div></div></div>}
function ImportModal({onClose,onImport}:{onClose:()=>void,onImport:(x:string)=>void}){const [text,setText]=useState("");return <div className="modal-wrap"><div className="modal"><div className="modal-title"><div><h2>Import Build</h2><small>JSON build data</small></div><button onClick={onClose}><X/></button></div><textarea value={text} onChange={e=>setText(e.target.value)} className="textarea" placeholder="Cole aqui o JSON da build..."/><div className="modal-actions"><button className="btn" onClick={onClose}>Cancel</button><button className="btn primary" onClick={()=>onImport(text)}>Import Build</button></div></div></div>}
