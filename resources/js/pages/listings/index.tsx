import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';

interface Listing {
    id: number;
    title: string;
    description: string | null;
    price: number | null;
    currency: string;
    offer_type: { id: number; name: string };
    property_type: { id: number; name: string };
    city: string | null;
    media?: { id: number; path: string; type: string; order: number } | null;
}

interface Props extends PageProps {
    listings: {
        data: Listing[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
}

const Index: React.FC<Props> = () => {
    const { listings } = usePage<Props>().props;

    const displayLabels: { [key: string]: string } = {
        sale: 'Venta',
        rent: 'Alquiler',
        project: 'Proyecto',
        temporary_accommodation: 'Alojamiento Temporal',
        house: 'Casa',
        apartment: 'Departamento',
        office: 'Oficina',
        urban_land: 'Terreno Urbano',
        agricultural_land: 'Terreno Agrícola',
        shared_bathroom_room: 'Habitación con Baño Compartido',
        private_room: 'Habitación Propia',
        student_room: 'Habitación para Universitarios',
        condo_project: 'Proyecto en Condominios',
        commercial_project: 'Proyecto Comercial',
        residential_project: 'Proyecto Residencial',
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Listados de Propiedades</h1>
            <div className="mb-4">
                <Link href={route('listings.create')} className="bg-blue-500 text-white px-4 py-2 rounded">Crear Nuevo Listado</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.data.map((listing) => (
                    <div key={listing.id} className="bg-white p-4 rounded shadow">
                        {listing.media && (
                            <img
                                src={listing.media.path}
                                alt={listing.title}
                                className="w-full h-48 object-cover rounded mb-4"
                            />
                        )}


                        <h2 className="text-xl font-bold">{listing.title}</h2>
                        <p className="text-gray-600">{listing.description?.substring(0, 100)}...</p>
                        <p className="font-semibold">Precio: {listing.price ? `${listing.currency} ${listing.price}` : 'Consultar'}</p>
                        <p>Tipo de Oferta: {displayLabels[listing.offer_type.name] || listing.offer_type.name}</p>
                        <p>Tipo de Propiedad: {displayLabels[listing.property_type.name] || listing.property_type.name}</p>
                        <p>Ciudad: {listing.city || 'No especificada'}</p>
                        <div className="flex space-x-2 mt-2">
                            <Link href={`/listings/${listing.id}`} className="text-blue-500">Ver Detalles</Link>
                            <Link href={`/listings/${listing.id}/edit`} className="text-green-500">Editar</Link>
                        </div>
                    </div>
                ))}
            </div>

            {listings.data.length > 0 && (
                <div className="mt-6 flex justify-center">
                    {listings.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`px-3 py-1 mx-1 rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            preserveState
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Link>
                    ))}
                </div>
            )}

            {listings.data.length === 0 && <p className="text-center text-gray-500">No hay listados disponibles.</p>}
        </div>
    );
};

export default Index;
