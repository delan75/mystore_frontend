import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import CurrencySelector from './CurrencySelector';
import MessageNotification from './MessageNotification';
import placeholderAvatar from '../assets/placeholder-avatar.svg';

const Layout = ({ children }) => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showProductsSubmenu, setShowProductsSubmenu] = useState(true);
    const [showCategoriesSubmenu, setShowCategoriesSubmenu] = useState(true);
    const [showOrdersSubmenu, setShowOrdersSubmenu] = useState(false);
    const [showChatsSubmenu, setShowChatsSubmenu] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const profileDropdownRef = useRef(null);

    // Function to check if current user has product management access
    const hasProductManagementAccess = user?.role === 'manager' || user?.role === 'admin';

    // Function to check if current user has order management access (admin, manager, or cashier)
    const hasOrderManagementAccess = user?.role === 'admin' || user?.role === 'manager' || user?.role === 'cashier';

    // Function to check if current user can modify orders (admin or manager only)
    const canModifyOrders = user?.role === 'admin' || user?.role === 'manager';





    // Function to capitalize first letter of each word
    const capitalizeRole = (role) => {
        if (!role) return '';
        return role.split('/').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join('/');
    };

    // Reference for the sidebar
    const sidebarRef = useRef(null);

    // Close dropdown and sidebar when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Close profile dropdown when clicking outside
            if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }

            // Close sidebar on mobile when clicking outside
            if (sidebarRef.current &&
                !sidebarRef.current.contains(event.target) &&
                sidebarOpen &&
                window.innerWidth < 768) { // Only on mobile
                setSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarOpen]);

    const handleLogout = async () => {
        await logout();
        toast.success('Logged out successfully.');
        navigate('/auth');
    };

    if (loading) {
        // Render loading indicator while waiting for user data
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Left Sidebar */}
            <aside
                ref={sidebarRef}
                className={`bg-[#13232f] fixed inset-y-0 left-0 w-64 transform ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
            >
                <div className="p-4 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8">
                        <Link to="/dashboard" className="flex items-center">
                            <i className="fas fa-store mr-2 text-white"></i>
                            <h2 className="text-2xl text-white font-semibold">MyStore</h2>
                        </Link>
                        {/* Close button for mobile */}
                        <button
                            className="md:hidden text-white hover:text-[#1ab188] focus:outline-none"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <nav className="flex-grow">
                        <ul className="space-y-2">
                            <li>
                                <Link to="/dashboard" className="text-white hover:text-[#1ab188] block py-2 flex items-center">
                                    <i className="fas fa-chart-line mr-2"></i>
                                    <span>Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop" className="text-white hover:text-[#1ab188] block py-2 flex items-center">
                                    <i className="fas fa-shopping-bag mr-2"></i>
                                    <span>Shop</span>
                                </Link>
                            </li>
                            <li className="relative">
                                {/* Orders main link with dropdown toggle */}
                                <div
                                    className="text-white hover:text-[#1ab188] py-2 flex items-center justify-between cursor-pointer"
                                    onClick={() => setShowOrdersSubmenu(!showOrdersSubmenu)}
                                >
                                    <div className="flex items-center">
                                        <i className="fas fa-shopping-cart mr-2"></i>
                                        <span>Orders</span>
                                    </div>
                                    <i className={`fas fa-chevron-${showOrdersSubmenu ? 'down' : 'right'} text-xs`}></i>
                                </div>

                                {/* Sub-navigation items */}
                                {showOrdersSubmenu && (
                                    <ul className="ml-6 space-y-2 mt-1">
                                        {/* Create Order - visible to all users */}
                                        <li>
                                            <Link
                                                to="/orders/create"
                                                className="text-white hover:text-[#1ab188] block py-1 text-sm flex items-center"
                                            >
                                                <i className="fas fa-plus mr-2"></i>
                                                <span>Create Order</span>
                                            </Link>
                                        </li>

                                        {/* My Orders - visible to all users */}
                                        <li>
                                            <Link
                                                to="/orders/my"
                                                className="text-white hover:text-[#1ab188] block py-1 text-sm flex items-center"
                                            >
                                                <i className="fas fa-list mr-2"></i>
                                                <span>My Orders</span>
                                            </Link>
                                        </li>

                                        {/* Manage Orders - only visible to admin/manager/cashier */}
                                        {hasOrderManagementAccess && (
                                            <li>
                                                <Link
                                                    to="/orders/manage"
                                                    className="text-white hover:text-[#1ab188] block py-1 text-sm flex items-center"
                                                >
                                                    <i className="fas fa-tasks mr-2"></i>
                                                    <span>Manage Orders</span>
                                                </Link>
                                            </li>
                                        )}
                                    </ul>
                                )}
                            </li>

                            <li className="relative">
                                {/* Chats main link with dropdown toggle */}
                                <div
                                    className="text-white hover:text-[#1ab188] py-2 flex items-center justify-between cursor-pointer"
                                    onClick={() => setShowChatsSubmenu(!showChatsSubmenu)}
                                >
                                    <div className="flex items-center">
                                        <i className="fas fa-comments mr-2"></i>
                                        <span>Chats</span>
                                    </div>
                                    <i className={`fas fa-chevron-${showChatsSubmenu ? 'down' : 'right'} text-xs`}></i>
                                </div>

                                {/* Sub-navigation items */}
                                {showChatsSubmenu && (
                                    <ul className="ml-6 space-y-2 mt-1">
                                        {/* My Chats - visible to all users */}
                                        <li>
                                            <Link
                                                to="/chats"
                                                className="text-white hover:text-[#1ab188] block py-1 text-sm flex items-center"
                                            >
                                                <i className="fas fa-inbox mr-2"></i>
                                                <span>My Chats</span>
                                            </Link>
                                        </li>

                                        {/* New Chat - visible to all users */}
                                        <li>
                                            <Link
                                                to="/chats/new"
                                                className="text-white hover:text-[#1ab188] block py-1 text-sm flex items-center"
                                            >
                                                <i className="fas fa-plus mr-2"></i>
                                                <span>New Chat</span>
                                            </Link>
                                        </li>

                                        {/* Blocked Users - visible to all users */}
                                        <li>
                                            <Link
                                                to="/chats/blocked"
                                                className="text-white hover:text-[#1ab188] block py-1 text-sm flex items-center"
                                            >
                                                <i className="fas fa-ban mr-2"></i>
                                                <span>Blocked Users</span>
                                            </Link>
                                        </li>

                                        {/* Manage Chats - only visible to admin/manager */}
                                        {hasProductManagementAccess && (
                                            <li>
                                                <Link
                                                    to="/chats/manage"
                                                    className="text-white hover:text-[#1ab188] block py-1 text-sm flex items-center"
                                                >
                                                    <i className="fas fa-cog mr-2"></i>
                                                    <span>Manage Chats</span>
                                                </Link>
                                            </li>
                                        )}
                                    </ul>
                                )}
                            </li>
                            {/* Products menu item with conditional rendering */}
                            <li className="relative">
                                {/* Products main link with dropdown toggle */}
                                <div
                                    className="text-white hover:text-[#1ab188] py-2 flex items-center justify-between cursor-pointer"
                                    onClick={() => setShowProductsSubmenu(!showProductsSubmenu)}
                                >
                                    <div className="flex items-center">
                                        <i className="fas fa-box mr-2"></i>
                                        <span>Products</span>
                                    </div>
                                    <i className={`fas fa-chevron-${showProductsSubmenu ? 'down' : 'right'} text-xs`}></i>
                                </div>

                                {/* Sub-navigation items */}
                                {showProductsSubmenu && (
                                    <ul className="ml-6 space-y-2 mt-1">
                                        {/* View Products - visible to all users */}
                                        <li>
                                            <Link
                                                to="/products"
                                                className="text-white hover:text-[#1ab188] block py-1 text-sm flex items-center"
                                            >
                                                <i className="fas fa-list mr-2"></i>
                                                <span>View Products</span>
                                            </Link>
                                        </li>

                                        {/* Add Product - only visible to admin/manager */}
                                        {hasProductManagementAccess && (
                                            <>
                                                <li>
                                                    <Link
                                                        to="/products/add"
                                                        className="text-white hover:text-[#1ab188] block py-1 text-sm flex items-center"
                                                    >
                                                        <i className="fas fa-plus mr-2"></i>
                                                        <span>Add Product</span>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link
                                                        to="/products/drafts"
                                                        className="text-white hover:text-[#1ab188] block py-1 text-sm flex items-center"
                                                    >
                                                        <i className="fas fa-file-alt mr-2"></i>
                                                        <span>Draft Products</span>
                                                    </Link>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                )}
                            </li>

                            {/* Categories menu item - only visible to admin/manager */}
                            {hasProductManagementAccess && (
                                <li className="relative">
                                    {/* Categories main link with dropdown toggle */}
                                    <div
                                        className="text-white hover:text-[#1ab188] py-2 flex items-center justify-between cursor-pointer"
                                        onClick={() => setShowCategoriesSubmenu(!showCategoriesSubmenu)}
                                    >
                                        <div className="flex items-center">
                                            <i className="fas fa-tags mr-2"></i>
                                            <span>Categories</span>
                                        </div>
                                        <i className={`fas fa-chevron-${showCategoriesSubmenu ? 'down' : 'right'} text-xs`}></i>
                                    </div>

                                    {/* Sub-navigation items */}
                                    {showCategoriesSubmenu && (
                                        <ul className="ml-6 space-y-2 mt-1">
                                            {/* View Categories */}
                                            <li>
                                                <Link
                                                    to="/categories"
                                                    className="text-white hover:text-[#1ab188] block py-1 text-sm flex items-center"
                                                >
                                                    <i className="fas fa-list mr-2"></i>
                                                    <span>View Categories</span>
                                                </Link>
                                            </li>

                                            {/* Add Category */}
                                            <li>
                                                <Link
                                                    to="/categories/add"
                                                    className="text-white hover:text-[#1ab188] block py-1 text-sm flex items-center"
                                                >
                                                    <i className="fas fa-plus mr-2"></i>
                                                    <span>Add Category</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            )}
                        </ul>
                    </nav>

                    {/* Logout button at bottom of sidebar */}
                    <div className="mt-auto pt-4">
                        <button
                            onClick={handleLogout}
                            className="w-full text-white hover:text-[#1ab188] py-2 flex items-center justify-center border border-white hover:border-[#1ab188] rounded"
                        >
                            <i className="fas fa-sign-out-alt mr-2"></i>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64">
                {/* Top Navigation Bar */}
                <header className="bg-white shadow-sm h-16 fixed top-0 right-0 left-0 md:left-64 z-30">
                    <div className="px-4 h-full flex items-center">
                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            <i className="fas fa-bars"></i>
                        </button>

                        {/* Right Side Nav Items */}
                        <div className="flex items-center space-x-4 ml-auto mr-2">
                            {/* Currency Selector */}
                            <div className="mr-4">
                                <CurrencySelector />
                            </div>

                            {/* Message Notification Icon */}
                            <MessageNotification />

                            {/* User Profile Dropdown */}
                            {user && (
                                <div className="relative" ref={profileDropdownRef}>
                                    {/* Profile Trigger */}
                                    <div
                                        className="flex flex-col items-center cursor-pointer px-2"
                                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                    >
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                                            <img
                                                src={user.avatar_url || placeholderAvatar}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = placeholderAvatar;
                                                }}
                                            />
                                        </div>
                                        <span className="text-gray-700 text-xs mt-1 max-w-[60px] truncate">{user.username || 'User'}</span>
                                    </div>

                                    {/* Dropdown Menu */}
                                    {showProfileDropdown && (
                                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50 origin-top-right">
                                            {/* User Info */}
                                            <div className="p-4 border-b flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-3 overflow-hidden">
                                                        <img
                                                            src={user.avatar_url || placeholderAvatar}
                                                            alt="Profile"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = placeholderAvatar;
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{user.first_name ? `${user.first_name} ${user.last_name}` : user.username}</div>
                                                        <div className="text-sm text-gray-500">{user.role ? capitalizeRole(user.role) : 'UI/UX Designer'}</div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={handleLogout}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <i className="fas fa-power-off"></i>
                                                </button>
                                            </div>

                                            {/* Tabs */}
                                            <div className="flex border-b">
                                                <Link to="/profile" className="flex-1 py-2 text-center border-b-2 border-[#1ab188] text-[#1ab188]">
                                                    <i className="fas fa-user mr-2"></i>
                                                    Profile
                                                </Link>
                                                <Link to="/settings" className="flex-1 py-2 text-center text-gray-600 hover:text-[#1ab188]">
                                                    <i className="fas fa-cog mr-2"></i>
                                                    Setting
                                                </Link>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="py-2">
                                                <Link to="/support" className="px-4 py-2 hover:bg-gray-100 flex items-center">
                                                    <i className="fas fa-question-circle w-5 mr-3"></i>
                                                    Support
                                                </Link>
                                                <Link to="/account-settings" className="px-4 py-2 hover:bg-gray-100 flex items-center">
                                                    <i className="fas fa-user-cog w-5 mr-3"></i>
                                                    Account Settings
                                                </Link>
                                                <Link to="/privacy" className="px-4 py-2 hover:bg-gray-100 flex items-center">
                                                    <i className="fas fa-shield-alt w-5 mr-3"></i>
                                                    Privacy Center
                                                </Link>
                                                <Link to="/feedback" className="px-4 py-2 hover:bg-gray-100 flex items-center">
                                                    <i className="fas fa-comment-alt w-5 mr-3"></i>
                                                    Feedback
                                                </Link>
                                                <Link to="/history" className="px-4 py-2 hover:bg-gray-100 flex items-center">
                                                    <i className="fas fa-history w-5 mr-3"></i>
                                                    History
                                                </Link>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-red-500"
                                                >
                                                    <i className="fas fa-sign-out-alt w-5 mr-3"></i>
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="pt-16 min-h-screen bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
};

export const hasProductManagementAccess = (user) => {
    if (!user) return false;
    return user.role === 'manager' || user.role === 'admin';
};

// Add a function to remember this for future reference
export const rememberHasProductManagementAccess = () => {
    return "The hasProductManagementAccess function is used to check if a user has admin or manager role to control access to certain resources and pages.";
};

export default Layout;
