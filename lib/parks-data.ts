export interface Park {
  id: string;
  name: string;
  city: string;
  department: string;
  lat: number;
  lng: number;
  address?: string;
  fenced?: boolean;
  opening_hours?: string;
  features?: string[];
  rating?: number;       // note /5
  reviewCount?: number;  // nb d'avis
  reviews?: string[];    // avis publics
  size?: string;         // surface en m²
  warning?: string;      // alerte sécurité
  osmId?: string;        // référence OSM
  phone?: string;
  website?: string;
}

import rawParks from "./espaces_canins_paca.json";

interface RawPark {
  name: string;
  city: string;
  department: string;
  address?: string | null;
  lat: number;
  lng: number;
  fenced?: boolean | null;
  opening_hours?: string | null;
  features?: string[] | null;
  source?: string | null;
}

const HARDCODED_PARKS: Park[] = [
  // BOUCHES-DU-RHÔNE (13)
  { id: "13-001", name: "Espace canin Belle de Mai", city: "Marseille", department: "13", lat: 43.3138, lng: 5.3904, address: "Traverse Séry", fenced: true },
  { id: "13-002", name: "Espace canin Baille", city: "Marseille", department: "13", lat: 43.2926, lng: 5.3994, address: "Rue Saint-Pierre", fenced: true },
  { id: "13-003", name: "Espace canin Saint-Barnabé", city: "Marseille", department: "13", lat: 43.2983, lng: 5.4143, address: "Avenue d'Haïti" },
  { id: "13-004", name: "Espace canin La Valbarelle", city: "Marseille", department: "13", lat: 43.2846, lng: 5.4460, address: "Avenue Noël Coll" },
  { id: "13-005", name: "Espace canin La Capelette", city: "Marseille", department: "13", lat: 43.2800, lng: 5.4102, address: "Avenue de la Capelette", fenced: true },
  { id: "13-006", name: "Espace canin Lodi", city: "Marseille", department: "13", lat: 43.2833, lng: 5.3912, address: "Boulevard Vincent Delpuech", features: ["sans laisse"] },
  { id: "13-007", name: "Espace canin Cinq-Avenues", city: "Marseille", department: "13", lat: 43.3042, lng: 5.3962, address: "Rue Buffon" },
  { id: "13-008", name: "Espace canin La Blancarde", city: "Marseille", department: "13", lat: 43.2996, lng: 5.4014, address: "Avenue du Maréchal Foch" },
  { id: "13-009", name: "Espace canin Saint-Barthélemy", city: "Marseille", department: "13", lat: 43.3308, lng: 5.3978, address: "Avenue Raimu" },
  { id: "13-010", name: "Espace canin Saint-Tronc", city: "Marseille", department: "13", lat: 43.2683, lng: 5.4174, address: "Boulevard Paul Claudel" },
  { id: "13-011", name: "Espace canin Le Cabot", city: "Marseille", department: "13", lat: 43.2500, lng: 5.4180 },
  { id: "13-012", name: "Espace canin Mazargues", city: "Marseille", department: "13", lat: 43.2467, lng: 5.3981 },
  // Marseille — nouveaux parcs (non encore sur OSM ou récemment ajoutés)
  { id: "13-020", name: "Espace canin Roucas-Blanc", city: "Marseille", department: "13", lat: 43.2824, lng: 5.3700, address: "Rue du Bois Sacré", fenced: false },
  { id: "13-021", name: "Espace canin Saint-Menet", city: "Marseille", department: "13", lat: 43.2929, lng: 5.4942, address: "Montée de Saint-Menet" },
  { id: "13-022", name: "Espace canin Benjamin Delessert", city: "Marseille", department: "13", lat: 43.2847, lng: 5.4047, address: "Avenue Benjamin Delessert" },
  { id: "13-023", name: "Espace canin Boulevard Icard", city: "Marseille", department: "13", lat: 43.2748, lng: 5.4206, address: "Boulevard Icard" },
  { id: "13-024", name: "Espace canin Sainte-Marguerite", city: "Marseille", department: "13", lat: 43.2610, lng: 5.4006, address: "Avenue de la Magalone" },
  { id: "13-025", name: "Espace canin Jardins Aiguier", city: "Marseille", department: "13", lat: 43.2597, lng: 5.4149, address: "Boulevard Urbain Sud, Jardins Aiguier" },
  { id: "13-026", name: "Parc Pythagore", city: "Marseille", department: "13", lat: 43.2822, lng: 5.3759, address: "Rue Pythagore, Vauban — 13006", features: ["à confirmer"] },
  { id: "13-028", name: "Parc Saucisse (Longchamp)", city: "Marseille", department: "13", lat: 43.2998, lng: 5.3956, address: "Palais Longchamp, Boulevard Longchamp — 13004", fenced: true, features: ["historique", "rénové 2025", "sans laisse", "6000m²"], size: "6000m²", reviews: ["Inauguré en hommage à 'Saucisse', le chien le plus connu de Marseille.", "Magnifique cadre dans le parc Longchamp, classé Jardin Remarquable.", "Le plus grand espace canin du centre de Marseille !"], osmId: "way/245092106" },
  // La Ciotat
  { id: "13-027", name: "Espace canin Le Revestin", city: "La Ciotat", department: "13", lat: 43.1997, lng: 5.6191, address: "Avenue Guillaume Dulac, Le Revestin" },

  { id: "13-013", name: "Espace canin Canto Perdrix", city: "Martigues", department: "13", lat: 43.4179, lng: 5.0532, address: "Avenue de Canto Perdrix" },
  { id: "13-014", name: "Espace canin Saint-Julien", city: "Martigues", department: "13", lat: 43.3579, lng: 5.1013, address: "Chemin de la Pradelle" },
  { id: "13-015", name: "Espace canin Colonel Fabien", city: "Martigues", department: "13", lat: 43.4078, lng: 5.0571, address: "Rue Colonel Fabien" },
  { id: "13-016", name: "Centre canin", city: "Miramas", department: "13", lat: 43.5894, lng: 5.0294, address: "Chemin du Pigeonnier" },
  { id: "13-017", name: "Espace canin Kilmaine", city: "Tarascon", department: "13", lat: 43.8019, lng: 4.6580, address: "Avenue Pierre Semard" },
  { id: "13-018", name: "Parc canin Gauffredy", city: "Aix-en-Provence", department: "13", lat: 43.5295, lng: 5.4399, address: "Rue Celony, Saint-Eutrope", fenced: true, opening_hours: "8h00–18h00", features: ["2 zones petits/grands", "fontaine", "bancs", "sacs offerts"], rating: 4.5, reviewCount: 4, size: "900m²", reviews: ["Ce lieu manquait dans le centre d'Aix pour tous les propriétaires qui ne savent pas où promener leurs animaux.", "Les chiens peuvent enfin devenir des chiens de campagne le temps d'une promenade 🐾", "2 enclos séparés selon la taille du chien, c'est génial !", "Inauguré en sept. 2024, très bien entretenu par la mairie."], osmId: "way/737269870" },
  { id: "13-019", name: "Espace canin Gréasque", city: "Gréasque", department: "13", lat: 43.4312, lng: 5.5439, address: "Rue des Jardins" },

  // VAR (83)
  { id: "83-001", name: "Parc Raoulx (caniparc)", city: "Toulon", department: "83", lat: 43.1082, lng: 5.9426, address: "77 Impasse Docteur Henri Raoulx", fenced: true, size: "11000m²", reviews: ["Très peu entretenu malheureusement.", "Terrain sec et boueux, sans verdure. La mairie devrait faire un effort.", "Le parc en lui-même est grand, mais la zone canine est sommaire."], osmId: "node/4414008589", phone: "04 94 36 30 26" },
  { id: "83-002", name: "Parc des Lices (agility)", city: "Toulon", department: "83", lat: 43.1141, lng: 5.9363, address: "Avenue de la Victoire", features: ["agility", "sans laisse", "parcours sportif"], size: "90000m²", reviews: ["Le plus complet de Toulon ! Agility, grands espaces, magnifique.", "Base du club Canibest, des éducateurs sur place."], osmId: "node/4414008650" },
  { id: "83-003", name: "Espace canin Pont du Las", city: "Toulon", department: "83", lat: 43.1305, lng: 5.9134, address: "Rue Curie", phone: "04 94 36 30 26" },
  { id: "83-004", name: "Espace canin La Loubière", city: "Toulon", department: "83", lat: 43.1261, lng: 5.9403, address: "Boulevard de la Démocratie" },
  { id: "83-005", name: "Espace canin La Valette", city: "La Valette-du-Var", department: "83", lat: 43.1392, lng: 5.9875, address: "Avenue François Duchatel" },
  { id: "83-006", name: "Espace canin Bandol", city: "Bandol", department: "83", lat: 43.1430, lng: 5.7555, address: "Boulevard du Bois Maurin" },
  { id: "83-007", name: "Espace canin Le Pradet", city: "Le Pradet", department: "83", lat: 43.1090, lng: 6.0340, address: "Chemin de la Foux" },
  { id: "83-008", name: "Espace canin Saint-Raphaël", city: "Saint-Raphaël", department: "83", lat: 43.4191, lng: 6.7716, address: "Boulevard Général de Gaulle" },
  { id: "83-009", name: "Espace canin Fréjus", city: "Fréjus", department: "83", lat: 43.4232, lng: 6.7376, address: "Rue des Batteries", fenced: true },
  { id: "83-010", name: "Jardin des chiens des Virgiles", city: "Sainte-Maxime", department: "83", lat: 43.3173, lng: 6.6289, address: "Chemin des Virgiles", fenced: true },
  { id: "83-011", name: "Espace canin Ramatuelle", city: "Ramatuelle", department: "83", lat: 43.2092, lng: 6.6184, address: "Chemin des Combes", fenced: true },
  { id: "83-012", name: "Espace canin Draguignan", city: "Draguignan", department: "83", lat: 43.5418, lng: 6.4676, address: "Chemin de Laucate" },

  // ALPES-MARITIMES (06)
  { id: "06-001", name: "Parc Carol de Roumanie", city: "Nice", department: "06", lat: 43.6934, lng: 7.2156, address: "27-29 Avenue de Fabron", opening_hours: "Oct-Mar 8h30-18h00 / Avr-Sep 8h30-20h00", features: ["fontaine", "clôturé"], fenced: true, size: "1416m²", osmId: "node/3665944475" },
  { id: "06-002", name: "Jardin Paul Scoffier", city: "Nice", department: "06", lat: 43.6767, lng: 7.2205, address: "179 Boulevard Napoléon III", opening_hours: "24h/24", fenced: true, size: "916m²", osmId: "way/821653841" },
  { id: "06-003", name: "Square Jean Baptiste Carpeaux", city: "Nice", department: "06", lat: 43.7100, lng: 7.2500, address: "14 Avenue Chateaubriand", features: ["2 zones petits/grands chiens"], fenced: true, size: "700m²", opening_hours: "Oct-Mar 8h30-18h00 / Avr-Sep 8h30-20h00" },
  { id: "06-004", name: "Parc du Ray (St-Laurent-du-Var)", city: "Saint-Laurent-du-Var", department: "06", lat: 43.7234, lng: 7.2595, address: "270 Avenue du 11 Novembre", features: ["fontaine", "eau disponible"], rating: 4.4, reviews: ["Très beau parc, eau disponible pour les chiens, on adore !", "Propre et bien entretenu, parfait pour les balades matinales."], osmId: "node/10746728714" },
  { id: "06-005", name: "Jardin de la Villa Ratti", city: "Nice", department: "06", lat: 43.7150, lng: 7.2650, address: "1-3 Avenue Ratti", features: ["fontaine"] },
  { id: "06-006", name: "Jardin Joseph Scoffier", city: "Nice", department: "06", lat: 43.7275, lng: 7.2407, address: "Rue Louis Bilbaut" },
  { id: "06-007", name: "Parc du Castel des Deux Rois", city: "Nice", department: "06", lat: 43.7180, lng: 7.2820, address: "32 Avenue du Mont Alban" },
  { id: "06-008", name: "Parc Docteur Jean Guillaud", city: "Nice", department: "06", lat: 43.7275, lng: 7.2407, address: "Rue Louis Bilbaut" },
  { id: "06-009", name: "Espace canin Cessole", city: "Nice", department: "06", lat: 43.7200, lng: 7.2550, address: "123 Boulevard de Cessole" },
  { id: "06-010", name: "Espace canin Fabron", city: "Nice", department: "06", lat: 43.6878, lng: 7.2300, address: "Chemin du Vallon de Barla" },
  { id: "06-011", name: "Espace canin Valrose", city: "Nice", department: "06", lat: 43.7145, lng: 7.2627, address: "Avenue Ferrix" },
  { id: "06-012", name: "Espace canin Libération", city: "Nice", department: "06", lat: 43.7082, lng: 7.2675, address: "Rue Marceau" },
  { id: "06-013", name: "Jardin des Lucayas", city: "Cagnes-sur-Mer", department: "06", lat: 43.6616, lng: 7.1680, address: "La Provençale", fenced: true, opening_hours: "Oct-Mar 8h-19h / Avr-Sep 8h-21h" },
  { id: "06-014", name: "Espace canin Allée des Saules", city: "Cagnes-sur-Mer", department: "06", lat: 43.6576, lng: 7.1541, address: "Allée des Saules" },
  { id: "06-015", name: "Espace canin Cagnes Plage", city: "Cagnes-sur-Mer", department: "06", lat: 43.6534, lng: 7.1556, address: "Promenade de la Plage" },
  { id: "06-016", name: "Espace canin Villeneuve-Loubet", city: "Villeneuve-Loubet", department: "06", lat: 43.6519, lng: 7.1280, address: "Avenue des Plans" },
  { id: "06-017", name: "Parc canin du Lys", city: "Cannes", department: "06", lat: 43.5556, lng: 7.0281, address: "Square Frères Gaudino Joly, Rue du Lys", opening_hours: "Lu-Di 8h30-18h30", features: ["sans laisse", "agility", "fontaine canine", "2 zones"], fenced: true, size: "400m²", rating: 4.8, reviews: ["Inauguré le 23 déc. 2024, le premier vrai parc canin de Cannes !", "Toboggan + bascule pour les chiens, mes bêtes adorent !", "La fontaine pour chiens est top, très bien pensé.", "Le maire en personne a inauguré, belle initiative 👏"], osmId: "way/732613746", phone: "04 97 06 40 00" },
  { id: "06-018", name: "Espace canin Le Cannet Oliviers", city: "Le Cannet", department: "06", lat: 43.5750, lng: 7.0209, address: "Rue des Oliviers", fenced: true },
  { id: "06-019", name: "Espace canin Le Cannet Carnot", city: "Le Cannet", department: "06", lat: 43.5652, lng: 7.0168, address: "Boulevard Carnot", fenced: true },
  { id: "06-020", name: "Espace canin Carimaï", city: "Le Cannet", department: "06", lat: 43.5740, lng: 6.9851, address: "Chemin du Carimaï", opening_hours: "Avr-Sep 8h-19h / Oct-Mar 8h-17:30" },
  { id: "06-021", name: "Parc canin des Bouillides", city: "Valbonne", department: "06", lat: 43.6162, lng: 7.0411, address: "Route du Parc, Sophia Antipolis", features: ["gratuit"] },
  { id: "06-022", name: "Espace canin Le Rouret", city: "Le Rouret", department: "06", lat: 43.6768, lng: 7.0128, address: "Chemin du Collet" },
  { id: "06-023", name: "Parc Canin Isola", city: "Isola", department: "06", lat: 44.1883, lng: 7.0416, address: "Route du Lac" },

  // VAUCLUSE (84)
  { id: "84-001", name: "Caniparc Chico Mendes", city: "Avignon", department: "84", lat: 43.9376, lng: 4.8192, address: "Pont des Deux Eaux, Avignon", fenced: true, size: "2000m²", features: ["parcours fitness", "terrain foot", "grande pelouse"], reviews: ["Le plus grand caniparc d'Avignon, 2000m² entièrement clos.", "Super pour socialiser les chiens, beaucoup de monde en soirée.", "Accessible à pied ou en vélo par le chemin des Canaux."] },
  { id: "84-001b", name: "Caniparc Champfleury", city: "Avignon", department: "84", lat: 43.9200, lng: 4.8300, address: "Quartier Champfleury, Avignon", fenced: true, warning: "⚠️ Signalements d'empoisonnements dans ce parc — restez vigilants et surveillez votre chien.", reviews: ["Attention : des cas d'empoisonnements ont été signalés. Soyez très vigilants."] },
  { id: "84-002", name: "Caniparc Clos de Massillargues", city: "Avignon", department: "84", lat: 43.9142, lng: 4.9467, address: "Chemin de Massillargues, Avignon", features: ["fontaine", "toilettes", "bus lignes 7/8/11"] },
  { id: "84-003", name: "Espace canin Velorgues", city: "L'Isle-sur-la-Sorgue", department: "84", lat: 43.8988, lng: 5.0619, address: "Route des Courses" },
  { id: "84-004", name: "Circuit agility Orange", city: "Orange", department: "84", lat: 44.1328, lng: 4.7976, address: "Avenue Antoine Pinay, Le Grenouillet" },
  { id: "84-005", name: "Espace canin GCL84 Cadenet", city: "Cadenet", department: "84", lat: 43.7180, lng: 5.3650, address: "Chemin Iscle" },

  // ALPES-DE-HAUTE-PROVENCE (04)
  { id: "04-001", name: "Espace canin La Brillanne", city: "La Brillanne", department: "04", lat: 43.9345, lng: 5.8895, address: "Route des Alpes" },
  { id: "04-002", name: "Espace canin Volx", city: "Volx", department: "04", lat: 43.8796, lng: 5.8456, address: "D 13" },
  { id: "04-003", name: "Espace canin Sisteron", city: "Sisteron", department: "04", lat: 44.1992, lng: 5.9453, address: "Rue Font-Chaude" },
  { id: "04-004", name: "Espace canin Embrun 1", city: "Embrun", department: "04", lat: 44.5623, lng: 6.4957, address: "Square Jacques Gelu" },
  { id: "04-005", name: "Espace canin Embrun 2", city: "Embrun", department: "04", lat: 44.5626, lng: 6.4983, address: "Promenade de l'Archevêché" },

  // HAUTES-ALPES (05)
  { id: "05-001", name: "Espace canin Briançon", city: "Briançon", department: "05", lat: 44.8949, lng: 6.6352, address: "Allée du Dr François Lepoire, Font Christianne" },

  // ALPES-MARITIMES — nouveaux parcs
  { id: "06-024", name: "Parc canin Batterie Russe", city: "Nice", department: "06", lat: 43.6768, lng: 7.0128, address: "55-57 Avenue Raoul Dufy, 06200 Nice", opening_hours: "24h/24", fenced: true, size: "605m²", rating: 4.0, reviews: ["Très agréable parc pour nos compagnons à poils !", "Ouvert 24h/24, pratique pour les sorties tardives.", "Propre et bien situé près de la promenade."], osmId: "node/3665944475" },
  { id: "06-025", name: "Jardin de la Villa Ratti", city: "Nice", department: "06", lat: 43.7150, lng: 7.2650, address: "1-3 Avenue Ratti, Nice", fenced: true, size: "1100m²", opening_hours: "Oct-Mar 8h30-18h00 / Avr-Sep 8h30-20h00", features: ["fontaine"] },
  { id: "06-026", name: "Espace canin Bordibau", city: "Menton", department: "06", lat: 43.7826, lng: 7.6595, address: "Bordibau, Menton", opening_hours: "Lu-Di 7h30-19h30", fenced: true, osmId: "way/1185059826" },
  { id: "06-027", name: "Espace canin Sainte-Maxime (Virgiles)", city: "Sainte-Maxime", department: "83", lat: 43.4235, lng: 6.7376, address: "Chemin des Virgiles, Sainte-Maxime", fenced: true, osmId: "way/1431950970" },

  // VAUCLUSE — nouveaux parcs
  { id: "84-003", name: "Caniparc Clos de la Murette", city: "Avignon", department: "84", lat: 43.9300, lng: 4.8400, address: "Rue Diane de Poitiers, Avignon", features: ["fontaine", "jeux d'eau", "jardins partagés", "pétanque"] },
  { id: "84-004", name: "Caniparc Campo Bello", city: "Avignon", department: "84", lat: 43.9250, lng: 4.8350, address: "Rue Campo Bello, Avignon", features: ["fontaine", "pétanque", "jardins partagés"] },
  { id: "84-005", name: "Parc de la Cantonne", city: "Avignon", department: "84", lat: 43.9100, lng: 4.8250, address: "112 Cours des Frères Folcoaud, Montfavet", features: ["bus lignes 4/12/13/30"] },
  { id: "84-006", name: "Circuit Agility Orange", city: "Orange", department: "84", lat: 44.1328, lng: 4.7976, address: "Avenue Antoine Pinay, Le Grenouillet, Orange", features: ["agility", "parcours officiel"], osmId: "way/1082822401" },
  { id: "84-007", name: "Centre d'éducation canine du Ventoux", city: "Carpentras", department: "84", lat: 44.0215, lng: 5.1303, address: "Carpentras", features: ["éducation canine", "club"], osmId: "way/1194702147" },
];

export const PACA_PARKS: Park[] = [...HARDCODED_PARKS];

// Load and merge JSON parks (avoiding duplicates)
(rawParks as RawPark[]).forEach((raw, index) => {
  const isDuplicate = HARDCODED_PARKS.some(
    (h) =>
      (Math.abs(h.lat - raw.lat) < 0.0005 && Math.abs(h.lng - raw.lng) < 0.0005) ||
      (h.name.toLowerCase().includes(raw.name.toLowerCase().split("—")[0].trim()) &&
        h.city.toLowerCase() === raw.city.toLowerCase())
  );

  if (!isDuplicate) {
    PACA_PARKS.push({
      id: `${raw.department}-raw-${index}`,
      name: raw.name,
      city: raw.city,
      department: raw.department,
      lat: raw.lat,
      lng: raw.lng,
      address: raw.address || undefined,
      fenced: raw.fenced === null ? undefined : raw.fenced,
      opening_hours: raw.opening_hours || undefined,
      features: raw.features || undefined,
    });
  }
});

