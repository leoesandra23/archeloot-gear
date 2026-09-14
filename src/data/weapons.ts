import type { Item } from "@/types/gear";

export const weapons: Item[] = [
  {id:"greatsword",name:"Obsidian Greatsword",level:50,gs:610,rarity:"Celestial",groups:["Weapon"],stats:{str:80,melee:18,acc:3,crit:4,aps:8},socket:3,description:"Two-handed melee weapon."},
  {id:"staff",name:"Obsidian Staff",level:50,gs:605,rarity:"Celestial",groups:["Weapon"],stats:{int:80,magic:18,acc:3,magicCrit:4},socket:3,description:"Two-handed magic weapon."},
  {id:"bow",name:"Obsidian Bow",level:50,gs:600,rarity:"Celestial",groups:["Weapon"],stats:{agi:78,ranged:18,acc:3,crit:4,aps:7},socket:3,description:"Ranged weapon."},
  {id:"ayanad-autumn-scythe-epic",name:"Ayanad Autumn Scythe (Epic)",level:50,gs:1010,rarity:"Epic",groups:["Weapon"],stats:{melee:670,magic:670,healing:670,str:53,int:44,spirit:35},socket:0,description:"Two-handed hybrid scythe. Official 1.3.6 preview example, no temper.",source:"ArcheAge Classic 1.3.6 Scythes Preview",verified:true,effect:"Lifesteal, Timewarp and Infusion procs"},
  {id:"db-ayanad-autumn-scythe-epic",name:"Ayanad Autumn Scythe (Epic)",level:62,gs:1010,rarity:"Epic",groups:["Weapon"],stats:{melee:670,magic:670,healing:670,str:53,int:44,spirit:35},socket:0,description:"Epic Ayanad Autumn Scythe example without temper.",source:"ArcheAge Classic 1.3.6 Scythes Preview",verified:true,effect:"Lifesteal, Timewarp and Infusion weapon procs",sourceUrl:"https://archeageclassic.com/news/136-preview-scythes",allowed:["main"]},
  {id:"db-sirothe-hatred",name:"Sirothe's Hatred",level:59,gs:0,rarity:"Epic",groups:["Weapon"],stats:{str:0},socket:0,description:"Serpentis Warclub; the February 2026 patch notes list it at iLvl 59 after an adjustment from 62.",source:"ArcheAge Classic February 19, 2026 patch notes",verified:true,effect:"Full Strength; chance to stun the target and enemies in a 5 meter radius for 2 seconds.",sourceUrl:"https://archeageclassic.com/news/patch-notes---feb-19%2C-2026.212225256",allowed:["main"]},
];
