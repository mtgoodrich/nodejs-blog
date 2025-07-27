const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

/**
 * GET /
 * HOME
 */
router.get("/", async (req, res) => {
    try {
        const locals = {
            title: "NodeJs Blog",
            description: "Simple Blog Created with NodeJS and MongoDB",
        };

        let perPage = 10;
        let page = req.query.page || 1;

        const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count / perPage);

        res.render("index", {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: "/",
        });
    } catch (error) {
        console.log(error);
    }
});

/**
 * GET /
 * Post :id
 */
router.get("/post/:id", async (req, res) => {
    try {
        let slug = req.params.id;
        const data = await Post.findById({ _id: slug });

        const locals = {
            title: data.title,
            description: `${data.title}: ${data.body}`,
        };
        res.render("post", { locals, data, currentRoute: `/post/${slug}` });
    } catch (error) {
        console.log(error);
    }
});

/**
 * POST /
 * Post - searchTerm
 */
router.post("/search", async (req, res) => {
    try {
        const locals = {
            title: "Search",
            description: "Simple Blog created with NodeJs, Express & MongoDB",
        };

        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const data = await Post.find({
            $or: [
                {
                    title: {
                        $regex: new RegExp(searchNoSpecialChar, "i"),
                    },
                },
                {
                    body: {
                        $regex: new RegExp(searchNoSpecialChar, "i"),
                    },
                },
            ],
        });
        res.render("search", { locals, data, searchNoSpecialChar });
    } catch (error) {
        console.log(error);
    }
});

router.get("/search", (req, res) => {
    res.render("search");
});

router.get("/about", (req, res) => {
    res.render("about", {
        currentRoute: "/about",
    });
});

router.get("/contact", (req, res) => {
    res.render("contact", {
        currentRoute: "/contact",
    });
});

module.exports = router;

// router.post("/search", async (req, res) => {
//     try {
//     const locals = {
//         title: "NodeJs Blog",
//         description: "Simple Blog created with NodeJs, Express & MongoDB"
//     }
//         const data = await Post.find();
//         res.render("post", { locals, data });
//     } catch (error) {
//         console.log(error);
//     }
// });

// Initial seed for DB
// function insertPostData() {
//     Post.insertMany([
//         {
//             title: "Async Programming with Node.js",
//             body: "Asyncronous Programming with Node.js: Explore the asyncronous nature of Node.js",
//         },
//         {
//             title: "NodeJs Limiting Network Traffic",
//             body: "Learn how to limit network traffic",
//         },
//         {
//             title: "Learn Morgan - HTTP Request logger for NodeJs",
//             body: "Learn Morgan",
//         },
//     ]);
// }
// insertPostData();
