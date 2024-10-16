import { GoalTile } from "@/components/GoalTile";
import { goals } from "./dummyData";

export default function Page() {
  return (
    <div className="text-center mt-4 flex flex-col gap-8 w-full">
      <div className="w-full flex flex-row justify-end gap-4">
        <button className="primary-btn">Add Goal</button>
        <button className="secondary-btn">Edit Goals</button>
      </div>
      <div className="flex flex-col w-full gap-8">
        {goals.map((goal, i) => (
          <div key={i} className="flex flex-col w-full items-start gap-4">
            <h1 className="uppercase text-xl font-bold">{goal.type}</h1>
            <div className="flex flex-col gap-1 w-full">
              {goal.goals.map((goal, index) => (
                <GoalTile key={index} goal={goal} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
