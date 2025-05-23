"use client";

import dynamic from "next/dynamic";

const ServiceWorkerRegistration = dynamic(
    () => import("./components/pwa/ServiceWorkerRegistration"),
    { ssr: false }
);

export default function ServiceWorkerLoader() {
    return <ServiceWorkerRegistration />;
}
