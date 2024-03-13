'use client'

import Timer from './ui/timer';
import { useState } from 'react';

export default function Home() {
    
    return (
        <main className="flex justify-center p-5">
            <div className="flex flex-col">

                {/* 1/2 */}
                <div className="flex flex-col items-center justify-center border border-indigo-600 gap-2 p-2">
                    <Timer />
                </div>

                {/* 2/2 */}
                <div className="flex flex-col items-center justify-center border border-indigo-600">
                    <div className="text-3xl">Today's Tasks</div>

                    <ul>
                        <li>Task1 - 🍅x2</li>
                        <li>Task2 - 🍅x1</li>
                        <li>Task3 - 🍅x3</li>
                    </ul>
                </div>
            </div>
        </main>
    );
}
