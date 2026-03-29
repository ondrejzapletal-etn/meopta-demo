import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const bundlePath = join(__dirname, '../node_modules/@payloadcms/ui/dist/exports/client/index.js');
let content = readFileSync(bundlePath, 'utf-8');
let changed = false;

// Fix 1: Remove stale form-state paths after clipboard paste.
// Without this, extra rows from the previous target field remain in the flat
// form state and get sent to the server, which marks them addedByServer:true
// and appends ghost rows on the next form state refresh.
const fix1From = "startsWith(o)&&delete e[b]}for(let p in s){if(!c&&p.endsWith(\".id\")||!p.startsWith(f))continue;let h=p.replace(f,m),g=d?e[h]?.customComponents:void 0,b=d?e[h]?.validate:void 0;e[h]={customComponents:g,validate:b,...s[p]}}return e}";
const fix1To   = "startsWith(o)&&delete e[b]}const pt=new Set();for(let p in s){if(!c&&p.endsWith(\".id\")||!p.startsWith(f))continue;let h=p.replace(f,m),g=d?e[h]?.customComponents:void 0,b=d?e[h]?.validate:void 0;e[h]={customComponents:g,validate:b,...s[p]};pt.add(h)}const tp=m+\".\";for(const xp in e){if(xp!==m&&xp.startsWith(tp)&&!pt.has(xp)){delete e[xp]}}return e}";

if (content.includes(fix1From)) {
  content = content.replace(fix1From, fix1To);
  changed = true;
} else if (!content.includes(fix1To)) {
  throw new Error('[patch-payload-bundle] Fix 1 target not found – @payloadcms/ui may have been updated');
}

// Fix 2: Positional row replacement in mergeServerFormState.
// Payload's postgres adapter always assigns new server-side IDs to array rows
// on INSERT. After autosave the server returns all rows as addedByServer:true
// (IDs don't match previousFormState). Without this fix the client appends
// them as ghost rows. When all incoming rows are addedByServer we replace
// positionally instead of appending, and sync the flat *.N.id fields.
const fix2From = "incomingState:o})=>{let n={...e};for(let[r,s]of Object.entries(o||{})){if(!(r in e)&&!s.addedByServer)continue;let i=s.addedByServer||t===!0||typeof t==\"object\"&&t!==null&&t.overrideLocalChanges===!1&&!e[r]?.isModified,a=s;if(!i){let{initialValue:l,value:c,...u}=s;a=u}n[r]={...e[r],...a},e[r]&&\"errorPaths\"in e[r]&&!(\"errorPaths\"in s)&&(n[r].errorPaths=[]),Array.isArray(s.rows)&&r in e&&(n[r].rows=[...e[r]?.rows||[]],s.rows.forEach(l=>{let c=e[r].rows?.findIndex(u=>u.id===l.id);if(c>-1)n[r].rows[c]={...e[r].rows[c],...l};else if(l.addedByServer){let u={...l};delete u.addedByServer,n[r].rows.push(u)}})),s.valid!==!1&&(n[r].valid=!0),s.passesCondition!==!1&&(n[r].passesCondition=!0),s.blocksFilterOptions||delete n[r].blocksFilterOptions,delete n[r].addedByServer}return _G(n,e)?e:n}";
const fix2To   = "incomingState:o})=>{let n={...e},_piu={};for(let[r,s]of Object.entries(o||{})){if(!(r in e)&&!s.addedByServer)continue;let i=s.addedByServer||t===!0||typeof t==\"object\"&&t!==null&&t.overrideLocalChanges===!1&&!e[r]?.isModified,a=s;if(!i){let{initialValue:l,value:c,...u}=s;a=u}n[r]={...e[r],...a},e[r]&&\"errorPaths\"in e[r]&&!(\"errorPaths\"in s)&&(n[r].errorPaths=[]),Array.isArray(s.rows)&&r in e&&(n[r].rows=[...e[r]?.rows||[]],s.rows.forEach(l=>{let c=e[r].rows?.findIndex(u=>u.id===l.id);if(c>-1)n[r].rows[c]={...e[r].rows[c],...l};else if(l.addedByServer){const _as=s.rows.every(x=>x.addedByServer);const _pi=s.rows.indexOf(l);const _rc=e[r].rows?.length||0;if(_as&&_pi>=0&&_pi<_rc){let u={...l};delete u.addedByServer;n[r].rows[_pi]={...n[r].rows[_pi],...u};if(l.id)_piu[r+\".\"+_pi+\".id\"]=l.id}else{let u={...l};delete u.addedByServer,n[r].rows.push(u)}}})),s.valid!==!1&&(n[r].valid=!0),s.passesCondition!==!1&&(n[r].passesCondition=!0),s.blocksFilterOptions||delete n[r].blocksFilterOptions,delete n[r].addedByServer}for(const[_k,_v]of Object.entries(_piu)){if(_k in n)n[_k]={...n[_k],value:_v,initialValue:_v}}return _G(n,e)?e:n}";

if (content.includes(fix2From)) {
  content = content.replace(fix2From, fix2To);
  changed = true;
} else if (!content.includes(fix2To)) {
  throw new Error('[patch-payload-bundle] Fix 2 target not found – @payloadcms/ui may have been updated');
}

if (changed) {
  writeFileSync(bundlePath, content);
  console.log('✓ Applied Payload UI bundle patches');
} else {
  console.log('✓ Payload UI bundle patches already applied');
}

