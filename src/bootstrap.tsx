import ReactDOM from 'react-dom'
import { createMemoryHistory, createBrowserHistory } from 'history'
import App from './App'

const mount = (el: any, { onNavigate, defaultHistory, initialPath }: any) => {
	const history =
		defaultHistory ||
		createMemoryHistory({
			initialEntries: [initialPath],
		})
	if (onNavigate) {
		history.listen(onNavigate)
	}

	ReactDOM.render(<App history={history} />, el)

	return {
		onParentNavigate({ pathname: nextPathname }: any) {
			const { pathname } = history.location
			if (pathname !== nextPathname) {
				history.push(nextPathname)
			}
		},
	}
}

if (process.env.NODE_ENV === 'development') {
	const devRoot = document.getElementById('root')
	if (devRoot) {
		mount(devRoot, { defaultHistory: createBrowserHistory() })
	}
}

export { mount }
