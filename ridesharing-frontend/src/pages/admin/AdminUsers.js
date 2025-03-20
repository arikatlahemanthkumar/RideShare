import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../redux/slices/admin-slice";

export default function AdminUsers() {
    const dispatch = useDispatch();
    const { users = [], loading, total, totalPages, page } = useSelector((state) => state.admin || {});
    
   
    const [searchInput, setSearchInput] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    
  
    const [sortBy, setSortBy] = useState("name");
    const [order, setOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(5);

    useEffect(() => {
        dispatch(fetchUsers({ 
            search: searchTerm, 
            sortBy, 
            order, 
            page: currentPage, 
            limit 
        }));
    }, [dispatch, searchTerm, sortBy, order, currentPage, limit]);

  
    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchTerm(searchInput);
        setCurrentPage(1); 
    };

    
    const clearSearch = () => {
        setSearchInput("");
        setSearchTerm("");
        setCurrentPage(1);
    };

    
    const handleSortChange = (field) => {
        if (sortBy === field) {
            setOrder(order === "asc" ? "desc" : "asc");
        } else {
            
            setSortBy(field);
            setOrder("asc");
        }
        setCurrentPage(1); 
    };

    
    const goToPage = (pageNum) => {
        setCurrentPage(pageNum);
    };

   
    const getSortIndicator = (field) => {
        if (sortBy !== field) return null;
        return order === "asc" ? "↑" : "↓";
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    <p className="mt-2">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">User Management</h2>

            
            <form onSubmit={handleSearchSubmit} className="mb-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search by name, email, or role..."
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchInput}
                        onChange={handleSearchInputChange}
                    />
                    <button 
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                        Search
                    </button>
                    {searchTerm && (
                        <button 
                            type="button"
                            onClick={clearSearch}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                        >
                            Clear
                        </button>
                    )}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                    Search across name, email, or role fields
                </p>
            </form>

           
            {searchTerm && (
                <div className="mb-4 p-2 bg-blue-50 rounded-lg flex items-center justify-between">
                    <span className="text-blue-700">
                        Searching for: <strong>{searchTerm}</strong>
                    </span>
                </div>
            )}

           
            <div className="mb-4">
                <h3 className="text-gray-700 mb-2 font-medium">Sort by:</h3>
                <div className="flex flex-wrap gap-2">
                    <button 
                        className={`px-3 py-1 text-sm rounded-full ${sortBy === "name" 
                            ? "bg-blue-500 text-white" 
                            : "bg-gray-100 hover:bg-gray-200"}`}
                        onClick={() => handleSortChange("name")}
                    >
                        Name {getSortIndicator("name")}
                    </button>
                    <button 
                        className={`px-3 py-1 text-sm rounded-full ${sortBy === "email" 
                            ? "bg-blue-500 text-white" 
                            : "bg-gray-100 hover:bg-gray-200"}`}
                        onClick={() => handleSortChange("email")}
                    >
                        Email {getSortIndicator("email")}
                    </button>
                    <button 
                        className={`px-3 py-1 text-sm rounded-full ${sortBy === "role" 
                            ? "bg-blue-500 text-white" 
                            : "bg-gray-100 hover:bg-gray-200"}`}
                        onClick={() => handleSortChange("role")}
                    >
                        Role {getSortIndicator("role")}
                    </button>
                </div>
            </div>

            
            <div className="space-y-4 mb-6">
                {users && users.length > 0 ? (
                    users.map((user) => (
                        <div key={user._id} className="border-b pb-4">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-gray-600">{user.email}</p>
                            <p className="text-sm text-gray-500">{user.role}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No users available.</p>
                )}
            </div>

            
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <button
                        className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    
                    <div className="flex items-center space-x-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                            <button
                                key={num}
                                onClick={() => goToPage(num)}
                                className={`w-8 h-8 rounded-full ${
                                    currentPage === num
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                    
                    <button
                        className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50 hover:bg-gray-200"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}

            
            <div className="mt-4 text-sm text-gray-500">
                {total > 0 ? (
                    <p>
                        Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, total)} of {total} users
                    </p>
                ) : (
                    <p>No results found</p>
                )}
            </div>
        </div>
    );
}