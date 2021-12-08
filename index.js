// Module

const MAX_ITERATION = 10000

/**
 * Solves the equation f(x) = 0 using binary division method
 * @param f {Function}
 * @param eps {Number}
 * @param from {Number}
 * @param to {Number}
 * @return {{value: Number, iterations: number}}
 */
const solveBinary = (f, eps, from, to) => {

	// Iteration count is found by n >= log (b - a) / e
	const iterationCount = Math.ceil(Math.log2((to - from)/eps))

	const a = [from]
	const b = [to]
	const x = [(from + to) / 2]

	for (let n = 1; n < iterationCount; ++n) {

		const firstSection = f(a[n - 1]) * f(x[n - 1])
		if ( firstSection < 0 ) {
			a[n] = a[n-1]
			b[n] = x[n-1]
		}

		const secondSection = f(x[n - 1]) * f(b[n - 1])
		if ( secondSection < 0 ) {
			a[n] = x[n-1]
			b[n] = b[n-1]
		}

		x[n] = (a[n] + b[n]) / 2
	}

	return { value: x[x.length - 1], iterations: x.length }
}

/**
 * Solves the equation f(x) = 0 using Newton method
 * @param f {Function}
 * @param fD1 {Function} First derivative of the function by x
 * @param eps {Number}
 * @param a {Number}
 * @return {{value: Number, iterations: number}}
 */
const solveNewton = (f, fD1, eps, a) => {
	const x = [a]
	let n = 0

	while (true) {
		x[n+1] = x[n] - (f(x[n]) / fD1(x[n]))
		if (Math.abs(x[n + 1] - x[n]) < eps) { break }

		n++
	}

	return { value: x[x.length - 1], iterations: x.length }
}

/**
 * Solves the equation f(x) = 0 using modified Newton method (with numeric differentiation)
 * @param f {Function}
 * @param fD1 {Function} First derivative of the function by x
 * @param eps {Number}
 * @param a {Number}
 * @return {{value: Number, iterations: number}}
 */
const solveNewtonModified = (f, fD1, eps, a) => {
	const fDx0 = fD1(a)
	const newFD1 = () => fDx0

	return solveNewton(f, newFD1, eps, a)
}

/**
 * Solves the equation f(x) = 0 using static chord method
 * @param f {Function}
 * @param eps {Number}
 * @param a {Number}
 * @param b {Number}
 * @return {{value: Number, iterations: number}}
 */
const solveChord = (f, eps, a, b) => {
	const x = [a, b]
	let n = 1

	while (true) {
		x[n + 1] = x[n] - ( f(x[n]) / (f(x[n]) - f(x[0])) ) * ( x[n] - x[0] )
		if (Math.abs(x[n + 1] - x[n]) < eps) { break }

		n++
	}

	return { value: x[x.length - 1], iterations: x.length }
}

/**
 * Solves the equation f(x) = 0 using movable chord method
 * @param f {Function}
 * @param eps {Number}
 * @param a {Number}
 * @param b {Number}
 */
const solveMovableChord = (f, eps, a, b) => {
	const x = [a, b]
	let n = 1

	while (true) {
		x[n + 1] = x[n] - ( f(x[n]) / (f(x[n]) - f(x[n-1])) ) * ( x[n] - x[n-1] )
		if (Math.abs(x[n + 1] - x[n]) < eps) { break }

		n++
	}

	return { value: x[x.length - 1], iterations: x.length }
}

/**
 * Solves the equation f(x) = 0 using movable chord method
 * @param f {Function}
 * @param phi {Function}
 * @param eps {Number}
 * @param a {Number}
 */
const solveSimpleIteration = (f, phi, eps, a) => {
	const x = [a]
	let n = 0

	while (n < MAX_ITERATION) {
		x[n + 1] = phi(x[n])
		if (Math.abs(x[n + 1] - x[n]) < eps) { break }

		n++
	}

	return { value: x[x.length - 1], iterations: x.length }
}

// Solution

const FUNC = (x) => (Math.sin(x) + 0.2) - (2 * x * x)
const FUNC_D1 = (x) => Math.cos(x) - (4 * x) // First derivative of the function
const FUNC_PHI = (x) => x - ( FUNC(x) / FUNC_D1(x) )
const EPS = 0.0000005

const A = 0.6
const B = 0.65

const solutions = {
	'1. Метод половиного деления': solveBinary(FUNC, EPS, A, B),
	'2. Метод Ньютона': solveNewton(FUNC, FUNC_D1, EPS, B),
	'3. Модифицированный метод Ньютона': solveNewtonModified(FUNC, FUNC_D1, EPS, B),
	'4. Метод хорд': solveChord(FUNC, EPS, A, B),
	'5. Метод подвижных хорд': solveMovableChord(FUNC, EPS, A, B),
	'6. Метод простой итерации': solveSimpleIteration(FUNC, FUNC_PHI, EPS, A, B),
}

console.log('Отчет:')

console.log('')
console.log('Функция: sin(x) + 0.5 - 2x * x')
console.log(`Старт: ${A}, Конец: ${B}. Погрешность: ${EPS}`)

Object.keys(solutions).forEach(solution => {
	console.log('')
	console.log(solution)
	console.log(`Решение: ${solutions[solution].value}, Итераций: ${solutions[solution].iterations}`)
})
