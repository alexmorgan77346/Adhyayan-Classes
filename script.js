/* ============================================================
   ADHYAYAN CLASSES — script.js  v4
   ============================================================ */

// Always start from home on fresh load (not hash restore)
history.replaceState(null, '', window.location.pathname);

// ── Language ─────────────────────────────────────────────────
let LANG = localStorage.getItem('adhyayan-lang') || 'hi';
function t(hi, en) { return LANG === 'hi' ? hi : en; }

function applyLang() {
  document.documentElement.lang = LANG === 'hi' ? 'hi' : 'en';
  document.querySelectorAll('[data-hi][data-en]').forEach(el => {
    el.textContent = el.dataset[LANG] || el.textContent;
  });
  document.getElementById('pillHi')?.classList.toggle('active', LANG === 'hi');
  document.getElementById('pillEn')?.classList.toggle('active', LANG === 'en');
}

function toggleLang() { setLang(LANG === 'hi' ? 'en' : 'hi'); }
function setLang(l) {
  LANG = l;
  localStorage.setItem('adhyayan-lang', LANG);
  applyLang();
  renderSubjectsGrid(selectedClass);
  if (currentSubject) renderPDFPanels(currentSubject.id, currentSubject.classKey, currentSection);
  updateClassDesc();
}

// ── Theme color meta (status bar) ────────────────────────────
const THEME_LIGHT_BG = '#f6f4ef';
const THEME_DARK_BG  = '#0f0e09';

function syncThemeColor(isDark) {
  const meta = document.getElementById('themeColorMeta');
  if (meta) meta.content = isDark ? THEME_DARK_BG : THEME_LIGHT_BG;
}

// ── Subject definitions ───────────────────────────────────────
// Each subject has an id, display info, and which class keys it belongs to.
// classKeys: '11','12','jee','neet'
// For JEE/NEET, PDFs come from both 11 and 12 combined.
const SUBJECTS_DEF = [
  { id:'physics',   name:'Physics',     nameHi:'भौतिक विज्ञान', emoji:'⚛', color:'#2d6be4', soft:'#e8effd', classes:['11','12','jee','neet'] },
  { id:'chemistry', name:'Chemistry',   nameHi:'रसायन विज्ञान', emoji:'🧪', color:'#27a264', soft:'#e5f7ef', classes:['11','12','jee','neet'] },
  { id:'maths',     name:'Mathematics', nameHi:'गणित',          emoji:'📐', color:'#e8611a', soft:'#fceee6', classes:['11','12','jee'] },
  { id:'biology',   name:'Biology',     nameHi:'जीव विज्ञान',   emoji:'🌿', color:'#7c44c4', soft:'#f0eafa', classes:['11','12','neet'] },
  { id:'english',   name:'English',     nameHi:'अंग्रेज़ी',     emoji:'📖', color:'#d4960a', soft:'#fef5dd', classes:['11','12'] },
  { id:'hindi',     name:'Hindi',       nameHi:'हिंदी',         emoji:'🔤', color:'#c0392b', soft:'#fce8e8', classes:['11','12'] },
];

const CLASS_META = {
  '11':  { hi:'11वीं बोर्ड',         en:'Class 11th',            desc:{ hi:'PHY · CHEM · MATHS · BIO · ENG · HIN', en:'PHY · CHEM · MATHS · BIO · ENG · HIN' } },
  '12':  { hi:'12वीं बोर्ड',         en:'Class 12th',            desc:{ hi:'PHY · CHEM · MATHS · BIO · ENG · HIN', en:'PHY · CHEM · MATHS · BIO · ENG · HIN' } },
  'jee': { hi:'JEE (Mains/Advanced)', en:'JEE (Mains/Advanced)',  desc:{ hi:'PHY + CHEM + MATHS (11वीं + 12वीं)', en:'PHY + CHEM + MATHS (11th + 12th)' } },
  'neet':{ hi:'NEET (UG)',            en:'NEET (UG)',              desc:{ hi:'PHY + CHEM + BIO (11वीं + 12वीं)',   en:'PHY + CHEM + BIO (11th + 12th)' } },
};

// ── NCERT PDF Data ─────────────────────────────────────────────
// Structure: PDF_DATA[subjectId][classKey][section] = [{name, nameHi, href}]
// For jee/neet pages we merge 11+12 data dynamically.

const PDF_DATA = {

  // ══════════════════════════════════════════
  //  PHYSICS
  // ══════════════════════════════════════════
  physics: {
    '11': {
      notes: [
        { name:'Ch 1 — Physical World',                nameHi:'अध्याय 1 — भौतिक जगत',                    href:'pdfs/physics/11/notes/ch01-physical-world.pdf' },
        { name:'Ch 2 — Units & Measurements',          nameHi:'अध्याय 2 — मात्रक और मापन',                href:'pdfs/physics/11/notes/ch02-units-measurements.pdf' },
        { name:'Ch 3 — Motion in a Straight Line',     nameHi:'अध्याय 3 — सरल रेखा में गति',              href:'pdfs/physics/11/notes/ch03-motion-straight-line.pdf' },
        { name:'Ch 4 — Motion in a Plane',             nameHi:'अध्याय 4 — समतल में गति',                  href:'pdfs/physics/11/notes/ch04-motion-plane.pdf' },
        { name:'Ch 5 — Laws of Motion',                nameHi:'अध्याय 5 — गति के नियम',                  href:'pdfs/physics/11/notes/ch05-laws-of-motion.pdf' },
        { name:'Ch 6 — Work, Energy & Power',          nameHi:'अध्याय 6 — कार्य, ऊर्जा और शक्ति',        href:'pdfs/physics/11/notes/ch06-work-energy-power.pdf' },
        { name:'Ch 7 — System of Particles & Rotational Motion', nameHi:'अध्याय 7 — कणों के निकाय व घूर्णन गति', href:'pdfs/physics/11/notes/ch07-rotational-motion.pdf' },
        { name:'Ch 8 — Gravitation',                   nameHi:'अध्याय 8 — गुरुत्वाकर्षण',                href:'pdfs/physics/11/notes/ch08-gravitation.pdf' },
        { name:'Ch 9 — Mechanical Properties of Solids', nameHi:'अध्याय 9 — ठोसों के यांत्रिक गुण',     href:'pdfs/physics/11/notes/ch09-mechanical-solids.pdf' },
        { name:'Ch 10 — Mechanical Properties of Fluids', nameHi:'अध्याय 10 — तरलों के यांत्रिक गुण',   href:'pdfs/physics/11/notes/ch10-mechanical-fluids.pdf' },
        { name:'Ch 11 — Thermal Properties of Matter', nameHi:'अध्याय 11 — द्रव्य के तापीय गुण',         href:'pdfs/physics/11/notes/ch11-thermal-properties.pdf' },
        { name:'Ch 12 — Thermodynamics',               nameHi:'अध्याय 12 — ऊष्मागतिकी',                 href:'pdfs/physics/11/notes/ch12-thermodynamics.pdf' },
        { name:'Ch 13 — Kinetic Theory',               nameHi:'अध्याय 13 — गैसों का अणुगति सिद्धांत',   href:'pdfs/physics/11/notes/ch13-kinetic-theory.pdf' },
        { name:'Ch 14 — Oscillations',                 nameHi:'अध्याय 14 — दोलन',                        href:'pdfs/physics/11/notes/ch14-oscillations.pdf' },
        { name:'Ch 15 — Waves',                        nameHi:'अध्याय 15 — तरंगें',                       href:'pdfs/physics/11/notes/ch15-waves.pdf' },
      ],
      formulas: [
        { name:'Kinematics Formulas',      nameHi:'गतिकी के फॉर्मूले',      href:'pdfs/physics/11/formulas/kinematics.pdf' },
        { name:'Laws of Motion Formulas',  nameHi:'गति के नियम फॉर्मूले',   href:'pdfs/physics/11/formulas/laws-motion.pdf' },
        { name:'Work Energy Formulas',     nameHi:'कार्य ऊर्जा फॉर्मूले',   href:'pdfs/physics/11/formulas/work-energy.pdf' },
        { name:'Rotational Motion Formulas', nameHi:'घूर्णन गति फॉर्मूले', href:'pdfs/physics/11/formulas/rotational.pdf' },
        { name:'Thermodynamics Formulas',  nameHi:'ऊष्मागतिकी फॉर्मूले',   href:'pdfs/physics/11/formulas/thermodynamics.pdf' },
        { name:'Waves & Oscillations Formulas', nameHi:'तरंग फॉर्मूले',    href:'pdfs/physics/11/formulas/waves.pdf' },
      ],
      diagrams: [
        { name:'Free Body Diagrams',       nameHi:'मुक्त पिंड आरेख',        href:'pdfs/physics/11/diagrams/fbd.pdf' },
        { name:'Projectile Motion',        nameHi:'प्रक्षेप्य गति आरेख',    href:'pdfs/physics/11/diagrams/projectile.pdf' },
        { name:'Wave Diagrams',            nameHi:'तरंग आरेख',               href:'pdfs/physics/11/diagrams/waves.pdf' },
      ],
      practice: [
        { name:'Kinematics Practice',      nameHi:'गतिकी अभ्यास',           href:'pdfs/physics/11/practice/kinematics.pdf' },
        { name:'Laws of Motion Practice',  nameHi:'गति नियम अभ्यास',        href:'pdfs/physics/11/practice/laws-motion.pdf' },
        { name:'Thermodynamics Practice',  nameHi:'ऊष्मागतिकी अभ्यास',     href:'pdfs/physics/11/practice/thermodynamics.pdf' },
      ],
    },
    '12': {
      notes: [
        { name:'Ch 1 — Electric Charges & Fields',      nameHi:'अध्याय 1 — वैद्युत आवेश तथा क्षेत्र',   href:'pdfs/physics/12/notes/ch01-electric-charges-fields.pdf' },
        { name:'Ch 2 — Electrostatic Potential & Capacitance', nameHi:'अध्याय 2 — स्थिरवैद्युत विभव तथा धारिता', href:'pdfs/physics/12/notes/ch02-electrostatic-potential.pdf' },
        { name:'Ch 3 — Current Electricity',            nameHi:'अध्याय 3 — विद्युत धारा',                href:'pdfs/physics/12/notes/ch03-current-electricity.pdf' },
        { name:'Ch 4 — Moving Charges & Magnetism',     nameHi:'अध्याय 4 — गतिमान आवेश और चुंबकत्व',    href:'pdfs/physics/12/notes/ch04-moving-charges-magnetism.pdf' },
        { name:'Ch 5 — Magnetism & Matter',             nameHi:'अध्याय 5 — चुंबकत्व एवं द्रव्य',        href:'pdfs/physics/12/notes/ch05-magnetism-matter.pdf' },
        { name:'Ch 6 — Electromagnetic Induction',      nameHi:'अध्याय 6 — वैद्युतचुंबकीय प्रेरण',      href:'pdfs/physics/12/notes/ch06-em-induction.pdf' },
        { name:'Ch 7 — Alternating Current',            nameHi:'अध्याय 7 — प्रत्यावर्ती धारा',           href:'pdfs/physics/12/notes/ch07-alternating-current.pdf' },
        { name:'Ch 8 — Electromagnetic Waves',          nameHi:'अध्याय 8 — वैद्युतचुंबकीय तरंगें',       href:'pdfs/physics/12/notes/ch08-em-waves.pdf' },
        { name:'Ch 9 — Ray Optics & Optical Instruments', nameHi:'अध्याय 9 — किरण प्रकाशिकी',           href:'pdfs/physics/12/notes/ch09-ray-optics.pdf' },
        { name:'Ch 10 — Wave Optics',                   nameHi:'अध्याय 10 — तरंग प्रकाशिकी',            href:'pdfs/physics/12/notes/ch10-wave-optics.pdf' },
        { name:'Ch 11 — Dual Nature of Radiation & Matter', nameHi:'अध्याय 11 — विकिरण तथा द्रव्य की द्वैत प्रकृति', href:'pdfs/physics/12/notes/ch11-dual-nature.pdf' },
        { name:'Ch 12 — Atoms',                         nameHi:'अध्याय 12 — परमाणु',                     href:'pdfs/physics/12/notes/ch12-atoms.pdf' },
        { name:'Ch 13 — Nuclei',                        nameHi:'अध्याय 13 — नाभिक',                      href:'pdfs/physics/12/notes/ch13-nuclei.pdf' },
        { name:'Ch 14 — Semiconductor Electronics',     nameHi:'अध्याय 14 — अर्धचालक इलेक्ट्रॉनिकी',    href:'pdfs/physics/12/notes/ch14-semiconductor.pdf' },
      ],
      formulas: [
        { name:'Electrostatics Formulas',  nameHi:'स्थिरवैद्युत फॉर्मूले',  href:'pdfs/physics/12/formulas/electrostatics.pdf' },
        { name:'Current Electricity Formulas', nameHi:'विद्युत धारा फॉर्मूले', href:'pdfs/physics/12/formulas/current.pdf' },
        { name:'Magnetism Formulas',       nameHi:'चुंबकत्व फॉर्मूले',       href:'pdfs/physics/12/formulas/magnetism.pdf' },
        { name:'Optics Formulas',          nameHi:'प्रकाशिकी फॉर्मूले',      href:'pdfs/physics/12/formulas/optics.pdf' },
        { name:'Modern Physics Formulas',  nameHi:'आधुनिक भौतिकी फॉर्मूले', href:'pdfs/physics/12/formulas/modern-physics.pdf' },
      ],
      diagrams: [
        { name:'Ray Diagrams — Lenses & Mirrors', nameHi:'किरण आरेख',       href:'pdfs/physics/12/diagrams/ray-diagrams.pdf' },
        { name:'Electric Circuit Diagrams',       nameHi:'विद्युत परिपथ',   href:'pdfs/physics/12/diagrams/circuits.pdf' },
        { name:'Logic Gates',                     nameHi:'लॉजिक गेट',       href:'pdfs/physics/12/diagrams/logic-gates.pdf' },
      ],
      practice: [
        { name:'Electrostatics Practice',  nameHi:'स्थिरवैद्युत अभ्यास',   href:'pdfs/physics/12/practice/electrostatics.pdf' },
        { name:'Current Electricity Practice', nameHi:'विद्युत धारा अभ्यास', href:'pdfs/physics/12/practice/current.pdf' },
        { name:'Optics Practice',          nameHi:'प्रकाशिकी अभ्यास',      href:'pdfs/physics/12/practice/optics.pdf' },
      ],
    },
  },

  // ══════════════════════════════════════════
  //  CHEMISTRY
  // ══════════════════════════════════════════
  chemistry: {
    '11': {
      notes: [
        { name:'Ch 1 — Some Basic Concepts of Chemistry', nameHi:'अध्याय 1 — रसायन विज्ञान की कुछ मूल अवधारणाएँ', href:'pdfs/chemistry/11/notes/ch01-basic-concepts.pdf' },
        { name:'Ch 2 — Structure of Atom',              nameHi:'अध्याय 2 — परमाणु की संरचना',               href:'pdfs/chemistry/11/notes/ch02-structure-atom.pdf' },
        { name:'Ch 3 — Classification of Elements & Periodicity', nameHi:'अध्याय 3 — तत्वों का वर्गीकरण',  href:'pdfs/chemistry/11/notes/ch03-classification.pdf' },
        { name:'Ch 4 — Chemical Bonding & Molecular Structure', nameHi:'अध्याय 4 — रासायनिक आबंधन',       href:'pdfs/chemistry/11/notes/ch04-chemical-bonding.pdf' },
        { name:'Ch 5 — States of Matter',               nameHi:'अध्याय 5 — द्रव्य की अवस्थाएँ',            href:'pdfs/chemistry/11/notes/ch05-states-matter.pdf' },
        { name:'Ch 6 — Thermodynamics',                 nameHi:'अध्याय 6 — ऊष्मागतिकी',                   href:'pdfs/chemistry/11/notes/ch06-thermodynamics.pdf' },
        { name:'Ch 7 — Equilibrium',                    nameHi:'अध्याय 7 — साम्यावस्था',                   href:'pdfs/chemistry/11/notes/ch07-equilibrium.pdf' },
        { name:'Ch 8 — Redox Reactions',                nameHi:'अध्याय 8 — अपचयोपचय अभिक्रियाएँ',          href:'pdfs/chemistry/11/notes/ch08-redox.pdf' },
        { name:'Ch 9 — Hydrogen',                       nameHi:'अध्याय 9 — हाइड्रोजन',                    href:'pdfs/chemistry/11/notes/ch09-hydrogen.pdf' },
        { name:'Ch 10 — The s-Block Elements',          nameHi:'अध्याय 10 — s-ब्लॉक तत्व',                href:'pdfs/chemistry/11/notes/ch10-s-block.pdf' },
        { name:'Ch 11 — The p-Block Elements',          nameHi:'अध्याय 11 — p-ब्लॉक तत्व',                href:'pdfs/chemistry/11/notes/ch11-p-block.pdf' },
        { name:'Ch 12 — Organic Chemistry — Basic Principles', nameHi:'अध्याय 12 — कार्बनिक रसायन के मूल सिद्धांत', href:'pdfs/chemistry/11/notes/ch12-organic-basics.pdf' },
        { name:'Ch 13 — Hydrocarbons',                  nameHi:'अध्याय 13 — हाइड्रोकार्बन',               href:'pdfs/chemistry/11/notes/ch13-hydrocarbons.pdf' },
        { name:'Ch 14 — Environmental Chemistry',       nameHi:'अध्याय 14 — पर्यावरणीय रसायन',            href:'pdfs/chemistry/11/notes/ch14-environmental.pdf' },
      ],
      formulas: [
        { name:'Mole Concept Formulas',    nameHi:'मोल संकल्पना फॉर्मूले',  href:'pdfs/chemistry/11/formulas/mole-concept.pdf' },
        { name:'Thermodynamics Formulas',  nameHi:'ऊष्मागतिकी फॉर्मूले',   href:'pdfs/chemistry/11/formulas/thermodynamics.pdf' },
        { name:'Equilibrium Formulas',     nameHi:'साम्य फॉर्मूले',         href:'pdfs/chemistry/11/formulas/equilibrium.pdf' },
        { name:'Organic Reactions Chart',  nameHi:'कार्बनिक अभिक्रिया चार्ट', href:'pdfs/chemistry/11/formulas/organic-reactions.pdf' },
      ],
      diagrams: [
        { name:'Periodic Table (Coloured)', nameHi:'आवर्त सारणी (रंगीन)',   href:'pdfs/chemistry/11/diagrams/periodic-table.pdf' },
        { name:'Orbital Shapes',           nameHi:'कक्षक आकृतियाँ',         href:'pdfs/chemistry/11/diagrams/orbitals.pdf' },
        { name:'Hybridization Diagrams',   nameHi:'संकरण आरेख',             href:'pdfs/chemistry/11/diagrams/hybridization.pdf' },
      ],
      practice: [
        { name:'Mole Concept Practice',    nameHi:'मोल संकल्पना अभ्यास',    href:'pdfs/chemistry/11/practice/mole-concept.pdf' },
        { name:'Chemical Bonding Practice', nameHi:'रासायनिक आबंधन अभ्यास', href:'pdfs/chemistry/11/practice/bonding.pdf' },
        { name:'Organic Chemistry Practice', nameHi:'कार्बनिक रसायन अभ्यास', href:'pdfs/chemistry/11/practice/organic.pdf' },
      ],
    },
    '12': {
      notes: [
        { name:'Ch 1 — The Solid State',                nameHi:'अध्याय 1 — ठोस अवस्था',                   href:'pdfs/chemistry/12/notes/ch01-solid-state.pdf' },
        { name:'Ch 2 — Solutions',                      nameHi:'अध्याय 2 — विलयन',                         href:'pdfs/chemistry/12/notes/ch02-solutions.pdf' },
        { name:'Ch 3 — Electrochemistry',               nameHi:'अध्याय 3 — वैद्युत रसायन',                 href:'pdfs/chemistry/12/notes/ch03-electrochemistry.pdf' },
        { name:'Ch 4 — Chemical Kinetics',              nameHi:'अध्याय 4 — रासायनिक बलगतिकी',              href:'pdfs/chemistry/12/notes/ch04-chemical-kinetics.pdf' },
        { name:'Ch 5 — Surface Chemistry',              nameHi:'अध्याय 5 — पृष्ठ रसायन',                   href:'pdfs/chemistry/12/notes/ch05-surface-chemistry.pdf' },
        { name:'Ch 6 — General Principles of Isolation of Elements', nameHi:'अध्याय 6 — तत्वों के निष्कर्षण के सिद्धांत', href:'pdfs/chemistry/12/notes/ch06-extraction.pdf' },
        { name:'Ch 7 — The p-Block Elements',           nameHi:'अध्याय 7 — p-ब्लॉक तत्व',                  href:'pdfs/chemistry/12/notes/ch07-p-block.pdf' },
        { name:'Ch 8 — The d & f Block Elements',       nameHi:'अध्याय 8 — d एवं f-ब्लॉक तत्व',            href:'pdfs/chemistry/12/notes/ch08-d-f-block.pdf' },
        { name:'Ch 9 — Coordination Compounds',         nameHi:'अध्याय 9 — उपसहसंयोजन यौगिक',             href:'pdfs/chemistry/12/notes/ch09-coordination.pdf' },
        { name:'Ch 10 — Haloalkanes & Haloarenes',      nameHi:'अध्याय 10 — हैलोऐल्केन तथा हैलोऐरीन',     href:'pdfs/chemistry/12/notes/ch10-haloalkanes.pdf' },
        { name:'Ch 11 — Alcohols, Phenols & Ethers',    nameHi:'अध्याय 11 — ऐल्कोहॉल, फ़िनॉल एवं ईथर',    href:'pdfs/chemistry/12/notes/ch11-alcohols.pdf' },
        { name:'Ch 12 — Aldehydes, Ketones & Carboxylic Acids', nameHi:'अध्याय 12 — ऐल्डिहाइड, कीटोन तथा कार्बोक्सिलिक अम्ल', href:'pdfs/chemistry/12/notes/ch12-carbonyl.pdf' },
        { name:'Ch 13 — Amines',                        nameHi:'अध्याय 13 — ऐमीन',                         href:'pdfs/chemistry/12/notes/ch13-amines.pdf' },
        { name:'Ch 14 — Biomolecules',                  nameHi:'अध्याय 14 — जैव अणु',                      href:'pdfs/chemistry/12/notes/ch14-biomolecules.pdf' },
        { name:'Ch 15 — Polymers',                      nameHi:'अध्याय 15 — बहुलक',                        href:'pdfs/chemistry/12/notes/ch15-polymers.pdf' },
        { name:'Ch 16 — Chemistry in Everyday Life',    nameHi:'अध्याय 16 — दैनिक जीवन में रसायन',         href:'pdfs/chemistry/12/notes/ch16-everyday-chemistry.pdf' },
      ],
      formulas: [
        { name:'Electrochemistry Formulas', nameHi:'वैद्युत रसायन फॉर्मूले', href:'pdfs/chemistry/12/formulas/electrochemistry.pdf' },
        { name:'Chemical Kinetics Formulas', nameHi:'बलगतिकी फॉर्मूले',     href:'pdfs/chemistry/12/formulas/kinetics.pdf' },
        { name:'Organic Name Reactions',    nameHi:'नामांकित अभिक्रियाएँ',   href:'pdfs/chemistry/12/formulas/name-reactions.pdf' },
        { name:'Coordination Chemistry',    nameHi:'उपसहसंयोजन रसायन',       href:'pdfs/chemistry/12/formulas/coordination.pdf' },
      ],
      diagrams: [
        { name:'Functional Groups Chart',  nameHi:'क्रियात्मक समूह चार्ट',   href:'pdfs/chemistry/12/diagrams/functional-groups.pdf' },
        { name:'Galvanic Cell Diagram',    nameHi:'गैल्वेनिक सेल',           href:'pdfs/chemistry/12/diagrams/galvanic-cell.pdf' },
      ],
      practice: [
        { name:'Electrochemistry Practice', nameHi:'वैद्युत रसायन अभ्यास', href:'pdfs/chemistry/12/practice/electrochemistry.pdf' },
        { name:'Organic Chemistry Practice', nameHi:'कार्बनिक रसायन अभ्यास', href:'pdfs/chemistry/12/practice/organic.pdf' },
        { name:'Coordination Compounds Practice', nameHi:'उपसहसंयोजन अभ्यास', href:'pdfs/chemistry/12/practice/coordination.pdf' },
      ],
    },
  },

  // ══════════════════════════════════════════
  //  MATHEMATICS
  // ══════════════════════════════════════════
  maths: {
    '11': {
      notes: [
        { name:'Ch 1 — Sets',                           nameHi:'अध्याय 1 — समुच्चय',                       href:'pdfs/maths/11/notes/ch01-sets.pdf' },
        { name:'Ch 2 — Relations & Functions',          nameHi:'अध्याय 2 — संबंध एवं फलन',                 href:'pdfs/maths/11/notes/ch02-relations-functions.pdf' },
        { name:'Ch 3 — Trigonometric Functions',        nameHi:'अध्याय 3 — त्रिकोणमितीय फलन',              href:'pdfs/maths/11/notes/ch03-trigonometric.pdf' },
        { name:'Ch 4 — Principle of Mathematical Induction', nameHi:'अध्याय 4 — गणितीय आगमन',            href:'pdfs/maths/11/notes/ch04-induction.pdf' },
        { name:'Ch 5 — Complex Numbers & Quadratic Equations', nameHi:'अध्याय 5 — सम्मिश्र संख्याएँ',    href:'pdfs/maths/11/notes/ch05-complex-quadratic.pdf' },
        { name:'Ch 6 — Linear Inequalities',            nameHi:'अध्याय 6 — रैखिक असमिकाएँ',               href:'pdfs/maths/11/notes/ch06-linear-inequalities.pdf' },
        { name:'Ch 7 — Permutations & Combinations',    nameHi:'अध्याय 7 — क्रमचय और संचय',                href:'pdfs/maths/11/notes/ch07-pnc.pdf' },
        { name:'Ch 8 — Binomial Theorem',               nameHi:'अध्याय 8 — द्विपद प्रमेय',                 href:'pdfs/maths/11/notes/ch08-binomial.pdf' },
        { name:'Ch 9 — Sequences & Series',             nameHi:'अध्याय 9 — अनुक्रम तथा श्रेणी',            href:'pdfs/maths/11/notes/ch09-sequences-series.pdf' },
        { name:'Ch 10 — Straight Lines',                nameHi:'अध्याय 10 — सरल रेखाएँ',                   href:'pdfs/maths/11/notes/ch10-straight-lines.pdf' },
        { name:'Ch 11 — Conic Sections',                nameHi:'अध्याय 11 — शंकु परिच्छेद',                href:'pdfs/maths/11/notes/ch11-conic-sections.pdf' },
        { name:'Ch 12 — Introduction to 3D Geometry',   nameHi:'अध्याय 12 — त्रिविमीय ज्यामिति का परिचय', href:'pdfs/maths/11/notes/ch12-3d-geometry.pdf' },
        { name:'Ch 13 — Limits & Derivatives',          nameHi:'अध्याय 13 — सीमा और अवकलज',               href:'pdfs/maths/11/notes/ch13-limits-derivatives.pdf' },
        { name:'Ch 14 — Mathematical Reasoning',        nameHi:'अध्याय 14 — गणितीय विवेचन',               href:'pdfs/maths/11/notes/ch14-mathematical-reasoning.pdf' },
        { name:'Ch 15 — Statistics',                    nameHi:'अध्याय 15 — सांख्यिकी',                    href:'pdfs/maths/11/notes/ch15-statistics.pdf' },
        { name:'Ch 16 — Probability',                   nameHi:'अध्याय 16 — प्रायिकता',                    href:'pdfs/maths/11/notes/ch16-probability.pdf' },
      ],
      formulas: [
        { name:'Trigonometry Formulas',    nameHi:'त्रिकोणमिति फॉर्मूले',    href:'pdfs/maths/11/formulas/trigonometry.pdf' },
        { name:'Algebra Formulas',         nameHi:'बीजगणित फॉर्मूले',        href:'pdfs/maths/11/formulas/algebra.pdf' },
        { name:'Sequence & Series',        nameHi:'अनुक्रम श्रेणी फॉर्मूले', href:'pdfs/maths/11/formulas/sequences.pdf' },
        { name:'Coordinate Geometry',      nameHi:'निर्देशांक ज्यामिति',     href:'pdfs/maths/11/formulas/coordinate.pdf' },
        { name:'Statistics & Probability', nameHi:'सांख्यिकी फॉर्मूले',     href:'pdfs/maths/11/formulas/statistics.pdf' },
      ],
      diagrams: [
        { name:'Unit Circle',              nameHi:'इकाई वृत्त',               href:'pdfs/maths/11/diagrams/unit-circle.pdf' },
        { name:'Conic Sections Diagrams',  nameHi:'शंकु परिच्छेद आरेख',       href:'pdfs/maths/11/diagrams/conic-sections.pdf' },
        { name:'Graph Transformations',    nameHi:'आलेख रूपांतरण',            href:'pdfs/maths/11/diagrams/graph-transformations.pdf' },
      ],
      practice: [
        { name:'Trigonometry Practice',    nameHi:'त्रिकोणमिति अभ्यास',      href:'pdfs/maths/11/practice/trigonometry.pdf' },
        { name:'Algebra Practice',         nameHi:'बीजगणित अभ्यास',          href:'pdfs/maths/11/practice/algebra.pdf' },
        { name:'Coordinate Geometry Practice', nameHi:'निर्देशांक ज्यामिति अभ्यास', href:'pdfs/maths/11/practice/coordinate.pdf' },
      ],
    },
    '12': {
      notes: [
        { name:'Ch 1 — Relations & Functions',          nameHi:'अध्याय 1 — संबंध एवं फलन',                 href:'pdfs/maths/12/notes/ch01-relations-functions.pdf' },
        { name:'Ch 2 — Inverse Trigonometric Functions', nameHi:'अध्याय 2 — प्रतिलोम त्रिकोणमितीय फलन',  href:'pdfs/maths/12/notes/ch02-inverse-trig.pdf' },
        { name:'Ch 3 — Matrices',                       nameHi:'अध्याय 3 — आव्यूह',                       href:'pdfs/maths/12/notes/ch03-matrices.pdf' },
        { name:'Ch 4 — Determinants',                   nameHi:'अध्याय 4 — सारणिक',                       href:'pdfs/maths/12/notes/ch04-determinants.pdf' },
        { name:'Ch 5 — Continuity & Differentiability', nameHi:'अध्याय 5 — सांतत्य तथा अवकलनीयता',        href:'pdfs/maths/12/notes/ch05-continuity-differentiability.pdf' },
        { name:'Ch 6 — Applications of Derivatives',   nameHi:'अध्याय 6 — अवकलज के अनुप्रयोग',            href:'pdfs/maths/12/notes/ch06-applications-derivatives.pdf' },
        { name:'Ch 7 — Integrals',                      nameHi:'अध्याय 7 — समाकलन',                       href:'pdfs/maths/12/notes/ch07-integrals.pdf' },
        { name:'Ch 8 — Applications of Integrals',     nameHi:'अध्याय 8 — समाकलन के अनुप्रयोग',          href:'pdfs/maths/12/notes/ch08-applications-integrals.pdf' },
        { name:'Ch 9 — Differential Equations',        nameHi:'अध्याय 9 — अवकल समीकरण',                  href:'pdfs/maths/12/notes/ch09-differential-equations.pdf' },
        { name:'Ch 10 — Vector Algebra',                nameHi:'अध्याय 10 — सदिश बीजगणित',                href:'pdfs/maths/12/notes/ch10-vector-algebra.pdf' },
        { name:'Ch 11 — Three Dimensional Geometry',   nameHi:'अध्याय 11 — त्रिविमीय ज्यामिति',           href:'pdfs/maths/12/notes/ch11-3d-geometry.pdf' },
        { name:'Ch 12 — Linear Programming',           nameHi:'अध्याय 12 — रैखिक प्रोग्रामन',             href:'pdfs/maths/12/notes/ch12-linear-programming.pdf' },
        { name:'Ch 13 — Probability',                  nameHi:'अध्याय 13 — प्रायिकता',                    href:'pdfs/maths/12/notes/ch13-probability.pdf' },
      ],
      formulas: [
        { name:'Calculus Formulas',        nameHi:'कलन फॉर्मूले',            href:'pdfs/maths/12/formulas/calculus.pdf' },
        { name:'Matrices & Determinants',  nameHi:'आव्यूह व सारणिक',         href:'pdfs/maths/12/formulas/matrices.pdf' },
        { name:'Vectors & 3D Geometry',    nameHi:'सदिश व त्रिविमीय ज्यामिति', href:'pdfs/maths/12/formulas/vectors-3d.pdf' },
        { name:'Integration Formulas',     nameHi:'समाकलन फॉर्मूले',         href:'pdfs/maths/12/formulas/integration.pdf' },
      ],
      diagrams: [
        { name:'Integration Graphs',       nameHi:'समाकलन आरेख',             href:'pdfs/maths/12/diagrams/integration.pdf' },
        { name:'3D Geometry Diagrams',     nameHi:'त्रिविमीय ज्यामिति',      href:'pdfs/maths/12/diagrams/3d-geometry.pdf' },
      ],
      practice: [
        { name:'Calculus Practice',        nameHi:'कलन अभ्यास',              href:'pdfs/maths/12/practice/calculus.pdf' },
        { name:'Matrices Practice',        nameHi:'आव्यूह अभ्यास',           href:'pdfs/maths/12/practice/matrices.pdf' },
        { name:'Probability Practice',     nameHi:'प्रायिकता अभ्यास',        href:'pdfs/maths/12/practice/probability.pdf' },
      ],
    },
  },

  // ══════════════════════════════════════════
  //  BIOLOGY
  // ══════════════════════════════════════════
  biology: {
    '11': {
      notes: [
        { name:'Ch 1 — The Living World',               nameHi:'अध्याय 1 — जीव जगत',                      href:'pdfs/biology/11/notes/ch01-living-world.pdf' },
        { name:'Ch 2 — Biological Classification',      nameHi:'अध्याय 2 — जीव जगत का वर्गीकरण',          href:'pdfs/biology/11/notes/ch02-classification.pdf' },
        { name:'Ch 3 — Plant Kingdom',                  nameHi:'अध्याय 3 — वनस्पति जगत',                   href:'pdfs/biology/11/notes/ch03-plant-kingdom.pdf' },
        { name:'Ch 4 — Animal Kingdom',                 nameHi:'अध्याय 4 — प्राणि जगत',                    href:'pdfs/biology/11/notes/ch04-animal-kingdom.pdf' },
        { name:'Ch 5 — Morphology of Flowering Plants', nameHi:'अध्याय 5 — पुष्पी पादपों की आकारिकी',      href:'pdfs/biology/11/notes/ch05-morphology.pdf' },
        { name:'Ch 6 — Anatomy of Flowering Plants',    nameHi:'अध्याय 6 — पुष्पी पादपों की शारीर रचना',  href:'pdfs/biology/11/notes/ch06-anatomy.pdf' },
        { name:'Ch 7 — Structural Organisation in Animals', nameHi:'अध्याय 7 — प्राणियों में संरचनात्मक संगठन', href:'pdfs/biology/11/notes/ch07-structural-animals.pdf' },
        { name:'Ch 8 — Cell: The Unit of Life',         nameHi:'अध्याय 8 — कोशिका: जीवन की इकाई',          href:'pdfs/biology/11/notes/ch08-cell.pdf' },
        { name:'Ch 9 — Biomolecules',                   nameHi:'अध्याय 9 — जैव अणु',                       href:'pdfs/biology/11/notes/ch09-biomolecules.pdf' },
        { name:'Ch 10 — Cell Cycle & Cell Division',    nameHi:'अध्याय 10 — कोशिका चक्र और कोशिका विभाजन', href:'pdfs/biology/11/notes/ch10-cell-division.pdf' },
        { name:'Ch 11 — Transport in Plants',           nameHi:'अध्याय 11 — पादपों में परिवहन',             href:'pdfs/biology/11/notes/ch11-transport-plants.pdf' },
        { name:'Ch 12 — Mineral Nutrition',             nameHi:'अध्याय 12 — खनिज पोषण',                   href:'pdfs/biology/11/notes/ch12-mineral-nutrition.pdf' },
        { name:'Ch 13 — Photosynthesis in Higher Plants', nameHi:'अध्याय 13 — उच्च पादपों में प्रकाश-संश्लेषण', href:'pdfs/biology/11/notes/ch13-photosynthesis.pdf' },
        { name:'Ch 14 — Respiration in Plants',         nameHi:'अध्याय 14 — पादप में श्वसन',               href:'pdfs/biology/11/notes/ch14-respiration-plants.pdf' },
        { name:'Ch 15 — Plant Growth & Development',    nameHi:'अध्याय 15 — पादप वृद्धि एवं परिवर्धन',    href:'pdfs/biology/11/notes/ch15-plant-growth.pdf' },
        { name:'Ch 16 — Digestion & Absorption',        nameHi:'अध्याय 16 — पाचन एवं अवशोषण',             href:'pdfs/biology/11/notes/ch16-digestion.pdf' },
        { name:'Ch 17 — Breathing & Exchange of Gases', nameHi:'अध्याय 17 — श्वास और गैसों का आदान-प्रदान', href:'pdfs/biology/11/notes/ch17-breathing.pdf' },
        { name:'Ch 18 — Body Fluids & Circulation',     nameHi:'अध्याय 18 — शरीर द्रव्य एवं परिसंचरण',    href:'pdfs/biology/11/notes/ch18-circulation.pdf' },
        { name:'Ch 19 — Excretory Products & Elimination', nameHi:'अध्याय 19 — उत्सर्जी उत्पाद एवं उनका निष्कासन', href:'pdfs/biology/11/notes/ch19-excretion.pdf' },
        { name:'Ch 20 — Locomotion & Movement',         nameHi:'अध्याय 20 — गमन एवं संचलन',               href:'pdfs/biology/11/notes/ch20-locomotion.pdf' },
        { name:'Ch 21 — Neural Control & Coordination', nameHi:'अध्याय 21 — तंत्रिकीय नियंत्रण एवं समन्वय', href:'pdfs/biology/11/notes/ch21-neural-control.pdf' },
        { name:'Ch 22 — Chemical Coordination & Integration', nameHi:'अध्याय 22 — रासायनिक समन्वय तथा एकीकरण', href:'pdfs/biology/11/notes/ch22-chemical-coordination.pdf' },
      ],
      formulas: [
        { name:'Important Bio Terms (11th)', nameHi:'महत्त्वपूर्ण परिभाषाएँ', href:'pdfs/biology/11/formulas/bio-terms.pdf' },
        { name:'Photosynthesis Equations',   nameHi:'प्रकाश-संश्लेषण समीकरण', href:'pdfs/biology/11/formulas/photosynthesis.pdf' },
        { name:'Cell Biology Summary',       nameHi:'कोशिका जीव विज्ञान',     href:'pdfs/biology/11/formulas/cell-biology.pdf' },
      ],
      diagrams: [
        { name:'Cell Organelles Diagram',    nameHi:'कोशिका अंगक आरेख',       href:'pdfs/biology/11/diagrams/cell-organelles.pdf' },
        { name:'Plant Morphology Diagrams',  nameHi:'पादप आकारिकी आरेख',      href:'pdfs/biology/11/diagrams/plant-morphology.pdf' },
        { name:'Animal Kingdom Charts',      nameHi:'प्राणि जगत चार्ट',       href:'pdfs/biology/11/diagrams/animal-kingdom.pdf' },
        { name:'Heart & Circulatory System', nameHi:'हृदय परिसंचरण तंत्र',    href:'pdfs/biology/11/diagrams/heart-circulation.pdf' },
      ],
      practice: [
        { name:'Cell Biology Practice',      nameHi:'कोशिका जीव विज्ञान अभ्यास', href:'pdfs/biology/11/practice/cell-biology.pdf' },
        { name:'Plant Kingdom Practice',     nameHi:'वनस्पति जगत अभ्यास',    href:'pdfs/biology/11/practice/plant-kingdom.pdf' },
        { name:'Human Physiology Practice',  nameHi:'मानव शरीर क्रिया विज्ञान अभ्यास', href:'pdfs/biology/11/practice/human-physiology.pdf' },
      ],
    },
    '12': {
      notes: [
        { name:'Ch 1 — Reproduction in Organisms',       nameHi:'अध्याय 1 — जीवों में जनन',                href:'pdfs/biology/12/notes/ch01-reproduction-organisms.pdf' },
        { name:'Ch 2 — Sexual Reproduction in Flowering Plants', nameHi:'अध्याय 2 — पुष्पी पादपों में लैंगिक जनन', href:'pdfs/biology/12/notes/ch02-sexual-reproduction.pdf' },
        { name:'Ch 3 — Human Reproduction',              nameHi:'अध्याय 3 — मानव जनन',                     href:'pdfs/biology/12/notes/ch03-human-reproduction.pdf' },
        { name:'Ch 4 — Reproductive Health',             nameHi:'अध्याय 4 — जनन स्वास्थ्य',                href:'pdfs/biology/12/notes/ch04-reproductive-health.pdf' },
        { name:'Ch 5 — Principles of Inheritance & Variation', nameHi:'अध्याय 5 — वंशागति तथा विविधता के सिद्धांत', href:'pdfs/biology/12/notes/ch05-inheritance.pdf' },
        { name:'Ch 6 — Molecular Basis of Inheritance',  nameHi:'अध्याय 6 — वंशागति के आणविक आधार',        href:'pdfs/biology/12/notes/ch06-molecular-inheritance.pdf' },
        { name:'Ch 7 — Evolution',                       nameHi:'अध्याय 7 — विकास',                        href:'pdfs/biology/12/notes/ch07-evolution.pdf' },
        { name:'Ch 8 — Human Health & Disease',          nameHi:'अध्याय 8 — मानव स्वास्थ्य तथा रोग',       href:'pdfs/biology/12/notes/ch08-health-disease.pdf' },
        { name:'Ch 9 — Strategies for Enhancement in Food Production', nameHi:'अध्याय 9 — खाद्य उत्पादन में वृद्धि', href:'pdfs/biology/12/notes/ch09-food-production.pdf' },
        { name:'Ch 10 — Microbes in Human Welfare',      nameHi:'अध्याय 10 — मानव कल्याण में सूक्ष्मजीव',  href:'pdfs/biology/12/notes/ch10-microbes.pdf' },
        { name:'Ch 11 — Biotechnology: Principles & Processes', nameHi:'अध्याय 11 — जैव प्रौद्योगिकी: सिद्धांत और प्रक्रियाएँ', href:'pdfs/biology/12/notes/ch11-biotechnology-principles.pdf' },
        { name:'Ch 12 — Biotechnology & Its Applications', nameHi:'अध्याय 12 — जैव प्रौद्योगिकी एवं उसके उपयोग', href:'pdfs/biology/12/notes/ch12-biotechnology-applications.pdf' },
        { name:'Ch 13 — Organisms & Populations',        nameHi:'अध्याय 13 — जीव और समष्टियाँ',            href:'pdfs/biology/12/notes/ch13-organisms-populations.pdf' },
        { name:'Ch 14 — Ecosystem',                      nameHi:'अध्याय 14 — पारिस्थितिक तंत्र',           href:'pdfs/biology/12/notes/ch14-ecosystem.pdf' },
        { name:'Ch 15 — Biodiversity & Conservation',    nameHi:'अध्याय 15 — जैव-विविधता एवं संरक्षण',     href:'pdfs/biology/12/notes/ch15-biodiversity.pdf' },
        { name:'Ch 16 — Environmental Issues',           nameHi:'अध्याय 16 — पर्यावरण के मुद्दे',           href:'pdfs/biology/12/notes/ch16-environmental-issues.pdf' },
      ],
      formulas: [
        { name:'Genetics Laws & Formulas',   nameHi:'आनुवंशिकी नियम',          href:'pdfs/biology/12/formulas/genetics.pdf' },
        { name:'Ecology Formulas',           nameHi:'पारिस्थितिकी फॉर्मूले',   href:'pdfs/biology/12/formulas/ecology.pdf' },
        { name:'Important 12th Bio Terms',   nameHi:'12वीं परिभाषाएँ',         href:'pdfs/biology/12/formulas/bio-terms.pdf' },
      ],
      diagrams: [
        { name:'DNA Structure & Replication', nameHi:'DNA संरचना',             href:'pdfs/biology/12/diagrams/dna-structure.pdf' },
        { name:'Genetics Diagrams',           nameHi:'आनुवंशिकी आरेख',         href:'pdfs/biology/12/diagrams/genetics.pdf' },
        { name:'Ecosystem Diagrams',          nameHi:'पारिस्थितिक तंत्र',      href:'pdfs/biology/12/diagrams/ecosystem.pdf' },
      ],
      practice: [
        { name:'Genetics Practice',          nameHi:'आनुवंशिकी अभ्यास',       href:'pdfs/biology/12/practice/genetics.pdf' },
        { name:'Reproduction Practice',      nameHi:'जनन अभ्यास',             href:'pdfs/biology/12/practice/reproduction.pdf' },
        { name:'Ecology Practice',           nameHi:'पारिस्थितिकी अभ्यास',    href:'pdfs/biology/12/practice/ecology.pdf' },
      ],
    },
  },

  // ══════════════════════════════════════════
  //  ENGLISH
  // ══════════════════════════════════════════
  english: {
    '11': {
      notes: [
        { name:'Hornbill — Prose & Poetry Notes',       nameHi:'हॉर्नबिल — गद्य व पद्य नोट्स',            href:'pdfs/english/11/notes/hornbill-notes.pdf' },
        { name:'Snapshots — Supplementary Notes',       nameHi:'स्नैपशॉट्स — अनुपूरक नोट्स',              href:'pdfs/english/11/notes/snapshots-notes.pdf' },
        { name:'Grammar — Articles & Determiners',      nameHi:'व्याकरण — आर्टिकल',                       href:'pdfs/english/11/notes/grammar-articles.pdf' },
        { name:'Grammar — Tenses',                      nameHi:'व्याकरण — काल',                            href:'pdfs/english/11/notes/grammar-tenses.pdf' },
        { name:'Grammar — Voice (Active/Passive)',       nameHi:'व्याकरण — वाच्य',                         href:'pdfs/english/11/notes/grammar-voice.pdf' },
        { name:'Writing — Formal Letters',              nameHi:'लेखन — औपचारिक पत्र',                     href:'pdfs/english/11/notes/writing-formal-letters.pdf' },
        { name:'Writing — Essay & Paragraph',           nameHi:'लेखन — निबंध',                            href:'pdfs/english/11/notes/writing-essay.pdf' },
      ],
      formulas: [
        { name:'Grammar Rules Chart',      nameHi:'व्याकरण नियम चार्ट',       href:'pdfs/english/11/formulas/grammar-rules.pdf' },
        { name:'Tense Table',              nameHi:'काल तालिका',                href:'pdfs/english/11/formulas/tense-table.pdf' },
        { name:'Active-Passive Rules',     nameHi:'वाच्य परिवर्तन नियम',      href:'pdfs/english/11/formulas/active-passive.pdf' },
      ],
      diagrams: [
        { name:'Sentence Structure Diagram', nameHi:'वाक्य संरचना',           href:'pdfs/english/11/diagrams/sentence-structure.pdf' },
        { name:'Parts of Speech',           nameHi:'शब्द भेद',                 href:'pdfs/english/11/diagrams/parts-of-speech.pdf' },
      ],
      practice: [
        { name:'Grammar Practice Set',     nameHi:'व्याकरण अभ्यास',           href:'pdfs/english/11/practice/grammar.pdf' },
        { name:'Reading Comprehension',    nameHi:'गद्यांश बोध अभ्यास',       href:'pdfs/english/11/practice/comprehension.pdf' },
        { name:'Letter Writing Practice',  nameHi:'पत्र लेखन अभ्यास',         href:'pdfs/english/11/practice/letter-writing.pdf' },
      ],
    },
    '12': {
      notes: [
        { name:'Flamingo — Prose & Poetry Notes',       nameHi:'फ्लेमिंगो — गद्य व पद्य नोट्स',           href:'pdfs/english/12/notes/flamingo-notes.pdf' },
        { name:'Vistas — Supplementary Notes',          nameHi:'विस्टास — अनुपूरक नोट्स',                 href:'pdfs/english/12/notes/vistas-notes.pdf' },
        { name:'Grammar — Reported Speech',             nameHi:'व्याकरण — अप्रत्यक्ष कथन',               href:'pdfs/english/12/notes/grammar-reported-speech.pdf' },
        { name:'Grammar — Clauses',                     nameHi:'व्याकरण — उपवाक्य',                       href:'pdfs/english/12/notes/grammar-clauses.pdf' },
        { name:'Writing — Notice & Advertisement',      nameHi:'लेखन — सूचना व विज्ञापन',                  href:'pdfs/english/12/notes/writing-notice.pdf' },
        { name:'Writing — Report Writing',              nameHi:'लेखन — रिपोर्ट लेखन',                     href:'pdfs/english/12/notes/writing-report.pdf' },
        { name:'Writing — Debate & Speech',             nameHi:'लेखन — वाद-विवाद',                        href:'pdfs/english/12/notes/writing-debate.pdf' },
      ],
      formulas: [
        { name:'Reported Speech Rules',    nameHi:'अप्रत्यक्ष कथन नियम',      href:'pdfs/english/12/formulas/reported-speech.pdf' },
        { name:'Grammar Quick Reference',  nameHi:'व्याकरण त्वरित संदर्भ',    href:'pdfs/english/12/formulas/grammar-reference.pdf' },
      ],
      diagrams: [
        { name:'Writing Formats',          nameHi:'लेखन प्रारूप',              href:'pdfs/english/12/diagrams/writing-formats.pdf' },
      ],
      practice: [
        { name:'Grammar Practice Set',     nameHi:'व्याकरण अभ्यास',           href:'pdfs/english/12/practice/grammar.pdf' },
        { name:'Reading Comprehension',    nameHi:'गद्यांश बोध अभ्यास',       href:'pdfs/english/12/practice/comprehension.pdf' },
        { name:'Writing Skills Practice',  nameHi:'लेखन कौशल अभ्यास',         href:'pdfs/english/12/practice/writing.pdf' },
      ],
    },
  },

  // ══════════════════════════════════════════
  //  HINDI
  // ══════════════════════════════════════════
  hindi: {
    '11': {
      notes: [
        { name:'Aroh Bhag 1 — Gadya Khand Notes',       nameHi:'आरोह भाग 1 — गद्य खंड नोट्स',            href:'pdfs/hindi/11/notes/aroh-gadya.pdf' },
        { name:'Aroh Bhag 1 — Padya Khand Notes',       nameHi:'आरोह भाग 1 — पद्य खंड नोट्स',            href:'pdfs/hindi/11/notes/aroh-padya.pdf' },
        { name:'Vitan Bhag 1 — Notes',                  nameHi:'वितान भाग 1 — नोट्स',                     href:'pdfs/hindi/11/notes/vitan.pdf' },
        { name:'व्याकरण — अलंकार',                     nameHi:'व्याकरण — अलंकार',                        href:'pdfs/hindi/11/notes/alankar.pdf' },
        { name:'व्याकरण — छंद',                        nameHi:'व्याकरण — छंद',                            href:'pdfs/hindi/11/notes/chhand.pdf' },
        { name:'व्याकरण — समास',                       nameHi:'व्याकरण — समास',                           href:'pdfs/hindi/11/notes/samas.pdf' },
        { name:'व्याकरण — संधि',                       nameHi:'व्याकरण — संधि',                           href:'pdfs/hindi/11/notes/sandhi.pdf' },
        { name:'लेखन — पत्र लेखन',                    nameHi:'लेखन — पत्र लेखन',                         href:'pdfs/hindi/11/notes/patra-lekhan.pdf' },
        { name:'लेखन — निबंध लेखन',                   nameHi:'लेखन — निबंध लेखन',                        href:'pdfs/hindi/11/notes/nibandh-lekhan.pdf' },
      ],
      formulas: [
        { name:'व्याकरण सारांश',                        nameHi:'व्याकरण सारांश',                          href:'pdfs/hindi/11/formulas/grammar-summary.pdf' },
        { name:'अलंकार चार्ट',                          nameHi:'अलंकार चार्ट',                            href:'pdfs/hindi/11/formulas/alankar-chart.pdf' },
        { name:'छंद पहचान चार्ट',                       nameHi:'छंद पहचान चार्ट',                         href:'pdfs/hindi/11/formulas/chhand-chart.pdf' },
      ],
      diagrams: [
        { name:'समास आरेख',                             nameHi:'समास आरेख',                               href:'pdfs/hindi/11/diagrams/samas.pdf' },
        { name:'संधि तालिका',                           nameHi:'संधि तालिका',                             href:'pdfs/hindi/11/diagrams/sandhi.pdf' },
      ],
      practice: [
        { name:'व्याकरण अभ्यास',                       nameHi:'व्याकरण अभ्यास',                          href:'pdfs/hindi/11/practice/grammar.pdf' },
        { name:'पद्यांश अभ्यास',                       nameHi:'पद्यांश अभ्यास',                          href:'pdfs/hindi/11/practice/poetry.pdf' },
        { name:'पत्र लेखन अभ्यास',                    nameHi:'पत्र लेखन अभ्यास',                         href:'pdfs/hindi/11/practice/letter.pdf' },
      ],
    },
    '12': {
      notes: [
        { name:'Aroh Bhag 2 — Gadya Khand Notes',       nameHi:'आरोह भाग 2 — गद्य खंड नोट्स',            href:'pdfs/hindi/12/notes/aroh-gadya.pdf' },
        { name:'Aroh Bhag 2 — Padya Khand Notes',       nameHi:'आरोह भाग 2 — पद्य खंड नोट्स',            href:'pdfs/hindi/12/notes/aroh-padya.pdf' },
        { name:'Vitan Bhag 2 — Notes',                  nameHi:'वितान भाग 2 — नोट्स',                     href:'pdfs/hindi/12/notes/vitan.pdf' },
        { name:'व्याकरण — वाक्य संरचना',              nameHi:'व्याकरण — वाक्य संरचना',                   href:'pdfs/hindi/12/notes/vakya-sanrachna.pdf' },
        { name:'व्याकरण — शब्द शक्ति',                nameHi:'व्याकरण — शब्द शक्ति',                    href:'pdfs/hindi/12/notes/shabd-shakti.pdf' },
        { name:'लेखन — विज्ञापन लेखन',               nameHi:'लेखन — विज्ञापन लेखन',                     href:'pdfs/hindi/12/notes/vigyapan.pdf' },
        { name:'लेखन — कार्यालयी पत्र',              nameHi:'लेखन — कार्यालयी पत्र',                    href:'pdfs/hindi/12/notes/office-letter.pdf' },
        { name:'लेखन — रिपोर्ट / वार्ता',            nameHi:'लेखन — रिपोर्ट / वार्ता',                  href:'pdfs/hindi/12/notes/report-varta.pdf' },
      ],
      formulas: [
        { name:'12वीं व्याकरण सारांश',                 nameHi:'12वीं व्याकरण सारांश',                    href:'pdfs/hindi/12/formulas/grammar-summary.pdf' },
        { name:'काव्य गुण व दोष',                      nameHi:'काव्य गुण व दोष',                         href:'pdfs/hindi/12/formulas/kavya-gun-dosh.pdf' },
      ],
      diagrams: [
        { name:'लेखन प्रारूप चार्ट',                  nameHi:'लेखन प्रारूप चार्ट',                       href:'pdfs/hindi/12/diagrams/lekhan-prarup.pdf' },
      ],
      practice: [
        { name:'व्याकरण अभ्यास (12वीं)',              nameHi:'व्याकरण अभ्यास (12वीं)',                   href:'pdfs/hindi/12/practice/grammar.pdf' },
        { name:'निबंध अभ्यास',                         nameHi:'निबंध अभ्यास',                            href:'pdfs/hindi/12/practice/nibandh.pdf' },
        { name:'अपठित गद्यांश अभ्यास',               nameHi:'अपठित गद्यांश अभ्यास',                     href:'pdfs/hindi/12/practice/apathit.pdf' },
      ],
    },
  },
};

const SECTION_META = {
  notes:    { icon:'📝', label:'Notes',    labelHi:'नोट्स' },
  formulas: { icon:'📐', label:'Formulas', labelHi:'फॉर्मूले' },
  diagrams: { icon:'🖼',  label:'Diagrams', labelHi:'डायग्राम' },
  practice: { icon:'✏️', label:'Practice', labelHi:'अभ्यास' },
};

// ── State ─────────────────────────────────────────────────────
let currentSubject  = null;   // { id, classKey } — classKey = '11','12','jee','neet'
let currentSection  = 'notes';
let selectedClass   = localStorage.getItem('adhyayan-class') || '11';

// ── Loader ────────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    initApp();
  }, 1500);
});

// ── Init ──────────────────────────────────────────────────────
function initApp() {
  const savedTheme = localStorage.getItem('adhyayan-theme') || 'light';
  document.documentElement.dataset.theme = savedTheme;
  syncDarkUI(savedTheme === 'dark');
  syncThemeColor(savedTheme === 'dark');

  applyLang();
  renderSubjectsGrid(selectedClass);
  syncClassTabs(selectedClass);
  updateClassDesc();

  // Always start at home on load
  navigate('home', false);
}

// ── Routing ───────────────────────────────────────────────────
function navigate(page, push = true) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === page));
  if (push) history.pushState({ page }, '', window.location.pathname);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeMenu();
}

function openSubject(subjectId, classKey) {
  const def = SUBJECTS_DEF.find(s => s.id === subjectId);
  if (!def) return;
  currentSubject = { id: subjectId, classKey };
  currentSection = 'notes';

  document.getElementById('subjectIcon').textContent = def.emoji;
  document.getElementById('subjectTitle').textContent = LANG === 'hi' ? def.nameHi : def.name;

  // For JEE/NEET show combined class label
  let descStr = '';
  if (classKey === 'jee')  descStr = t('JEE — 11वीं + 12वीं संयुक्त', 'JEE — Combined Class 11 + 12');
  else if (classKey === 'neet') descStr = t('NEET — 11वीं + 12वीं संयुक्त', 'NEET — Combined Class 11 + 12');
  else descStr = t(`कक्षा ${classKey === '11' ? '11वीं' : '12वीं'}`, `Class ${classKey}th`);
  document.getElementById('subjectDesc').textContent = descStr;

  const heroEl = document.getElementById('subjectHero');
  heroEl.style.borderBottom = `3px solid ${def.color}`;

  // Reset tabs
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.tab-btn[data-section="notes"]').classList.add('active');

  renderPDFPanels(subjectId, classKey, 'notes');

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-subject').classList.add('active');
  history.pushState({ page: 'subject', subjectId, classKey }, '', window.location.pathname);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Handle browser back
window.addEventListener('popstate', e => {
  const state = e.state;
  if (!state || state.page === 'home') { navigate('home', false); return; }
  if (state.page === 'subjects') { navigate('subjects', false); return; }
  if (state.page === 'subject' && state.subjectId) {
    openSubject(state.subjectId, state.classKey || selectedClass);
  }
});

// ── Class switching ───────────────────────────────────────────
function switchClass(btn, cls) {
  selectedClass = cls;
  localStorage.setItem('adhyayan-class', cls);
  syncClassTabs(cls);
  syncSettingsGrid();
  updateClassDesc();
  renderSubjectsGrid(cls);
}

function syncClassTabs(cls) {
  document.querySelectorAll('.ctab').forEach(b => b.classList.toggle('active', b.dataset.class === cls));
}

function updateClassDesc() {
  const meta = CLASS_META[selectedClass];
  const el = document.getElementById('classDesc');
  if (el) el.textContent = LANG === 'hi' ? meta.desc.hi : meta.desc.en;
}

// Settings — set default class
function setDefaultClass(btn, cls) {
  selectedClass = cls;
  localStorage.setItem('adhyayan-class', cls);
  syncClassTabs(cls);
  syncSettingsGrid();
  updateClassDesc();
  renderSubjectsGrid(cls);
}
function syncSettingsGrid() {
  document.querySelectorAll('#settingClassGrid .scg-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.class === selectedClass);
  });
}

// ── Render subjects grid ──────────────────────────────────────
function renderSubjectsGrid(cls) {
  const grid = document.getElementById('subjectsGrid');
  const filtered = SUBJECTS_DEF.filter(s => s.classes.includes(cls));
  const clsLabel = LANG === 'hi' ? CLASS_META[cls].hi : CLASS_META[cls].en;

  if (!filtered.length) {
    grid.innerHTML = `<div class="no-results" style="grid-column:1/-1"><span>📂</span>${t('कोई विषय नहीं','No subjects')}</div>`;
    return;
  }
  grid.innerHTML = filtered.map((s, i) => {
    const name  = LANG === 'hi' ? s.nameHi : s.name;
    const hasPdfs11 = PDF_DATA[s.id]?.['11'];
    const hasPdfs12 = PDF_DATA[s.id]?.['12'];
    let subInfo = '';
    if (cls === 'jee' || cls === 'neet') {
      subInfo = t('11वीं + 12वीं मिलाकर', '11th + 12th Combined');
    } else {
      const pData = PDF_DATA[s.id]?.[cls];
      const notesCount = pData?.notes?.length || 0;
      subInfo = t(`${notesCount} अध्याय`, `${notesCount} Chapters`);
    }
    return `
      <div class="subject-card"
           style="--card-color:${s.color};--card-soft:${s.soft};animation-delay:${i*.06}s"
           onclick="openSubject('${s.id}','${cls}')">
        <div class="subject-class-badge">${clsLabel}</div>
        <div class="subject-emoji">${s.emoji}</div>
        <div class="subject-name">${name}</div>
        <div class="subject-info">${subInfo}</div>
        <div class="subject-tags">
          <span class="subject-tag">📝 ${t('नोट्स','Notes')}</span>
          <span class="subject-tag">📐 ${t('फॉर्मूले','Formulas')}</span>
        </div>
      </div>`;
  }).join('');
}

// ── Render PDF panels ─────────────────────────────────────────
// For JEE/NEET merge 11+12 content
function getPDFsForClassKey(subjectId, classKey, section) {
  const subData = PDF_DATA[subjectId];
  if (!subData) return [];
  if (classKey === '11' || classKey === '12') {
    return subData[classKey]?.[section] || [];
  }
  // JEE / NEET: combine 11 + 12
  const d11 = (subData['11']?.[section] || []).map(p => ({...p, _class:'11'}));
  const d12 = (subData['12']?.[section] || []).map(p => ({...p, _class:'12'}));
  return [...d11, ...d12];
}

function renderPDFPanels(subjectId, classKey, activeSection) {
  const container = document.getElementById('pdfPanels');
  container.innerHTML = Object.entries(SECTION_META).map(([key, meta]) => {
    const pdfs  = getPDFsForClassKey(subjectId, classKey, key);
    const label = LANG === 'hi' ? meta.labelHi : meta.label;
    const isJeeNeet = classKey === 'jee' || classKey === 'neet';
    return `
      <div class="pdf-panel ${key === activeSection ? 'active' : ''}" id="panel-${key}">
        <div class="panel-header">
          <div class="panel-icon">${meta.icon}</div>
          <div class="panel-title">${label}</div>
          <span class="panel-count">${pdfs.length} ${t('फाइलें','files')}</span>
        </div>
        <div class="pdf-list">
          ${pdfs.length
            ? pdfs.map((pdf, i) => (window.pdfCardHTML || pdfCardHTML)(pdf, i, isJeeNeet)).join('')
            : `<div class="no-results"><span>📁</span>${t('अभी कोई फाइल नहीं','No files yet')}</div>`}
        </div>
      </div>`;
  }).join('');
}

function switchTab(btn, section) {
  currentSection = section;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.pdf-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + section).classList.add('active');
}

// ── PDF card ──────────────────────────────────────────────────
function pdfCardHTML(pdf, index, showClassBadge = false) {
  const name = LANG === 'hi' ? (pdf.nameHi || pdf.name) : pdf.name;
  const safeName = name.replace(/'/g, "\\'");
  const badge = showClassBadge && pdf._class
    ? `<span style="display:inline-block;background:var(--accent-soft);color:var(--accent);font-size:.62rem;font-weight:700;padding:.1rem .42rem;border-radius:4px;margin-right:.35rem;">${pdf._class === '11' ? t('11वीं','11th') : t('12वीं','12th')}</span>`
    : '';
  return `
    <div class="pdf-card" style="animation-delay:${index*.035}s">
      <div class="pdf-icon">📄</div>
      <div class="pdf-info">
        <div class="pdf-name" title="${name}">${badge}${name}</div>
        <div class="pdf-meta">PDF</div>
      </div>
      <div class="pdf-card-actions">
        <button class="btn-open" onclick="openPdfViewer('${pdf.href}','${safeName}',event)">${t('खोलें','Open')} →</button>
      </div>
    </div>`;
}

// ── Dark mode ─────────────────────────────────────────────────
function toggleDark() {
  const isDark = document.documentElement.dataset.theme === 'dark';
  applyTheme(!isDark);
}
function applyTheme(isDark) {
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  localStorage.setItem('adhyayan-theme', isDark ? 'dark' : 'light');
  syncDarkUI(isDark);
  syncThemeColor(isDark);
}
function syncDarkUI(isDark) {
  document.getElementById('darkPill')?.classList.toggle('on', isDark);
}

// ── Modals ────────────────────────────────────────────────────
function openModal(id) {
  // Sync settings state before opening
  if (id === 'settingsModal') {
    syncSettingsGrid();
    const isDark = document.documentElement.dataset.theme === 'dark';
    document.getElementById('darkPill')?.classList.toggle('on', isDark);
    document.getElementById('pillHi')?.classList.toggle('active', LANG === 'hi');
    document.getElementById('pillEn')?.classList.toggle('active', LANG === 'en');
  }
  document.getElementById(id).classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  document.getElementById(id).classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    // Close PDF viewer
    if (document.getElementById('pdfViewerWrap')?.classList.contains('open')) {
      closePdfViewer(); return;
    }
    // Close sidebar
    if (document.getElementById('sidebar')?.classList.contains('open')) {
      closeSidebar(); return;
    }
    // Close modals
    document.querySelectorAll('.modal-overlay.open').forEach(m => {
      m.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
});

// ── Cache clear ───────────────────────────────────────────────
function clearCache() {
  if ('caches' in window) {
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))).then(() => {
      alert(t('Cache साफ़ हो गया! App reload हो रहा है...', 'Cache cleared! App is reloading...'));
      location.reload();
    });
  } else {
    alert(t('Cache साफ़ हो गया', 'Cache cleared'));
  }
}

// ── Sidebar ───────────────────────────────────────────────────
function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ── PDF.js Viewer ─────────────────────────────────────────────
// Uses Mozilla PDF.js (loaded from CDN in <head>) to render PDFs
// on a <canvas> — works on every device including mobile.

const PDFJS_WORKER = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

let _pdfDoc       = null;   // loaded PDFDocumentProxy
let _pdfPage      = 1;      // current page number
let _pdfScale     = 1.0;    // user zoom multiplier (1 = fit-width)
let _pdfRendering = false;  // render lock
let _pdfPending   = null;   // queued page while rendering
let _pdfHref      = '';

function _pdfEl(id) { return document.getElementById(id); }

// ── Show/hide internal states ─────────────────────────────────
function _pdfShowState(state) {
  // state: 'loading' | 'error' | 'canvas'
  _pdfEl('pdfLoading').style.display   = state === 'loading' ? 'flex' : 'none';
  _pdfEl('pdfLoadError').style.display = state === 'error'   ? 'flex' : 'none';
  _pdfEl('pdfCanvas').style.display    = state === 'canvas'  ? 'block': 'none';
}

// ── Open viewer ───────────────────────────────────────────────
function openPdfViewer(href, title, e) {
  if (e) e.preventDefault();
  _pdfHref  = href;
  _pdfPage  = 1;
  _pdfScale = 1.0;
  _pdfDoc   = null;

  // Initialise PDF.js worker (idempotent)
  if (window.pdfjsLib) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
  }

  // UI setup
  _pdfEl('pdfViewerTitle').textContent = title || 'PDF';
  const sub = _pdfEl('pdfViewerSubtitle');
  if (sub) sub.textContent = href.split('/').pop().replace('.pdf','').replace(/[-_]/g,' ') || 'Document';
  _pdfEl('pdfViewerExtLink').href      = href;
  _pdfEl('pdfErrLink').href            = href;
  _pdfEl('pdfPageNum').textContent     = '—';
  _pdfEl('pdfPageCount').textContent   = '—';
  _pdfEl('pdfZoomLabel').textContent   = '100%';
  _pdfEl('pdfPrevBtn').disabled        = true;
  _pdfEl('pdfNextBtn').disabled        = true;
  _pdfEl('pdfControlsBar').style.opacity = '0';

  _pdfShowState('loading');
  _pdfEl('pdfViewerWrap').classList.add('open');
  document.body.style.overflow = 'hidden';

  // Load PDF
  if (!window.pdfjsLib) {
    _pdfShowState('error'); return;
  }
  pdfjsLib.getDocument({ url: href, cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/', cMapPacked: true })
    .promise
    .then(doc => {
      _pdfDoc = doc;
      _pdfEl('pdfPageCount').textContent = doc.numPages;
      _pdfEl('pdfControlsBar').style.opacity = '1';
      _pdfRenderPage(1);
    })
    .catch(err => {
      console.error('PDF load error:', err);
      _pdfShowState('error');
    });
}

// ── Render a page ─────────────────────────────────────────────
async function _pdfRenderPage(num) {
  if (_pdfRendering) { _pdfPending = num; return; }
  _pdfRendering = true;
  _pdfShowState('loading');

  try {
    const page      = await _pdfDoc.getPage(num);
    const wrap      = _pdfEl('pdfCanvasWrap');
    const canvas    = _pdfEl('pdfCanvas');
    const ctx       = canvas.getContext('2d');

    // Fit page to container width, then apply user zoom
    const padded    = Math.max(wrap.clientWidth - 24, 200);
    const vp0       = page.getViewport({ scale: 1 });
    const fitScale  = padded / vp0.width;
    const finalScale = fitScale * _pdfScale;
    const viewport  = page.getViewport({ scale: finalScale });

    // HiDPI rendering
    const dpr       = window.devicePixelRatio || 1;
    canvas.width    = viewport.width  * dpr;
    canvas.height   = viewport.height * dpr;
    canvas.style.width  = viewport.width  + 'px';
    canvas.style.height = viewport.height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    await page.render({ canvasContext: ctx, viewport }).promise;

    _pdfPage = num;
    _pdfEl('pdfPageNum').textContent  = num;
    _pdfEl('pdfPrevBtn').disabled     = num <= 1;
    _pdfEl('pdfNextBtn').disabled     = num >= _pdfDoc.numPages;
    _pdfEl('pdfZoomLabel').textContent = Math.round(_pdfScale * 100) + '%';
    wrap.scrollTop = 0;
    _pdfShowState('canvas');

  } catch(err) {
    console.error('Render error:', err);
    _pdfShowState('error');
  }

  _pdfRendering = false;
  if (_pdfPending !== null) {
    const p = _pdfPending; _pdfPending = null; _pdfRenderPage(p);
  }
}

// ── Controls ──────────────────────────────────────────────────
function pdfPrevPage() { if (_pdfPage > 1) _pdfRenderPage(_pdfPage - 1); }
function pdfNextPage() { if (_pdfDoc && _pdfPage < _pdfDoc.numPages) _pdfRenderPage(_pdfPage + 1); }
function pdfZoomIn()   { _pdfScale = Math.min(_pdfScale + 0.25, 3);    _pdfRenderPage(_pdfPage); }
function pdfZoomOut()  { _pdfScale = Math.max(_pdfScale - 0.25, 0.5);  _pdfRenderPage(_pdfPage); }

function closePdfViewer() {
  _pdfEl('pdfViewerWrap').classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(() => {
    _pdfDoc = null;
    _pdfShowState('loading');
    const c = _pdfEl('pdfCanvas');
    const ctx = c?.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, c.width, c.height);
  }, 380);
}

// ── Touch swipe for page navigation ──────────────────────────
(function() {
  let _tx = 0;
  document.addEventListener('touchstart', e => {
    if (!document.getElementById('pdfViewerWrap')?.classList.contains('open')) return;
    _tx = e.touches[0].clientX;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    if (!document.getElementById('pdfViewerWrap')?.classList.contains('open')) return;
    const dx = e.changedTouches[0].clientX - _tx;
    if (Math.abs(dx) > 60) { dx < 0 ? pdfNextPage() : pdfPrevPage(); }
  }, { passive: true });
})();

// ── Mobile menu ───────────────────────────────────────────────
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  const btn  = document.getElementById('hamburger');
  const open = menu.classList.toggle('open');
  btn.classList.toggle('open', open);
}
function closeMenu() {
  document.getElementById('mobileMenu')?.classList.remove('open');
  document.getElementById('hamburger')?.classList.remove('open');
}

// ── Scroll shadow ─────────────────────────────────────────────
window.addEventListener('scroll', () => {
  document.getElementById('navbar').style.boxShadow =
    window.scrollY > 6 ? '0 2px 16px rgba(0,0,0,.1)' : 'none';
}, { passive: true });

// ── Expose globals ────────────────────────────────────────────
window.navigate           = navigate;
window.openSubject        = openSubject;
window.switchClass        = switchClass;
window.setDefaultClass    = setDefaultClass;
window.filterSubjectsByClass = switchClass; // alias
window.switchTab          = switchTab;
window.toggleDark         = toggleDark;
window.toggleLang         = toggleLang;
window.setLang            = setLang;
window.openModal          = openModal;
window.closeModal         = closeModal;
window.clearCache         = clearCache;
window.toggleMenu         = toggleMenu;
window.closeMenu          = closeMenu;
window.openSidebar        = openSidebar;
window.closeSidebar       = closeSidebar;
window.openPdfViewer      = openPdfViewer;
window.closePdfViewer     = closePdfViewer;
window.pdfPrevPage        = pdfPrevPage;
window.pdfNextPage        = pdfNextPage;
window.pdfZoomIn          = pdfZoomIn;
window.pdfZoomOut         = pdfZoomOut;
// Admin stubs (overridden by admin script module)
window.adminLoadCodes     = window.adminLoadCodes  || function(){};
window.adminAddCode       = window.adminAddCode    || function(){};
window.adminToggleCode    = window.adminToggleCode || function(){};
window.adminDeleteCode    = window.adminDeleteCode || function(){};

// ── Auth integration: expose internals ───────────────────────
window.pdfCardHTML     = pdfCardHTML;
window.renderPDFPanels = renderPDFPanels;

Object.defineProperty(window, 'currentSubject', {
  get: () => currentSubject, set: (v) => { currentSubject = v; }, configurable: true
});
Object.defineProperty(window, 'currentSection', {
  get: () => currentSection, set: (v) => { currentSection = v; }, configurable: true
});
