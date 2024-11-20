import React from "react";

const SessionLogTable = ({ sessions, handleViewSession }) => {
    return (
        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-green-500">
                    <th className="border p-2 text-white text-center">Date</th>
                    <th className="border p-2 text-white text-center">Phase</th>
                    <th className="border p-2 text-white text-center">Tut</th>
                    <th className="border p-2 text-white text-center">
                        #Exercises
                    </th>
                    <th className="border p-2 text-white text-center"></th>
                </tr>
            </thead>
            <tbody>
                {sessions.map((session) => (
                    <tr key={session.id}>
                        <td className="border p-2 text-center">
                            {session.date}
                        </td>
                        <td className="border p-2 text-center">
                            {session.session}
                        </td>
                        <td className="border p-2 text-center">
                            {session.tut}
                        </td>
                        <td className="border p-2 text-center">
                            {session.exercises}
                        </td>
                        <td className="border p-2 text-center">
                            <button
                                onClick={() => handleViewSession(session)}
                                className="text-blue-500 underline"
                            >
                                View
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default SessionLogTable;
