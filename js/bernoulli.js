//probability sum is y
//y = sum (probability that you roll this number)
//x = num dice  (number of dice rolling)
//s = sides of dice (number of sides each die has)
function probSumY(y,x,s) {
    let tot = 0;
    for(let i  = 0; i <= (y-x)/s; i++) {
        tot += (((1) ** i) * combinations(x,i) * combinations(y-s*i-1, x-1)) / (s ** x);
        //console.log(tot);
    }
    //console.log(`${y}, ${x}, ${s} = ${tot}`);
    return tot;
}

function product_Range(a,b) {
    var prd = a,i = a;
    while(i++< b) {
        prd*=i;
    }
    return prd;
}


function combinations(n, r) {
    if(n==r || r==0){
        return 1;
    } 
    else{
        r=(r < n-r) ? n-r : r;
        return product_Range(r+1, n)/product_Range(1,n-r);
    }
}
