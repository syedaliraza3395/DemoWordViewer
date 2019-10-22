export class Utility {
    static roundAndAbs(num) {
        return Math.abs(Math.round(num * 100) / 100);
    }
}