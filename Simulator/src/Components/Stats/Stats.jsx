import { NavBar } from '../';

export const Stats = ({setMode}) => {
  return (
	<div className="main">
		<NavBar 
		  onClickDraftNavbar={() => setMode("Home")} 
		  onClickStatNavbar={() => setMode("Stats")}
		/>
	  <h1>Stats</h1>
	</div>
  )
}