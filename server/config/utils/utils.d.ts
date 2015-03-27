declare module models {
	interface IResponseBody {
		status: string;
		data?: any;
		message?: string;
	}
	
	interface IFormattedResponse {
		status: number;
		body: IResponseBody;
	}	
}