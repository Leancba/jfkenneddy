const Router = require('express');
const router = Router();
const {getAllNotices, putNotice, postNotice, deleteNotice} = require("../handlers/notice.handlers")


router.get("/", getAllNotices);

router.put("/:id", putNotice);

router.post("/", postNotice);

router.delete("/:id", deleteNotice);






module.exports = router