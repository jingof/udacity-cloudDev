import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
const URL = require("url").URL;
const isStringAValidUrl = (s: string) => {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
};

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: Request, res: Response) => {
    let { image_url } = req.query;
    if (!image_url  || !isStringAValidUrl(image_url)) {
      
      return res.status(400).send(`INVALID URL!! Please try again with a valid url`);
    }
    try{
      const filteredImage: string = await filterImageFromURL(image_url);
      if(filteredImage===undefined||filteredImage===null) {
        return res.status(422).send(`Unable to filter image`);
      }
      res.status(200).sendFile(filteredImage);
      res.on('finish', () => deleteLocalFiles([filteredImage]));

    } catch (err) {
      console.log(err);
      return res.status(400).send(`INVALID URL!! Please try again with a valid url`);
    }
  });
  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();