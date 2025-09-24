import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData, type Listing, type Option, type Amenity } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import React, { useState } from 'react';
import Form from '@/pages/user/listings/Form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Editar Anuncio',
        href: '#',
    },
];

interface Props extends SharedData {
    listing: Listing;
    offerTypes: Option[];
    propertyTypes: Option[];
    projects: { id: number; title: string }[];
    amenities: Amenity[];
}

export default function Edit({ offerTypes, propertyTypes, projects, amenities }: Props) {
    const { listing, auth } = usePage<Props>().props;
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (formData: FormData) => {
        setIsLoading(true);
        formData.append('_method', 'put'); // Simula la llamada PUT
        router.post(`/user/listings/${listing.id}`, formData, {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Anuncio" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h1 className="text-2xl font-bold mb-4">Editar Anuncio</h1>
                <Form
                    isEditing={true}
                    listing={listing}
                    offerTypes={offerTypes}
                    propertyTypes={propertyTypes}
                    projects={projects}
                    amenities={amenities}
                    auth={auth}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            </div>
        </AppLayout>
    );
}
