```javascript
/*
==================================================
PARSER SELECTION
==================================================
*/

function showParser(parser) {

    const whileParser =
        document.getElementById("whileParser");

    const arithmeticParser =
        document.getElementById("arithmeticParser");

    const whileButton =
        document.getElementById("whileButton");

    const arithmeticButton =
        document.getElementById("arithmeticButton");


    if (parser === "while") {

        whileParser.classList.remove("hidden");

        arithmeticParser.classList.add("hidden");

        whileButton.classList.add("active");

        arithmeticButton.classList.remove("active");

    }

    else {

        whileParser.classList.add("hidden");

        arithmeticParser.classList.remove("hidden");

        whileButton.classList.remove("active");

        arithmeticButton.classList.add("active");

    }

}


/*
==================================================
WHILE-LOOP LEXER
==================================================
*/

class WhileLexer {

    constructor(input) {

        this.input = input;

        this.position = 0;

        this.tokens = [];

    }


    tokenize() {

        while (this.position < this.input.length) {

            let c =
                this.input[this.position];


            /*
            Ignore spaces and tabs
            */

            if (
                c === " " ||
                c === "\t"
            ) {

                this.position++;

                continue;

            }


            /*
            Identifier / while keyword
            */

            if (/[a-zA-Z]/.test(c)) {

                let word = "";


                while (
                    this.position < this.input.length &&
                    /[a-zA-Z0-9]/.test(
                        this.input[this.position]
                    )
                ) {

                    word +=
                        this.input[this.position];

                    this.position++;

                }


                if (word === "while") {

                    this.tokens.push({
                        type: "WHILE",
                        value: word
                    });

                }

                else {

                    this.tokens.push({
                        type: "ID",
                        value: word
                    });

                }


                continue;

            }


            /*
            Number
            */

            if (/[0-9]/.test(c)) {

                let number = "";


                while (
                    this.position < this.input.length &&
                    /[0-9]/.test(
                        this.input[this.position]
                    )
                ) {

                    number +=
                        this.input[this.position];

                    this.position++;

                }


                this.tokens.push({

                    type: "NUMBER",

                    value: number

                });


                continue;

            }


            /*
            Symbols
            */

            const tokenMap = {

                "(": "LPAREN",

                ")": "RPAREN",

                "<": "LT",

                ">": "GT",

                "=": "ASSIGN",

                "+": "PLUS",

                "-": "MINUS",

                ";": "SEMICOLON"

            };


            if (tokenMap[c]) {

                this.tokens.push({

                    type: tokenMap[c],

                    value: c

                });


                this.position++;

                continue;

            }


            throw new Error(
                `Invalid character '${c}'`
            );

        }


        this.tokens.push({

            type: "EOF",

            value: "EOF"

        });


        return this.tokens;

    }

}


/*
==================================================
WHILE-LOOP PARSER
==================================================
*/

class WhileParser {

    constructor(tokens) {

        this.tokens = tokens;

        this.position = 0;

        this.trace = [];

    }


    current() {

        return this.tokens[this.position];

    }


    consume(type) {

        const token =
            this.current();


        if (token.type !== type) {

            throw new Error(
                `Expected ${type}, found ${token.type}`
            );

        }


        this.trace.push(
            `Matched ${type} → ${token.value}`
        );


        this.position++;

    }


    /*
    stmt:
          WHILE '(' expr ')' stmt
        | ID ASSIGN expr SEMICOLON
    */

    parseStmt() {

        if (
            this.current().type === "WHILE"
        ) {

            this.trace.push(
                "stmt → WHILE '(' expr ')' stmt"
            );


            this.consume("WHILE");

            this.consume("LPAREN");

            this.parseExpr();

            this.consume("RPAREN");

            this.parseStmt();

        }


        else if (
            this.current().type === "ID"
        ) {

            this.trace.push(
                "stmt → ID ASSIGN expr SEMICOLON"
            );


            this.consume("ID");

            this.consume("ASSIGN");

            this.parseExpr();

            this.consume("SEMICOLON");

        }


        else {

            throw new Error(
                `Expected WHILE or ID, found ${this.current().type}`
            );

        }

    }


    /*
    expr:
          ID LT NUMBER
        | ID GT NUMBER
        | ID PLUS NUMBER
        | ID MINUS NUMBER
    */

    parseExpr() {

        this.trace.push(
            "expr → ID (LT | GT | PLUS | MINUS) NUMBER"
        );


        this.consume("ID");


        const operator =
            this.current().type;


        if (
            operator !== "LT" &&
            operator !== "GT" &&
            operator !== "PLUS" &&
            operator !== "MINUS"
        ) {

            throw new Error(
                `Expected LT, GT, PLUS or MINUS, found ${operator}`
            );

        }


        this.consume(operator);

        this.consume("NUMBER");

    }


    parse() {

        this.parseStmt();


        if (
            this.current().type !== "EOF"
        ) {

            throw new Error(
                `Unexpected token '${this.current().value}'`
            );

        }

    }

}


/*
==================================================
WHILE-LOOP PARSE FUNCTION
==================================================
*/

function parseWhile() {

    const input =
        document.getElementById(
            "whileInput"
        ).value.trim();


    const result =
        document.getElementById(
            "whileResult"
        );


    const tokenBox =
        document.getElementById(
            "whileTokens"
        );


    const traceBox =
        document.getElementById(
            "whileTrace"
        );


    tokenBox.innerHTML = "";

    traceBox.textContent = "";


    if (!input) {

        result.textContent =
            "Please enter a while-loop.";

        result.className =
            "result invalid";

        return;

    }


    try {

        const lexer =
            new WhileLexer(input);


        const tokens =
            lexer.tokenize();


        displayTokens(
            tokens,
            tokenBox
        );


        const parser =
            new WhileParser(tokens);


        parser.parse();


        result.textContent =
            "✓ Valid while-loop";


        result.className =
            "result valid";


        displayTrace(
            parser.trace,
            traceBox
        );

    }


    catch (error) {

        result.textContent =
            "✗ Invalid while-loop\n" +
            error.message;


        result.className =
            "result invalid";


        traceBox.textContent =
            "Parsing failed.\n\n" +
            error.message;

    }

}


/*
==================================================
ARITHMETIC LEXER
==================================================
*/

class ArithmeticLexer {

    constructor(input) {

        this.input = input;

        this.position = 0;

        this.tokens = [];

    }


    tokenize() {

        while (
            this.position < this.input.length
        ) {

            let c =
                this.input[this.position];


            /*
            Ignore spaces and tabs
            */

            if (
                c === " " ||
                c === "\t"
            ) {

                this.position++;

                continue;

            }


            /*
            Number
            */

            if (/[0-9]/.test(c)) {

                let number = "";


                while (
                    this.position < this.input.length &&
                    /[0-9]/.test(
                        this.input[this.position]
                    )
                ) {

                    number +=
                        this.input[this.position];

                    this.position++;

                }


                this.tokens.push({

                    type: "NUMBER",

                    value: number

                });


                continue;

            }


            /*
            Operators and parentheses
            */

            const tokenMap = {

                "+": "PLUS",

                "-": "MINUS",

                "*": "MULTIPLY",

                "/": "DIVIDE",

                "(": "LPAREN",

                ")": "RPAREN"

            };


            if (tokenMap[c]) {

                this.tokens.push({

                    type: tokenMap[c],

                    value: c

                });


                this.position++;

                continue;

            }


            throw new Error(
                `Invalid character '${c}'`
            );

        }


        this.tokens.push({

            type: "EOF",

            value: "EOF"

        });


        return this.tokens;

    }

}


/*
==================================================
ARITHMETIC PARSER
==================================================
*/

class ArithmeticParser {

    constructor(tokens) {

        this.tokens = tokens;

        this.position = 0;

        this.trace = [];

    }


    current() {

        return this.tokens[this.position];

    }


    consume(type) {

        const token =
            this.current();


        if (token.type !== type) {

            throw new Error(
                `Expected ${type}, found ${token.type}`
            );

        }


        this.trace.push(
            `Matched ${type} → ${token.value}`
        );


        this.position++;

    }


    /*
    expression:
        expression + expression
        expression - expression
        term
    */

    parseExpression() {

        this.trace.push(
            "expression → term ((+ | -) term)*"
        );


        this.parseTerm();


        while (
            this.current().type === "PLUS" ||
            this.current().type === "MINUS"
        ) {

            const operator =
                this.current().type;


            this.consume(operator);

            this.parseTerm();

        }

    }


    /*
    Multiplication and division
    */

    parseTerm() {

        this.trace.push(
            "term → factor ((* | /) factor)*"
        );


        this.parseFactor();


        while (
            this.current().type === "MULTIPLY" ||
            this.current().type === "DIVIDE"
        ) {

            const operator =
                this.current().type;


            this.consume(operator);

            this.parseFactor();

        }

    }


    /*
    NUMBER
    '(' expression ')'
    '-' factor
    */

    parseFactor() {

        this.trace.push(
            "factor → NUMBER | '(' expression ')' | '-' factor"
        );


        /*
        NUMBER
        */

        if (
            this.current().type === "NUMBER"
        ) {

            this.consume("NUMBER");

            return;

        }


        /*
        Unary minus
        */

        if (
            this.current().type === "MINUS"
        ) {

            this.consume("MINUS");

            this.parseFactor();

            return;

        }


        /*
        Parentheses
        */

        if (
            this.current().type === "LPAREN"
        ) {

            this.consume("LPAREN");

            this.parseExpression();

            this.consume("RPAREN");

            return;

        }


        throw new Error(
            `Expected NUMBER, '-' or '(', found ${this.current().type}`
        );

    }


    parse() {

        this.parseExpression();


        if (
            this.current().type !== "EOF"
        ) {

            throw new Error(
                `Unexpected token '${this.current().value}'`
            );

        }

    }

}


/*
==================================================
ARITHMETIC PARSE FUNCTION
==================================================
*/

function parseArithmetic() {

    const input =
        document.getElementById(
            "arithmeticInput"
        ).value.trim();


    const result =
        document.getElementById(
            "arithmeticResult"
        );


    const tokenBox =
        document.getElementById(
            "arithmeticTokens"
        );


    const traceBox =
        document.getElementById(
            "arithmeticTrace"
        );


    tokenBox.innerHTML = "";

    traceBox.textContent = "";


    if (!input) {

        result.textContent =
            "Please enter an arithmetic expression.";

        result.className =
            "result invalid";

        return;

    }


    try {

        const lexer =
            new ArithmeticLexer(input);


        const tokens =
            lexer.tokenize();


        displayTokens(
            tokens,
            tokenBox
        );


        const parser =
            new ArithmeticParser(tokens);


        parser.parse();


        result.textContent =
            "✓ Valid expression";


        result.className =
            "result valid";


        displayTrace(
            parser.trace,
            traceBox
        );

    }


    catch (error) {

        result.textContent =
            "✗ Invalid expression\n" +
            error.message;


        result.className =
            "result invalid";


        traceBox.textContent =
            "Parsing failed.\n\n" +
            error.message;

    }

}


/*
==================================================
DISPLAY HELPERS
==================================================
*/

function displayTokens(
    tokens,
    container
) {

    tokens
        .filter(
            token => token.type !== "EOF"
        )
        .forEach(token => {

            const span =
                document.createElement("span");


            span.className =
                "token";


            span.textContent =
                `${token.type}: ${token.value}`;


            container.appendChild(span);

        });

}


function displayTrace(
    trace,
    container
) {

    container.textContent =
        trace
            .map(
                (item, index) =>
                    `${index + 1}. ${item}`
            )
            .join("\n");

}
```
