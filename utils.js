// e.g. Quality=...
const equal_tokens = [
	'Quality',
	'Signal level',
]

// e.g. Address:...
const colon_tokens = [
	'Address',
	'Channel',
	'Frequency',
	'Encryption key',
	'ESSID',
	'Bit Rates',
	'Mode',
	'Last beacon',
	/* 'Extra',
	'IE', */
]

const bitRateUnit = ' Mb/s'

const bitRateLine = (line) => {
	return line.split(';').map(br => br.trim().split(bitRateUnit)[0])
}

const maxRate = (rates) => {
	const maxRate = rates.map(rate => parseInt(rate, 10)).reduce((b, c) => Math.max(b, c))
	return { maxRate, unit: bitRateUnit.trim() }
}

const consolidate = (input) => {
	const rates = input['Bit Rates']
	const maxBitRate = maxRate(rates)
	return { ...input, maxBitRate }
}

module.exports.parseCell = (cell) => {
	let output = {}
	// console.log(cell)
	const lines = cell.split('\n')
	// strip cell identifier (number) from first line
	const firstLine = lines[0].split(' - ')[1]
	lines[0] = firstLine
	let bitrateLine = false
	lines.forEach((line) => {
		// bitrate 2nd line
		if (bitrateLine) {
			const bitrates = output['Bit Rates']
			const bitrates2 = bitRateLine(line)
			output['Bit Rates'] = [...bitrates, ...bitrates2]
			bitrateLine = false 
		}
		const str = line.trim()
		const [ key, ...values ] = str.split(':')
		// console.log(values)
		const [ _key, _ ] = str.split('=')
		// console.log(values)
		if (colon_tokens.includes(key)) {
			// console.log(`matching: ${key}`)
			if (key === 'Address') {
				const address = values.join(':').trim()
				output[key] = address
			} else if (key === 'Channel' || key === 'Encryption key' || key === 'ESSID' || key === 'Mode' ) {
				output[key] = values[0]
			} else if (key === 'Bit Rates') {
				const rates = bitRateLine(values[0])
				output[key] = rates
				bitrateLine = true
			}
		} else if (equal_tokens.includes(_key)) {
			// console.log(`matching= ${_key}`)
		}

	})
	return consolidate(output)
}
