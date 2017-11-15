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


function Checkbox({id,change,checked,children}) {
    return (<label className="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" htmlFor={id}>
	    <input type="checkbox" id={id} className="mdl-checkbox__input" value={( _ => checked ? 'on' : 'off')()} onChange={change}></input>
	    <span className="mdl-checkbox__label">
	    {children}
	    </span>
	    </label>)
	
}

function Menu({id,opts,contextmenu,display}) {
    let button = (<button id={id} className="mdl-button mdl-js-button">
		  {display}
		  </button>)
    if(contextmenu) {
	button = <button id={id} style={{position:"absolute",display:"none"}} />
    }
    return (<div style={{position:'relative'}}>
	    {button}

	    <ul className="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect"
	    htmlFor={id}>
	    {( _ => {
		if(opts) {
		    return opts.map( ({option,click}, index) => {
			return (<li key={`menu-${id}-${index}`} data-value={option} className="mdl-menu__item" onClick={click}>{option}</li>)
		    })
		}
	    })()}
	    </ul>
	    </div>)
}


function Card({pos,power,level,soul,updatestats,contextmenu}) {
    
    return (<div className="mdl-cell mdl-cell--2-col card">
	    {(_ => {
		if(contextmenu) {
		    return <Menu contextmenu={true} id={`menu-added-opts-${pos}`} opts={contextmenu}/>
		}
	    })()
	    }
	    <div className="mdl-card" style={{width:'initial'}}>
	    
	    <div className="mdl-card__title" onClick={updatestats} onContextMenu={
		evt => {
		    if(contextmenu) {
			document.querySelector(`#menu-added-opts-${pos}`).dispatchEvent(new MouseEvent('click'));
			evt.preventDefault()
		    }
		}
	    }>
	    
	    </div>
	    <div className="mdl-card__supporting-text" >

	    <Checkbox id={`pos-${pos}`}>
	    {(_ => {
		let souls = []
		if(soul) {
		    if(typeof soul === 'function')
			soul = soul(true)
		    for(let i = 0; i < soul; ++i) {
			souls.push(<img key={`soul-${i}`} src="http://ws-tcg.com/en/cardlist/partimages/soul.gif"></img>)
		    }
		}
		if(typeof power === 'function')
		    power = power(true)
		if(typeof level === 'function')
		    level = level(true)
		return [`${power || 0} / `].concat(souls).concat([` / ${level || 0}`]);

	    })()}
	    </Checkbox>
	    </div>
	    <div className="mdl-card__actions">
	    </div>
	    </div>
	    </div>)
}

const  mergeHistories = ({power,soul,level}) => {
    power = (power || []).reduce((a,b) => a.concat(b), []).filter(({val}) => val > 0).sort( ({onturn:turn1},{onturn:turn2}) => turn1 - turn2)
    soul = (soul || []).reduce((a,b) => a.concat(b), []).filter(({val}) => val > 0).sort( ({onturn:turn1},{onturn:turn2}) => turn1 - turn2)
    level = (level || []).reduce((a,b) => a.concat(b), []).filter(({val}) => val > 0).sort( ({onturn:turn1},{onturn:turn2}) => turn1 - turn2)
    
    const getSmallest = (p,s,l) => {
	p = p[p.length - 1] || {onturn:1000}
	s = s[s.length - 1] || {onturn:1000}
	l = l[l.length - 1] || {onturn:1000}
	if(p.onturn < s.onturn) {
	    if(l.onturn < p.onturn)
		return 'level'
	    return 'power'
	}
	if(s.onturn < l.onturn)
	    return 'soul'
	return 'level'
    }

    let histories = []
    while(power.length > 0 || soul.length > 0 || level.length > 0) {
	
	let record;
	switch(getSmallest(power, soul, level)) {
	case 'power': {
	    record = power.pop()
	}
	    break;
	case 'soul' : {
	    record = soul.pop()
	}
	    break;
	case 'level' : {
	    record = level.pop()
	}
	    break;
	}
	
	histories.push(record)
    }

    return histories
}



export { Menu, Card, Checkbox, Nav, Drawer, mergeHistories }
