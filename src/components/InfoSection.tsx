"use client";

export function InfoSections({
    children,
    cols
}: {
    children: React.ReactNode;
    cols?: number;
}) {
    return (
        <div
            className={`grid md:grid-cols-${cols || 1} md:gap-4 gap-2 md:items-start grid-cols-1`}
        >
            {children}
        </div>
    );
}

export function InfoSection({ children }: { children: React.ReactNode }) {
    return <div className="space-y-1">{children}</div>;
}

export function InfoSectionTitle({ children }: { children: React.ReactNode }) {
    return <div className="font-semibold">{children}</div>;
}

export function InfoSectionContent({
    children
}: {
    children: React.ReactNode;
}) {
    return <div className="break-words">{children}</div>;
}
