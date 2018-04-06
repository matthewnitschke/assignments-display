const blessed = require('blessed')
const moment = require('moment')

module.exports = class Day {
    constructor(parent, date) {
		this.parent = parent
		this.date = date
   
        this.header = blessed.box({
            parent: parent,
            content: date.format('dddd D'),
            tags: true,
            top: -1,
            left: -1,
            width: '100%',
            height: 3,
            border: 'line'
        })

        this.assignments = blessed.box({
            parent: parent,
            tags: true,
            top: 2,
            width: '100%-2'
        })

        this.events = blessed.box({
            parent: parent,
            tags: true,
            width: '100%-2'
        })
    }

    getAssignmentContent(subjects) {
		var retText = ''
		subjects.forEach(subject => {
			var hasIncompleteAssignment = false // only render if subject has a incomplete assignment

			var subjectAssignements = ''
			subject.assignments.forEach(assignment => {
				var assignmentDate = moment(assignment.due, 'MM/DD/YYYY')
				if (this.date.isSame(assignmentDate, 'day')) {
					if (assignment.complete) {
						subjectAssignements += ` {gray-fg}${assignment.name.trim()}{/gray-fg}\n`
					} else {
						subjectAssignements += ` • ${assignment.name.trim()}\n`
						hasIncompleteAssignment = true
					}
				}
			})

			if (hasIncompleteAssignment && subjectAssignements != '') {
				retText += `{${subject.color}-fg}${
					subject.subject
				}\n${subjectAssignements}{/${subject.color}-fg}\n\n`
			}
		})
		return retText
    }
    
	getEventContent(events) {
		let retText = ''
		events.forEach(eventData => {
			if (eventData.start){
				let eventStart = eventData.start.dateTime ? eventData.start.dateTime : eventData.start.date
				if (this.date.isSame(eventStart, 'day') && (eventData.description ? eventData.description.indexOf('{{hidden}}') <= -1 : true)){
					retText += `${eventData.summary}\n`
				}
			}
		})
		return retText
	}

    recalculateEventsTop() {
        var containerHeight = this.parent.height - 2 // height of container minus the 2 constant (literally no idea why i need this)
		this.events.top = containerHeight - this.events.content.trim().split('\n').length
    }

    recalculateBorder() {
        if (moment().isSame(this.date, 'day')) {
			this.parent.style.border.fg = 'red'
			this.header.style.border.fg = 'red'
		} else {
			this.parent.style.border.fg = ''
			this.header.style.border.fg = ''
		}
    }

    refresh(assignments, events) {
        this.assignments.content = this.getAssignmentContent(assignments)
		this.events.content = this.getEventContent(events)
        
        this.recalculateEventsTop()
        this.recalculateBorder()
    }
}