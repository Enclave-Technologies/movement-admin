const TrackedExercises = async () => {
    const data = await fetch("https://jsonplaceholder.typicode.com/posts");
    return <div>TrackedExercises</div>;
};

export default TrackedExercises;
