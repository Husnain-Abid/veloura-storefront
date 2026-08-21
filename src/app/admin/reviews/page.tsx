"use client";

import { useEffect, useState } from "react";
import { 
  Check, 
  X, 
  Star,
  MessageSquare,
  Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/admin/reviews");
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleApprove = async (id: string) => {
    const res = await fetch(`/api/admin/reviews/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setReviews(reviews.map(r => r.id === id ? { ...r, isApproved: true } : r));
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif">Product Reviews</h1>
        <p className="text-gray-500 text-sm mt-1">Moderate customer reviews before they go public.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
           <p className="text-center py-24">Loading reviews...</p>
        ) : reviews.length === 0 ? (
           <div className="py-24 text-center bg-white rounded-xl border border-gray-100 shadow-sm">
              <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">No reviews found</p>
           </div>
        ) : reviews.map((review) => (
          <div key={review.id} className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-20 bg-gray-50 shrink-0">
               <img src={review.product.images[0]?.url} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold uppercase">{review.userName}</h4>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">On {review.product.name}</p>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-3 h-3 fill-current", i >= review.rating && "text-gray-200 fill-none")} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 italic">"{review.comment}"</p>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest block">
                Submitted on {new Date(review.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {!review.isApproved && (
                <button 
                  onClick={() => handleApprove(review.id)}
                  className="bg-green-50 text-green-600 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-green-100 transition-colors flex items-center gap-2"
                >
                  <Check className="w-3 h-3" /> Approve
                </button>
              )}
              <button className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-red-100 transition-colors flex items-center gap-2">
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
