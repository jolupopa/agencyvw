import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData, type Option, type Amenity } from '@/types';
import { Head, usePage, router } from '@inertiajs/react';
import React, { useState } from 'react';
import Form from '@/pages/user/listings/Form';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Crear Anuncio',
        href: '/user/listings/create',
    },
];

interface Props extends SharedData {
    offerTypes: Option[];
    propertyTypes: Option[];
    projects: { id: number; title: string }[];
    amenities: Amenity[];
}

export default function Create({ offerTypes, propertyTypes, projects, amenities }: Props) {
    const { auth } = usePage<Props>().props;
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (formData: FormData) => {
        setIsLoading(true);
        router.post('/user/listings', formData, {
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
            <Head title="Crear Anuncio" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <h1 className="text-2xl font-bold mb-4">Crear Anuncio</h1>
                <Form
                    isEditing={false}
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
