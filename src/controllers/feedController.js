const { Tag, Post, User, Like } = require("../models");
const followService = require("../services/followService");
const postService = require("../services/postService");
const { Op } = require("sequelize");

exports.fetchUserPostIncludeFollowing = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const followingId = await followService.getFollowingAndFollowerByUserId(
            req.user.id
        );

        const posts = await Post.findAll({
            where: {
                [Op.or]: [{ userId: followingId }, { userId: userId }],
            },
            include: User,
        });
        res.json(posts);
    } catch (err) {
        next(err);
    }
};

exports.fetchtrend = async (req, res, next) => {
    try {
        const post = await Tag.findAll({
            order: [["tagCount", "DESC"]],
            limit: 15,
        });
        res.json(post);
    } catch (err) {
        next(err);
    }
};

exports.fetchUserSuggest = async (req, res, next) => {
    try {
        const users = await User.findAll({
            include: [
                {
                    model: Follow,
                    as: "Follower",
                },
            ],
            order: [["Follower", "followerUserId", "DESC"]],
            limit: 5,
        });

        res.json(users);
    } catch (err) {
        next(err);
    }
};

exports.search = async (req, res, next) => {
    try {
        const inputSearch = req.query.searchinput;
        const search = await User.findAll({
            where: {
                username: { [Op.like]: "%" + inputSearch + "%" },
            },
        });

        res.json(search);
    } catch (err) {
        next(err);
    }
};

exports.fetchPostsByTagId = async (req, res, next) => {
    try {
        const posts = await postService.fetchPostsByTagId(req.params.tagId);
        const result = posts.filter((post) => post.PostToTags.length);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};
