import React from 'react';
import { Html, useProgress } from '@react-three/drei';

const Loader = () => {
    const { progress } = useProgress();
    return (
        <Html center>
            <div className="flex flex-col items-center justify-center text-white">
                <div className="text-4xl font-black mb-2">{progress.toFixed(0)}%</div>
                <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white transition-all duration-200 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
        </Html>
    );
};

export default Loader;
