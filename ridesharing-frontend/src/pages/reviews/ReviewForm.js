import { useState,useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams ,useNavigate} from "react-router-dom";
import { submitReview } from "../../redux/slices/review-slice";
import {toast} from "react-toastify"

export default function ReviewForm(){
    const {tripId} = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [ratings,setRatings] = useState(5)
    const [comment,setComment] = useState('')

    useEffect(() => {
        console.log("Extracted tripId:", tripId);
    }, [tripId]);
    
    const handleSubmit = (e)=>{
        e.preventDefault()
        console.log("Submitting review with:", { tripId, ratings, comment }); 
        if (!tripId || tripId === ":tripId") {
            console.error("Invalid tripId:", tripId);
            return;
        }
        dispatch(submitReview({tripId, ratings, comment}))
        .then(() => {
            toast.success("Review submitted successfully!");
            navigate("/login"); 
        })
        .catch((error) => {
            toast.error("Error submitting review:", error);
        });
    }
    return(
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Rate your Trip</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label  className="block text-sm font-medium text-gray-700">Rating</label>
                        <select
                                value={ratings}
                                onChange={(e)=>setRatings(Number(e.target.value))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                        {[5,4,3,2,1].map((value)=>(
                            <option key={value} value = {value}>
                                {value} Star {value !== 1 ? "s" :""} 
                            </option>
                        ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Comment</label>
                        <textarea
                                  value={comment}
                                  onChange={(e)=>setComment(e.target.value)}
                                  rows={4}
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                  placeholder="Share your experience..."
                        />
                    </div>

                    <button
                           type="submit"
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Submit Review
                    </button>

                </form>
            </div>
        </div>
    )
}