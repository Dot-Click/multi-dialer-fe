import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
    fullPage?: boolean;
    className?: string;
}

const Loader: React.FC<LoaderProps> = ({ fullPage = true, className = "" }) => {
    const spinner = <Loader2 className={`h-14 w-14 animate-spin text-[#FFCA06] ${className}`} />;

    if (!fullPage) {
        return (
            <div className="flex items-center justify-center py-10 w-full">
                {spinner}
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            {spinner}
        </div>
    );
};

export default Loader;
