"use client"

import React, { useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { messageSchema } from '@/schemas/messageSchema'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useCompletion } from 'ai/react';
// import { useCompletion } from '@ai-sdk/react';


interface SendMessagePageProps {
  params:
  { username: string }
}

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

export default function SendMessage(props: SendMessagePageProps) {
  const username = props?.params.username
  const { toast } = useToast()

  const initialMessageString = "What's your favorite movie?||Do you have any pets?||What's your dream job?";

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
  });

  const [isLoading, setIsLoading] = useState(false)


  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  })

  const messageContent = form.watch('content');

  async function onSubmit(data: z.infer<typeof messageSchema>) {

    setIsLoading(true)

    try {
      await axios.post<ApiResponse>("/api/send-messages",
        {
          content: data.content,
          username
        }
      )

      toast({
        title: "Message Sended Successfully",
      })
    } catch (error) {
      console.error("Error while sending Message: ", error)
      const axiosError = error as AxiosError<ApiResponse>

      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch message settings.",
        variant: "destructive"
      })
    } finally {
      form.setValue("content", "")
      setIsLoading(false)
    }
  }

  const fetchSuggestedMessages = async () => {
    try {
      complete('');
    } catch (error) {
      console.error("Error while fetching suggested Messages: ", error)
      const axiosError = error as AxiosError<ApiResponse>

      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch suggested messages.",
        variant: "destructive"
      })
      // Handle error appropriately
    }
  };


  const handleMessageClick = (message: string) => {
    form.setValue("content", message)
  }

  return (
    <div className='mt-16 '>
      <div className='flex flex-col justify-center items-center gap-y-4'>
        <h1 className='text-4xl font-bold'>Public Profile Link</h1>
        <div className='container mx-auto my-2 p-6 bg-white rounded max-w-4xl'>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-5'
            >
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className='mx-2 '>
                    <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                    <FormControl >
                      <Textarea
                        placeholder="Type your anonymous message here."
                        className='resize-none border-[1px] border-slate-500 focus:border-0 min-h-[40px]'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='text-center'>
                {
                  isLoading
                    ?
                    <Button
                      disabled
                      type="submit"
                    >
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Please wait
                    </Button>
                    :
                    <Button
                      disabled={isLoading || !messageContent}
                      type="submit"
                    >
                      Send Message
                    </Button>
                }
              </div>
            </form>
          </Form>
        </div>

        <div className='container mx-auto my-2 p-6 max-w-4xl space-y-5'>
          <Button
            type="button"
            onClick={fetchSuggestedMessages}
            disabled={isSuggestLoading}
          >
            Suggest More Messages
          </Button>

          <p className='text-sm'>Click on any message below to select it.</p>

          <div>
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">Messages</h3>
              </CardHeader>
              <CardContent className="flex flex-col space-y-4">
                {error ? (
                  <div className="text-red-500">
                    <p>Error: {error.message}</p>
                    <p className="text-sm mt-2">
                      Common fixes:
                      <br />
                      1. Check network connection
                      <br />
                      2. Refresh the page
                      <br />
                      3. Try simpler questions
                    </p>
                  </div>
                ) : (
                  parseStringMessages(completion).map((message, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="mb-2"
                      onClick={() => handleMessageClick(message)}
                    >
                      {message}
                    </Button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

        </div>

      </div>
    </div>
  )
}