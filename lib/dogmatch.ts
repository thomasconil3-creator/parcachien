import { DogProfile, CharacterTrait } from "./types";

const COMPATIBILITY_MATRIX: Record<CharacterTrait, CharacterTrait[]> = {
  joueur:      ["joueur", "energique", "sociable"],
  calme:       ["calme", "soumis", "affectueux"],
  dominant:    ["soumis", "calme"],
  soumis:      ["dominant", "calme", "affectueux"],
  sociable:    ["sociable", "joueur", "affectueux", "energique"],
  craintif:    ["calme", "soumis", "affectueux"],
  energique:   ["joueur", "energique", "sociable"],
  affectueux:  ["affectueux", "soumis", "calme", "sociable"],
};

const SIZE_MATRIX: Record<string, Record<string, number>> = {
  petit:  { petit: 100, moyen: 70, grand: 40 },
  moyen:  { petit: 70,  moyen: 100, grand: 80 },
  grand:  { petit: 40,  moyen: 80,  grand: 100 },
};

export function computeMatchScore(a: DogProfile, b: DogProfile): number {
  if (a.id === b.id) return 0;

  // Score caractère (0-50)
  let traitScore = 0;
  let traitCount = 0;
  for (const trait of a.character) {
    const compatible = COMPATIBILITY_MATRIX[trait] ?? [];
    for (const bTrait of b.character) {
      if (compatible.includes(bTrait)) traitScore += 10;
      traitCount++;
    }
  }
  const normalizedTrait = traitCount > 0 ? Math.min(50, traitScore / Math.max(1, a.character.length)) : 25;

  // Score taille (0-30)
  const sizeScore = ((SIZE_MATRIX[a.weight]?.[b.weight] ?? 50) / 100) * 30;

  // Score âge (0-20) — chiens proches en âge s'entendent mieux
  const ageDiff = Math.abs(a.age - b.age);
  const ageScore = ageDiff < 6 ? 20 : ageDiff < 12 ? 15 : ageDiff < 24 ? 10 : ageDiff < 48 ? 5 : 2;

  const total = Math.round(normalizedTrait + sizeScore + ageScore);
  return Math.min(99, Math.max(10, total));
}

export function getMatchLabel(score: number): { label: string; color: string; emoji: string } {
  if (score >= 85) return { label: "Coup de cœur", color: "text-green-600", emoji: "💚" };
  if (score >= 70) return { label: "Très compatible", color: "text-emerald-500", emoji: "🟢" };
  if (score >= 55) return { label: "Compatible", color: "text-yellow-500", emoji: "🟡" };
  if (score >= 40) return { label: "Prudence", color: "text-orange-400", emoji: "🟠" };
  return { label: "Incompatible", color: "text-red-400", emoji: "🔴" };
}
