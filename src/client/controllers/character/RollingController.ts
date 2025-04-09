import { Controller, OnStart } from "@flamework/core";
import { UserInputService, RunService, Players } from "@rbxts/services";

@Controller({})
export class RollingController implements OnStart {
	public isRolling = false;
	private rollSpeed = 60;
	private rollDuration = 0.3;
	private rollCooldown = 1;
	private lastRollTime = 0;

	onStart() {
		UserInputService.InputBegan.Connect((input, gameProcessed) => {
			if (!gameProcessed && input.KeyCode === Enum.KeyCode.Space) {
				const currentTime = tick();
				if (currentTime - this.lastRollTime >= this.rollCooldown) {
					this.performRoll();
					this.lastRollTime = currentTime;
				}
			}
		});
	}

	private performRoll() {
		if (this.isRolling) return;

		this.isRolling = true;
		const character = Players.LocalPlayer.Character;
		if (!character) return;

		const humanoidRootPart = character.FindFirstChild("HumanoidRootPart") as Part | undefined;
		if (!humanoidRootPart) return;

		const lookVector = humanoidRootPart.CFrame.LookVector;
		const rollVelocity = lookVector.mul(this.rollSpeed);

		const humanoid = character.FindFirstChildOfClass("Humanoid");
		if (humanoid) {
			humanoid.AutoRotate = false;
		}

		const startTime = tick();
		const connection = RunService.Heartbeat.Connect(() => {
			const elapsedTime = tick() - startTime;
			if (elapsedTime > this.rollDuration) {
				connection.Disconnect();
				this.isRolling = false;

				if (humanoid) {
					humanoid.AutoRotate = true;
				}
				return;
			}

			humanoidRootPart.Velocity = rollVelocity;
		});
	}
}
