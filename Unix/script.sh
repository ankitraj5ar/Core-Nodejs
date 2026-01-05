myVar=100

myfunc(){
    echo $myVar
    x=10
    y=20
    # sleep 4
    echo $(($x+$y))
    echo $1 | tr ' '  '\n'
    # sleep 5
}
myfunc "this string"