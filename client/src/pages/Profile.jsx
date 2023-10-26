import { useSelector } from 'react-redux'
import { useRef, useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import { updateUserSuccess,updateUserFailure,updateUserStart,deleteUserStart,deleteUserSuccess,deleteUserFailure, signOutFailure, signOutStart, signOutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

export default function Profile() {
  const { currentUser,loading,error } = useSelector(state => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess ,setUpdateSuccess]=useState(false);
  const [deleteSuccess ,setDeleteSuccess]=useState(false);

  const dispatch=useDispatch()
  
  const fileRef = useRef(null)
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file])

  const handleFileUpload = (file) => {

    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);


    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on('state_changed', (snapshot) => {
      console.log(snapshot.totalBytes / (1024 * 1024))
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

      setFilePerc(Math.round(progress))

      console.log(progress);
    },
    (error) => {
      setFileUploadError(true)

    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
        setFormData({ ...formData, avatar: downloadUrl })

      })
    }

    )




  }
  const handleChange = (e) => {
    setFormData({...formData,[e.target.id]:e.target.value})

  }
  const handleSubmit= async(e)=>{
    e.preventDefault();
    try{ 
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
          dispatch(updateUserFailure(data.message))
      
        return;
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)

    }catch(error){
      dispatch(updateUserFailure(error.message))
    }

  }

   const handleDeleteUser= async()=>{
   
    try{ 
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'Delete'
      });

      const data = await res.json();
      console.log(data)
      if (data.success === false) {
          dispatch(deleteUserFailure(data.message))
      
        return;
      }
      dispatch(deleteUserSuccess(data))
      setDeleteSuccess(true)

    }catch(error){
      dispatch(deleteUserFailure(error.message))
    }

  }

  const handleSignOut= async()=>{
   
    try{ 
      dispatch(signOutStart())
      const res = await fetch('/api/auth/signout', {
        method: 'GET'
      });

      const data = await res.json();
      if (data.success === false) {
          dispatch(signOutFailure(data.message))
      
        return;
      }
      dispatch(signOutSuccess(data))

    }catch(error){
      dispatch(signOutFailure(error.message))
    }

  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className="text-3xl font-semibold text-center">Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input hidden onChange={(e) => setFile(e.target.files[0])} type='file' ref={fileRef} accept='image/*' />
        <img onClick={() => fileRef.current.click()} className='rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-2' src={formData.avatar?formData.avatar:currentUser.avatar} alt="" />
        <p className='text-sm self-center'>
          {fileUploadError ?(<span className='text-red-700'>Error uploading image</span>): 
          filePerc >0 && filePerc <100 ?(<span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>):
          filePerc ===100  ?(<span className='text-green-700'>Image Uploaded Successfully</span>):''
          
        }
        </p>
        <input type='text' placeholder='username' className='border p-3 rounded-lg' id='username' defaultValue={currentUser.username} onChange={handleChange} />
        <input type='email' placeholder='email' className='border p-3 rounded-lg' id='email' defaultValue={currentUser.email} onChange={handleChange} />
        <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
        <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'> {loading ? 'Loading....':'Update'} </button>

      </form>
      <div className='flex  justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span  onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}
      {updateSuccess ?(<p className='text-green-700 mt-5'>User Updated Successfully</p>):''}
      {deleteSuccess ?(<p className='text-green-700 mt-5'>User Deleted Successfully</p>):''}
      
    </div>
  )
}
