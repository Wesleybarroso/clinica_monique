import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    __clinicLeafletMap?: L.Map;
  }
}

export interface MapCoordinates {
  lat: number;
  lng: number;
}

interface MapViewProps {
  className?: string;
  initialCenter?: MapCoordinates;
  initialZoom?: number;
  onMapReady?: (map: L.Map) => void;
}

const clinicIcon = L.divIcon({
  className: "clinic-leaflet-marker",
  html: '<span class="clinic-leaflet-marker__dot" aria-hidden="true"></span>',
  iconSize: [34, 42],
  iconAnchor: [17, 42],
  popupAnchor: [0, -38],
});

export function MapView({
  className,
  initialCenter = { lat: -23.547313, lng: -46.570779 },
  initialZoom = 16,
  onMapReady,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    const map = L.map(mapContainer.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true,
      doubleClickZoom: true,
      touchZoom: true,
      keyboard: true,
    }).setView([initialCenter.lat, initialCenter.lng], initialZoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    L.marker([initialCenter.lat, initialCenter.lng], { icon: clinicIcon })
      .addTo(map)
      .bindPopup("<strong>Dra. Monique Cascapera</strong><br />Tatuapé · São Paulo")
      .openPopup();

    mapInstance.current = map;
    if (import.meta.env.DEV) window.__clinicLeafletMap = map;
    onMapReady?.(map);

    const resizeObserver = new ResizeObserver(() => map.invalidateSize());
    resizeObserver.observe(mapContainer.current);

    return () => {
      resizeObserver.disconnect();
      mapInstance.current = null;
      if (import.meta.env.DEV) delete window.__clinicLeafletMap;
      try {
        map.stop();
        map.off();
        map.remove();
      } catch (error) {
        console.warn("Leaflet cleanup skipped after map teardown", error);
        map.getContainer()?.replaceChildren();
      }
    };
  }, [initialCenter.lat, initialCenter.lng, initialZoom, onMapReady]);

  return (
    <div
      ref={mapContainer}
      className={cn("w-full h-[500px]", className)}
      role="application"
      aria-label="Mapa interativo da clínica Monique Cascapera"
    />
  );
}
