declare module server.utils {
    interface IResponseBody {
        status: string;
        data?: any;
        message?: string;
    }

    interface IFormattedResponse {
        status: number;
        body: IResponseBody;
    }

    interface IMailOptions {
    	to: string;
    	toname?: string;
    	from: string;
    	fromname?: string;
    	subject: string;
    	html?: string;
    	attachments?: Array<IAttachment>;
    }

    interface IAttachment {
    	filename?: string;
    	path?: string;
    	content?: any;
    }

    interface IFile {
        /**
         * Field name specified in the form
         */
        fieldname: string;

        /**
         * Name of the file on the user's computer
         */
        originalname: string;

        /**
         * Renamed file name
         */
        name: string;

        /**
         * Encoding type of the file
         */
        encoding: string;

        /**
         * Mime type of the file
         */
        mimetype: string;

        /**
         * Location of the uploaded file
         */
        path: string;

        /**
         * Extension of the file
         */
        extension: string;

        /**
         * Size of the file in bytes
         */
        size: number;

        /**
         * If the file was truncated due to size limitation
         */
        truncated?: boolean;
    }
}
