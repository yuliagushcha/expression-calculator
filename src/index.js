function eval() {
    return;
}

function expressionCalculator(expr) {
    expression = expr.split(' ').join('');
    const numbersString = split(expression, '+');

    const numbers = numbersString.map(noStr => parseMinusSeparatedExpression(noStr));
    const initialValue = 0.0;
    const result = numbers.reduce((acc, no) => acc + no, initialValue);
    return result;
}

const split = (expression, operator) => {
    const result = [];
    let braces = 0;
    let currentChunk = "";
    for (let i = 0; i < expression.length; ++i) {
        const curCh = expression[i];
        if (curCh == '(') {
            braces++;
        } else if (curCh == ')') {
            braces--;
        }
        if (braces == 0 && operator == curCh) {
            result.push(currentChunk);
            currentChunk = "";
        } else currentChunk += curCh;
    }
    if (currentChunk != "") {
        result.push(currentChunk);
    }
    if (braces !== 0) {
        throw new Error('ExpressionError: Brackets must be paired');
    }
    return result;
};

const parseDivisionSeparatedExpression = (expression) => {
    const numbersString = split(expression, '/');
    const numbers = numbersString.map(noStr => {
        //case when one pair of brackets
        if ( noStr[0] == '(' ) {
            if (noStr.indexOf(')') == noStr.length-1) {
                const expr = noStr.substr(1, noStr.length - 2);
                // recursive call to the main function
                return expressionCalculator(expr);
            }
            
        //case, when many pairs of brackets
            let brackets = 0;
            for (let i = 0; i < noStr.length; i++) {
                if (noStr[i] == '(') brackets++;
                if (noStr[i] == ')') {
                    brackets--;
                    if (brackets == 0) {
                        const expr = noStr.substr(1, noStr.length - 2);
                        return expressionCalculator(expr);
                    }
                }
            }
        }   
        return +noStr;
    });

    const initialValue = numbers[0];
    const result = numbers.slice(1).reduce((acc, no) => { 
        if (no == 0) {
            throw new Error('TypeError: Division by zero.');
        }
        return acc / no;
    }, initialValue);

    return result;
};

const parseMultiplicationSeparatedExpression = (expression) => {
    const numbersString = split(expression, '*');

    const numbers = numbersString.map(noStr => {
        if (noStr[0] == '(' && noStr.indexOf(')') == noStr.length-1) {
            const expr = noStr.substr(1, noStr.length - 2);
            // recursive call to the main function            
            return expressionCalculator(expr);
        }
        return parseDivisionSeparatedExpression(noStr);
    });

    const initialValue = 1.0;
    const result = numbers.reduce((acc, no) => acc * no, initialValue);
    
    return result;
};

function parseMinusSeparatedExpression (expression) {
    const numbersString = split(expression, '-');
	const numbers = numbersString.map(noStr => parseMultiplicationSeparatedExpression(noStr) );
	const initialValue = numbers[0];
    const result = numbers.slice(1).reduce((acc, no) => acc - no, initialValue);
	return result;
};

module.exports = {
    expressionCalculator
}