// const mongoose = require('mongoose')
// const UserAuth = require("./../models/UserAuth.js")
// const jwt = require('jsonwebtoken')

import mongoose from "mongoose";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
// get /api/user/

export const getUserData = async (req, res) => {
    try {
        const role = req.user.role;
        const recentSearchCity = req.user.recentSearchCity;
        res.json({
            success: true,
            role,
            recentSearchCity
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

// store recent search cities

export const storeRecentSearchedCities = async (req, res) => {
    try {
        const { recentSearchCity } = req.body
        const user = req.user

        if (user.recentSearchCity.length < 3) {
            user.recentSearchCity.push(recentSearchCity)
        } else {
            user.recentSearchCity.shift()
            user.recentSearchCity.push(recentSearchCity)
        }
        await user.save();
        res.json({
            success: true,
            message: "city Added"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' });
}


export const signupUser = async (req, res) => {
    try {
        const { name, username, email, password, role } = req.body;

        // Create new user using the static signup method in User model
        const user = await User.signup(name, username, email, password, role);

        // Creating jwt token
        const token = createToken(user._id);

        res.status(201).json({ success: true, message: 'User registered successfully', name: user.name, email: user.email, role: user.role, token });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);
        const name = user.name;
        const role = user.role;
        //creating jwt token
        const token = createToken(user._id);
        res.status(200).json({ success: true, name, email, role, token })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message })
    }
}