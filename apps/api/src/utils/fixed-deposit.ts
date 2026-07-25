export function calculateFixedDeposit(

amount:number,

rate:number,

duration:number

){

const interest =

amount *

(rate / 100);



const maturityAmount =

amount + interest;



return {

expectedInterest:
interest,


maturityAmount,

};

}