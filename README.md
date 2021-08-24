## 3D printers management system:
This project integrates with [OctoPrint](https://octoprint.org/) server on a Raspberry Pi connected to 3D printers. Currently, the program has the following capabilities:

y slots and extracting empty slots.
 2. looping through empty slots until the users finds a suitable one and schedules it.
 3. Getting files uploaded by the user, saving them to local storage on the server, then uploading them to the OctoPrint server and deleting it from local storage.
 4. Renaming the file such that important information is stored in the filename.
 5. Sending confirmation email to the user 30 minutes prior to the print time.
 6. Sending confirmation ticket to the admin console at /admin after user confirmation to either accept of reject the print job.
 7. Initiating the print and updating the admin console with the progress every 10% of progress.
 8. Sending an email to the user to come collect their 3D printed model after its done.
## Setting Up
In order to run the program, you need to have Node.js installed and from then you  should:
1- Run `npm install` in the project directory.
2- Make `credentials-cal.json`file in the home directory. It should have the following fields:

    {
	    "private_key": The private key you obtain from the google admin console. 
	    "client_email": The email of the google service account that has access to the calendar.
	    "X-Api-Key": The API key from OctoPrint server. You can find it under settings: API.
	    "sendGrid": The API key from sendGrid account. You can use node mailer, but API keys are more secure.
	    "password": The Admin console password in /admin.
	    "octoIP": The IP address of the OctoPrint server.
    }
  3- Create Gcodes file in the home directory to temporarily store the Gcodes before uploading them.
  
  Note: If you are going to manage multiple printers, it's advised to use device identifiers from OctoPrint server and to associate each printer with its IP address in the ``credentials-cal.json``.

  For any questions, don't hesitate to open an issue on the repository or email me at ismaily@carleton.edu .
