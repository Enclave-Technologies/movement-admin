export const GoalListSkeleton = () => {
    return (
        <div>
            <div className="w-full flex flex-row justify-end gap-4">
                <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
            </div>

            <div className="flex flex-col w-full gap-8 mt-8">
                {[1, 2, 3].map((index) => (
                    <div
                        key={index}
                        className="flex flex-col w-full items-start gap-4"
                    >
                        <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
                        <div className="flex flex-col gap-1 w-full">
                            {[1, 2, 3].map((subIndex) => (
                                <div
                                    key={subIndex}
                                    className="h-16 w-full bg-gray-200 animate-pulse rounded-md"
                                ></div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
