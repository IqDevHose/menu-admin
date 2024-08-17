import { ChartBarStacked, ChefHat, FileQuestion, LayoutDashboard, MessageCircleCode, ShieldBan, ShoppingBasket, Star, SunMoon } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    return (
        <>

            <aside id="separator-sidebar" className="w-72 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-100">
                    <ul className="space-y-2 font-medium">
                        <li className='mb-3'>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group border border-b-4 shadow">
                            <LayoutDashboard />
                                <span className="ms-3">Admin panal</span>
                            </a>
                        </li>
                        <li>
                            <NavLink to={'/restaurant'} className={(navData) =>
                                navData.isActive
                                    ? "flex items-center p-2 text-white rounded-lg  bg-gray-500 group"
                                    : "flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100  group "
                            }>
                                <ChefHat />
                                <span className="text-start flex-1 ms-3 whitespace-nowrap">Restaurant</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/category'} className={(navData) =>
                                navData.isActive
                                    ? "flex items-center p-2 text-white rounded-lg  bg-gray-500 group"
                                    : "flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100  group "
                            }>
                                <ChartBarStacked />
                                <span className="text-start flex-1 ms-3 whitespace-nowrap">Category</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/items'} className={(navData) =>
                                navData.isActive
                                    ? "flex items-center p-2 text-white rounded-lg  bg-gray-500 group"
                                    : "flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100  group "
                            }>
                                <ShoppingBasket />
                                <span className="text-start flex-1 ms-3 whitespace-nowrap">Items</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/customerReview'} className={(navData) =>
                                navData.isActive
                                    ? "flex items-center p-2 text-white rounded-lg  bg-gray-500 group"
                                    : "flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100  group "
                            }>
                                <MessageCircleCode />
                                <span className="text-start flex-1 ms-3 whitespace-nowrap">Customer Review</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/rating'} className={(navData) =>
                                navData.isActive
                                    ? "flex items-center p-2 text-white rounded-lg  bg-gray-500 group"
                                    : "flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100  group "
                            }>
                                <Star />
                                <span className="text-start flex-1 ms-3 whitespace-nowrap">Rating</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/questions'} className={(navData) =>
                                navData.isActive
                                    ? "flex items-center p-2 text-white rounded-lg  bg-gray-500 group"
                                    : "flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100  group "
                            }>
                                <FileQuestion />
                                <span className="text-start flex-1 ms-3 whitespace-nowrap">Questions</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/theme'} className={(navData) =>
                                navData.isActive
                                    ? "flex items-center p-2 text-white rounded-lg  bg-gray-500 group"
                                    : "flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100  group "
                            }>
                                <SunMoon />
                                <span className="text-start flex-1 ms-3 whitespace-nowrap">Theme</span>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </aside >
        </>
    )
}

export default Sidebar