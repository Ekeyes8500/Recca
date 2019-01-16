const router = require("express").Router();
const userController = require("../../controllers/userController");

//route for creating user
router.route("/create")
.post(userController.create);

//route for finding user by id
router.route("/find")
.get(userController.findUser);

//route for finding user by username
router.route("/find/name")
.get(userController.userByName);

//route for friend requests
router.route("/friend")
.get(userController.pendingRequest)
.post(userController.newFriendRequest)
.put(userController.handleFriendRequest);


router.route("/feed/")
.get(userController.getFeed);

router.route("/getFeedItems/")
.get(userController.getFeedItems);
module.exports = router;