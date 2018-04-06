const blessed = require('blessed')
const moment = require('moment')

const Calendar = require('./Calendar.js')

let screen = blessed.screen({
	warnings: true,
	dockBorders: true
})

let cal = new Calendar(screen, 4)

let interval = async () => {
	try {
        await cal.refresh()
        updated.content = moment().format('M/D h:mma')
		screen.render()
	} catch (e) {
        updated.content = moment().format('M/D h:mma') + ' [E]'
	}
}
interval()
setInterval(interval, 3600000)

let updated = blessed.box({
	parent: screen,
	tags: true,
	bottom: 0,
	right: 1,
	width: 'shrink',
    height: 1,
    padding: {
        left: 1
    }
})

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
	return process.exit(0)
})

screen.render()
