#!/usr/bin/env node

const arg = process.argv[2]
const iface = (!arg) ? 'wlp2s0' : arg // use your local wlan interface
require('./index')(iface)
