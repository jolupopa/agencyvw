import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { type SharedData, type Listing, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import MapPicker from '@/components/map-picker';

interface Props extends SharedData {
    listing: Listing;
}

export default function Show({ listing }: Props) {
    const { auth } = usePage<Props>().props;

    // Coordenadas seguras para asegurar que el mapa se muestre.
    // Si la latitud/longitud no existe, usará el centro de Trujillo
    const lat = listing.latitude ?? -8.1091;
    const lng = listing.longitude ?? -79.0238;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Anuncios',
            href: '/listings',
        },
        {
            title: listing.title,
            href: `/listings/${listing.id}`,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={listing.title} />

            <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-xl">
                <h1 className="text-3xl font-bold mb-4">{listing.title}</h1>
                <p className="text-xl text-blue-600 mb-6">{listing.currency} {listing.price?.toLocaleString()}</p>

                {/* VISUALIZACIÓN DEL MAPA */}
                <div className="mt-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-3">Ubicación</h2>
                    <MapPicker
                        initialLatitude={lat}
                        initialLongitude={lng}
                        // La función de cambio es vacía, ya que solo es lectura
                        onPositionChange={() => {}}
                        isClickable={false} // Deshabilitar interacción
                    />
                </div>
                {/* FIN DE VISUALIZACIÓN DEL MAPA */}

                <h2 className="text-2xl font-semibold mb-3">Detalles</h2>
                <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
                {/* Aquí puedes añadir el resto de los detalles del listado */}
            </div>
        </AppLayout>
    );
}
