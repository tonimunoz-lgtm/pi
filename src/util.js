/* ============ Utilitats ============ */
export const $=(s,r=document)=>r.querySelector(s);
export const $$=(s,r=document)=>[...r.querySelectorAll(s)];
export const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function defaultCurs(){const d=new Date(),y=d.getFullYear(),m=d.getMonth();const a=m>=8?y:y-1;return String(a).slice(2)+'-'+String(a+1).slice(2)}
export function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2200)}
export function fmtDate(iso){if(!iso)return'';const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);return m?`${m[3]}/${m[2]}/${m[1]}`:iso}
export function parseDate(s){s=String(s||'').trim();let m=/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})$/.exec(s);if(m){let y=+m[3];if(y<100)y+=y>30?1900:2000;return`${y}-${String(m[2]).padStart(2,'0')}-${String(m[1]).padStart(2,'0')}`}
  m=/^(\d{4})[\/\-.](\d{1,2})[\/\-.](\d{1,2})$/.exec(s);if(m)return`${m[1]}-${String(m[2]).padStart(2,'0')}-${String(m[3]).padStart(2,'0')}`;return s}
export function setPath(o,path,v){const ks=path.split('.');let c=o;ks.slice(0,-1).forEach(k=>{c=c[k]=c[k]||{}});c[ks[ks.length-1]]=v}
export function getPath(o,path){return path.split('.').reduce((a,k)=>a==null?a:a[k],o)}

