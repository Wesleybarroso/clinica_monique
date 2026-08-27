export const clinicAddress = "R. Emílio Mallet, 317 — sala 307 — Vila Gomes Cardim, São Paulo — SP, 03320-000";
export const clinicCoordinates = { lat: -23.547313, lng: -46.570779 } as const;
export const clinicMapLink = "https://www.google.com/maps/place/Dentista+Tatuap%C3%A9+-+Dra+Monique+Cascapera/@-23.547313,-46.570779,17z";
export const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(clinicAddress)}`;
export const uberLink = `https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${clinicCoordinates.lat}&dropoff[longitude]=${clinicCoordinates.lng}&dropoff[nickname]=${encodeURIComponent("Dra. Monique Cascapera")}&dropoff[formatted_address]=${encodeURIComponent(clinicAddress)}`;
