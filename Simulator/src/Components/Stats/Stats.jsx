import { MyNavBar } from '../';

import './stats.css'


export const Stats = ({setMode}) => {
  return (
	<div className="main">
		<MyNavBar 
		  onClickDraftNavbar={() => setMode("Home")} 
		  onClickStatNavbar={() => setMode("Stats")}
		/>
	  <h1>Stats</h1>
	</div>
  )
}
