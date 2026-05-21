const express = require('express');
const router = express.Router();
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const USERS = { admin: process.env.ADMIN_PASSWORD };

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3000/auth/callback'
);