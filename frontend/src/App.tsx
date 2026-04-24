import { useState } from 'react'
import Button from './components/ui/Button/Button';

function App() {
  const [count, setCount] = useState(0)

  const layout = "flex items-center flex-col"
  return (
	<>
		<section className={`${layout} p-8`}>
			<div className={`${layout} pb-8`}>
				<h1 className="text-2xl font-bold">Test App</h1>
				<p>Click the counter below to see the state changing</p>
			</div>
			<Button 
				variant="primary"
				onClick={() => setCount((count) => count + 1)}
			>
				Count is {count}
      		</Button>
		</section>
    </>
  )
}

export default App
