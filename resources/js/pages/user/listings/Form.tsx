import { type Listing, type Option, type Amenity, type Subproject, type User } from '@/types';
import React, { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface FormProps {
    isEditing: boolean;
    listing?: Listing;
    offerTypes: Option[];
    propertyTypes: Option[];
    projects: { id: number; title: string }[];
    amenities: Amenity[];
    auth: {
        user: User;
    };
    onSubmit: (data: FormData) => void;
    isLoading: boolean;
}

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

export default function Form({ isEditing, listing, offerTypes, propertyTypes, projects, amenities, auth, onSubmit, isLoading }: FormProps) {
    const [formData, setFormData] = useState<Omit<Listing, 'amenities'>>({
        title: listing?.title || '',
        description: listing?.description || null,
        price: listing?.price || null,
        currency: listing?.currency || 'USD',
        offer_type_id: listing?.offer_type_id || '',
        property_type_id: listing?.property_type_id || '',
        city: listing?.city || null,
        address: listing?.address || null,
        latitude: listing?.latitude || null,
        longitude: listing?.longitude || null,
        land_area: listing?.land_area || null,
        built_area: listing?.built_area || null,
        bedrooms: listing?.bedrooms || null,
        bathrooms: listing?.bathrooms || null,
        floors: listing?.floors || null,
        parking_spaces: listing?.parking_spaces || null,
        parent_id: listing?.parent_id || null,
        user_id: listing?.user_id || auth.user?.id,
    });

    const [images, setImages] = useState<File[]>([]);
    const [imageErrors, setImageErrors] = useState<string[]>([]);
    const [filteredPropertyTypes, setFilteredPropertyTypes] = useState<Option[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<number[]>(
        Array.isArray(listing?.amenities) ? listing.amenities.map((a) => a.id) : []
    );

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

    const handleAmenityChange = (amenityId: number, isChecked: boolean) => {
        setSelectedAmenities(prev => {
            if (isChecked) {
                return [...new Set([...prev, amenityId])];
            } else {
                return prev.filter(id => id !== amenityId);
            }
        });
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

    const onFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (imageErrors.length > 0) {
            alert('Corrija los errores en las imágenes antes de enviar.');
            return;
        }

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
        if (selectedAmenities.length > 0) form.append('amenity_ids', JSON.stringify(selectedAmenities));
        if (formData.parent_id !== null) form.append('parent_id', formData.parent_id.toString());
        if (formData.user_id) form.append('user_id', formData.user_id.toString());

        images.forEach((image, index) => {
            form.append(`images[${index}]`, image);
        });

        onSubmit(form);
    };

    const isTerrain = ['urban_land', 'agricultural_land'].includes(
        filteredPropertyTypes.find(pt => pt.id == formData.property_type_id)?.name || ''
    );
    const isProject = offerTypes.find(opt => opt.id == formData.offer_type_id)?.name === 'project';
    const isTemporary = offerTypes.find(opt => opt.id == formData.offer_type_id)?.name === 'temporary_accommodation';

    return (
        <form onSubmit={onFormSubmit} className="bg-white p-4 rounded shadow max-w-2xl mx-auto">
            <div className="grid grid-cols-1 gap-4">
                {/* Secciones del formulario */}
                <div>
                    <label htmlFor="offer_type_id" className="block text-sm font-medium text-gray-700">Tipo de Oferta</label>
                    <select
                        id="offer_type_id"
                        name="offer_type_id"
                        value={formData.offer_type_id}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        required
                        disabled={isEditing}
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
                        disabled={!formData.offer_type_id || isEditing}
                    >
                        <option value="">Seleccionar</option>
                        {filteredPropertyTypes.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                                {displayLabels[opt.name] || opt.name}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Otros campos del formulario */}
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

                <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">Amenidades</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {amenities.map((amenity) => (
                            <div key={amenity.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`amenity-${amenity.id}`}
                                    checked={selectedAmenities.includes(amenity.id)}
                                    onCheckedChange={(checked) => handleAmenityChange(amenity.id, !!checked)}
                                />
                                <Label htmlFor={`amenity-${amenity.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    {amenity.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

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
    );
}
