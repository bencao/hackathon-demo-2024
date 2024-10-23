import fs from "fs"
import path from "path"
import { Storage } from "@google-cloud/storage"
import vision from "@google-cloud/vision"
import formidable from "formidable"

const productSearchClient = new vision.ProductSearchClient()
const imageAnnotatorClient = new vision.ImageAnnotatorClient()

const PROJECT_ID = "nth-champion-439420-m6"
const LOCATION = "us-west1"
const PROJECT_SET_ID = "product_set0"

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parser
  },
}

async function retrieveImage(productId, referenceImageId) {
  const formattedName = productSearchClient.referenceImagePath(
    PROJECT_ID,
    LOCATION,
    productId,
    referenceImageId
  )

  const request = {
    name: formattedName,
  }

  const response = await productSearchClient.getReferenceImage(request)
  return response
}

async function searchProduct(filePath) {
  const productCategory = "apparel-v2"

  const productSetPath = productSearchClient.productSetPath(
    PROJECT_ID,
    LOCATION,
    PROJECT_SET_ID
  )

  const content = fs.readFileSync(filePath, "base64")
  const request = {
    image: { content: content },
    features: [{ type: "PRODUCT_SEARCH" }],
    imageContext: {
      productSearchParams: {
        productSet: productSetPath,
        productCategories: [productCategory],
      },
    },
  }
  const [response] = await imageAnnotatorClient.batchAnnotateImages({
    requests: [request],
  })

  const results = response["responses"][0]["productSearchResults"]["results"]

  return results
}

// Creates a client
const storage = new Storage()

async function downloadFile(bucketName, bucketFilePath, localFileName) {
  const filePath = path.resolve(".", localFileName)
  const options = {
    destination: filePath,
  }

  // Downloads the file
  await storage.bucket(bucketName).file(bucketFilePath).download(options)

  console.log(`gs://${bucketName}/${bucketFilePath} downloaded to ${filePath}.`)
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const form = formidable({})

    try {
      const [fields, files] = await form.parse(req)

      console.log("got files upload", fields, files)

      if (!files.image) {
        res.status(200).json({
          success: true,
          imageFileName: null,
          adFileName: null,
        })
      }

      console.log("files", files)

      const file = files.image[0] // Assuming the file input name is 'file'

      const matchingProducts = await searchProduct(file.filepath)

      if (matchingProducts.length > 0) {
        const firstProduct = matchingProducts[0]

        const parts = firstProduct.image.split("/")
        const productId = parts[5]
        const referenceImageId = parts[7]

        const imageData = await retrieveImage(productId, referenceImageId)

        const uri = imageData[0].uri
        const uriParts = uri.replace("gs://", "").split("/")
        const bucketName = uriParts[0]
        const bucketPath = uriParts.slice(1).join("/")
        const adLocalFileName = uriParts.slice(1).join("_")

        await downloadFile(bucketName, bucketPath, adLocalFileName)

        res.status(200).json({
          success: true,
          imageFileName: file.filepath,
          adFileName: adLocalFileName,
        })
      } else {
        res.status(200).json({
          success: false,
          message: "no matching ads",
        })
      }

      res.status(200).json({ message: "File uploaded successfully" })
    } catch (postErr) {
      return res.status(500).json({ error: postErr.message })
    }
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
