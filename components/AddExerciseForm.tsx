import React, { forwardRef, useEffect, useState } from "react";
import SubmitButton from "./ResponsiveButton";

const AddExerciseForm = forwardRef<HTMLFormElement, AddFormProps>(
    ({ action, state }, ref) => {
        const [tut, setTut] = useState<number | null>(null);

        const calculateTUT = () => {
            const tempoInput = document.getElementById(
                "tempo"
            ) as HTMLInputElement;
            const recommendedRepsMaxInput = document.getElementById(
                "recommendedRepsMax"
            ) as HTMLInputElement;
            const recommendedSetsMaxInput = document.getElementById(
                "recommendedSetsMax"
            ) as HTMLInputElement;

            if (
                tempoInput &&
                recommendedRepsMaxInput &&
                recommendedSetsMaxInput
            ) {
                const tempoArray = tempoInput.value.split(" ");
                const totalTempo = tempoArray.reduce(
                    (sum, t) => sum + parseInt(t),
                    0
                );
                const maxReps = parseInt(recommendedRepsMaxInput.value);
                const maxSets = parseInt(recommendedSetsMaxInput.value);
                const computedTUT = totalTempo * maxReps * maxSets;
                setTut(computedTUT);
            }
        };

        useEffect(() => {
            calculateTUT();
        }, []);

        useEffect(() => {
            const tempoInput = document.getElementById(
                "tempo"
            ) as HTMLInputElement;
            const recommendedRepsMaxInput = document.getElementById(
                "recommendedRepsMax"
            ) as HTMLInputElement;
            const recommendedSetsMaxInput = document.getElementById(
                "recommendedSetsMax"
            ) as HTMLInputElement;

            const handleInputChange = () => {
                calculateTUT();
            };

            tempoInput?.addEventListener("input", handleInputChange);
            recommendedRepsMaxInput?.addEventListener(
                "input",
                handleInputChange
            );
            recommendedSetsMaxInput?.addEventListener(
                "input",
                handleInputChange
            );

            return () => {
                tempoInput?.removeEventListener("input", handleInputChange);
                recommendedRepsMaxInput?.removeEventListener(
                    "input",
                    handleInputChange
                );
                recommendedSetsMaxInput?.removeEventListener(
                    "input",
                    handleInputChange
                );
            };
        }, []);

        return (
            <div>
                <form
                    className="space-y-4 capitalize"
                    action={action}
                    ref={ref}
                >
                    <div>
                        <label
                            htmlFor="motion"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Motion
                        </label>
                        <input
                            type="text"
                            id="motion"
                            name="motion"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {state?.errors?.motion && (
                            <p className="text-red-500 text-xs italic">
                                {state.errors.motion}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="specificDescription"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Specific Description
                        </label>
                        <input
                            type="text"
                            id="specificDescription"
                            name="specificDescription"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {state?.errors?.specificDescription && (
                            <p className="text-red-500 text-xs italic">
                                {state.errors.specificDescription}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="shortDescription"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Short Description
                        </label>
                        <input
                            type="text"
                            id="shortDescription"
                            name="shortDescription"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {state?.errors?.shortDescription && (
                            <p className="text-red-500 text-xs italic">
                                {state.errors.shortDescription}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="recommendedRepsMin"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Recommended Reps Min
                        </label>
                        <input
                            type="number"
                            id="recommendedRepsMin"
                            name="recommendedRepsMin"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {state?.errors?.recommendedRepsMin && (
                            <p className="text-red-500 text-xs italic">
                                {state.errors.recommendedRepsMin}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="recommendedRepsMax"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Recommended Reps Max
                        </label>
                        <input
                            type="number"
                            id="recommendedRepsMax"
                            name="recommendedRepsMax"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {state?.errors?.recommendedRepsMax && (
                            <p className="text-red-500 text-xs italic">
                                {state.errors.recommendedRepsMax}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="recommendedSetsMin"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Recommended Sets Min
                        </label>
                        <input
                            type="number"
                            id="recommendedSetsMin"
                            name="recommendedSetsMin"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {state?.errors?.recommendedSetsMin && (
                            <p className="text-red-500 text-xs italic">
                                {state.errors.recommendedSetsMin}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="recommendedSetsMax"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Recommended Sets Max
                        </label>
                        <input
                            type="number"
                            id="recommendedSetsMax"
                            name="recommendedSetsMax"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {state?.errors?.recommendedSetsMax && (
                            <p className="text-red-500 text-xs italic">
                                {state.errors.recommendedSetsMax}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="tempo"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Tempo
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                            Example tempo format: 2 0 2 0
                        </p>
                        <input
                            type="text"
                            id="tempo"
                            name="tempo"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {state?.errors?.tempo && (
                            <p className="text-red-500 text-xs italic">
                                {state.errors.tempo}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="tut"
                            className="block text-sm font-medium text-gray-700"
                        >
                            TUT (in Seconds)
                        </label>
                        <p className="text-xs text-gray-500 mt-1">
                            AUTO-CALCULATED
                        </p>
                        <input
                            type="number"
                            id="tut"
                            name="tut"
                            value={tut || ""}
                            readOnly
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {state?.errors?.tut && (
                            <p className="text-red-500 text-xs italic">
                                {state.errors.tut}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="recommendedRestMin"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Recommended Rest Min
                        </label>
                        <input
                            type="number"
                            id="recommendedRestMin"
                            name="recommendedRestMin"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {state?.errors?.recommendedRestMin && (
                            <p className="text-red-500 text-xs italic">
                                {state.errors.recommendedRestMin}
                            </p>
                        )}
                    </div>
                    <div>
                        <label
                            htmlFor="recommendedRestMax"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Recommended Rest Max
                        </label>
                        <input
                            type="number"
                            id="recommendedRestMax"
                            name="recommendedRestMax"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                        {state?.errors?.recommendedRestMax && (
                            <p className="text-red-500 text-xs italic">
                                {state.errors.recommendedRestMax}
                            </p>
                        )}
                    </div>

                    <SubmitButton label="Submit" />
                </form>
            </div>
        );
    }
);

AddExerciseForm.displayName = "AddExerciseForm"; // Set the display name

export default AddExerciseForm;
