import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
	<>
		<section className="flex items-center flex-col p-8">
			<div className="flex items-center flex-col pb-8">
				<h1 className="text-2xl font-bold">Test App</h1>
				<p>Click the counter below to see the state changing</p>
			</div>
			<button
				type="button"
				className="border rounded-lg bg-sky-100 border-sky-900 hover:bg-sky-200 px-4 py-2 "
				onClick={() => setCount((count) => count + 1)}
			>
				Count is {count}
			</button>
		</section>
    </>
  )
}

export default App
