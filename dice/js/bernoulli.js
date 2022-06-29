//probability sum is y
//y = sum, x = num dice
function probSumY(y,x) {
    let tot = 0;
    for(let i  = 0; i <= (y-x)/6; i++) {
        tot += (Math.pow(-1, i) * combinations(x,i) * combinations(y-6*i-1, x-1)) / Math.pow(6, x);
    }
    return tot;
}

function product_Range(a,b) {
    var prd = a,i = a;
   
    while (i++< b) {
      prd*=i;
    }
    return prd;
  }
  
  
  function combinations(n, r) 
  {
    if (n==r || r==0) 
    {
      return 1;
    } 
    else 
    {
      r=(r < n-r) ? n-r : r;
      return product_Range(r+1, n)/product_Range(1,n-r);
    }
  }