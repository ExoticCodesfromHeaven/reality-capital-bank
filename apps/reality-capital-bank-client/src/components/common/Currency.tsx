interface Props {
  amount: number;
}

export default function Currency({ amount }: Props) {
  return (
    <>
      {new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)}
    </>
  );
}
