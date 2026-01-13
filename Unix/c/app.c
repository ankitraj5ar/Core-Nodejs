#include <stdio.h>

int add (int a,int b){
    return a+b;
}

int main(){
    int a=20;
    int b=30;
    int c = add(a,b);
    printf("%d \n",c);
    fprintf(stdout,"size of int value is: %zu bytes.\n",sizeof(int));

    return 0;
}