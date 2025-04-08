import { Controller, OnStart } from "@flamework/core";
import { Players, RunService, Workspace } from "@rbxts/services";

@Controller()
export class IsometricCameraController implements OnStart {
	private player = Players.LocalPlayer!;
	private camera = Workspace.CurrentCamera!;
	private target?: Model;
	private desiredPosition = new Vector3();

	private readonly angleX = math.rad(30);
	private readonly angleY = math.rad(45);
	private readonly distance = 25;

	onStart(): void {
		this.setTarget(this.player.Character || this.player.CharacterAdded.Wait()[0]);

		this.player.CharacterAdded.Connect((char) => this.setTarget(char));

		RunService.Heartbeat.Connect(() => this.updateCamera());
	}

	private setTarget(character: Model) {
		this.target = character;
	}

	private updateCamera(): void {
		if (!this.target) return;

		const root = this.target.FindFirstChild("HumanoidRootPart") as BasePart | undefined;
		if (!root) return;

		const targetPosition = root.Position;
		const staticY = targetPosition.Y; // Lock the Y position to the player's current height
		const adjustedTargetPosition = new Vector3(targetPosition.X, staticY, targetPosition.Z);

		const offset = new Vector3(
			this.distance * math.cos(this.angleX) * math.sin(this.angleY),
			this.distance * math.sin(this.angleX),
			this.distance * math.cos(this.angleX) * math.cos(this.angleY),
		);

		this.desiredPosition = adjustedTargetPosition.add(offset);

		const currentPosition = this.camera.CFrame.Position;
		const newPosition = currentPosition.Lerp(this.desiredPosition, 0.1); // adjust lerp factor for smoothness

		this.camera.CameraType = Enum.CameraType.Scriptable;
		this.camera.CFrame = CFrame.lookAt(newPosition, adjustedTargetPosition);
	}
}
