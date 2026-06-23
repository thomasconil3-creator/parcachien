"use client";

import { useEffect, useRef, useState } from "react";
import { Park } from "@/lib/parks-data";
import { CheckIn } from "@/lib/types";

interface MapProps {
  parks: Park[];
  onParkSelect?: (park: Park) => void;
  checkins?: CheckIn[];
}

export default function Map({ parks, onParkSelect, checkins = [] }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const LRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize Map Instance once
  useEffect(() => {
    if (!isClient || !mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");
      await import("leaflet.markercluster");
      await import("leaflet.markercluster/dist/MarkerCluster.css");
      await import("leaflet.markercluster/dist/MarkerCluster.Default.css");
      LRef.current = L;

      // Fix Leaflet default marker icons issue
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Default center in PACA region
      const map = L.map(mapRef.current!).setView([43.7, 6.0], 8);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Cluster group for grouping markers on zoom out
      const markersLayer = (L as any).markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 50,
        iconCreateFunction: (cluster: any) => {
          const count = cluster.getChildCount();
          return L.divIcon({
            html: `<div style="background:#7C6EF5;color:white;width:36px;height:36px;border-radius:50%;border:3px solid white;box-shadow:0 3px 10px rgba(124,110,245,0.4);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;">${count}</div>`,
            className: "",
            iconSize: [36, 36],
            iconAnchor: [18, 18],
          });
        },
      }).addTo(map);
      markersLayerRef.current = markersLayer;

      setMapReady(true);
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        LRef.current = null;
        setMapReady(false);
      }
    };
  }, [isClient]);

  // Update markers when parks or checkins change
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !markersLayerRef.current || !LRef.current) return;

    const L = LRef.current;
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;

    // Clear previous markers
    markersLayer.clearLayers();

    if (parks.length === 0) return;

    const bounds = L.latLngBounds([]);

    parks.forEach((park) => {
      const now = Date.now();
      const activeParkCheckins = checkins.filter((c) => c.parkId === park.id && c.expiresAt > now);
      const count = activeParkCheckins.length;
      const dotColor = count === 0 ? "#9CA3AF" : count <= 2 ? "#22C55E" : count <= 5 ? "#EAB308" : "#EF4444";

      const isVet = park.type === 'vet';
      const isShop = park.type === 'shop';
      const iconText = isVet ? '⚕️' : isShop ? '🛍️' : '🐾';
      const bg = isVet ? '#10B981' : isShop ? '#F59E0B' : '#7C6EF5';

      const icon = L.divIcon({
        html: `<div style="position:relative;width:36px;height:36px;cursor:pointer;">
          <div style="background:${bg};width:36px;height:36px;border-radius:50%;border:3px solid white;box-shadow:0 3px 10px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;font-size:15px;transition: transform 0.2s ease;" onmouseover="this.style.transform='scale(1.1)';" onmouseout="this.style.transform='scale(1)';">${iconText}</div>
          ${count > 0 ? `<div style="position:absolute;top:-4px;right:-4px;background:${dotColor};color:white;width:18px;height:18px;border-radius:50%;border:2px solid white;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 4px rgba(0,0,0,0.2);">${count}</div>` : ""}
        </div>`,
        className: "",
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([park.lat, park.lng], { icon });
      
      marker.on("click", () => {
        onParkSelect?.(park);
        map.setView([park.lat, park.lng], Math.max(map.getZoom(), 12), { animate: true });
      });
      
      marker.bindTooltip(
        `<div style="font-family:sans-serif;font-weight:600;font-size:12px;color:#242019;padding:2px 4px;">${park.name}</div>`, 
        { direction: "top", offset: [0, -18], opacity: 0.95 }
      );
      
      markersLayer.addLayer(marker);
      bounds.extend([park.lat, park.lng]);
    });

    // Auto-fit bounds if filtered (searched city or dept)
    if (parks.length > 0 && parks.length < 50) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [mapReady, parks, checkins, onParkSelect]);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 font-semibold animate-pulse">Chargement de la carte des parcs...</p>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full" style={{ zIndex: 1 }} />;
}
