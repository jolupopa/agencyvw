import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix para que los iconos de Leaflet funcionen correctamente con Webpack/Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


// Coordenadas de la Plaza de Armas de Trujillo, Perú
const TRUJILLO_CENTER: [number, number] = [-8.1091, -79.0238];
const DEFAULT_ZOOM = 13;

interface MapPickerProps {
    initialLatitude: number | null;
    initialLongitude: number | null;
    onPositionChange: (lat: number, lng: number) => void;
    // Opcional para centrar el mapa al hacer click
    isClickable?: boolean;
}

const DraggableMarker: React.FC<{
    position: [number, number];
    onDragEnd: (lat: number, lng: number) => void
}> = ({ position, onDragEnd }) => {
    const [draggable, setDraggable] = useState(true);
    const markerRef = useRef<L.Marker>(null);

    const eventHandlers = useMemo(() => ({
        // Esta función se llama al soltar el pin
        dragend() {
            const marker = markerRef.current;
            if (marker != null) {
                const newPos = marker.getLatLng();
                onDragEnd(newPos.lat, newPos.lng);
            }
        },
    }), [onDragEnd]);

    // Usamos useEffect para actualizar la posición del marcador si las props cambian
    useEffect(() => {
        if (markerRef.current) {
            markerRef.current.setLatLng(position);
        }
    }, [position]);

    return (
        <Marker
            draggable={draggable}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}
        >
        </Marker>
    );
};


const MapClickHandler: React.FC<{ onMapClick: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
    // Hook que captura eventos del mapa.
    useMapEvents({
        click(e) {
            onMapClick(e.latlng.lat, e.latlng.lng);
        },
    });
    return null;
};


const MapPicker: React.FC<MapPickerProps> = ({ initialLatitude, initialLongitude, onPositionChange, isClickable = true }) => {
    // Usa la posición inicial o el centro de Trujillo como valor por defecto
    const [position, setPosition] = useState<[number, number]>(
        (initialLatitude && initialLongitude)
            ? [initialLatitude, initialLongitude]
            : TRUJILLO_CENTER
    );

    // Actualiza la posición local si las props externas cambian
    useEffect(() => {
        if (initialLatitude && initialLongitude) {
            setPosition([initialLatitude, initialLongitude]);
        }
    }, [initialLatitude, initialLongitude]);

    const handleDragEnd = useCallback((lat: number, lng: number) => {
        setPosition([lat, lng]);
        onPositionChange(lat, lng);
    }, [onPositionChange]);

    const handleMapClick = useCallback((lat: number, lng: number) => {
        if (isClickable) {
            setPosition([lat, lng]);
            onPositionChange(lat, lng);
        }
    }, [onPositionChange, isClickable]);


    return (
        <div className="w-full h-96 rounded-md shadow-lg overflow-hidden">
            <MapContainer
                center={position}
                zoom={DEFAULT_ZOOM}
                scrollWheelZoom={true}
                className="w-full h-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {isClickable && <MapClickHandler onMapClick={handleMapClick} />}

                <DraggableMarker position={position} onDragEnd={handleDragEnd} />
            </MapContainer>
        </div>
    );
};

export default MapPicker;
