import React from 'react'

function maplinks(links) {

    if(links) {
	return links.map( ({href,label}, i) => {
	    return (<a className="mdl-navigation__link" href={href}>{label}</a>)
	})
    }


}

function Nav({title,links}) {
    return (<header className="mdl-layout__header">
	    <div className="mdl-layout__header-row">
	    <span className="mdl-layout-title">{title}</span>
	    <div className="mdl-layout-spacer"></div>
	    <nav className="mdl-navigation">
	    {maplinks(links)}
	    </nav>
	    </div>
	    </header>)
}

function Drawer({title,links}) {
    return (<div className="mdl-layout__drawer">
	    <span className="mdl-layout-title">{title}</span>
	    <nav className="mdl-navigation">
	    {maplinks(links)}
	    </nav>
	    </div>)
}

function Card({pos,power,level,soul,updatestats}) {
    return (<div className="mdl-cell mdl-cell--2-col card">
	    <div className="mdl-card" style={{width:'initial'}}>
	    <div className="mdl-card__title" onClick={updatestats}>
	    
	    </div>
	    <div className="mdl-card__supporting-text" >
	    
	    
	    <label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor={`pos-${pos}`}>
	    <input type="checkbox" id={`pos-${pos}`} className="mdl-checkbox__input"></input>
	    <span className="mdl-checkbox__label">

	    
	    
	    {(_ => {
		let souls = []
		if(soul) {

		    for(let i = 0; i < soul; ++i) {
			souls.push(<img key={`soul-${i}`} src="http://ws-tcg.com/en/cardlist/partimages/soul.gif"></img>)
		    }
		}
		return [`${power || 0} / `].concat(souls).concat([` / ${level || 0}`]);

	    })()}
	    
	    </span>
	    </label>
	    </div>
	    <div className="mdl-card__actions">
	    </div>
	    </div>
	    </div>)
}


function AttributeUpdate({attribute,add,remove}) {
    return (<tr>
	    <td>
	    {attribute}
	    </td>
	    <td>
	    <button className="mdl-button mdl-js-button mdl-button--icon" onClick={add}>
	    <i className="material-icons">add</i>
	    </button>
	    </td>
	    <td>
	    <button className="mdl-button mdl-js-button mdl-button--icon" onClick={remove}>
	    <i className="material-icons">remove</i>
	    </button>
	    
	    </td>
	    </tr>)
}

class Main extends React.Component {
    constructor(props) {
	super(props)
	this.power = 500;
	this.soul = 1;
	this.level = 1;
	this.state = {opponent_back_left:{power:0,level:0,soul:0},opponent_back_right:{power:0,level:0,soul:0},opponent_center_left:{power:0,level:0,soul:0},opponent_center_middle:{power:0,level:0,soul:0},opponent_center_right:{power:0,level:0,soul:0},
		      player_back_left:{power:0,level:0,soul:0},player_back_right:{power:0,level:0,soul:0},player_center_left:{power:0,level:0,soul:0},player_center_middle:{power:0,level:0,soul:0},player_center_right:{power:0,level:0,soul:0}}
    }

    addstats(attribute) {
	return evt => {
	    console.log(`updating ${this.state.cardpos}`)
	    let obj = this.state
	    console.log(`pos ${typeof this.state.cardpos}`)
	    if(this.state.cardpos.length) {
		this.state.cardpos.forEach(i => {
		    obj[i][attribute] += this[attribute]
		})
	    }
	    else {
		obj[this.state.cardpos][attribute] += this[attribute]
	    }
	    this.setState(obj)	    

	}
    }

    removestats(attribute) {
	return evt => {
	    console.log(`updating ${this.state.cardpos}`)
	    let obj = this.state
	    if(Array.isArray(this.state.cardpos)) {
		this.state.cardpos.forEach(i => {
		    obj[i][attribute] -= this[attribute]
		})
		
	    }
	    else {
		obj[this.state.cardpos][attribute] -= this[attribute]
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
	this.setState({opponent_back_left:{power:0,level:0,soul:0},opponent_back_right:{power:0,level:0,soul:0},opponent_center_left:{power:0,level:0,soul:0},opponent_center_middle:{power:0,level:0,soul:0},opponent_center_right:{power:0,level:0,soul:0},
		       player_back_left:{power:0,level:0,soul:0},player_back_right:{power:0,level:0,soul:0},player_center_left:{power:0,level:0,soul:0},player_center_middle:{power:0,level:0,soul:0},player_center_right:{power:0,level:0,soul:0}})
    }

    render() {
	
	return (<div className="mdl-layout mdl-js-layout">
		<Nav title={this.props.title}/>
		<Drawer title={this.props.title}/>
		<main className="mdl-layout__content">
		<div className="mdl-grid">
		<div className="mdl-cell mdl-cell--12-col">
		<button className="mdl-button mdl-js-button mdl-button--raised" onClick={this.reset.bind(this)}>
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
		<Card pos="1" {...this.state.opponent_back_left} updatestats={this.updatestats(['opponent_back_left'])}/>
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
		<button className="mdl-button mdl-js-button mdl-button--raised" onClick={this.reset.bind(this)}>
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
		</tr>
		</thead>
		<tbody>
		<AttributeUpdate attribute="Power" add={this.addstats('power')} remove={this.removestats('power')} />
		<AttributeUpdate attribute="Soul" add={this.addstats('soul')} remove={this.removestats('soul')} />
		<AttributeUpdate attribute="Level" add={this.addstats('level')} remove={this.removestats('level')} />
		</tbody>
		</table>
		</div>
		<div className="mdl-dialog__actions">
		<button className="mdl-button mdl-js-button mdl-button__raised" onClick={
		    _ => {
			document.querySelector('#updater-dialog').close()
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
