import express from "express";
import type { Request, Response } from "express";
import { dbClient } from "../server";
import { hashPassword } from "../hash";
import { isLoggedInApi } from "../guards";
export const logoutRoutes = express.Router();

logoutRoutes.get('/logout', isLoggedInApi, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
   });