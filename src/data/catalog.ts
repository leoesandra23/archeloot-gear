import type { Item } from "@/types/gear";
import { weapons } from "./weapons";
import { armor } from "./armor";
import { accessories } from "./accessories";
import { shields } from "./shields";
import { instruments } from "./instruments";
import { lunagems } from "./lunagems";

export { weapons, armor, accessories, shields, instruments, lunagems };

export const catalog: Item[] = [
  ...weapons, ...armor, ...accessories, ...shields, ...instruments, ...lunagems,
];
