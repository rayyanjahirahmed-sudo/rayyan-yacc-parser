```c
%{
#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>

int yylex(void);
void yyerror(const char *s);

extern int yylineno;
%}

/*
 * Tokens used by the lexer
 */

%token WHILE
%token ID
%token NUMBER

%token LT
%token GT
%token ASSIGN
%token PLUS
%token MINUS
%token SEMICOLON

%%

/*
==================================================
STATEMENT
==================================================
*/

stmt:
      WHILE '(' expr ')' stmt
        {
            printf("Parsed: while-loop statement\n");
        }

    | ID ASSIGN expr SEMICOLON
        {
            printf("Parsed: assignment statement\n");
        }
    ;


/*
==================================================
EXPRESSION
==================================================
*/

expr:
      ID LT NUMBER
        {
            printf("Parsed expression: ID < NUMBER\n");
        }

    | ID GT NUMBER
        {
            printf("Parsed expression: ID > NUMBER\n");
        }

    | ID PLUS NUMBER
        {
            printf("Parsed expression: ID + NUMBER\n");
        }

    | ID MINUS NUMBER
        {
            printf("Parsed expression: ID - NUMBER\n");
        }
    ;

%%


/*
==================================================
LEXER
==================================================
*/

int yylex(void)
{
    int c;


    /*
     * Ignore spaces and tabs
     */

    do
    {
        c = getchar();

    } while (c == ' ' || c == '\t');


    /*
     * End of input
     */

    if (c == '\n' || c == EOF)
        return 0;


    /*
     * Identifier or keyword
     */

    if (isalpha(c))
    {
        char word[100];

        int i = 0;


        do
        {
            word[i++] = c;

            c = getchar();

        } while (isalnum(c));


        word[i] = '\0';


        /*
         * Put back the character
         * that is not part of the word
         */

        if (c != EOF)
            ungetc(c, stdin);


        /*
         * Check for while keyword
         */

        if (strcmp(word, "while") == 0)
            return WHILE;


        /*
         * Otherwise it is an identifier
         */

        return ID;
    }


    /*
     * Number
     */

    if (isdigit(c))
    {
        do
        {
            c = getchar();

        } while (isdigit(c));


        if (c != EOF)
            ungetc(c, stdin);


        return NUMBER;
    }


    /*
     * Relational operators
     */

    if (c == '<')
        return LT;


    if (c == '>')
        return GT;


    /*
     * Assignment operator
     */

    if (c == '=')
        return ASSIGN;


    /*
     * Arithmetic operators
     */

    if (c == '+')
        return PLUS;


    if (c == '-')
        return MINUS;


    /*
     * Statement terminator
     */

    if (c == ';')
        return SEMICOLON;


    /*
     * Parentheses
     *
     * These are returned directly because
     * YACC can use literal characters in
     * the grammar.
     */

    if (c == '(')
        return '(';


    if (c == ')')
        return ')';


    /*
     * Unknown character
     */

    return c;
}


/*
==================================================
ERROR HANDLER
==================================================
*/

void yyerror(const char *s)
{
    printf("Invalid while-loop\n");
}


/*
==================================================
MAIN
==================================================
*/

int main(void)
{
    printf("Enter a while-loop:\n");


    if (yyparse() == 0)
    {
        printf("Valid while-loop\n");
    }


    return 0;
}
```
