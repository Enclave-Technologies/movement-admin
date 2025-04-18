import FeatureEight from "./feature-eight";
import FeatureFive from "./feature-five";
import FeatureFour from "./feature-four";
import FeatureOne from "./feature-one";
import FeatureSeven from "./feature-seven";
import FeatureSix from "./feature-six";
import FeatureThree from "./feature-three";
import FeatureTwo from "./feature-two";

export default function Eight() {
    return (
        <div className="storybook-fix w-full">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4 sm:grid-rows-3">
                <FeatureOne />
                <FeatureTwo />
                <FeatureThree />
                <FeatureFour />
                <FeatureFive />
                <FeatureSix />
                <FeatureSeven />
                <FeatureEight />
            </div>
        </div>
    );
}
