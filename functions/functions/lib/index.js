"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeUser = exports.getUsersCount = exports.setHighScore = exports.getHighScore = exports.getNotification = exports.getLocations = exports.getBingoItems = exports.getTriviaQuestions = exports.getTriviaQuestion = exports.getTriviaSubjects = exports.getKahoot = exports.updateUserName = exports.getUserProfile = exports.getFavoriteHotels = exports.removeFavoriteHotel = exports.addFavoriteHotel = exports.getHotel = exports.getAllHotels = exports.getHistorySprings = exports.getFavoriteSprings = exports.removeFavoriteSpring = exports.addFavoriteSpring = exports.addComment = exports.updateProfile = exports.changePassword = exports.resetPasswordRecieveCode = exports.resetPasswordCreateCode = exports.verifyEmail = exports.updateSpring = exports.signUp = exports.loginWithThirdParty = exports.login = exports.getSpring = exports.getSpringByName = exports.getAllSprings = void 0;
global.XMLHttpRequest = require("xhr2");
const { Buffer } = require('buffer');
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
const app_1 = __importDefault(require("firebase/compat/app"));
require("firebase/compat/firestore");
require("firebase/compat/storage");
require("firebase/compat/auth");
require('firebase-admin');
require('firebase-admin/auth');
//import { firestore } from 'firebase/app';
const nodemailer = __importStar(require("nodemailer"));
const crypto = __importStar(require("crypto"));
const jwt = __importStar(require("jsonwebtoken"));
const https = __importStar(require("https"));
const geofire = __importStar(require("geofire-common"));
const tripperEmail = {
    user: "tripper.app.il@gmail.com",
    password: "hltvogywtttougrn"
};
const jwtSecret = "tripperSecret";
// const firebaseConfigFile = require("./credentials/firebaseConfig");
const firebaseConfig = {
    apiKey: "AIzaSyAnnNBKwmXrXQ6lmexwt-oQs5aRTxkwV8A",
    authDomain: "tripper-d0e21.firebaseapp.com",
    databaseURL: "https://tripper-d0e21.firebaseio.com",
    projectId: "tripper-d0e21",
    storageBucket: "tripper-d0e21.appspot.com",
    messagingSenderId: "658415875612",
    appId: "1:658415875612:web:b1535639c70c6fdc2591d9",
    measurementId: "G-HFCHK193HY"
};
admin.initializeApp(firebaseConfig);
app_1.default.initializeApp(firebaseConfig);
const db = admin.firestore();
const region = "europe-west1";
const usersCollection = "users";
const springsCollection = 'springs';
const hotelsCollection = 'hotels';
const notificationsCollection = 'notifications';
const searchResultsCollection = "searchResults";
const viewsCollection = "views";
const notificationsUpdates = 'עדכונים';
const defaultLanguage = 'iw';
const defaultUserPicture = "https://firebasestorage.googleapis.com/v0/b/tripper-d0e21.appspot.com/o/assets%2FuserProfile.png?alt=media&token=a6c2eff3-af9e-4207-be7a-a1b4abef75a1";
const historyLimit = 14;
const runtimeOpts = {
    timeoutSeconds: 60,
    memory: '128MB'
};
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "tripper.app.il@gmail.com",
        pass: "wtyxrndufinikfmb"
    }
});
const mailOptions = {
    from: `tripper.app.il@gmail.com`,
    to: "",
    subject: "",
    html: '',
    text: ""
};
const functionBuilder = functions.region(region).runWith(runtimeOpts).https.onRequest;
// const execCall = (fu: (req: functions.https.Request, resp: functions.Response<any>) => void | Promise<void>) => {
//     try {
//         functions.region(region).runWith(runtimeOpts).https.onRequest(fu)
//     } catch (error) {
//     }
//}
// const check = execCall(async (req, res) => {
// })
exports.getAllSprings = functionBuilder(async (req, res) => {
    try {
        const springsDocs = await setSpringsQuery(req.body.filters);
        const springs = [];
        springsDocs.forEach((doc) => {
            const newSpring = { location: doc.get("location"), id: doc.id };
            springs.push(newSpring);
        });
        res.send(springs);
    }
    catch (error) {
        handleError(req, res, error);
    }
});
exports.getSpringByName = functionBuilder(async (req, res) => {
    try {
        const lang = req.query.lang;
        const name = springNameToSearch(req.query.springName);
        const spring = await (await db.collection(springsCollection)
            .where(`name.${lang}`, ">=", name)
            .where(`name.${lang}`, '<=', name + '\uf8ff')
            .get()).docs[0]; // add limit?
        const flatSpring = { id: "", location: {} };
        if (spring) {
            flatSpring.id = spring.id;
            flatSpring.location = spring.get("location");
        }
        res.send(flatSpring);
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.getSpring = functionBuilder(async (req, res) => {
    try {
        const token = req.headers.access_token;
        let email;
        if (token) {
            email = validateJwtToken(req.headers.access_token);
        }
        const springId = req.query.springId;
        const spring = await db
            .collection(springsCollection)
            .doc(springId)
            .get();
        const data = spring.data();
        if (data) {
            const currentLanguage = (req.query.lang ? req.query.lang : defaultLanguage).toString();
            data.description = updateField(data.description, currentLanguage);
            data.distanceFromCar = updateField(data.distanceFromCar, currentLanguage);
            data.info = updateField(data.info, currentLanguage);
            data.name = updateField(data.name, currentLanguage);
            data.preferredSeason = updateField(data.preferredSeason, currentLanguage);
            data.depth = updateField(data.depth, currentLanguage);
            data.isFavorite = false;
            if (!data.comments) {
                data.comments = [];
            }
            data.comments.forEach(async (comment) => {
                comment.user_name = await (await db.collection(usersCollection).doc(comment.email).get()).get('userName');
                comment.user_pic = await (await db.collection(usersCollection).doc(comment.email).get()).get('profile');
            });
            if (email) {
                const userRef = await db.collection(usersCollection).doc(email);
                const favorites = (await userRef.get()).get("favoriteSprings");
                await userRef.update({
                    historySprings: admin.firestore.FieldValue.arrayUnion(springId)
                });
                if ((await userRef.get()).get("historySprings").length > historyLimit) {
                    const history = await (await userRef.get()).get("historySprings");
                    await userRef.update({
                        historySprings: admin.firestore.FieldValue.arrayRemove(history[0])
                    });
                }
                if (favorites && favorites.includes(springId))
                    data.isFavorite = true;
            }
        }
        res.send(data);
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.login = functionBuilder(async (req, res) => {
    try {
        if (req.query.email && req.query.password) {
            const usersRef = await db.collection("users")
                .where("email", "==", req.query.email)
                .where("password", "==", getHash(req.query.password))
                .limit(1);
            const user = await usersRef.get();
            if (!user.empty) {
                const data = user.docs[0].data();
                if (data.pendingVerification) {
                    res.status(407).send("email is not verified");
                }
                else {
                    res.send({ token: creatJwtToken(data.email), profile_picture: data.profile });
                }
            }
            else {
                res.status(401).send("wrong email or password");
            }
        }
        else {
            res.status(400).send("email and password required");
        }
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.loginWithThirdParty = functionBuilder(async (req, res) => {
    try {
        const token = req.query.token;
        const thirdrdParty = thirdParties.find(t => t.name === req.query.thirdrdParty);
        if (thirdrdParty) {
            https.request(thirdrdParty.url + token, (response) => {
                response.setEncoding('utf8');
                let user;
                response.on('data', (chunk) => {
                    user = chunk;
                });
                response.on('end', async () => {
                    const data = JSON.parse(user);
                    if (!data.email) {
                        res.status(406).send({ err: "There is no email connected to this account" });
                    }
                    else {
                        functions.logger.debug(data);
                        const doc = await db.collection('users').doc(data.email).get();
                        // Facebook returns picture as { data: { url } }; Google's tokeninfo
                        // returns it as a plain string. Handle both, with fallbacks.
                        const picture = data.picture ? (data.picture.data ? data.picture.data.url : data.picture) : defaultUserPicture;
                        const userName = data.name ? data.name : data.email.slice(0, data.email.indexOf('@'));
                        if (!doc.exists) {
                            await doc.ref.set({
                                email: data.email,
                                password: 'logged with third party',
                                userName: userName,
                                pendingVerification: false,
                                profile: picture
                            });
                        }
                        res.send({ token: creatJwtToken(data.email), profile_picture: picture });
                    }
                });
            }).end();
        }
        else {
            throw new Error("can't find this third party");
        }
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.signUp = functionBuilder(async (req, res) => {
    try {
        if (req.body.email && req.body.password) {
            if ((await db.collection('users').doc(req.body.email).get()).exists) {
                res.status(409).send({ err: "this email is already registered" });
            }
            else {
                const email = req.body.email;
                const data = {
                    email: email,
                    password: getHash(req.body.password),
                    userName: req.body.nick ? req.body.nick : email.slice(0, email.indexOf('@')),
                    pendingVerification: true,
                    profile: defaultUserPicture
                };
                const i18nBody = geti18n((req.query.lang ? req.query.lang : defaultLanguage).toString());
                mailOptions.to = req.body.email;
                mailOptions.subject = i18nBody ? i18nBody.emailVerificationSubject : "";
                mailOptions.html = `<a style="cursor: pointer" href="https://europe-west1-tripper-d0e21.cloudfunctions.net/verifyEmail?email=${req.body.email}">
                                        <button style="cursor: pointer; background-color: rgba(103, 105, 252, 0.884); font-size:25px; border-radius:0%;">
                                            ${i18nBody?.emailVerificationText}
                                        </button>
                                    </a>`;
                mailOptions.text = "https://europe-west1-tripper-d0e21.cloudfunctions.net/verifyEmail?email=" + req.body.email;
                await transporter.sendMail(mailOptions);
                await db.collection('users').doc(email).set(data);
                res.send({ data: "great" });
            }
        }
        else {
            res.status(400).send({ err: "email and password required" });
        }
    }
    catch (error) {
        if (error.code === "EENVELOPE") {
            res.status(422).send({ err: "Wrong email address" });
        }
        else {
            handleError(req, res, error);
            ;
        }
    }
});
exports.updateSpring = functionBuilder(async (req, res) => {
    try {
        let email = req.headers.access_token;
        if (!email) {
            email = "אין אימייל";
        }
        else {
            email = validateJwtToken(email);
        }
        const text = req.query.text;
        const spring = req.query.spring;
        mailOptions.to = tripperEmail.user;
        mailOptions.subject = `עדכון בנוגע ל ${spring}`;
        mailOptions.html = `${text}
        
        מאת: ${email}`;
        const mailRes = await transporter.sendMail(mailOptions);
        res.send(mailRes);
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.verifyEmail = functionBuilder(async (req, res) => {
    try {
        if (!req.query.email) {
            res.status(400).send({ err: "can't find this email address" });
        }
        const userRef = await db.collection('users').doc(req.query.email);
        if (userRef && (await userRef.get()).exists) {
            await userRef.update({ "pendingVerification": false });
            res.send(`<h1 style="text-align: center" >כתובת אימייל אומתה. אתם יכולים לחזור לאפליקציה ולהתחבר למשתמש שלכם</h1>
            <h1 style="text-align: center">Email address verified. You can return to the application and login to your account</h1>`);
        }
        else {
            res.status(400).send({ err: "can't find this email address" });
        }
    }
    catch (error) {
        handleError(req, res, error);
    }
});
exports.resetPasswordCreateCode = functionBuilder(async (req, res) => {
    try {
        const generatedCode = generateRandomString();
        const email = req.query.email;
        const user = await db.collection(usersCollection).doc(email);
        if (!user || !(await (user.get())).exists) {
            res.status(404).send("can't find this email");
        }
        else {
            await db.collection('users').doc(email).update({ resetPasswordCode: generatedCode });
            const i18nBody = geti18n((req.query.lang ? req.query.lang : defaultLanguage).toString());
            mailOptions.to = email;
            mailOptions.subject = i18nBody ? i18nBody.resetPasswordSubject : "";
            mailOptions.html = `<div>${i18nBody?.resetPasswordText}<h1>${generatedCode}</h1></div>`;
            const mailRes = await transporter.sendMail(mailOptions);
            res.send(mailRes);
        }
    }
    catch (error) {
        if (error.code === "EENVELOPE") {
            res.status(422).send("Wrong email address");
        }
        else {
            handleError(req, res, error);
            ;
        }
    }
});
exports.resetPasswordRecieveCode = functionBuilder(async (req, res) => {
    try {
        const email = req.body.email;
        const code = req.body.code;
        const password = req.body.password;
        if (!email || !code || !password) {
            res.status(400).send("Fill all fields");
        }
        else {
            const user = await db.collection("users").doc(email).get();
            if (!user.exists) {
                res.status(401).send("can't find user");
            }
            else {
                if (user.get("resetPasswordCode") === code) {
                    await user.ref.update({ "password": getHash(password), "resetPasswordCode": admin.firestore.FieldValue.delete() });
                    res.send();
                }
                else {
                    res.status(401).send("codes does not match");
                }
            }
        }
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.changePassword = functionBuilder(async (req, res) => {
    try {
        const email = validateJwtToken(req.headers.access_token);
        const newPassword = req.body.newPassword;
        const usersRef = await db.collection("users")
            .where("email", "==", email)
            .where("password", "==", getHash(req.body.oldPassword))
            .limit(1);
        const user = await usersRef.get();
        if (newPassword) {
            if (user.empty) {
                res.status(401).send("wrong email or password");
            }
            else {
                await db.collection('users').doc(email).update({
                    "password": getHash(newPassword)
                });
                res.send();
            }
        }
        else {
            res.status(400).send("please provide old and new passwords");
        }
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.updateProfile = functionBuilder(async (req, res) => {
    try {
        const email = validateJwtToken(req.headers.access_token);
        const storage = app_1.default.storage();
        const imageRef = storage.ref(`users/${email}/profile`);
        //const buffer = Buffer.from(req.body.imageString, 'base64');
        //const blob = buffer.toString('base64');
        //const storageRef = firebase.default.storage().ref();
        //const imageRef = storageRef.child(`users/${email}/profile`);
        const blob = Buffer.from(req.body.imageString, "base64");
        // uploadString(imageRef, blob, 'base64', {
        //     contentType: 'image/jpeg'
        //   }).then(async (snap: any) => {
        //     const user = await db.collection("users").doc(email).get();
        //     const imageUrl = await snap.ref.getDownloadURL();
        //     await user.ref.update({ "profile": imageUrl });
        //     res.send({ imageUrl: imageUrl });
        // }).catch((err: any) => {
        //     throw err;
        // });
        imageRef.put(blob, {
            contentType: "image/jpeg"
        }).then(async (snap) => {
            const user = await db.collection("users").doc(email).get();
            const imageUrl = await snap.ref.getDownloadURL();
            await user.ref.update({ "profile": imageUrl });
            res.send({ imageUrl: imageUrl });
        }).catch((err) => {
            throw err;
        });
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.addComment = functionBuilder(async (req, res) => {
    try {
        const email = validateJwtToken(req.headers.access_token);
        const comment = {
            text: req.body.text,
            date: new Date,
            user_name: "",
            user_pic: "",
            email: email
        };
        const userRef = await db.collection('users').doc(email);
        const springRef = await db.collection('springs').doc(req.body.springId);
        const userData = await userRef.get();
        if (userData.exists) {
            const user = userData.data();
            comment.user_name = user ? user.userName : undefined;
            const guestPic = "https://images.macrumors.com/t/x_zUFqghBUNBxVUZN_dYoKF3D9g=/1600x0/article-new/2019/04/guest-user-250x250.jpg";
            comment.user_pic = user ? user.profile ? user.profile : guestPic : guestPic;
            await springRef.update({
                comments: admin.firestore.FieldValue.arrayUnion(comment)
            });
            res.send(comment);
        }
        else {
            throw new Error("user does not exist");
        }
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.addFavoriteSpring = functionBuilder(async (req, res) => {
    try {
        const email = validateJwtToken(req.headers.access_token);
        const springId = req.body.springId;
        const userRef = await db.collection('users').doc(email);
        await userRef.update({
            favoriteSprings: admin.firestore.FieldValue.arrayUnion(springId)
        });
        res.send();
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.removeFavoriteSpring = functionBuilder(async (req, res) => {
    try {
        const email = validateJwtToken(req.headers.access_token);
        const springId = req.body.springId;
        const userRef = await db.collection('users').doc(email);
        await userRef.update({
            favoriteSprings: admin.firestore.FieldValue.arrayRemove(springId)
        });
        res.send();
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.getFavoriteSprings = functionBuilder(async (req, res) => {
    try {
        const currentLanguage = (req.query.lang ? req.query.lang : defaultLanguage).toString();
        const email = validateJwtToken(req.headers.access_token);
        const user = await db.collection('users').doc(email).get();
        const favorites = user.get('favoriteSprings');
        const springPromises = [];
        let springsData = [];
        const actualSprings = [];
        if (favorites) {
            favorites.forEach(async (element) => {
                springPromises.push(db.collection('springs').doc(element).get());
            });
        }
        springsData = await Promise.all(springPromises);
        if (springsData) {
            springsData.forEach((spring) => {
                const final = {
                    id: spring.id,
                    images: spring.get('images'),
                    name: updateField(spring.get('name'), currentLanguage),
                    location: spring.get('location')
                };
                actualSprings.push(final);
            });
        }
        res.send(actualSprings);
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.getHistorySprings = functionBuilder(async (req, res) => {
    try {
        const currentLanguage = (req.query.lang ? req.query.lang : defaultLanguage).toString();
        const email = validateJwtToken(req.headers.access_token);
        const user = await db.collection('users').doc(email).get();
        const history = user.get('historySprings');
        const springPromises = [];
        let springsData = [];
        const actualSprings = [];
        if (history) {
            history.forEach(async (element) => {
                springPromises.push(db.collection('springs').doc(element).get());
            });
        }
        springsData = await Promise.all(springPromises);
        if (springsData) {
            springsData.forEach((spring) => {
                const final = {
                    id: spring.id,
                    images: spring.get('images'),
                    name: updateField(spring.get('name'), currentLanguage),
                    location: spring.get('location')
                };
                actualSprings.push(final);
            });
        }
        res.send(actualSprings);
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.getAllHotels = functionBuilder(async (req, res) => {
    const currentLanguage = (req.query.lang ? req.query.lang : defaultLanguage).toString();
    const today = new Date();
    try {
        const hotelsDocs = await setHotelsQuery(req.body.filters, currentLanguage);
        const hotels = [];
        hotelsDocs.forEach(doc => {
            const fields = doc.data();
            const newHotel = {
                ID: doc.id,
                description: updateField(fields.description, currentLanguage),
                name: updateField(fields.name, currentLanguage),
                //price: fields.price,
                region: updateField(fields.region, currentLanguage),
                city: updateField(fields.city, currentLanguage),
                images: fields.images
            };
            addHotelSearchResult(doc.ref, today).catch(error => {
                handleError(req, res, error);
            });
            hotels.push(newHotel);
        });
        res.send(hotels);
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.getHotel = functionBuilder(async (req, res) => {
    try {
        const currentLanguage = (req.query.lang ? req.query.lang : defaultLanguage).toString();
        const hotel = await db
            .collection(hotelsCollection)
            .doc(req.query.hotelId)
            .get();
        const data = hotel.data();
        if (data) {
            data.name = updateField(data.name, currentLanguage);
            if (data.attractions) {
                data.attractions = data.attractions.map((h) => updateField(h, currentLanguage));
            }
            data.city = updateField(data.city, currentLanguage);
            data.description = updateField(data.description, currentLanguage);
            data.region = updateField(data.region, currentLanguage);
        }
        addHotelView(hotel.ref).catch(error => {
            handleError(req, res, error);
        });
        res.send(data);
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.addFavoriteHotel = functionBuilder(async (req, res) => {
    try {
        const email = validateJwtToken(req.headers.token);
        const hotelId = req.query.hotelId;
        const userRef = await db.collection('users').doc(email);
        await userRef.update({
            favoriteshotels: admin.firestore.FieldValue.arrayUnion(hotelId)
        });
        res.send();
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.removeFavoriteHotel = functionBuilder(async (req, res) => {
    try {
        const email = validateJwtToken(req.headers.token);
        const hotelId = req.body.springId;
        const userRef = await db.collection('users').doc(email);
        await userRef.update({
            favoriteshotels: admin.firestore.FieldValue.arrayRemove(hotelId)
        });
        res.send();
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.getFavoriteHotels = functionBuilder(async (req, res) => {
    try {
        const email = validateJwtToken(req.headers.token);
        const user = await db.collection('users').doc(email).get();
        const favorites = user.get('favoriteHotels');
        res.send(favorites);
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.getUserProfile = functionBuilder(async (req, res) => {
    const email = validateJwtToken(req.headers.access_token);
    const user = await (await db.collection(usersCollection).doc(email).get()).data();
    const userData = {
        email: email,
        profileImage: "",
        userName: "",
        favoriteSprings: [],
        historySprings: []
    };
    functions.logger.debug("user: " + user);
    if (user) {
        userData.profileImage = user.profile;
        userData.userName = user.userName;
        // const springPromises: any = [];
        // let springsData: any = []
        // let actualSprings: any = [];
        // let springs = user.favoriteSprings;
        // springs.forEach(async (element: any) => {
        //     springPromises.push(db.collection('springs').doc(element).get())
        // });
        // springsData = await Promise.all(springPromises)
        // springsData.forEach((spring: any) => {
        //     actualSprings.push(spring.data())
        // })
        // userData.favoriteSprings = user.actualSprings;
        // userData.historySprings = user.historySprings;
    }
    functions.logger.debug("result: " + userData);
    res.send(userData);
});
exports.updateUserName = functionBuilder(async (req, res) => {
    try {
        const email = validateJwtToken(req.headers.access_token);
        const user = await db.collection(usersCollection).doc(email).get();
        await user.ref.update({ "userName": req.body.newUserName });
        res.send();
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.getKahoot = functionBuilder(async (req, res) => {
    try {
        const currentLanguage = (req.query.lang ? req.query.lang : defaultLanguage).toString();
        const result = [];
        const quizes = (await db.collection('kahoot').get()).docs;
        quizes.forEach(quiz => {
            result.push({ url: quiz.get('url'), name: quiz.get('name')[currentLanguage] });
        });
        res.send(result);
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.getTriviaSubjects = functionBuilder(async (req, res) => {
    try {
        const currentLanguage = (req.query.lang ? req.query.lang : defaultLanguage).toString();
        const quizes = (await db.collection('trivia').get()).docs;
        const result = [];
        quizes.forEach(quiz => {
            result.push({ name: quiz.get('name')[currentLanguage], id: quiz.id, size: Object.keys(quiz.data()).length - 1 });
            // result.push({ image: data.image, name: data.name[currentLanguage], text: data.text[currentLanguage], answers: data.answers.map((a: any) => a[currentLanguage]), rightAnswer: data.rightAnswer })
        });
        res.send(result);
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.getTriviaQuestion = functionBuilder(async (req, res) => {
    try {
        const currentLanguage = (req.query.lang ? req.query.lang : defaultLanguage).toString();
        const quiz = (await db.collection('trivia').doc(req.query.triviaId).get());
        const data = quiz.get(req.query.questionNumber);
        res.send({ image: data.image, text: data.text[currentLanguage], answers: data.answers.map((a) => a[currentLanguage]), rightAnswer: data.rightAnswer });
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.getTriviaQuestions = functionBuilder(async (req, res) => {
    try {
        const currentLanguage = (req.query.lang ? req.query.lang : defaultLanguage).toString();
        const triviaIds = req.body.triviaIds;
        const arr = [];
        for (const id of triviaIds) {
            const quiz = (await db.collection('trivia').doc(id).get());
            const data = await quiz.data() || {};
            for (let i = 1; i < Object.keys(data).length - 1; i++) {
                const q = data["q" + i];
                arr.push({ image: q.image, text: q.text[currentLanguage], rightAnswer: q.rightAnswer, answers: q.answers.map((a) => a[currentLanguage]) });
            }
        }
        res.send(arr);
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.getBingoItems = functionBuilder(async (req, res) => {
    try {
        const currentLanguage = (req.query.lang ? req.query.lang : defaultLanguage).toString();
        const ref = await db.collection('bingo').get();
        const items = [];
        for (let index = 0; index < 4; index++) {
            items.push(ref.docs.splice(Math.random() * ref.docs.length, 1)[0].get('name')[currentLanguage]);
        }
        res.send(items);
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.getLocations = functionBuilder(async (req, res) => {
    try {
        const currentLanguage = (req.query.lang ? req.query.lang : defaultLanguage).toString();
        const ref = await db.collection('locations').get();
        const items = [];
        ref.docs.forEach(async (doc) => {
            const data = doc.data();
            data.name = data.name[currentLanguage];
            items.push(data);
        });
        res.send(items);
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.getNotification = functionBuilder(async (req, res) => {
    try {
        const currentLanguage = (req.query.lang ? req.query.lang : defaultLanguage).toString();
        const oldTime = req.query.messageTime;
        const ref = await db.collection(notificationsCollection).doc(notificationsUpdates).get();
        let result = undefined;
        if (ref?.updateTime && ref.updateTime.seconds > oldTime) {
            const text = ref.get('text');
            if (text) {
                result = text[currentLanguage];
            }
        }
        res.send({ time: ref.updateTime?.seconds, text: result });
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.getHighScore = functionBuilder(async (req, res) => {
    try {
        const token = req.headers.access_token;
        if (token) {
            const email = validateJwtToken(req.headers.access_token);
            const quiz = req.query.quiz;
            const userRef = await db.collection('users').doc(email);
            let score = (await userRef.get()).get(quiz + "HighScore");
            if (!score) {
                score = 0;
            }
            res.send({ score: score });
        }
        else {
            res.send();
        }
    }
    catch (error) {
        handleError(req, res, error);
        ;
    }
});
exports.setHighScore = functionBuilder(async (req, res) => {
    try {
        const email = validateJwtToken(req.headers.access_token);
        const quiz = req.query.quiz;
        const score = req.query.score;
        const userRef = await db.collection('users').doc(email);
        const data = {};
        data[`${quiz}HighScore`] = score;
        await userRef.update(data);
        res.send({ score: score });
    }
    catch (error) {
        handleError(req, res, error);
    }
});
exports.getUsersCount = functionBuilder(async (req, res) => {
    try {
        const count = (await db.collection(usersCollection).get()).docs.length;
        res.send(`<h1>${count}</h1>`);
    }
    catch (error) {
        handleError(req, res, error);
    }
});
// Deletes the authenticated user and all of their saved data: their comments on
// springs, their profile image in storage, and their user document (which holds
// favorites, history, high scores, profile and credentials).
exports.removeUser = functionBuilder(async (req, res) => {
    try {
        const email = validateJwtToken(req.headers.access_token);
        // 1. Remove the user's comments from every spring that contains them.
        const springsSnap = await db.collection(springsCollection).get();
        const commentUpdates = [];
        springsSnap.forEach(doc => {
            const comments = doc.get('comments');
            if (Array.isArray(comments) && comments.some((c) => c.email === email)) {
                const remaining = comments.filter((c) => c.email !== email);
                commentUpdates.push(doc.ref.update({ comments: remaining }));
            }
        });
        await Promise.all(commentUpdates);
        // 2. Delete the profile image (best-effort; users on the default picture have none).
        try {
            await app_1.default.storage().ref(`users/${email}/profile`).delete();
        }
        catch (storageErr) {
            functions.logger.warn(`No profile image to delete for ${email}`, storageErr);
        }
        // 3. Delete the user document itself.
        await db.collection(usersCollection).doc(email).delete();
        res.send({ data: "User removed successfully" });
    }
    catch (error) {
        handleError(req, res, error);
    }
});
const handleError = (req, res, err) => {
    functions.logger.error({ request: req.query }, err);
    res.status(500).send(err);
};
const setSpringsQuery = async (filters) => {
    const springsRef = await db.collection("springs");
    let springsQuery = undefined;
    if (filters) {
        if (filters.camping) {
            springsQuery = (springsQuery ? springsQuery : springsRef).where('filterCamping', '==', true);
        }
        if (filters.water) {
            springsQuery = (springsQuery ? springsQuery : springsRef).where('filterWater', '==', true);
        }
        if (filters.children) {
            springsQuery = (springsQuery ? springsQuery : springsRef).where('filterChildren', '==', true);
        }
        if (filters.car) {
            springsQuery = (springsQuery ? springsQuery : springsRef).where('filterCar', '==', true);
        }
        if (filters.depth) {
            springsQuery = (springsQuery ? springsQuery : springsRef).where('filterDepth', '==', true);
        }
        if (filters.distance) {
            functions.logger.debug("distance filter: " + filters.distance);
            return await calculateRadius(springsQuery ? springsQuery : springsRef, filters.distance * 1000, [filters.location.latitude, filters.location.longitude]);
            // const range = getGeohashRange(filters.location.latitude, filters.location.longitude, filters.distance);
            // springsQuery = (springsQuery ? springsQuery : springsRef).where('geohash', '>=', range.lower).where('geohash', '<=', range.upper);
        }
    }
    return (springsQuery ? springsQuery : springsRef).get();
};
const setHotelsQuery = async (filters, language) => {
    const hotelsRef = await db.collection(hotelsCollection);
    let hotelsQuery = undefined;
    if (filters) {
        // if (filters.maxPrice) {
        //     hotelsQuery = (hotelsQuery ? hotelsQuery : hotelsRef).where('price', '<=', filters.maxPrice);
        // }
        // if (filters.minPrice) {
        //     hotelsQuery = (hotelsQuery ? hotelsQuery : hotelsRef).where('price', '>=', filters.minPrice);
        // }
        if (filters.pool) {
            hotelsQuery = (hotelsQuery ? hotelsQuery : hotelsRef).where('pool', '==', true);
        }
        if (filters.breakfast) {
            hotelsQuery = (hotelsQuery ? hotelsQuery : hotelsRef).where('breakfast', '==', true);
        }
        if (filters.regions && filters.regions.length) {
            hotelsQuery = (hotelsQuery ? hotelsQuery : hotelsRef).where('region.' + language, 'in', filters.regions);
        }
    }
    return (hotelsQuery ? hotelsQuery : hotelsRef).get();
};
// const getGeohashRange = (
//     latitude: number,
//     longitude: number,
//     distance: number // miles
// ) => {
//     const lat = 0.004009009009009; // degrees latitude per mile
//     const lon = 0.0066382978723404; // degrees longitude per mile
//     // const lon = 0.0089830310543384; // degrees longitude per mile
//     const lowerLat = latitude - lat * distance;
//     const lowerLon = longitude - lon * distance;
//     const upperLat = latitude + lat * distance;
//     const upperLon = longitude + lon * distance;
//     const lower = geohash.encode(lowerLat, lowerLon);
//     const upper = geohash.encode(upperLat, upperLon);
//     return { lower, upper };
// };
const addHotelSearchResult = async (hotelsRef, today) => {
    const currentDate = today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear();
    const viewsRef = await hotelsRef.collection(searchResultsCollection).doc(currentDate);
    const viewsDoc = await viewsRef.get();
    if (!viewsDoc.exists) {
        await viewsRef.set({ times: [] });
    }
    await viewsRef.update({
        times: admin.firestore.FieldValue.arrayUnion(today)
    });
};
const addHotelView = async (hotelsRef) => {
    const today = new Date();
    const currentDate = today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear();
    const viewsRef = await hotelsRef.collection(viewsCollection).doc(currentDate);
    const viewsDoc = await viewsRef.get();
    if (!viewsDoc.exists) {
        await viewsRef.set({ times: [] });
    }
    await viewsRef.update({
        times: admin.firestore.FieldValue.arrayUnion(today)
    });
};
const calculateRadius = async (query, radius, center) => {
    const bounds = geofire.geohashQueryBounds([center[0], center[1]], radius);
    const promises = [];
    for (const b of bounds) {
        const q = query
            .orderBy('geohash')
            .startAt(b[0])
            .endAt(b[1]);
        promises.push(q.get());
    }
    const matchingDocs = [];
    await Promise.all(promises).then((snapshots) => {
        for (const snap of snapshots) {
            for (const doc of snap.docs) {
                const loc = doc.get('location');
                const lat = loc.latitude;
                const lng = loc.longitude;
                // We have to filter out a few false positives due to GeoHash
                // accuracy, but most will match
                const distanceInKm = geofire.distanceBetween([lat, lng], [center[0], center[1]]);
                const distanceInM = distanceInKm * 1000;
                if (distanceInM <= radius) {
                    matchingDocs.push(doc);
                }
            }
        }
    });
    return matchingDocs;
};
const updateField = (field, language) => {
    return field ? field[language] : undefined;
};
const generateRandomString = (length = 5) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};
const getHash = (txt) => {
    const shasam = crypto.createHash('sha1');
    shasam.update(txt);
    return shasam.digest("base64");
};
const geti18n = (lang) => {
    let body = i18n.find(l => l.lan === lang)?.body;
    if (!body) {
        body = i18n.find(l => l.lan === defaultLanguage)?.body;
    }
    return body;
};
const creatJwtToken = (email) => {
    return jwt.sign(email, jwtSecret);
};
const validateJwtToken = (token) => {
    return jwt.verify(token, jwtSecret);
};
const springNameToSearch = (springName) => {
    springName = springName.trim();
    let tmp = "";
    for (const letter of springName) {
        if (letter === "/") {
            tmp += "\\";
        }
        else if (letter !== `'` && letter !== `"`) {
            tmp += letter;
        }
    }
    return tmp;
};
const i18n = [
    {
        lan: "en",
        body: {
            "resetPasswordSubject": "Password reset",
            "resetPasswordText": "Please insert the following code in the app. If you didn't tried to reset your password ignore this message",
            "emailVerificationSubject": "email address verification",
            "emailVerificationText": "Click here to reset your password"
        }
    },
    {
        lan: "iw",
        body: {
            "resetPasswordSubject": "איפוס סיסמא",
            "resetPasswordText": "אנא הזינו את הקוד הבא באפליקציה. אם לא ניסיתם לאפס את הסיסמא התעלמו מהודעה זו",
            "emailVerificationSubject": "אימות כתובת אמייל",
            "emailVerificationText": "לחצו כאן כדי לאמת את כתובת המייל"
        }
    }
];
const thirdParties = [
    { name: "facebook", url: "https://graph.facebook.com/me?fields=email,name,picture&access_token=" },
    { name: "google", url: "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" }
];
//# sourceMappingURL=index.js.map