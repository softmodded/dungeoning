import { Controller, OnStart } from "@flamework/core";

@Controller({})
export class BarController implements OnStart {
	onStart() {
		this.createInputBar();
	}

	private createInputBar() {}
}
