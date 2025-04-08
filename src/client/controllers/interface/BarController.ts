import { Controller, OnStart } from "@flamework/core";
import { Icon } from "@rbxts/topbar-plus";

@Controller({})
export class BarController implements OnStart {
	onStart() {
		this.createInputBar();
	}

	private createInputBar() {
		const inputNotifier = new Icon();
	}
}
