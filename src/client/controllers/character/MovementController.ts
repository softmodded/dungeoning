import { Controller, OnStart } from "@flamework/core";
import { UserInputService } from "@rbxts/services";

type InputMethod = "Keyboard" | "Touch" | "Gamepad";

@Controller()
export class MovementController implements OnStart {
	public inputDevice: InputMethod = "Keyboard";

	onStart() {
		this.detectInputMethod();
	}

	private detectInputMethod() {
		UserInputService.InputBegan.Connect((input) => {
			if (input.UserInputType === Enum.UserInputType.Keyboard) {
				this.inputDevice = "Keyboard";
			} else if (input.UserInputType === Enum.UserInputType.Touch) {
				this.inputDevice = "Touch";
			} else if (input.UserInputType === Enum.UserInputType.Gamepad1) {
				this.inputDevice = "Gamepad";
			}
		});
	}
}
