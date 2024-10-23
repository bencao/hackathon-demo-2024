import fs from "fs"
import path from "path"

export default async function handler(req, res) {
  const { fileName } = req.query

  if (fileName) {
    let filePath = fileName

    // resolve path if filename is not a path
    if (fileName.indexOf("/") === -1) {
      filePath = path.resolve(".", fileName)
    }

    const imageBuffer = fs.readFileSync(filePath)

    res.setHeader("Content-Type", "image/jpg")
    res.send(imageBuffer)
  } else {
    res.status(400).json({
      success: false,
      message: "missing fileName parameter",
    })
  }
}
