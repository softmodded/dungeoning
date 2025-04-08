import { Controller, OnStart, OnRender } from "@flamework/core";
import { Players, UserInputService, TweenService, RunService, Workspace } from "@rbxts/services";

@Controller()
export class ClickToMoveController implements OnStart, OnRender {
	private player = Players.LocalPlayer!;
	private mouse = this.player.GetMouse();
	private character?: Model;
	private humanoid?: Humanoid;
	private rootPart?: BasePart;

	private isHolding = false;
	private holdStartTime = 0;
	private holdThreshold = 0.1;

	onStart(): void {
		this.player.CharacterAdded.Connect((char) => this.setupCharacter(char));
		if (this.player.Character) this.setupCharacter(this.player.Character);

		UserInputService.InputBegan.Connect((input, gameProcessed) => {
			if (input.UserInputType === Enum.UserInputType.MouseButton1 && !gameProcessed) {
				this.holdStartTime = tick();
				this.isHolding = true;
			}
		});

		UserInputService.InputEnded.Connect((input) => {
			if (input.UserInputType === Enum.UserInputType.MouseButton1) {
				const heldFor = tick() - this.holdStartTime;
				this.isHolding = false;

				if (!this.humanoid || !this.rootPart) return;

				if (heldFor < this.holdThreshold) {
					const point = this.getGroundPoint();
					if (point) {
						this.humanoid.MoveTo(point);
						this.createRipple(point);
					}
				} else {
					this.humanoid.MoveTo(this.rootPart.Position);
				}
			}
		});
	}

	onRender(): void {
		if (!this.isHolding || !this.humanoid || !this.rootPart) return;

		const heldTime = tick() - this.holdStartTime;
		if (heldTime < this.holdThreshold) return;

		const point = this.getGroundPoint();
		if (point) {
			const distance = this.rootPart.Position.sub(point).Magnitude;
			const speedFactor = math.clamp(distance / 20, 0.1, 1);
			const dir = point.sub(this.rootPart.Position).Unit;
			const moveTarget = this.rootPart.Position.add(dir.mul(10 * speedFactor));
			this.humanoid.MoveTo(moveTarget);
		}
	}

	private setupCharacter(char: Model): void {
		this.character = char;
		this.humanoid = char.WaitForChild("Humanoid") as Humanoid;
		this.rootPart = char.WaitForChild("HumanoidRootPart") as BasePart;
	}

	private getGroundPoint(): Vector3 | undefined {
		if (!this.character) return;

		const rayParams = new RaycastParams();
		rayParams.FilterDescendantsInstances = [this.character];
		rayParams.FilterType = Enum.RaycastFilterType.Blacklist;

		const result = Workspace.Raycast(this.mouse.UnitRay.Origin, this.mouse.UnitRay.Direction.mul(1000), rayParams);
		return result?.Position;
	}

	private createRipple(position: Vector3): void {
		const splash = new Instance("Part");
		splash.Anchored = true;
		splash.CanCollide = false;
		splash.Size = new Vector3(0.5, 1, 0.5);
		splash.Shape = Enum.PartType.Cylinder;
		splash.Material = Enum.Material.Neon;
		splash.Color = Color3.fromRGB(230, 179, 102);
		splash.CFrame = CFrame.lookAt(position, position.add(Vector3.yAxis)).mul(CFrame.Angles(math.rad(90), 0, 0)); // Rotate to stand vertically
		splash.Parent = Workspace;

		const splashTweenInfo = new TweenInfo(0.3, Enum.EasingStyle.Sine, Enum.EasingDirection.Out);
		const splashTween = TweenService.Create(splash, splashTweenInfo, {
			Size: new Vector3(0.5, 3, 0.5),
			Transparency: 1,
		});
		splashTween.Play();
		splashTween.Completed.Once(() => splash.Destroy());

		const ripple = new Instance("Part");
		ripple.Anchored = true;
		ripple.CanCollide = false;
		ripple.Size = new Vector3(1, 0.05, 1);
		ripple.Shape = Enum.PartType.Cylinder;
		ripple.Material = Enum.Material.Neon;
		ripple.Color = Color3.fromRGB(230, 179, 102);
		ripple.CFrame = CFrame.lookAt(position, position.add(Vector3.xAxis)).mul(CFrame.Angles(0, 0, math.rad(90)));

		ripple.Parent = Workspace;

		const rippleTweenInfo = new TweenInfo(0.6, Enum.EasingStyle.Sine, Enum.EasingDirection.Out);
		const rippleTween = TweenService.Create(ripple, rippleTweenInfo, {
			Size: new Vector3(10, 0.05, 10),
			Transparency: 1,
		});
		rippleTween.Play();
		rippleTween.Completed.Once(() => ripple.Destroy());
	}
}
