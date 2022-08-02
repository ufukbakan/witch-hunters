import rwr from "../assets/red_witch.png";
import rwl from "../assets/red_witch_left.png";

export const assets = [
    rwr,
    rwl
]

export default async function () {
    for (let asset of assets) {
        let img = new Image();
        img.src = asset;
        img.classList.add("asset");
        document.body.appendChild(img);
    }
}