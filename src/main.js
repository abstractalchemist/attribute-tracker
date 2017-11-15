import React from 'react'
import { Menu, Card, Checkbox, Nav, Drawer, mergeHistories } from './utils'

function AttributeUpdate({attribute,add,remove,end_of_opponents_turn,eoot_value,on_opponents_turn,oot_value,continous,c_value,addopts,removeopts}) {
    return (<tr>
	    <td>
	    {attribute}
	    </td>
	    <td>
	    <button className="mdl-button mdl-js-button mdl-button--icon" onClick={
		evt => {
		    if(add)
			add()
		}
	    } onContextMenu={
		e => {
		    if(addopts) {
			document.querySelector(`#${attribute}-menu`).dispatchEvent(new MouseEvent('click'))
			e.preventDefault()
		    }
		}
	    }>
	    <i className="material-icons">add</i>

	    </button>
	    {( _ => {
		if(addopts) {
		    let menuopts = addopts.map( val => {
			return {
			    option:val,
			    click: _ => {
				add(val)
			    }
			}
		    })
		    return (<Menu id={`${attribute}-menu`} opts={menuopts} contextmenu={true}/>)

		}
	    })()}
	    </td>
	    <td>
	    <button className="mdl-button mdl-js-button mdl-button--icon" onClick={
		evt => {
		    if(remove)
			remove()
		}
	    }>
	    <i className="material-icons">remove</i>
	    </button>
	    </td>
	    <td>
	    <Menu id={`applied-effects-${attribute}`} display={
		(_ => {
		    if(eoot_value)
			return "End Of Opponents Turn"
		    if(oot_value)
			return "On Opponents Turn"
		    if(c_value)
			return "Continous"
		    return "None"
		})()
	    }
	    opts={[
		{
		    option:"End Of Opponents Turn",
		    click: _ => { end_of_opponents_turn({ currentTarget: { checked: !eoot_value }}) }
		},
		{
		    option:"On Opponents Turn",
		    click:_ => { on_opponents_turn({ currentTarget: { checked: !oot_value } }) }
		},
		{
		    option:"Continous",
		    click:_ => { continous({ currentTarget: { checked: !c_value } }) }
		}
	    ]} />
	    </td>
	    </tr>)
}

function History({history}) {
    return (<table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
	    <thead>
	    <tr>
	    <th>Turn</th>
	    <th>Effect</th>
	    <th>Attribute</th>
	    <th>Value</th>
	    </tr>
	    </thead>
	    <tbody>
	    {(_ => {
		if(history) {
		    return history.map( ({val, onturn, attribute, desc}, i) => {
			return (<tr key={`history-table-${i}`}>
				<td>{onturn}</td>
				<td>{desc}</td>
				<td>{attribute}</td>
				<td>{val}</td>
				</tr>)
		    })
		}
	    })()
	    }
	    </tbody>
	    </table>)
	    
}

class Main extends React.Component {
    constructor(props) {
	super(props)
	this.power = 500;
	this.soul = 1;
	this.level = 1;
	this.state = { opponent_back_left:{power:0,level:0,soul:0,history:{}},
		       opponent_back_right:{power:0,level:0,soul:0,history:{}},
		       opponent_center_left:{power:0,level:0,soul:0,history:{}},
		       opponent_center_middle:{power:0,level:0,soul:0,history:{}},
		       opponent_center_right:{power:0,level:0,soul:0,history:{}},
		       player_back_left:{power:0,level:0,soul:0,history:{}},
		       player_back_right:{power:0,level:0,soul:0,history:{}},
		       player_center_left:{power:0,level:0,soul:0,history:{}},
		       player_center_middle:{power:0,level:0,soul:0,history:{}},
		       player_center_right:{power:0,level:0,soul:0,history:{}},
		       power : { end_of_opponents_turn: false, on_opponents_turn: false, continous: false, val:0 },
		       soul : { end_of_opponents_turn: false, on_opponents_turn: false, continous: false, val:0 },
		       level : { end_of_opponents_turn: false, on_opponents_turn: false, continous: false, val:0 },
		       
		       turn:0 }
    }

    

    checkedOn(attribute, field) {
	return evt => {
	    let obj = this.state;
	    obj[attribute][field] = evt.currentTarget.checked
	    this.setState(obj)
	}
    }

    // 
    
    
    applystats(attribute, operation) {
	let updateVal = this.state[attribute].val

	return _ => {
//	    console.log(`updating ${this.state.cardpos}`)
	    let obj = this.state
//	    console.log(`pos ${typeof this.state.cardpos}`)
	    let end_of_opponents_turn = obj[attribute]['end_of_opponents_turn']
	    let on_opponents_turn = obj[attribute]['on_opponents_turn']
	    let continous = obj[attribute]['continous']
	    let collected_history = []
	    
	    let pos = this.state.cardpos
	    if(Array.isArray(pos)) {
		pos.forEach( i => {
		    if(obj[i]['history'][attribute]) {
			obj[i]['history'][attribute].push(collected_history)
		    }
		    else {
			obj[i]['history'][attribute] = [collected_history]
		    }
		})
	    }
	    else {
		if(obj[pos]['history'][attribute]) {
		    obj[pos]['history'][attribute].push(collected_history)
		}
		else {
		    obj[pos]['history'][attribute] = [collected_history]
		}
	    }

	    const calculator = func => {
		return addit => {
		    let val = func
		    if(typeof func === 'function')
			val = func()
		    if(addit)
			return operation(val, updateVal)
		    return val
		}
	    }
		
	    const makeCalculatingFunction = (turn, on_opponents_turn, end_of_opponents_turn, continous, calc) => {
		let eventurn = turn % 2 === 0
		let oddturn = turn % 2 === 1
 		return clear => {
		    if(clear) {
			if(Array.isArray(pos)) {
			    pos.forEach(i => {
				obj[i]['history'][attribute].forEach(j => {
				    while(j.length > 0) j.pop()
				})
			    })
			}
			else
			    obj[pos]['history'][attribute].forEach(j => {
				while(j.length > 0) j.pop()
			    })

			    
		    }
		    let end_of_turn = (turn === this.state.turn && !on_opponents_turn)
		    let end_of_opponents_next_turn = (end_of_opponents_turn &&  turn + 1 === this.state.turn)
		    let only_opponents_turn = on_opponents_turn &&
 			((eventurn && (this.state.turn % 2 === 1)) ||
			 oddturn && (this.state.turn % 2 === 0))
		    if(end_of_turn || end_of_opponents_next_turn || only_opponents_turn || continous) {
			collected_history.push(
			    {
				val:updateVal,
				onturn:turn,
				attribute,
				desc: (_ => {
				    if(end_of_turn) 
					return "end of turn"
				    else if(end_of_opponents_next_turn)
					return "end of opponent's next turn"
				    else if(only_opponents_turn)
					return "on opponents_turn"
				    else if(continous)
					return "continous"
				    return ""
				})()
			    })
			return calc(true)
			
		    }
		    
		    return calc()
		}
	    }
	    
 	    if(Array.isArray(this.state.cardpos)) {
		this.state.cardpos.forEach(i => {
		    const calc = calculator(obj[i][attribute])
		    obj[i][attribute] = makeCalculatingFunction(this.state.turn, on_opponents_turn, end_of_opponents_turn, continous, calc)
		})
	    }
	    else {
		const calc = calculator(obj[this.state.cardpos][attribute])
		
		obj[this.state.cardpos][attribute] = makeCalculatingFunction(this.state.turn, on_opponents_turn, end_of_opponents_turn, continous, calc)
	    }
	    this.setState(obj)	    

	}
    }


    updatestats(cardpos) {
	return evt => {
	    this.setState({cardpos})
	    document.querySelector('#updater-dialog').showModal();
	}
    }

    reset() {
	this.resetcurrent();
	this.resetopponent();
	this.setState({turn:0})
    }

    resetcurrent() {
	this.setState({player_back_left:{power:0,level:0,soul:0},player_back_right:{power:0,level:0,soul:0},player_center_left:{power:0,level:0,soul:0},player_center_middle:{power:0,level:0,soul:0},player_center_right:{power:0,level:0,soul:0}})
	
    }

    resetopponent() {
	this.setState({opponent_back_left:{power:0,level:0,soul:0},opponent_back_right:{power:0,level:0,soul:0},opponent_center_left:{power:0,level:0,soul:0},opponent_center_middle:{power:0,level:0,soul:0},opponent_center_right:{power:0,level:0,soul:0}})

    }

    resetPos() {
	let resetIt = attribute => {
	    console.log(`updating ${this.state.cardpos}`)
	    let obj = this.state
 	    if(Array.isArray(this.state.cardpos)) {
		this.state.cardpos.forEach(i => {
		    obj[i][attribute] = 0
		})
		
	    }
	    else {
		obj[this.state.cardpos][attribute] = 0
	    }
	    this.setState(obj)
	    
	}
	resetIt('power')
	resetIt('soul')
	resetIt('level')
	this.setState({ power : { end_of_opponents_turn: false, on_opponents_turn: false, continous:false, val:0 },
			soul : { end_of_opponents_turn: false, on_opponents_turn: false, continous:false, val:0  },
			level : { end_of_opponents_turn: false, on_opponents_turn: false, continous:false, val:0 } })
	
	document.querySelector('#updater-dialog').close()
    }
    
    render() {
	
	return (<div className="mdl-layout mdl-js-layout">
		<Nav title={this.props.title}/>
		<Drawer title={this.props.title}/>
		<main className="mdl-layout__content">
		<div className="mdl-grid">
		<div className="mdl-cell mdl-cell--12-col">
		<button className="mdl-button mdl-js-button mdl-button--raised" onClick={
		    _ => {
			this.setState({turn:this.state.turn + 1})
		    }}>
		Turn {this.state.turn}
		</button>
		</div>
		<div className="mdl-cell mdl-cell--12-col">
		<button className="mdl-button mdl-js-button mdl-button--raised" onClick={this.resetopponent.bind(this)}>
		Reset
		</button>
		<button className="mdl-button mdl-js-button mdl-button--raised">
		Update Selected
		</button>
		<button className="mdl-button mdl-js-button mdl-button--raised" onClick={this.updatestats(['opponent_back_left','opponent_back_right'])}>
		Update Back
		</button>
		<button className="mdl-button mdl-js-button mdl-button--raised" onClick={this.updatestats(['opponent_center_left','opponent_center_middle','opponent_center_right'])}>
		Update Center
		</button>
		<button className="mdl-button mdl-js-button mdl-button--raised" onClick={this.updatestats(['opponent_back_left','opponent_back_right','opponent_center_left','opponent_center_middle','opponent_center_right'])}>
		Update All
		</button>
		</div>
		<div className="mdl-cell mdl-cell--4-col" />
		<Card pos="1" {...this.state.opponent_back_left} updatestats={this.updatestats(['opponent_back_left'])}
		contextmenu={[
		    {
			option:"History",
			click:evt => {
			    if(this.state.opponent_back_left.history) {
				this.setState({display_history:mergeHistories(this.state.opponent_back_left.history)})
			
			    }
			    document.querySelector('#history-display').showModal();
			}
		    }
		]}/>
		<Card pos="2" {...this.state.opponent_back_right} updatestats={this.updatestats(['opponent_back_right'])}/>
		<div className="mdl-cell mdl-cell--4-col" />
		<div className="mdl-cell mdl-cell--3-col" />
		<Card pos="3" {...this.state.opponent_center_left} updatestats={this.updatestats(['opponent_center_left'])}/>
		<Card pos="4" {...this.state.opponent_center_middle} updatestats={this.updatestats(['opponent_center_middle'])}/>
		<Card pos="5" {...this.state.opponent_center_right} updatestats={this.updatestats(['opponent_center_right'])}/>
		<div className="mdl-cell mdl-cell--3-col" />
		
		<div className="mdl-cell mdl-cell--3-col" />
		<Card pos="6" {...this.state.player_center_left} updatestats={this.updatestats(['player_center_left'])}/>
		<Card pos="7" {...this.state.player_center_middle} updatestats={this.updatestats(['player_center_middle'])}/>
		<Card pos="8" {...this.state.player_center_right} updatestats={this.updatestats(['player_center_right'])}/>
		
		<div className="mdl-cell mdl-cell--3-col" />
		<div className="mdl-cell mdl-cell--4-col" />
		<Card pos="9" {...this.state.player_back_left} updatestats={this.updatestats(['player_back_left'])}/>
		<Card pos="10" {...this.state.player_back_right} updatestats={this.updatestats(['player_back_right'])}/>
		<div className="mdl-cell mdl-cell--4-col" />
		<div className="mdl-cell mdl-cell--12-col">
		<button className="mdl-button mdl-js-button mdl-button--raised" onClick={this.resetcurrent.bind(this)}>
		Reset
		</button>
		<button className="mdl-button mdl-js-button mdl-button--raised">
		Update Selected
		</button>
		<button className="mdl-button mdl-js-button mdl-button--raised" onClick={this.updatestats(['player_back_left','player_back_right'])}>
		Update Back
		</button>
		<button className="mdl-button mdl-js-button mdl-button--raised" onClick={this.updatestats(['player_center_left','player_center_middle','player_center_right'])}>
		Update Center
		</button>
		<button className="mdl-button mdl-js-button mdl-button--raised" onClick={this.updatestats(['player_back_left','player_back_right','player_center_left','player_center_middle','player_center_right'])}>
		Update All
		</button>
		</div>

		</div>
		</main>
		<dialog id="updater-dialog" className="mdl-dialog mdl-js-dialog" style={{width:"fit-content"}}>
		<div className="mdl-dialog__content">
		<table className="mdl-data-table mdl-js-data-table  mdl-shadow--2dp">
		<thead>
		<tr>
		<th className="mdl-data-table__cell--non-numeric">Attribute</th>
		<th>Increase</th>
		<th>Decrease</th>
		<th>Options</th>
		</tr>
		</thead>
		<tbody>
		<AttributeUpdate attribute="Power"
		add={
		    otherval => {
			console.log(`updating ${this.state.power.val} to ${this.power}`)
			let obj = this.state
			obj.power.val += (otherval ? otherval : this.power)
			
			this.setState(obj)
		    }
		}
		remove={
		    otherval => {
			let obj = this.state
			obj.power.val -= (otherval ? otherval : this.power)

			this.setState(obj)
		    }
		}
		end_of_opponents_turn={this.checkedOn('power','end_of_opponents_turn')}
		eoot_value={this.state.power.end_of_opponents_turn}
		on_opponents_turn={this.checkedOn('power','on_opponents_turn')}
		oot_value={this.state.power.on_opponents_turn}
		continous={this.checkedOn('power','continous')}
		c_value={this.state.power.continous}
		addopts={[2000,4000,6000,8000,10000]}/>
		
		<AttributeUpdate attribute="Soul"
		add={
		    otherval => {
			let obj = this.state
			obj.soul.val += (otherval ? otherval : this.soul)
			this.setState(obj)
		    }
		}
		remove={
		    otherval => {
			let obj = this.state
			obj.soul.val -= (otherval ? otherval : this.soul)
			
			this.setState(obj)
		    }
		}
		end_of_opponents_turn={this.checkedOn('soul','end_of_opponents_turn')}
		eoot_value={this.state.soul.end_of_opponents_turn}
		on_opponents_turn={this.checkedOn('soul','on_opponents_turn')}
		oot_value={this.state.soul.on_opponents_turn}
		continous={this.checkedOn('soul','continous')}
		c_value={this.state.soul.continous}/>
		
		<AttributeUpdate attribute="Level" 
		add={
		    otherval => {
  			let obj = this.state
			obj.level.val += (otherval ? otherval : this.level)
			this.setState(obj)
		    }
		}
		remove={
		    otherval => {
			let obj = this.state
			obj.level.val -= (otherval ? otherval : this.level)

			this.setState(obj)
		    }
		}
		end_of_opponents_turn={this.checkedOn('level','end_of_opponents_turn')}
		eoot_value={this.state.level.end_of_opponents_turn}
		on_opponents_turn={this.checkedOn('level','on_opponents_turn')}
		oot_value={this.state.level.on_opponents_turn}
		continous={this.checkedOn('level','continous')}
		c_value={this.state.level.continous}/>
		
		</tbody>
		</table>
		<span>Power: {this.state.power.val} Level: {this.state.level.val} Soul: {this.state.soul.val}</span>
		</div>
		<div className="mdl-dialog__actions">
		<button className="mdl-button mdl-js-button mdl-button--raised" onClick={
		    _ => {
			document.querySelector('#updater-dialog').close()
			this.applystats('power', (a,b) => a + b)()
			this.applystats('soul', (a,b) => a + b)()
			this.applystats('level', (a,b) => a + b)()
			this.setState({ power : { end_of_opponents_turn: false, on_opponents_turn: false, continous:false, val:0 },
					soul : { end_of_opponents_turn: false, on_opponents_turn: false, continous:false, val:0  },
					level : { end_of_opponents_turn: false, on_opponents_turn: false, continous:false, val:0 } })
			
			document.querySelectorAll('table label').forEach(i => {
			    i.classList.remove('is-checked')
			})
		    }
		}>
		OK
		</button>
		<button className="mdl-button mdl=js-button mdl-button--raised" onClick={this.resetPos.bind(this)}>
		Discard
		</button>
		</div>
		</dialog>

		<dialog className="mdl-dialog" id="history-display" style={{width:'fit-content'}}>
		<div className="mdl-dialog__content">
		<History history={this.state.display_history}/>
		</div>
		<div className="mdl-dialog__actions">
		<button className="mdl-button mdl-js-button mdl-button__raised"
		onClick={
		    evt => {
			document.querySelector('#history-display').close()
		    }
		}>
		OK
		</button>
		</div>
		</dialog>
		</div>)
		
    }

}

export default Main;
