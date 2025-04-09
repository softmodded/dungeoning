import { Controller, OnStart } from "@flamework/core";
import { Animation } from "@rbxts/animation";

@Controller({})
export class HumanoidAnimationController implements OnStart {
	onStart() {}

	public loadAnimationSet(animator: Animator, idle: string, walk: string) {
		const bundle = Animation.createAnimations({
			idle: idle,
			walk: walk,
		});

		const animation = Animation.loadAnimator(animator, bundle);
		return animation;
	}
}
