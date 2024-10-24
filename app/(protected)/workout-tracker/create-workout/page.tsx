"use client";
import React, { useState } from 'react';

const Page = () => {
  const [openExercises, setOpenExercises] = useState([false, false, false, false, false]);
  const [exerciseData, setExerciseData] = useState({
    0: { sets: Array(3).fill({ reps: '', weight: '', notes: '' }) },
    1: { 
      sets: [
        { reps: '', weight: '', notes: 'Insufficient Shoulder Rotation. Start with lower weight' },
        { reps: '', weight: '', notes: 'Bar should be on Level 13' },
        { reps: '', weight: '', notes: '' }
      ] 
    },
    2: { sets: Array(3).fill({ reps: '', weight: '', notes: '' }) },
    3: { sets: Array(3).fill({ reps: '', weight: '', notes: '' }) },
    4: { 
      sets:  [
        { reps: '', weight: '', notes: 'Insufficient Shoulder Rotation. Start with lower weight' },
        { reps: '', weight: '' },
        { reps: '', weight: '', notes: '' }
      ]  
    },
  });

  const toggleAccordion = (index) => {
    setOpenExercises(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div className='body'>
      <div className='box flex flex-row items-center justify-between'>
        <button className="text-white">X</button>
        <ul className='text-center text-white'>
          <li>PHASE 1</li>
          <li>SESSION 1: GIRONDA 8X8</li>
        </ul>
        <div className='flex justify-end'>
          <button className="border border-solid rounded-2xl w-20 text-white p-1 mr-4">
            SAVE
          </button>
        </div>
      </div>

      {/* Exercise List */}
      {['1.WIDE GRIP LAT PULLDOWN', '2.BB SQUAT', '3.FLAT DB PRESS', '4.HIP THRUST MACHINE', '5.SEATED MACHINE ROW'].map((exercise, index) => (
        <div key={index}>
          <div 
            className="mt-4 ml-2 cursor-pointer text-white flex justify-between items-center"
            onClick={() => toggleAccordion(index)}
          >
            <span>{exercise}: 8 sets of 12 Reps</span>
            <span className={`ml-2 transition-transform ${openExercises[index] ? 'rotate-180' : ''}`}>
    ▼
  </span>        
    </div>

          {/* Display table for relevant exercises */}
          {openExercises[index] && (
            <div className="ml-5 mt-2">
              <table className='font-sans text-white table-auto border-separate border-spacing-2'>
                <thead>
                  <tr>
                    <th className='p-2'>SET</th>
                    <th className='p-2'>REPS</th>
                    <th className='p-2'>WEIGHT</th>
                    <th className='p-2'>NOTES</th>
                  </tr>
                </thead>
                <tbody>
                  {exerciseData[index].sets.map((set, setIndex) => (
                    <tr key={setIndex}>
                      <td className='p-2'>{setIndex + 1}</td>
                      <td className='p-2'>
                        <input 
                          type="number"
                          value={set.reps}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setExerciseData(prev => {
                              const newData = { ...prev };
                              newData[index].sets[setIndex].reps = newValue;
                              return newData;
                            });
                          }}
                          style={{ 
                            width: '80%', 
                            padding: '4px', 
                            borderRadius: '12px', 
                            border: '1px solid white', 
                            backgroundColor: 'transparent', 
                            color: 'white',
                            textAlign: 'center'
                          }}
                          placeholder="REPS"
                        />
                      </td>
                      <td className='p-2'>
                        <input 
                          type="number"
                          value={set.weight}
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setExerciseData(prev => {
                              const newData = { ...prev };
                              newData[index].sets[setIndex].weight = newValue;
                              return newData;
                            });
                          }}
                          style={{ 
                            width: '80%', 
                            padding: '4px', 
                            borderRadius: '12px', 
                            border: '1px solid white', 
                            backgroundColor: 'transparent', 
                            color: 'white',
                            textAlign: 'center'
                          }}
                          placeholder="WEIGHT"
                        />
                      </td>
                      <td className='p-2'>
                        <span className='block mt-1'>{set.notes}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className='flex justify-center mt-4'>
                <ul className='flex items-center gap-6'>
                  <li>
                    <button className="border border-solid rounded-2xl w-36" style={{ padding: '2px', backgroundColor: '#E7FF87', margin: '25px 30px' }}>
                      Add set
                    </button>
                  </li>
                  <li>
                    <button className='border border-solid rounded-2xl w-32' style={{ padding: '2px', borderColor: '#E7FF87', color: "#E7FF87", margin: '25px 30px' }}>
                      Add note
                    </button>
                  </li>
                  {index < 4 && (
                    <li>
                      <button className='border border-solid rounded-2xl w-20' style={{ padding: '2px', borderColor: '#ffffff', color: "#ffffff",margin:"25px 30px" }}>
                        CONFIRM
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          <div className='line'></div>
        </div>
      ))}

      <style jsx>{`
        @media (max-width: 768px) {
          .body {
            padding: 10px;
          }
          .box {
            flex-direction: column;
            align-items: flex-start;
          }
          .box ul {
            margin: 10px 0;
          }
          table {
            font-size: 0.9rem; /* Adjust font size for smaller screens */
          }
          input {
            width: 100%; /* Make inputs full width */
          }
          .flex {
            flex-direction: column; /* Stack buttons vertically on small screens */
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Page;
