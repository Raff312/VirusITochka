export class MathUtils {
    public static minMax(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    public static generateRandomNumber(min: number, max: number): number {
        const ceilMin = Math.ceil(min);
        const floorMax = Math.floor(max);
        return Math.floor(Math.random() * (floorMax - ceilMin + 1)) + ceilMin;
    }
}