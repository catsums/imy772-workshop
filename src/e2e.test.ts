
import {render, screen, fireEvent} from '@testing-library/react'
import {app, port} from "../server";
import request from 'supertest';
import {JSDOM} from "jsdom";

test("Test request from server", () => {
	let res = await request(app).get("/");
		
	let dom = new JSDOM(res.text);
	let calc = dom.window.document.querySelector(".calculator");

	expect(calc).toBeTruthy();
	
});
