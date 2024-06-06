import { Suspense, lazy, useState, useEffect } from 'react'
import { io, Socket } from "socket.io-client"

import './css/App.scss'
import "./tailwind.css";

// Works also with SSR as expected
const CalculatorApp = lazy(() => import('./components/Calculator'))

const PORT = 5173;
const URL = `http://localhost:${PORT}`;


export default function App() {
	let socket:Socket = io(URL);

	const [isConnected, setIsConnected] = useState(socket.connected);
	const [fooEvents, setFooEvents] = useState([]);

	useEffect(() => {
		function onConnect() {
			setIsConnected(true);
		}
	
		function onDisconnect() {
			setIsConnected(false);
		}
	
		function onFooEvent(value) {
			setFooEvents(previous => [...previous, value]);
		}
	
		socket.on('connect', onConnect);
		socket.on('disconnect', onDisconnect);
		socket.on('foo', onFooEvent);
	
		return () => {
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
			socket.off('foo', onFooEvent);
		};
	  }, []);

	return (
		<CalculatorApp socket={socket}/>
	)
}
