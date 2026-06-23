"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Users, Dog, MapPin, AlertTriangle, Briefcase, ChevronRight, Activity, Database, Mail, Zap, Play } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const supabase = createClient();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState("users");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [dogs, setDogs] = useState<any[]>([]);
  const [checkins, setCheckins] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [lostDogs, setLostDogs] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    checkAdmin();
  }, []);

  async function checkAdmin() {
    const { data: { user } } = await supabase.auth.getUser();
    // Sécurité basique (à renforcer avec une vraie table 'roles' ou RLS Admin)
    if (!user || !["ceo@velox-ia.com", "thomasconil3@gmail.com", "ceo@parcachien.com"].includes(user.email ?? "")) {
      router.push("/");
      return;
    }
    setIsAdmin(true);
    fetchAllData();
  }

  async function fetchAllData() {
    setLoading(true);
    try {
      const [
        { data: d }, 
        { data: c }, 
        { data: p }, 
        { data: l }, 
        { data: r }
      ] = await Promise.all([
        supabase.from('dogs').select('*').order('created_at', { ascending: false }),
        supabase.from('checkins').select('*').order('created_at', { ascending: false }),
        supabase.from('partners').select('*').order('name'),
        supabase.from('lost_dogs').select('*').order('created_at', { ascending: false }),
        supabase.from('forum_reports').select('*').order('created_at', { ascending: false }),
      ]);

      setDogs(d || []);
      setCheckins(c || []);
      setPartners(p || []);
      setLostDogs(l || []);
      setReports(r || []);
    } catch (error) {
      console.error("Erreur chargement admin:", error);
    }
    setLoading(false);
  }

  if (!isAdmin) return <div className="p-10 text-center">Accès restreint...</div>;

  const tabs = [
    { id: "users", label: "Utilisateurs / Chiens", icon: Dog, count: dogs.length },
    { id: "checkins", label: "Check-ins Actifs", icon: MapPin, count: checkins.length },
    { id: "partners", label: "Partenaires B2B", icon: Briefcase, count: partners.length },
    { id: "lost", label: "Chiens Perdus", icon: AlertTriangle, count: lostDogs.length },
    { id: "reports", label: "Signalements Forum", icon: Activity, count: reports.length },
    { id: "automations", label: "Automatisations & Emails", icon: Zap, count: 4 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <Database size={16} className="text-white" />
          </div>
          <h1 className="font-bold text-gray-800">Admin ParcAChien</h1>
        </div>
        <div className="flex-1 p-4 flex flex-col gap-2">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center justify-between p-3 rounded-xl transition-all ${activeTab === t.id ? 'bg-amber-50 text-amber-600 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <div className="flex items-center gap-3">
                <t.icon size={18} />
                <span className="text-sm">{t.label}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-md ${activeTab === t.id ? 'bg-amber-100' : 'bg-gray-100'}`}>{t.count}</span>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-gray-100">
          <button onClick={() => router.push("/")} className="text-sm text-gray-500 hover:text-gray-800 flex items-center gap-2">
            Retour au site
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Vue d'ensemble</h2>
          <button onClick={fetchAllData} className="text-sm bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50">
            Actualiser les données
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">Chargement de la base de données...</div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            
            {/* Table Users/Dogs */}
            {activeTab === "users" && (
              <div>
                <h3 className="text-lg font-bold mb-4">Inscriptions (Chiens)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-500">
                        <th className="pb-3 font-medium">Nom du chien</th>
                        <th className="pb-3 font-medium">Race</th>
                        <th className="pb-3 font-medium">ID Utilisateur</th>
                        <th className="pb-3 font-medium">Création</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dogs.map(d => (
                        <tr key={d.id} className="border-b border-gray-50">
                          <td className="py-3 font-medium">{d.name}</td>
                          <td className="py-3 text-gray-500">{d.breed}</td>
                          <td className="py-3 text-xs text-gray-400 font-mono">{d.user_id}</td>
                          <td className="py-3 text-gray-500">{new Date(d.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Table Partners */}
            {activeTab === "partners" && (
              <div>
                <h3 className="text-lg font-bold mb-4">Partenaires Professionnels</h3>
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500">
                      <th className="pb-3 font-medium">Entreprise</th>
                      <th className="pb-3 font-medium">Catégorie</th>
                      <th className="pb-3 font-medium">Ville</th>
                      <th className="pb-3 font-medium">Premium</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.map(p => (
                      <tr key={p.id} className="border-b border-gray-50">
                        <td className="py-3 font-medium">{p.name}</td>
                        <td className="py-3 text-gray-500 capitalize">{p.category}</td>
                        <td className="py-3 text-gray-500">{p.city}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${p.premium ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                            {p.premium ? 'Oui' : 'Non'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Module Automatisations */}
            {activeTab === "automations" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2"><Zap className="text-amber-500" size={20}/> Scénarios Automatisés</h3>
                  <button className="text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-white px-4 py-2 rounded-lg hover:shadow-md transition-shadow font-semibold">
                    + Nouveau scénario
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {[
                    { title: "Email de Bienvenue", desc: "Envoyé 5min après l'inscription (Présentation de Velox IA)", status: "Actif", type: "Email" },
                    { title: "Anniversaire du chien", desc: "Notification Push le jour J avec cadeau", status: "Actif", type: "Push" },
                    { title: "Tutoriel d'utilisation", desc: "Série de 3 emails éducatifs sur 7 jours", status: "Brouillon", type: "Séquence Email" },
                    { title: "Alerte Chien Perdu", desc: "Mail massif aux utilisateurs à <5km de la perte", status: "Actif", type: "Urgence DB" },
                  ].map((auto, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-4 flex items-start gap-4 hover:shadow-md transition-shadow cursor-pointer bg-white">
                      <div className={`p-3 rounded-xl shadow-inner ${auto.status === 'Actif' ? 'bg-gradient-to-br from-emerald-400 to-emerald-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        {auto.type.includes("Email") ? <Mail size={18}/> : <Zap size={18}/>}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-800">{auto.title}</h4>
                        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{auto.desc}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${auto.status === 'Actif' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>{auto.status}</span>
                          <span className="text-[9px] font-mono text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">{auto.type}</span>
                        </div>
                      </div>
                      <button className="text-gray-300 hover:text-amber-500"><Play size={20} className={auto.status === 'Actif' ? 'text-emerald-500' : ''} fill={auto.status === 'Actif' ? 'currentColor' : 'none'}/></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other tabs omitted for brevity, simple messages instead */}
            {["checkins", "lost", "reports"].includes(activeTab) && (
              <div className="text-gray-500 py-10 text-center border-2 border-dashed border-gray-100 rounded-xl">
                Module de données "{activeTab}" activé. ({tabs.find(t=>t.id === activeTab)?.count} enregistrements)
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
