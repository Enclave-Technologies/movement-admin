"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
const Page = () => {
  // Sample session data
  const sessions = [
    { id: 1, date: 'Sep 2, 2024', session: 'Phase 1', tut: '422', exercises: "14" },
    { id: 2, date: 'Aug 31, 2024', session: 'Phase 1', tut: '422', exercises: "16" },
    { id: 3, date: 'Aug 30, 2024', session: 'Phase 1', tut: '422', exercises: "12" },
    { id: 4, date: 'Aug 29, 2024', session: 'Phase 1', tut: '422', exercises: "16" },
    { id: 5, date: 'Aug 27, 2024', session: 'Phase 1', tut: '422', exercises: "12" },
  ];

  const handleViewSession = (session) => {
    alert(`Viewing session on ${session.date}:\n\nTut:\n${session.tut}\n\nExercises:\n${session.exercises}`);
  };

  return (
    <div style={{ margin: '20px' }}>
      <header style={{ display: 'flex', alignItems: 'center' }}>
        <Image 
          src="https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg" 
          alt="Ronald Richards" 
          width={30} // Smaller size
          height={30} // Smaller size
          style={{ borderRadius: '50%', marginRight: '10px', objectFit: 'cover',border: '2px solid white' }} 
        />
        <h1 style={{ marginBottom: '20px' }}>Ronald Richards {'>'} Workout Tracking</h1>
      </header>
      <div>
        <h5 className='text-#000000 font-bold'>Next Workout</h5>
      </div>
      <br />
      <div className='border rounded-lg' style={{ padding: '10px', marginBottom: '20px', borderColor: "#006847" }}>
        <div className='flex justify-between items-center bg-slate-500'>
          <ul className='text-left'>
            <li>PHASE 3</li>
            <li>SESSION : UPPER BODY</li>
          </ul>
          <Link href="/workout-tracker/create-workout">
            <button className='px-4 py-2 text-white rounded-2xl' style={{ background: "#006847" }}>
              START WORKOUT
            </button>
          </Link>
        </div>
      </div>
      <section>
        <h3 className='text-#000000 font-bold'>Workout History</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#006847' }}>
              <th style={{ border: '1px solid #006847', padding: '8px', color: 'white', textAlign: 'center' }}>Date</th>
              <th style={{ border: '1px solid #006847', padding: '8px', color: 'white', textAlign: 'center' }}>Phase</th>
              <th style={{ border: '1px solid #006847', padding: '8px', color: 'white', textAlign: 'center' }}>Tut</th>
              <th style={{ border: '1px solid #006847', padding: '8px', color: 'white', textAlign: 'center' }}>#Exercises</th>
              <th style={{ border: '1px solid #006847', padding: '8px', color: 'white', textAlign: 'center' }}></th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(session => (
              <tr key={session.id}>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{session.date}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{session.session}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{session.tut}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{session.exercises}</td>
                <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                  <button onClick={() => handleViewSession(session)} className="text-blue-500 underline">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <style jsx>{`
        @media (max-width: 768px) {
          header {
            flex-direction: column;
            align-items: flex-start;
          }
          h1 {
            font-size: 1.5rem; /* Adjust font size for smaller screens */
          }
          .border {
            padding: 8px; /* Adjust padding */
          }
          table {
            font-size: 0.875rem; /* Smaller font for tables */
          }
        }
      `}</style>
    </div>
  );
};

export default Page;
