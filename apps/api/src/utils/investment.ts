export function calculateInvestment(

    amount: number,

    rate: number

) {

    const profit =
        amount * (rate / 100);

    return {

        expectedReturn: profit,

        totalAtMaturity:
            amount + profit,

    };

}