ERROR = -1
OPENED = 0;
CLOSED = 1;
DOUBLED = 2;

function detectBracket(bracket, bracketsConfig) { 
    for(let i = 0; i < bracketsConfig.length; i++) {
        if(bracket == bracketsConfig[i][0] && bracketsConfig[i][0] == bracketsConfig[i][1]) {
            return { 'position': i, 'type': DOUBLED };
        } else if(bracket == bracketsConfig[i][0]) {
            return { 'position': i, 'type': OPENED };
        } else if(bracket == bracketsConfig[i][1]) {
            return { 'position': i, 'type': CLOSED };
        }
    }

    return { 'position': -1, 'type': ERROR }; 
}

function check(str, bracketsConfig) {
    let stack = [];

    for(let i = 0; i < str.length; i++) {
        bracket = detectBracket(str[i], bracketsConfig);

        if(bracket.type == DOUBLED) {
            if(stack.length && bracket.position == stack[stack.length - 1]) {
                stack.pop();
            } else {
                stack.push(bracket.position);
            }
        } else if(bracket.type == OPENED) {
            stack.push(bracket.position);
        } else if(bracket.type == CLOSED) {
            if(stack.length && bracket.position == stack[stack.length - 1]) {
                stack.pop();
            } else {
                return false;
            }
        }
    }

    return stack.length == 0;
}








const operations = "+-*/()";

function getToken(expressionStr) {
    let tokens = [];
    let current = "";

    for(let i = 0; i < expressionStr.length; ++i) {
        if(expressionStr[i] === " ") {
            continue;
        }
        if(operations.indexOf(expressionStr[i]) !== -1) {
            if(current.length) {
                tokens.push(current);
            }
            tokens.push(expressionStr[i]);
            current = "";
        } else {
            current += expressionStr[i];
        }
    }

    if(current.length) {
        tokens.push(current);
    }
    return tokens;
}

function eval(expression) {
    console.log(expression);
    while(expression.length !== 1) {
        //Скобки
        let stack = [];
        let write = false;
        let from, to;

        let cont = false;
        for(let i = 0; i < expression.length; ++i) {
            if(expression[i] === "(" || expression[i] === ")") {
                if(expression[i] === "(") {
                    write = true;
                    from = i;
                } else {
                    write = false;
                    to = i;
                    expression.splice(from, to - from + 1, eval(stack));
                    stack = [];
                    cont = true;
                    break;
                }
            } else if(write) {
                stack.push(expression[i]);
            }
        }

        if(cont) {
            cont = false;
            continue;
        }

        //Умножение-деление
        for(let i = 0; i < expression.length; ++i) {
            if(expression[i] === '*') {
                expression.splice(i - 1, 3, parseFloat(expression[i - 1]) * parseFloat(expression[i + 1]));
                cont = true;
                break;
            } else if(expression[i] === '/') {
                if(!parseFloat(expression[i + 1])) {
                    throw new Error("TypeError: Division by zero.");
                }
                expression.splice(i - 1, 3, parseFloat(expression[i - 1]) / parseFloat(expression[i + 1]));
                cont = true;
                break;
            }
        }

        if(cont) {
            cont = false;
            continue;
        }

        //Сложение-вычитание
        for(let i = 0; i < expression.length; ++i) {
            if(expression[i] === '+') {
                expression.splice(i - 1, 3, parseFloat(expression[i - 1]) + parseFloat(expression[i + 1]));
                cont = true;
                break;
            } else if(expression[i] === '-') {
                expression.splice(i - 1, 3, parseFloat(expression[i - 1]) - parseFloat(expression[i + 1]));
                cont = true;
                break;
            }
        }

        if(cont) {
            cont = false;
            continue;
        }
    }

    return expression;
}

function expressionCalculator(expr) {
    if(!check(expr, [['(', ')']])) {
        throw new Error("ExpressionError: Brackets must be paired");
    }

    const token = getToken(expr);
    return parseFloat(eval(token)[0]);
}

module.exports = {
    expressionCalculator
}