import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import Listing from './Listing';
import ListingItem from '../components/ListingItem';


export default function Home() {
  const [offerListing,setOfferListing]=useState([]);
  const [saleListing,setSaleListing]=useState([]);
  const [rentListing,setRentListing]=useState([]);

  SwiperCore.use([Navigation])

  console.log(offerListing)
  

  useEffect(()=>{

    const fetchOfferListing=async ()=>{
      try{
        const res=await fetch(`/api/listing/get?offer=true&limit=4`)
        const data=await res.json()
        setOfferListing(data)
        fetchRentListing()
      }catch(error){
        console.log(error)
      }
    }

    const fetchRentListing=async ()=>{
      try{
        const res=await fetch(`/api/listing/get?type=rent&limit=4`)
        const data= await res.json()
        setRentListing(data)
         fetchSaleListing();
      }catch(error){
        console.log(error)
      }
    }

    const fetchSaleListing=async ()=>{
      try{
        const res=await fetch(`/api/listing/get?type=sale&limit=4`)
        const data=await res.json()
        setSaleListing(data)
      }catch(error){
        console.log(error)
      }
    }

    fetchOfferListing()
    

  },[])
  return (
    <div>
      {/* top */}
      <div className=" flex flex-col py-28 px-3 max-w-6xl mx-auto ">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">Find your next <span className='text-slate-500'>
           dream
           <br/>
            home with ease
          </span> </h1>
          <div className="text-gray text-xs sm:text-sm">
            Nnamdi-Estate is the best place to find your perfect home to live
            <br/>
            We have a wide range of properties for you to choose from
          </div>
          <Link  className="text-xs sm:text-sm text-blue-700  hover:underline" to={'/search'}>
            Get started ....
          </Link>
      </div>

      {/* swiper */}

      <Swiper navigation>
      {offerListing && offerListing.length >0 && offerListing.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div 
                  className='h-[550px]'
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize:'cover',
                  }}
                ></div>
              </SwiperSlide>
            ))}</Swiper>
      

      {/* listing result for offer sales and rent */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col  gap-8 my-10 ">
        {
         offerListing && offerListing.length> 0 && (
          <div className="">
            <div className="flex flex-col my-3">
              <h2 className="text-2xl font-semibold text-slate-700">Recent Offers</h2>
              <Link className='text-sm text-blue-700 hover:underline' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {
                offerListing.map((offers)=>(
                  <ListingItem  key={offers._id} listing={offers}/>

                ))
              }

            </div>
            
          </div>
         )}
         {
         rentListing && rentListing.length> 0 && (
          <div className="">
            <div className="flex flex-col my-3">
              <h2 className="text-2xl font-semibold text-slate-700">Recent places for  Rent</h2>
              <Link className='text-sm text-blue-700 hover:underline' to={'/search?type=rent'}>Show more places for Rent</Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {
                rentListing.map((rent)=>(
                  <ListingItem  key={rent._id} listing={rent}/>

                ))
              }

            </div>
            
          </div>
         )}
          {
         saleListing && saleListing.length> 0 && (
          <div className="">
            <div className="flex flex-col my-3">
              <h2 className="text-2xl font-semibold text-slate-700">Recent places for  Sales</h2>
              <Link className='text-sm text-blue-700 hover:underline' to={'/search?type=sale'}>Show more places for Sales\</Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {
                saleListing.map((sales)=>(
                  <ListingItem  key={sales._id} listing={sales}/>

                ))
              }

            </div>
            
          </div>
         )}


      </div>
    </div>
  )
}
