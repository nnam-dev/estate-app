import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingItem from '../components/ListingItem';

export default function Search() {
    const navigate=useNavigate();
    const [loading,setLoading]=useState(false);
    const [listings, setListings]=useState([])
    const [showMore ,setShowMore]=useState(false)


    const [sideBarData, setSideBarData] = useState({
        searchTerm: '',
        type: 'all',
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc'
    })

    useEffect(()=>{

        const urlParams=new URLSearchParams(location.search)
        const searchTermFromUrl=urlParams.get('searchTerm')
        const typeFromUrl=urlParams.get('type')
        const parkingFromUrl=urlParams.get('parking')
        const furnishedFromUrl=urlParams.get('furnished')
        const offerFromUrl=urlParams.get('offer')
        const sortFromUrl=urlParams.get('sort')
        const orderFromUrl=urlParams.get('order')
        
    if(
        searchTermFromUrl ||
        typeFromUrl ||
        parkingFromUrl ||
        furnishedFromUrl ||
        offerFromUrl ||
        sortFromUrl ||
         orderFromUrl ){
       setSideBarData({
        searchTerm: searchTermFromUrl || '' ,
        type: typeFromUrl || 'all',
        parking: parkingFromUrl ==='true'? true:false,
        furnished: furnishedFromUrl  ==='true'?true:false,
        offer: offerFromUrl  ==='true'?true:false ,
        sort:  sortFromUrl || 'created_at' ,
        order: orderFromUrl  || 'desc',
       })
    }

    const fetchListing= async()=>{

        setLoading(true)
        

        const searchQuery=urlParams.toString();

        const res =await fetch(`/api/listing/get?${searchQuery}`)

        const data =await res.json()
        setListings(data)
        setLoading(false)
        if(data.length>5){setShowMore(true)}else{setShowMore(false)}

       

    }
    fetchListing()






        
    },[location.search]);

    const handleChange = (e) => {
        if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
            setSideBarData({
                ...sideBarData,
                type: e.target.id
            })
            console.log(e.target.id)
        }
        if (e.target.id === 'furnished' || e.target.id === 'offer' || e.target.id === 'parking') {
            setSideBarData({
                ...sideBarData,
                [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false
            })
        }
        if (e.target.id === 'searchTerm') {
            setSideBarData({
                ...sideBarData,
                searchTerm: e.target.value
            })
        }
        if (e.target.id === 'sort_order') {
            const sort = e.target.value.split('_')[0] || 'created_at';
            const order = e.target.value.split('_')[1] || 'desc';
            setSideBarData({
                ...sideBarData,
                sort,
                order

            })
        }


    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const urlParams=new URLSearchParams();
        urlParams.set('searchTerm',sideBarData.searchTerm)
        urlParams.set('type',sideBarData.type)
        urlParams.set('parking',sideBarData.parking)
        urlParams.set('furnished',sideBarData.furnished)
        urlParams.set('offer',sideBarData.offer)
        urlParams.set('sort',sideBarData.sort)
        urlParams.set('order',sideBarData.order)
        const searchQuery=urlParams.toString()

        navigate(`/search?${searchQuery}`)

    }

    const onShowMoreClick= async()=>{
        setShowMore(false)
      const numberOfListings=listings.length;
      const startIndex=numberOfListings;
      const urlParams= new URLSearchParams(location.search);
      urlParams.set('startIndex',startIndex);
      const searchQuery= urlParams.toString();

      const res =await fetch(`/api/listing/get?${searchQuery}`)

        const data =await res.json()

        setListings([...listings,...data])

        if(data.length<6){
            setShowMore(false)
        }


    }

    return (
        <div className='flex flex-col md:flex-row'>
            <div className="flex  p-7 border-b-2  md:border-r-2 md:min-h-screen">
                <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                    <div className="flex items-center gap-2">
                        <label className='whitespace-nowrap font-semibold' htmlFor='searchTerm'>Search Term</label>
                        <input type="text" id='searchTerm' className="p-3 border  rounded-lg w-full" placeholder='search...'
                            value={sideBarData.searchTerm} onChange={handleChange} />
                    </div>
                    <div className="flex gap-3 flex-wrap items-center">

                        <label className="">Type:</label>
                        <div className="flex gap-1 items-center">
                            <input type="checkbox" className="w-5 rounded-lg p-3" id="all"
                                checked={sideBarData.type === 'all'} onChange={handleChange}
                            />
                            <span className="whitespace-nowrap">Rent & Sale</span>
                        </div>
                        <div className="flex gap-1 items-center">
                            <input type="checkbox" className="w-5 rounded-lg p-3" id="rent" checked={sideBarData.type === 'rent'} onChange={handleChange} />
                            <span className="">Rent </span>
                        </div>
                        <div className="flex gap-1 items-center">
                            <input type="checkbox" className="w-5 rounded-lg p-3" id="sale" checked={sideBarData.type === 'sale'} onChange={handleChange} />
                            <span> Sale</span>
                        </div>
                        <div className="flex gap-1 items-center">
                            <input type="checkbox" className="w-5 rounded-lg p-3" id="offer" checked={sideBarData.offer} onChange={handleChange} />
                            <span> Offer</span>
                        </div>
                    </div>
                    <div className="flex gap-3 flex-wrap items-center">

                        <label className="font-semibold">Ammenities:</label>
                        <div className="flex gap-1 items-center">
                            <input type="checkbox" className="w-5 rounded-lg p-3" id="parking" checked={sideBarData.parking} onChange={handleChange} />
                            <span className="whitespace-nowrap">Parking</span>
                        </div>
                        <div className="flex gap-1 items-center">
                            <input type="checkbox" className="w-5 rounded-lg p-3" id="furnished" checked={sideBarData.furnished} onChange={handleChange} />
                            <span className="">Furnished </span>
                        </div>

                    </div>
                    <div className="flex items-center gap-2">
                        <label htmlFor="" className="font-semibold">Sort</label>
                        <select className="border rounded-lg p-3" name="" id="sort_order"
                            defaultValue={'create_at_desc'} onChange={handleChange}

                        >
                            <option value='regularPrice_desc' className='font-semibold' >Price high to low</option>
                            <option value='regularPrice_asc' className='font-semibold' >Price low to high</option>
                            <option value='createdAt_desc' className='font-semibold' >Latest</option>
                            <option value='createdAt_desc' className='font-semibold'>Lowest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 text-white border rounded-lg p-3 uppercase hover:opacity-95'>Search</button>
                </form>
            </div>
            <div className="flex flex-col ">
                <h1 className="text-3xl font-semibold border-b p-3 text-slate-700">Search Results</h1>
                <div className="p-8 flex  flex-wrap gap-4">
                    {!loading && listings.length===0 && (<p className='text-2xl text-gray-700'>
                        No listing Found
                    </p>)}
                    {loading && (
                        <p className='text-3xl text-gray-700 text-center w-full'>
                        Loading.......
                    </p>
                    )}
                    { !loading && listings && listings.map((listing)=>(
                            <ListingItem key={listing._id} listing={listing} />
                        ))}

                        { showMore && (
                            <button onClick={onShowMoreClick} className="text-green-700 hover:underline text-center w-full">Show More</button>

                        )}
                </div>
            </div>
        </div>
    )
}
