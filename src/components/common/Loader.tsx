import React from 'react';
import { Loader2 } from 'lucide-react';

const Loader: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <Loader2 className="h-14 w-14 animate-spin text-[#FFCA06]" />
        </div>
    );
};

export default Loader;
