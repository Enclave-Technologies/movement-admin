export const getIndividualComponents = (allPhaseData: Phase[]) => {
    return {
        sesEx: allPhaseData?.flatMap((phase) =>
            phase.sessions.flatMap((session) => session.exercises)
        ),
        movSess: allPhaseData?.flatMap((phase) =>
            phase.sessions.map((session) => session)
        ),
    };
};
