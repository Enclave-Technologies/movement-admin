import React from "react";

const Page = ({ params }: { params: { id: string; phid: string } }) => {
    return (
        <div>
            Page: {params.id} {params.phid}
        </div>
    );
};

export default Page;
