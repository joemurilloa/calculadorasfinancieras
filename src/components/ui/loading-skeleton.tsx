import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="space-y-12 animate-pulse">
      {/* Executive Summary Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-200 rounded-3xl p-8 h-48">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-2">
                <div className="h-6 bg-slate-300 rounded w-32"></div>
                <div className="h-4 bg-slate-300 rounded w-24"></div>
              </div>
              <div className="w-10 h-10 bg-slate-300 rounded-full"></div>
            </div>
            <div className="h-10 bg-slate-300 rounded w-20 mb-4"></div>
            <div className="h-4 bg-slate-300 rounded w-16"></div>
          </div>
        ))}
      </div>

      {/* Detailed Analysis Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <div key={i} className="bg-slate-200 rounded-3xl p-8 h-96">
            <div className="h-6 bg-slate-300 rounded w-40 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-slate-300 rounded-full mr-3"></div>
                    <div className="h-4 bg-slate-300 rounded w-24"></div>
                  </div>
                  <div className="h-4 bg-slate-300 rounded w-16"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Strategies Skeleton */}
      <div className="bg-slate-200 rounded-3xl p-8">
        <div className="h-6 bg-slate-300 rounded w-48 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-300 rounded-2xl p-6 h-80">
              <div className="h-5 bg-slate-400 rounded w-24 mb-4"></div>
              <div className="h-8 bg-slate-400 rounded w-20 mb-4"></div>
              <div className="h-16 bg-slate-400 rounded mb-6"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-400 rounded w-full"></div>
                <div className="h-4 bg-slate-400 rounded w-3/4"></div>
                <div className="h-4 bg-slate-400 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Projections Skeleton */}
      <div className="bg-slate-200 rounded-3xl p-8">
        <div className="h-6 bg-slate-300 rounded w-48 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 bg-slate-300 rounded-3xl mx-auto mb-6"></div>
              <div className="h-4 bg-slate-300 rounded w-24 mx-auto mb-2"></div>
              <div className="h-8 bg-slate-300 rounded w-20 mx-auto mb-2"></div>
              <div className="h-3 bg-slate-300 rounded w-32 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
