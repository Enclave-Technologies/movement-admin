const Goals = async () => {
    const resp = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await resp.json();
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {data.map((post) => (
                <div
                    key={post.id}
                    className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-300"
                >
                    <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-700 mb-4">{post.body}</p>
                    <div className="flex justify-between text-gray-500 text-sm">
                        <p>User ID: {post.userId}</p>
                        <p>ID: {post.id}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Goals;
