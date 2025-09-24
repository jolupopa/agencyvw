import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';

interface Media {
    id: number;
    path: string;
    type: 'image' | 'video' | 'plan' | '360_tour';
    order: number;
}
interface Amenity {
    id: number;
    name: string;
    slug: string;
    icon?: string;
}

interface Listing {
    id: number;
    title: string;
    description: string | null;
    price: number | null;
    currency: string;
    offer_type: { id: number; name: string };
    property_type: { id: number; name: string };
    city: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    land_area: number | null;
    built_area: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    floors: number | null;
    parking_spaces: number | null;
    attributes: { [key: string]: any } | null;
    amenities: Amenity[];
    parent_id: number | null;
    parent?: { id: number; title: string; offer_type: { name: string }; property_type: { name: string } };
    subprojects: Listing[];
    media: Media[];
}

interface Props extends PageProps {
    listing: Listing;
}

const Show: React.FC<Props> = () => {
    const { listing } = usePage<Props>().props;

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

    const isTerrain = ['urban_land', 'agricultural_land'].includes(listing.property_type.name);
    const isProject = listing.offer_type.name === 'project';
    const isTemporary = listing.offer_type.name === 'temporary_accommodation';

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">{listing.title}</h1>
            <div className="bg-white p-6 rounded shadow">
                {/* Media Section */}
                {listing.media.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Media</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {listing.media.map((media) => (
                                <div key={media.id} className="relative">
                                    {media.type === 'image' && (
                                        <img src={media.path} alt="Listing media" className="w-full h-48 object-cover rounded" />
                                    )}
                                    {media.type === 'video' && (
                                        <video controls className="w-full h-48 object-cover rounded">
                                            <source src={media.path} type="video/mp4" />
                                        </video>
                                    )}
                                    {media.type === 'plan' && (
                                        <div>
                                            <a href={media.path} target="_blank" className="text-blue-500">Ver Plano</a>
                                        </div>
                                    )}
                                    {media.type === '360_tour' && (
                                        <a href={media.path} target="_blank" className="text-blue-500">Ver Tour 360°</a>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Basic Info */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Información Básica</h2>
                    <p><strong>Tipo de Oferta:</strong> {displayLabels[listing.offer_type.name] || listing.offer_type.name}</p>
                    <p><strong>Tipo de Propiedad:</strong> {displayLabels[listing.property_type.name] || listing.property_type.name}</p>
                    <p><strong>Precio:</strong> {listing.price ? `${listing.currency} ${listing.price}` : 'Consultar'}</p>
                    <p><strong>Ciudad:</strong> {listing.city || 'No especificada'}</p>
                    <p><strong>Dirección:</strong> {listing.address || 'No especificada'}</p>
                </div>

                {/* Location */}
                {(listing.latitude || listing.longitude) && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Ubicación</h2>
                        <p><strong>Latitud:</strong> {listing.latitude ?? 'No especificada'}</p>
                        <p><strong>Longitud:</strong> {listing.longitude ?? 'No especificada'}</p>
                        {/* Placeholder for map */}
                        <div className="h-64 bg-gray-200 rounded flex items-center justify-center">
                            <p>Mapa (Integrar Leaflet con {listing.latitude}, {listing.longitude})</p>
                        </div>
                    </div>
                )}

                {/* Property Details */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Detalles</h2>
                    {isTerrain && (
                        <p><strong>Área del Terreno:</strong> {listing.land_area} m²</p>
                    )}
                    {(!isTerrain && !isProject) && (
                        <>
                            <p><strong>Área Construida:</strong> {listing.built_area ? `${listing.built_area} m²` : 'No especificada'}</p>
                            <p><strong>Habitaciones:</strong> {listing.bedrooms ?? 'No especificada'}</p>
                            <p><strong>Baños:</strong> {listing.bathrooms ?? 'No especificada'}</p>
                            <p><strong>Pisos:</strong> {listing.floors ?? 'No especificada'}</p>
                            <p><strong>Estacionamientos:</strong> {listing.parking_spaces ?? 'No especificada'}</p>
                        </>
                    )}
                </div>

                {/* Attributes */}
                {listing.attributes && Object.keys(listing.attributes).length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Atributos Adicionales</h2>
                        <ul className="list-disc pl-5">
                            {Object.entries(listing.attributes).map(([key, value]) => (
                                <li key={key}>
                                    <strong>{key}:</strong> {Array.isArray(value) ? value.join(', ') : value}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Amenities */}
                {listing.amenities && listing.amenities.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Amenidades</h2>
                        <div className="flex flex-wrap gap-2">
                            {listing.amenities.map((amenity) => (
                                // Aquí puedes usar un componente de Shadcn, como <Badge> o <Tag>
                                <div key={amenity.id} className="bg-primary/10 text-primary-foreground text-sm font-medium py-1 px-3 rounded-full">
                                    {/* {amenity.icon && <img src={amenity.icon} alt="" className="inline-block h-4 w-4 mr-2" />} */}
                                    {amenity.name}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Subprojects (for projects only) */}
                {isProject && listing.subprojects.length > 0 && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Subproyectos</h2>
                        <ul className="list-disc pl-5">
                            {listing.subprojects.map((subproject) => (
                                <li key={subproject.id}>
                                    <Link href={`/listings/${subproject.id}`} className="text-blue-500">
                                        {subproject.title} ({displayLabels[subproject.property_type.name] || subproject.property_type.name})
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Parent Project */}
                {listing.parent && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Proyecto Padre</h2>
                        <p>
                            <Link href={`/listings/${listing.parent.id}`} className="text-blue-500">
                                {listing.parent.title}
                            </Link>
                        </p>
                    </div>
                )}

                {/* Description */}
                {listing.description && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Descripción</h2>
                        <p className="text-gray-600">{listing.description}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex space-x-4">

                    <Link href={route('listings.index')} className="bg-gray-500 text-white px-4 py-2 rounded">Volver</Link>
                </div>
            </div>
        </div>
    );
};

export default Show;
