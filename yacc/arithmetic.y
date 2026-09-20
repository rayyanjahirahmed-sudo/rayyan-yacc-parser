%{
#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>

int yylex(void);
void yyerror(const char *s);
%}

%token NUMBER

%left '+' '-'
%left '*' '/'
%right UMINUS

%%

expression:
      expression '+' expression
    | expression '-' expression
    | expression '*' expression
    | expression '/' expression
    | '(' expression ')'
    | '-' expression %prec UMINUS
    | NUMBER
    ;

%%

int yylex(void)
{
    int c;

    do {
        c = getchar();
    } while (c == ' ' || c == '\t');

    if (c == '\n' || c == EOF)
        return 0;

    if (isdigit(c)) {
        yylval = 0;

        do {
            yylval = yylval * 10 + (c - '0');
            c = getchar();
        } while (isdigit(c));

        if (c != EOF)
            ungetc(c, stdin);

        return NUMBER;
    }

    return c;
}

void yyerror(const char *s)
{
    printf("Invalid expression\n");
}

int main(void)
{
    printf("Enter an arithmetic expression:\n");

    if (yyparse() == 0)
        printf("Valid expression\n");

    return 0;
}