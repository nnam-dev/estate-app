import { useSelector } from 'react-redux'

export default function Profile() {
  const {currentUser}=useSelector(state=>state.user);
  const handleChange=()=>{

  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
    <h1 className="text-3xl font-semibold text-center">Profile</h1>
    <form className='flex flex-col gap-4'>
      <img className='rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-2' src={currentUser.avatar} alt="" />
      <input type='text' placeholder='username' className='border p-3 rounded-lg' id='username' value={currentUser.username} onChange={handleChange} />
      <input type='email' placeholder='email' className='border p-3 rounded-lg' id='email' value={currentUser.email} onChange={handleChange} />
      <input type='password' placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange} />
      <button  className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'> Update </button>
      
    </form>
    <div className='flex  justify-between mt-5'>
      <span className='text-red-700 cursor-pointer'>Delete Account</span>
      <span className='text-red-700 cursor-pointer'>Sign Out</span>
    </div>
    </div>
  )
}
