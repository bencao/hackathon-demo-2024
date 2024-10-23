"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import {
  Heart,
  Image as ImageIcon,
  MessageCircle,
  Repeat,
  Share,
  X,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function Component() {
  const [tweetContent, setTweetContent] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock data for tweets
  const [tweets, setTweets] = useState([
    {
      id: 1,
      author: "John Doe",
      handle: "@johndoe",
      content: "Just finished a great coding session! #webdev #reactjs",
      likes: 15,
      retweets: 5,
      comments: 3,
    },
    {
      id: 2,
      author: "Jane Smith",
      handle: "@janesmith",
      content:
        "Excited to announce my new project! Stay tuned for more details. 🚀",
      likes: 32,
      retweets: 12,
      comments: 8,
    },
    {
      id: 3,
      author: "Dev Guru",
      handle: "@devguru",
      content:
        "Top 5 VS Code extensions every developer should have:\n\n1. ESLint\n2. Prettier\n3. GitLens\n4. Live Server\n5. Code Spell Checker\n\nWhat are your must-have extensions? #coding #vscode",
      likes: 78,
      retweets: 25,
      comments: 14,
    },
  ])

  // Mock data for ads
  const [ads, setAds] = useState([
    {
      id: 1,
      title: "Lovely Dog in the Cup",
      description: "Couldn't get enough dogs",
      image: "https://placedog.net/480/480?id=12",
    },
    {
      id: 2,
      title: "Twin Dogs",
      description: "Hi dogs",
      image: "https://placedog.net/480/480?id=2",
    },
  ])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleTweet = async () => {
    // Here you would typically send the tweet content and file to your backend
    console.log("Tweet content:", tweetContent)
    console.log("Selected file:", selectedFile)

    const formData = new FormData()

    formData.append("tweet", tweetContent)
    formData.append("image", selectedFile)

    const res = await fetch("/api/post-tweet", {
      method: "POST",
      body: formData,
    })

    const result = await res.json()

    if (result.success) {
      setTweets(
        [
          {
            id: Date.now(),
            author: "Story Mover",
            handle: "@storyMover",
            content: tweetContent,
            image: `/api/file?fileName=${result.imageFileName}`,
            likes: 0,
            retweets: 0,
            comments: 0,
          },
        ].concat(tweets)
      )

      // prepend ad
      setAds(
        [
          {
            id: Date.now(),
            title: tweetContent,
            description: tweetContent,
            image: `/api/file?fileName=${result.adFileName}`,
          },
        ].concat(ads)
      )
    }

    // Reset the form
    setTweetContent("")
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto px-4 py-8 flex">
        <div className="w-2/3 pr-8">
          <div className="bg-card rounded-lg shadow-md p-4 mb-8">
            <Textarea
              className="w-full mb-4"
              placeholder="What's happening?"
              value={tweetContent}
              onChange={(e) => setTweetContent(e.target.value)}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Add Image
                </Button>
                {selectedFile && (
                  <div className="flex items-center bg-muted px-2 py-1 rounded-md">
                    <span className="text-sm mr-2">{selectedFile.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              <Button onClick={handleTweet}>Tweet</Button>
            </div>
          </div>
          <div className="space-y-6">
            {tweets.map((tweet) => (
              <motion.div
                initial={{ opacity: "0%" }}
                animate={{ opacity: "100%" }}
                transition={{ duration: 2 }}
                key={tweet.id}
                className="bg-card rounded-lg shadow-md p-4"
              >
                <div className="flex items-center mb-2">
                  <Avatar className="mr-2">
                    <AvatarImage
                      src={`/placeholder.svg?height=40&width=40&text=${tweet.author.charAt(
                        0
                      )}`}
                    />
                    <AvatarFallback>{tweet.author.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{tweet.author}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tweet.handle}
                    </p>
                  </div>
                </div>
                <p className="mb-4 whitespace-pre-wrap">{tweet.content}</p>
                {tweet.image && (
                  <div className="mb-4">
                    <img
                      src={tweet.image}
                      alt="Tweet image"
                      className="w-full h-auto rounded-lg object-cover"
                      style={{ maxHeight: "400px" }}
                    />
                  </div>
                )}
                <div className="flex justify-between text-muted-foreground">
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="mr-1 h-4 w-4" />
                    {tweet.comments}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Repeat className="mr-1 h-4 w-4" />
                    {tweet.retweets}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Heart className="mr-1 h-4 w-4" />
                    {tweet.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="w-1/3">
          <div className="bg-card rounded-lg shadow-md p-4 mb-8">
            <h2 className="text-xl font-semibold mb-4">Who to follow</h2>
            <div className="space-y-4">
              {["Alice", "Bob"].map((name) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="mr-2">
                      <AvatarImage
                        src={`/placeholder.svg?height=40&width=40&text=${name.charAt(
                          0
                        )}`}
                      />
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{name}</h3>
                      <p className="text-sm text-muted-foreground">
                        @{name.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <Button size="sm">Follow</Button>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            {ads.map((ad) => (
              <motion.div
                initial={{ opacity: "0%" }}
                animate={{ opacity: "100%" }}
                transition={{ duration: 2 }}
                key={ad.id}
                className="bg-card rounded-lg shadow-md p-4"
              >
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-64 object-cover rounded-md mb-2"
                />
                <Button variant="outline" size="sm" className="w-full">
                  Learn More
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
