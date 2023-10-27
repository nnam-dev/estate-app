import React from 'react'

export default function CreateListing() {
    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create Listing</h1>
            <form className='flex flex-col sm:flex-row gap-4 '>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type='text' placeholder='name' className='border p-3 rounded-lg' id='name' maxLength={62} min={10} required />
                    <textarea type='text' placeholder='Description' className='border p-3 rounded-lg' id='description' required />
                    <input type='text' placeholder='address' className='border p-3 rounded-lg' id='address' required />

                    <div className="flex flex-row gap-5 flex-wrap  ">
                        <div className='flex gap-2'>
                            <input type='checkbox' className='w-5' id='sale' />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' className='w-5' id='rent' />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' className='w-5' id='parking' />
                            <span>Parking Spot</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' className='w-5' id='offer' />
                            <span>Offer</span>
                        </div>

                    </div>
                    <div className="flex gap-6 flex-wrap">
                        <div className='flex gap-2 items-center'>
                            <input type='number' className='p-3 border border-gray-700 rounded-lg' id='bedrooms' min={1} max={10} />
                            <span>Bedrooms</span>

                        </div>
                        <div className='flex gap-2 items-center'>
                            <input type='number' className='p-3 border border-gray-700 rounded-lg' id='bathrooms' min={1} max={10} />
                            <span>Bathrooms</span>

                        </div>
                        <div className='flex gap-2 items-center'>
                            <input type='number' className='p-3 border border-gray-700 rounded-lg' id='regularPrice' />
                            <div className='flex flex-col items-center'>
                                <span>Regular Price</span>
                                <span className='text-xs'>(&#8358;/month)</span>
                            </div>


                        </div>
                        <div className='flex gap-2 items-center'>
                            <input type='number' className='p-3 border border-gray-700 rounded-lg' id='discountPrice' />
                            <div className='flex flex-col items-center'>
                                <span>Discount Price</span>
                                <span className='text-xs'>(&#8358;/month)</span>
                            </div>
                        </div>


                    </div>



                </div>

                <div className='flex flex-col gap-4 flex-1 '>
                    <p className='font-semibold'>Images<span className='font-normal text-gray-700 ml-2'> The first
                        will be the cover (max 6)
                        </span></p>
                    <div className='flex gap-4'>
                        <input className='p-3 border border-gray-300 rounded w-full' type='file' id='images' accept='image/*' multiple />
                        <button className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>Upload</button> 
                    </div>
                    <button className='p-3 bg-slate-700 text-white rounded-lg uppercase  hover:opacity-95 disabled:opacity-80'>Create Listing</button>


                </div>
                
                

            </form>
        </main>
    )
}
