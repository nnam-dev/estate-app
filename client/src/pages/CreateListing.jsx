import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { useRef, useState } from 'react'
import { app } from '../firebase'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function CreateListing() {
    const {currentUser}=useSelector(state=>state.user)
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        imageUrls: [],
        name:'',
        description:'',
        address:'',
        type:'rent',
        bedrooms:1,
        bathrooms:1,
        regularPrice:0,
        discountPrice:0,
        offer:false,
        parking:false,
        furnished:false
    })
    const [imageUploadError, setImageUploadError] = useState(false);

    const  [isUpLoading ,setIsUpLoading]=useState(false);
    const [progress,setProgress]=useState(0);
    const [count, setCount]=useState(0)
    const [totalFiles,setTotalFiles]=useState(0)
    const fileInputRef=useRef()
    const [error,setError]=useState(false)
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate();
    console.log(formData)

    const handleImageSubmit = async () => {
        if (files.length > 0 && files.length < 7 && formData.imageUrls.length < 7) {
            
            
            const promises = []

            for (let i = 0; i < files.length; i++) {

                setCount(i)
                setTotalFiles(files.length)

                if(formData.imageUrls.length ==6)
                {
                    return 0
                }

                promises.push(storeImage(files[i]))

                await Promise.all(promises).then((urls) => {

                    setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) })

                    setImageUploadError(false)
               

                }).catch((err) => {
                    setImageUploadError("image upload Error (2 mb max per image)")

                })


            }
            //reset fileinput
            //fileInputRef.current.value='';



        } else {

            setImageUploadError("You can only upload 6 images per listing")

        }


    }
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {

            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    console.log(snapshot.totalBytes / (1024 * 1024))
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setIsUpLoading(true)
                    
                    setProgress(Math.round(progress))
                    
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        setIsUpLoading(false)
                        resolve(downloadUrl)
                    })
                },)
        })
    }

    const handleDeleteImage=(index)=>{
        setFormData({...formData,imageUrls:formData.imageUrls.filter((url,i)=>i !==index)})
    }

    const handleChange=(e)=>{
       if(e.target.id=='sale' || e.target.id=='rent')
       {
        setFormData(
            {
                ...formData,
                type:e.target.id
            }
        )
       }
       if(e.target.id==='parking' || e.target.id==='furnished'|| e.target.id==='offer')
       {
        setFormData(
            { 
                ...formData,
                [e.target.id]:e.target.checked
            }
        )
       }

       if(e.target.type==='text' || e.target.type==='number'|| e.target.type==='textarea')
       {
        setFormData(
            { 
                ...formData,
                [e.target.id]:e.target.value
            }
        )
       }
    }
    const handleSubmit=async(e)=>{
        e.preventDefault();
        if(formData.imageUrls.length<1) return setError('you must upload at least one image')
        if(formData.imageUrls.length>6) return setError('Exceeded maximum image upload of 6')
        if(+formData.regularPrice < +formData.discountPrice) return setError('Discount Price must be less than Regular price ')



        try{
            setLoading(true)
            setError(false)
            const res =await fetch('/api/listing/create',{

                method:"POST",
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    ...formData,
                    userRef:currentUser._id
                })

            })
            const data = await res.json();
            setLoading(false);
            if(data.success==false){
                setError(data.message)
            }
            navigate(`/listing/${data._id}`)

        }catch(error){
            setError(error.message)
            setLoading(false)
        }




    }
    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create Listing</h1>
            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4 '>
                <div className='flex flex-col gap-4 flex-1'>
                    <input type='text'  onChange={handleChange} value={formData.name} placeholder='name' className='border p-3 rounded-lg' id='name' maxLength={62} min={10} required />
                    <textarea type='text' onChange={handleChange} value={formData.description} placeholder='Description' className='border p-3 rounded-lg' id='description' required />
                    <input type='text' onChange={handleChange} value={formData.address} placeholder='address' className='border p-3 rounded-lg' id='address' required />

                    <div className="flex flex-row gap-3 flex-wrap  ">
                        <div className='flex gap-2'>
                            <input type='checkbox' onChange={handleChange} checked={formData.type=='sale'} className='w-5' id='sale' />
                            <span>Sell</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' onChange={handleChange} checked={formData.type=='rent'} className='w-5' id='rent' />
                            <span>Rent</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' onChange={handleChange} checked={formData.parking} className='w-5' id='parking' />
                            <span>Parking</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' onChange={handleChange} checked={formData.furnished} className='w-5' id='furnished' />
                            <span>Furnished</span>
                        </div>
                        <div className='flex gap-2'>
                            <input type='checkbox' onChange={handleChange} checked={formData.offer} className='w-5' id='offer' />
                            <span>Offer</span>
                        </div>

                    </div>
                    <div className="flex gap-6 flex-wrap">
                        <div className='flex gap-2 items-center'>
                            <input type='number' onChange={handleChange} value={formData.bedrooms} className='p-3 border border-gray-700 rounded-lg' id='bedrooms' min={1} max={10} />
                            <span>Bedrooms</span>

                        </div>
                        <div className='flex gap-2 items-center'>
                            <input type='number' onChange={handleChange} value={formData.bathrooms} className='p-3 border border-gray-700 rounded-lg' id='bathrooms' min={1} max={10} />
                            <span>Bathrooms</span>

                        </div>
                        <div className='flex gap-2 items-center'>
                            <input type='number' onChange={handleChange} min={0} max={50000000} value={formData.regularPrice} className='p-3 border border-gray-700 rounded-lg' id='regularPrice' />
                            <div className='flex flex-col items-center'>
                                <span>Regular Price</span>
                                <span className='text-xs'>(&#8358;/month)</span>
                            </div>


                        </div>
                        {formData.offer && ( <div className='flex gap-2 items-center'>
                            <input type='number' onChange={handleChange} min={0} value={formData.discountPrice} className='p-3 border border-gray-700 rounded-lg' id='discountPrice' />
                            <div className='flex flex-col items-center'>
                                <span>Discount Price</span>
                                <span className='text-xs'>(&#8358;/month)</span>
                            </div>
                        </div>)}
                       


                    </div>



                </div>

                <div className='flex flex-col gap-4 flex-1 '>
                    <p className='font-semibold'>Images<span className='font-normal text-gray-700 ml-2'> The first
                        will be the cover (max 6)
                    </span></p>
                    <div className='flex gap-4'>
                        <input onChange={(e) => setFiles(e.target.files)} ref={fileInputRef} className='p-3 border border-gray-300 rounded w-full' type='file' id='images' accept='image/*' multiple />
                        <button disabled={isUpLoading} type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>{isUpLoading ? `Uploading..` : 'Upload'}</button>
                    </div>
                    <p className='text-red-700 text-sm '>{imageUploadError ? imageUploadError : ''}</p>
                    <p className='text-green-700 text-xs '>{isUpLoading ? `Uploading images..(${count} of ${totalFiles})${progress}%` : ''}</p>
                    {formData.imageUrls.length > 0 && (formData.imageUrls.map((url,index) => (
                       <div key={url} className='flex justify-between p-3 border item-center'>
                            <img src={url} alt="listing" className="w-20 h-20 object-contain rounded-lg hover:opacity-75" />
                            <button type="button" onClick={()=>{handleDeleteImage(index)}} className="p-3 text-red-700 rounded-lg uppercase">Delete</button>
                        </div> 
                   ) )) } 
                    <button disabled={loading|| isUpLoading} className='p-3 bg-slate-700 text-white rounded-lg uppercase  hover:opacity-95 disabled:opacity-80'>{loading?'Loading...':'Create Listing'}</button>
                    {error &&(<span className='text-red-700'>{error}</span>)}
                </div>


            </form>
        </main>
    )
}
