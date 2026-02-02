import React from 'react'
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious }from './ui/carousel'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '../redux/jobSlice'
const category =[
    "Software Development",
    "Data Science",
    "Design & Creative",
    "Marketing & Sales",
    "Finance & Accounting",
    "Human Resources",
    "Project Management",
    "Customer Support",
    "Engineering",
    "Healthcare",
]
const CategoryCarousel = () => {
   const navigate = useNavigate();
   const dispatch = useDispatch();
    const searchJobHandler=(query)=>{
        dispatch(setSearchedQuery(query));
        navigate("/browse");
         }
    return (
        <div className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#6A38C2] to-[#F83002]">
                            Explore By Category
                        </span>
                    </h2>
                    <p className="text-gray-600 text-lg">Discover opportunities across diverse fields</p>
                </div>
                
                <div className="hidden md:grid md:grid-cols-5 gap-4">
                    {
                        category.map((cat, index) => {
                            const colors = [
                                { from: 'from-purple-500', to: 'to-purple-600', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
                                { from: 'from-orange-500', to: 'to-orange-600', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
                                { from: 'from-blue-500', to: 'to-blue-600', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
                                { from: 'from-green-500', to: 'to-green-600', bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
                                { from: 'from-pink-500', to: 'to-pink-600', bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
                            ];
                            const color = colors[index % colors.length];
                            
                            return (
                                <div
                                    key={index}
                                    onClick={() => searchJobHandler(cat)}
                                    className={`group cursor-pointer relative overflow-hidden rounded-2xl p-6 ${color.bg} border ${color.border} hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${color.from} ${color.to} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                                    <div className="relative z-10">
                                        <div className={`h-12 w-12 mb-4 rounded-xl bg-gradient-to-br ${color.from} ${color.to} flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform`}>
                                            {cat.charAt(0)}
                                        </div>
                                        <h3 className={`font-semibold text-sm ${color.text} group-hover:underline`}>
                                            {cat}
                                        </h3>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                
                {/* Mobile Carousel */}
                <div className="md:hidden">
                    <Carousel className="w-full px-2">
                        <CarouselContent className="-ml-2">
                            {
                                category.map((cat, index) => (
                                    <CarouselItem key={index} className='pl-2 basis-3/4 sm:basis-1/2'>
                                        <Button 
                                            onClick={()=>searchJobHandler(cat)} 
                                            variant="outline" 
                                            className="w-full rounded-xl bg-white/90 backdrop-blur ring-1 ring-black/5 hover:ring-[#6A38C2]/30 hover:-translate-y-0.5 transition-all duration-300 py-6"
                                        >
                                            <span className="inline-flex items-center gap-2">
                                                <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#6A38C2] to-[#F83002]" />
                                                {cat}
                                            </span>
                                        </Button>
                                    </CarouselItem>
                                ))
                            }
                        </CarouselContent>
                        <CarouselPrevious className="rounded-full bg-white/90 backdrop-blur ring-1 ring-black/5 hover:bg-white shadow hover:shadow-md"/>
                        <CarouselNext className="rounded-full bg-white/90 backdrop-blur ring-1 ring-black/5 hover:bg-white shadow hover:shadow-md"/> 
                    </Carousel>
                </div>
            </div>
        </div>
  )
}

export default CategoryCarousel
