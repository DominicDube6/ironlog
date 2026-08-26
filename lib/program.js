// Program definition: Full Body 4x/week, advanced lifter.
// Ported as-is from the iron-log.jsx artifact — do not change exercise data
// without updating suggestNext/buildProgram callers accordingly.

export const PROGRAM = {
  A: {
    label: "Jour A",
    exercises: [
      { id: "a1", name: "Squat arrière", sets: 3, repMin: 6, repMax: 8, increment: 10, cat: "Bas du corps", pattern: "squat", desc: "Barre sur le haut du dos (pas le cou). Descends en poussant les hanches vers l'arrière, cuisses parallèles au sol, remonte en poussant dans le sol." },
      { id: "a2", name: "Développé couché", sets: 4, repMin: 6, repMax: 8, increment: 5, cat: "Push", pattern: "push", desc: "Couché sur le banc, barre descend jusqu'à toucher la poitrine, pousse vers le haut en gardant les omoplates serrées." },
      { id: "a3", name: "Rowing barre", sets: 4, repMin: 6, repMax: 8, increment: 5, cat: "Pull", pattern: "pull", desc: "Penché vers l'avant, dos droit, tire la barre vers le bas du ventre en serrant les omoplates ensemble." },
      { id: "a4", name: "Développé militaire", sets: 3, repMin: 6, repMax: 8, increment: 5, cat: "Push", pattern: "push", desc: "Debout, barre au niveau des épaules, pousse tout droit au-dessus de la tête sans cambrer le dos." },
      { id: "a5", name: "Soulevé de terre roumain", sets: 3, repMin: 8, repMax: 10, increment: 5, cat: "Bas du corps", pattern: "hinge", desc: "Genoux presque droits (léger fléchi), pousse les hanches vers l'arrière en gardant la barre collée aux jambes, tu sens l'étirement dans les ischios, remonte en poussant les hanches vers l'avant." },
      { id: "a6", name: "Face pull", sets: 3, repMin: 10, repMax: 12, increment: 2.5, cat: "Accessoire", pattern: "pull", desc: "À la poulie haute avec corde, tire vers ton visage en écartant les mains, coudes hauts. Vise les épaules arrière." },
    ],
  },
  B: {
    label: "Jour B",
    exercises: [
      { id: "b1", name: "Soulevé de terre", sets: 3, repMin: 5, repMax: 6, increment: 10, cat: "Bas du corps", pattern: "hinge", desc: "Barre au sol collée aux tibias, dos droit, pousse le sol avec les pieds et redresse les hanches et le dos ensemble jusqu'à debout complet." },
      { id: "b2", name: "Développé incliné haltères", sets: 4, repMin: 8, repMax: 10, increment: 5, cat: "Push", pattern: "push", desc: "Banc incliné à ~30°, un haltère dans chaque main, pousse vers le haut jusqu'à presque toucher les haltères ensemble." },
      { id: "b3", name: "Tractions lestées", sets: 4, repMin: 6, repMax: 8, increment: 5, cat: "Pull", pattern: "pull", desc: "Prise large, paumes vers l'avant. Ajoute du poids à la ceinture. Tire jusqu'à ce que le menton passe la barre." },
      { id: "b4", name: "Développé épaules haltères", sets: 3, repMin: 8, repMax: 10, increment: 5, cat: "Push", pattern: "push", desc: "Assis ou debout, un haltère par épaule, pousse tout droit au-dessus de la tête." },
      { id: "b5", name: "Fentes bulgares", sets: 3, repMin: 8, repMax: 10, increment: 5, cat: "Bas du corps", pattern: "lunge", desc: "Pied arrière élevé sur le banc, descends la jambe avant jusqu'à 90°, remonte. Fais toutes les reps d'une jambe avant de changer." },
      { id: "b6", name: "Curl barre", sets: 3, repMin: 8, repMax: 10, increment: 2.5, cat: "Accessoire", pattern: "isolation", desc: "Debout, barre en prise supination, plie les coudes en gardant les bras collés au corps, remonte la barre vers les épaules." },
    ],
  },
  C: {
    label: "Jour C",
    exercises: [
      { id: "c1", name: "Front squat", sets: 3, repMin: 6, repMax: 8, increment: 5, cat: "Bas du corps", pattern: "squat", desc: "Barre sur le devant des épaules, coudes hauts. Descends droit vers le bas, torse plus vertical qu'un squat arrière." },
      { id: "c2", name: "Dips lestés", sets: 4, repMin: 6, repMax: 10, increment: 5, cat: "Push", pattern: "push", desc: "Sur la barre de dips, ajoute du poids à la ceinture. Descends jusqu'à ce que les épaules soient sous les coudes, pousse pour remonter." },
      { id: "c3", name: "Rowing Pendlay", sets: 4, repMin: 6, repMax: 8, increment: 5, cat: "Pull", pattern: "pull", desc: "Comme le rowing barre mais la barre part du sol à chaque rep — torse presque parallèle au sol, tire explosif vers le ventre." },
      { id: "c4", name: "Élévations latérales", sets: 3, repMin: 10, repMax: 12, increment: 2.5, cat: "Accessoire", pattern: "isolation", desc: "Un haltère dans chaque main, lève les bras sur les côtés jusqu'à hauteur d'épaule, légère flexion aux coudes." },
      { id: "c5", name: "Leg curl poulie (attache cheville)", sets: 3, repMin: 10, repMax: 12, increment: 5, cat: "Bas du corps", pattern: "isolation", desc: "Attache cheville à la poulie basse, debout face à la machine, plie le genou pour amener le talon vers la fesse." },
      { id: "c6", name: "Extension triceps poulie", sets: 3, repMin: 10, repMax: 12, increment: 2.5, cat: "Accessoire", pattern: "push", desc: "À la poulie haute, coudes collés au corps, pousse la barre/corde vers le bas jusqu'à extension complète du bras." },
    ],
  },
  D: {
    label: "Jour D",
    exercises: [
      { id: "d1", name: "Soulevé de terre sumo", sets: 3, repMin: 6, repMax: 8, increment: 10, cat: "Bas du corps", pattern: "hinge", desc: "Pieds très larges, orteils vers l'extérieur, mains entre les jambes. Torse plus droit qu'un deadlift classique. Pousse le sol pour te lever." },
      { id: "d2", name: "Développé plat haltères", sets: 4, repMin: 8, repMax: 10, increment: 5, cat: "Push", pattern: "push", desc: "Couché sur banc plat, un haltère par main, descends de chaque côté de la poitrine, pousse vers le haut." },
      { id: "d3", name: "Chin-ups lestés", sets: 4, repMin: 6, repMax: 8, increment: 5, cat: "Pull", pattern: "pull", desc: "Comme les tractions mais paumes vers toi, prise plus étroite. Ajoute du poids à la ceinture." },
      { id: "d4", name: "Arnold press", sets: 3, repMin: 8, repMax: 10, increment: 5, cat: "Push", pattern: "push", desc: "Départ paumes vers toi devant les épaules, pousse en haut tout en tournant les paumes vers l'avant." },
      { id: "d5", name: "Fentes marchées", sets: 3, repMin: 8, repMax: 10, increment: 5, cat: "Bas du corps", pattern: "lunge", desc: "Haltères dans chaque main, avance en fente, genou arrière proche du sol, pousse pour avancer vers la fente suivante." },
      { id: "d6", name: "Curl marteau", sets: 3, repMin: 8, repMax: 10, increment: 2.5, cat: "Accessoire", pattern: "isolation", desc: "Comme le curl barre mais avec haltères, paumes face à face tout au long du mouvement." },
    ],
  },
};

export const DAY_KEYS = ["A", "B", "C", "D"];

// Accessory slots rotate every 4 weeks to keep things fresh.
// Main compound lifts stay fixed so weight progression history stays continuous.
export const SLOT_VARIANTS = {
  a6: [
    { id: "a6-0", name: "Face pull", sets: 3, repMin: 10, repMax: 12, increment: 2.5, cat: "Accessoire", pattern: "pull", desc: "À la poulie haute avec corde, tire vers ton visage en écartant les mains, coudes hauts. Vise les épaules arrière." },
    { id: "a6-1", name: "Rowing haltère unilatéral", sets: 3, repMin: 10, repMax: 12, increment: 5, cat: "Accessoire", pattern: "pull", desc: "Un genou et une main sur le banc, tire l'haltère vers la hanche en gardant le coude proche du corps." },
  ],
  b6: [
    { id: "b6-0", name: "Curl barre", sets: 3, repMin: 8, repMax: 10, increment: 2.5, cat: "Accessoire", pattern: "isolation", desc: "Debout, barre en prise supination, plie les coudes en gardant les bras collés au corps, remonte la barre vers les épaules." },
    { id: "b6-1", name: "Curl incliné haltères", sets: 3, repMin: 8, repMax: 10, increment: 2.5, cat: "Accessoire", pattern: "isolation", desc: "Assis sur un banc incliné, bras pendant vers l'arrière, curl les haltères sans balancer les épaules." },
  ],
  c4: [
    { id: "c4-0", name: "Élévations latérales", sets: 3, repMin: 10, repMax: 12, increment: 2.5, cat: "Accessoire", pattern: "isolation", desc: "Un haltère dans chaque main, lève les bras sur les côtés jusqu'à hauteur d'épaule, légère flexion aux coudes." },
    { id: "c4-1", name: "Y-raise haltères", sets: 3, repMin: 10, repMax: 12, increment: 2.5, cat: "Accessoire", pattern: "isolation", desc: "Penché sur un banc incliné, lève les haltères en formant un Y au-dessus de la tête, pouces vers le haut." },
  ],
  c5: [
    { id: "c5-0", name: "Leg curl poulie (attache cheville)", sets: 3, repMin: 10, repMax: 12, increment: 5, cat: "Bas du corps", pattern: "isolation", desc: "Attache cheville à la poulie basse, debout face à la machine, plie le genou pour amener le talon vers la fesse." },
    { id: "c5-1", name: "Good morning barre", sets: 3, repMin: 10, repMax: 12, increment: 5, cat: "Bas du corps", pattern: "hinge", desc: "Barre sur le haut du dos comme un squat, penche le torse vers l'avant en gardant le dos droit et les jambes presque tendues, sens l'étirement dans les ischios." },
  ],
  c6: [
    { id: "c6-0", name: "Extension triceps poulie", sets: 3, repMin: 10, repMax: 12, increment: 2.5, cat: "Accessoire", pattern: "push", desc: "À la poulie haute, coudes collés au corps, pousse la barre/corde vers le bas jusqu'à extension complète du bras." },
    { id: "c6-1", name: "Extension triceps haltère à deux mains", sets: 3, repMin: 10, repMax: 12, increment: 2.5, cat: "Accessoire", pattern: "push", desc: "Un haltère tenu à deux mains derrière la tête, coudes pointés vers le plafond, étends les bras vers le haut." },
  ],
  d6: [
    { id: "d6-0", name: "Curl marteau", sets: 3, repMin: 8, repMax: 10, increment: 2.5, cat: "Accessoire", pattern: "isolation", desc: "Comme le curl barre mais avec haltères, paumes face à face tout au long du mouvement." },
    { id: "d6-1", name: "Curl 21s barre", sets: 3, repMin: 21, repMax: 21, increment: 2.5, cat: "Accessoire", pattern: "isolation", desc: "7 reps du bas jusqu'à mi-chemin, 7 reps de mi-chemin jusqu'en haut, 7 reps amplitude complète — même poids pour les 21." },
  ],
};

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

export function fmtDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("fr-CA", { day: "numeric", month: "short" });
}

export function effectiveDays(startDate, pausedRanges) {
  let total = daysBetween(startDate, todayISO());
  for (const r of pausedRanges || []) {
    const s = new Date(Math.max(new Date(startDate + "T00:00:00"), new Date(r.start + "T00:00:00")));
    const e = new Date(Math.min(new Date(todayISO() + "T00:00:00"), new Date(r.end + "T00:00:00")));
    if (e > s) total -= Math.round((e - s) / 86400000);
  }
  return Math.max(total, 0);
}

export function getBlockIndex(startDate, pausedRanges) {
  return Math.floor(effectiveDays(startDate, pausedRanges) / 28);
}

export function buildProgram(blockIndex) {
  const result = {};
  for (const key of DAY_KEYS) {
    result[key] = {
      label: PROGRAM[key].label,
      exercises: PROGRAM[key].exercises.map((ex) => {
        const slot = SLOT_VARIANTS[ex.id];
        if (!slot) return ex;
        return slot[blockIndex % slot.length];
      }),
    };
  }
  return result;
}

export function roundToHalf(n) {
  return Math.round(n / 2.5) * 2.5;
}

// history: { [exerciseId]: [{ date, sets: [{weight, reps}] }, ...] } sorted oldest -> newest
export function suggestNext(history, ex) {
  const sessions = history[ex.id] || [];
  if (sessions.length === 0) return { weight: null, note: "Entre ton poids de départ", tone: "neutral" };

  const last = sessions[sessions.length - 1];
  const gapDays = daysBetween(last.date, todayISO());
  const lastWeight = Math.max(...last.sets.map((s) => s.weight || 0));

  // Long gap (vacation, holidays, etc.) — don't push progression blindly
  if (gapDays >= 14) {
    const comebackWeight = roundToHalf(lastWeight * 0.85);
    return { weight: comebackWeight, note: `${gapDays}j depuis ta dernière séance — reprise à ${comebackWeight} lb (~85%)`, tone: "comeback" };
  }

  const allTop = last.sets.every((s) => s.reps >= ex.repMax);
  const anyBelowMin = last.sets.some((s) => s.reps < ex.repMin);

  // Stagnation check: last 3 sessions at the same weight, never hitting the top
  if (sessions.length >= 3) {
    const lastThree = sessions.slice(-3);
    const weights = lastThree.map((s) => Math.max(...s.sets.map((x) => x.weight || 0)));
    const sameWeight = weights.every((w) => w === weights[0]);
    const noneHitTop = lastThree.every((s) => !s.sets.every((x) => x.reps >= ex.repMax));
    if (sameWeight && noneHitTop) {
      const deloadWeight = roundToHalf(weights[0] * 0.9);
      return { weight: deloadWeight, note: `Stagnation 3x à ${weights[0]} lb — deload à ${deloadWeight} lb`, tone: "deload" };
    }
  }

  if (allTop) {
    return { weight: lastWeight + ex.increment, note: `Monte à ${lastWeight + ex.increment} lb`, tone: "up" };
  }
  if (anyBelowMin) {
    return { weight: lastWeight, note: `Reste à ${lastWeight} lb, vise le bas de la range`, tone: "hold" };
  }
  return { weight: lastWeight, note: `Reste à ${lastWeight} lb, ajoute une rep`, tone: "hold" };
}
