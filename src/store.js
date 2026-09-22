/**
 * Capa de dades. Dues implementacions amb la mateixa interfície:
 *  - firebase: Auth (Google) + Firestore, amb rols (staff/{email})
 *  - local: dades al navegador, per provar sense configurar res (mode demostració)
 *
 * Firestore:
 *   staff/{email}        -> { role: 'admin' | 'orientador' | 'docent' }   (només des de la consola)
 *   settings/centre      -> dades del centre
 *   students/{id}        -> alumnat (importat del CSV)
 *   plans/{id}           -> part del pla que pot veure tot el professorat (mesures)
 *   plansPrivate/{id}    -> part sensible (informe, conversa amb l'alumne/a): només orientació
 */
import { firebaseConfigured, allowedDomain, auth, db } from './firebase.js';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, getDocs, collection, writeBatch } from 'firebase/firestore';

export const PRIVATE_FIELDS = ['informe', 'q', 'open', 'altresNec', 'dxCodi', 'dxInforme', 'suportPrevi'];
export function splitPlan(p) {
  const pub = {}, priv = {};
  Object.keys(p).forEach(k => (PRIVATE_FIELDS.includes(k) ? priv : pub)[k] = p[k]);
  pub.nq = Object.values(p.q || {}).filter(x => x && x.a).length || p.nq || 0;
  return { pub, priv };
}
export const canEdit = role => role === 'admin' || role === 'orientador';

/* ---------- Firebase ---------- */
const fb = {
  mode: 'firebase',
  onAuth(cb) {
    onAuthStateChanged(auth, async user => {
      if (!user) return cb(null);
      try {
        const snap = await getDoc(doc(db, 'staff', (user.email || '').toLowerCase()));
        if (!snap.exists()) { await signOut(auth); return cb({ error: `El compte ${user.email} no té accés. Demana a l'equip directiu que t'hi doni d'alta.` }); }
        cb({ email: user.email, role: snap.data().role || 'docent' });
      } catch (e) { await signOut(auth); cb({ error: "No s'ha pogut comprovar l'accés: " + e.message }); }
    });
  },
  async login() {
    const p = new GoogleAuthProvider();
    if (allowedDomain) p.setCustomParameters({ hd: allowedDomain, prompt: 'select_account' });
    await signInWithPopup(auth, p);
  },
  logout: () => signOut(auth),
  async loadAll() {
    const [s, st, pl] = await Promise.all([
      getDoc(doc(db, 'settings', 'centre')), getDocs(collection(db, 'students')), getDocs(collection(db, 'plans'))]);
    const plans = {}; pl.forEach(d => plans[d.id] = d.data());
    return { settings: s.exists() ? s.data() : null, students: st.docs.map(d => d.data()), plans };
  },
  async loadPrivate(id) { const s = await getDoc(doc(db, 'plansPrivate', id)); return s.exists() ? s.data() : {}; },
  async savePlan(id, pub, priv) {
    await setDoc(doc(db, 'plans', id), pub);
    if (priv) await setDoc(doc(db, 'plansPrivate', id), priv);
  },
  async saveStudents(list) {
    for (let i = 0; i < list.length; i += 400) {
      const b = writeBatch(db);
      list.slice(i, i + 400).forEach(s => b.set(doc(db, 'students', s.id), s));
      await b.commit();
    }
  },
  saveSettings: s => setDoc(doc(db, 'settings', 'centre'), s),
};

/* ---------- Local (demostració) ---------- */
const KEY = 'psi-local-v2';
const rd = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
const wr = o => localStorage.setItem(KEY, JSON.stringify(o));
const local = {
  mode: 'local',
  onAuth(cb) { setTimeout(() => cb({ email: 'demostració', role: 'orientador' }), 0); },
  login() {}, logout() {},
  async loadAll() { const o = rd(); return { settings: o.settings || null, students: o.students || [], plans: o.plans || {} }; },
  async loadPrivate() { return null; },
  async savePlan(id, pub, priv) { const o = rd(); o.plans = o.plans || {}; o.plans[id] = { ...pub, ...(priv || {}) }; wr(o); },
  async saveStudents(list) { const o = rd(); const m = new Map((o.students || []).map(s => [s.id, s])); list.forEach(s => m.set(s.id, s)); o.students = [...m.values()]; wr(o); },
  async saveSettings(s) { const o = rd(); o.settings = s; wr(o); },
  replaceAll(o) { wr(o); },
  wipe() { localStorage.removeItem(KEY); },
};

export const store = firebaseConfigured ? fb : local;
