export const mapPhaseToDropdown = (phases: Phase[]): PhaseDropdownOption[] => {
    return phases.map((phase: Phase) => ({
        value: phase.id,
        label: phase.phaseName,
        isActive: phase.isActive,
    }));
};
