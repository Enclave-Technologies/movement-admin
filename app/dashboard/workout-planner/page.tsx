const WorkoutPlanner = async () => {
    const resp = await fetch("https://jsonplaceholder.typicode.com/comments");
    const data = await resp.json();
    console.log("On server");
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {data.map((comment) => (
                <div
                    key={comment.id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
                >
                    <h3 className="text-lg font-bold mb-2">{comment.name}</h3>
                    <p className="text-gray-700 mb-2">{comment.email}</p>
                    <p className="text-gray-700 mb-4">{comment.body}</p>
                    <div className="flex justify-between text-gray-500 text-sm">
                        <p>Post ID: {comment.postId}</p>
                        <p>ID: {comment.id}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default WorkoutPlanner;
