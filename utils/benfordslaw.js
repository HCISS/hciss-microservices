export default function Benford(data = []) {
  const benfordProbabilities = {
    1: 0.301,
    2: 0.176,
    3: 0.125,
    4: 0.097,
    5: 0.079,
    6: 0.067,
    7: 0.058,
    8: 0.051,
    9: 0.046,
  };
  const initialDigits = {
    1: { count: 0 },
    2: { count: 0 },
    3: { count: 0 },
    4: { count: 0 },
    5: { count: 0 },
    6: { count: 0 },
    7: { count: 0 },
    8: { count: 0 },
    9: { count: 0 },
  };
  function presentDataWithPadding(value, padding = 20) {
    return `${(value * 100).toFixed(1)}%`.padStart(padding, " ");
  }

  const sanitized = data.filter((e) => e > 0);
  this.sanitizedInput = {
    data: sanitized,
    size: sanitized.length,
  };

  this.digits = sanitized.reduce((acc, number) => {
    const digit = +`${number}`.charAt(0);
    const count = acc[digit].count + 1;
    const percentage = count / sanitized.length;
    const deviation = percentage - benfordProbabilities[digit];

    acc[digit] = { count, percentage, deviation };

    return acc;
  }, initialDigits);

  this.computed = ()=>{
    //console.log(this.digits);
    //this.printAsTable();
    return this.digits;
  };
  

  this.printAsTable = () => {
    const header =
      " DIGIT │ DIGIT OCCURRENCES (%) │ BENFORD PROBABILITIES (%) │ DEVIATION ";
    const divider =
      "───────┼───────────────────────┼───────────────────────────┼───────────";
    const body = Object.entries(this.digits).reduce(
      (acc, [digit, { percentage, deviation }]) => {
        return (
          acc +
          `${digit}`.padStart(6, " ") +
          " │ " +
          presentDataWithPadding(percentage, 21) +
          " │ " +
          presentDataWithPadding(benfordProbabilities[digit], 25) +
          " │ " +
          presentDataWithPadding(deviation, 9) +
          "\n"
        );
      },
      ""
    );

    const table = [header, divider, body];

    console.log(table.join("\n"));
  };
}
