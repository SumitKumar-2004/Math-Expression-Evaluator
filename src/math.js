import { all, create, evaluate as mathEvaluate, parse } from "mathjs";

const math = create(all, { number: "number", precision: 14 });
const allowedFunctions = new Set([
  "sqrt", "abs", "sin", "cos", "tan", "asin", "acos", "atan",
  "log", "log10", "ln", "round", "floor", "ceil", "min", "max",
  "pow", "exp", "cbrt"
]);
const allowedSymbols = new Set(["pi", "e", "ans", "x"]);
const blockedNodes = new Set(["AssignmentNode", "FunctionAssignmentNode", "AccessorNode", "IndexNode", "ObjectNode", "ArrayNode", "BlockNode", "ConditionalNode"]);

export function evaluateSafe(expression, { degrees = false, ans, x } = {}) {
  const source = String(expression ?? "").trim();
  if (!source) throw new Error("Enter a mathematical expression first.");
  if (source.length > 250) throw new Error("Expression is too long (maximum 250 characters).");
  let node;
  try {
    node = parse(source);
  } catch {
    throw new Error("Check the expression syntax and parentheses.");
  }
  node.traverse((child) => {
    if (blockedNodes.has(child.type)) throw new Error("That kind of expression is not supported.");
    if (child.isFunctionAssignmentNode || child.isAssignmentNode || child.isAccessorNode) throw new Error("Assignments and property access are not supported.");
    if (child.isSymbolNode && !allowedSymbols.has(child.name) && !allowedFunctions.has(child.name)) {
      throw new Error(`Unknown name: "${child.name}".`);
    }
    if (child.isFunctionNode) {
      const name = child.fn?.name;
      if (!allowedFunctions.has(name)) throw new Error(`Function "${name || "unknown"}" is not supported.`);
    }
  });
  const scope = { pi: Math.PI, e: Math.E };
  if (Number.isFinite(ans)) scope.ans = ans;
  if (Number.isFinite(x)) scope.x = x;
  const safeFunctions = {
    sqrt: Math.sqrt, abs: Math.abs,
    sin: n => Math.sin(degrees ? n * Math.PI / 180 : n),
    cos: n => Math.cos(degrees ? n * Math.PI / 180 : n),
    tan: n => Math.tan(degrees ? n * Math.PI / 180 : n),
    asin: n => degrees ? Math.asin(n) * 180 / Math.PI : Math.asin(n),
    acos: n => degrees ? Math.acos(n) * 180 / Math.PI : Math.acos(n),
    atan: n => degrees ? Math.atan(n) * 180 / Math.PI : Math.atan(n),
    log: Math.log10, log10: Math.log10, ln: Math.log,
    round: Math.round, floor: Math.floor, ceil: Math.ceil,
    min: Math.min, max: Math.max, pow: Math.pow, exp: Math.exp, cbrt: Math.cbrt
  };
  Object.assign(scope, safeFunctions);
  let result;
  try {
    result = node.compile().evaluate(scope);
  } catch (error) {
    if (error instanceof Error && /division by zero|divide by zero/i.test(error.message)) throw new Error("Division by zero is not allowed.");
    throw new Error("This expression cannot be evaluated. Check the values and function arguments.");
  }
  if (typeof result !== "number" || !Number.isFinite(result)) throw new Error("The result is not a finite real number.");
  if (Math.abs(result) < 1e-12) result = 0;
  return result;
}

export function formatNumber(value) {
  if (!Number.isFinite(value)) return String(value);
  return String(Number(value.toPrecision(12)));
}

export function getSteps(expression, options = {}) {
  const source = expression.trim();
  const match = source.match(/^(-?\d+(?:\.\d+)?)\s*([*/])\s*(-?\d+(?:\.\d+)?)$/);
  if (match) {
    const a = Number(match[1]), b = Number(match[3]);
    const result = match[2] === "*" ? a * b : a / b;
    return [
      { title: "Identify the operation", detail: `${match[1]} ${match[2]} ${match[3]} uses ${match[2] === "*" ? "multiplication" : "division"}.` },
      { title: "Calculate", detail: `${match[1]} ${match[2]} ${match[3]} = ${formatNumber(result)}` },
      { title: "Final answer", detail: formatNumber(result) }
    ];
  }
  const simple = source.match(/^(-?\d+(?:\.\d+)?)\s*([+-])\s*(-?\d+(?:\.\d+)?)$/);
  if (simple) {
    const a = Number(simple[1]), b = Number(simple[3]);
    const result = simple[2] === "+" ? a + b : a - b;
    return [
      { title: "Identify the operation", detail: `${simple[1]} ${simple[2]} ${simple[3]} uses ${simple[2] === "+" ? "addition" : "subtraction"}.` },
      { title: "Calculate", detail: `${simple[1]} ${simple[2]} ${simple[3]} = ${formatNumber(result)}` },
      { title: "Final answer", detail: formatNumber(result) }
    ];
  }
  const precedence = source.includes("(") || source.includes(")") || /[*/%^]/.test(source);
  const result = evaluateSafe(source, options);
  if (precedence) {
    return [
      { title: "Read the expression", detail: "Identify parentheses and the operators used." },
      { title: "Apply operator precedence", detail: "Evaluate parentheses first, then powers, multiplication/division, and addition/subtraction." },
      { title: "Final answer", detail: `${source} = ${formatNumber(result)}. The parser evaluates the expression using standard mathematical precedence.` }
    ];
  }
  return [
    { title: "Read the expression", detail: "Identify the numbers, constants, and supported functions." },
    { title: "Evaluate", detail: "Apply the selected mathematical function or operation." },
    { title: "Final answer", detail: `${source} = ${formatNumber(result)}` }
  ];
}
