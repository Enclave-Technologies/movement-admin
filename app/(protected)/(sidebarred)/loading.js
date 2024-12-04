export default function Loading() {
  return (
    // Use only tailwind CSS
    <div className="min-h-screen bg-gray-100">
      <div className="mt-20 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
