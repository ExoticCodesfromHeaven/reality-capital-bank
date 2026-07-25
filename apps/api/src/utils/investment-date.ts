export function maturityDate(
    months: number
) {

    const date =
        new Date();

    date.setMonth(
        date.getMonth() + months
    );

    return date;

}