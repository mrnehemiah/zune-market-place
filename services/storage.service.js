const prefix="zune:";
export function getDemo(key,fallback){try{const v=localStorage.getItem(prefix+key);return v?JSON.parse(v):fallback;}catch{return fallback;}}
export function setDemo(key,value){localStorage.setItem(prefix+key,JSON.stringify(value));}
export function clearDemo(key){localStorage.removeItem(prefix+key);}
export function listDemo(key){return getDemo(key,[]);}
export function pushDemo(key,value){const rows=listDemo(key);rows.unshift(value);setDemo(key,rows);return rows;}