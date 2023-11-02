import React from 'react'

export default function Search() {
    return (
        <div className='flex flex-col md:flex-row'>
            <div className="flex  p-7 border-b-2  md:border-r-2 md:min-h-screen">
                <form className="flex flex-col gap-8">
                    <div className="flex items-center gap-2"><label className='whitespace-nowrap font-semibold' htmlFor='searchTerm'>Search Term</label><input type="text" id='searchTerm' className="p-3 border  rounded-lg w-full" placeholder='search...' /></div>
                    <div className="flex gap-3 flex-wrap items-center">
                       
                         <label className="">Type:</label>
                            <div className="flex gap-1 items-center">
                                <input type="checkbox" className="w-5 rounded-lg p-3" id="all" />
                                <span className="whitespace-nowrap">Rent & Sale</span>
                            </div>
                            <div className="flex gap-1 items-center">
                                <input type="checkbox" className="w-5 rounded-lg p-3" id="rent" />
                                <span className="">Rent </span>
                            </div>
                            <div className="flex gap-1 items-center">
                                <input type="checkbox" className="w-5 rounded-lg p-3" id="sale" />
                                <span> Sale</span>
                            </div>
                            <div className="flex gap-1 items-center">
                                <input type="checkbox" className="w-5 rounded-lg p-3" id="offer" />
                                <span> Offer</span>
                            </div>
                        </div>
                        <div className="flex gap-3 flex-wrap items-center">
                       
                         <label className="font-semibold">Ammenities:</label>
                            <div className="flex gap-1 items-center">
                                <input type="checkbox" className="w-5 rounded-lg p-3" id="parking" />
                                <span className="whitespace-nowrap">Parking</span>
                            </div>
                            <div className="flex gap-1 items-center">
                                <input type="checkbox" className="w-5 rounded-lg p-3" id="furnished" />
                                <span className="">Furnished </span>
                            </div>
                           
                        </div>
                        <div className="flex items-center gap-2">
                            <label htmlFor="" className="font-semibold">Sort</label>
                            <select className="border rounded-lg p-3" name="" id="sort_order">
                                <option className='font-semibold' >Price high to low</option>
                                <option className='font-semibold' >Price low to high</option>
                                <option className='font-semibold' >Latest</option>
                                <option className='font-semibold'>Lowest</option>
                            </select>
                        </div>
                 <button className='bg-slate-700 text-white border rounded-lg p-3 uppercase hover:opacity-95'>Search</button>
                </form>
            </div>
            <div className="flex">
                <h1 className="text-3xl font-semibold border-b p-3 text-slate-700">Search Results</h1>
            </div>
        </div>
    )
}
