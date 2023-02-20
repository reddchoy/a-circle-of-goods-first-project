import express from "express";
//import session from 'express-session'
import formidable from "formidable";
import { form } from "../formidable";
import { isLoggedInApi } from "../guards";
import { dbClient } from "../server";

export const listingRoutes = express.Router();

// --- Make Offer ---
listingRoutes.post('/:listingId/:userId', isLoggedInApi, makeOffer)

// ----Create Listings from user----
listingRoutes.post("/", isLoggedInApi, createListing);

// --- Edit / Update listing 內容 ---
listingRoutes.put("/:listingId", isLoggedInApi, editListing);

//------mark favourite on index(logged in page)--------//
listingRoutes.get("/loadfavoured", isLoggedInApi, loadFavouriteByUserId);
listingRoutes.get("/:listingId/favoured", isLoggedInApi, saveFavourite);

//------mark favourite on listing detail page----//

listingRoutes.get(`/favoured/add/:listingId`,isLoggedInApi,saveFavourite)



// GET listings data
listingRoutes.get('/', getAllListing)
listingRoutes.get('/:listingId/:userId', getListingDetails)


//-------load search result--------//
//listingRoutes.get
async function loadFavouriteByUserId(
  req: express.Request,
  res: express.Response
) {
  const userId = req.session.user?.id;
  // listing
  const favouredQuery = (
    await dbClient.query( "select * from favourites where user_id = $1;", [
      userId,
    ])
  ).rows;
  console.log("favouredQuery: ", favouredQuery);
  res.status(200).json(favouredQuery);
}

async function saveFavourite(req: express.Request, res: express.Response) {
  const itemId = req.params.listingId;
  const userId = req.session.user?.id;
  //console.log('/id/favourite', itemId, userId)

  const checkingQuery = (
    await dbClient.query(
      "select * from favourites where user_id = $1 and listing_id = $2 " ,
      [userId, itemId]
    )
  ).rowCount;

  if (checkingQuery === 0) {
    const insertResult = await dbClient.query(
      "insert into favourites (listing_id, user_id) values ($1, $2) returning id",
      [itemId, userId]
    );
    if (insertResult.rowCount > 0) {
      res.status(200).json({ message: "success" });
    } else {
      res.status(400).json({ message: "insertion error" });
    }
  } else {
    await dbClient.query(
      "delete from favourites where listing_id = $1 and user_id = $2",
      [itemId, userId]
    );
  }
  //const listingId = parseInt(req.params.listingId);
  // const userId = req.session['user']?.id;
  //onclick from logined.js ==. change class 'text-danger'-> is_favoured -> insert data
  //if(is_favoured){
  //INSERT INTO favourites (listing_id, user_id) VALUES ($1, $2),
  //[listingId, userId]
  //else{
  //DELETE FROM favourites WHERE listing_id = $1 AND user_id = $2,
  //[listingId, userId]

  // 		const result = await dbClient.query( /*SQL*/ `
  // SELECT users_id AND listing_id FROM favourites `)
  // res.json(result.rows[0])
  // console.log(result.rows);
}

async function getAllListing(req: express.Request, res: express.Response) {
	const result = await dbClient.query(/*SQL*/ `SELECT *
	FROM listings WHERE listings.is_sold != true AND listings.is_deleted != true`)
	let listings = result.rows
	res.json(listings)
}

async function createListing(req: express.Request, res: express.Response) {
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(400).json({ message: "cannot upload file" });
      return;
    }
    const name = fields.name;
    const uploadImage = files["image"] as formidable.File;
    const imageFileName = (files["image"] as formidable.File)?.newFilename;
    const description = fields.description;
    const price = fields.price;
    const category = fields.category;
    const isPostage = fields.postage;
    const isMeetUp = fields.meet_up;
    const meetUpLocation = fields.meet_up_location;
    const isBrandNew = fields.brand_new;
    const isUsed = fields.used;
    const userId = req.session["user"]?.id;
    console.log("price: ", price);
    console.log("user id: ", userId);

    await dbClient.query(
      /*SQL*/ `INSERT INTO listings (name, image, description, price, category, is_postage, is_meet_up, meet_up_location, is_brand_new, is_used, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        name,
        imageFileName,
        description,
        price,
        category,
        isPostage,
        isMeetUp,
        meetUpLocation,
        isBrandNew,
        isUsed,
        userId,
      ]
    );

    if (!uploadImage) {
      res.status(400).json({ message: "missing name or image!!!" });
      return;
    }

    res.status(201).json({ success: true });
  });
}

async function editListing(req: express.Request, res: express.Response) {
  const listingId = parseInt(req.params.listingId);
  if (isNaN(listingId)) {
    res.status(400).json({ message: "id is not an integer" });
    return;
  }
  const name = req.body.name;
  const imageFileName = req.body.images;
  const description = req.body.description;
  const price = req.body.price;
  const categories = req.body.categories;
  const isPostage = req.body.is_postage;
  const isMeetUp = req.body.is_meet_up;
  const meetUpLocation = req.body.meet_up_location;
  const isBrandNew = req.body.is_brand_new;
  const isUsed = req.body.is_used;

  await dbClient.query(
    /*SQL*/ `UPDATE listings set name = $1, images = $2, description = $3, price = $4, categories = $5, is_postage = $6, is_meet_up = $7, meet_up_location = $8, is_brand_new = $9, is_used = $10 WHERE id = $11`,
    [
      name,
      imageFileName,
      description,
      price,
      categories,
      isPostage,
      isMeetUp,
      meetUpLocation,
      isBrandNew,
      isUsed,
      listingId,
    ]
  );

  res.status(200).json({ success: true });
}


async function getListingDetails(req: express.Request, res: express.Response)  {
	const listingId = parseInt(req.params.listingId)
	if (isNaN(listingId)) {
		res.status(400).json({ message: 'id is not an integer' })
		return
	}

	const userId = parseInt(req.params.userId)
	if (isNaN(userId)) {
		res.status(400).json({ message: 'id is not an integer' })
		return
	}


	const result = await dbClient.query(/*SQL*/ `SELECT * 
	FROM listings 
	JOIN users on users.id = listings.user_id
	WHERE listings.id = $1 AND listings.user_id = $2`, [listingId, userId])

  res.json(result.rows[0]);
}

async function makeOffer(req: express.Request, res: express.Response) {
  const listingId = parseInt(req.params.listingId);
  // console.log('/listings/listingId: ', listingId)
  // console.log('/listings/listingId: ', typeof listingId)
  if (isNaN(listingId)) {
    res.status(400).json({ message: "id is not an integer" });
    return;
  }

	const sellerId = parseInt(req.params.userId)
	if (isNaN(sellerId)) {
		res.status(400).json({ message: 'id is not an integer' })
		return
	}

	const offerPrice = parseInt(req.body.offerPrice);
	// console.log('/listings/price: ', offerPrice)
	// console.log('/listings/price: ', typeof offerPrice)
	const userId = req.session['user']?.id;
	console.log(offerPrice)
	console.log(userId)
	console.log(listingId)

  await dbClient.query(
    /*SQL*/ `INSERT INTO offers (offer_price, listing_id, user_id) VALUES ($1, $2, $3)`,
    [offerPrice, listingId, userId]
  );

  res.status(201).json({ success: true });
}

