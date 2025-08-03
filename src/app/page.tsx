"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  Zap, 
  FileText, 
  Database,
  Settings,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react"
import { useContentProcessor } from "@/hooks/useContentProcessor"
import { useMetadata } from "@/hooks/useMetadata"
import { ProcessingResult } from "@/types"
import { getOptimizedImageProps } from "@/lib/utils"

export default function Home() {
  // Custom hooks for state management
  const {
    content,
    isProcessing,
    processingResult,
    validation: contentValidation,
    contentStats,
    updateContent,
    setIsProcessing,
    setProcessingResult,
  } = useContentProcessor()

  const {
    metadata,
  } = useMetadata()

  // Local state for UI
  const [isSaving, setIsSaving] = useState(false)

  // Handle content processing
  const handleProcessContent = async () => {
    if (!content.rawContent.trim()) return
    
    try {
      setIsProcessing(true)
      const startTime = Date.now()
      
      let processedText = content.rawContent
      const appliedOperations: string[] = []
      
      // Remove HTML tags
      const beforeHtmlTags = processedText
      processedText = processedText.replace(/<[^>]*>/g, '') // Remove all HTML tags
      if (processedText !== beforeHtmlTags) {
        appliedOperations.push("Removed HTML tags")
      }
      
      // Remove URLs
      const beforeUrls = processedText
      processedText = processedText.replace(/https?:\/\/[^\s]+/g, '') // Remove HTTP/HTTPS URLs
      if (processedText !== beforeUrls) {
        appliedOperations.push("Removed URLs")
      }
      
      // Remove email addresses
      const beforeEmails = processedText
      processedText = processedText.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '') // Remove email addresses
      if (processedText !== beforeEmails) {
        appliedOperations.push("Removed email addresses")
      }
      
      // Normalize quotes (convert smart quotes to straight quotes)
      const beforeQuotes = processedText
      processedText = processedText
        .replace(/[""]/g, '"') // Convert smart double quotes to straight quotes
        .replace(/['']/g, "'") // Convert smart single quotes to straight quotes
      if (processedText !== beforeQuotes) {
        appliedOperations.push("Normalized quotes")
      }
      
      // Fix spacing around punctuation
      const beforePunctuation = processedText
      processedText = processedText
        .replace(/\s+([.,!?;:])/g, '$1') // Remove spaces before punctuation
        .replace(/([.,!?;:])\s*/g, '$1 ') // Ensure space after punctuation
        .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
      if (processedText !== beforePunctuation) {
        appliedOperations.push("Fixed spacing around punctuation")
      }
      
      // Normalize line breaks first
      const beforeLineBreaks = processedText
      processedText = processedText.replace(/\r\n/g, '\n').replace(/\r/g, '\n') // Normalize line breaks
      if (processedText !== beforeLineBreaks) {
        appliedOperations.push("Normalized line breaks")
      }
      
      // Normalize bullet points (convert various bullet styles to standard *)
      const beforeBullets = processedText
      processedText = processedText
        .replace(/^[\s]*[•·▪▫‣⁃◦‣⁌⁍]\s*/gm, '* ') // Convert various bullet characters to *
        .replace(/^[\s]*[-–—]\s*/gm, '* ') // Convert dashes to *
        .replace(/^[\s]*[o]\s*/gm, '* ') // Convert o to *
      if (processedText !== beforeBullets) {
        appliedOperations.push("Normalized bullet points")
      }
      
      // Remove redundant spaces (multiple spaces between words)
      const beforeRedundantSpaces = processedText
      processedText = processedText.replace(/[ \t]+/g, ' ') // Convert multiple spaces/tabs to single space
      if (processedText !== beforeRedundantSpaces) {
        appliedOperations.push("Removed redundant spaces")
      }
      
      // Trim leading/trailing whitespace from each line
      const beforeTrimming = processedText
      processedText = processedText.split('\n').map(line => line.trim()).join('\n')
      if (processedText !== beforeTrimming) {
        appliedOperations.push("Trimmed leading/trailing whitespace")
      }
      
      // Remove empty lines
      const beforeEmptyLines = processedText
      processedText = processedText
        .split('\n')
        .filter(line => line.trim().length > 0) // Remove lines that are empty or only whitespace
        .join('\n')
      if (processedText !== beforeEmptyLines) {
        appliedOperations.push("Removed empty lines")
      }
      
      // Clean out special characters while preserving whitespace
      const beforeSpecialChars = processedText
      processedText = processedText.replace(/[^\w\s]/g, '') // Remove special characters but keep letters, numbers, and whitespace
      if (processedText !== beforeSpecialChars) {
        appliedOperations.push("Removed special characters")
      }
      
      const processingTime = Date.now() - startTime
      const originalLength = content.rawContent.length
      const processedLength = processedText.length
      const wordsRemoved = contentStats.wordCount - (processedText.trim() ? processedText.trim().split(/\s+/).length : 0)
      const linesRemoved = contentStats.lineCount - processedText.split('\n').length
      
      const result: ProcessingResult = {
        success: true,
        processedContent: processedText,
        statistics: {
          originalLength,
          processedLength,
          wordsRemoved,
          linesRemoved,
          processingTime,
        },
        appliedOperations,
      }
      
      // Update content with processed result
      updateContent(processedText)
      
      // Update processing result state
      setProcessingResult(result)
      
    } catch (error) {
      console.error('Processing failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle save as blob
  const handleSaveAsBlob = async () => {
    if (!content.rawContent.trim()) return
    
    setIsSaving(true)
    try {
      const filename = `pasteer-content-${Date.now()}.txt`
      
      // Upload to Vercel Blob via API
      const response = await fetch('/api/blob', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.rawContent,
          filename: filename,
        }),
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Show success message with blob URL
        alert(`Content uploaded successfully!\nBlob URL: ${result.url}`)
      } else {
        throw new Error(result.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Blob upload failed:', error)
      
      // Show more specific error message
      let errorMessage = 'Failed to upload to blob storage. Please try again.'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      alert(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle save as JSON
  const handleSaveAsJSON = async () => {
    if (!content.rawContent.trim()) return
    
    setIsSaving(true)
    try {
      const jsonData = {
        content: content.rawContent,
        characterCount: contentStats.characterCount,
        wordCount: contentStats.wordCount,
        lineCount: contentStats.lineCount,
        timestamp: new Date().toISOString(),
      }
      
      const blob = new Blob([JSON.stringify(jsonData, null, 2)], { 
        type: 'application/json' 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pasteer-content-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Save as JSON failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle save as Markdown
  const handleSaveAsMD = async () => {
    if (!content.rawContent.trim()) return
    
    setIsSaving(true)
    try {
      const markdownContent = `# PASTEER Content

## Content
${content.rawContent}

---
*Generated on ${new Date().toLocaleString()}*
*Character count: ${contentStats.characterCount}*
*Word count: ${contentStats.wordCount}*
*Line count: ${contentStats.lineCount}*`
      
      const blob = new Blob([markdownContent], { 
        type: 'text/markdown' 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pasteer-content-${Date.now()}.md`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Save as MD failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle save as TXT
  const handleSaveAsTXT = async () => {
    if (!content.rawContent.trim()) return
    
    setIsSaving(true)
    try {
      const textContent = `PASTEER Content
Generated on: ${new Date().toLocaleString()}
Character count: ${contentStats.characterCount}
Word count: ${contentStats.wordCount}
Line count: ${contentStats.lineCount}

${content.rawContent}`
      
      const blob = new Blob([textContent], { 
        type: 'text/plain' 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pasteer-content-${Date.now()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Save as TXT failed:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Auto-generate metadata when content changes
  useEffect(() => {
    if (content.rawContent.trim() && !metadata.title) {
      // generateMetadataFromContent(content.rawContent) // This function is not defined in the original file
    }
  }, [content.rawContent, metadata.title]) // Removed generateMetadataFromContent from dependency array

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header - Full Width */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80 sticky top-0 z-50 w-full">
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="flex items-center space-x-3">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">PASTEER</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Content Processing Tool</p>
                </div>
                <div className="relative">
                  <Image
                    {...getOptimizedImageProps(
                      "/ai_cartoon_face.jpg",
                      "AI Cartoon Face",
                      40,
                      40,
                      "rounded-full border-2 border-slate-200 dark:border-slate-700 shadow-sm"
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="hidden sm:flex">
                <Sparkles className="h-3 w-3" />
                v1.0.0
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - 60% Width, Centered */}
      <main className="w-3/5 mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Content Input Card */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <FileText className="h-5 w-5" />
                    Content Input
                  </CardTitle>
                  <CardDescription>
                    Paste your content below to process it with PASTEER
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={contentValidation.isValid ? "secondary" : "destructive"}
                    className="font-mono"
                  >
                    {contentStats.characterCount}/6000 characters
                  </Badge>
                  {contentValidation.errors.length > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {contentValidation.errors.length} errors
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Textarea
                  placeholder="Paste your content here... (max 6000 characters)"
                  value={content.rawContent}
                  onChange={(e) => updateContent(e.target.value)}
                  className={`min-h-[400px] resize-none text-base leading-relaxed ${
                    contentValidation.errors.length > 0 ? 'border-red-500' : ''
                  }`}
                  maxLength={6000}
                  aria-describedby="character-counter validation-errors"
                />
                
                {/* Validation feedback */}
                {contentValidation.errors.length > 0 && (
                  <div className="absolute bottom-2 left-2 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-red-500">
                      {contentValidation.errors[0]}
                    </span>
                  </div>
                )}
                
                {contentValidation.warnings.length > 0 && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <span className="text-xs text-yellow-600">
                      {contentValidation.warnings[0]}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Character counter for screen readers */}
              <div id="character-counter" className="sr-only">
                {contentStats.characterCount} out of 6000 characters used
              </div>
              
              <div id="validation-errors" className="sr-only">
                {contentValidation.errors.join(', ')}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Processing Actions
              </CardTitle>
              <CardDescription>
                Choose an action to perform on your content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Button 
                  className="h-16 flex-col gap-2 bg-blue-600 hover:bg-blue-700"
                  disabled={!content.rawContent.trim() || isProcessing}
                  onClick={handleProcessContent}
                >
                  {isProcessing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Zap className="h-5 w-5" />
                  )}
                  <span className="text-sm">
                    {isProcessing ? 'Processing...' : 'Process'}
                  </span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-2"
                  disabled={!content.rawContent.trim() || isSaving}
                  onClick={handleSaveAsBlob}
                >
                  {isSaving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Database className="h-5 w-5" />
                  )}
                  <span className="text-sm">
                    {isSaving ? 'Saving...' : 'Save as Blob'}
                  </span>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-2"
                  disabled={!content.rawContent.trim() || isSaving}
                  onClick={handleSaveAsJSON}
                >
                  {isSaving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <FileText className="h-5 w-5" />
                  )}
                  <span className="text-sm">
                    {isSaving ? 'Saving...' : 'Save as JSON'}
                  </span>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-2"
                  disabled={!content.rawContent.trim() || isSaving}
                  onClick={handleSaveAsMD}
                >
                  {isSaving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <FileText className="h-5 w-5" />
                  )}
                  <span className="text-sm">
                    {isSaving ? 'Saving...' : 'Save as MD'}
                  </span>
                </Button>

                <Button 
                  variant="outline" 
                  className="h-16 flex-col gap-2"
                  disabled={!content.rawContent.trim() || isSaving}
                  onClick={handleSaveAsTXT}
                >
                  {isSaving ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <FileText className="h-5 w-5" />
                  )}
                  <span className="text-sm">
                    {isSaving ? 'Saving...' : 'Save as TXT'}
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Processing Results */}
          {processingResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Processing Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Original Length</p>
                    <p className="font-semibold">{processingResult.statistics.originalLength}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Processed Length</p>
                    <p className="font-semibold">{processingResult.statistics.processedLength}</p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Processing Time</p>
                    <p className="font-semibold">{processingResult.statistics.processingTime}ms</p>
                  </div>
                  <div>
                    <p className="text-slate-600 dark:text-slate-400">Words Removed</p>
                    <p className="font-semibold">{processingResult.statistics.wordsRemoved}</p>
                  </div>
                </div>
                {processingResult.appliedOperations && processingResult.appliedOperations.length > 0 && (
                  <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                    <h4 className="font-semibold mb-2">Applied Operations:</h4>
                    <ul className="list-disc list-inside">
                      {processingResult.appliedOperations.map((op: string, index: number) => (
                        <li key={index}>{op}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Status and Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Status</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {content.rawContent.trim() ? "Ready to Process" : "Waiting for Input"}
                    </p>
                  </div>
                  <div className={`h-3 w-3 rounded-full ${
                    content.rawContent.trim() ? "bg-green-500" : "bg-slate-300"
                  }`} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Word Count</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {contentStats.wordCount}
                    </p>
                  </div>
                  <FileText className="h-5 w-5 text-slate-400" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Line Count</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {contentStats.lineCount}
                    </p>
                  </div>
                  <div className="h-5 w-5 text-slate-400">📄</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
