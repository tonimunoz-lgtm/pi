# PSI · Pla de suport individualitzat

Aplicació web per elaborar els plans de suport individualitzat (PSI) amb el mínim de feina administrativa:
importes l'alumnat d'un fitxer, tries l'alumne/a, i el pla ja surt pre-omplert amb les mesures segons el diagnòstic.

- **Alumnat**: importació des de CSV o enganxant files d'un full de càlcul.
- **Diagnòstic → mesures universals** automàtiques (TDAH, dislèxia, discalcúlia, TEA, TDL, disgrafia, altes capacitats).
- **Mesures addicionals i intensives**: desplegable múltiple, amb recomanades segons el diagnòstic i opció d'afegir-ne de pròpies.
- **Conversa orientador/a - alumne/a**: 9 blocs de preguntes; les respostes amb dificultat suggereixen mesures.
- **Sortida**: PDF amb l'estructura del document original (Ctrl+P / «Imprimeix»).
- **Rols**: `admin` i `orientador` editen; `docent` només veu les mesures (mai l'informe ni la conversa).

Stack: Vite + JavaScript, Firebase (Authentication + Firestore), desplegament a Vercel.

## 1. Provar-ho en local (sense Firebase)

```bash
npm install
npm run dev
```

Sense configurar res, funciona en **mode demostració** (dades al navegador). Fes servir només dades fictícies.

## 2. Crear el projecte Firebase (gratuït, pla Spark)

1. A <https://console.firebase.google.com> crea un projecte.
2. **Authentication → Sign-in method**: activa **Google**.
3. **Firestore Database → Crear base de dades**: tria una ubicació a la UE (per exemple `eur3` o `europe-west1`). Mode de producció.
4. **Configuració del projecte → Les teves aplicacions → Web (</>)**: registra l'app i copia la configuració.
5. Copia `.env.example` a `.env.local` i omple els valors (`VITE_FIREBASE_*`). Opcionalment posa el domini del centre a `VITE_ALLOWED_DOMAIN`.

## 3. Regles de seguretat

Enganxa el contingut de `firestore.rules` a **Firestore → Regles → Publica**.
(O amb la CLI: `npm i -g firebase-tools && firebase login && firebase use <projecte> && firebase deploy --only firestore:rules`.)

## 4. Donar d'alta el personal

Cap persona pot entrar si no té fitxa. A **Firestore → Inicia una col·lecció**:

- Col·lecció: `staff`
- ID del document: **el correu en minúscules** (p. ex. `orientadora@escola.cat`)
- Camp `role` (string): `admin`, `orientador` o `docent`

Comença amb la teva pròpia fitxa (`admin`) i afegeix-hi la resta. Les altes i els rols només es poden gestionar des de la consola.

## 5. GitHub i Vercel

```bash
git init && git add . && git commit -m "PSI"
git branch -M main
git remote add origin https://github.com/EL_TEU_USUARI/psi.git
git push -u origin main
```

1. A <https://vercel.com> → **Add New → Project** → importa el repositori. Vercel detecta Vite sol.
2. A **Environment Variables** afegeix les mateixes variables `VITE_*` de `.env.local`.
3. Desplega. Cada `push` a `main` redesplega automàticament.
4. A Firebase → **Authentication → Settings → Authorized domains**, afegeix el domini que t'ha donat Vercel (p. ex. `psi.vercel.app`).

**Recomanat**: a Vercel activa la protecció de contrasenya o d'accés al desplegament si el pla ho permet, i no publiquis l'URL.

## Format del CSV d'alumnat

Separador `;`, `,` o tabulador. Capçaleres reconegudes (majúscules i accents indiferents):

```
Cognoms;Nom;Data naixement;Curs;Grup;Tutor
Garcia Puig;Marc;12/03/2011;3r ESO;3B;Anna Vila
```

Si tornes a importar el fitxer, els alumnes que ja hi són s'actualitzen i conserven el seu pla (l'identificador surt del nom i la data de naixement).

## Model de dades (Firestore)

| Col·lecció | Contingut | Lectura | Escriptura |
|---|---|---|---|
| `staff/{email}` | rol de la persona | la pròpia persona | només consola |
| `settings/centre` | centre, director/a, curs | personal | admin, orientador |
| `students/{id}` | alumnat importat | personal | admin, orientador |
| `plans/{id}` | mesures, diagnòstic, signatura | personal | admin, orientador |
| `plansPrivate/{id}` | informe, conversa amb l'alumne/a, suport previ | admin, orientador | admin, orientador |

## Estructura del codi

```
src/catalog.js   diagnòstics, mesures universals/addicionals/intensives, preguntes de la conversa
src/store.js     capa de dades (Firebase o mode demostració)
src/main.js      interfície i lògica
src/style.css    estils (inclou la impressió)
firestore.rules  regles de seguretat
```

Per canviar mesures o preguntes, edita només `src/catalog.js`.

## Protecció de dades

Els informes de salut són dades de categoria especial (RGPD). Abans de fer-hi servir alumnat real:
consulta el DPD del centre o del Departament, comprova que Firebase (Google) consta com a encarregat de tractament,
i mantén la regió a la UE. Limita l'accés a comptes del centre i revisa periòdicament la col·lecció `staff`.
Aquesta aplicació no envia cap dada a serveis d'IA.

## Idees següents

Còpia dels plans a l'inici de curs, tauler de revisions trimestrals, enllaç per a la signatura de la família,
plantilles de mesures per perfil, historial de versions, exportació a Word.
