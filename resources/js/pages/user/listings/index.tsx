import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { PageProps } from '@inertiajs/core';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Listado de Propiedades',
        href: route('user.listings.index'),
    },
];

interface Listing {
    id: number;
    title: string;
    description: string | null;
    price: number | null;
    currency: string;
    city: string | null;
    offer_type: { id: number; name: string };
    property_type: { id: number; name: string; category: string };
    first_image?: { id: number; path: string; type: string; order: number } | null;
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
        per_page: number;
        total: number;
    };
    offerTypes: Option[];
    propertyTypes: Option[];
    auth: { user: { id: number; name: string } | null };
}

export default function index({ listings, auth }: Props) {
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
            <Head title="Listado de publicaciones" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <div className='flex-col md:flex-row md:flex md:justify-between items-center'>
                    <h1 className="text-2xl font-bold mb-4">
                    {auth.user ? 'Mis Listados' : 'Todos los Listados'}
                    </h1>
                    <Link href={route('user.listings.create')} className="bg-blue-500 text-white px-3 py-2 hover:underline">
                            Crear un nuevo listado
                    </Link>
                </div>
                {auth.user && listings.data.length === 0 && (
                    <p className="text-gray-500 mb-4">
                        No tienes listados creados.{' '}

                    </p>
                )}

                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {listings.data.map((listing) => (
                    <div key={listing.id} className="bg-white p-4 rounded shadow">
                        {listing.first_image && (
                            <img
                                src={listing.first_image.path}
                                alt={listing.title}
                                className="w-full h-48 object-cover rounded mb-4"
                            />
                        )}
                        <h2 className="text-xl font-semibold">{listing.title}</h2>
                        <p className="text-gray-600">{listing.description?.substring(0, 100) || 'Sin descripción'}...</p>
                        <p className="text-gray-700">
                            {listing.price ? `${listing.currency} ${listing.price.toLocaleString()}` : 'Precio no disponible'}
                        </p>
                        <p className="text-gray-600">{listing.city || 'Ciudad no especificada'}</p>
                        <p className="text-gray-600">{displayLabels[listing.offer_type.name] || listing.offer_type.name}</p>
                        <p className="text-gray-600">{displayLabels[listing.property_type.name] || listing.property_type.name}</p>
                        <div className="mt-2 flex space-x-2">
                            <Link
                                href={route('user.listings.show', listing.id)}
                                className="text-blue-500 hover:underline"
                            >
                                Ver Detalles
                            </Link>
                            {auth.user && (
                                <Link
                                    href={route('user.listings.edit', listing.id)}
                                    className="text-green-500 hover:underline"
                                >
                                    Editar
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {listings.data.length > 0 && (
                <div className="mt-4 flex justify-center">
                    {listings.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            className={`mx-1 px-3 py-1 rounded ${link.active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                            preserveState
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Link>
                    ))}
                </div>
            )}
            {auth.user && listings.data.length === 0 && (
                <div className="mt-4 text-center">
                    <Link
                        href={route('user.listings.create')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Crear Nuevo Listado
                    </Link>
                </div>
            )}

            </div>
        </AppLayout>
    );
}
