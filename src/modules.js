
function Sigma(l, u, f)
{
	let Sum = 0;
	for(let i = l; i <= u; i++)
	{
		Sum += f(i);
	}
	return Sum;
}

function Factorial(n)
{
	if(n == 1)
		return 1;
	return n * Factorial(n-1);
}

export {Sigma, Factorial};
