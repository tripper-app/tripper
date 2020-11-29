"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavorites = exports.removeFavorite = exports.addFavorite = exports.addComment = exports.updateProfile = exports.changePassword = exports.resetPasswordRecieveCode = exports.resetPasswordCreateCode = exports.verifyEmail = exports.signup = exports.loginWithThirdParty = exports.login = exports.getSpring = exports.getAllSprings = void 0;
global.XMLHttpRequest = require("xhr2");
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const geohash = require("ngeohash");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const https = require("https");
const firebase = require("firebase/app");
require("firebase/storage");
const tripperEmail = require("./credentials/email");
const jwtSecret = require("./credentials/jwtSecret");
const firebaseConfigFile = require("./credentials/firebaseConfig");
const firebaseConfig = {
    apiKey: firebaseConfigFile.apiKey,
    authDomain: firebaseConfigFile.authDomain,
    databaseURL: firebaseConfigFile.databaseURL,
    projectId: firebaseConfigFile.projectId,
    storageBucket: firebaseConfigFile.storageBucket,
    messagingSenderId: firebaseConfigFile.messagingSenderId,
    appId: firebaseConfigFile.appId,
    measurementId: firebaseConfigFile.measurementId
};
firebase.default.initializeApp(firebaseConfig);
admin.initializeApp();
const db = admin.firestore();
//const SecretJWT = "springsSecret";
const region = "europe-west1";
const runtimeOpts = {
    timeoutSeconds: 60,
    memory: '128MB'
};
const defaultLanguage = 'iw';
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: tripperEmail.user,
        pass: tripperEmail.password
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
exports.getAllSprings = functionBuilder(async (req, res) => {
    try {
        const springsDocs = await setQuery(req.body.filters);
        const springs = [];
        springsDocs.forEach(doc => {
            const fields = doc.data();
            const newSpring = { location: fields.location, ID: doc.id };
            springs.push(newSpring);
        });
        res.send(springs);
    }
    catch (error) {
        functions.logger.error(error);
        res.status(500).send(error);
    }
});
exports.getSpring = functionBuilder(async (req, res) => {
    try {
        const spring = await db
            .collection("springs")
            .doc(req.query.springId)
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
        }
        res.send(data);
    }
    catch (error) {
        functions.logger.error(error, { structuredData: true });
        res.status(500).send(error);
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
            if (user.size) {
                const data = user.docs[0].data();
                if (data.pendingVerification) {
                    res.status(407).send("email is not verified");
                }
                else {
                    res.send({ token: creatJwtToken(data.email) });
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
        functions.logger.error(error);
        res.status(500).send(error);
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
                    const doc = await db.collection('users').doc(data.email).get();
                    if (!doc.exists) {
                        await doc.ref.set({
                            email: data.email,
                            password: 'logged with third party',
                            nick: data.name,
                            pendingVerification: false,
                            profile: data.picture.data.url
                        });
                    }
                    res.send({ token: creatJwtToken(data.email) });
                });
            }).end();
        }
        else {
            throw new Error("can't find this third party");
        }
    }
    catch (error) {
        functions.logger.error(error);
        res.status(500).send(error);
    }
});
exports.signup = functionBuilder(async (req, res) => {
    try {
        if (req.body.email && req.body.password) {
            if ((await db.collection('users').doc(req.body.email).get()).exists) {
                res.status(409).send("this email is already registered");
            }
            else {
                const email = req.body.email;
                const data = {
                    email: email,
                    password: getHash(req.body.password),
                    nick: req.body.nick ? req.body.nick : email.slice(0, email.indexOf('@')),
                    pendingVerification: true
                };
                await db.collection('users').doc(email).set(data);
                const i18nBody = geti18n((req.query.lang ? req.query.lang : defaultLanguage).toString());
                mailOptions.to = req.body.email;
                mailOptions.subject = i18nBody ? i18nBody.emailVerificationSubject : "";
                mailOptions.html = `<a style="cursor: pointer" href="https://europe-west1-tripper-d0e21.cloudfunctions.net/verifyEmail?email=${req.body.email}">
                                        <button style="cursor: pointer; background-color: rgba(103, 105, 252, 0.884); font-size:25px; border-radius:0%;">
                                            ${i18nBody === null || i18nBody === void 0 ? void 0 : i18nBody.emailVerificationText}
                                        </button>
                                    </a>`;
                mailOptions.text = "https://europe-west1-tripper-d0e21.cloudfunctions.net/verifyEmail?email=" + req.body.email;
                await transporter.sendMail(mailOptions);
                res.send(data);
            }
        }
        else {
            res.status(400).send("email and password required");
        }
    }
    catch (error) {
        functions.logger.error(error);
        res.status(500).send(error);
    }
});
exports.verifyEmail = functionBuilder(async (req, res) => {
    try {
        const userRef = await db.collection('users').doc(req.query.email);
        if ((await userRef.get()).exists) {
            await userRef.update({ "pendingVerification": false });
            res.send("Email verified");
        }
        else {
            res.status(400).send("can't find this email address");
        }
    }
    catch (error) {
        functions.logger.error(error);
        res.status(500).send(error);
    }
});
exports.resetPasswordCreateCode = functionBuilder(async (req, res) => {
    try {
        const generatedCode = generateRandomString();
        const email = req.query.email;
        if (!(await db.collection('users').doc(email).get()).exists) {
            res.status(401).send("can't find this email");
        }
        else {
            await db.collection('users').doc(email).update({ resetPasswordCode: generatedCode });
            const i18nBody = geti18n((req.query.lang ? req.query.lang : defaultLanguage).toString());
            mailOptions.to = email;
            mailOptions.subject = i18nBody ? i18nBody.resetPasswordSubject : "";
            mailOptions.html = `<div>${i18nBody === null || i18nBody === void 0 ? void 0 : i18nBody.resetPasswordText}<h1>${generatedCode}</h1></div>`;
            const mailRes = await transporter.sendMail(mailOptions);
            res.send(mailRes);
        }
    }
    catch (error) {
        functions.logger.error(error);
        res.status(500).send(error);
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
        functions.logger.error(error);
        res.status(500).send(error);
    }
});
exports.changePassword = functionBuilder(async (req, res) => {
    try {
        const email = validateJwtToken(req.headers.access_token);
        const newPassword = req.body.newPassword;
        if (newPassword) {
            await await db.collection('users').doc(email).update({
                "password": getHash(newPassword)
            });
            res.send();
        }
        else {
            res.status(400).send("please provide old and new passwords");
        }
    }
    catch (error) {
        functions.logger.error(error);
        res.status(500).send(error);
    }
});
exports.updateProfile = functionBuilder(async (req, res) => {
    try {
        const email = validateJwtToken(req.headers.token);
        const storageRef = firebase.default.storage().ref();
        const imageRef = storageRef.child(`users/${email}/profile`);
        const blob = Buffer.from(req.body.imageString, "base64");
        imageRef.put(blob, {
            contentType: "image/jpeg"
        }).then(async (snap) => {
            res.send({ imageUrl: await snap.ref.getDownloadURL() });
        }).catch(err => {
            throw err;
        });
    }
    catch (error) {
        functions.logger.error(error);
        res.status(500).send(error);
    }
});
exports.addComment = functionBuilder(async (req, res) => {
    try {
        const email = validateJwtToken(req.headers.token);
        const comment = {
            text: req.body.text,
            date: new Date,
            nick: "",
            profile: "",
            email: email
        };
        const userRef = await db.collection('users').doc(email);
        const springRef = await db.collection('springs').doc(req.body.springId);
        const userData = await userRef.get();
        if (userData.exists) {
            const user = userData.data();
            comment.nick = user ? user.nick : undefined;
            comment.profile = user ? user.profile : undefined;
            const result = await springRef.update({
                comments: admin.firestore.FieldValue.arrayUnion(comment)
            });
            res.send(result);
        }
        else {
            throw new Error("user does not exist");
        }
    }
    catch (error) {
        functions.logger.error(error);
        res.status(500).send(error);
    }
});
exports.addFavorite = functionBuilder(async (req, res) => {
    try {
        const email = validateJwtToken(req.headers.token);
        const springId = req.body.springId;
        const newFavorite = {
            springId: springId
        };
        const userRef = await db.collection('users').doc(email);
        await userRef.update({
            favorites: admin.firestore.FieldValue.arrayUnion(newFavorite)
        });
        res.send();
    }
    catch (error) {
        functions.logger.error(error);
        res.status(500).send(error);
    }
});
exports.removeFavorite = functionBuilder(async (req, res) => {
    try {
        const email = validateJwtToken(req.headers.token);
        const springId = req.body.springId;
        const newFavorite = {
            springId: springId
        };
        const userRef = await db.collection('users').doc(email);
        await userRef.update({
            favorites: admin.firestore.FieldValue.arrayRemove(newFavorite)
        });
        res.send();
    }
    catch (error) {
        functions.logger.error(error);
        res.status(500).send(error);
    }
});
exports.getFavorites = functionBuilder(async (req, res) => {
    try {
        const email = validateJwtToken(req.headers.token);
        const user = await db.collection('users').doc(email).get();
        const favorites = user.get('favorites');
        res.send(favorites);
    }
    catch (error) {
        functions.logger.error(error);
        res.status(500).send(error);
    }
});
// remove
// export const checkJWT = functions.runWith(runtimeOpts).https.onRequest(async (req, res) => {
//     try {
//         res.send(validateJwtToken(req.headers.token as string));
//     } catch (error) {
//         functions.logger.error(error, { structuredData: true });
//         res.status(500).send(error);
//     }
// })
const setQuery = async (filters) => {
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
            const range = getGeohashRange(filters.location.latitude, filters.location.longitude, filters.distance);
            springsQuery = (springsQuery ? springsQuery : springsRef).where('geohash', '>=', range.lower).where('geohash', '<=', range.upper);
        }
    }
    return (springsQuery ? springsQuery : springsRef).get();
};
const getGeohashRange = (latitude, longitude, distance // miles
) => {
    const lat = 0.009009009009009; // degrees latitude per mile
    const lon = 0.0106382978723404; // degrees longitude per mile
    // const lon = 0.0089830310543384; // degrees longitude per mile
    const lowerLat = latitude - lat * distance;
    const lowerLon = longitude - lon * distance;
    const upperLat = latitude + lat * distance;
    const upperLon = longitude + lon * distance;
    const lower = geohash.encode(lowerLat, lowerLon);
    const upper = geohash.encode(upperLat, upperLon);
    return { lower, upper };
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
    var _a, _b;
    let body = (_a = i18n.find(l => l.lan === lang)) === null || _a === void 0 ? void 0 : _a.body;
    if (!body) {
        body = (_b = i18n.find(l => l.lan === defaultLanguage)) === null || _b === void 0 ? void 0 : _b.body;
    }
    return body;
};
const creatJwtToken = (email) => {
    return jwt.sign(email, jwtSecret.secret);
};
const validateJwtToken = (token) => {
    return jwt.verify(token, jwtSecret.secret);
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