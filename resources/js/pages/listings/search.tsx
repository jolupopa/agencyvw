// resources/js/Pages/Listings/Search.tsx
import React, { useEffect, useState } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
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
}

interface Option {
    id: number;
    name: string;
    category?: string;
}

interface Props extends PageProps {
    listings: {
        data: Listing[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
    filters: {
        offer_type_id?: number;
        property_type_id?: number;
        keyword?: string;
    };
    offerTypes: Option[];
    propertyTypes: Option[];
}

const Search: React.FC<Props> = () => {
    const { listings, filters, offerTypes, propertyTypes } = usePage<Props>().props;

    const [formFilters, setFormFilters] = useState({
        offer_type_id: filters.offer_type_id || '',
        property_type_id: filters.property_type_id || '',
        keyword: filters.keyword || '',
    });

    const [filteredPropertyTypes, setFilteredPropertyTypes] = useState<Option[]>([]);

    // Filter property types based on offer_type_id
    useEffect(() => {
        const offerType = offerTypes.find(opt => opt.id == formFilters.offer_type_id);
        if (offerType) {
            if (offerType.name === 'project') {
                setFilteredPropertyTypes(propertyTypes.filter(pt => pt.category === 'project'));
            } else if (offerType.name === 'temporary_accommodation') {
                setFilteredPropertyTypes(propertyTypes.filter(pt => ['shared_bathroom_room', 'private_room', 'student_room'].includes(pt.name)));
            } else {
                setFilteredPropertyTypes(propertyTypes.filter(pt => pt.category === 'property'));
            }
        } else {
            setFilteredPropertyTypes([]);
        }
        // Reset property_type_id if not in filtered options
        if (!filteredPropertyTypes.some(pt => pt.id == formFilters.property_type_id)) {
            setFormFilters((prev) => ({ ...prev, property_type_id: '' }));
        }
    }, [formFilters.offer_type_id, offerTypes, propertyTypes]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/listings/search', formFilters, { preserveState: true });
    };

    // Map offer_type and property_type names to display labels
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
        urban_land_project: 'Proyecto de Terreno Urbano',
        agricultural_land_project: 'Proyecto de Terreno Agrícola',
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Buscador de Listados</h1>

            <form onSubmit={handleSubmit} className="mb-6 bg-white p-4 rounded shadow">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="offer_type_id" className="block text-sm font-medium text-gray-700">Tipo de Oferta</label>
                        <select
                            id="offer_type_id"
                            name="offer_type_id"
                            value={formFilters.offer_type_id}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="">Todos</option>
                            {offerTypes.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {displayLabels[opt.name] || opt.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="property_type_id" className="block text-sm font-medium text-gray-700">Tipo de Propiedad/Proyecto</label>
                        <select
                            id="property_type_id"
                            name="property_type_id"
                            value={formFilters.property_type_id}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            disabled={!formFilters.offer_type_id}
                        >
                            <option value="">Todos</option>
                            {filteredPropertyTypes.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {displayLabels[opt.name] || opt.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">Ciudad/Provincia/Departamento</label>
                        <input
                            type="text"
                            id="keyword"
                            name="keyword"
                            value={formFilters.keyword}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            placeholder="Ej: Lima"
                        />
                    </div>
                </div>
                <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Buscar</button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.data.map((listing) => (
                    <div key={listing.id} className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-bold">{listing.title}</h2>
                        <p className="text-gray-600">{listing.description?.substring(0, 100)}...</p>
                        <p className="font-semibold">Precio: {listing.price ? `${listing.currency} ${listing.price}` : 'Consultar'}</p>
                        <p>Tipo de Oferta: {displayLabels[listing.offer_type.name] || listing.offer_type.name}</p>
                        <p>Tipo de Propiedad: {displayLabels[listing.property_type.name] || listing.property_type.name}</p>
                        <p>Ciudad: {listing.city || 'No especificada'}</p>
                        <Link href={`/listings/${listing.id}`} className="text-blue-500">Ver Detalles</Link>
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

            {listings.data.length === 0 && <p className="text-center text-gray-500">No se encontraron resultados.</p>}
        </div>
    );
};

export default Search;
