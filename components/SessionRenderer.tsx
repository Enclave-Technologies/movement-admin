import React from "react";

const SessionRenderer = ({ sessions }: { sessions: MovSession[] }) => {
    console.log(JSON.stringify(sessions));
    return <div>SessionRenderer</div>;
};

export default SessionRenderer;
