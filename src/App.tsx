import { Suspense, lazy, useState, useEffect } from 'react'
import { io, Socket } from "socket.io-client"

import './css/App.css'
import "./css/tailwind.css";
import { randomID } from '@catsums/my';
import { Btn, createSync } from './components/Calculator';

// Works also with SSR as expected
// const CalculatorApp = lazy(() => import('./components/Calculator'))
import CalculatorApp from './components/Calculator';

// const PORT = 5173;
// const URL = `http://localhost:${PORT}`;

export default function App() {

	const [id, setID] = useState("");
	const [openDialog, setOpenDialog] = useState(false);
	const socket = io();
	
	function onConnect() {
		console.log(`Socket connected! ${socket.id}`);
	}
	
	function onDisconnect() {
		console.log(`Socket disconnected! ${socket.id}`);
	}

	socket.on('connect', onConnect);
	socket.on('disconnect', onDisconnect);

	useEffect(() => {

		if(!id){
			let _id = localStorage.getItem("clientID");
			if(_id){
				setID(_id);
			}else{
				_id = randomID();

			}
			localStorage.setItem("clientID", _id);
			setID(_id);
			return;
		}
		
		console.log({id});

		return () => {
			socket.disconnect();
			socket.off('connect', onConnect);
			socket.off('disconnect', onDisconnect);
		};
	  }, []);

	return (
		<>
			<CalculatorApp socket={socket} id={id}/>
		</>
	)
}
