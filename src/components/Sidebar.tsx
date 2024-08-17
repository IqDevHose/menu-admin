import { ChartBarStacked, ChefHat, FileQuestion, MessageCircleCode, ShieldBan, ShoppingBasket, Star, SunMoon } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
    return (
        <>

            <button data-drawer-target="separator-sidebar" data-drawer-toggle="separator-sidebar" aria-controls="separator-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 ">
                <span className="sr-only">Open sidebar</span>
                <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>

            <aside id="separator-sidebar" className="fixed top-0 left-0 z-40 w-72 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-100">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group border border-b-4 shadow">
                            <ShieldBan />
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