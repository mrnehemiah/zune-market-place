import {productCard} from "./product-card.js";import {emptyState} from "./ui.js";
export function productGrid(products){return products?.length?`<div class="product-grid">${products.map(productCard).join("")}</div>`:emptyState("Hakuna bidhaa kwa sasa","Bidhaa zitaonekana hapa baada ya wauzaji kuziweka.","Rudi Home","home");}
