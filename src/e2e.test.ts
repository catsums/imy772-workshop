
import {app, port} from "../server";
import request from 'supertest';

describe("AAAAAA", () => {
	test("Huh", async()=>{
		let res = await request(app).get("/");
		
	})
});
