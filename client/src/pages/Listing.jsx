import  {useEffect,useState} from 'react';
import { useParams } from 'react-router-dom';
import {Swiper,SwiperSlide} from  'swiper/react';
import  SwiperCore from    'swiper';
import {Navigation} from 'swiper/modules';
import  'swiper/css/bundle';




export default function Listing() {
    SwiperCore.use([Navigation]);
    
    const params=useParams();
    const [listing,setListing]=useState(null);
    const [loading,setLoading]=useState(false);
    const  [error,setError]=useState(false)
    
    useEffect(()=>{
        const fetchListing= async()=>{
              
            setLoading(true)
            try{
                const res=await fetch(`/api/listing/get/${params.listing_id}`);

                const data= await res.json();
                if(data.success==false){
                    setError(true)
                    setLoading(false)
                    return
                }
    
                setListing(data)
                setLoading(false)
                setError(false)
            }catch(e){
                setError(true)
                setLoading(false)
            }

           

        }

        fetchListing();
        
    },[params.listing_id])
  return (
    <main>
        {loading && (<p className='text-center text-2xl my-7 '>Loading ....</p>)}
        {error && (<p className='text-center text-2xl my-7 text-red-700 '>Something went wrong</p>)}

        {listing && !error && !loading && (
            <div>
            <Swiper navigation>

                {listing.imageUrls.map((url)=>(

                    <SwiperSlide key={url}>

                        <div className="h-[550px] " style={{background:`url(${url}) center no-repeat`,backgroundSize:'cover'}}></div>

                    </SwiperSlide>

                ))}


            </Swiper>
            
             </div>
        )}
    
    </main>
  )
}
