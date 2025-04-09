import { Controller, OnStart } from "@flamework/core";
import { UserInputService } from "@rbxts/services";
import { BarController } from "./interface/BarController";

export type InputMethod = "Keyboard" | "Touch" | "Gamepad";

@Controller()
export class MovementController implements OnStart {
	public inputDevice: InputMethod = "Keyboard";

	constructor(private barController: BarController) {}

	onStart() {
		this.detectInputMethod();
		this.barController.updateInputBar(this.inputDevice);
	}

	private detectInputMethod() {
		UserInputService.InputBegan.Connect((input) => {
			if (input.UserInputType === Enum.UserInputType.Touch) {
				this.inputDevice = "Touch";
			} else if (input.UserInputType === Enum.UserInputType.Gamepad1) {
				this.inputDevice = "Gamepad";
			} else if (
				input.UserInputType === Enum.UserInputType.MouseButton1 ||
				input.UserInputType === Enum.UserInputType.MouseMovement ||
				input.UserInputType === Enum.UserInputType.Keyboard
			) {
				this.inputDevice = "Keyboard";
			}

			this.barController.updateInputBar(this.inputDevice);
		});
	}
}
