const express = require('express')
const router = express.Router();
const multer = require('multer')
const path12 = require('path')
const { ensureAuth } = require('../middleware/auth.js')
const Video = require('../model/video.js');
const { route } = require('./index.js');
const moment = require('moment');
const video = require('../model/video.js');
const fs = require('fs')

// here it is multer code to accept image and letter store them into database 
const storage = multer.diskStorage({
    destination: './public/videos',
    filename: function (req, file, cb) {
        cb(null, 'Video' + Date.now() + path12.extname(file.originalname))
    }
});
const videoUpload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(flv|mp4)$/)) {
            return cb(new Error('File does not match with specified extention.'))
        }
        cb(undefined, true)
    }
})

router.get('/', ensureAuth, async (req, res) => {
    let vData = await Video.find({ user: req.user._id })
    res.render('video/all_video', {
        vData: vData,
        moment: moment,
    })
})

router.get('/individual/video/:id', async (req, res) => {
    try {
        const vData=await video.findOne({_id:req.params.id})
        const filePath = `./public/videos/${vData.video}`
        const range = req.headers.range;
        const stat = fs.statSync(filePath)
        const fileSize = stat.size
        if (range) {
            const parts = range.replace(/bytes=/, "").split('-');
            const start = parseInt(parts[0])
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunksize = (end - start) + 1
            const file = fs.createReadStream(filePath, { start, end })
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            }
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            }
            res.writeHead(200, head)
            fs.createReadStream(filePath).pipe(res)
        }
    } catch (error) {
        console.log(error);
    }
})

// getting request for individual video
router.get('/individual/:id', ensureAuth, async (req, res) => {
    try {
        const vData = await video.findOne({ _id: req.params.id })
        const aData = await video.aggregate([{
            $lookup: {
                from: 'users',
                localField: 'user',
                foreignField: '_id',
                as: "user_info",
            },
        },
        {
            $unwind: '$user_info'
        }
        ])
        res.render("video/individual", {
            vData: vData,
            aData: aData,
            moment: moment,
        })
    } catch (error) {
        console.log(error)
    }
})

// post the single video
router.post('/up', ensureAuth, videoUpload.single('myVideo'), async (req, res) => {
    try {
        let size = req.file.size;
        size = Math.round(size / 1000000).toFixed(2);
        const nData = await Video.create({
            vname: req.body.vname,
            video: req.file.filename,
            user: req.user._id,
            size: size + 'MB',
        })
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error);
    }
})

// get the video route

router.get('/upload', ensureAuth, (req, res) => {
    res.render("video/add");
})

module.exports = router