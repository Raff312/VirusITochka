import { Game } from "./game";

(w => {
    const game = new Game();
    w["game"] = game;
    game.init();

    const timeoutInput = document.getElementById("timeout") as HTMLInputElement;
    timeoutInput.addEventListener("input", () => {
        window["game"].timeoutInSec = Number.parseFloat(timeoutInput.value);
    });

    const areaSizeInput = document.getElementById("area-size") as HTMLInputElement;
    areaSizeInput.addEventListener("input", () => {
        window["game"].setSize(Number.parseInt(areaSizeInput.value));
    });

    const infectionProbability = document.getElementById("infection-probability") as HTMLInputElement;
    infectionProbability.addEventListener("input", () => {
        window["game"].setInfectionProbability(Number.parseFloat(infectionProbability.value));
    });

    game.timeoutInSec = Number.parseFloat(timeoutInput.value);
    game.setSize(Number.parseInt(areaSizeInput.value));
    game.setInfectionProbability(Number.parseFloat(infectionProbability.value));
})(window);
