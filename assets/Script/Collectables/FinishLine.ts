import PopupManager from "../Manager/PopupManager";
import { ResultState } from "../UI/ResultPopup";
import { Collectable } from "./Collectable";
const {ccclass} = cc._decorator;

@ccclass
class FinishLine extends Collectable {

    collect(): void {
        console.log("Finish Line")
        PopupManager.getInstance().showResultPopup(ResultState.FirstSafariDone);
    }
}
