#include <stdio.h>
#include <stdlib.h>
#include <string.h>

char* formatNumber(char* input, char begin, char divider) {
  int length = strlen(input);

  // Determine the length of the formatted string:
  // [length] + [number of dividers] + [1 for begin sign] + [1 for null terminator]
  int formattedLength = length + length / 3 + 2;

  // Allocate memory for the formatted string
  char* formattedNumber = (char*)malloc(formattedLength);

  int j = 0; // index for the formatted string
  int commaCount = length % 3; // determine where the first divider should be placed

  // Add begin sign at the beginning
  formattedNumber[0] = begin;
  j = j + 1;

  // Iterate over the original string from the beginning
  for (int i = 0; i < length; i++) {
      formattedNumber[j] = input[i];
      j = j + 1;


      // Add a divider every three digits, but not after the last digit
      if (commaCount > 0 && i < length - 1 && (i + 1) % 3 == commaCount) {
          formattedNumber[j++] = divider;
      } else if (commaCount == 0 && i < length - 1 && (i + 1) % 3 == 0) {
          formattedNumber[j++] = divider;
      }
  }

  // Null-terminate the formatted string
  formattedNumber[j] = '\0';

  return formattedNumber;
}

int main (int argc, char *argv[]) {
    FILE *outputFile = fopen(argv[1], "w");
    char *number = (char *)malloc(10 * sizeof(char));
    int index = 0;
    int c = fgetc(stdin);

    // keep reading until EOF
    while(c != EOF){
        // Accumulate the digit until we completely read one number
        if(c != ' '){
            number[index] = c;
            index++;
        }
        if(c == ' '){
            if(index > 0){
                // Null-terminate the string to convert it to a number
                number[index] = '\0';
                // long num = atol(number);

                // Format the number with currency symbol and thousands separator
                char *formattedNumber = formatNumber(number, argv[2][0], argv[3][0]);
                fprintf(outputFile, " %s ", formattedNumber);
                // fflush(outputFile);
                // fprintf(outputFile, "%s%'.0f ", argv[2], (double)num);
                // fflush(outputFile);

                // resetting for next number
                free(formattedNumber);
                free(number);
                number = (char *)malloc(10 * sizeof(char));
                index = 0; 
            }
        }
       // read next character form stdin
        c = fgetc(stdin);
    }
    //close the file
    fclose(outputFile);
    return 0;
}