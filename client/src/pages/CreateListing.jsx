import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { useRef, useState } from 'react'
import { app } from '../firebase'

export default function CreateListing() {
    const [files, setFiles] = useState([])
    const [formData, setFormData] = useState({
        imageUrls: []
    })
    const [imageUploadError, setImageUploadError] = useState(false);

    const  [isUpLoading ,setIsUpLoading]=useState(false);
    const [progress,setProgress]=useState(0);
    const [count, setCount]=useState(0)
    const [totalFiles,setTotalFiles]=useState(0)
    const fileInputRef=useRef()
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
                    <button className='p-3 bg-slate-700 text-white rounded-lg uppercase  hover:opacity-95 disabled:opacity-80'>Create Listing</button>
                </div>


            </form>
        </main>
    )
}
