import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const keySet = [
  [{ id: "clear", val: "AC" }, { id: "equals", val: "=" }],
  [
    { id: "nine", val: "9" },
    { id: "eight", val: "8" },
    { id: "seven", val: "7" },
    { id: "six", val: "6" },
    { id: "five", val: "5" },
    { id: "four", val: "4" },
    { id: "three", val: "3" },
    { id: "two", val: "2" },
    { id: "one", val: "1" },
    { id: "decimal", val: "." },
    { id: "zero", val: "0" }
  ],
  [
    { id: "add", val: "+" },
    { id: "subtract", val: "-" },
    { id: "multiply", val: "x" },
    { id: "divide", val: "/" }
  ]
];

const isOperator = /[x/+-]/;
const isOperand = /[\d]+|[.]/;

const calc = exprsn => {
  let result = exprsn.split(",");
  result.forEach((x, i) => {
    if (x === "/") {
      let negVal = result[i + 1] === "-" ? true : false;
      let a = parseFloat(result[i - 1]);
      let b = parseFloat(negVal ? result[i + 2] * -1 : result[i + 1]);

      result.splice(i - 1, 3 + (negVal ? 1 : 0), a / b);
      i = i - (negVal ? 2 : 1);
    }
  });
  result.forEach((x, i) => {
    if (x === "x") {
      let negVal = result[i + 1] === "-" ? true : false;
      let a = parseFloat(result[i - 1]);
      let b = parseFloat(negVal ? result[i + 2] * -1 : result[i + 1]);
      console.log(a, b);
      result.splice(i - 1, 3 + (negVal ? 1 : 0), a * b);
      i = i - (negVal ? 2 : 1);
    }
  });
  for (let i = 0; i < result.length; ++i) {
    if (result[i] === "+") {
      let a = parseFloat(result[i - 1]);
      let b = parseFloat(result[i + 1]);
      result.splice(i - 1, 3, a + b);
      i--;
    }
    if (result[i] === "-") {
      let a = parseFloat(result[i - 1]);
      let b = parseFloat(result[i + 1]);
      result.splice(i - 1, 3, a - b);
      i--;
    }
  }
  return (1000000000000 * result) / 1000000000000;
};
const Button = props => {
  return (
    <div id={props.id} className="key" onClick={props.onClick}>
      {props.val}
    </div>
  );
};
class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      output: "",
      evalStatus: false
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleAction = this.handleAction.bind(this);
  }
  handleClick(val) {
    //
    if (keySet[0].find(x => x.val === val) !== undefined) {
      //if actionkey is pressed
      this.handleAction(val);
    } else if (isOperand.test(val)) {
      //if operandkey is pressed
      this.setState(prevState => {
        let input, output;
        input = prevState.evalStatus ? "" : prevState.input;
        output = prevState.evalStatus ? "" : prevState.output;

        if (isOperator.test(prevState.input)) {
          input = "";
          output = output + ",";
        }
        switch (val) {
          case "0":
            input = input != "0" ? input + val : input;
            output = prevState.input != "0" ? output + val : output;
            break;
          case ".":
            output = /[.]/.test(prevState.input)
              ? output
              : input != ""
              ? output + "."
              : output + "0.";
            input = !/[.]/.test(input)
              ? input != ""
                ? input + "."
                : input + "0."
              : input;

            break;
          default:
            input = input != "0" ? input + val : val;
            output = output + val;
            break;
        }

        return {
          input: input,
          output: output,
          evalStatus: false
        };
      });
    } else {
      //if operatorkey is pressed
      this.setState(prevState => {
        let output = prevState.evalStatus
          ? prevState.output.split("=").slice(1)
          : prevState.output;

        if (val == "-") {
          if (prevState.input == "-") {
            /*do nothing*/
          } else {
            output = output + "," + val;
          }
        } else {
          if (isOperator.test(prevState.input)) {
            if (isOperator.test(output[output.length - 3]))
              output = output.substr(0, output.length - 4);
            else {
              output = output.substr(0, output.length - 2);
            }
            output = output + "," + val;
          } else {
            output = output + "," + val;
          }
        }

        return {
          input: val,
          output: output,
          evalStatus: false
        };
      });
    }
  }

  handleAction(val) {
    if (val === "AC") this.setState({ input: 0, output: "" });
    else {
      this.setState(prevState => {
        let result = prevState.evalStatus ? "" : calc(prevState.output);
        return {
          input: result,
          output:
            result != "" ? prevState.output + "=" + result : prevState.output,
          evalStatus: result != "" ? true : prevState.evalStatus
        };
      });
    }
  }
  render() {
    return (
      <div id="calculator">
        <div id="display-block">
          <div id="output">{this.state.output.split(",")}</div>
          <div id="display">{this.state.input}</div>
        </div>

        <div id="actionkeys">
          {keySet[0].map(x => (
            <Button
              id={x.id}
              val={x.val}
              onClick={() => this.handleClick(x.val)}
            />
          ))}
        </div>
        <div id="operandkeys">
          {keySet[1].map(x => (
            <Button
              id={x.id}
              val={x.val}
              onClick={() => this.handleClick(x.val)}
            />
          ))}
        </div>
        <div id="operatorkeys">
          {keySet[2].map(x => (
            <Button
              id={x.id}
              val={x.val}
              onClick={() => this.handleClick(x.val)}
            />
          ))}
        </div>
        <div id="footer">© elizabeth vincent m</div>
      </div>
    );
  }
}

ReactDOM.render(<Calculator />, document.getElementById("root"));
