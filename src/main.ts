import { Game } from "./game";

const timeoutInput = document.getElementById("timeout") as HTMLInputElement;
timeoutInput.addEventListener("input", () => {
    window["game"].timeoutInSec = parseFloat(timeoutInput.value);
});

const areaSizeInput = document.getElementById("area-size") as HTMLInputElement;
areaSizeInput.value = window["game"]?.getSize();
areaSizeInput.addEventListener("input", () => {
    window["game"].setSize(parseInt(areaSizeInput.value));
});

(w => {
    const game = new Game();
    w["game"] = game;
    game.init();
})(window);
