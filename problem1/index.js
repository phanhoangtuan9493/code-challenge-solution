// Implementation A: Using the mathematical formula n * (n + 1) / 2
var sum_to_n_formula = function(n) {
    return n * (n + 1) / 2;
};

// Implementation B: Using a for loop
var sum_to_n_loop = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// Implementation C: Using recursion
var sum_to_n_recursive = function(n) {
    if (n <= 1) {
        return n;
    }
    return n + sum_to_n_recursive(n - 1);
};

// Test examples
console.log('sum_to_n_formula(5):', sum_to_n_formula(5)); // Expected: 15
console.log('sum_to_n_loop(5):', sum_to_n_loop(5)); // Expected: 15
console.log('sum_to_n_recursive(5):', sum_to_n_recursive(5)); // Expected: 15

console.log('sum_to_n_formula(10):', sum_to_n_formula(10)); // Expected: 55
console.log('sum_to_n_loop(10):', sum_to_n_loop(10)); // Expected: 55
console.log('sum_to_n_recursive(10):', sum_to_n_recursive(10)); // Expected: 55

