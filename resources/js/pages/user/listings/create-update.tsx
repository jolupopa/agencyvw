import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Crear Anuncio',
        href: '/user/listings/create-update',
    },
];

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
    user_id?: number;
    offer_type?: { id: number; name: string };
    property_type?: { id: number; name: string };
    media?: { id: number; path: string; type: string; order: number }[];
}

interface Subproject {
    title: string;
    description: string | null;
    price: number | null;
    property_type_id: number | string;
    land_area: number | null;
    built_area: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    floors: number | null;
    parking_spaces: number | null;
    attributes: string | null;
    user_id?: number;
}

interface Option {
    id: number;
    name: string;
    category?: string;
}

interface Props extends PageProps {
    listing?: Listing;
    offerTypes: Option[];
    propertyTypes: Option[];
    projects: { id: number; title: string }[];
}

export default function CreateUpdate({ offerTypes, propertyTypes, projects }: Props) {

    const { listing } = usePage<Props>().props;

    const { auth } = usePage<SharedData>().props;

    const isEditing = !!listing;
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
        user_id: listing?.user_id || auth.user?.id,
    });

    const [subprojects, setSubprojects] = useState<Subproject[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const [imageErrors, setImageErrors] = useState<string[]>([]);
    const [filteredPropertyTypes, setFilteredPropertyTypes] = useState<Option[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Filter property types based on offer_type_id
    useEffect(() => {
        if (!formData.offer_type_id) {
            setFilteredPropertyTypes([]);
            return;
        }
        const offerType = offerTypes.find(opt => opt.id == formData.offer_type_id);
        if (offerType) {
            if (offerType.name === 'project') {
                setFilteredPropertyTypes(propertyTypes.filter(pt => pt.category === 'project'));
            } else if (offerType.name === 'temporary_accommodation') {
                setFilteredPropertyTypes(propertyTypes.filter(pt => ['shared_bathroom_room', 'private_room', 'student_room'].includes(pt.name)));
            } else {
                setFilteredPropertyTypes(propertyTypes.filter(pt => pt.category === 'property'));
            }
        }
    }, [formData.offer_type_id, offerTypes, propertyTypes]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value === '' ? null : (e.target.type === 'number' ? parseFloat(value) : value),
        }));
    };

    const handleSubprojectChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSubprojects((prev) => {
            const newSubprojects = [...prev];
            newSubprojects[index] = {
                ...newSubprojects[index],
                [name]: value === '' ? null : (e.target.type === 'number' ? parseFloat(value) : value),
            };
            return newSubprojects;
        });
    };

    const addSubproject = () => {
        setSubprojects((prev) => [
            ...prev,
            {
                title: '',
                description: '',
                price: null,
                property_type_id: '',
                land_area: null,
                built_area: null,
                bedrooms: null,
                bathrooms: null,
                floors: null,
                parking_spaces: null,
                attributes: '',
                user_id: auth.user?.id,
            },
        ]);
    };

    const removeSubproject = (index: number) => {
        setSubprojects((prev) => prev.filter((_, i) => i !== index));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        const errors: string[] = [];
        const validFiles: File[] = [];

        if (files) {
            Array.from(files).forEach((file, index) => {
                const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
                const maxSize = 2 * 1024 * 1024; // 2MB
                if (!validTypes.includes(file.type)) {
                    errors.push(`Imagen ${index + 1}: Tipo de archivo no válido. Use JPEG, PNG, JPG o GIF.`);
                } else if (file.size > maxSize) {
                    errors.push(`Imagen ${index + 1}: El tamaño excede 2MB.`);
                } else {
                    validFiles.push(file);
                }
            });
        }

        setImageErrors(errors);
        setImages((prev) => [...prev, ...validFiles]);
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (imageErrors.length > 0) {
            alert('Corrija los errores en las imágenes antes de enviar.');
            return;
        }

        setIsLoading(true);

        const form = new FormData();
        form.append('title', formData.title || '');
        form.append('description', formData.description || '');
        if (formData.price !== null) form.append('price', formData.price.toString());
        form.append('currency', formData.currency);
        form.append('offer_type_id', formData.offer_type_id.toString());
        form.append('property_type_id', formData.property_type_id.toString());
        form.append('city', formData.city || '');
        form.append('address', formData.address || '');
        if (formData.latitude !== null) form.append('latitude', formData.latitude.toString());
        if (formData.longitude !== null) form.append('longitude', formData.longitude.toString());
        if (formData.land_area !== null) form.append('land_area', formData.land_area.toString());
        if (formData.built_area !== null) form.append('built_area', formData.built_area.toString());
        if (formData.bedrooms !== null) form.append('bedrooms', formData.bedrooms.toString());
        if (formData.bathrooms !== null) form.append('bathrooms', formData.bathrooms.toString());
        if (formData.floors !== null) form.append('floors', formData.floors.toString());
        if (formData.parking_spaces !== null) form.append('parking_spaces', formData.parking_spaces.toString());
        form.append('attributes', formData.attributes || '');
        if (formData.parent_id !== null) form.append('parent_id', formData.parent_id.toString());
        if (formData.user_id) form.append('user_id', formData.user_id.toString());

        if (subprojects.length > 0) {
            form.append('subprojects', JSON.stringify(subprojects.map(sub => ({
                ...sub,
                user_id: auth.user?.id,
            }))));
        }

        images.forEach((image, index) => {
            form.append(`images[${index}]`, image);
        });

        const method = isEditing ? 'post' : 'post'; // Use POST for both to handle multipart/form-data
        const url = isEditing ? `/user/listings/${listing?.id}?_method=PUT` : '/user/listings';

        router.post(url, form, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onSuccess: () => {
                router.visit('/user/listings');
            },
            onError: (errors) => {
                console.error(errors);
                setIsLoading(false);
            },
        });
    };

    const isTerrain = ['urban_land', 'agricultural_land'].includes(
        filteredPropertyTypes.find(pt => pt.id == formData.property_type_id)?.name || ''
    );
    const isProject = offerTypes.find(opt => opt.id == formData.offer_type_id)?.name === 'project';
    const isTemporary = offerTypes.find(opt => opt.id == formData.offer_type_id)?.name === 'temporary_accommodation';

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
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Anuncio" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h1 className="text-2xl font-bold mb-4">{isEditing ? 'Editar Listado' : 'Crear Listado'}</h1>
                <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow max-w-2xl mx-auto">
                    <div className="grid grid-cols-1 gap-4">
                        {!isEditing && (
                            <div>
                                <label htmlFor="offer_type_id" className="block text-sm font-medium text-gray-700">Tipo de Oferta</label>
                                <select
                                    id="offer_type_id"
                                    name="offer_type_id"
                                    value={formData.offer_type_id}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                        )}

                        <div>
                            <label htmlFor="property_type_id" className="block text-sm font-medium text-gray-700">Tipo de Propiedad</label>
                            <select
                                id="property_type_id"
                                name="property_type_id"
                                value={formData.property_type_id}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                                disabled={!formData.offer_type_id && !isEditing}
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
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="currency" className="block text-sm font-medium text-gray-700">Moneda</label>
                            <select
                                id="currency"
                                name="currency"
                                value={formData.currency}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="USD">USD</option>
                                <option value="PEN">PEN</option>
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
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </>
                        )}

                          {isProject && !isEditing && (
                            <div>
                                <label htmlFor="parent_id" className="block text-sm font-medium text-gray-700">Proyecto Padre</label>
                                <select
                                    id="parent_id"
                                    name="parent_id"
                                    value={formData.parent_id ?? ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder='Ej: {"amenities": ["piscina", "amoblado"]}'
                            />
                        </div>

                        {isProject && !isEditing && (
                            <div className="mt-6">
                                <h2 className="text-xl font-semibold mb-2">Subproyectos</h2>
                                {subprojects.map((subproject, index) => (
                                    <div key={index} className="border-t pt-4 mt-4">
                                        <h3 className="text-lg font-medium">Subproyecto {index + 1}</h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <label htmlFor={`subproject-title-${index}`} className="block text-sm font-medium text-gray-700">Título</label>
                                                <input
                                                    type="text"
                                                    id={`subproject-title-${index}`}
                                                    name="title"
                                                    value={subproject.title}
                                                    onChange={(e) => handleSubprojectChange(index, e)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor={`subproject-property_type_id-${index}`} className="block text-sm font-medium text-gray-700">Tipo de Propiedad</label>
                                                <select
                                                    id={`subproject-property_type_id-${index}`}
                                                    name="property_type_id"
                                                    value={subproject.property_type_id}
                                                    onChange={(e) => handleSubprojectChange(index, e)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                                                <label htmlFor={`subproject-description-${index}`} className="block text-sm font-medium text-gray-700">Descripción</label>
                                                <textarea
                                                    id={`subproject-description-${index}`}
                                                    name="description"
                                                    value={subproject.description || ''}
                                                    onChange={(e) => handleSubprojectChange(index, e)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor={`subproject-price-${index}`} className="block text-sm font-medium text-gray-700">Precio</label>
                                                <input
                                                    type="number"
                                                    id={`subproject-price-${index}`}
                                                    name="price"
                                                    value={subproject.price ?? ''}
                                                    onChange={(e) => handleSubprojectChange(index, e)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            {['urban_land_project', 'agricultural_land_project'].includes(
                                                filteredPropertyTypes.find(pt => pt.id == subproject.property_type_id)?.name || ''
                                            ) && (
                                                <div>
                                                    <label htmlFor={`subproject-land_area-${index}`} className="block text-sm font-medium text-gray-700">Área del Terreno (m²)</label>
                                                    <input
                                                        type="number"
                                                        id={`subproject-land_area-${index}`}
                                                        name="land_area"
                                                        value={subproject.land_area ?? ''}
                                                        onChange={(e) => handleSubprojectChange(index, e)}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        required
                                                    />
                                                </div>
                                            )}
                                            {!['urban_land_project', 'agricultural_land_project'].includes(
                                                filteredPropertyTypes.find(pt => pt.id == subproject.property_type_id)?.name || ''
                                            ) && (
                                                <>
                                                    <div>
                                                        <label htmlFor={`subproject-built_area-${index}`} className="block text-sm font-medium text-gray-700">Área Construida (m²)</label>
                                                        <input
                                                            type="number"
                                                            id={`subproject-built_area-${index}`}
                                                            name="built_area"
                                                            value={subproject.built_area ?? ''}
                                                            onChange={(e) => handleSubprojectChange(index, e)}
                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor={`subproject-bedrooms-${index}`} className="block text-sm font-medium text-gray-700">Habitaciones</label>
                                                        <input
                                                            type="number"
                                                            id={`subproject-bedrooms-${index}`}
                                                            name="bedrooms"
                                                            value={subproject.bedrooms ?? ''}
                                                            onChange={(e) => handleSubprojectChange(index, e)}
                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor={`subproject-bathrooms-${index}`} className="block text-sm font-medium text-gray-700">Baños</label>
                                                        <input
                                                            type="number"
                                                            id={`subproject-bathrooms-${index}`}
                                                            name="bathrooms"
                                                            value={subproject.bathrooms ?? ''}
                                                            onChange={(e) => handleSubprojectChange(index, e)}
                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor={`subproject-floors-${index}`} className="block text-sm font-medium text-gray-700">Pisos</label>
                                                        <input
                                                            type="number"
                                                            id={`subproject-floors-${index}`}
                                                            name="floors"
                                                            value={subproject.floors ?? ''}
                                                            onChange={(e) => handleSubprojectChange(index, e)}
                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label htmlFor={`subproject-parking_spaces-${index}`} className="block text-sm font-medium text-gray-700">Estacionamientos</label>
                                                        <input
                                                            type="number"
                                                            id={`subproject-parking_spaces-${index}`}
                                                            name="parking_spaces"
                                                            value={subproject.parking_spaces ?? ''}
                                                            onChange={(e) => handleSubprojectChange(index, e)}
                                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            <div>
                                                <label htmlFor={`subproject-attributes-${index}`} className="block text-sm font-medium text-gray-700">Atributos Adicionales (JSON)</label>
                                                <textarea
                                                    id={`subproject-attributes-${index}`}
                                                    name="attributes"
                                                    value={subproject.attributes || ''}
                                                    onChange={(e) => handleSubprojectChange(index, e)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder='Ej: {"amenities": ["piscina"]}'
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeSubproject(index)}
                                                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                            >
                                                Eliminar Subproyecto
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addSubproject}
                                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Agregar Subproyecto
                                </button>
                            </div>
                        )}
                        <div className="mt-6">
                            <label htmlFor="images" className="block text-sm font-medium text-gray-700">Imágenes</label>
                            <input
                                type="file"
                                id="images"
                                name="images"
                                multiple
                                accept="image/jpeg,image/png,image/jpg,image/gif"
                                onChange={handleImageChange}
                                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            {imageErrors.length > 0 && (
                                <div className="mt-2 text-red-600">
                                    {imageErrors.map((error, index) => (
                                        <p key={index}>{error}</p>
                                    ))}
                                </div>
                            )}
                            <div className="mt-2 flex flex-wrap gap-2">
                                {images.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt="Preview"
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                                {isEditing && listing?.media && listing.media.map((media, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={media.path}
                                            alt="Existing Image"
                                            className="w-24 h-24 object-cover rounded"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                            disabled={isLoading || !auth.user || imageErrors.length > 0}
                        >
                            {isLoading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
                        </button>

                    </div>

                </form>
            </div>

        </AppLayout>
    );
}
