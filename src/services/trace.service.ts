import { Injectable } from "@angular/core";
import { APIService } from "./api.service";

@Injectable({
  providedIn: "root",
})
export class TraceService {
  constructor(private api: APIService) {}
  async reportRoomState(data: any) {
    await this.api.revoke("connection.data", () => ({ showLoading: false }), data);
  }
  reportAction(data: any) {
    console.log("reported a action ------ ");
    console.log(data);
  }
}
