
import React from 'react';
import { toast } from 'react-toastify';

const Test = () => {
    const demo = () => {
        console.log("Button clicked");
        // toast.success("Button clicked");
        toast.success("Button clicked", {
            autoClose: 3000
        });

    };

    // Example promise function
    const fetchData = () => {
        return new Promise((resolve, reject) => {
            // Simulate API call
            setTimeout(() => {
                const shouldSucceed = Math.random() > 0.5;
                if (shouldSucceed) {
                    resolve("Data loaded successfully");
                } else {
                    reject(new Error("Failed to load data"));
                }
            }, 2000);
        });
    };

    const load = () => {
        toast.promise(
            fetchData(), // Pass the promise directly
            {
                pending: 'Loading...',
                success: 'Data fetched successfully!',
                error: 'Error fetching data'
            }
        );
    };

    return (
        <div>
            <button className='py-5 px-10 bg-gray-700 text-2xl font-bold mx-10 rounded-2xl hover:bg-gray-400 hover:text-white' onClick={demo}>Click me</button>
            <button className='py-5 px-10 bg-gray-700 text-2xl font-bold mx-10 rounded-2xl hover:bg-gray-400 hover:text-white' onClick={load}>loading test</button>


            <div className='h-15 w-15 bg-blue-400 hover:bg-blue-800 transition-colors'>
                test box
            </div>
        </div>
    );
};

export default Test;