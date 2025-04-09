import { Controller, OnRender, OnStart } from "@flamework/core";
import { Icon } from "@rbxts/topbar-plus";
import { InputMethod, MovementController } from "../MovementController";

@Controller({})
export class BarController implements OnStart {
	constructor() {}

	inputBar: Icon = new Icon();
	previousMethod: InputMethod | undefined;

	onStart() {
		this.inputBar.setImageScale(0.85);
		this.inputBar.lock();
	}

	public updateInputBar(method: InputMethod) {
		if (this.previousMethod === method) return;
		this.previousMethod = method;

		this.inputBar.setLabel(method);
		task.delay(3, () => this.inputBar.setLabel(""));

		switch (method) {
			case "Gamepad":
				this.inputBar.setImage("http://www.roblox.com/asset/?id=113106405554920");
				break;
			case "Touch":
				this.inputBar.setImage("http://www.roblox.com/asset/?id=114967236513875");
				break;
			case "Keyboard":
				this.inputBar.setImage("http://www.roblox.com/asset/?id=78505145832936");
				break;
		}
	}
}
