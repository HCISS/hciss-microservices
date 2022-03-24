
function sumDigits(num) {
    return num ? (num % 10) + sumDigits(Math.floor(num / 10)) : 0;
  }
  
  function getDecimalPlaces(x,watchdog)
  {
      x = Math.abs(x);
      watchdog = watchdog || 20;
      var i = 0;
      while (x % 1 > 0 && i < watchdog)
      {
          i++;
          x = x*10;
      }
      return i;
  }
  
  function fibonacci(n) {
      for (var fibonacci = [0, 1], i = 1; i < n; i++) 
        fibonacci.push(fibonacci[i] + fibonacci[i - 1])
      return fibonacci
    }
  
  let d = fibonacci(1000);