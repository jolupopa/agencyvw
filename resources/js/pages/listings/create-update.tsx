// resources/js/Pages/Listings/CreateUpdate.tsx
import React, { useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';
import axios from 'axios';

interface Listing {
    id?: number;
    title: string;
    description: string | null;
    price: number | null;
    currency: string;
    offer_type_id: number | string;
    property_type_id: number | string;
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
    attributes: string | null;
    parent_id: number | null;
    offer_type?: { id: number; name: string }; // Optional, from eager loading
    property_type?: { id: number; name: string }; // Optional, from eager loading
}

interface Option {
    id: number;
    name: string;
    category?: string;
}

interface Project {
    id: number;
    title: string;
}

interface Props extends PageProps {
    listing?: Listing;
    offerTypes: Option[];
    propertyTypes: Option[];
    projects: Project[];
}

const CreateUpdate: React.FC<Props> = () => {
    const { listing, offerTypes, propertyTypes, projects } = usePage<Props>().props;

    const [formData, setFormData] = useState<Listing>({
        title: listing?.title || '',
        description: listing?.description || '',
        price: listing?.price || null,
        currency: listing?.currency || 'USD',
        offer_type_id: listing?.offer_type_id || '',
        property_type_id: listing?.property_type_id || '',
        city: listing?.city || '',
        address: listing?.address || '',
        latitude: listing?.latitude || null,
        longitude: listing?.longitude || null,
        land_area: listing?.land_area || null,
        built_area: listing?.built_area || null,
        bedrooms: listing?.bedrooms || null,
        bathrooms: listing?.bathrooms || null,
        floors: listing?.floors || null,
        parking_spaces: listing?.parking_spaces || null,
        attributes: listing?.attributes || '',
        parent_id: listing?.parent_id || null,
    });

    const [filteredPropertyTypes, setFilteredPropertyTypes] = useState<Option[]>([]);

    useEffect(() => {
        // Filter property types based on offer_type_id
        const offerType = offerTypes.find(opt => opt.id == formData.offer_type_id);
        if (offerType) {
            axios.get('/property-types', { params: { offer_type_id: formData.offer_type_id } }).then((response) => {
                setFilteredPropertyTypes(response.data);
                // Reset property_type_id if not in new options
                if (!response.data.some((opt: Option) => opt.id == formData.property_type_id)) {
                    setFormData((prev) => ({ ...prev, property_type_id: '' }));
                }
            });
        } else {
            setFilteredPropertyTypes(propertyTypes);
        }
    }, [formData.offer_type_id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value === '' ? null : (e.target.type === 'number' ? parseFloat(value) : value),
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Create a payload excluding non-serializable fields
        const payload = {
            title: formData.title,
            description: formData.description,
            price: formData.price,
            currency: formData.currency,
            offer_type_id: formData.offer_type_id,
            property_type_id: formData.property_type_id,
            city: formData.city,
            address: formData.address,
            latitude: formData.latitude,
            longitude: formData.longitude,
            land_area: formData.land_area,
            built_area: formData.built_area,
            bedrooms: formData.bedrooms,
            bathrooms: formData.bathrooms,
            floors: formData.floors,
            parking_spaces: formData.parking_spaces,
            attributes: formData.attributes,
            parent_id: formData.parent_id,
        };

        const method = listing ? 'put' : 'post';
        const url = listing ? `/listings/${listing.id}` : '/listings';
        router[method](url, payload, {
            onSuccess: () => router.visit('/listings'),
            onError: (errors) => console.error(errors),
        });
    };

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

    const isTerrain = ['urban_land', 'agricultural_land'].includes(
        filteredPropertyTypes.find(pt => pt.id == formData.property_type_id)?.name || ''
    );
    const isProject = offerTypes.find(opt => opt.id == formData.offer_type_id)?.name === 'project';
    const isTemporary = offerTypes.find(opt => opt.id == formData.offer_type_id)?.name === 'temporary_accommodation';

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">{listing ? 'Editar Listado' : 'Crear Listado'}</h1>
            <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow max-w-2xl mx-auto">
                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price ?? ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Moneda</label>
                        <select
                            id="currency"
                            name="currency"
                            value={formData.currency}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            required
                        >
                            <option value="USD">USD</option>
                            <option value="PEN">PEN</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="offer_type_id" className="block text-sm font-medium text-gray-700">Tipo de Oferta</label>
                        <select
                            id="offer_type_id"
                            name="offer_type_id"
                            value={formData.offer_type_id}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            required
                        >
                            <option value="">Seleccionar</option>
                            {offerTypes.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {displayLabels[opt.name] || opt.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="property_type_id" className="block text-sm font-medium text-gray-700">Tipo de Propiedad</label>
                        <select
                            id="property_type_id"
                            name="property_type_id"
                            value={formData.property_type_id}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            required
                        >
                            <option value="">Seleccionar</option>
                            {filteredPropertyTypes.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                    {displayLabels[opt.name] || opt.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ciudad</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">Latitud</label>
                        <input
                            type="number"
                            id="latitude"
                            name="latitude"
                            value={formData.latitude ?? ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    <div>
                        <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">Longitud</label>
                        <input
                            type="number"
                            id="longitude"
                            name="longitude"
                            value={formData.longitude ?? ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        />
                    </div>
                    {isTerrain && (
                        <div>
                            <label htmlFor="land_area" className="block text-sm font-medium text-gray-700">Área del Terreno (m²)</label>
                            <input
                                type="number"
                                id="land_area"
                                name="land_area"
                                value={formData.land_area ?? ''}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>
                    )}
                    {(!isTerrain && !isProject) && (
                        <>
                            <div>
                                <label htmlFor="built_area" className="block text-sm font-medium text-gray-700">Área Construida (m²)</label>
                                <input
                                    type="number"
                                    id="built_area"
                                    name="built_area"
                                    value={formData.built_area ?? ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    required={!isTemporary}
                                />
                            </div>
                            <div>
                                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Habitaciones</label>
                                <input
                                    type="number"
                                    id="bedrooms"
                                    name="bedrooms"
                                    value={formData.bedrooms ?? ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Baños</label>
                                <input
                                    type="number"
                                    id="bathrooms"
                                    name="bathrooms"
                                    value={formData.bathrooms ?? ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="floors" className="block text-sm font-medium text-gray-700">Pisos</label>
                                <input
                                    type="number"
                                    id="floors"
                                    name="floors"
                                    value={formData.floors ?? ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                />
                            </div>
                            <div>
                                <label htmlFor="parking_spaces" className="block text-sm font-medium text-gray-700">Estacionamientos</label>
                                <input
                                    type="number"
                                    id="parking_spaces"
                                    name="parking_spaces"
                                    value={formData.parking_spaces ?? ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                />
                            </div>
                        </>
                    )}
                    {isProject && (
                        <div>
                            <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700">Proyecto Padre</label>
                            <select
                                id="parent_id"
                                name="parent_id"
                                value={formData.parent_id ?? ''}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            >
                                <option value="">Ninguno</option>
                                {projects.map((project) => (
                                    <option key={project.id} value={project.id}>{project.title}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div>
                        <label htmlFor="attributes" className="block text-sm font-medium text-gray-700">Atributos Adicionales (JSON)</label>
                        <textarea
                            id="attributes"
                            name="attributes"
                            value={formData.attributes || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            placeholder='Ej: {"amenities": ["piscina"]}'
                        />
                    </div>
                </div>
                <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                    {listing ? 'Actualizar' : 'Crear'}
                </button>
            </form>
        </div>
    );
};

export default CreateUpdate;
