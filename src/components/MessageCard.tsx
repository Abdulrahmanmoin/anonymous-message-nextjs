import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "./ui/button"
import { Trash } from "lucide-react"
import { MessageInterface } from "@/models/user.model"
import axios from "axios"
import { toast } from "@/hooks/use-toast"

type MessageCardProps = {
  message: MessageInterface,
  onMessageDelete: (messageId: string) => void
}

export default function MessageCard({ message, onMessageDelete }: MessageCardProps) {

  const handleDeleteConfirm = async () => {
    const response = await axios.delete(`/api/delete-message/${message._id}`)

    toast({
      title: response.data?.message,
    })

    onMessageDelete(message._id as string)    
  }

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center space-x-7">
        <CardTitle className="break-all">{message.content}</CardTitle>

        {/* alert dialog box */}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive"> <Trash className="w-5 h-5" /> </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete this message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </CardHeader>
      <CardContent>
      </CardContent>

    </Card>

  )
}
