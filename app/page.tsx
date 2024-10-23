"use client"

import { useRef, useState } from "react"
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
      title: "Learn React",
      description: "Master React in 30 days!",
      imageUrl: "https://placecats.com/200/100",
    },
    {
      id: 2,
      title: "Web Dev Conference",
      description: "Join the biggest web dev event of the year!",
      imageUrl: "https://placecats.com/200/100",
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

  const handleTweet = () => {
    // Here you would typically send the tweet content and file to your backend
    console.log("Tweet content:", tweetContent)
    console.log("Selected file:", selectedFile)
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
              <div key={tweet.id} className="bg-card rounded-lg shadow-md p-4">
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
                <p className="mb-4">{tweet.content}</p>
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
              </div>
            ))}
          </div>
        </div>
        <div className="w-1/3">
          <div className="bg-card rounded-lg shadow-md p-4 mb-8">
            <h2 className="text-xl font-semibold mb-4">Who to follow</h2>
            <div className="space-y-4">
              {["Alice", "Bob", "Charlie"].map((name) => (
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
              <div key={ad.id} className="bg-card rounded-lg shadow-md p-4">
                <img
                  src={ad.imageUrl}
                  alt={ad.title}
                  className="w-full h-32 object-cover rounded-md mb-2"
                />
                <h3 className="font-semibold mb-1">{ad.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {ad.description}
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
