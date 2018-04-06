const blessed = require('blessed')
const contrib = require('blessed-contrib')
const moment = require('moment')

const Day = require('./Day.js')

const assignmentModel = require('./models/assignment.js')
const eventModel = require('./models/event.js')

module.exports = class Calendar {
	constructor(parent, numWeeks) {
		let grid = new contrib.grid({
			rows: numWeeks,
			cols: 7,
			screen: parent
		})

		this.days = []

		let ithDay = moment()
		ithDay.startOf('week')

		this.firstDay = ithDay.clone() // first day of the calendar
		for (var w = 0; w < numWeeks; w++) {
			for (var d = 0; d < 7; d++) {
				var dayContainer = grid.set(w, d, 1, 1, blessed.box, {
					style: { border: { fg: 'bg' } }
				})

				this.days.push(new Day(dayContainer, ithDay.clone()))
				ithDay.add(1, 'day')
			}
		}
		this.lastDay = ithDay.clone() // last day of the calendar
	}

	async refresh() {
		let assignments = await assignmentModel.get()
        let events = await eventModel.get(this.firstDay, this.lastDay)

		this.days.forEach(el => {
			el.refresh(assignments, events)
		})
	}
}
