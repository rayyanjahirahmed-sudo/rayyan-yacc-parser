%{
#include <stdio.h>
#include <stdlib.h>
#include <ctype.h>
#include <string.h>

int yylex(void);
void yyerror(const char *s);
%}

%token WHILE ID NUMBER
%token LT GT ASSIGN PLUS MINUS SEMICOLON

%%

stmt:
      WHILE '(' expr ')' stmt
    | ID ASSIGN expr SEMICOLON
    ;

expr:
      ID LT NUMBER
    | ID GT NUMBER
    | ID PLUS NUMBER
    | ID MINUS NUMBER
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

    if (isalpha(c)) {
        char word[20];
        int i = 0;

        do {
            word[i++] = c;
            c = getchar();
        } while (isalnum(c));

        word[i] = '\0';

        if (c != EOF)
            ungetc(c, stdin);

        if (strcmp(word, "while") == 0)
            return WHILE;

        return ID;
    }

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

    if (c == '<')
        return LT;

    if (c == '>')
        return GT;

    if (c == '=')
        return ASSIGN;

    if (c == '+')
        return PLUS;

    if (c == '-')
        return MINUS;

    if (c == ';')
        return SEMICOLON;

    return c;
}

void yyerror(const char *s)
{
    printf("Invalid while-loop\n");
}

int main(void)
{
    printf("Enter a while-loop:\n");

    if (yyparse() == 0)
        printf("Valid while-loop\n");

    return 0;
}
