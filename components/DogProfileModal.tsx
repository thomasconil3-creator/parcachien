"use client";

import { useState, useEffect } from "react";
import { DogProfile, CharacterTrait } from "@/lib/types";
import { useStore } from "@/lib/store";
import { createClient } from "@/utils/supabase/client";
import { saveDog, getMyDog } from "@/lib/db";
import { X, PawPrint, Loader2 } from "lucide-react";

const BREEDS = ["Labrador", "Golden Retriever", "Berger Allemand", "Beagle", "Bichon", "Bouledogue", "Caniche", "Chihuahua", "Cocker", "Dalmatien", "Doberman", "Husky", "Jack Russell", "Malinois", "Rottweiler", "Setter Irlandais", "Shih Tzu", "Spitz", "Yorkshire", "Autre"];

const TRAITS: { value: CharacterTrait; label: string; emoji: string }[] = [
  { value: "joueur", label: "Joueur", emoji: "🎾" },
  { value: "calme", label: "Calme", emoji: "😌" },
  { value: "dominant", label: "Dominant", emoji: "👑" },
  { value: "soumis", label: "Soumis", emoji: "🙏" },
  { value: "sociable", label: "Sociable", emoji: "🤝" },
  { value: "craintif", label: "Craintif", emoji: "😨" },
  { value: "energique", label: "Énergique", emoji: "⚡" },
  { value: "affectueux", label: "Affectueux", emoji: "❤️" },
];

interface Props {
  onClose: () => void;
}

export default function DogProfileModal({ onClose }: Props) {
  const { myDog, setMyDog } = useStore();
  const supabase = createClient();
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [form, setForm] = useState<Omit<DogProfile, "id" | "ownerId">>({
    name: myDog?.name ?? "",
    breed: myDog?.breed ?? "Labrador",
    age: myDog?.age ?? 12,
    weight: myDog?.weight ?? "moyen",
    gender: myDog?.gender ?? "male",
    sterilized: myDog?.sterilized ?? false,
    character: myDog?.character ?? [],
    vaccinated: myDog?.vaccinated ?? true,
  });

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id ?? null;
      setUserId(uid);
      if (uid) {
        const dog = await getMyDog(uid);
        if (dog) {
          setForm({ name: dog.name, breed: dog.breed, age: dog.age, weight: dog.weight, gender: dog.gender, sterilized: dog.sterilized, character: dog.character ?? [], vaccinated: dog.vaccinated });
        }
      }
    });
  }, []);

  const toggleTrait = (trait: CharacterTrait) => {
    setForm((f) => ({
      ...f,
      character: f.character.includes(trait)
        ? f.character.filter((t) => t !== trait)
        : [...f.character, trait],
    }));
  };

  const save = async () => {
    setSaving(true);
    // Sauvegarder en local (Zustand)
    setMyDog({ ...form, id: myDog?.id ?? `dog-${Date.now()}`, ownerId: userId ?? "local-user" });
    // Sauvegarder en base si connecté
    if (userId) await saveDog(userId, form);
    setSaving(false);
    onClose();
  };

  const ageLabel = form.age < 12 ? `${form.age} mois` : `${Math.floor(form.age / 12)} an${form.age >= 24 ? "s" : ""}`;

  return (
    <div className="fixed inset-0 bg-black/50 z-[1000] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white rounded-t-3xl px-6 pt-6 pb-4 border-b border-gray-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#F59500] to-[#FFAA2C] rounded-xl flex items-center justify-center">
              <PawPrint size={16} className="text-white" />
            </div>
            <h2 className="font-bold text-gray-900 text-lg">Profil de {form.name || "mon chien"}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4 space-y-5">
          {/* Nom */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Prénom</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ex: Max, Luna, Rocky..."
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          </div>

          {/* Race */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Race</label>
            <select
              value={form.breed}
              onChange={(e) => setForm((f) => ({ ...f, breed: e.target.value }))}
              className="mt-1 w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
            >
              {BREEDS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Genre + Stérilisé */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Genre</label>
              <div className="mt-1 flex gap-2">
                {(["male", "female"] as const).map((g) => (
                  <button
                    key={g}
                    onClick={() => setForm((f) => ({ ...f, gender: g }))}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${form.gender === g ? "bg-amber-500 text-white border-amber-500 shadow-sm" : "border-gray-200 text-gray-600 hover:border-amber-400"}`}
                  >
                    {g === "male" ? "♂️ Mâle" : "♀️ Femelle"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Taille */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Taille</label>
            <div className="mt-1 flex gap-2">
              {(["petit", "moyen", "grand"] as const).map((w) => (
                <button
                  key={w}
                  onClick={() => setForm((f) => ({ ...f, weight: w }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${form.weight === w ? "bg-amber-500 text-white border-amber-500 shadow-sm" : "border-gray-200 text-gray-600 hover:border-amber-400"}`}
                >
                  {w === "petit" ? "🐩 Petit" : w === "moyen" ? "🐕 Moyen" : "🐕‍🦺 Grand"}
                </button>
              ))}
            </div>
          </div>

          {/* Âge */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Âge — <span className="text-amber-500 normal-case font-bold">{ageLabel}</span>
            </label>
            <input
              type="range"
              min={1}
              max={180}
              value={form.age}
              onChange={(e) => setForm((f) => ({ ...f, age: parseInt(e.target.value) }))}
              className="mt-2 w-full accent-amber-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Chiot</span>
              <span>Senior (15 ans)</span>
            </div>
          </div>

          {/* Caractère */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Caractère (plusieurs choix)</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {TRAITS.map(({ value, label, emoji }) => (
                <button
                  key={value}
                  onClick={() => toggleTrait(value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${form.character.includes(value) ? "bg-amber-500 text-white border-amber-500 shadow-sm" : "border-gray-200 text-gray-600 hover:border-amber-400"}`}
                >
                  {emoji} {label}
                </button>
              ))}
            </div>
          </div>

          {/* Switches */}
          <div className="space-y-3">
            {[
              { key: "sterilized" as const, label: "Stérilisé(e)", emoji: "✂️" },
              { key: "vaccinated" as const, label: "Vaccins à jour", emoji: "💉" },
            ].map(({ key, label, emoji }) => (
              <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-700">{emoji} {label}</span>
                <button
                  onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                  className={`w-11 h-6 rounded-full transition-colors relative ${form[key] ? "bg-amber-500" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form[key] ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={save}
            disabled={!form.name.trim() || saving}
            className="w-full bg-gradient-to-r from-[#F59500] to-[#FFAA2C] hover:from-amber-600 hover:to-amber-500 disabled:opacity-50 text-white py-3 rounded-2xl font-semibold transition-all shadow-md shadow-amber-200 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : null}
            Enregistrer le profil 🐾
          </button>
        </div>
      </div>
    </div>
  );
}
