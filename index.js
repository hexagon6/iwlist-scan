#!/usr/bin/env node

const cp = require('child_process')
const utils = require('./utils.js')

const scan = (iface) => {
	// console.log(`scanning via iface: ${iface}`)
	retBuffer = cp.execSync(`iwlist ${iface} scan`)
	return parseIwListScan(retBuffer)
}

const parseIwListScan = (buffer) => {
	let output = { scanDate: new Date(), cells: [] }
	const input = `${buffer}` // cast to string
	const body = input.split('Scan completed :')[1]
	const cells = body.split('Cell')
	cells.shift() // get rid of head part
	// console.log(`Cells found: [${cells.length}]\n`)
	cells.forEach((cell, i) => {
		const c = utils.parseCell(cell)
		console.log(`${output.scanDate.toISOString()} [${c.Address}] ${c.ESSID.substr(1, c.ESSID.length - 2)}`)
		output.cells.push({[i]: c})
		// console.warn(`${c.ESSID}`)
	})
	return output
}

module.exports = (iface) => scan(iface)
