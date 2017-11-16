Usage
=====

Javascript:

`require('iwlist-scan')('<my-wlan-interface>')`

returns an object with parsed output from the command `iwlist scan my-wlan-interface`

Shell:

`./scan.sh my-wlan-interface`

outputs a line for each access point found

first argument can be omitted which defaults to 'wlp2s0' <- override with your wlan interface

Prerequisites
--------------

`iwlist` from wireless-tools (tested with debian and ubuntu linux)
