(async () => {
    const express = require("express");
    const connectDB = require('./database');
    const cookieParser = require('cookie-parser');

    const {ObjectId} = require('mongodb');
    const nunjucks = require("nunjucks");

    const app = express();

    const db = await connectDB();
    const usersCollection = db.collection('users');
    const clubsCollection = db.collection('clubs');
    const messagesCollection = db.collection('messages');

    const env = nunjucks.configure("views", {express: app});

    env.addFilter('formatTime', (date) => {
        return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    });

    app.use(express.urlencoded({extended: true}));
    app.use(express.static("./public"));
    app.use(cookieParser());

    app.set("view engine", "njk");

    app.get("/app", async function (req, res) {
        if (req.cookies.userId) {
            const userId = new ObjectId(req.cookies.userId);
            const user = await usersCollection.findOne({_id: userId});
            const clubs = await clubsCollection.find({membersIds: userId}).toArray();
            const messages = clubs[0] ? await messagesCollection.find({clubId: new ObjectId(clubs[0]._id)}).toArray() : [];

            res.render("app/app.html", {user, clubs, messages});
        } else {
            res.redirect('/login');
        }
    });

    app.get(["/", "/index"], function (req, res) {
        if (req.cookies.userId) res.redirect("/app");
        else res.render("index.html");
    });

    app.get("/login", function (req, res) {
        res.render("auth/login.html");
    });

    app.get("/signup", function (req, res) {
        res.render("auth/signup.html");
    });

    app.post('/messages', async (req, res) => {
        if (req.cookies.userId) {
            try {
                const clubId = new ObjectId(req.body.clubId);
                const messages = await messagesCollection.find({clubId: clubId}).toArray();
                res.json(messages);
            } catch (err) {
                res.status(500).send("Internal Server Error");
            }
        }
    });

    app.post('/signup', async (req, res) => {
        try {
            const user = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                clubIds: []
            };
            await usersCollection.insertOne(user);

            res.cookie('userId', user._id.toString(), {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production'
            });

            res.redirect('/app');
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    });

    app.post('/create-club', async (req, res) => {
        if (req.cookies.userId) {
            try {
                const categories = req.body.categories ?? [];
                const club = {
                    clubName: req.body.clubName,
                    clubDescription: req.body.clubDescription,
                    categories: Array.isArray(categories) ? categories : categories.split(','),
                    membersIds: [new ObjectId(req.cookies.userId)],
                };
                await clubsCollection.insertOne(club);
                res.redirect('/app');
            } catch (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            }
        }
    });

    app.post('/send-message', async (req, res) => {
        if (req.cookies.userId) {
            try {
                const {clubId, content} = req.body;

                const newMessage = {
                    clubId: new ObjectId(clubId),
                    senderId: new ObjectId(req.cookies.userId),
                    content,
                    timestamp: new Date()
                };

                await messagesCollection.insertOne(newMessage);

                res.sendStatus(204).end();
            } catch (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            }
        }
    });

    app.post('/leave-club', async (req, res) => {
        if (req.cookies.userId) {
            try {
                const userId = new ObjectId(req.cookies.userId);
                const clubId = new ObjectId(req.body.clubId);

                await clubsCollection.updateOne({_id: clubId}, {$pull: {membersIds: userId}});

                res.sendStatus(204).end();
            } catch (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            }
        }
    });

    app.post('/login', async (req, res) => {
        const {username, password} = req.body;
        const user = await db.collection('users').findOne({username, password});
        if (!user) return res.status(401).send('Invalid username or password');
        try {
            res.cookie('userId', user._id.toString(), {
                httpOnly: true,
                maxAge: 30 * 24 * 60 * 60 * 1000,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production'
            });
            res.redirect('/app');
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    app.get('/logout', (req, res) => {
        res.clearCookie('userId', {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
        });

        res.status(204).end();
    });

    app.listen(3000, function () {
        console.log("Listening on port 3000...");
    });
})();